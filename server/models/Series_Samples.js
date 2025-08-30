"use strict";

const Crud_Basics = require("./Crud_Basics");

class Series_Samples extends Crud_Basics{
    get model(){
        return "series_samples";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.series_ID || typeof record.series_ID !== 'string'){
            throw new Error("series_ID must be a non-empty string");
        }
        if (!record.sample_ID || typeof record.sample_ID !== 'string'){
            throw new Error("sample_ID must be a non-empty string");
        }
    }


    // model the relationships
}

module.exports = Series_Samples;