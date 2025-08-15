"use strict";

const StorageHandler = require('./app/models/StorageHandler')

// use port 3307, internally mysql always wants to use 3306 for whatever reason
const db = new StorageHandler({
    host: 'localhost',
    user: 'dawe_usr',
    password: 'dawepass',
    database: 'geo_db',
    port: 3307
});

(async () => {

    //test reading function
    const row = await db.readOne('platform', 'GPL100');
    console.log("fetched row:", row)
    
    // test create
    await db.createOne('platform', {
        platform_ID: 'GPL999',
        title: 'test platform',
        organism: 'Homo ludens',
        technology: 'JavaScript',
        created_at: '2025-01-01',
        updated_at: '2025-02-02',
    });

    // test update
    const update = {
        platform_ID: 'GPL999',
        title: 'new title',
        technology: 'NodeJS',
        updated_at: '2025-07-25'
    };
    await db.updateOne('platform', update);

    // test search funciton
    const seeker = await db.search('platform', {organism: 'Homo ludens'});
    console.log('search results:', seeker);
    
    // test delete
    await db.deleteOne('platform', 'GPL999');
    console.log('test finished');
    process.exit(0);
})();//this syntax is insane...feels like mixing java and python
