"use strict";

const mysql = require('mysql2/promise');
const path = require('path')

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
            platform_array: 'gb_acc',
            samples: 'sample_ID',
            sample_array: 'id_ref',
            series: 'series_ID',
            series_samples: ['series_ID', 'sample_ID']
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
        const [rows] = await this.pool.execute(sql, params);
        return rows;
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
    async search(model, query = {}, order = null){
        const conditions = Object.keys(query).map(h => `${h} = ?`).join(' and ');
        const values = Object.values(query);
        let sql = `select * from ${model}`;
        if (conditions){
            sql += ` where ${conditions}`;
        }
        if (order){
            sql += ` order by ${order}`;
        }

        return this._all(sql, values); //here the all func is nice --> queries can absolutely return multiple rows
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
}

module.exports = StorageHandler;