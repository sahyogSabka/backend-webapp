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
  _id: Joi.string(),
  category: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  name: Joi.string().required(),
  image: Joi.string(),
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
    isActive: Joi.boolean()
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

    // Save the FoodItem object to the database
    let data = await foodItem.save();
    res.send({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, msg: error.message, error});
  }
}
async function editFoodItem(req, res) {
  try {
    console.log('req.body ------------------------------- ', req.body);

    // Validate the request body against the schema
    const { error, value } = foodItemSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let id = value._id || null
    if (id) {
      id = createObjectId(id)
    } else {
      return res.status(400).send('Id not found');
    }

    // Convert string IDs to mongoose ObjectId
    value.category._id = createObjectId(value.category._id);
    value.restaurant._id = createObjectId(value.restaurant._id);

    // Find the existing FoodItem by ID and update it
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      {
        $set: {
          category: value.category,
          name: value.name,
          imageUrl: value.imageUrl,
          description: value.description,
          price: value.price,
          size: value.size,
          restaurant: value.restaurant,
          isVeg: value.isVeg,
          inStock: value.inStock
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedFoodItem) {
      return res.status(404).send('FoodItem not found');
    }

    console.log('Updated FoodItem ---------------------------- ', updatedFoodItem);
    res.send({ success: true, data: updatedFoodItem });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: error.message, error });
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
  categories,
  editFoodItem
};
