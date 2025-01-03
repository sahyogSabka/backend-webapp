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
const foodItemRoute = require('./src/routes/foodItem')
const twilioRoute = require('./src/routes/twilio')

// Routes
app.use('/twilio', twilioRoute)
app.use("/restaurant", restaurantRoutes);
app.use("/order", orderRoutes);
app.use("/user", userRoutes);
app.use("/authenticate", authenticateRoute);
app.use("/foodItem", foodItemRoute);

// Home Route this will be in end of all routes
app.use("/", (req, res) => res.send({success: true, msg: 'Hello in DriveFood.'}));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
