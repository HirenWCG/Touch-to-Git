const http = require("http");
const fs = require("fs");
const path = require("path");
http
  .createServer(async (req, res) => {
    //set the request route
    if (req.url === "/api" && req.method === "GET") {
      //response headers
      res.writeHead(200, { "Content-Type": "text/html" });
      //set the response
      fs.readFile(path.join(__dirname, "public", "about.html"), (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        res.write(data);
        res.end();
      });
      //end the response
    } else if (req.url === "/" && req.method === "GET") {
      //response headers
      res.writeHead(200, { "Content-Type": "text/html" });
      //set the response
      fs.readFile(path.join(__dirname, "public", "index.html"), (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        res.write(data);
        res.end();
      });
    }

    // If no route present
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  })
  .listen(3000);
console.log("server run on port 3000");
