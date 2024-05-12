const express = require("express");
const RestaurnatController = require("../controllers/restaurant");

const router = express.Router();

router.get("/", (req, res) => {
  return RestaurnatController.getAllRestaurants(req, res);
});

module.exports = router;
