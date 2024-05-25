const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("Client connected update");
    socket.on("room-updated", () => {
        console.log("Room updated");
        io.emit("room-updated");
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
});
