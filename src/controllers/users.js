const UserSchema = require('../models/user')
const restaurantSchema = require('../models/restaurant')
const {createObjectId} = require('../utils/createObjectId')
const RestaurantController = require('../controllers/restaurant')
const userController = require('../models/user')

let defaultPassword = 'Sahyog@123'

async function getAllUsers(req, res) {
  try {
    let data = await UserSchema.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

async function createOrUpdateUser(req, res) {
  // const { restaurantName, restaurantAddress, typeid, mobile, email, password } = req.body
  const { name, email, mobile, picture, address } = req.body
  try {
    // let user = await UserSchema.findOne({ mobile });
    // if (user) {
    //   return res.status(400).json({ message: 'User already exists' });
    // }

    // // create user
    // let userObj = {
    //   name, email, mobile, picture, address
    // }

    // userController.createUser(userObj)
    


    // // create user
    // let type = {
    //   id: createObjectId(typeid),
    //   name: 'admin'
    // }

    // user = new UserSchema({ name: restaurantName, mobile, email, type, password });
    // await user.save();
    
  } catch (error) {
    throw new Error(error);
  }
}



module.exports = { getAllUsers, createOrUpdateUser };
