// const flash = require("express-flash");
const userModel = require("../models/userModel");
// const productModel = require("../models/productModel");

function postAdminLogin(req, res) {
  let adminusername = req.body.username;
  let adminpassword = req.body.password;
  //   let adminRole = "admin";
  //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaa" + adminusername);
  userModel
    .findOne({
      username: adminusername,
      password: adminpassword,
      role: "admin",
    })
    .then((data) => {
      if (data == null) {
        // console.log("hi null");
        // req.flash("error", "Invalid Credentials !!");
        res.render("adminLogin", {
          layout: "secondMain.handlebars",
          adminmsg: "You are Not Admin",
        });
      } else {
        // console.log("hi not null");
        req.session.admin = data._id;
        // req.flash("success", "Welcome!!");
        res.redirect("/admin/dashboard");
      }
    })
    .catch((err) => {
      throw err;
    });
  // res.render("admin/adminlogin");
}

function getAdminLogin(req, res) {
  res.render("adminLogin", {
    layout: "secondMain.handlebars",
    adminmsg: "You are Not Admin",
  });
}

function adminDashbord(req, res) {
  if (req.session.admin) {
    res.render("adminDashboard");
  } else {
    res.redirect("/admin/login");
  }
}

function adminlogout(req, res) {
  if (req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/admin/login");
      }
    });
  }
}

function changePassword(req, res) {
  if (req.session.admin) {
    res.render("adminChangePassword");
  } else {
    res.redirect("/admin/login");
  }
}

module.exports = {
  postAdminLogin,
  adminlogout,
  getAdminLogin,
  adminDashbord,
  changePassword,
};
