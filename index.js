const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);

const origin = 'https://www.drivefood.in/'

// Allow all origins for HTTP requests
app.use(cors({
  origin: origin, // Allow requests only from this origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Set to true if cookies/auth headers are required
}));

app.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.sendStatus(200);
});

app.use(express.json());

// Attach Socket.IO with proper CORS settings
const io = new Server(server, {
  cors: {
    origin: origin, // Allow requests only from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Allow cookies/auth headers if needed
  },
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  next();
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
