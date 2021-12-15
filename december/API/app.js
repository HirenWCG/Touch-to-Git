var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { engine: exphbs } = require("express-handlebars");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const _handlebars = require("handlebars");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: false,
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
    var user = await userAuthModel.findOne({ email: "admin@admin.com" });
    console.log("user...", user);
    // check if user is present in model or not
    if (user) {
      console.log("user is already exist");
    } else {
      // created an array
      const mydata = {
        name: "Admin",
        email: "admin@admin.com",
        mobile: "1234567890",
        password: "123456",
      };
      // store data in db
      var user = userAuthModel(mydata);
      user.save();
      console.log("user is inserted");
    }
  } catch (error) {
    console.log(error);
  }
}

// DB connection
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://test:test@localhost:27017/API")
  .then(() => console.log("Connection DB Open"))
  .then(isAdmin)
  .catch((err) => console.error(err));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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
