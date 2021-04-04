const express = require("express");
const router = express.Router();
const db = require("../db/dbMock");
const Ticket = require("../db/TicketClass");
const Reservation = require("../db/ReservationClass");
const PARAMS = require("../constants/params");

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
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_j8w6y6",
    }),
    _gd74ae: new Ticket({
      price: 20,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_gd74ae",
    }),
    _6c1iu1: new Ticket({ price: 15, reservationID: "_4kwcny", id: "_6c1iu1" }),
  };

  return res.send("OK");
});

router.get("/insertMoreData", (req, res) => {
  db.users = {
    _4a12pz: {},
    _5s73fs: {},
    _pppq12: {},
    _aaqqew: {},
    _llaks1: {},
  };
  db.reservations = {};
  db.tickets = {
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
    _2nbf34: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_2nbf34",
    }),
    _basg23: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_basg23",
    }),
    _asd212: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_asd212",
    }),
    _maksd1: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_maksd1",
    }),
    _ools12: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_ools12",
    }),
    _bvas21: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_bvas21",
    }),
    _5642sa: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_5642sa",
    }),
    _4ewq1w: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_4ewq1w",
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
    _aaq120: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_aaq120",
    }),
    _qqw1ll: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_qqw1ll",
    }),
    _lkjjj1: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_lkjjj1",
    }),
    _aa11gg: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_aa11gg",
    }),
    _o9i771: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_o9i771",
    }),
    _mnasgg: new Ticket({
      price: 15,
      reservationID: PARAMS.EMPTY_RESERVATION,
      id: "_mnasgg",
    }),
  };

  return res.send("OK");
});

module.exports = router;
