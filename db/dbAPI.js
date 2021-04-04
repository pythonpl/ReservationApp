const ERRORS = require("../constants/commonErrors");
const PARAMS = require("../constants/params");
const PAYMENT_STATUS = require("../constants/PaymentStatusCodes");

const { Mutex } = require("async-mutex");
const databaseRequest = require("./dbMock");

/**
 * Class DatabaseAPI
 * A primitive database mock to test the services
 */

class DatabaseAPI {
  /**
   * Due to the lack of a real database and it's TRANSACTIONs, we need to use async-mutexes in order to be sure,
   * that double-booking problem won't exist, and the reservation under payment won't be released.
   */
  constructor() {
    this.reservationMutex = new Mutex();
  }

  /**
   * Checks if user with provided userID is in the database
   * @param {String} userID
   * @returns {Promise} resolves true if user exists, false if user does not exist
   */
  checkUserExistence(userID) {
    return new Promise(async (resolve) => {
      return resolve((await databaseRequest.selectUser(userID)).length === 1);
    });
  }

  /**
   * Checks if reservation with provided reservationID is in the database
   * @param {String} reservationID
   * @returns {Promise} resolves true if reservation exists
   */
  checkReservationExistence(reservationID) {
    return new Promise(async (resolve) => {
      return resolve(
        (await databaseRequest.selectReservation(reservationID)).length === 1
      );
    });
  }

  /**
   * Checks if reservation with provided reservationID awaits payment
   * @param {String} reservationID
   * @returns {Promise} resolves true if it's not paid yet
   */
  checkIfReservationAwaitsPayment(reservationID) {
    return new Promise(async (resolve) => {
      return resolve(
        (
          await databaseRequest.selectReservation(reservationID)
        )[0].isWaitingForPayment()
      );
    });
  }

  /**
   * Checks if ticket with provided ticketID is in the database
   * @param {String} ticketID
   * @returns {Promise} resolves true if ticket exists, false if ticket does not exist
   */
  checkTicketExistence(ticketID) {
    return new Promise(async (resolve) => {
      return resolve((await databaseRequest.selectTicket(ticketID)).length === 1);
    });
  }

  /**
   * Checks if reservation exists, and belongs to user
   * @param {Object} data matches PaymentRequestSchema
   * @returns {Promise} resolves true if reservation belongs to user, false if not, rejects when reservation does not exist
   */
  checkReservationBelongsToUser(data) {
    return new Promise(async (resolve, reject) => {
      if (await this.checkReservationExistence(data.reservationID)) {
        return resolve(
          (await databaseRequest.selectReservation(data.reservationID))[0]
            .userID === data.userID
        );
      } else {
        return reject(new Error(ERRORS.ReservationDataInvalid));
      }
    });
  }

  /**
   * Checks if ticket with provided ticketID is free or taken
   * @param {String} ticketID
   * @returns {Promise} resolves true if ticket is free
   */
  isTicketFree(ticketID) {
    return new Promise(async (resolve, reject) => {
      if (await this.checkTicketExistence(ticketID)) {
        return resolve(
          (await databaseRequest.selectTicket(ticketID))[0].reservationID ===
            PARAMS.EMPTY_RESERVATION
        );
      } else {
        return reject(new Error(ERRORS.TicketDataInvalid));
      }
    });
  }

  /**
   * Reserve tickets from ticketList
   * @param {Array} tickets ticket list to reserve
   * @param {string} id reservation id
   * @returns {Promise} resolves price for all tickets
   */
  reserveTickets(tickets, id) {
    return new Promise(async (resolve) => {
      return resolve(await databaseRequest.updateTicketsReservation(tickets, id));
    });
  }

