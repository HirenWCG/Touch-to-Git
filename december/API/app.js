var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { engine: exphbs } = require("express-handlebars");
const mongoose = require("mongoose");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const _handlebars = require("handlebars");

//global configurations
global.config = require("./config/config.json");

//global functions
require("./helpers/global-functions");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "../layout",
    handlebars: allowInsecurePrototypeAccess(_handlebars),
  })
);
app.set("view engine", "handlebars");

// require user model
var userAuthModel = require("./models/userModel");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/*
fuction to check user(admin) is stored or not.
if stored then log(user is available)
else insert admin in userAuth model
*/
async function isAdmin(value) {
  try {
    const user = await userAuthModel
      .findOne({ email: config.default.user.email }, { _id: 1 })
      .lean();
    // check if user is present in model or not
    if (user) {
      console.log("user is already exist");
    } else {
      // store data in db
      await userAuthModel.create(config.default.user);
      console.log("user is inserted");
    }
  } catch (error) {
    console.log("Error while adding default user", error);
  }
}

// DB connection
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb://" +
      config.mongoDB.user +
      ":" +
      config.mongoDB.pwd +
      "@" +
      config.mongoDB.host +
      ":" +
      config.mongoDB.port +
      "/" +
      config.mongoDB.db
  )
  .then(() => console.log("Connection DB Open"))
  .then(isAdmin)
  .catch((err) => console.error(err));
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
