const Ajv = require("ajv");
const ajv = new Ajv();

/**
 * Schema of ReservationRequest data. Should be non empty, and should have all needed properties
 * Let's assume, that in our DB we use string IDs that have length = 7, so they need to match this.
 * Ticket IDs in ticketID array should be unique.
 */
const schema = {
  type: "object",
  properties: {
    userID: {
      type: "string",
      minLength: 7,
      maxLength: 7,
    },
    ticketID: {
      type: "array",
      contains: {
        type: "string",
        minLength: 7,
        maxLength: 7,
      },
      minItems: 1,
      uniqueItems: true,
    },
  },
  required: ["userID", "ticketID"],
};

module.exports = ajv.compile(schema);
