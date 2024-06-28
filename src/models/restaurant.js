const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  cuisine: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 3
  },
  mobile: {
    type: String,
    required: [true, 'Mobile is required'],
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: 'https://sahyog-sabka.s3.eu-north-1.amazonaws.com/Restaurant/default-image.png'
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
