const app = require("../../app");

const request = require("supertest");
const ERRORS = require("../../constants/commonErrors");

const URL = "http://localhost:3700";



describe("500 users at once trying to get freeTickets list", () => {
  test.concurrent.each([...Array(500).keys()])(
    "should receive freeTickets list",
    async () => {
      const route = "/freeTickets";

      await request(URL).get(route).expect("Content-Type", /json/).expect(200);
    }
  );
});

describe("API TESTS POST /pay and /reserve", () => {
  test("Should reserve and then pay successfully", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_vvbva1"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 15);
        return res;
      })
      .then(async (res) => {
        await request(URL)
          .post("/pay")
          .send({
            userID: "_4a12pz",
            reservationID: res.body.id,
            token: "paymentaccepted",
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("status", "success");
          });
      });
  });

  test("Should reserve and then pay successfully, and then can't reserve same tickets", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_lsd198"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 15);
        return res;
      })
      .then(async (res) => {
        await request(URL)
          .post("/pay")
          .send({
            userID: "_4a12pz",
            reservationID: res.body.id,
            token: "paymentaccepted",
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("status", "success");
          });
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

  test("Should reserve and then pay successfully, and then can't reserve same tickets, even with different userID", async () => {
    const route = "/reserve";

    const inputData = { userID: "_4a12pz", ticketID: ["_mnvbv1"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 15);
        return res;
      })
      .then(async (res) => {
        await request(URL)
          .post("/pay")
          .send({
            userID: "_4a12pz",
            reservationID: res.body.id,
            token: "paymentaccepted",
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("status", "success");
          });
      })
      .then(async () => {
        await request(URL)
          .post(route)
          .send({ userID: "_5s73fs", ticketID: ["_mnvbv1"] })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
          });
      });
  });
});

describe("100 requests at once trying to reserve same ticket", () => {

  test.concurrent.each([...Array(100).keys()])(
    "only one should obtain reservation",
    async (i) => {
      const inputData = {
        userID: "_pppq12",
        ticketID: ["_j8w6y6"],
      };
      const route = "/reserve";
      if (i === 0) {
        await request(URL)
          .post(route)
          .send(inputData)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("price", 25);
            return res;
          });
      } else {
        await request(URL)
          .post(route)
          .send(inputData)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
          });
      }
    }
  );
}); 