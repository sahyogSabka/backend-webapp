const Razorpay = require("razorpay");

let razorpayInstance = new Razorpay({
  key_id: process.env.MYAPP_RAZORPAY_key_id,
  key_secret: process.env.MYAPP_RAZORPAY_key_secret,
});

module.exports = razorpayInstance
