const express = require("express");
const router = express.Router();

const dbAPI = require('../db/dbAPI');

router.get("/freeTickets", async (req, res) => {
  res.json(await dbAPI.findFreeTickets());
});

module.exports = { router: router };
