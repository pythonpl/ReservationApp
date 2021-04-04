const express = require("express");
const reservationRoutes = require("./reservation/ReservationService");
const paymentRoutes = require("./payment/PaymentService");
const app = express();
const port = 3700;
const dbAPI = require("./db/dbAPI");



async function setup() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", reservationRoutes.router);
  app.use("/", paymentRoutes.router);

  app.get("/freeTickets", async (req, res) => {
    res.json(await dbAPI.findFreeTickets());
  });

  console.log(await dbAPI.onStartupReservationCleanup());
}

setup().then(()=>{
  app.listen(port, () => {
    //console.log(`Example app listening at http://localhost:${port}`);
  });
})




module.exports = app;


