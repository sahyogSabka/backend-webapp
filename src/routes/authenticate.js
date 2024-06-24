const express = require("express");
const { validateJwt } = require("../middlewares/validatejwt");

const router = express.Router();

router.get("/", validateJwt, (req, res) => {
  res.send({ success: true, mmessage: "Successully authenticate." });
});

module.exports = router;
