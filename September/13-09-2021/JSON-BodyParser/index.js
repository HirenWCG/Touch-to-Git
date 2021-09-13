const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.listen("3000", () => {
  console.log("Server Run on Port 3000");
});
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.post("/post", (req, res) => {
  let a = req.body.name;
  res.send(a);
});
