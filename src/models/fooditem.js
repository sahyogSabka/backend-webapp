const mongoose = require("mongoose");

// Define the fooditem schema
const fooditemSchema = new mongoose.Schema({
  category: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  restaurant: {
    id: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

// Define the FoodItem model
const FoodItem = mongoose.model("FoodItem", fooditemSchema, "foodItems");

module.exports = FoodItem;
