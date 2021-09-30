const Table = require("../models/Table");
const productModel = require("../models/productModel");
const nodemailer = require("nodemailer");

function registerData(req, res, next) {
  var item = {
    fname: req.body.first_name,
    lname: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    dob: req.body.dob,
    password: req.body.password,
    mnumber: req.body.mnumber,
    gender: req.body.gender,
    address: req.body.address,
  };

  let tempData = Table(item);
  tempData.save((err, result) => {
    if (err) {
      throw err;
    } else {
      let a = "Data Insert Succesfully...";
      res.render("register", { msg: a });
    }
  });
}

function postData(req, res, next) {
  let user = req.body.username;
  let pass = req.body.password;

  Table.find({ username: user, password: pass })
    .then((user) => {
      // console.log("Ravi" + user);
      // console.log("Hiren" + user[0].username);
      // if (user.username == user) {
      //   // res.redirect("/");
      //   res.render("login", { msg5: "Username or Password Wrong" });
      // } else {
      //   if (user.password == pass) {
      //     res.render("login", { msg5: "Username or Password Wrong" });
      //   } else {

      //   }
      // }
      req.session.user = user[0].id;
      console.log(req.session.userid);
      res.redirect("/dashbord");
    })
    .catch((err) => {
      // console.log(err);
      res.render("login", { msg5: "Username or Password Wrong" });
    });
}

function getDashbord(req, res, next) {
  // console.log(req.session.userid);
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        productModel
          .find()
          .then((products) => {
            res.render("dashbord", { user: data, products: products });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
}

function profilePicture(req, res) {
  if (req.session.user) {
    let imgname = req.files.filename;
    console.log(imgname);

    imgname.mv(`public/images/${req.files.filename.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        Table.findById(req.session.user)
          .then((data) => {
            data.img = imgname.name;
            data
              .save()
              .then(() => {
                res.redirect("/dashbord");
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      }
    });

    // console.log(req.file);
  }
}

function editData(req, res) {
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        (data.fname = req.body.first_name),
          (data.lname = req.body.last_name),
          (data.email = req.body.email),
          (data.mnumber = req.body.mnumber),
          (data.gender = req.body.gender),
          (data.address = req.body.address),
          data
            .save()
            .then(() => {
              res.redirect("/dashbord");
            })
            .catch((err) => {
              throw err;
            });
      })
      .catch((err) => {
        throw err;
      });
  }
}

function changePassword(req, res) {
  if (req.session.user) {
    let oldpass = req.body.password;
    Table.findById(req.session.user)
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
                  return res.redirect("/dashbord");
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

function forgotPassword(req, res) {
  let forgotemail = req.body.forgotmail;
  Table.findOne({ email: forgotemail })
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
          res.render("login", { msg: "Password Send Successfully" });
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

module.exports = {
  registerData,
  postData,
  getDashbord,
  profilePicture,
  editData,
  changePassword,
  forgotPassword,
};
