const razorpayInstance = require("../routes/payment");
const { paiseToRupee } = require("../utils/paiseToRupee");
const { createObjectId } = require("../utils/createObjectId");
const { updateUser } = require("../controllers/users");
const OrderSchema = require("../models/order");
const Mailer = require("../utils/mailer");

async function makePayment(req, res) {
  // if the amount to be charged is ₹299.00, then pass 29900 means 29900 paise
  let { amount } = req.body;

  let amt = paiseToRupee(amount);
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

async function addOrder({ userId, paymentId, amount, items }) {
  try {
    return await OrderSchema.create({ userId, paymentId, amount, items });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function sendMailOfNewlyCreatedOrder(data) {
  try {
    let htmlbody = `<div>
      There is a new Order.
      </div>
      <br/>
      <table>
        <tr>
          <td><strong>Order id</strong></td>
          <td>${data.orderId}</td>
        </tr>
        <tr>
          <td><strong>Amount</strong></td>
          <td>${data.amount}</td>
        </tr>
        <tr>
          <td><strong>User id</strong></td>
          <td>${data.userId}</td>
        </tr>
        <tr>
          <td><strong>Name</strong></td>
          <td>${data.userName}</td>
        </tr>
        <tr>
          <td><strong>Mobile</strong></td>
          <td>${data.mobile}</td>
        </tr>
        <tr>
        <td>
        <table border="1">
        <caption><strong>ITEMS</strong></caption>
            <tr>
                <th><strong>Id</strong></th>
                <th><strong>Name</strong></th>
                <th><strong>Category</strong></th>
                <th><strong>Restaurant</strong></th>
                <th><strong>Description</strong></th>
                <th><strong>Price</strong></th>
                <th><strong>Quantity</strong></th>
                <th><strong>Total</strong></th>
              </tr>
              ${data.items
                .map(
                  (elem) => `
                <tr>
                  <td>${elem._id}</td>
                  <td>${elem.name}</td>
                  <td>${elem.category?._id}</td>
                  <td>${elem.restaurant?.name}</td>
                  <td>${elem.description}</td>
                  <td>${elem.price}</td>
                  <td>${elem.quantity}</td>
                  <td>${elem.price * elem.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </td>
        </tr>
      </table>`;
    let subject = `There is a new order`;

    await Mailer(htmlbody, subject);
  } catch (error) {
    throw new Error(error);
  }
}

async function createOrder(req, res) {
  let { orderId, paymentId, userId, amount, name, mobile, orderData } =
    req.body;
  // console.log('orderId ----------------------->> ',orderId);
  // console.log('----------------------- ',req.body.orderData);
  // return {}
  try {
    // Save the order to the database
    let createdOrder = await addOrder({
      userId,
      paymentId,
      amount,
      items: orderData,
    });

    console.log(
      "{ orderId: createdOrder._id, userId: createdOrder.userId, userName: name, mobile: mobile, paymentId: createdOrder.paymentId, amount: createdOrder.amount, items: createdOrder.items } ---------------------- ",
      JSON.stringify({
        orderId: createdOrder._id,
        userId: createdOrder.userId,
        userName: name,
        mobile: mobile,
        paymentId: createdOrder.paymentId,
        amount: createdOrder.amount,
        items: createdOrder.items,
      })
    );

    if (createdOrder._id) {
      await sendMailOfNewlyCreatedOrder({
        orderId: createdOrder._id,
        userId: createdOrder.userId,
        userName: name,
        mobile: mobile,
        paymentId: createdOrder.paymentId,
        amount: createdOrder.amount,
        items: createdOrder.items,
      });
    }

    let userUpdated = await updateUser(userId, {
      name,
      mobile,
      orders: {
        orderId: createObjectId(createdOrder._id),
        amount,
        createdAt: new Date(),
        data: orderData,
      },
    });

    res.json({
      success: true,
      msg: "Order created successfully.",
      data: userUpdated,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { makePayment, verifyPayment, createOrder };
