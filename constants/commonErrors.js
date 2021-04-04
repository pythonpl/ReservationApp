module.exports = {
  /**
   * Payment errors definitions
   */
  PaymentError: "Something went wrong with your transaction.",
  PaymentDeclined: "Your card has been declined.",
  PaymentDataIncomplete: "The data provided is incomplete.",

  /**
   * DB errors definitions
   */
  TicketDataInvalid: "The ticketID is invalid.",
  TicketsAlreadyTaken: "Chosen tickets are taken.",
  ReservationDataInvalid: "The reservation data is invalid.",
  ReservationExired: "The reservation has expired.",
  PaymentStarted: "Payment already started.",

  /**
   * Request errors definitions
   */
  ReservationRequestInvalid: "Reservation request has invalid syntax.",
  PaymentRequestInvalid: "Payment request has invalid syntax.",
  RequestInvalidData: "Request contains invalid data.",

  /**
   * Selling strategy errors definitions
   */
  SellingStrategyEven: "The number of reserved tickets has to be even.",
  SellingStrategyAll: "The number of reserved tickets has to be equal to number of all tickets.",
  SellingStrategyAvoidOne: "Leaving one ticket free is not allowed",
};
