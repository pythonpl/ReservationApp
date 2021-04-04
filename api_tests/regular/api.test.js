const app = require("../../app");

const request = require("supertest");
const ERRORS = require("../../constants/commonErrors");

const URL = "http://localhost:3700";


describe("API TESTS POST /reserve", () => {
  test("Should reject request with error ReservationRequestInvalid (does not match schema, invalid userID and ticketIDs)", async () => {
    const route = "/reserve";

    const inputData = {
      userID: 1,
      ticketID: [1, 2],
    };

    const expected = JSON.stringify(ERRORS.ReservationRequestInvalid);

    await request(URL).post(route).send(inputData).expect(expected);
  });

  test("Should reject request with error ReservationRequestInvalid (empty data)", async () => {
    const route = "/reserve";

    const inputData = {};

    const expected = JSON.stringify(ERRORS.ReservationRequestInvalid);

    await request(URL).post(route).send(inputData).expect(expected);
  });

  test("Should return {*id*, 25} successfully (valid userID and ticketIDs)", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 25);
      });
  });

  test("Should reject request with error RequestInvalidData (valid userID and invalid ticketIDs)", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_aaaay6", "_pppp11"] };

    const expected = JSON.stringify(ERRORS.RequestInvalidData);

    await request(URL).post(route).send(inputData).expect(expected);
  });

  test("Should return {*id*, 30} for the first time (valid userID and ticketIDs), and errror TicketsAlreadyTaken for the second (tickets already taken)", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_0oap21", "_54tgr2"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 30);
      })
      .then(async () => {
        await request(URL)
          .post(route)
          .send(inputData)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
          });
      });
  });
});

describe("API TESTS POST /pay", () => {
  test("Should return success (valid userID, reservationID, token)", async () => {
    const route = "/pay";

    const inputData = {
      userID: "_4a12pz",
      reservationID: "_4kwcny",
      token: "paymenttoken",
    };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("status", "success");
      });
  });

  test("Should reject request with error ReservationRequestInvalid (invalid reservationID)", async () => {
    const route = "/pay";

    const inputData = {
      userID: "_4a12pz",
      reservationID: "_599cny",
      token: "paymenttoken",
    };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBe(ERRORS.ReservationDataInvalid);
      });
  });

  test("Should reject request with error RequestInvalidData (userID and reservationID not associtated)", async () => {
    const route = "/pay";

    const inputData = {
      userID: "_5s73fs",
      reservationID: "_4kwcny",
      token: "paymenttoken",
    };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBe(ERRORS.RequestInvalidData);
      });
  });

  test("Should reject request with error PaymentDeclined (token declined)", async () => {
    const route = "/pay";

    const inputData = {
      userID: "_4a12pz",
      reservationID: "_awccn8",
      token: "card_error",
    };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBe(ERRORS.PaymentDeclined);
      });
  });

  test("Should reject request with error PaymentError (token error)", async () => {
    const route = "/pay";

    const inputData = {
      userID: "_4a12pz",
      reservationID: "_awccn8",
      token: "payment_error",
    };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBe(ERRORS.PaymentError);
      });
  });
});


