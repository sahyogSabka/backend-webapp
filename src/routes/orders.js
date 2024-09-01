const express = require("express");
const orderController = require("../controllers/orders");

const router = express.Router();

router.post("/payment", async (req, res) => {
  return orderController.makePayment(req, res);
});

router.post("/create", async (req, res) => {
  return orderController.createOrder(req, res);
});

router.post("/payment/verify", async (req, res) => {
  return orderController.verifyPayment(req, res);
});

// Place the more specific route first
router.get("/restaurant/:id", (req, res) => {
  console.log('inside restaurant route================================= ');
  return orderController.getOrdersByRestaurant(req, res);
});

// Then the more general route
router.get("/:id", (req, res) => {
  return orderController.getOrdersByUser(req, res);
});

router.patch("/update", async (req, res) => {
  return await orderController.orderStatusUpdate(req, res);
});

module.exports = router;
