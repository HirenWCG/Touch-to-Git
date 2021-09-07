var http = require("http");
const fs = require("fs");
var path = require("path");
var fun = require("./about.js");

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.write("Hello World");
    res.write(fun.about(1000));
    res.fs.readFile(path.join(__dirname, "public", "hi.html"), (err, data) => {
      if (err) {
        throw err;
      }
      // res.write("Hi");
      res.write(data);
      // res.end("Hello World");
      res.end();
    });
  })
  .listen(3000);
console.log("server run on port 3000");
