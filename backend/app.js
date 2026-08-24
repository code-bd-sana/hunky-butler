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
import debugRoutes from "./src/routes/debug.route.js";

dotenv.config();

const app = express();

// Allowed CORS origins.
//
// Previously the CORS origin function was `callback(null, true)`, which reflected
// ANY origin while also sending `credentials: true`. That let any website make
// credentialed requests to this API. This replaces it with an env-driven
// allowlist so origins can be adjusted in the environment without a deploy.
//
// Set ALLOWED_ORIGINS as a comma-separated list to override the defaults.
// Origin headers never carry a trailing slash or path, so values are normalised
// to scheme://host[:port] and trailing slashes are stripped (the previous list
// had "…co.uk/" entries that could never match).
const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.hunkybutlerservice.co.uk",
  "https://hunkybutlerservice.co.uk",
  "http://localhost:3000",
];

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : DEFAULT_ALLOWED_ORIGINS
)
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Requests with no Origin header (server-to-server, curl, health checks,
    // same-origin) are allowed.
    if (!origin) return callback(null, true);

    const normalised = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalised)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// CORS middleware সবার আগে প্রয়োগ করা হলো
app.use(cors(corsOptions));

// ওয়েবহুক রুট - এটি express.json() এর আগে থাকতে হবে
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleSquareWebhook,
);

// রেগুলার মিডলওয়্যার
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Socket.IO সেটআপ
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set("io", io);

// Socket.IO কানেকশন হ্যান্ডলিং
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("join", ({ userId }) => {
    socket.join(userId);
    console.log("👤 User joined room:", userId);
  });

  socket.on("join-user", (userEmail) => {
    socket.join(userEmail);
    console.log(`👤 User ${userEmail} joined room`);
  });

  socket.on("notification-seen", (data) => {
    console.log("📭 Notification seen:", data);
    socket.to(data.userEmail).emit("notification-updated");
  });

  socket.on("all-notifications-seen", (data) => {
    console.log("📭 All notifications seen for:", data.userEmail);
    socket.to(data.userEmail).emit("notification-updated");
  });

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
      socket.emit("error", { message: "Failed to fetch messages" });
    }
  });

  socket.on("sendMessage", async (msg) => {
    console.log("Sending message:", msg);
    try {
      const newMsg = await Message.create(msg);
      io.to(msg.receiverId).emit("receiveMessage", newMsg);
      io.to(msg.senderId).emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 User disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// রাউটস
app.use("/api", routes);
app.use("/api/debug", debugRoutes);

// হেলথ চেক এবং রুট
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
  res.status(200).json({
    status: "OK",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS error",
      message: "Origin not allowed",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Something broke!",
  });
});

await connectDB();

export { app, io };
export default server;
