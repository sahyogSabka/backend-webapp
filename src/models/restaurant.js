const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.password; // also remove the password field from the response
      return ret;
    }
  }
});

// Encrypt password before saving
restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

restaurantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define the Restaurant model
const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

module.exports = Restaurant;
