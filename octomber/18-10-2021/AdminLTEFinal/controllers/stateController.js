const statesModel = require("../models/statesModel");

function addStates(req, res) {
  if (req.session.admin) {
    res.render("admin/states/add-state");
  } else {
    res.redirect("/admin/login");
  }
}

function postAddStates(req, res) {
  const mybodydata = {
    state_name: req.body.state_name,
  };
  var data = statesModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.render("admin/states/add-state");
    }
  });
}

function displayStates(req, res) {
  if (req.session.admin) {
    statesModel
      .find(function (err, db_states_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(db_states_array);
          //Render User Array in HTML Table
          res.render("admin/states/display-state", { mydata: db_states_array });
        }
      })
      .lean();
  } else {
    res.redirect("/admin/login");
  }
}

function editStates(req, res) {
  if (req.session.admin) {
    res.render("admin/states/edit-state");
  } else {
    res.redirect("/admin/login");
  }
}

function postEditStates(req, res) {
  //   console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    state_name: req.body.state_name,
  };

  statesModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
    if (err) {
      //   console.log("Error in Record Update");
      res.redirect("/admin/states/display-state");
    } else {
      res.redirect("/admin/states/display");
    }
  });
}

function deleteStates(req, res) {
  console.log(req.params.id);
  statesModel.findByIdAndDelete(req.params.id, function (err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
      // res.redirect('/admin/states/display');
    } else {
      console.log(" Record Deleted ");
      res.redirect("/admin/states/display");
    }
  });
}
module.exports = {
  addStates,
  postAddStates,
  displayStates,
  editStates,
  postEditStates,
  deleteStates,
};
