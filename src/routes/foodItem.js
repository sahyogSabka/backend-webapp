const express = require("express");
const FoodItemController = require('../controllers/foodItem')

const router = express.Router();

router.post("/create", (req, res) => {
  return FoodItemController.addFoodItem(req, res)
});

router.get("/categories", (req, res) => {
  return FoodItemController.categories(req, res)
});

module.exports = router;
