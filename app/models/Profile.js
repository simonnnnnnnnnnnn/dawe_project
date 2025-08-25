"use strict";

const Crud_Basics = require("./Crud_Basics");

class Profile extends Crud_Basics{
    get model(){
        return "profile";
    }

    // validation of inputs --> ensure corrent datatypes and so on
    // crud functions can be concentrated in a parent class later on
    validate(record){
        if (!record.profile_ID || typeof record.profile_ID !== 'string'){
            throw new Error("profile_ID must be a non-empty string");
        }
        for (const field of ['dataset_ID', 'title', 'organism']){
            if (record[field] !== undefined && typeof record[field] !== 'string'){
                throw new Error(`${field} is not a string`);
            }
        }
        /*
        if (record.series_published !== undefined && !this._isvaliddate(record.series_published)){
            throw new Error("series_published must be a valid date-string");
        }
        
        for (const datefield of ['series_published']){
            if (record[datefield] !== undefined && !this._isvaliddate(record[datefield])){
                throw new Error(`${datefield} is not a valid date-string`);
            }
        }
        
        if (!record.sample_count || !Number.isInteger(record.sample_count)){
            throw new Error("sample_count must be a non-empty integer");
        }
        */
        return true;
    }

    _isvaliddate(value){
        return typeof value === 'string' && !isNaN(Date.parse(value));
    }


    // model the relationships
    // get samples corresponding to each series
    /*
    async getSamples(seriesID){
        const joins = await this.storage.search('series_samples', {series_ID: seriesID});
        const ids = joins.map(j => j.sample_ID);
        return Promise.all (ids.map(id => this.storage.readOne('samples', id)));
    }
    */
    // get all associated profiles
    async getProfileArrays(profileID){
        return this.storage.search('profile_array', {profile_ID: profileID});
    }
}

module.exports = Profile;