const express = require("express");
const RestaurnatController = require("../controllers/restaurant");

const router = express.Router();

router.get("/", (req, res) => {
  return RestaurnatController.getAllRestaurants(req, res);
});

router.get("/:id", (req, res) => {
  return RestaurnatController.getFooditemsByRestaurantId(req, res)
});

router.post("/create", (req, res) => {
  return RestaurnatController.createRestaurant(req, res)
});

module.exports = router;
