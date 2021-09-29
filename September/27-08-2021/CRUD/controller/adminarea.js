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
        res.render("admin/adminlogin", { adminmsg: "You are Not Admin" });
      } else {
        req.session.admin = data._id;
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
