const validateSchema = require('./PaymentRequestSchema');
const db = require('../db/dbAPI');
const ERRORS = require('../utils/commonErrors');

module.exports = function (data) {
    return new Promise(async (resolve, reject) => {
        if (!validateSchema(data)) {
            return reject(new Error(ERRORS.PaymentRequestInvalid));
        }

        try {
            // Validates requestID and userID
            const results = await Promise.all([
                db.checkUserExistence(data.userID),
                db.checkReservationBelongsToUser(data)
            ]);
            
            // Resolves true if everything is OK
            return resolve(results.every(x => x === true));
        }catch(e){
            return reject(e);
        }

    });
}