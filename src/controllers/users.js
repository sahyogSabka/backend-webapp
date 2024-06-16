const UserSchema = require('../models/user')

async function getAllUsers(req, res) {
  try {
    let data = await UserSchema.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}

async function getUserByidAndPassword(req, res) {
  try {
    let data = await UserSchema.find({})
    res.send({success: true, data})
  } catch (error) {
    throw new Error(error);
  }
}



module.exports = { getAllUsers };
