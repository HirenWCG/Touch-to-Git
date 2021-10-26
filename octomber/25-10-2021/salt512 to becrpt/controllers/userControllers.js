const userModel = require("../models/userModel");
const saltedSha512 = require("salted-sha512");

function encryption(pwd) {
  return saltedSha512(pwd, "SUPER-S@LT!");
}

function userRegistration(req, res) {
  res.render("index");
}

function postUserRegistration(req, res) {
  const item = {
    name: req.body.myname,
    username: req.body.username,
    email: req.body.email,
    password: encryption(req.body.password),
  };

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

async function postUserLogin(req, res) {
  try {
    let data = await userModel.findOne({ email: req.body.email });
    if (data) {
      if (
        data.email == req.body.email &&
        data.password == encryption(req.body.password)
      ) {
        res.send("This is your dashboard");
      } else {
        res.send("Email or Passeord is Wrong...");
      }
    } else {
      re.redirect("/login");
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  userRegistration,
  postUserRegistration,
  userLogin,
  postUserLogin,
};

{
  let test = 0;
}
