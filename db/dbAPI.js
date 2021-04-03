const ERRORS = require('../utils/commonErrors');
const Ticket = require('./TicketClass');
const Reservation = require('./ReservationClass');
const MockUtils = require('./dbMockUtils')
const { Mutex } = require('async-mutex');


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
        '_gd74ae': new Ticket({ price: 20, reservationID: EMPTY_RESERVATION, id: '_gd74ae' }),
        '_6c1iu1': new Ticket({ price: 15, reservationID: '_4kwcny', id: '_6c1iu1' })
    }

    constructor() {
        this.reservationMutex = new Mutex();
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
    checkUserExistence(userID) {
        return new Promise((resolve) => {
            resolve(this.users.hasOwnProperty(userID));
        })
    }

    /**
     * Checks if reservation with provided reservationID is in the database
     * @param {String} reservationID 
     * @returns {Promise} resolves true if user exists, false if user does not exist
     */
    checkReservationExistence(reservationID) {
        return new Promise((resolve) => {
            resolve(this.reservations.hasOwnProperty(reservationID));
        })
    }

    /**
     * Checks if ticket with provided ticketID is in the database
     * @param {String} ticketID 
     * @returns {Promise} resolves true if ticket exists, false if ticket does not exist
     */
    checkTicketExistence(ticketID) {
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
            if (await this.checkTicketExistence(ticketID)) {
                resolve(this.tickets[ticketID].reservationID === EMPTY_RESERVATION);
            } else {
                reject(new Error(ERRORS.TicketDataInvalid));
            }
        })
    }

    /**
     * Reserve tickets from ticketList
     * @param {Array} tickets ticket list to reserve
     * @param {string} id reservation id
     * @returns {Promise} resolves price for all tickets
     */
    reserveTickets(tickets, id) {
        return new Promise(async (resolve, reject) => {
            let price = 0;
            tickets.forEach(x => {
                this.tickets[x].setReservation(id);
                price += this.tickets[x].price;
            });
            resolve(price);
        });
    }

    /**
     * Places new Reservation
     * @param {Object} reservation object created passed by ReservationService
     * @returns {Promise} resolves with price and reservationID if everything went good, rejects if there is a problem
     */
    placeReservation(data) {
        return new Promise(async (resolve, reject) => {
            const release = await this.reservationMutex.acquire();
            try {
                const ticketsFree = await Promise.all(data.ticketID.map(x => this.isTicketFree(x)));
                if (!ticketsFree.every(x => x === true))
                    throw new Error(ERRORS.TicketsAlreadyTaken);

                const id = MockUtils.getUniqueID();
                const price = await this.reserveTickets(data.ticketID, id);
                this.reservations[id] = new Reservation({ id: id, userID: data.userID, ticketID: data.ticketID, amount: price });
                resolve({ id, price });
            } catch (e) {
                reject(e);
            } finally {
                release();
            }
        })
    }

}

module.exports = new Database();