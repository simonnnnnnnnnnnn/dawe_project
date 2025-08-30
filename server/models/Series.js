"use strict";

const Crud_Basics = require("./Crud_Basics");

class Series extends Crud_Basics{
    get model(){
        return "series";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.series_ID || typeof record.series_ID !== 'string'){
            throw new Error("series_ID must be a non-empty string");
        }
        for (const field of ['title', 'summary', 'overall_design', 'supplementary_data_link']){
            if (record[field] !== undefined && typeof record[field] !== 'string'){
                throw new Error(`${field} is not a string`);
            }
        }
        for (const datefield of ['created_at', 'updated_at']){
            if (record[datefield] !== undefined && !this._isvaliddate(record[datefield])){
                throw new Error(`${datefield} is not a valid date-string`);
            }
        }
        return true;
    }

    _isvaliddate(value){
        return typeof value === 'string' && !isNaN(Date.parse(value));
    }


    // model the relationships
    // get samples corresponding to each series
    async getSamples(seriesID){
        const joins = await this.storage.search('series_samples', {series_ID: seriesID});
        const ids = joins.map(j => j.sample_ID);
        return Promise.all (ids.map(id => this.storage.readOne('samples', id)));
    }
}

module.exports = Series;