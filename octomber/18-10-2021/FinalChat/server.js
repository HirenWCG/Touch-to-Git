const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const moment = require("moment");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
var indexRouter = require("./routes/index");
var chatModel = require("./models/chatModel");
const app = express();
require("./db");
const server = http.createServer(app);
const io = socketio(server);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("room", (room) => {
    chatModel
      .find({ roomName: room })
      .then((data) => {
        // Welcome current user
        socket.emit("alldata", data);
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
      })
      .catch((err) => {
        throw err;
      });
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  // Listen for chatMessage
  socket.on("chatMessage", ({ msg, username, room }) => {
    const user = userJoin(socket.id, username, room, msg);
    let data = {
      socketId: user.id,
      senderName: user.username,
      roomName: user.room,
      senderMsg: msg,
      msgTime: moment().format("h:mm a"),
    };
    let temp = chatModel(data);
    temp.save();
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
