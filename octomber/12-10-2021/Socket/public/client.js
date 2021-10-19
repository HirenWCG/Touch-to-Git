const socket = io();
// let name;
let mySocketId;
$(document).ready(function () {
  // do {
  //   name = prompt("Please enter your name: ");
  // } while (!name);
});

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    // user: name,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  //   console.log(className);
  mainDiv.classList.add(className, "message");

  let markup = `
        
        <p>${msg}</p>
    `;

  // <h4>${msg}</h4>
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
  // msg, "incoming";
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// window.onbeforeunload = function () {
//   alert("asd");
//   socket.emit("remove", "testtttt");
//   return true;
// };
// window.onbeforeunload = function () {
//   // e = e || window.event;
//   // // For IE and Firefox prior to version 4
//   // if (e) {
//   //   e.returnValue = "Sure?";
//   // }
//   // // For Safari
//   // return "Sure?";
// };
