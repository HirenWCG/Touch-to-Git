var express = require("express");
var router = express.Router();
const multer = require("multer");
const userModel = require("../models/userModel");

const imageStorage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000,
  },
});
/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let result = await userModel.find();
    console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", result);
    res.render("index", { result: result });
  } catch (error) {
    console.log(error);
  }
});

router.post("/submitData", imageUpload.single("image"), async (req, res) => {
  try {
    let splitHobbiesArray = req.body.hobbies.split(",");
    let userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      gender: req.body.gender,
      hobbies: splitHobbiesArray,
      city: req.body.city,
      images: req.body.images,
    };
    console.log("Hiren", userData);
    let result = await userModel(userData).save();
    if (result) {
      res.send({
        type: "success",
        result: result,
      });
      console.log("register Succesfully...");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
