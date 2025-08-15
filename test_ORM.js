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

const Platform = require('./app/models/Platform')
const Platform_Array = require('./app/models/Platform_Array')
const Samples = require('./app/models/Samples')
const Sample_Array = require('./app/models/Sample_Array')
const Series = require('./app/models/Series')
const Series_Samples = require('./app/models/Series_Samples')

const platformModel = new Platform(db);
const platform_ArrayModel = new Platform_Array(db);
const samplesModel = new Samples(db);
const sample_ArrayModel = new Sample_Array(db);
const seriesModel = new Series(db);
const series_SamplesModel = new Series_Samples(db);

(async () => {
    try{
        //Create
        
        await platformModel.createOne({
            platform_ID: 'GPL777',
            title: 'ORM test',
            organism: 'Homo studentus',
            technology: 'VSCode',
            created_at: '2025-03-03',
            updated_at: '2025-04-04'
        });
        console.log("Platform GPL777 created");
        const test_existence = await platformModel.readOne('GPL777');
        console.log("platform:", test_existence);

        // Read
        const search_zebrafish = await platformModel.search({organism: "Danio rerio"});
        console.log("zebrafish:", search_zebrafish);

        //update
        await platformModel.updateOne({
            platform_ID: 'GPL777',
            title: 'update test',
            organism: 'Homo studentus',
            technology: 'VSCode',
            created_at: '2025-03-03',
            updated_at: '2025-07-29',
        });
        console.log("updated title of GPL777");
        const verify_update = await platformModel.readOne("GPL777");
        console.log("update results:", verify_update);
        
        //delete
        await platformModel.deleteOne("GPL777");
        console.log("GPL777 deleted")
        console.log('crud test finished');

        // test relationships
        // get Array for a platform
        const test_platform_array = await platformModel.getArrays('GPL100');
        console.log("arrays:", test_platform_array);

        // get samples of the platform
        const test_platform_samples = await platformModel.getSamples('GPL200');
        console.log("samples:", test_platform_samples);

        // get platform(s) for a sample
        const test_samples_platform = await samplesModel.getPlatform('GSM5004');
        console.log("platforms:", test_samples_platform);

        // get expressions for a sample
        const test_samples_expression = await samplesModel.getExpression('GSM5004');
        console.log("Expression:", test_samples_expression);

        //get series of a sample
        const test_samples_series = await samplesModel.getSeries('GSM5004');
        console.log("Series:", test_samples_series);

        //get full info on a sample
        const test_samples_full = await samplesModel.getFullInfo('GSM5004');
        console.log("Full Info:", test_samples_full);

        // get samples for a series
        const test_series_samples = await seriesModel.getSamples('GSE1001');
        console.log("samples:", test_series_samples);

        console.log('relationship test finished');

    }catch (err){
        console.error("something went wrong:", err.message, err.stack)
    }
    process.exit(0);
})();//this syntax is insane...feels like mixing java and python