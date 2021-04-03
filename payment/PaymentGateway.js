const ERRORS = require('../utils/commonErrors');

class PaymentGateway {
    charge({amount, token, currency = 'EUR'}) {
        return new Promise((resolve, reject) => {
            switch (token) {
                case 'card_error':
                    return reject(new Error(ERRORS.PaymentDeclined));
                case 'payment_error':
                    return reject(new Error(ERRORS.PaymentError));
                default:
                    resolve({ amount, currency });
            }
        })
    }
}

module.exports = new PaymentGateway();