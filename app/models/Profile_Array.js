"use strict";

const Crud_Basics = require("./Crud_Basics");

class Profile_Array extends Crud_Basics{
    get model(){
        return "profile_array";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.profile_array_ID || typeof record.profile_array_ID !== 'string'){
            throw new Error("profile_array_ID must be a non-empty string");
        }
        if (!record.profile_ID || typeof record.profile_ID !== 'string'){
            throw new Error("profile_ID must be a non-empty string");
        }
        for (const field of ['sample_ID', 'title']){
            if (record[field] !== undefined && typeof record[field] !== 'string'){
                throw new Error(`${field} is not a string`);
            }
        }
        for (const field of ['value_number', 'ranking']){
            if (record[field] !== undefined && !this._isNumber(record[field])){
                throw new Error(`${field} is not a (floating point) number`);
            }
        }
        return true;
    }


    // model the relationships
}

module.exports = Profile_Array;