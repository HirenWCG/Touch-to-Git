const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
var chatData = require("./models/userData");
var connect = require("./dbconnection");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/demo.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    connect.then((db) => {
      // console.log("connected");
      console.log(msg);

      let chatMessage = new chatData({ message: msg });
      chatMessage.save();
    });
  });
});

app.get("/display", (req, res) => {
  connect.then((db) => {
    console.log("connected");

    chatData.find({}).then((chat) => {
      for (i = 0; i < chat.length; i++) {
        res.send(chat[i].message + "<br>");
      }
    });
  });
});

server.listen(4001, () => {
  console.log("listening on *:4001");
});
