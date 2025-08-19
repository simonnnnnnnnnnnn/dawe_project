"use strict";

const express = require('express');
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

const app = express();

// CORS config
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // preflight handling
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        next();
    }
});


app.use(express.json());

const models = {
    platform: new Platform(db),
    platform_array: new Platform_Array(db),
    samples: new Samples(db),
    sample_array: new Sample_Array(db),
    series: new Series(db),
    series_samples: new Series_Samples(db),
};

// managing the plural forms was quite challenging so this is (hopefully) the fix for this
const pluralMap ={
    platform: 'platforms',
    samples: 'samples',
    series: 'series',
    platform_array: 'platform_arrays',
    sample_array: 'sample_arrays',
    series_samples: 'series_samples'
}


// in order to ot repeat myself endlessly the ordinary routes (so the ones necesaary for every table) are registeered with the help of another class

function crudRoutes(app, modelName, modelInstance){
    const pluralName = pluralMap[modelName] || `${modelName}s`;
    const basepath = `/${modelName}`;
    const pluralPath = `/${pluralName}`;
    const primaryKey = modelInstance.storage.primKeyMap[modelName];

    if (!primaryKey || Array.isArray(primaryKey)){
        console.warn(`skipping ${modelName}, no valid primary key`);
        return;
    }

    console.log(`setting up routes for ${modelName}: ${basepath} and ${pluralPath}`);

    // get one
    app.get(`${basepath}/:${primaryKey}`, async (req, res) => {
        try{
            const result = await modelInstance.readOne(req.params[primaryKey]);
            if (!result) return res.status(404).json({error: `${modelName} not found`});
            res.json(result);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // get a lot, yes that may not always be the best english...but it we are not in oxford here
    app.get(pluralPath, async (req, res) => {
        try{
            const {order, limit, offset, ...filters} = req.query;
            const parsedLimit = limit ? parseInt(limit, 10) : 10; //defaults 10 and 0
            const parsedOffset = offset ? parseInt(offset, 10) : 0;

            const [rows, total] = await Promise.all([
                modelInstance.search(filters, order || null, parsedLimit, parsedOffset),
                modelInstance.count(filters)
            ]);

            res.json({
                total,
                limit: parsedLimit,
                offset: parsedOffset,
                data: rows
            });
            //const results = await modelInstance.search(query, order || null);
            //res.json(results);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // create
    app.post(basepath, async (req, res) => {
        try{
            const result = await modelInstance.createOne(req.body);
            res.status(201).json(result);
        }catch(err){
            res.status(400).json({error: err.message});
        }
    });

    // update something
    app.put(`${basepath}/:${primaryKey}`, async (req, res) => {
        try{
            const record = {
                ...req.body,
                [primaryKey]: req.params[primaryKey]
            };
            const result = await modelInstance.updateOne(record);
            res.json(result);
        }catch(err){
            res.status(400).json({error: err.message});
        }
    });

    // finally the delete func
    app.delete(`${basepath}/:${primaryKey}`, async (req, res) => {
        try{
            const result = await modelInstance.deleteOne(req.params[primaryKey]);
            res.json(result);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });
}

for (const [name, instance] of Object.entries(models)){
    crudRoutes(app, name, instance);
}

// as most ORM classes have some unique relationships they need to be modeled separately...so thats waht is in this following section
// get the lpatform array (table) for a platform
app.get('/platform/:platform_ID/platform_array', async (req, res) => {
    try{
        const temp_platform = models.platform;
        const result = await temp_platform.getArrays(req.params.platform_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//get all samples corresponding to the platform --------------------------------------> problem
app.get('/platform/:platform_ID/samples', async (req,res) => {
    try{
        const temp_platform = models.platform;
        const result = await temp_platform.getSamples(req.params.platform_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

// get all platforms for a sample
app.get('/samples/:sample_ID/platform', async (req, res) => {
    try{
        const sample = models.samples;
        const result = await sample.getPlatform(req.params.sample_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// get expression array for a sample ------------------------------------------------------> problem
app.get('/samples/:sample_ID/expression', async (req,res) => {
    try{
        const temp_samples = models.samples;
        const result = await temp_samples.getExpression(req.params.sample_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// get series for the sample --> the series to which the sample belongs
app.get('/samples/:sample_ID/series', async (req, res) => {
    try{
        const temp_samples = models.samples;
        const result = await temp_samples.getSeries(req.params.sample_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// get full info on a sample
app.get('/samples/:sample_ID/full', async (req, res) => {
    try{
        const temp_samples = models.samples;
        const result = await temp_samples.getFullInfo(req.params.sample_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// get samples in a series
app.get('/series/:series_ID/samples', async (req, res) => {
    try{
        const temp_series = models.series;
        const result = await temp_series.getSamples(req.params.series_ID);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

app.get('/health', (req, res) => {
    res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// now the final part: define the port
app.listen(8282, () => console.log('server online on port 8282'));