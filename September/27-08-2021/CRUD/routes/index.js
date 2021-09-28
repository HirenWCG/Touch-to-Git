var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Table = require("../models/Table");
const {
  registerData,
  postData,
  getDashbord,
  profilePicture,
  editData,
  changePassword,
  forgotPassword,
} = require("../controller/usercontroller");
const session = require("express-session");
/* GET home page. */

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", function (req, res, next) {
  if (req.session.user) {
    res.redirect("/dashbord");
  } else {
    res.render("register");
  }
});

router.post("/", registerData);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", postData);

router.get("/dashbord", getDashbord);

router.get("/logout", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/login");
      }
    });
  }
});

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(
      null,
      // file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      file.originalname
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|PNG|JPG|JPEG|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).single("dp");

router.post("/profile-picture", imageUpload, profilePicture);

router.post("/edit-data", editData);

router.post("/change-password", changePassword);

router.post("/forgot-password", forgotPassword);

module.exports = router;
