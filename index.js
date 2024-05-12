const express = require('express')
const app = express()
const port = 3000

// Load mongo config
require("./config");

// Load routes
const indexRoutes = require("./src/routes/restaurant");

// Routes
app.use("/restaurant", indexRoutes);

// Home Route this will be in end of all routes
app.use("/", (req, res) => res.send('Hello in Sahyog Sabka.'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
