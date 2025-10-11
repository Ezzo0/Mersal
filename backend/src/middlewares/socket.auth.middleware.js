import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Get the token from the cookie
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    // If no token, return error
    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // Find the user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // Attach the user to the socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
