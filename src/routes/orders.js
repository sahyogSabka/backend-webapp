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

router.get("/:id", (req, res) => {
  return orderController.getOrdersByUser(req, res);
});

module.exports = router;
