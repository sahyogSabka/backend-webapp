const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/fooditem");
const { createObjectId } = require("../utils/createObjectId");
const bcrypt = require("bcryptjs");
const { createSecretKey } = require("../utils/createSecretKey");
const jwt = require("jsonwebtoken");
const { mongoValidationError } = require('../utils/mongoValidationError')

async function getAllRestaurants(req, res) {
  try {
    let data = await Restaurant.find({});
    res.send({ success: true, data });
  } catch (error) {
    throw new Error(error);
  }
}

async function getFooditemsByRestaurantId(req, res) {
  try {
    const fooditemObjectid = createObjectId(req.params.id);
    let data = await FoodItem.find({ "restaurant.id": fooditemObjectid });
    res.send({ success: true, data });
  } catch (error) {
    throw new Error(error);
  }
}

async function createRestaurant(req, res) {
  let { name, address, rating, mobile, email, password } = req.body;
  try {
    // Create restaurant instance
    let restaurant = new Restaurant({
      name,
      address,
      rating,
      mobile,
      email,
      password,
    });

    // Save the restaurant to the database
    let savedRestaurant = await restaurant.save();

    res.status(201).json({ success: true, data: savedRestaurant });
  } catch (error) {
    let Errormsg = mongoValidationError(error, 'Mobile already exist.')
    res.status(500).json({
      success: false,
      status: 'error',
      message: Errormsg.message
    });
  }
}

async function loginRestaurant(req, res) {
  let { restaurantId, password } = req.body;
  try {
    let mongoObjectId = createObjectId(restaurantId, 'Invalid userid.');

    const restaurant = await Restaurant.findById(mongoObjectId);
    // console.log('restaurant ----- ',restaurant);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, restaurant.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { restaurantId: restaurantId, restaurantName: restaurant.name },
      createSecretKey(),
      { expiresIn: "1h" }
    );

    // If password matches, return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
}

module.exports = {
  getAllRestaurants,
  getFooditemsByRestaurantId,
  createRestaurant,
  loginRestaurant,
};
