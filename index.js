const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");
var cron = require('node-cron');

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
    console.log("Client connected");
    socket.on("send", (data) => {
        console.log("Received from API ::", data);
        io.emit("receive", data);
    });
    socket.on("room-create", () => {
        console.log("Room created");
        io.emit("room-created");
    });
});

cron.schedule('*/10 * * * * *', () => {
    io.on("connection", () => {
        console.log("Client connected");
        io.emit("room-created");
    })
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
});