  /**
   * Places new Reservation
   * @param {Object} reservation matches ReservationRequestSchema
   * @returns {Promise} resolves with price and reservationID if everything went good, rejects if there is a problem
   */
  placeReservation(data) {
    return new Promise(async (resolve, reject) => {
      const release = await this.reservationMutex.acquire();
      try {
        const ticketsFree = await Promise.all(
          data.ticketID.map((x) => this.isTicketFree(x))
        );

        if (!ticketsFree.every((x) => x === true))
          throw new Error(ERRORS.TicketsAlreadyTaken);

        const id = await databaseRequest.insertReservation(data);
        const price = await this.reserveTickets(data.ticketID, id);
        await databaseRequest.updateReservationPrice(id, price);

        this.scheduleReservationExpiration(id);

        return resolve({ id, price });
      } catch (e) {
        return reject(e);
      } finally {
        release();
      }
    });
  }

  /**
   * Checks if reservation is valid, and locks it to charge user
   * @param {Object} data matches PaymentRequestSchema
   * @returns {Promise} resolves reservation price if reservation is valid and has been locked, rejects with error otherwise
   */
  beginPayment(data) {
    return new Promise(async (resolve, reject) => {
      const release = await this.reservationMutex.acquire();
      try {
        const reservation = (
          await databaseRequest.selectReservation(data.reservationID)
        )[0];
        if (reservation.isLockedForThePayment())
          throw new Error(ERRORS.PaymentStarted);

        if (reservation.isExpired()) throw new Error(ERRORS.ReservationExired);

        await databaseRequest.updateReservationPayment(
          data.reservationID,
          PAYMENT_STATUS.STARTED
        );
        return resolve(reservation.amount);
      } catch (e) {
        return reject(e);
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
      const release = await this.reservationMutex.acquire();
      try {
        const status = success
          ? PAYMENT_STATUS.SUCCESSFULL
          : PAYMENT_STATUS.FAILED;

        await databaseRequest.updateReservationPayment(
          data.reservationID,
          status
        );
        return resolve(true);
      } catch (e) {
        return reject(e);
      } finally {
        release();
        this.updateReservationValidity(data.reservationID);
      }
    });
  }

  /**
   * Checks if reservation is still valid, and updates tickets state if not
   * @param {String} reservationID
   * @returns {Promise} resolves true if tickets that belong to the reservation were modified, false if reservation is still valid
   */
  updateReservationValidity(reservationID) {
    return new Promise(async (resolve) => {
      const release = await this.reservationMutex.acquire();
      try {
        if (!(await this.checkReservationExistence(reservationID)))
          return resolve(false);

        const reservation = (
          await databaseRequest.selectReservation(reservationID)
        )[0];

        if (!reservation.canBeReleased()) {

          return resolve(false);
        }

        await databaseRequest.updateTicketsReservation(
          reservation.tickets,
          PARAMS.EMPTY_RESERVATION
        );
        return resolve(true);
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
    return new Promise(async (resolve) => {
      return resolve(await databaseRequest.selectFreeTickets());
    });
  }

  /**
   * Schedules function execution, that checks if reservation can be released
   * @param {String} reservationID
   * @param {Integer} timeout value of timeout in miliseconds (default = PARAMS.RESERVATION_EXPIRY_TIME)
   */
  scheduleReservationExpiration(
    reservationID,
    timeout = PARAMS.RESERVATION_EXPIRY_TIME
  ) {
    setTimeout(() => {
      this.updateReservationValidity(reservationID);
    }, timeout);
  }

  /**
   * Cleanup of reservations in DB.
   * Call this only at application startup!
   * @returns {Promise<Object>} resolves ammount of reservations affected
   */
  onStartupReservationCleanup() {
    return new Promise(async (resolve) => {
      let release = await this.reservationMutex.acquire();
      let expiredReservations = 0;
      let scheduledReservations = [];
      try {
        expiredReservations = await databaseRequest.updateExpiredReservationTickets();
        scheduledReservations = await databaseRequest.selectReservationsToScheduleExpiration();

        scheduledReservations.forEach((r) => {
          this.scheduleReservationExpiration(
            r.id,
            PARAMS.RESERVATION_EXPIRY_TIME - (new Date() - r.datetime)
          );
        });
      } finally {
        release();
      }

      return resolve({
        cleaned: expiredReservations,
        scheduled: scheduledReservations.length,
      });
    });
  }
}

module.exports = new DatabaseAPI();
