const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
let users = [];
let currentUser;
const socketIO = require("socket.io")(http, {
  origin: "http://localhost:3000",
  cors: {},
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.emit("isLogin", false);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== currentUser.socketID);
    socketIO.emit("getUserList", users);
  });

  socket.on("enter", (data1) => {
    if (
      !users.some((user) => {
        return user.socketID === data1.socketID;
      })
    ) {
      users.push(data1);
    }

    currentUser = data1;
    socket.emit("isLogin", true);
    // send message to all users
    socketIO.emit("getUserList", users);
    socket.on("message", (data2) => {
      console.log(11, data2);
      socketIO.emit("messageResponse", { ...data2, ...data1 });
    });
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
