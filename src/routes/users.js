const express = require("express");
const UserController = require('../controllers/users')

const router = express.Router();

router.get("/", (req, res) => {
  return UserController.getAllUsers(req, res);
});

router.post("/createOrUpdateUser", (req, res) => {
  return UserController.createOrUpdateUser(req, res);
});

module.exports = router;
