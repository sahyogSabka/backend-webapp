const razorpayInstance = require("../routes/payment");
const { paiseToRupee } = require("../utils/paiseToRupee");
const { createObjectId } = require("../utils/createObjectId");
const { updateUser } = require("../controllers/users");
const OrderSchema = require("../models/order");
const Mailer = require("../utils/mailer");
const moment = require("moment");
const {
  twilioConf,
  twilioConfCallMultipleNumbers,
} = require("../utils/twilioConf");
const { processImageUrl } = require("../utils/signedUrl");


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

    const hmac = crypto.createHmac(
      "sha256",
      process.env.MYAPP_RAZORPAY_key_secret
    );
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
          <td>₹${data.amount}</td>
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
      </table>
      <table border="1">
        <caption><strong>ITEMS</strong></caption>
          <tr>
            <th><strong>Id</strong></th>
            <th><strong>Name</strong></th>
            <th><strong>Category</strong></th>
            <th><strong>Restaurant</strong></th>
            <th><strong>Description</strong></th>
            <th><strong>Price(in ₹)</strong></th>
            <th><strong>Quantity</strong></th>
            <th><strong>Total(in ₹)</strong></th>
          </tr>
          ${data.items
            .map(
              (elem) => `
            <tr>
              <td>${elem._id}</td>
              <td>${elem.name}</td>
              <td>${elem.category?.name}</td>
              <td>${elem.restaurant?.name}</td>
              <td>${elem.description}</td>
              <td>${elem.price}</td>
              <td>${elem.quantity}</td>
              <td>${elem.price * elem.quantity}</td>
            </tr>
          `
            )
            .join("")}
        </table>`;
    let subject = `There is a new order`;

    let restaurantEmails = data.items.map((item) => item.restaurant.email);
    let uniqueRestaurantEmails = [...new Set(restaurantEmails)];

    await Mailer(htmlbody, subject, uniqueRestaurantEmails);
  } catch (error) {
    throw new Error(error);
  }
}

async function createOrder(req, res) {
  let { orderId, paymentId, userId, amount, name, mobile, orderData } =
    req.body;
  try {
    // Save the order to the database
    let createdOrder = await addOrder({
      userId,
      paymentId,
      amount,
      items: orderData,
    });

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
      // orders: {
      //   orderId: createObjectId(createdOrder._id),
      //   amount,
      //   prepareUpto: moment(createdOrder.prepareUpto).toDate(),
      //   createdAt: new Date(),
      //   data: orderData,
      // },
    });

    let restaurantMobiles = orderData.map((order) => order.restaurant?.mobile);
    let uniqueRestaurantMobiles = [...new Set(restaurantMobiles)];

    await twilioConfCallMultipleNumbers(uniqueRestaurantMobiles);

    res.json({
      success: true,
      msg: "Order created successfully.",
      data: userUpdated,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getOrdersByUser(req, res) {
  try {
    let userId = req.params?.id;
    if (!userId) res.send({ success: false, msg: "Userid not found." });
    let data = await OrderSchema.find({ userId: createObjectId(userId) });
    console.log("data ============ ", JSON.stringify(data[0]), "----");

    for (const order of data) {
      // Using Promise.all to handle asynchronous updates for all items in an order
      await Promise.all(
        order.items.map(async (item) => {
          try {
            // Await the asynchronous imageUrl processing
            item.imageUrl = await processImageUrl(item.imageUrl);
          } catch (error) {
            console.error(
              `Error processing imageUrl for item ${item._id}:`,
              error
            );
            // Optionally, handle the error for individual items here
          }
        })
      );
    }

    res.send({ success: true, data });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getOrdersByRestaurant(req, res) {
  try {
    let restoId = req.params?.id;
    if (!restoId) res.send({ success: false, msg: "Restaurantid not found." });
    let data = await OrderSchema.aggregate([
      {
        $match: {
          "items.restaurant._id": restoId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // To keep orders without a matching user
        },
      },
    ]);
    res.send({ success: true, data });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function orderStatusUpdate(req, res) {
  try {
    let { orderId, status } = req.body;
    if (!orderId) res.send({ success: false, msg: "Orderid not found." });
    let data = await OrderSchema.updateOne(
      { _id: createObjectId(orderId) },
      {
        $set: { ...status },
      }
    );
    res.send({ success: true, data, msg: "Status successfully update." });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  makePayment,
  verifyPayment,
  createOrder,
  getOrdersByUser,
  getOrdersByRestaurant,
  orderStatusUpdate,
};
