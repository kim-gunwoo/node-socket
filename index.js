const app = require("./app");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = 8000;

let count = 1;

io.sockets.on("connection", function (socket) {
  const name = "익명" + count++;
  io.to(socket.id).emit("new", name);

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });

  socket.on("leaveRoom", (room, name) => {
    socket.leave(room, () => {
      console.log(name + " leave a " + room);
      io.to(room).emit("leaveRoom", room, name);
    });
  });

  socket.on("joinRoom", (room, name) => {
    socket.join(room, () => {
      console.log(name + " join a " + room);
      io.to(room).emit("joinRoom", room, name);
    });
  });

  socket.on("send", (room, name, text) => {
    const msg = `${name} : ${text} `;

    io.to(room).emit("receive", msg);
  });
});

http.listen(PORT, () => {
  console.log(`server run localhost:${PORT}`);
});
