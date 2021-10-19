const cityModel = require("../models/cityModel");
const statesModel = require("../models/statesModel");

function addCity(req, res) {
  if (req.session.admin) {
    statesModel
      .find(function (err, db_state_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(db_state_array);
          //Render User Array in HTML Table
          res.render("admin/city/add-city", { mydata: db_state_array });
        }
      })
      .lean();
  } else {
    res.redirect("/admin/login");
  }
}

function postAddCity(req, res) {
  if (req.session.admin) {
    console.log(req.body);

    //Create an Array
    const mybodydata = {
      city_name: req.body.city_name,
      _state: req.body._state,
    };

    // console.log("Name is " + req.body.city_name);
    // console.log("ID is " + req.body._state);

    var data = cityModel(mybodydata);

    data.save(function (err) {
      if (err) {
        console.log("Error in Insert Record");
      } else {
        res.redirect("add");
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

function displayCity(req, res) {
  if (req.session.admin) {
    cityModel.find(function (err, db_city_array) {
      // console.log("heyyy ", db_city_array);
      if (err) res.json({ message: "There are no posts here." });

      cityModel
        .find({})
        .lean()
        .populate("_state")
        .exec(function (err, db_city_array) {
          // console.log(db_city_array);
          res.render("admin/city/display-city", { mydata: db_city_array });
        });
    });
  } else {
    res.redirect("/admin/login");
  }
}

function editCity(req, res) {
  if (req.session.admin) {
    console.log(req.params.id);
    cityModel
      .findById(req.params.id, function (err, db_city_array) {
        if (err) {
          console.log("Edit Fetch Error " + err);
        } else {
          console.log(db_city_array);
          statesModel
            .find(function (err, db_state_array) {
              if (err) {
                console.log(db_state_array);
              } else {
                res.render("admin/city/edit-city", {
                  mydata: db_city_array,
                  state_array: db_state_array,
                });
              }
            })
            .lean();
        }
      })
      .lean();
  } else {
    res.redirect("/admin/login");
  }
}

function postEditCity(req, res) {
  const mybodydata = {
    city_name: req.body.city_name,
    _state: req.body._state,
  };

  cityModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
    if (err) {
      console.log("Error in Record Update");
      res.redirect("/admin/city/display");
    } else {
      res.redirect("/admin/city/display");
    }
  });
}

function deleteCity(req, res) {
  if (req.session.admin) {
    cityModel.findByIdAndDelete(req.params.id, function (err, project) {
      if (err) {
        console.log("Error in Record Delete " + err);
        res.redirect("/display");
      } else {
        console.log("Record Deleted ");
        res.redirect("/admin/city/display");
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

module.exports = {
  addCity,
  postAddCity,
  displayCity,
  editCity,
  postEditCity,
  deleteCity,
};
