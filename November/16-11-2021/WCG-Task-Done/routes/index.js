var express = require("express");
var router = express.Router();
const multer = require("multer");
const userModel = require("../models/userModel");
var clearPage;
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
    let result = await userModel
      .find()
      .sort({ _id: -1 })
      .skip(0)
      .limit(3)
      .lean();
    let userCounts = await userModel.countDocuments({});
    let pages = [];
    clearPage = Math.ceil(userCounts / 3);
    for (i = 1; i <= Math.ceil(userCounts / 3); i++) {
      pages[i] = i;
    }
    res.render("index", { result: result, pages });
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
      console.log("IM HERE");
      await userModel(userData).save();
      let result = await userModel.find().sort({ _id: -1 }).limit(3);
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
router.post("/users", async (req, res) => {
  try {
    let sortingOrder = req.body.order ? req.body.order : -1;
    let sortingParameter = req.body.sortingId ? req.body.sortingId : "_id";
    let page = req.body.page ? req.body.page : 1;
    let skip = 3 * (page - 1);
    let sort = { [sortingParameter]: sortingOrder };

    let condition = {};

    if (req.body.searchTxt) {
      condition = {
        $or: [
          {
            firstName: {
              $regex: req.body.searchTxt,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: req.body.searchTxt,
              $options: "i",
            },
          },
          {
            address: {
              $regex: req.body.searchTxt,
              $options: "i",
            },
          },
        ],
      };
    }

    if (req.body.searchGender) {
      condition.gender = req.body.searchGender;
    }
    console.log(JSON.stringify(condition));
    res.send({
      type: "success",
      result: await userModel
        .find(condition)
        .sort(sort)
        .skip(skip)
        .limit(3)
        .lean(),
      page: Math.ceil((await userModel.countDocuments(condition)) / 3),
    });
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
    let data = await userModel.remove({ _id: req.params.id });
    if (data) {
      res.send({
        type: "success",
        result: req.params.id,
      });
    } else {
      res.send({ type: "error", message: "data not found" });
    }
  } catch (error) {
    res.send({ type: "error", message: "data not found" });
  }
});

module.exports = router;
