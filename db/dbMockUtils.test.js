const utils = require('./dbMockUtils');

describe('db utils module tests', ()=>{

    test('Should return *unique* string value', ()=>{
        const result = utils.getUniqueID();
        expect(result).toBeTruthy();
    })

});