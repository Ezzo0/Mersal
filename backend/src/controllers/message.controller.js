import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const contacts = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    res.status(200).json(contacts);
  } catch (error) {
    console.log("Error in getAllContacts controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const partnerId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text && !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (senderId.toString() === receiverId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send message to yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ message: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    // todo: send message to socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const chatPartnersIDs = [
      ...new Set(
        messages.map((message) => {
          return message.senderId.toString() === userId.toString()
            ? message.receiverId.toString()
            : message.senderId.toString();
        })
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIDs },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
