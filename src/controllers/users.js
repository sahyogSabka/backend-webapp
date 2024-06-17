const UserSchema = require('../models/user')
const createObjectId = require('../utils/createObjectId')

let defaultPassword = 'sahyog@123'

async function getAllUsers(req, res) {
  try {
    let data = await UserSchema.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

// async function getUserByidAndPassword(req, res) {
//   try {
//     let data = await UserSchema.find({})
//     res.send({success: true, data})
//   } catch (error) {
//     throw new Error(error);
//   }
// }

async function createUser(req, res) {
  const { restaurantName, restaurantAddress, typeid, mobile, email, password } = req.body
  try {
    let user = await UserSchema.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let type = {
      id: createObjectId(typeid)
    }

    user = new UserSchema({ name: restaurantName, mobile, email, type: {id: typeid, name: 'admin'}, password });
    await user.save();
    
  } catch (error) {
    throw new Error(error);
  }
}



module.exports = { getAllUsers };
