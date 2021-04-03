const validate = require('./ReservationRequestSchema');

/** 
 * Tests of data incoming to a reservation service. They should match the schema
 */
describe('Reservation request validation', () => {

    test('Should accept properly defined input data', () => {
        const inputData = { userID: '_123456', ticketID: ['_123456'] };

        const result = validate(inputData);

        expect(result).toBe(true);
    });

    test('Should accept properly defined input data', () => {
        const inputData = { userID: '_123456', ticketID: ['_123456', '_654321'] };

        const result = validate(inputData);

        expect(result).toBe(true);
    });

    test('Should reject for empty input data', () => {
        const inputData = {};

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for incomplete input data', () => {
        const inputData = { userID: '', ticketID: [] };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for incomplete input data', () => {
        const inputData = { ticketID: ['_123456'] };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for incomplete input data', () => {
        const inputData = { userID: '_123456' };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for missing ticketID data', () => {
        const inputData = { userID: '_123456', ticketID: [] };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for missing userID', () => {
        const inputData = { userID: '', ticketID: ['_123456'] };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject for not unique ticketID values', () => {
        const inputData = { userID: '_098212', ticketID: ['_123456', '_123456'] };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

});
