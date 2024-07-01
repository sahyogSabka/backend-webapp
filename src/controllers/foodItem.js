const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/fooditem");
const { createObjectId } = require("../utils/createObjectId");
const bcrypt = require("bcryptjs");
const { createSecretKey } = require("../utils/createSecretKey");
const jwt = require("jsonwebtoken");
const { mongoValidationError } = require('../utils/mongoValidationError')
const { generateSignedUrlFromS3Url } = require('../utils/signedUrl')
const Category = require('../models/category')
const Joi = require('joi');

// Define a validation schema
const foodItemSchema = Joi.object({
  category: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  name: Joi.string().required(),
  imageUrl: Joi.string().uri(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  size: Joi.string().required(),
  restaurant: Joi.object({
    _id: Joi.string().required(), // Should match your mongoose ID type
    name: Joi.string().required(),
    address: Joi.string().required(),
    rating: Joi.number().required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string().uri(),
  }).required(),
  isVeg: Joi.boolean().required(),
  inStock: Joi.boolean().required(),
});

async function addFoodItem(req, res) {
  try {
    console.log('req.body ------------------------------- ', req.body);
    
    // Validate the request body against the schema
    const { error, value } = foodItemSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    
    // Convert the category.id and restaurant.id to ObjectId
    value.category._id = createObjectId(value.category._id);
    value.restaurant._id = createObjectId(value.restaurant._id);

    // Create the FoodItem object
    const foodItem = new FoodItem(value);

    console.log('foodItem ---------------------------------------------------------------------- ',foodItem);

    // Save the FoodItem object to the database
    let data = await foodItem.save();
    console.log('FoodItem ---------------------------- ', data);
    res.send({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, msg: error.message, error});
  }
}

async function categories(req, res) {
  try {
    console.log('req.body ------------------------------- ',req.body);
    let data = await Category.find({});
    res.send({ success: true, data });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({success: false, msg: error.message, error});
  }
}

module.exports = {
  addFoodItem,
  categories
};
