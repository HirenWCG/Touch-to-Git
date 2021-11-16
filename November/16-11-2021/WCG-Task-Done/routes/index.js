var express = require("express");
var router = express.Router();
const multer = require("multer");
const userModel = require("../models/userModel");

// File or Photos upload using Multer
const imageStorage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Set images filesize
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000,
  },
});

// GET home page.
router.get("/", async function (req, res, next) {
  try {
    let result = await userModel.find().sort({ _id: -1 }).skip(0).limit(5);
    let data = await userModel.find({}).count();
    console.log("Count", data);
    res.render("index", { result: result });
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

// Registration Route
router.post("/", imageUpload.single("image"), async (req, res) => {
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

    // if required for edit user data
    if (req.body._id) {
      let data = await userModel.findByIdAndUpdate(req.body._id, userData);
      if (data) {
        res.send({
          type: "update",
          result: data,
        });
      } else {
        res.send({ type: "error", message: "data not found" });
      }
    } else {
      let result = await userModel(userData).save();
      if (result) {
        res.send({
          type: "success",
          result: result,
        });
      } else {
        res.send({ type: "error", message: "data not found" });
      }
    }
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

// Data-Sorting Route
router.post("/sorting-pagination", async (req, res) => {
  try {
    var sortingOrder;
    var sortingParameter;
    var skip = 0;

    if (req.body.type == "sorting") {
      sortingParameter = req.body.sortingId;
      sortingOrder = req.body.order;
    }

    if (req.body.type == "pagination") {
      skip = 5 * (req.body.page - 1);
      sortingOrder = req.body.sortingOrder;
      sortingParameter = req.body.sortingParameter;
    }

    var sort = {};
    sort[sortingParameter] = sortingOrder;

    let data = await userModel.find({}).sort(sort).skip(skip).limit(5);
    if (data) {
      res.send({
        type: "success",
        result: data,
      });
    }
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

// Data Find using userId
router.get("/:id", async (req, res) => {
  try {
    let result = await userModel.findOne({ _id: req.params.id });
    if (result) {
      res.send({
        type: "success",
        result: result,
      });
    } else {
      res.send({ type: "error", message: "data not found" });
    }
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

// Delete Route, Data delete with userId
router.delete("/delete/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    let data = await userModel.remove({ _id: userId });
    if (data) {
      res.send({
        type: "success",
        result: userId,
      });
    } else {
      res.send({ type: "error", message: "data not found" });
    }
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

module.exports = router;
