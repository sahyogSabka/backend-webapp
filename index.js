const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

// Middleware
app.use(express.json());
app.use(cors());

// Load mongo config 
require("./config");

// Load routes
const restaurantRoutes = require("./src/routes/restaurant");
const orderRoutes = require('./src/routes/orders')
const userRoutes = require('./src/routes/users')
const authenticateRoute = require('./src/routes/authenticate')

// Routes
app.use("/restaurant", restaurantRoutes);
app.use("/order", orderRoutes);
app.use("/user", userRoutes);
app.use("/authenticate", authenticateRoute);

// Home Route this will be in end of all routes
app.use("/", (req, res) => res.send({success: true, msg: 'Hello in Sahyog Sabka.'}));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
