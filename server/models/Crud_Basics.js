"use strict";

class Crud_Basics{
    constructor(storageHandler){
        this.storage = storageHandler;
    }

    // this solves the problem that model must have a concrete value at runtime with each class needing a different value for it
    get model(){
        throw new Error("subclass MUST implement model getter");
    }

    // these functions all just call the storage handler so they can be concnetrated here
    async createOne(record){
        this.validate(record);
        return this.storage.createOne(this.model, record)
    }

    async readOne(id){
        return this.storage.readOne(this.model, id);
    }

    async search(query, order = null, limit = null, offset = null){
        return this.storage.search(this.model, query, order, limit, offset);
    }

    async updateOne(record){
        this.validate(record);
        return this.storage.updateOne(this.model, record);
    }

    async deleteOne(id){
        return this.storage.deleteOne(this.model, id);
    }

    async count(query = {}){
        return this.storage.count(this.model, query);
    }
}

module.exports = Crud_Basics;