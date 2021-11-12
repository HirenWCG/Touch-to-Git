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
    res.render("index", { result: result });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", imageUpload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    if (req.body._id) {
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
      let data = await userModel.findByIdAndUpdate(req.body._id, userData, {
        new: true,
      });
      console.log("new data-------------------", data);
      if (data) {
        res.send({
          type: "update",
          result: data,
        });
      } else {
        console.log("data not found...");
      }
    } else {
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
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let result = await userModel.findOne({ _id: req.params.id });
    if (result) {
      res.send({
        type: "success",
        result: result,
      });
    } else {
      console.log("data not found...");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    let data = await userModel.remove({ _id: userId });
    if (data) {
      res.send({
        type: "success",
        result: userId,
      });
    } else {
      console.log("error found");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
