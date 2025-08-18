import axios from 'axios';

const api = axios.create({baseURL: 'http://localhost:8282'});

// just like in the server, deal with the plurals
const getPluralRoute = (entity) => {
    const pluralMap = {
        platform: 'platforms',
        samples: 'samples',
        series: 'series',
        sample: 'samples'
    };
    return pluralMap[entity] || `${entity}s`;
};


// once again the standard crud functions
// get all --> now woth the plurals
export const fetchAll = (entity, params = {}) => {
    const pluralRoute = getPluralRoute(entity);
    return api.get(`/${pluralRoute}`, {params});
};
// get one
export const fetchOne = (entity, id) => api.get(`/${entity}/${id}`);

//create
export const createOne = (entity, data) => api.post(`/${entity}`, data);

//update
export const updateOne = (entity, id, data) => api.put(`/${entity}/${id}`, data);

// and finally delete
export const deleteOne = (entity, id) => api.delete(`/${entity}/${id}`);


// now all the extra relationships
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