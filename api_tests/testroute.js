const express = require("express");
const router = express.Router();
const db = require("../db/dbMock");
const Ticket = require("../db/TicketClass");
const Reservation = require("../db/ReservationClass");
const EMPTY_RESERVATION = "_000000";

/**
 *  Route used for testing ONLY
 *  Resets db mock.
 */
router.get("/reset", (req, res) => {
  
  db.users = { _4a12pz: {}, _5s73fs: {} };
  db.reservations = {
    _4kwcny: new Reservation({
      userID: "_4a12pz",
      ticketID: ["_6c1iu1"],
      amount: 15,
      id: "_4kwcny",
    }),
  };
  db.tickets = {
    _j8w6y6: new Ticket({
      price: 25,
      reservationID: EMPTY_RESERVATION,
      id: "_j8w6y6",
    }),
    _gd74ae: new Ticket({
      price: 20,
      reservationID: EMPTY_RESERVATION,
      id: "_gd74ae",
    }),
    _6c1iu1: new Ticket({ price: 15, reservationID: "_4kwcny", id: "_6c1iu1" }),
  };

  return res.send("OK");
});

module.exports = router;
