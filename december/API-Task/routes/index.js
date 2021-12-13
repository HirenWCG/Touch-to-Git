var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

router.get("/register", authJWT, async (req, res) => {
  try {
    let users = await userModel.find({}).lean();
    console.log(users);
    res.render("index", { users: users });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", authJWT, async (req, res) => {
  console.log(req.body);
  const item = {
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.number,
    password: req.body.password,
  };
  console.log("this is item", item);
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
    dataStore.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json({ result: item });
      }
    });
  }
});

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

router.post("/profile", authJWT, (req, res) => {
  res.send("im about page...");
});

module.exports = router;
