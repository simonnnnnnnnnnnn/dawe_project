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

    async search(query, order = null){
        return this.storage.search(this.model, query, order, 10, 10); // set limit and offset to 10 as the default
    }

    async updateOne(record){
        this.validate(record);
        return this.storage.updateOne(this.model, record);
    }

    async deleteOne(id){
        return this.storage.deleteOne(this.model, id);
    }
}

module.exports = Crud_Basics;