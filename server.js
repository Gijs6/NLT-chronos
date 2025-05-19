import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("join-room", (roomCode) => socket.join(roomCode));
    socket.on("phone-button-pressed", ({ roomCode, payload }) => {
        socket.to(roomCode).emit("trigger-pc-action", payload);
    });
});

httpServer.listen(3000, "0.0.0.0", () => console.log("Listening on http://localhost:3000"));
