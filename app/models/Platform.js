"use strict";

const Crud_Basics = require("./Crud_Basics");

class Platform extends Crud_Basics{
    get model(){
        return "platform";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.platform_ID || typeof record.platform_ID !== 'string'){
            throw new Error("platform_ID must be a non-empty string");
        }
        for (const field of ['title', 'organism', 'technology', 'descript']){
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
    // get sample array(s)
    async getArrays(platformID){
        return this.storage.search('platform_array', {platform_ID: platformID});
    }

    // get samples
    async getSamples(platformID){
        return this.storage.search('samples', {platform_ID: platformID});
    }
}

module.exports = Platform;