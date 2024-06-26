const razorpayInstance = require("../routes/payment");
const {paiseToRupee} = require('../utils/paiseToRupee')

async function createOrder(req, res) {
  // if the amount to be charged is ₹299.00, then pass 29900 means 29900 paise
  let { amount } = req.body
  
  let amt = paiseToRupee(amount)
  const options = {
    amount: amt, // amount in the smallest currency unit
    currency: "INR",
    // receipt: "receipt_order_74394",
  };
  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
}

function verifyPayment(req, res) {
  try {
    const crypto = require("crypto");
    console.log('req.body -------- ',req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const hmac = crypto.createHmac("sha256", "TlmDEzTuhiDRqxVJhPi2d8Ea");
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      res.send("Payment is successful");
    } else {
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { createOrder, verifyPayment };
