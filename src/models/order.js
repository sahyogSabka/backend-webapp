const mongoose = require("mongoose");

// Define the User schema
const orderSchema = new mongoose.Schema(
  {
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
  },
  { versionKey: false }
);

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

orderSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

// Define the Order model
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
