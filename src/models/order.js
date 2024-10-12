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
    orderType: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    codAmount: {
      type: Number,
      required: true,
    },
    prepareUpto: {
      type: Date,
      required: true,
      default: () => moment().add(parseInt(process.env.MYAPP_ORDER_TIME_IN_MINUTES, 10), 'minutes').toDate(),
    },
    isDelivered: {
      type: Boolean,
      default: false
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
