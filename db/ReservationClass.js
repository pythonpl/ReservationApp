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
        this.paid = false;
    }

    markPaid(){
        this.paid = true;
    }
}

module.exports = Reservation;