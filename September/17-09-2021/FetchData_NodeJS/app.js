const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const bodyParser = require("body-parser");

http
  .createServer((req, res) => {
    const urlparse = url.parse(req.url, true);

    if (urlparse.pathname == "/" && req.method == "GET") {
      fs.readFile(path.join(__dirname, "index.html"), function (error, data) {
        if (error) {
          res.writeHead(404);
          res.write("Contents you are looking are Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
        }

        res.end();
      });
    }
    if (urlparse.pathname == "/data" && req.method == "POST") {
      res.end("Hello");
    }
  })
  .listen(3000, () => {
    console.log("Servr Run on 3000 Port");
  });
