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

async function addUser(obj) {
  try {
    return await UserSchema.create({ ...obj })
  } catch (error) {
    throw new Error(error);
  }
}

async function updateUser(id , obj) {
  try {
    return await UserSchema.updateOne( { _id: createObjectId(id) } , { ...obj });
  } catch (error) {
    throw new Error(error);
  }
}

async function createUser(req, res) {
  const { name, picture, email } = req.body
  try {
    let user = await UserSchema.findOne({ email });
    if (!user) {
      user = await addUser({ name, picture, email, type: {id: '666d62b8f447d3be1433fb7d', name: 'customer'} })
      return res.status(200).json({ success: true, msg: 'User is successfully created.', user })
    }
    return res.status(200).json({ success: true, msg: 'User is already created.', user })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
}



module.exports = { getAllUsers, createUser };
