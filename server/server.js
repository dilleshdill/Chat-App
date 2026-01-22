import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./Lib/db.js";
import userRoute from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "https://chatapp-alpha-nine-76.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT for preflight
app.options("*", cors());

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json({ limit: "4mb" }));

/* -------------------- SOCKET.IO -------------------- */
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Store online users
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/* -------------------- ROUTES -------------------- */
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoutes);

/* -------------------- DB -------------------- */
await connectDB();

/* -------------------- SERVER -------------------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log("Server running on PORT:", PORT)
  );
}

// Export for Vercel
export default server;
