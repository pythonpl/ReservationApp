const validate = require('./PaymentRequestSchema');

/** 
 * Tests of data incoming to a payment service. They should match the schema
 */
describe('Payment request schema validation', () => {

    test('Should accept properly defined input data', () => {
        const inputData = { userID: '_123456', reservationID: '_123456', token: 'paymenttoken' };

        const result = validate(inputData);

        expect(result).toBe(true);
    });


    test('Should reject for empty input data', () => {
        const inputData = {};

        const result = validate(inputData);

        expect(result).toBe(false);
    });


    test('Should reject for incomplete input data', () => {
        const inputData = { userID: '_123456', reservationID: '_123456' };

        const result = validate(inputData);

        expect(result).toBe(false);
    });
    

    test('Should reject for incomplete input data', () => {
        const inputData = { userID: '_123456', reservationID: '_123456', token : '' };

        const result = validate(inputData);

        expect(result).toBe(false);
    });


});
