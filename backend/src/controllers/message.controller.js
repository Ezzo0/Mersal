import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

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

export const sendMessage = async (socket, receivedMessage, connectedUsers) => {
  try {
    const { text, image } = receivedMessage;
    if (!text && !image) {
      return { success: false, info: "All fields are required" };
    }
    const senderId = socket.user._id;
    const receiverId = receivedMessage.receiverId;

    if (senderId.toString() === receiverId.toString()) {
      return { success: false, info: "You cannot send message to yourself" };
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return { success: false, info: "Receiver not found" };
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
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("newMessage", message);
    }

    return { success: true, info: message };
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    return { success: false, info: "Internal server error" };
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
