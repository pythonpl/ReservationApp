const ERRORS = require('../utils/commonErrors');


/** 
 * Class Database
 * A primitive database mock to test the services
 */


// Empty reservation ID - means the ticket with such number is so far free.
const EMPTY_RESERVATION = '_000000';


class Database {
    /**
     * TABLES: reservations, users, tickets
     * With some example initial values for testing purposes
     */
    reservations = { '_4kwcny': { datetime: '2020-04-01 11:30', tickets: ['_6c1iu1'], paid: false } };
    users = { '_4a12pz': {}, '_5s73fs': {} };
    // We consider tickets as unique objects.
    tickets = { '_j8w6y6': { price: 25, reservation: EMPTY_RESERVATION }, '_6c1iu1': { price: 25, reservation: '_4kwcny' } }




    /**
     * DB METHODS
     * ALL METHODS SHOULD RETURN PROMISE AS IN PROPER DB API
     * These method can be replaced to a real database connector if needed
     */


    /**
     * Checks if user with provided userID is in the database
     * @param {String} userID 
     * @returns {Promise} resolves true if user exists, false if user does not exist
     */
    checkUserExistance(userID) {
        return new Promise((resolve) => {
            resolve(this.users.hasOwnProperty(userID));
        })
    }

    /**
     * Checks if reservation with provided reservationID is in the database
     * @param {String} reservationID 
     * @returns {Promise} resolves true if user exists, false if user does not exist
     */
    checkReservationExistance(reservationID) {
        return new Promise((resolve) => {
            resolve(this.reservations.hasOwnProperty(reservationID));
        })
    }

    /**
     * Checks if ticket with provided ticketID is in the database
     * @param {String} ticketID 
     * @returns {Promise} resolves true if ticket exists, false if ticket does not exist
     */
    checkTicketExistance(ticketID) {
        return new Promise((resolve) => {
            resolve(this.tickets.hasOwnProperty(ticketID));
        })
    }

    /**
     * Checks if ticket with provided ticketID is free or taken
     * @param {String} ticketID 
     * @returns {Promise} resolves true if ticket is free
     */
    isTicketFree(ticketID) {
        return new Promise(async (resolve, reject) => {
            if (await this.checkTicketExistance(ticketID)) {
                resolve(this.tickets[ticketID].reservation === EMPTY_RESERVATION);
            } else {
                reject(new Error(ERRORS.TicketDataInvalid));
            }
        })
    }

}

module.exports = new Database();