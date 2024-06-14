const Razorpay = require("razorpay");

let razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_key_id,
  key_secret: process.env.RAZORPAY_key_secret,
});

module.exports = razorpayInstance
