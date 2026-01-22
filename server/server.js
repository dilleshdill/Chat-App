import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./Lib/db.js";
import userRoute from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";


// Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket io connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected",userId)
    if (userId){
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/auth",userRoute);
app.use("/api/messages",messageRoutes);
// connect to database
await connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is running on port " + PORT));