const Restaurant = require("../models/restaurant");
const FoodItem = require("../models/fooditem");
const { createObjectId } = require("../utils/createObjectId");
const bcrypt = require("bcryptjs");
const { createSecretKey } = require("../utils/createSecretKey");
const jwt = require("jsonwebtoken");
const { mongoValidationError } = require("../utils/mongoValidationError");
const { generateSignedUrlFromS3Url } = require("../utils/signedUrl");
const Mailer = require("../utils/mailer");

async function getAllRestaurants(req, res) {
  try {
    let data = await Restaurant.find({});
    let updatedData = [];
    for (let i = 0; i < data.length; i++) {
      let element = data[i].toObject();
      if (element.image) {
        let signedUrl = await generateSignedUrlFromS3Url(
          element.image,
          "sahyog-sabka"
        );
        element.image = signedUrl;
      }
      updatedData.push(element);
    }
    res.send({ success: true, data: updatedData });
  } catch (error) {
    throw new Error(error);
  }
}

async function getFooditemsByRestaurantId(req, res) {
  try {
    const fooditemObjectid = createObjectId(req.params.id);
    let data = await FoodItem.find({ "restaurant._id": fooditemObjectid });
    let updatedData = [];
    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      console.log('element -- ',element);
      if (element.imageUrl) {
        let signedUrl = await generateSignedUrlFromS3Url(
          element.imageUrl,
          "sahyog-sabka"
        );
        element.imageUrl = signedUrl;
      }
      updatedData.push(element);
    }

    res.send({ success: true, data: updatedData });
  } catch (error) {
    throw new Error(error);
  }
}

async function newRestaurantOnboardOnMail(data) {
  try {
    let htmlbody = `<div>
    There is a new Query to create restaurant with the below details.
    </div>
    <br/>
    <strong>
    <table>
      <tr>
        <td>Username</td>
        <td>${data._id}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>${data.name}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${data.email}</td>
      </tr>
      <tr>
        <td>Mobile</td>
        <td>${data.mobile}</td>
      </tr>
    </table>
    </strong>`;
    let subject = `New Restaurant Onboard`;

    await Mailer(htmlbody, subject);
  } catch (error) {
    throw new Error(error);
  }
}

async function createRestaurant(req, res) {
  let { name, address, rating, mobile, email, password } = req.body;
  try {
    // Create restaurant instance
    let restaurant = new Restaurant({
      name,
      address,
      rating,
      mobile,
      email,
      password,
    });

    // Save the restaurant to the database
    let savedRestaurant = await restaurant.save();
    let htmlbody = `<b>Hello ${name} We got your Query. We will get in touch with you soon.</b>`;
    let subject = `DriveFood`;
    let sendTo = [process.env.MYAPP_GMAIL_USER];

    if (savedRestaurant._id) {
      await Promise.all([
        Mailer(htmlbody, subject, sendTo),
        newRestaurantOnboardOnMail({
          _id: savedRestaurant._id,
          name: savedRestaurant.name,
          email: savedRestaurant.email,
          mobile: savedRestaurant.mobile,
        }),
      ]);
    }

    res.status(201).json({ success: true, data: savedRestaurant });
  } catch (error) {
    let Errormsg = mongoValidationError(error, "Mobile already exist.");
    res.status(500).json({
      success: false,
      status: "error",
      message: Errormsg.message,
    });
  }
}

async function loginRestaurant(req, res) {
  let { restaurantId, password } = req.body;
  try {
    let mongoObjectId = createObjectId(restaurantId, "Invalid userid.");

    const restaurant = await Restaurant.findById(mongoObjectId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, restaurant.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { restaurantId: restaurantId, restaurantName: restaurant.name },
      createSecretKey(),
      { expiresIn: "1h" }
    );

    // If password matches, return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: restaurant,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  getAllRestaurants,
  getFooditemsByRestaurantId,
  createRestaurant,
  loginRestaurant,
};
