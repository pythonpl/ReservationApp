const validateSchema = require("./ReservationRequestSchema");
const db = require("../db/dbAPI");
const ERRORS = require("../constants/commonErrors");

/**
 * Verifies if the whole request has no syntax errors and doesn't request non-existing tickets/user
 */
module.exports = function (data) {
  return new Promise(async (resolve, reject) => {
    if (!validateSchema(data)) {
      return reject(new Error(ERRORS.ReservationRequestInvalid));
    }

    // Validates tickets and user existence
    const results = await Promise.all([
      ...data.ticketID.map((x) => db.checkTicketExistence(x)),
      db.checkUserExistence(data.userID),
    ]);

    // Resolves true if everything is OK
    return resolve(results.every((x) => x === true));
  });
};
