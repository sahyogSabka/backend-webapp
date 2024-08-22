const express = require("express");

const router = express.Router();

router.post("/twiml", (req, res) => {
    const message = req.query.message || 'Hello, this is a dynamic message from Twilio!';
    res.send(`
      <Response>
        <Say>${message}</Say>
      </Response>
    `);
});

module.exports = router;
