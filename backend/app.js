import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import { handleSquareWebhook } from "./src/controller/payment.controller.js";
import Message from "./src/models/Message.js";
import routes from "./src/routes/index.js";

// router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

const app = express();
// import { handleStripeWebhook } from "./src/controller/payment.controller.js";

dotenv.config();

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleSquareWebhook,
);

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000', 'https://hnk-test.vercel.app', "https://hunky-butler.vercel.app"],
    origin: ['https://www.hunkybutlerservice.co.uk', 'https://hunkybutlerservice.co.uk', 'https://www.hunkybutlerservice.co.uk/', 'https://hunkybutlerservice.co.uk/'],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.set("io", io);
// io.on("connection", (socket) => {
//   console.log("🟢 A user connected:", socket.id);
//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("join", ({ userId }) => {
    socket.join(userId);
    console.log("👤 User joined room:", userId);
  });

  //   // Join user to their personal room based on email
  socket.on("join-user", (userEmail) => {
    socket.join(userEmail);
    console.log(`👤 User ${userEmail} joined room`);
  });

  //   // Handle notification seen event
  socket.on("notification-seen", (data) => {
    console.log("📭 Notification seen:", data);
    // Broadcast to other clients if needed
    socket.to(data.userEmail).emit("notification-updated");
  });

  //   // Handle all notifications seen
  socket.on("all-notifications-seen", (data) => {
    console.log("📭 All notifications seen for:", data.userEmail);
    socket.to(data.userEmail).emit("notification-updated");
  });

  // Get chat history between two users
  socket.on("getMessages", async ({ senderId, receiverId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 });

      socket.emit("messageHistory", { withUserId: receiverId, messages });
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  });

  // Handle sending new message
  socket.on("sendMessage", async (msg) => {
    console.log(msg);
    try {
      const newMsg = await Message.create(msg);

      // Send to receiver’s room
      io.to(msg.receiverId).emit("receiveMessage", newMsg);
      io.to(msg.senderId).emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// app.post(
//   "/api/webhook",
//   express.raw({ type: "application/json" }),
//   webhook
// );
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
    'https://www.hunkybutlerservice.co.uk', 'https://hunkybutlerservice.co.uk'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true,
  }),
);

app.use("/api", routes);
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
          display:flex; align-items:center; justify-content:center;
          min-height:100vh; margin:0;
          background:linear-gradient(135deg,#0f172a,#1a1f3b);
          color:#fff;
        }
        .card {
          text-align:center; padding:36px; border-radius:20px;
          background:rgba(255,255,255,0.07);
          box-shadow:0 12px 30px rgba(0,0,0,0.7);
          max-width:720px;
        }
        img {
          width:180px; height:auto;
          margin-bottom:18px; border-radius:14px;
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

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Socket.IO connection handling
// io.on("connection", (socket) => {
//   // console.log("🔌 User connected:", socket.id);

//   // Join user to their personal room based on email
//   socket.on("join-user", (userEmail) => {
//     socket.join(userEmail);
//     console.log(`👤 User ${userEmail} joined room`);
//   });

//   // Handle notification seen event
//   socket.on("notification-seen", (data) => {
//     console.log("📭 Notification seen:", data);
//     // Broadcast to other clients if needed
//     socket.to(data.userEmail).emit("notification-updated");
//   });

//   // Handle all notifications seen
//   socket.on("all-notifications-seen", (data) => {
//     console.log("📭 All notifications seen for:", data.userEmail);
//     socket.to(data.userEmail).emit("notification-updated");
//   });

//   // Handle disconnect
//   // socket.on("disconnect", () => {
//   //   console.log("🔌 User disconnected:", socket.id);
//   // });

//   // Handle connection error
//   socket.on("connect_error", (error) => {
//     console.error("🔌 Connection error:", error);
//   });
// });

await connectDB();

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something Broke!");
});

// Export both app and server
export { app, io };
export default server;
