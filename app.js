const express = require("express");
const reservationRoutes = require("./reservation/ReservationService");
const paymentRoutes = require("./payment/PaymentService");
const otherRoutes = require("./freetickets/FreeTicketsService");
const app = express();
const port = 3700;
const dbAPI = require("./db/dbAPI");

async function setup() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", reservationRoutes.router);
  app.use("/", paymentRoutes.router);
  app.use("/", otherRoutes.router)

  console.log(await dbAPI.onStartupReservationCleanup());
}

setup().then(()=>{
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
})

module.exports = app;


