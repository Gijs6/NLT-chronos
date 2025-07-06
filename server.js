import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.use(express.static("."));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "clock.html"));
});

app.get("/phone", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "phone.html"));
});

app.use(express.static("."));

const io = new Server(httpServer, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-room", async ({ roomCode }) => {
        console.log(`Socket ${socket.id} joining room ${roomCode}`);

        // Leave previous non-self rooms
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
                const sockets = await io.in(room).fetchSockets();
                socket.to(room).emit("room-size", sockets.length);
            }
        }

        socket.join(roomCode);
        socket.data.roomCode = roomCode;

        socket.emit("join-success");

        const sockets = await io.in(roomCode).fetchSockets();
        console.log(`Room ${roomCode} has ${sockets.length} client(s)`);
        io.in(roomCode).emit("room-size", sockets.length);
    });

    socket.on("read-time-activate", ({ roomCode, payload }) => {
        console.log(`Read-time trigger for room ${roomCode}`, payload);
        socket.to(roomCode).emit("read-time-trigger", payload);
    });

    socket.on("disconnect", async () => {
        const roomCode = socket.data.roomCode;
        if (roomCode) {
            const sockets = await io.in(roomCode).fetchSockets();
            io.in(roomCode).emit("room-size", sockets.length);
            console.log(`Socket ${socket.id} disconnected. Room ${roomCode} now has ${sockets.length} client(s)`);
        }
    });
});

httpServer.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
