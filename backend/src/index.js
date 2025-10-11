import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/db.js";
import cors from "cors";
import { server, app } from "./lib/socket.js";

// Constants
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
