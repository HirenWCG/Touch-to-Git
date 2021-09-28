const Table = require("../models/Table");

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
  let username = req.body.username;
  let password = req.body.password;

  Table.find({ username, password })
    .then((user) => {
      // console.log(user);
      if (!user) {
        res.redirect("/");
      } else {
        req.session.user = user[0].id;
        console.log(req.session.userid);
        res.redirect("/dashbord");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getDashbord(req, res, next) {
  // console.log(req.session.userid);
  if (req.session.user) {
    Table.findById(req.session.user)
      .then((data) => {
        res.render("dashbord", { user: data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/");
  }
}

function profilePicture(req, res) {
  if (req.session.user) {
    let imgname = req.file.filename;

    Table.findById(req.session.user)
      .then((data) => {
        data.img = imgname;
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
    console.log(req.file);
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
          res.render("dashbord", { msg1: msg1 });
        } else {
          let newpass = req.body.newpassword;
          if (oldpass == newpass) {
            let msg2 = "It's your current password please set new password";
            res.render("dashbord", { msg2: msg2 });
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
              res.render("dashbord", { msg3: msg3 });
            }
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = {
  registerData,
  postData,
  getDashbord,
  profilePicture,
  editData,
  changePassword,
};
