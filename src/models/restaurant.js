const mongoose = require('mongoose');

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    }
  },
  rating: {
    type: Number,
    required: true
  },
  reviews: [
    {
      username: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ]
});

// Define the Restaurant model
const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

module.exports = Restaurant;
