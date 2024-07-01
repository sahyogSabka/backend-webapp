const { createSecretKey } = require('../utils/createSecretKey')
const jwt = require("jsonwebtoken");

// Generate the secret key
const secretKey = createSecretKey();

// Custom middleware to validate JWT
const validateJwt = (req, res, next) => {
  const authHeader = req.headers["token"];
  const token = authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { validateJwt };
