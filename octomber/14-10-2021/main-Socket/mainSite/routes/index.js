// var router = require('express');
// var express = require('express');
var express = require("express");
var chatData = require("../models/userData");
var app = express();
var http = require("http").createServer(app);
var router = express.Router();

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:4000",
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//   console.log("Connected port in 3000");
//   socket.on('chat message', (msg) => {
//     // console.log("msg");
//     // console.log(msg);
//     const inputData = {
//           message : msg
//         }
//         var data = chatData(inputData)
//         data.save(function (err) {
//           if (err) {
//             console.log("Error in Insert Record  " + err);
//           } else {
//             console.log("Data Saved")

//           }
//         })
//   })
// });
room = "123";

io.on("connection", (socket) => {
  console.log("Socket information : ", socket.id);
  // socket.broadcast.emit('chat message' , "Hi");

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // chatData.deleteMany({"socketId" : socket.id})
  });

  socket.on("room", (room) => {
    console.log("Room Information :-", room);
    socket.join(room);
  });

  socket.on("room message", (msg, senderName) => {
    console.log("Room message ", msg);
    io.in(room).emit("chat message", msg, senderName);
  });

  socket.on("chat message", (msg, senderName, receiverName) => {
    const inputData = {
      message: msg,
      senderName: senderName,
      receiverName: receiverName,
      socketId: socket.id,
    };

    var data = chatData(inputData);

    data.save(function (err) {
      if (err) {
        console.log("Error in Insert Record");
      } else {
        console.log("Data Inserted");
      }
    });

    chatData.updateMany(
      { senderName: senderName },
      { $addToSet: { socketId: socket.id } },
      function (err, data) {
        console.log("Update Function data ", data);
        if (err) {
          console.log("Error in insert data ", err);
        } else {
          console.log(data);
          console.log("Input Data saved and data is ", inputData);
        }
      }
    );

    // var data = chatData(inputData)
    // data.save(function (err) {
    //   if (err) {
    //     console.log("Error in Insert Record  " + err);
    //   } else {
    //     console.log("Data Saved")

    //     // io.emit("chat message" , msg)
    //   }
    // })
    chatData.findOne(
      { senderName: receiverName },
      function (err, dataOfReceiver) {
        if (err) {
          console.log("Error in receiverName : ", err);
        } else if (dataOfReceiver == null) {
          console.log("Fateched Receiver Data :-", data);
          console.log(socket.id);
          // console.log(socket)
          io.to(socket.id).emit("chat message", "Sorry reveiver is offline.");
        } else {
          chatData.findOne(
            { senderName: senderName },
            function (err, dataOfSender) {
              if (err) {
                console.log("Error in receiverName : ", err);
              } else {
                console.log("Fateched sender Data :-", data);
                console.log(socket.id);
                // console.log(socket)
                console.log("Sender Data :-", dataOfSender);
                console.log("Receiver Data :- ", dataOfReceiver);
                io.to(dataOfReceiver.socketId).emit(
                  "chat message",
                  msg,
                  senderName
                );
                io.to(dataOfSender.socketId).emit(
                  "chat message",
                  msg,
                  senderName
                );
              }
            }
          );
        }
      }
    );
  });
});

httpServer.listen(3002);

// var { Server } = require('socket.io');
// const io = new Server(http);

// http.listen(5000 , function(){
//   console.log("Listening port in 5000")
// })

var chatData = require("../models/userData");

// io.on('connection', (socket) => {
//   console.log("New user is connected " + socket)
// })
// router.post('/' , function(req,res,next){

// io.on('error', (error) => {
//   console.log("error");
//   console.log(error);
// });

// io.on('connection', (socket) => {
//   console.log("server-connected...!");
//   socket.on('chat message', (msg) => {
//     console.log(msg)
//     // connect.then(db  =>  {
//     //   console.log("connected correctly to the server");

//     //   let  chatMessage  =  new chatData({ message: msg});
//     // chatMessage.save();
//     var inputData = {
//       message : msg
//     }
//     var data = chatData(inputData)
//     data.save(function(err){
//       if(err){
//         console.log("Error in  insert record : - " , err)
//       }else{
//         console.log("Data Saved.")
//       }
//       console.log("Message" + msg)
//     })
//     });
//   });

// })

/* GET home page. */

router.get("/room", function (req, res, next) {
  res.render("room");
});

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/display", function (req, res, next) {
  chatData
    .find({})
    .lean()
    .then((chat) => {
      res.render("displayData", { chatData: chat });
    })
    .catch((err) => {
      console.log("Error in fetch data :- ", err);
    });
});

module.exports = router;
