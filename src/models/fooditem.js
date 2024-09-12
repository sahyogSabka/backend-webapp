const mongoose = require("mongoose");

// Define the fooditem schema
const fooditemSchema = new mongoose.Schema(
  {
    category: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories", // Replace "Category" with the actual name of the category collection
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
      default: null,
    },
    size: {
      type: Array,
      default: null,
    },
    restaurant: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      image: {
        type: Object,
      },
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: false,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false }
);

fooditemSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

fooditemSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Define the FoodItem model
const FoodItem = mongoose.model("FoodItem", fooditemSchema, "foodItems");

module.exports = FoodItem;
