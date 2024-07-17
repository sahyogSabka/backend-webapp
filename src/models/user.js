const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  type: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  orders: {
    type: Array,
  },
});

// Define the User model
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
