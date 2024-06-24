const UserSchema = require('../models/user')
const restaurantSchema = require('../models/restaurant')
const {createObjectId} = require('../utils/createObjectId')
const RestaurantController = require('../controllers/restaurant')

let defaultPassword = 'Sahyog@123'

async function getAllUsers(req, res) {
  try {
    let data = await UserSchema.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

async function createUser(req, res) {
  const { restaurantName, restaurantAddress, typeid, mobile, email, password } = req.body
  try {
    let user = await UserSchema.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create restaurant
    let restaurantObj = {
      name: restaurantName,
      cuisine: 'Indian',
      address: restaurantAddress,
      rating: 4,
      mobile,
      email,
      password
    }

    RestaurantController.createRestaurant(restaurantObj)
    


    // create user
    let type = {
      id: createObjectId(typeid),
      name: 'admin'
    }

    user = new UserSchema({ name: restaurantName, mobile, email, type, password });
    await user.save();
    
  } catch (error) {
    throw new Error(error);
  }
}



module.exports = { getAllUsers };
