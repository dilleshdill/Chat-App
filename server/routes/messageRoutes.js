import express from 'express'
import { protectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';


const messageRoutes = express.Router();

messageRoutes.get("/users",protectRoute,getUsersForSidebar);
messageRoutes.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRoutes.get("/:id",protectRoute,getMessages);
messageRoutes.post("/send/:id",protectRoute,sendMessage)

export default messageRoutes;