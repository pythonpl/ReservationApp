const Ajv = require('ajv');
const ajv = new Ajv();
/**
 * Schema of data passed to PaymentGateway. Should be complete, except currency (the default is EUR)
 */
const schema = {
    type: 'object',
    properties: {
        amount: { type: 'number' },
        token: { type: 'string' },
        currency : {type : 'string'}
    },
    required: ['amount', 'token']
}

module.exports = ajv.compile(schema);