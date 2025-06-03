import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);

app.use(express.static("."));

const io = new Server(http, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomCode }) => {
        console.log(`Socket ${socket.id} joining room ${roomCode}`);

        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }

        socket.join(roomCode);
        socket.data.roomCode = roomCode;

        socket.emit("join-success");

        const sockets = await io.in(roomCode).fetchSockets();
        console.log(`Room ${roomCode} now has ${sockets.length} clients`);
        io.in(roomCode).emit("room-size", sockets.length);
    });

    socket.on("phone-button-pressed", ({ roomCode, payload }) => {
        console.log(`Phone button pressed for room ${roomCode}`, payload);
        socket.to(roomCode).emit("trigger-pc-action", payload);
    });

    socket.on("disconnect", async () => {
        const roomCode = socket.data.roomCode;
        if (roomCode) {
            const sockets = await io.in(roomCode).fetchSockets();
            io.in(roomCode).emit("room-size", sockets.length);
            console.log(`Socket ${socket.id} disconnected. Room ${roomCode} now has ${sockets.length} clients`);
        }
    });
});

http.listen(3000, () => console.log("Listening on http://localhost:3000"));
