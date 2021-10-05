var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const fileupload = require("express-fileupload");
var indexRouter = require("./routes/userRouter");
var usersRouter = require("./routes/adminRouter");
var productRouter = require("./routes/productRouter");
var cartRouter = require("./routes/cartRouter");
const flash = require("express-flash");
var app = express();

require("./db")();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboardcat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      name: "Cookie",
      keys: ["key1", "key2"],
    },
  })
);
app.use(fileupload());
app.use(flash());

app.use("/", indexRouter);
app.use("/admin", usersRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

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
