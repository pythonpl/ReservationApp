const Ticket = require("./TicketClass");
const Reservation = require("./ReservationClass");

const PARAMS = require("../constants/params");
const STRATEGY = require("../constants/sellingStrategy");

const MockUtils = require("./dbMockUtils");

/**
 * Class Database
 * A primitive database simulator to test the services
 */
class Database {
  /**
   * TABLES: reservations, users, tickets
   * With some example initial values for testing purposes
   */
  users = {
    _4a12pz: {},
    _5s73fs: {},
    _pppq12: {},
    _aaqqew: {},
    _llaks1: {},
  };

  // Reservation table: each reservation belongs to user and contains array of ticketids
  reservations = {
    _4kwcny: new Reservation({
      userID: "_4a12pz",
      ticketID: ["_6c1iu1"],
      amount: 15,
      id: "_4kwcny",
    }),
    _awccn8: new Reservation({
      userID: "_4a12pz",
      ticketID: ["_pok1sq"],
      amount: 15,
      id: "_awccn8",
    }),
  };
 
  // We consider tickets as unique objects.
  tickets = {
    _6c1iu1: new Ticket({
      price: 15,
      reservationID: "_4kwcny",
      id: "_6c1iu1",
    }),
    _j8w6y6: new Ticket({
      price: 25,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_j8w6y6",
    }),
    _gd74ae: new Ticket({
      price: 20,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_gd74ae",
    }),
    _1a1iu1: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_1a1iu1",
    }),
    _54tgr2: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_54tgr2",
    }),
    _0oap21: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_0oap21",
    }),
    _pok1sq: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_pok1sq",
    }),
    _mnvbv1: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_mnvbv1",
    }),
    _lsd198: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_lsd198",
    }),
    _vvbva1: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_vvbva1",
    }),
  };

  sellingStrategy = STRATEGY.FREE_SALE;

  constructor() {
    if (!Database.instance) {
      this._data = [];
      Database.instance = this;
    }

    return Database.instance;
  }

  /**
   * DB CONNECTOR METHODS
   * ALL METHODS SHOULD RETURN PROMISE AS IN PROPER DB API
   * These method can be modified to a real database connector if needed
   */

  // =====================================
  // SELECT-like methods
  // =====================================

  /**
   * acts like 'SELECT * FROM users WHERE userID = id'
   * @param {String} id userID
   * @returns {Promise<Array>} resolves array of users with matching id
   */
  selectUser(id) {
    return new Promise((resolve) => {
      if (this.users.hasOwnProperty(id)) {
        return resolve([this.users[id]]);
      } else {
        return resolve([]);
      }
    });
  }

  /**
   * acts like 'SELECT * FROM reservations WHERE reservationID = id'
   * @param {String} id reservationID
   * @returns {Promise<Array>} resolves array of reservations with matching id
   */
  selectReservation(id) {
    return new Promise((resolve) => {
      if (this.reservations.hasOwnProperty(id)) {
        return resolve([this.reservations[id]]);
      } else {
        return resolve([]);
      }
    });
  }

  /**
   * acts like 'SELECT * FROM tickets WHERE id = id'
   * @param {String} id ticketID
   * @returns {Promise<Array>} resolves array of tickets with matching id
   */
  selectTicket(id) {
    return new Promise((resolve) => {
      if (this.tickets.hasOwnProperty(id)) {
        return resolve([this.tickets[id]]);
      } else {
        return resolve([]);
      }
    });
  }

  /**
   * acts like 'SELECT strategy FROM sellingStrategy'
   * @returns {Promise<String>} resolves selling strategy
   */
  selectSellingStrategy() {
    return new Promise((resolve) => {
      return resolve(this.sellingStrategy);
    });
  }

  /**
   * acts like 'SELECT ticketID FROM tickets WHERE reservationID = PARAMS.EMPTY_RESERVATION'
   * @returns {Promise<Array>} resolves array of free tickets
   */
  selectFreeTickets() {
    return new Promise((resolve) => {
      const freeTickets = Object.keys(this.tickets).filter((id) => {
        if (this.tickets[id].reservationID === PARAMS.EMPTY_RESERVATION)
          return id;
      });
      return resolve(freeTickets);
    });
  }

  // =====================================
  // UPDATE-like methods
  // =====================================

  /**
   * acts like 'UPDATE tickets SET reservationID=reservationID WHERE id IN tickets'
   * @param {Array} tickets
   * @param {String} reservationID
   * @returns {Promise<Number>} resolves price of affected tickets
   */
  updateTicketsReservation(tickets, reservationID) {
    return new Promise((resolve) => {
      let price = 0;
      tickets.forEach((x) => {
        this.tickets[x].setReservation(reservationID);
        price += this.tickets[x].price;
      });
      return resolve(price);
    });
  }

  /**
   * acts like 'UPDATE reservations SET amount=price WHERE id=reservationID'
   * @param {String} reservationID
   * @param {Number} price
   * @returns {Promise<Boolean>} resolves true
   */
  updateReservationPrice(reservationID, price) {
    return new Promise((resolve) => {
      this.reservations[reservationID].amount = price;
      return resolve(true);
    });
  }

  /**
   * acts like 'UPDATE reservations SET paymentStatus=paymentStatus WHERE id=reservationID'
   * @param {String} reservationID
   * @param {Integer} paymentStatus from PaymentStatusCodes
   * @returns {Promise<Boolean>} resolves true
   */
  updateReservationPayment(reservationID, paymentStatus) {
    return new Promise((resolve) => {
      this.reservations[reservationID].paymentStatus = paymentStatus;
      return resolve(true);
    });
  }

  // =====================================
  // INSERT-like methods
  // =====================================

  /**
   * acts like 'INSERT INTO reservations VALUES reservation'
   * @param {Object} reservation matches ReservationRequestSchema
   * @returns {Promise<String>} resolves inserted reservationID
   */
  insertReservation(data) {
    return new Promise((resolve) => {
      const id = MockUtils.getUniqueID();
      this.reservations[id] = new Reservation({
        id: id,
        userID: data.userID,
        ticketID: data.ticketID,
      });
      return resolve(id);
    });
  }

  // =====================================
  // SPECIAL METHODS
  // =====================================

  /**
   * The next two functions should be called before start of application.
   * Their job is to cleanup the reservations in DB after for example a program failure.
   */

  /**
   * acts like 'SELECT * FROM reservations WHERE paymentStatus IN (PAYMENT_STATUS.FAILED, PAYMENT_STATUS.PENDING)
   *            AND DATEDIFF(milisecond, datetime, SYSDATETIME()) >= PARAMS.RESERVATION_EXPIRY_TIME'
   * @returns {Promise<Array>} resolves array of reservations to schedule expiration
   */
  selectReservationsToScheduleExpiration() {
    return new Promise(async (resolve) => {
      const validReservations = Object.keys(this.reservations).filter((id) => {
        if (
          this.reservations[id].isWaitingForPayment() &&
          !this.reservations[id].isExpired()
        )
          return id;
      });

      const reservationsToSchedule = [];
      for (let id of validReservations) {
        reservationsToSchedule.push({
          id: id,
          datetime: this.reservations[id].datetime,
        });
      }

      return resolve(reservationsToSchedule);
    });
  }

  /**
   * Selects reservations that can be released and releases it's tickets
   * @returns {Promise<Integer>} resolves number of affected reservations
   */
  updateExpiredReservationTickets() {
    return new Promise(async (resolve) => {
      const reservationsCleaned = Object.keys(this.reservations).filter(
        (id) => {
          if (this.reservations[id].canBeReleased()) {
            return id;
          }
        }
      );

      for (let id of reservationsCleaned) {
        await this.updateTicketsReservation(
          this.reservations[id].tickets,
          PARAMS.EMPTY_RESERVATION
        );
      }
      return resolve(reservationsCleaned.length);
    });
  }
}

const database = new Database();
Object.freeze(database);
module.exports = database;
