const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/fooditem");
const { createObjectId } = require("../utils/createObjectId");
const bcrypt = require("bcryptjs");
const { createSecretKey } = require("../utils/createSecretKey");
const jwt = require("jsonwebtoken");
const { mongoValidationError } = require('../utils/mongoValidationError')
const { generateSignedUrlFromS3Url } = require('../utils/signedUrl')
const Category = require('../models/category')

async function addFoodItem(req, res) {
  try {
    console.log('req.body ------------------------------- ',req.body);
    // let data = await FoodItem.find({});
    res.send({ success: true, data: {} });
  } catch (error) {
    throw new Error(error);
  }
}

async function categories(req, res) {
  try {
    console.log('req.body ------------------------------- ',req.body);
    let data = await Category.find({});
    res.send({ success: true, data });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  addFoodItem,
  categories
};
