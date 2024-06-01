const Restaurant = require('../models/restaurant')
const FoodItem = require('../models/fooditem')
const mongoose = require('mongoose');

// Accessing ObjectId from Mongoose
const ObjectId = mongoose.Types.ObjectId;

// Function to safely create ObjectId from string
function createObjectId(id) {
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    } else {
        throw new Error('Invalid ObjectId format');
    }
}

async function getAllRestaurants(req, res) {
  try {
    let data = await Restaurant.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

async function getFooditemsByRestaurantId(req, res) {
  try {
    const fooditemObjectid = createObjectId(req.params.id)
    let data = await FoodItem.find({'restaurant.id' : fooditemObjectid})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getAllRestaurants, getFooditemsByRestaurantId };
