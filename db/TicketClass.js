/**
 * Ticket class. Stores data about ticket: 
 * price for the ticket, and reservationID if it's reserved (EMPTY_RESERVATION id otherwise).
 */
class Ticket {
    constructor(data){
        this.id = data.id;
        this.price = data.price;
        this.reservationID = data.reservationID;
    }

    setReservation(reservationID){
        this.reservationID = reservationID;
    }

}

module.exports = Ticket;