const verifyPaymentRequest = require('./PaymentRequestVerify');
const ERRORS = require('../utils/commonErrors');

describe('Payment request validation', () => {

    test('Should accept appropriate data', async () => {
        const inputData = { userID: '_4a12pz', reservationID: '_4kwcny', token: 'paymenttoken' };

        const result = verifyPaymentRequest(inputData);

        await expect(result).resolves.toBe(true);
    });

    test('Should reject for empty data with error PaymentRequestInvalid', async () => {
        const inputData = {  };

        const result = verifyPaymentRequest(inputData);

        await expect(result).rejects.toThrowError(ERRORS.PaymentRequestInvalid);
    });

    test('Should reject for incomplete data with error PaymentRequestInvalid', async () => {
        const inputData = { userID: '_5s73fs', reservationID: '_4kwcny' };

        const result = verifyPaymentRequest(inputData);

        await expect(result).rejects.toThrowError(ERRORS.PaymentRequestInvalid);
    });

    test('Should resolve with false (userID and reservationID not associated)', async () => {
        const inputData = { userID: '_5s73fs', reservationID: '_4kwcny', token: 'paymenttoken' };

        const result = verifyPaymentRequest(inputData);

        await expect(result).resolves.toBe(false);
    });

    test('Should resolve with false (userID does not exist)', async () => {
        const inputData = { userID: '_1173fs', reservationID: '_4kwcny', token: 'paymenttoken' };

        const result = verifyPaymentRequest(inputData);

        await expect(result).resolves.toBe(false);
    });

});