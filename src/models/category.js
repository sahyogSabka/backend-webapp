const mongoose = require("mongoose");

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Define the Category model
const Category = mongoose.model("Categories", categorySchema, "categories");

module.exports = Category;
