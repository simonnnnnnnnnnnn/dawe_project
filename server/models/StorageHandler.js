"use strict";

const mysql = require('mysql2/promise');
//const path = require('path');
//const { el } = require('vuetify/locale');

class StorageHandler{
    constructor({host, user, password, database, port}){
        this.pool = mysql.createPool({
            host, user, password, database, port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        this.primKeyMap = {
            platform: 'platform_ID',
            platform_array: 'internal_id',
            samples: 'sample_ID',
            sample_array: 'internal_id',
            series: 'series_ID',
            series_samples: ['series_ID', 'sample_ID'],
            dataset: 'dataset_ID',
            profile: 'profile_ID',
            profile_array: 'profile_array_ID'
        }
        this._testConnection();
        //this.my_db_file = path.resolve(my_db_file);
        //this.my_db = this._loadDb(this.my_db_file); // odd syntax for private methods
    }

    async _testConnection(){
        try{
            const connection = await this.pool.getConnection();
            console.log("connected to mysql DB");
            connection.release();
        } catch(err){
            console.error("connection to mysql failed", err)
        }
    }


    // little getter method
    async _get(sql, params = []){
        const [rows] = await this.pool.execute(sql, params);
        return rows[0] || null;
    }

    // when getting one row getting all of them is the next step i guess
    async _all(sql, params = []){

        if (!Array.isArray(params)) params = [params];

        console.debug('[StorageHandler] executing SQL:', sql);
        console.debug('[StorageHandler] with params:', params);

        try{
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        }catch(err){
            console.error('[StorageHandler] SQL execution failed:', { sql, params, error: err && err.message });
            throw err;
        }
        //const [rows] = await this.pool.execute(sql, params);
        //return rows;
    }

    // this might seem weird but comes in handy when deleting stuff --> when some sql is run but no return is expected
    async _run(sql, params = []){
        try{
            const [result] = await this.pool.execute(sql, params);
            const summary = {
                affectedRows: result.affectedRows,
                insertId: result.insertId,
            };
            console.log('sql execution worked:', sql);
            console.log('params:', params);
            console.log('resulting summary:', summary);
            return summary;
        }catch(err){
            console.error('sql failed:', sql);
            console.error('params:', params);
            console.error('error:', err);
            throw err;
        }
        /*
        const [result] = await this.pool.execute(sql, params);
        return {
            affectedRows: result.affectedRows,
            insertId: result.insertId,
        };*/
    }

    // ok now the actual methods

    // createOne
    async createOne(model, record){
        console.log("createOne called with:", model, record)
        const keys = Object.keys(record);
        const values = Object.values(record); //here the json object is read --> that defines what actually is created
        const stuff = keys.map(() => '?').join(', ');
        const sql = `insert into ${model} (${keys.join(', ')}) VALUES (${stuff})`; // why do i need the weird comma
        return this._run(sql, values);
        /*
        try{
            const result = await this._run(sql, values);
            console.log('createOne result:', result);
            return result;
        }catch(err){
            console.error('createOne failed:', err)
        }*/
    }

    // after creating comes reading...
    async readOne(model, id){
        const primKey = this.primKeyMap[model] || 'id';
        const query = `select * from ${model} where ${primKey} = ?`;
        return this._get(query, [id]); // get is a little method to make this all a bit easier...
    }

    // now the search function --> without this part the whole DB is useless
    // after all whats the point in saving data when u cant even access it..
    async search(model, query = {}, order = null, limit = null, offset = null){
        /*const { limit: qLimit, offset: qOffset, ...filters } = query;
        const conditions = Object.keys(query).map(h => `${h} = ?`).join(' and ');
        const values = Object.values(filters);
        let sql = `select * from ${model}`;
        if (conditions){
            sql += ` where ${conditions}`;
        }
        if (order){
            sql += ` order by ${order}`;
        }
        if (limit !== null && limit !== undefined){
            sql += ` limit ?`;
            values.push(parseInt(limit, 10));
        }
        if (offset !== null && offset !== undefined){
            sql += ` offset ?`;
            values.push(parseInt(offset, 10));
        }

        return this._all(sql, values); //here the all func is nice --> queries can absolutely return multiple rows*/

        const filters = { ...query };
        delete filters.limit;
        delete filters.offset;

        const conditionKeys = Object.keys(filters);
        const conditions = conditionKeys.map(h => `${h} = ?`).join(' and ');
        const values = conditionKeys.map(h => filters[h]);

        // basic sql
        let sql = `select * from ${model}`;
        if (conditions){
            sql += ` where ${conditions}`;
        }
        if (order){
            sql += ` order by ${order}`;
        }

        // validate limit offset manually as that seems to cause problems
        /*
        const hasLimit = limit !== null && limit !== undefined && limit !== '';
        const hasOffset = offset !== null && offset !== undefined && offset !== '';

        if (hasLimit){
            sql += `limit ?`;
            values.push(Number(limit));
            if (hasOffset){
                sql += ` offset ?`;
                values.push(Number(offset));
            }
        } else if (hasOffset){
            sql += ` limit ? offset ?`;
            values.push(Number(2 ** 8 -1)); // i doubt there will be more in this small data warehouse
            values.push(Number(offset));
        }
        */
       //alternate version
        if (limit !== null && limit !== undefined) {
            const safeLimit = Math.max(0, parseInt(limit, 10));
            sql += ` limit ${safeLimit}`;
            if (offset !== null && offset !== undefined) {
                const safeOffset = Math.max(0, parseInt(offset, 10));
                sql += ` offset ${safeOffset}`;
            }
        }

        // more dbugging
        console.debug('[StorageHandler] search SQL:', sql);
        console.debug('[StorageHandler] search Params:', values);

        // a last check
        const expectedPlaceholders = (sql.match(/\?/g) || []).length;
        if (expectedPlaceholders !== values.length){
            console.error('[StorageHandler] SQL placeholders and values mismatch:', {
                sql,
                expectedPlaceholders,
                actualValues: values.length, values
            });
            throw new Error(`SQL placeholders and values mismatch, expected ${expectedPlaceholders} but got ${values.length}`);
        }
        return this._all(sql, values);
    }

    // update
    async updateOne(model, record) {
        const primKey = this.primKeyMap[model] || 'id';
        const { [primKey]: pkval, ...fields } = record;//const { id, ...fields } = record;
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        const setstuff = keys.map(h => `${h} = ?`).join(', ');
        const sql = `update ${model} set ${setstuff} where ${primKey} = ?`;

        return this._run(sql, [...values, pkval]);//return this._run(sql, [...values, id]);

    }

    // delete
    async deleteOne(model, id){
        console.log('deleteOne calles with:', model, id)
        const primKey = this.primKeyMap[model] || 'id';
        const sql = `delete from ${model} where ${primKey} = ?`;
        return this._run(sql, [id]);
        /*
        try{
            const result = await this._run(sql, [id]);
            console.log('deleteOne result:', result);
            return result;
        }catch(err){
            console.error('deleteOne failed:', err)
        }*/
    }

    // counter for pagination
    async count(model, query = {}){

        const filters = { ...query };
        delete filters.limit;
        delete filters.offset;

        const conditions = Object.keys(filters).map(h => `${h} = ?`).join(' and ');
        const values = Object.values(filters);

        let sql = `select count(*) as total from ${model}`;
        if (conditions){
            sql += ` where ${conditions}`;
        }
        console.debug('[StorageHandler] count SQL:', sql, 'Params:', values);
        const rows = await this._all(sql, values);
        return rows && rows[0] ? Number(rows[0].total) : 0;
        /*
        const conditions = Object.keys(query).map(h => `${h} = ?`).join(' and ');
        const values = Object.values(query);
        let sql = `select count(*) as total from ${model}`;
        if (conditions){
            sql += ` where ${conditions}`;
        }
        const [rows] = await this.pool.execute(sql, values);
        return rows[0].total;*/
    }
}

module.exports = StorageHandler;