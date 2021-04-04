const db = require("./dbAPI");
const ERRORS = require("../utils/commonErrors");

describe("database API tests", () => {
  describe("tests of *Existence* methods", () => {
    test("UserID _4a12pz should be in database, resolves with true", async () => {
      const userID = "_4a12pz";

      const result = db.checkUserExistence(userID);

      await expect(result).resolves.toBe(true);
    });

    test("UserID _123456 should not be in database, resolves with false", async () => {
      const userID = "_123456";

      const result = db.checkUserExistence(userID);

      await expect(result).resolves.toBe(false);
    });

    test("TicketID _j8w6y6 should be in database, resolves with true", async () => {
      const ticketID = "_j8w6y6";

      const result = db.checkTicketExistence(ticketID);

      await expect(result).resolves.toBe(true);
    });

    test("TicketID _123456 should not be in database, resolves with false", async () => {
      const ticketID = "_123456";

      const result = db.checkTicketExistence(ticketID);

      await expect(result).resolves.toBe(false);
    });
  });

  describe("tests of isTicketFree method", () => {
    test("TicketID _j8w6y6 should be free, resolves with true", async () => {
      const ticketID = "_j8w6y6";

      const result = db.isTicketFree(ticketID);

      await expect(result).resolves.toBe(true);
    });

    test("TicketID _6c1iu1 should be not free, resolves with false", async () => {
      const ticketID = "_6c1iu1";

      const result = db.isTicketFree(ticketID);

      await expect(result).resolves.toBe(false);
    });

    test("TicketID _123456 does not exist, should reject with error TicketDataInvalid", async () => {
      const ticketID = "_123456";

      const result = db.isTicketFree(ticketID);

      await expect(result).rejects.toThrowError(ERRORS.TicketDataInvalid);
    });
  });

  describe("tests findFreeTickets", () => {
    test('should return ["_j8w6y6", "_gd74ae"] ', async () => {
      const result = db.findFreeTickets();

      await expect(result).resolves.toEqual(["_j8w6y6", "_gd74ae"]);
    });
  });

  describe("tests reserveTickets", () => {
    test("should reserve ticket and return price", async () => {
      const ticketID = ["_j8w6y6"];
      const reservationID = "_oo1234";

      const result = db.reserveTickets(ticketID, reservationID);

      await expect(result).resolves.toBe(25);
    });
  });

  describe("tests placeReservation", () => {
    test("should reserve tickets and return reservation id and price", async () => {
      const data = {
        userID: "_4a12pz",
        ticketID: ["_gd74ae"],
      };

      const result = await db.placeReservation(data);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("price", 20);
    });
  });
});
