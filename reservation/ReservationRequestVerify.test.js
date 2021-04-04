const verifyReservationRequest = require("./ReservationRequestVerify");
const ERRORS = require("../constants/commonErrors");

describe("Reservation Service request tests", () => {
  describe("Tests of verifyReservationRequest function", () => {
    test("Should accept appropriate data", async () => {
      const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).resolves.toBe(true);
    });

    test("Should accept appropriate data", async () => {
      const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6", "_6c1iu1"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).resolves.toBe(true);
    });

    test("Should reject for empty data with error ReservationRequestInvalid", async () => {
      const inputData = {};

      const result = verifyReservationRequest(inputData);

      await expect(result).rejects.toThrowError(
        ERRORS.ReservationRequestInvalid
      );
    });

    test("Should reject for invalid data with error ReservationRequestInvalid", async () => {
      const inputData = { userID: "invalidUserID", ticketID: ["_j8w6y6"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).rejects.toThrowError(
        ERRORS.ReservationRequestInvalid
      );
    });

    test("Should reject for invalid data with error ReservationRequestInvalid", async () => {
      const inputData = {
        userID: "_4a12pz",
        ticketID: ["_j8w6y6", "_j8w6y6", "_j8w6y6", "invalidTicketID"],
      };

      const result = verifyReservationRequest(inputData);

      await expect(result).rejects.toThrowError(
        ERRORS.ReservationRequestInvalid
      );
    });

    test("Should reject for not unique tickets with error ReservationRequestInvalid", async () => {
      const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6", "_j8w6y6"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).rejects.toThrowError(
        ERRORS.ReservationRequestInvalid
      );
    });

    test("Should resolve with false for data with not existing user", async () => {
      const inputData = { userID: "_4w12pa", ticketID: ["_j8w6y6"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).resolves.toBe(false);
    });

    test("Should resolve with false for data with not existing ticket", async () => {
      const inputData = { userID: "_4w12pa", ticketID: ["_j8w6y6", "_klm6y6"] };

      const result = verifyReservationRequest(inputData);

      await expect(result).resolves.toBe(false);
    });
  });
});
