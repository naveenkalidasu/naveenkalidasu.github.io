// server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ New client connected");

  socket.on("chat message", (data) => {
  io.emit("chat message", data); // data includes { username, message }
});


  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
