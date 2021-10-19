const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

socket.emit("room", room);

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // console.log("Hiiiiiiiiiiiiiiiiiiiiiiiii");
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("alldata", (message) => {
  console.log("Hiiiiiiiren");
  // console.log(message);

  Object.values(message).forEach((val) => {
    allMessage(val);
  });

  console.log(message);
  // allMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", { msg, username, room });

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  // console.log(message);

  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  if (username == message.username) {
    document.querySelector(".chat-messages").appendChild(div).style.cssText =
      "width: calc(100% - 300px); float: right;";
  } else {
    document.querySelector(".chat-messages").appendChild(div).style.cssText =
      "width: calc(100% - 300px); float: left;";
  }
}

function allMessage(val) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = val.senderName;
  p.innerHTML += `<span>${val.msgTime}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = val.senderMsg;
  div.appendChild(para);
  if (username == val.senderName) {
    document.querySelector(".chat-messages").appendChild(div).style.cssText =
      "width: calc(100% - 300px); float: right;";
  } else {
    document.querySelector(".chat-messages").appendChild(div).style.cssText =
      "width: calc(100% - 300px); float: left;";
  }
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "/";
  } else {
  }
});
