/**
 * getUniqueID - is a unique values generator
 * The value should be kinda unique, and using below formula it probably will - we need to use this only for testing purposes.
 * Providing unique values for IDs is a job for a database. We are only mocking it. 
 */
exports.getUniqueID = function () {
    return '_' + Math.random().toString(36).substr(2, 6);
}