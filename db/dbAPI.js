const ERRORS = require('../utils/commonErrors');
const Ticket = require('./TicketClass');
const Reservation = require('./ReservationClass');


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
    users = { '_4a12pz': {}, '_5s73fs': {} };

    // Reservation table: each reservation belongs to user and contains array of ticketids
    reservations = {
        '_4kwcny': new Reservation({ userID: '_4a12pz', ticketID: ['_6c1iu1'], id: '_4kwcny' })
    };
    // We consider tickets as unique objects.
    tickets = {
        '_j8w6y6': new Ticket({ price: 25, reservationID: EMPTY_RESERVATION, id: '_j8w6y6' }),
        '_6c1iu1': new Ticket({ price: 25, reservationID: '_4kwcny', id: '_6c1iu1' })
    }



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
                resolve(this.tickets[ticketID].reservationID === EMPTY_RESERVATION);
            } else {
                reject(new Error(ERRORS.TicketDataInvalid));
            }
        })
    }

}

module.exports = new Database();