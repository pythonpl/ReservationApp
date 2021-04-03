const validate = require('./PaymentGatewaySchema');

/** 
 * Tests of data passed to PaymentGateway. Should match schema
 */
describe('Payment charge request validation', ()=>{

    test('Should accept input data', () => {
        const inputData = { amount: 25, token: 'card_error' };

        const result = validate(inputData);

        expect(result).toBe(true);
    });

    test('Should reject incomplete input data', () => {
        const inputData = { amount: 25 };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject incomplete input data', () => {
        const inputData = { token: 'accepted' };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

    test('Should reject invalid token', () => {
        const inputData = { amount: 66, token: 1123, currency : 'PLN' };

        const result = validate(inputData);

        expect(result).toBe(false);
    });

});
