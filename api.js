import axios from 'axios';

const api = axios.create({baseurl: 'http://localhost:8282'});

// once again the standard crud functions
// get all
export const fetchAll = (entity, params = {}) => api.get(`/${entity}s`, {params});

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
export const getSeriesOfSample = (sampleId) => api.get(`/sample/${sampleId}/series`);

// get all info for a sample (experimental)
export const getFullInfoOfSample = (sampleId) => api.get(`/sample/${sampleId}/full`);

// get all samples of a series
export const getSamplesOfSeries = (sampleId) => api.get(`/series/${seriesId}/samples`);

export default api;
