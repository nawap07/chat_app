import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("GetusersSideBar Error", error.message);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userTochatId } = req.params
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userTochatId },
                { senderId: userTochatId, receiverId: myId }
            ]
        })
        res.status(200).json(message);

    } catch (error) {
        console.log("GetMessage error", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            //upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        const reciverSocketId = getReceiverSocketId(receiverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("SendMessage Error", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}