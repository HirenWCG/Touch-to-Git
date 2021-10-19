// const flash = require("express-flash");
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
// const subCategory = require("../models/subCategoryModel");
const nodemailer = require("nodemailer");
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
      console.log(data);
      if (data == null) {
        // console.log("hi null");
        // req.flash("error", "Invalid Credentials !!");
        console.log("aaaaaaaaaaaaaa");
        res.render("admin/adminDashboard/adminLogin", {
          layout: "secondMain.handlebars",
          adminmsg: "You are Not Admin",
        });
      } else {
        console.log("bbbbbbbbbbbbbbbbbbbbb");
        // console.log("hi not null");
        console.log("===================");
        req.user = "test";
        debugger;
        console.log(req.session);
        req.session.admin = data._id;
        console.log(req.session);
        console.log(req.session.admin);
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
  res.render("admin/adminDashboard/adminLogin", {
    layout: "secondMain.handlebars",
    adminmsg: "You are Not Admin",
  });
}

function adminDashbord(req, res) {
  debugger;
  console.log("+=====");
  console.log(req.session.admin);
  console.log(req.user);
  if (req.session.admin) {
    res.render("admin/adminDashboard/adminDashboard");
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
    res.render("admin/adminDashboard/adminChangePassword");
  } else {
    res.redirect("/admin/login");
  }
}

function postChangePassword(req, res) {
  if (req.session.admin) {
    let oldpass = req.body.password;
    userModel
      .findById(req.session.admin)
      .then((data) => {
        console.log(data);
        if (oldpass != data.password) {
          let msg1 = "Enter Your Old Password";
          res.json({ msg: msg1 });
          // res.render("dashbord", { msg1: msg1 });
          // res.redirect("/dashbord")
        } else {
          let newpass = req.body.newpassword;
          if (oldpass == newpass) {
            let msg2 = "It's your current password please set new password";
            // res.render("dashbord", { msg2: msg2 });
            res.json({ msg: msg2 });
          } else {
            let newpass = req.body.newpassword;
            let repass = req.body.repassword;
            if (newpass == repass) {
              data.password = newpass;
              data
                .save()
                .then(() => {
                  return res.redirect("/admin/dashboard");
                })
                .catch((err) => {
                  throw err;
                });
            } else {
              let msg3 = "Password not match";
              // res.render("dashbord", { msg3: msg3 });
              res.json({ msg: msg3 });
            }
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

function showallusers(req, res) {
  if (req.session.admin) {
    userModel
      .find({ role: "user" })
      .lean()
      .then((data) => {
        res.render("admin/adminDashboard/adminShowAllUsers", { data });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function forgotPassword(req, res) {
  res.render("admin/adminDashboard/adminForgotPassword", {
    layout: "secondMain.handlebars",
  });
}

function postForgotPassword(req, res) {
  let forgotemail = req.body.forgotmail;
  userModel
    .findOne({ email: forgotemail })
    .then((data) => {
      if (data == null) {
        return res.json({ msg: "Please Enter Registred Email Address..." });
      } else {
        let pass = data.password;
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "herrypottar21@gmail.com", // generated ethereal user
              pass: "herry123!@#", // generated ethereal password
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Webcodegeine" <herrypottar21@gmail.com>', // sender address
            to: forgotemail, // list of receivers
            subject: "Your Password is Received", // Subject line
            html: `<h1>Your Password is: ${pass}</h1>`, // html body
          });
          res.redirect("/admin/login");
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);
      }
    })
    .catch((err) => {
      throw err;
    });
}

function addProducts(req, res) {
  if (req.session.admin) {
    categoryModel
      .find()
      .lean()
      .then((categoryData) => {
        console.log(categoryData);
        res.render("admin/adminDashboard/adminAddProducts", { categoryData });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res.redirect("/admin/login");
  }
}

function postAddProducts(req, res) {
  if (req.session.admin) {
    // console.log(req.files.pimg);
    var item = {
      product_name: req.body.pname,
      product_detail: req.body.pdetails,
      product_price: req.body.productprice,
      product_image: req.files.pimg.name,
      product_categorie: req.body.categorie_name,
    };

    let img = req.files.pimg;

    let tempData = productModel(item);

    img.mv(`public/productsImages/${req.files.pimg.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        tempData.save((err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/admin/dashbord");
          }
        });
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

// function addCategory(req, res) {
//   if (req.session.admin) {
//     res.render("admin/category/addCategory");
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function postAddCategory(req, res) {
//   const mybodydata = {
//     categoryName: req.body.category,
//   };
//   var data = categoryModel(mybodydata);

//   data
//     .save()
//     .then((data) => {
//       res.redirect("/admin/category/add");
//     })
//     .catch((err) => {
//       throw err;
//     });
// }

// function displayCategory(req, res) {
//   if (req.session.admin) {
//     categoryModel
//       .find()
//       .lean()
//       .then((data) => {
//         res.render("admin/category/displayCategory", { data });
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function addsubCategory(req, res) {
//   if (req.session.admin) {
//     categoryModel
//       .find()
//       .lean()
//       .then((data) => {
//         res.render("admin/subcategory/addSubCategory", { data });
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }
// function postAddsubCategory(req, res) {
//   if (req.session.admin) {
//     const mybodydata = {
//       subCategoryName: req.body.subCategory,
//       _category: req.body._category,
//     };
//     var data = subCategory(mybodydata);
//     data
//       .save()
//       .then((data) => {
//         res.redirect("/admin/subcategory/display");
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }
// function displaysubCategory(req, res) {
//   if (req.session.admin) {
//     subCategory
//       .find()
//       .populate("_category")
//       .lean()
//       .then((data) => {
//         // console.log(data);
//         res.render("admin/subcategory/displaySubCategory", { data });
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function editCategory(req, res) {
//   if (req.session.admin) {
//     res.render("admin/category/editCategory");
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function postEditCategory(req, res) {
//   if (req.session.admin) {
//     let a = req.params.id;
//     let b = req.body.editCategory;
//     categoryModel
//       .findByIdAndUpdate(a, { categoryName: b })
//       .then((data) => {
//         console.log(data);
//         res.redirect("/admin/category/display");
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function subEditCategory(req, res) {
//   if (req.session.admin) {
//     res.render("admin/subcategory/editSubCategory");
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function postSubEditCategory(req, res) {
//   if (req.session.admin) {
//     let a = req.params.id;
//     // console.log("aaaaaaaaaaaaaaaaaaaaaa" + a);
//     let b = req.body.editCategory;
//     subCategory
//       .findByIdAndUpdate(a, { subCategoryName: b })
//       .then((data) => {
//         console.log(data);
//         res.redirect("/admin/subcategory/display");
//       })
//       .catch((err) => {
//         throw err;
//       });
//   } else {
//     res.redirect("/admin/login");
//   }
// }

// function getSubcategoryById(req, res) {
//   subCategory
//     .find({ _category: req.params.id })
//     .then((data) => {
//       res.send({
//         type: "success",
//         data: data,
//       });
//     })
//     .catch((err) => {
//       res.send({
//         type: "error",
//         messsage: err.message,
//       });
//     });
// }

module.exports = {
  postAdminLogin,
  adminlogout,
  getAdminLogin,
  adminDashbord,
  changePassword,
  postChangePassword,
  showallusers,
  forgotPassword,
  postForgotPassword,
  addProducts,
  postAddProducts,
};
