var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "home.html");
});
app.post("/process_post", function (req, res) {
  // Prepare output in JSON format
  var response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_add: req.body.email_add,
    user_name: req.body.user_name,
    enter_pass: req.body.enter_pass,
  };
  console.log(response);
  res.end(JSON.stringify(response));
});
app.listen(3000, () => {
  console.log("Server Run on Port 3000");
});
