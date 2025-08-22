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

// some additions for handling the platform and samples arrays with the EntityForm
// Replace the existing updatePlatformArray and updateSamplesArray functions with these:

// Create or update platform array entries
export const createPlatformArrayEntry = (data) => {
    return api.post('/platform_array', data);
};

export const updatePlatformArrayEntry = (gbAcc, data) => {
    return api.put(`/platform_array/${gbAcc}`, data);
};

export const deletePlatformArrayEntry = (gbAcc) => {
    return api.delete(`/platform_array/${gbAcc}`);
};

// Create or update sample array entries  
export const createSampleArrayEntry = (data) => {
    return api.post('/sample_array', data);
};

export const updateSampleArrayEntry = (idRef, data) => {
    return api.put(`/sample_array/${idRef}`, data);
};

export const deleteSampleArrayEntry = (idRef) => {
    return api.delete(`/sample_array/${idRef}`);
};

// Helper function to manage all array entries for a platform/sample
export const syncPlatformArrayEntries = async (platformId, newEntries) => {
    try {
        // First, get existing entries for this platform
        const existingResponse = await api.get(`/platform/${platformId}/platform_array`);
        const existingEntries = existingResponse.data || [];
        
        // Create maps for easier comparison
        const existingMap = new Map(existingEntries.map(entry => [entry.gb_acc, entry]));
        const newMap = new Map(newEntries.map(entry => [entry.gb_acc, entry]));
        
        const results = [];
        
        // Update or create entries
        for (const [gbAcc, newEntry] of newMap) {
            if (existingMap.has(gbAcc)) {
                // Update existing entry
                results.push(await updatePlatformArrayEntry(gbAcc, newEntry));
            } else {
                // Create new entry
                results.push(await createPlatformArrayEntry(newEntry));
            }
        }
        
        // Delete entries that are no longer present
        for (const [gbAcc] of existingMap) {
            if (!newMap.has(gbAcc)) {
                results.push(await deletePlatformArrayEntry(gbAcc));
            }
        }
        
        return results;
    } catch (error) {
        console.error('Error syncing platform array entries:', error);
        throw error;
    }
};

export const syncSampleArrayEntries = async (sampleId, newEntries) => {
    try {
        // First, get existing entries for this sample
        const existingResponse = await api.get(`/samples/${sampleId}/expression`);
        const existingEntries = existingResponse.data || [];
        
        // Create maps for easier comparison
        const existingMap = new Map(existingEntries.map(entry => [entry.id_ref, entry]));
        const newMap = new Map(newEntries.map(entry => [entry.id_ref, entry]));
        
        const results = [];
        
        // Update or create entries
        for (const [idRef, newEntry] of newMap) {
            if (existingMap.has(idRef)) {
                // Update existing entry
                results.push(await updateSampleArrayEntry(idRef, newEntry));
            } else {
                // Create new entry
                results.push(await createSampleArrayEntry(newEntry));
            }
        }
        
        // Delete entries that are no longer present
        for (const [idRef] of existingMap) {
            if (!newMap.has(idRef)) {
                results.push(await deleteSampleArrayEntry(idRef));
            }
        }
        
        return results;
    } catch (error) {
        console.error('Error syncing sample array entries:', error);
        throw error;
    }
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