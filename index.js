const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

const roomSubmitCounts = {};

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("room-create", () => {
    console.log("Room created");
    io.emit("room-created");
  });

  socket.on("player-submit", (roomData) => {
    console.log(`Player submitted data in room ${roomData.id}:`, roomData);
    if (roomSubmitCounts[roomData.id] !== undefined) {
      roomSubmitCounts[roomData.id]++;
      io.to(JSON.stringify(roomData.id)).emit("submit-count", roomSubmitCounts[roomData.id]);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on http://localhost:${PORT}`);
});
