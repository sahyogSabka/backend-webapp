const mongoose = require("mongoose");
const moment = require("moment");

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
    prepareUpto: {
      type: Date,
      required: true,
      default: new Date() + process.env.ORDER_TIME_IN_MINUTES
    },
    items: {
      type: Array,
      required: true,
    },
  },
  { versionKey: false }
);

// Middleware to set the prepareUpto field before saving
orderSchema.pre("save", function(next) {
  if (!this.prepareUpto) {
    const orderTimeInMinutes = parseInt(process.env.ORDER_TIME_IN_MINUTES, 10) || 0;
    this.prepareUpto = moment().add(orderTimeInMinutes, "minutes").toDate();
  }
  next();
});

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
