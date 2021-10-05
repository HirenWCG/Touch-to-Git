var express = require("express");
var router = express.Router();
const UsersModel = require("../model/userModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-users-api", function (req, res, next) {
  UsersModel.find({}, function (err, mydata) {
    if (err) {
      res.send(JSON.stringify({ flag: 0, message: "Error", err: err }));
    } else {
      res.send(
        JSON.stringify({ flag: 1, message: "data listing", data: mydata })
      );
    }
  });
});
/*Get single data by id */
router.get("/get-users-details-api/:id", function (req, res, next) {
  UsersModel.findById(req.params.id, function (err, mydata) {
    if (err) {
      res.send(JSON.stringify({ flag: 0, message: "Error", err: err }));
    } else {
      res.send(
        JSON.stringify({ flag: 1, message: "data listing", data: mydata })
      );
    }
  });
});

router.get("/add-users-api", function (req, res, next) {
  res.render("/add-users-api");
});
//add all data
router.post("/users", function (req, res, next) {
  console.log(req.body);
  const mybodydata = {
    user_name: req.body.username,
    user_email: req.body.useremail,
  };

  UsersModel.create(mybodydata)
    .then((users) => {
      res.send(JSON.stringify({ flag: 1, message: "record added" }));
    })
    .catch((err) => {
      res.send(
        JSON.stringify({ flag: 0, message: "Error in api ", err: err.message })
      );
    });
  // var data = UsersModel(mybodydata);
  // data.save(function (err) {
  //   if (err) {
  //     res.send(
  //       JSON.stringify({ flag: 0, message: "Error in api ", err: err.message })
  //     );
  //   } else {
  //     res.send(JSON.stringify({ flag: 1, message: "record added" }));
  //   }
  // });
});

//delete data  by id
router.delete("/delete-users-api/:id", function (req, res, next) {
  UsersModel.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      res.send(JSON.stringify({ flag: 0, message: "Error", err: err }));
    } else {
      res.send(JSON.stringify({ flag: 1, message: "data deleted" }));
    }
  });
});
//update data by id
router.put("/update-users-api/:id", function (req, res, next) {
  console.log(req.params.id);
  var data = {
    user_name: req.body.user_name,
    user_password: req.body.user_password,
  };
  UsersModel.findByIdAndUpdate(req.params.id, data, function (err, post) {
    if (err) {
      res.send(JSON.stringify({ flag: 0, message: "Error", err: err }));
    } else {
      res.send(JSON.stringify({ flag: 1, message: "data updated" }));
    }
  });
});

module.exports = router;
