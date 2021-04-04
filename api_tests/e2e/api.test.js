const app = require("../../app");
const testRoutes = require("../testroute");
app.use("/", testRoutes);

const request = require("supertest");
const ERRORS = require("../../constants/commonErrors");

const URL = "http://localhost:3700";

describe("API TESTS POST /pay and /reserve", () => {
  beforeEach(async () => {
    return await request(URL).get("/reset");
  });

  test("Should reserve and then pay successfully", async () => {
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

    const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 25);
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

    const inputData = { userID: "_4a12pz", ticketID: ["_j8w6y6"] };

    await request(URL)
      .post(route)
      .send(inputData)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("price", 25);
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
          .send({ userID: "_5s73fs", ticketID: ["_j8w6y6"] })
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
          });
      });
  });
});

describe("500 users at once trying to get freeTickets list", () => {
  beforeAll(async () => {
    return await request(URL).get("/insertMoreData").expect(200);
  });

  test.concurrent.each([...Array(500).keys()])(
    "should receive freeTickets list",
    async () => {
      const route = "/freeTickets";

      await request(URL).get(route).expect("Content-Type", /json/).expect(200);
    }
  );
});
