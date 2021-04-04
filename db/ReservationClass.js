const PAYMENT_STATUS = require('../utils/PaymentStatusCodes');

// 15 minutes in MILIS
const RESERVATION_EXPIRY_TIME = 900000;

/**
 * Reservation class. Stores data about reservation: 
 * userID that created it, reserved tickets, datetime of reservation, and payment status.
 */
class Reservation {
    constructor(data){
        this.id = data.id;
        this.userID = data.userID;
        this.tickets = data.ticketID;
        this.amount = data.amount;
        this.datetime = new Date();
        this.paymentStatus = PAYMENT_STATUS.PENDING;
    }

    isWaitingForPayment(){
        return this.paymentStatus === PAYMENT_STATUS.FAILED || this.paymentStatus === PAYMENT_STATUS.PENDING;
    }

    isLockedForThePayment(){
        return this.paymentStatus === PAYMENT_STATUS.STARTED;
    }

    isCompleted(){
        return this.paymentStatus === PAYMENT_STATUS.SUCCESSFULL;
    }

    isNotExpired(){
        return (new Date() - this.datetime) < RESERVATION_EXPIRY_TIME;
    }

    canBeReleased(){
        return !this.isCompleted() && !this.isLockedForThePayment() && !this.isNotExpired();
    }

    beginPayment(){
        this.paymentStatus = PAYMENT_STATUS.STARTED;
    }

    endPayment(status){
        this.paymentStatus = status ? PAYMENT_STATUS.SUCCESSFULL : PAYMENT_STATUS.FAILED;
    }

}

module.exports = Reservation;