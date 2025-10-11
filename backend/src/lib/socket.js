import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

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

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return connectedUsers[userId];
}

// Handle connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.fullName}`);

  connectedUsers[socket.userId] = socket.id;

  // Send connected users to all clients
  io.emit("getOnlineUsers", Object.keys(connectedUsers));

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.fullName}`);
    delete connectedUsers[socket.userId];
    io.emit("userDisconnected", socket.userId);
  });

  // Handle messages
  socket.on("sendMessage", (message) => {
    console.log(`Message received: ${message.text}`);
  });
});

export { server, io, app };
