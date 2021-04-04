const ERRORS = require("../../constants/commonErrors");
const validate = require("./PaymentGatewaySchema");

class PaymentGateway {
  /**
   * Accepts or rejects payment with provided token.
   * Returns charged amount or error
   */
  charge(requestData) {
    return new Promise((resolve, reject) => {
      switch (requestData.token) {
        case "card_error":
          return reject(new Error(ERRORS.PaymentDeclined));
        case "payment_error":
          return reject(new Error(ERRORS.PaymentError));
        default:
          resolve({
            amount: requestData.amount,
            currency: requestData.currency || "EUR",
          });
      }
    });
  }
}

module.exports = new PaymentGateway();
