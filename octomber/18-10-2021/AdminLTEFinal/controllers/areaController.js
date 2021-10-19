const cityModel = require("../models/cityModel");
const statesModel = require("../models/statesModel");
const areaModel = require("../models/areaModel");

function addArea(req, res) {
  if (req.session.admin) {
    cityModel
      .find(function (err, db_city_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(db_city_array);
          statesModel
            .find(function (err, db_state_array) {
              if (err) {
                console.log(err);
              } else {
                //Render User Array in HTML Table
                res.render("admin/area/add-area", {
                  city_array: db_city_array,
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

function postAddArea(req, res) {
  if (req.session.admin) {
    const mybodydata = {
      area_name: req.body.area_name,
      _city: req.body._city,
      _state: req.body._state,
    };

    console.log("Name is " + req.body.area_name);
    console.log("ID is " + req.body._city);
    console.log("ID is " + req.body._state);

    var data = areaModel(mybodydata);

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

function displayArea(req, res) {
  if (req.session.admin) {
    areaModel.find(function (err, db_area_array) {
      console.log("area model : ", db_area_array);
      if (err) res.json({ message: "There are no posts here." });

      areaModel
        .find({})
        .lean()
        .populate("_city")
        .populate("_state")
        .exec(function (err, db_area_array) {
          console.log("After population : ", db_area_array[0]);
          //  var area_array = db_area_array;
          //  console.log(JSON.stringify(db_area_array));
          //var area_array_store = (JSON.stringify(db_areas_array));
          // console.log("string area array", area_array_store);
          res.render("admin/area/display-area", { mydata: db_area_array });
        });
    });
  } else {
    res.redirect("/admin/login");
  }
}

function editArea(req, res) {
  if (req.session.admin) {
    // console.log(req.params.id);
    areaModel
      .findById(req.params.id, function (err, db_area_array) {
        if (err) {
          //   console.log("Edit Fetch Error " + err);
        } else {
          //   console.log(db_area_array);
          statesModel
            .find(function (err, db_state_array) {
              if (err) {
                // console.log(err);
              } else {
                //Render User Array in HTML Table
                // console.log("state_array is : ", db_state_array);
                cityModel
                  .find(function (err, db_city_array) {
                    if (err) {
                      //   console.log(err);
                    } else {
                      //Render User Array in HTML Table
                      //   console.log("db_city_array is : ", db_city_array);
                      res.render("admin/area/edit-area", {
                        mydata: db_area_array,
                        state_array: db_state_array,
                        city_array: db_city_array,
                      });
                    }
                  })
                  .lean();
                // res.render('area/edit-area', { mydata : db_area_array, state_array : db_state_array });
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

function postEditArea(req, res) {
  if (req.session.admin) {
    const mybodydata = {
      area_name: req.body.area_name,
      _city: req.body._city,
      _state: req.body._state,
    };

    areaModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
      if (err) {
        // console.log("Error in Record Update");
        res.redirect("/area/display");
      } else {
        // console.log("mybodydata is : ", mybodydata);
        res.redirect("/admin/area/display");
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

function deleteArea(req, res) {
  if (req.session.admin) {
    areaModel.findByIdAndDelete(req.params.id, function (err, project) {
      if (err) {
        //   console.log("Error in Record Delete " + err);
        throw err;
      } else {
        //   console.log("Record Deleted ");
        res.redirect("/admin/area/display");
      }
    });
  } else {
    res.redirect("/admin/login");
  }
}

module.exports = {
  addArea,
  postAddArea,
  displayArea,
  editArea,
  postEditArea,
  deleteArea,
};
