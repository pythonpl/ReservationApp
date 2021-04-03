const PaymentGateway = require('./PaymentGateway');
const ERRORS = require('../utils/commonErrors')


describe('Payment Gateway tests', ()=>{
    test('Should decline the payment', async () => {
        const inputData = { amount: 25, token: 'card_error' };

        const result = PaymentGateway.charge(inputData);

        await expect(result).rejects.toThrowError(ERRORS.PaymentDeclined);
    });
    
    test('Should accept the payment', async () => {
        const inputData = { amount: 25, token : 'accepted'};

        const result = PaymentGateway.charge(inputData);

        await expect(result).resolves.toStrictEqual({'amount' : 25, 'currency' : 'EUR'});
    });
    
    test('Should decline the payment', async () => {
        const inputData = { amount: 25, token: 'payment_error'};

        const result = PaymentGateway.charge(inputData);

        await expect(result).rejects.toThrowError(ERRORS.PaymentError);
    });

    test('Should accept the payment', async () => {
        const inputData = { amount: 45.4, token : 'accepted'};

        const result = PaymentGateway.charge(inputData);

        await expect(result).resolves.toStrictEqual({'amount' : 45.4, 'currency' : 'EUR'});
    });
    
});