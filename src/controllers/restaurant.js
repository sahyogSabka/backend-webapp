const Restaurant = require('../models/restaurant')

async function getAllRestaurants(req, res) {
  try {
    let data = await Restaurant.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getAllRestaurants };
