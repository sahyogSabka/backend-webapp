const express = require("express");
const FoodItemController = require('../controllers/foodItem')
const upload = require('../middlewares/multer.middleware');
const { processImageUrl } = require("../utils/signedUrl");

const router = express.Router();

router.post("/create", upload.single('image'), (req, res) => {
  return FoodItemController.addFoodItem(req, res)
});

router.post("/update", upload.single('image'), (req, res) => {
  return FoodItemController.editFoodItem(req, res)
});

router.get("/categories", (req, res) => {
  return FoodItemController.categories(req, res)
});

router.post("/createsignedurl", async (req, res) => {
  try {
    let { url } = req.body
    let signedUrl = await processImageUrl(url)
    res.send({ success: true, data: { signedUrl} })
  } catch (error) {
    console.error('Error in createSignedUrl:', error);
    res.status(500).send({ success: false, msg: error.message, error });
  }
});

module.exports = router;
