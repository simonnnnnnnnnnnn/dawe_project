"use strict";

const Crud_Basics = require("./Crud_Basics");

class Samples extends Crud_Basics{
    get model(){
        return "samples";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.sample_ID || typeof record.sample_ID !== 'string'){
            throw new Error("sample_ID must be a non-empty string");
        }
        if (!record.platform_ID || typeof record.platform_ID !== 'string'){
            throw new Error("platform_ID must be a non-empty string");
        }
        for (const field of ['title', 'source_name', 'organism', 'protocol']){
            if (record[field] !== undefined && typeof record[field] !== 'string'){
                throw new Error(`${field} is not a string`);
            }
        }
        if (record.characteristics !== undefined){
            if (typeof record.characteristics === 'string'){
                if (record.characteristics.trim() === ''){
                    recoord.characteristics = null;
                } else{
                    try{
                        const parsed = JSON.parse(record.characteristics);
                    } catch (e) {
                        throw new Error("characteristics must be a valid JSON string");
                    }

                }
            } else if (typeof record.characteristics === 'object' && record.characteristics !== null && Array.isArray(record.characteristics)){
                // if object  stringify for mySQL
                record.characteristics = JSON.stringify(record.characteristics);
            } else if (typeof record.characteristics !== null){
                throw new Error("characteristics must be a valid JSON object or string");
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
    //get the corresponding platform
    async getPlatform(sampleID){
        const sample = await this.readOne(sampleID);
        return this.storage.readOne('platform', sample.platform_ID);
    }

    // get expression values --> so the sample array
    async getExpression(sampleID){
        return this.storage.search('sample_array', {sample_ID: sampleID});
    }



    // get the corresponding series
    async getSeries(sampleID){
        const joins = await this.storage.search('series_samples', {sample_ID: sampleID});
        const ids = joins.map(j => j.series_ID);
        return Promise.all(ids.map(id => this.storage.readOne('series', id)));
    }

    // experimental composite fetch:
    async getFullInfo(sampleID){
        const sample = await this.readOne(sampleID);
        const platform = await this.getPlatform(sampleID);
        const expressions = await this.getExpression(sampleID);
        const series = await this.getSeries(sampleID);
        return {sample, platform, expressions, series};
    }
}

module.exports = Samples;