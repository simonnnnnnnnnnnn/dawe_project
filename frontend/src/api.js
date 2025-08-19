import axios from 'axios';

const api = axios.create({baseURL: 'http://localhost:8282'});

// Handle both plural routes for fetching lists and singular routes for individual operations
const getPluralRoute = (entity) => {
    const pluralMap = {
        platform: 'platforms',
        samples: 'samples',
        series: 'series',
        sample: 'samples'
    };
    return pluralMap[entity] || `${entity}s`;
};

// Get the correct route for singular operations (create, read one, update, delete)
const getSingularRoute = (entity) => {
    const singularMap = {
        platform: 'platform',
        samples: 'samples',  // Keep as samples since server uses /samples/:sample_ID
        series: 'series',
        sample: 'samples'    // Map sample to samples for singular operations
    };
    return singularMap[entity] || entity;
};

// Standard CRUD functions
// Get all --> uses plural routes
export const fetchAll = (entity, params = {}) => {
    const pluralRoute = getPluralRoute(entity);
    return api.get(`/${pluralRoute}`, {params});
};

// Get one --> uses singular routes
export const fetchOne = (entity, id) => {
    const singularRoute = getSingularRoute(entity);
    return api.get(`/${singularRoute}/${id}`);
};

// Create --> uses singular routes
export const createOne = (entity, data) => {
    const singularRoute = getSingularRoute(entity);
    
    // Handle JSON fields for MySQL
    const processedData = { ...data };
    if (entity === 'sample' && processedData.characteristics) {
        // Ensure characteristics is a string for MySQL JSON column
        if (typeof processedData.characteristics === 'object') {
            processedData.characteristics = JSON.stringify(processedData.characteristics);
        }
    }
    
    return api.post(`/${singularRoute}`, processedData);
};

// Update --> uses singular routes
export const updateOne = (entity, id, data) => {
    const singularRoute = getSingularRoute(entity);
    
    // Handle JSON fields for MySQL
    const processedData = { ...data };
    if (entity === 'sample' && processedData.characteristics) {
        // Ensure characteristics is a string for MySQL JSON column
        if (typeof processedData.characteristics === 'object') {
            processedData.characteristics = JSON.stringify(processedData.characteristics);
        }
    }
    
    return api.put(`/${singularRoute}/${id}`, processedData);
};

// Delete --> uses singular routes
export const deleteOne = (entity, id) => {
    const singularRoute = getSingularRoute(entity);
    return api.delete(`/${singularRoute}/${id}`);
};

// All the extra relationships remain the same
// get the array corresponding to the platform
export const getPlatformArray = (platformId) => api.get(`/platform/${platformId}/platform_array`);

// get the samples of a platform
export const getSamplesOfPlatform = (platformId) => api.get(`/platform/${platformId}/samples`);

// get the platform of a sample
export const getPlatformOfSample = (sampleId) => api.get(`/samples/${sampleId}/platform`);

// get expression array for a sample
export const getExpressionOfSample = (sampleId) => api.get(`/samples/${sampleId}/expression`);

// get series the sample is part of (can be multiple
export const getSeriesOfSample = (sampleId) => api.get(`/samples/${sampleId}/series`);

// get all info for a sample (experimental)
export const getFullInfoOfSample = (sampleId) => api.get(`/samples/${sampleId}/full`);

// get all samples of a series
export const getSamplesOfSeries = (seriesId) => api.get(`/series/${seriesId}/samples`);

export default api;