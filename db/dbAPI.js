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
        '_4kwcny': new Reservation({ userID: '_4a12pz', ticketID: ['_6c1iu1'], amount: 15, id: '_4kwcny' })
    };

    // We consider tickets as unique objects.
    tickets = {
        '_j8w6y6': new Ticket({ price: 25, reservationID: EMPTY_RESERVATION, id: '_j8w6y6' }),
        '_gd74ae': new Ticket({ price: 20, reservationID: EMPTY_RESERVATION, id: '_gd74ae' }),
        '_6c1iu1': new Ticket({ price: 15, reservationID: '_4kwcny', id: '_6c1iu1' })
    };

    soldTickets = {};

    constructor() {
        this.reservationMutex = new Mutex();
        this.changeReservationStatusMutex = new Mutex();
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
     * @returns {Promise} resolves true if reservation exists
     */
    checkReservationExistence(reservationID) {
        return new Promise((resolve) => {
            resolve(this.reservations.hasOwnProperty(reservationID));
        });
    }

    /**
     * Checks if reservation with provided reservationID awaits payment
     * @param {String} reservationID 
     * @returns {Promise} resolves true if it's not paid yet
     */
    checkIfReservationAwaitsPayment(reservationID) {
        return new Promise((resolve) => {
            resolve(this.reservations[reservationID].isWaitingForPayment());
        });
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
     * Checks if reservation exists, and belongs to user
     * @param {Object} data matches PaymentRequestSchema
     * @returns {Promise} resolves true if reservation belongs to user, false if not, rejects when reservation does not exist
     */
    checkReservationBelongsToUser(data) {
        return new Promise(async (resolve, reject) => {
            if (await this.checkReservationExistence(data.reservationID)) {
                resolve(this.reservations[data.reservationID].userID === data.userID);
            } else {
                reject(new Error(ERRORS.ReservationDataInvalid));
            }
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
     * @param {Object} reservation matches PaymentRequestSchema
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

    /**  
     * Checks if reservation is valid, and locks it to charge user
     * @param {Object} data matches PaymentRequestSchema
     * @returns {Promise} resolves reservation price if reservation is valid and has been locked, rejects with error otherwise
     */
    beginPayment(data) {
        return new Promise(async (resolve, reject) => {
            const release = await this.changeReservationStatusMutex.acquire();
            try {
                if (this.reservations[data.reservationID].isLockedForThePayment())
                    throw new Error(ERRORS.PaymentStarted);

                if (!this.reservations[data.reservationID].isNotExpired())
                    throw new Error(ERRORS.ReservationExired);

                this.reservations[data.reservationID].beginPayment();
                resolve(this.reservations[data.reservationID].amount);
            } catch (e) {
                reject(e);
            } finally {
                release();
            }
        });
    }


    /**  
     * Changes Payment status of the reservation
     * @param {Object} data matches PaymentRequestSchema
     * @param {Boolean} success true if payment ended with success, false otherwise
     * @returns {Promise} resolves true if reservation has changed successfully, rejects with error otherwise
     */
    endPayment(data, success) {
        return new Promise(async (resolve, reject) => {
            const release = await this.changeReservationStatusMutex.acquire();
            try {
                this.reservations[data.reservationID].endPayment(success);
                resolve(true);
            } catch (e) {
                reject(e);
            } finally {
                release();
            }
        });
    }


    /**
     * Checks if reservation is still valid, and updates tickets state if not
     * @param {String} reservationID 
     * @returns {Promise} resolves true if tickets that belong to the reservation were modified, false if reservation is still valid
     */
    updateReservationValidity(reservationID) {
        return new Promise(async (resolve, reject) => {
            if (!(await this.checkReservationExistence(reservationID)))
                resolve(false);


            const release = await this.changeReservationStatusMutex.acquire();
            try {
                if (this.reservations[reservationID].isCompleted())
                    resolve(false);

                if (this.reservations[reservationID].isLockedForThePayment())
                    resolve(false);

                if (this.reservations[reservationID].isNotExpired())
                    resolve(false);

                for (let ticket in this.reservations[reservationID].ticketID) {
                    this.tickets[ticket].setReservation(EMPTY_RESERVATION);
                }
                resolve(true);
            } finally {
                release();
            }
        });
    }


    /**
     * Finds free tickets in database
     * @returns {Promise} resolves array of free ticket ids
     */
    findFreeTickets() {
        return new Promise(async (resolve, reject) => {
            const freeTickets = [];

            for (let ticketid of Object.getOwnPropertyNames(this.tickets)) {
                const ticket = this.tickets[ticketid];
                if (ticket.reservationID === EMPTY_RESERVATION) {
                    freeTickets.push(ticket.id);
                    continue;
                }

                if (await this.updateReservationValidity(ticket.reservationID)) {
                    freeTickets.push(ticket.id);
                }
            }

            resolve(freeTickets);
        });
    }

}

module.exports = new Database();