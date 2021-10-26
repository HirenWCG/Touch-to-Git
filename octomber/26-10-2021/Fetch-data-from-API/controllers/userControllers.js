const userModel = require("../models/userModel");
const saltedSha512 = require("salted-sha512");
const fetch = require("node-fetch");

function encryption(pwd) {
  return saltedSha512(pwd, "SUPER-S@LT!");
}

function numberCleaner(number) {
  return number.split("-").join("");
}

function userRegistration(req, res) {
  res.render("index");
}

function postUserRegistration(req, res) {
  console.log("hi");
  const item = {
    name: req.body.myname,
    username: req.body.username,
    email: req.body.email,
    number: numberCleaner(req.body.number),
    password: encryption(req.body.password),
  };

  console.log(item);
  let dataStore = userModel(item);
  dataStore.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send("Registred Succesfully...");
    }
  });
  console.log(item);
}

function userLogin(req, res) {
  res.render("login");
}

async function checkEmail(req, res) {
  try {
    console.log(req.query.email);
    let data = await userModel.findOne({ email: req.query.email });
    if (data) {
      console.log(data);
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    throw error;
  }
}

async function getUser(req, res) {
  let data = await userModel.find().lean();
  if (data) {
    res.send(data);
  } else {
    res.send("Data not Found");
  }
}

async function showUser(req, res) {
  const response = await fetch("http://localhost:3000/get-user");
  const data = await response.json();
  res.render("showData", { data });
}

module.exports = {
  userRegistration,
  postUserRegistration,
  userLogin,
  checkEmail,
  getUser,
  showUser,
  // postUserLogin,
};
