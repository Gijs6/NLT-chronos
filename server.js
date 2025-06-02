import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);

app.use(express.static("."));

const io = new Server(http, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join-room", (roomCode) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }
        socket.join(roomCode);
    });

    socket.on("phone-button-pressed", ({ roomCode, payload }) => {
        socket.to(roomCode).emit("trigger-pc-action", payload);
    });
});

http.listen(3000, () => console.log("Listening on http://localhost:3000"));
