const verifyReservationRequest = require("./ReservationRequestVerify");
const ERRORS = require("../constants/commonErrors");
const db = require("../db/dbAPI");

const express = require("express");
const router = express.Router();

// EXPRESS HANDLER MIDDLEWARE
exports.handleReservationRequest = function (req, res, next) {
  res.locals.reservationRequest = {
    userID: req.body.userID,
    ticketID: req.body.ticketID,
  };
  return next();
};

exports.validateReservationRequest = async function (req, res, next) {
  try {
    if (await verifyReservationRequest(res.locals.reservationRequest)) {
      return next();
    } else {
      throw new Error(ERRORS.RequestInvalidData);
    }
  } catch (e) {
    return res.json(e.message);
  }
};

exports.createNewReservation = async function (req, res, next) {
  try {
    const result = await db.placeReservation(res.locals.reservationRequest);
    return res.json(result);
  } catch (e) {
    return res.json(e.message);
  }
};

exports.router = router.post(
  "/reserve",
  this.handleReservationRequest,
  this.validateReservationRequest,
  this.createNewReservation
);
