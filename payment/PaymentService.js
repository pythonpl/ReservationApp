const verifyPaymentRequest = require("./PaymentRequestVerify");
const PaymentGateway = require("./gateway/PaymentGateway");
const ERRORS = require("../constants/commonErrors");
const db = require("../db/dbAPI");

const express = require("express");
const router = express.Router();

// EXPRESS HANDLER MIDDLEWARE
exports.handlePaymentRequest = async function (req, res, next) {
  res.locals.paymentRequest = {
    userID: req.body.userID,
    reservationID: req.body.reservationID,
    token: req.body.token,
  };
  return next();
};

exports.validatePaymentRequest = async function (req, res, next) {
  try {
    if (await verifyPaymentRequest(res.locals.paymentRequest)) {
      return next();
    } else {
      throw new Error(ERRORS.RequestInvalidData);
    }
  } catch (e) {
    return res.json(e.message);
  }
};

exports.beginPayment = async function (req, res, next) {
  try {
    res.locals.paymentInfo = {
      amount: await db.beginPayment(res.locals.paymentRequest),
      token: res.locals.paymentRequest.token,
      currency: "EUR",
    };

    return next();
  } catch (e) {
    return res.json(e.message);
  }
};

exports.chargePayment = async function (req, res, next) {
  try {
    res.locals.response = await PaymentGateway.charge(res.locals.paymentInfo);
    await db.endPayment(res.locals.paymentRequest, true);
    return next();
  } catch (e) {
    await db.endPayment(res.locals.paymentRequest, false);
    return res.json(e.message);
  }
};

exports.endTransaction = async function (req, res, next) {
  const feedback = {
    status: "success",
    reservationID: res.locals.paymentRequest.reservationID,
    amount: res.locals.response.amount,
    currency: res.locals.response.currency,
  };

  return res.json(feedback);
};

exports.router = router.post(
  "/pay",
  this.handlePaymentRequest,
  this.validatePaymentRequest,
  this.beginPayment,
  this.chargePayment,
  this.endTransaction
);
