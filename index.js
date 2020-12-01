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

  socket.on("send", function (name, text) {
    const msg = name + " : " + text;
    console.log(msg);
    io.emit("receive", msg);
  });
});

http.listen(PORT, () => {
  console.log(`server run localhost:${PORT}`);
});
