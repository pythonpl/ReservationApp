const Ajv = require('ajv');
const ajv = new Ajv();
/**
 * Schema of data passed to PaymentGateway. Should be complete, except currency (the default is EUR)
 */
const schema = {
    type: 'object',
    properties: {
        amount: {
            type: 'number'
        },
        token: {
            type: 'string',
            minLength: 1
        },
        currency: {
            type: 'string',
            minLength: 1
        }
    },
    required: ['amount', 'token']
}

module.exports = ajv.compile(schema);