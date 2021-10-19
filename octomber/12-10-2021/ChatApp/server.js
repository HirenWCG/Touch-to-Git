const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3090;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));
// console.log("aaaaaaaaaaaaaaaaaaaa" + socketid);
// app.use(function (req, res, next) {

//   next();
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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

var socketMap = [];
console.log(socketMap);

io.on("connection", function (socket) {
  socketid = socket.id;
  console.log(socketid);
  socketMap.push(socketid);
  console.log(socketMap);
  // res.socketid = socketid;
  //
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
