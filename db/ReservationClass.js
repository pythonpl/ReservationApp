const PAYMENT_STATUS = require("../constants/PaymentStatusCodes");
const PARAMS = require("../constants/params");

/**
 * Reservation class. Stores data about reservation:
 * userID that created it, reserved tickets, datetime of reservation, and payment status.
 */
class Reservation {
  constructor(data) {
    this.id = data.id;
    this.userID = data.userID;
    this.tickets = data.ticketID;
    // DEFAULT VALUES
    this.paymentStatus = PAYMENT_STATUS.PENDING;
    this.datetime = new Date();
    this.amount = data.amount || 0;
  }

  /**
   * @returns {Boolean} true if it's not paid successfully yet
   */
  isWaitingForPayment() {
    return (
      this.paymentStatus === PAYMENT_STATUS.FAILED ||
      this.paymentStatus === PAYMENT_STATUS.PENDING
    );
  }

  /**
   * @returns {Boolean} true if the payment started, but it's not completed yet
   */
  isLockedForThePayment() {
    return this.paymentStatus === PAYMENT_STATUS.STARTED;
  }

  /**
   * @returns {Boolean} true if the reservation is already paid
   */
  isCompleted() {
    return this.paymentStatus === PAYMENT_STATUS.SUCCESSFULL;
  }

  /**
   * @returns {Boolean} true if the reservation time is up
   */
  isExpired() {
    return new Date() - this.datetime > PARAMS.RESERVATION_EXPIRY_TIME;
  }

  /**
   * @returns {Boolean} true if the reservation can be released: it is expired, not paid and not under payment
   */
  canBeReleased() {
    return (
      !this.isCompleted() && !this.isLockedForThePayment() && this.isExpired()
    );
  }

}

module.exports = Reservation;
