const mongoose = require("mongoose");

// Define the User schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

// Define the Order model
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
