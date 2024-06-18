const Restaurant = require('../models/restaurant')
const FoodItem = require('../models/fooditem')
const createObjectId = require('../utils/createObjectId')

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

async function createRestaurant(req, res) {
  let {name, cuisine, address, rating, mobile, email, password} = req.body
  try {
    // Create restaurant instance
    let restaurant = new Restaurant({
      name,
      cuisine,
      address,
      rating,
      mobile,
      email,
      password
    })

    // Save the restaurant to the database
    let savedRestaurant = await restaurant.save();
    
    res.status(201).json({ success: true, data: savedRestaurant });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getAllRestaurants, getFooditemsByRestaurantId, createRestaurant };
