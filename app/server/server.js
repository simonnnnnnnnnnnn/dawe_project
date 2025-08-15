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