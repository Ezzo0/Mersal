import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middlewares
io.use(socketAuthMiddleware);

// Connected Users
const connectedUsers = {}; // { userId: socketId }

// Handle connections
io.on("connection", (socket) => {
  connectedUsers[socket.userId] = socket.id;

  // Send connected users to all clients
  io.emit("getOnlineUsers", Object.keys(connectedUsers));

  // Handle disconnections
  socket.on("disconnect", () => {
    delete connectedUsers[socket.userId];
    io.emit("userDisconnected", socket.userId);
  });

  // Handle messages
  socket.on("sendMessage", async (message) => {
    const result = await sendMessage(socket, message, connectedUsers);
    socket.emit("sendMessageResponse", result);
  });
});

export { server, io, app };
