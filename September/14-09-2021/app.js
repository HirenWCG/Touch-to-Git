const express = require("express");
const app = express();
const path = require("path");
var ejs = require("ejs");

app.use("/", require("./router"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000, () => {
  console.log("Server Run on Port : 3000");
});
