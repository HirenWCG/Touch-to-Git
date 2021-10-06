const flash = require("express-flash");
const admin = require("../models/admin");
const productModel = require("../models/productModel");

function adminArea(req, res) {
  let auth = 1;
  let adminusername = req.body.username;
  let adminpassword = req.body.password;
  admin
    .findOne({ username: adminusername, password: adminpassword, auth: auth })
    .then((data) => {
      if (data == null) {
        req.flash("error", "Invalid Credentials !!");
        res.redirect("/admin");
      } else {
        req.session.admin = data._id;
        req.flash("success", "Welcome!!");
        res.redirect("/admin/dashbord");
      }
    })
    .catch((err) => {
      throw err;
    });
  // res.render("admin/adminlogin");
}

function adminlogout(req, res) {
  if (req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/admin");
      }
    });
  }
}
module.exports = {
  adminArea,
  adminlogout,
};
