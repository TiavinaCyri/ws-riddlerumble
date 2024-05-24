const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = ["*"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "public")));

const io = socketIO(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message1", (data) => {
        console.log("Received from API ::", data);
        io.emit("message2", data);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
});
