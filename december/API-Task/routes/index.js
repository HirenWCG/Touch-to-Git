var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

function authJWT(req, res, next) {
  // console.log(req.cookies.token);
  let token = req.cookies.token;
  // token = token.split(" ")[1];
  const privateKey = "erhvfmyoaswlbhrfmasuypolncasteif";
  jwt.verify(token, privateKey, function (err, docs) {
    if (err) {
      // res.send({ message: "please login first..." });
      res.redirect("/api/login");
    } else {
      next();
    }
  });
}

router.get("/getUsers", async (req, res) => {
  let users = await userModel.find();
  res.json({
    type: "success",
    statusCode: 200,
    users: users,
    // loggedInUser: req.user.userEmail,
  });
});

router.get("/register", authJWT, async (req, res) => {
  try {
    // let users = await userModel.find({}).lean();
    // console.log(users);
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/register",
  [
    check("email", "Email length should be 10 to 30 characters")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("name", "Name length should be 10 to 20 characters").isLength({
      min: 2,
      max: 20,
    }),
    check("number", "Mobile number should contains 10 digits").isLength({
      min: 10,
      max: 10,
    }),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  authJWT,
  async (req, res) => {
    const item = {
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.number,
      password: req.body.password,
    };
    let user = await userModel.findOne({
      $or: [{ email: req.body.email }, { mobileNumber: req.body.number }],
    });
    if (user) {
      res.send({
        type: "error",
        message: "this email or mobile number already used...",
      });
    } else {
      let dataStore = userModel(item);
      dataStore.save(async function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // let allUsers = await userModel.find({}).lean();
          // console.log(allUsers);
          res.json({ result: item });
        }
      });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    let data = await userModel
      .findOne({
        $or: [{ email: req.body.email }, { mobileNumber: req.body.email }],
      })
      .lean();
    console.log(data);
    if (data) {
      const privateKey = "erhvfmyoaswlbhrfmasuypolncasteif";
      let params = { email: data.email, name: data.name };
      let token = await jwt.sign(params, privateKey, { expiresIn: "1000s" });
      res.cookie("token", token);
      if (data.password == req.body.password) {
        res.redirect("/api/register");
      } else {
        res.send("password invalid...");
      }
    } else {
      res.send("user not found...");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
