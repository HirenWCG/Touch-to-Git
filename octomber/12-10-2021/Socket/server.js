const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var path = require("path");

const PORT = 4113;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Socket
// const io = require("socket.io")(http);
// var socketMap = {};
// io.on("connection", (socket) => {
//   console.log("Connected...");
// var userId = socket.handshake.userId;
// if (!socketMap[userId]) socketMap[userId] = [];
// socketMap[userId].push(socket);
// console.log(userId);
//   socket.on("message", (msg) => {
//     socket.broadcast.emit("message", msg);
//   });
// });

// io.sockets.on('connection', function (socket) {
//   var userId = socket.handshake.userId;
//   if(!socketMap[userId]) socketMap[userId] = [];
//   socketMap[userId].push(socket);
// });
// var socketMap = [];

io.on("connection", function (socket) {
  const socketid = socket.id;

  socket.broadcast.emit("newConnection", socketid);

  socket.on("remove", (id) => {
    console.log("rm ", id);
    socket.emit("remove", id);
  });

  socket.on("adminMsg", (data) => {
    let id = data.id;
    let msg = data.msg;

    if (id == "All") {
      return socket.broadcast.emit("message", msg);
    }
    socket.to(id).emit("message", msg);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});
