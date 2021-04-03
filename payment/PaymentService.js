const verifyPaymentRequest = require('./PaymentRequestVerify');
const PaymentGateway = require('./gateway/PaymentGateway');
const db = require('../db/dbAPI');

const express = require('express');
const router = express.Router();

// EXPRESS HANDLER MIDDLEWARE
exports.handlePaymentRequest = async function (req, res, next) {
    res.locals.paymentRequest = {
        userID: req.body.userID,
        reservationID: req.body.reservationID,
        token: req.body.token
    }
    return next();
}

exports.validatePaymentRequest = async function (req, res, next) {
    try {
        if (await verifyPaymentRequest(res.locals.paymentRequest)) {
            return next()
        } else {
            throw new Error(ERRORS.RequestInvalidData);
        }
    } catch (e) {
        return res.json(e.message);
    }
}

exports.chargePayment = async function (req, res, next) {
    let success = false;
    try {
        const paymentInfo = {
            amount: await db.beginPayment(res.locals.paymentRequest),
            token: res.locals.paymentRequest.token,
            currency: 'EUR'
        }
        const response = await PaymentGateway.charge(paymentInfo)
        success = true;
        return res.json({ status: 'success', reservationID: res.locals.paymentRequest.reservationID, amount: response.amount, currency: response.currency });
    } catch (e) {
        return res.json(e.message);
    } finally {
        await db.endPayment(res.locals.paymentRequest, success);
    }
}

exports.router = router.post('/pay', this.handlePaymentRequest, this.validatePaymentRequest, this.chargePayment);
