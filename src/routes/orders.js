const express = require("express");
const orderController = require("../controllers/orders");

const router = express.Router();

router.post("/payment", async (req, res) => {
  return orderController.makePayment(req, res);
});

router.post("/create", async (req, res) => {
  // Emit an event for new orders
  let result = await orderController.createOrder(req, res);
  req.io.emit("orderCreated", result);
  res.status(200).json(result);
});

router.post("/createOrderByRestaurant", async (req, res) => {
  // Emit an event for new orders
  let result = await orderController.createOrderByRestaurant(req, res);
  req.io.emit("orderCreatedByRestaurant", result);
  res.status(200).json(result);
});

router.post("/payment/verify", async (req, res) => {
  return orderController.verifyPayment(req, res);
});

// Place the more specific route first
router.get("/restaurant/:id", (req, res) => {
  return orderController.getOrdersByRestaurant(req, res);
});

// Then the more general route
router.get("/:id", (req, res) => {
  return orderController.getOrdersByUser(req, res);
});

router.patch("/update", async (req, res) => {
  let result = await orderController.orderStatusUpdate(req, res);
  // Emit an event for order updates
  req.io.emit("orderUpdated", result);
  res.status(200).json(result);
});

module.exports = router;
