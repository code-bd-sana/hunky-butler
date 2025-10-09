import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";
import Message from "./src/models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map();

// Socket.io events
io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // User connected
  socket.on("userConnected", async (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online user:", userId);

    try {
      const res = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { isOnline: true, lastActive: Date.now() },
        { upsert: true, new: true }
      );
      console.log(`User with _id ${userId} is now online`, res);
    } catch (err) {
      console.error("Error saving user status:", err);
    }

    io.emit("updateUserStatus", { userId, isOnline: true });
  });

  // Get message history
  socket.on("getMessages", async ({ senderId, receiverId }) => {
    try {
      const messages = await Message.find({
        $and: [
          { senderId: { $in: [senderId, receiverId] } },
          { receiverId: { $in: [senderId, receiverId] } },
        ],
      }).sort({ timestamp: 1 });

      socket.emit("messageHistory", messages);
    } catch (err) {
      console.error(err);
    }
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, text, imageUrl, messageType } = data;

    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        content: text,
        imageUrl,
        messageType: messageType || "text",
      });

      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Message sending failed:", error);
    }
  });

  // Mark messages as seen
  socket.on("markAsSeen", async ({ messageIds }) => {
    try {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { seen: true } }
      );
    } catch (err) {
      console.error("Seen status update failed:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(
      ([key, value]) => value === socket.id
    )?.[0];

    if (userId) {
      onlineUsers.delete(userId);
      io.emit("updateUserStatus", { userId, isOnline: false });
      console.log(`${userId} disconnected`);
    }
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://hnk-test.vercel.app",
      "https://hunky-butler.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.status(200).type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>Hunky Butler</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:100vh;
            margin:0;
            background:linear-gradient(135deg,#0f172a,#1a1f3b);
            color:#fff;
          }
          .card {
            text-align:center;
            padding:36px;
            border-radius:20px;
            background:rgba(255,255,255,0.07);
            box-shadow:0 12px 30px rgba(0,0,0,0.7);
            max-width:720px;
          }
          img {
            width:180px;
            height:auto;
            margin-bottom:18px;
            border-radius:14px;
            box-shadow:0 6px 14px rgba(0,0,0,0.5);
          }
          h1 { margin:0 0 12px; font-size:2.2rem; }
          p { margin:8px 0; font-size:1.1rem; }
          .emoji { font-size:2rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <img src="https://i.ibb.co.com/WNJ31W12/whybook.png" alt="Funny Butler" />
          <h1>Hunky Butler — Server Running 🤖✨ <span class="emoji">😜🔧</span></h1>
          <p>Serving high-tech, slightly naughty vibes with extra polish 🍸😏</p>
          <p>If you see this, your server is strutting in style! 🕺🕶️</p>
        </div>
      </body>
    </html>
  `);
});

// Connect to DB
await connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send("Something Broke!");
});

export default app;
