const Ajv = require("ajv");
const ajv = new Ajv();

/**
 * Schema of PaymentRequest data. Should be non empty, and should have all needed properties
 * Let's assume, that in our DB we use string IDs that have length = 7, so they need to match this.
 */
const schema = {
  type: "object",
  properties: {
    userID: {
      type: "string",
      minLength: 7,
      maxLength: 7,
    },
    reservationID: {
      type: "string",
      minLength: 7,
      maxLength: 7,
    },
    token: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["userID", "reservationID", "token"],
};

module.exports = ajv.compile(schema);
