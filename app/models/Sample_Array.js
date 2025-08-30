"use strict";

const Crud_Basics = require("./Crud_Basics");

class Sample_Array extends Crud_Basics{
    get model(){
        return "sample_array";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.internal_id || typeof record.internal_id !== 'string'){
            throw new Error("internal_id must be a non-empty string");
        }
        if (!record.id_ref || typeof record.id_ref !== 'string'){
            throw new Error("id_ref must be a non-empty string");
        }
        if (!record.sample_ID || typeof record.sample_ID !== 'string'){
            throw new Error("sample_ID must be a non-empty string");
        }
        if (!record.abs_call || typeof record.abs_call !== 'string' || record.abs_call.length !== 1){
            throw new Error("abs_call must be single character");
        }
        for (const field of ['value', 'detection_p_value']){
            if (record[field] !== undefined && !this._isNumber(record[field])){
                throw new Error(`${field} is not a (floating point) number`);
            }
        }
        return true;
    }

    _isNumber(n){
        return typeof n === 'number' && !Number.isNaN(n);
    }


    // model the relationships
}

module.exports = Sample_Array;