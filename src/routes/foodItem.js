const express = require("express");
const FoodItemController = require('../controllers/foodItem')

const router = express.Router();

router.post("/create", (req, res) => {
  return FoodItemController.addFoodItem(req, res)
});

router.post("/update", (req, res) => {
  return FoodItemController.editFoodItem(req, res)
});

router.get("/categories", (req, res) => {
  return FoodItemController.categories(req, res)
});

module.exports = router;
