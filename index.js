// At the top of index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from all origins
    methods: ["GET", "PUT", "POST"], // Specify allowed methods
    credentials: false, // Set to true if you want to allow cookies/auth headers
  },
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('newOrder', (order) => {
    console.log('New order received:', order);
    io.emit('orderUpdated', order);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Middleware
// Attach io to req in middleware
app.use((req, res, next) => {
  req.io = io; // Attach io instance to req
  next();
});
app.use(express.json());
app.use(cors());

// Load mongo config
require("./config");

// Load routes
const restaurantRoutes = require("./src/routes/restaurant");
const orderRoutes = require('./src/routes/orders');
const userRoutes = require('./src/routes/users');
const authenticateRoute = require('./src/routes/authenticate');
const foodItemRoute = require('./src/routes/foodItem');
const twilioRoute = require('./src/routes/twilio');

// Routes
app.use('/twilio', twilioRoute);
app.use("/restaurant", restaurantRoutes);
app.use("/order", orderRoutes);
app.use("/user", userRoutes);
app.use("/authenticate", authenticateRoute);
app.use("/foodItem", foodItemRoute);

// Home Route this will be in end of all routes
app.use("/", (req, res) => res.send({ success: true, msg: 'Hello in DriveFood.' }));

// Export io instance
module.exports.io = io;

// Start the server
server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
