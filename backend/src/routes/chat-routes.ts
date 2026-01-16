import express from "express";
import { deleteChats, getAllChats, newChatCreate } from "../controllers/chat-controller";
import { verifyToken, optionalAuth } from "../utils/token-manager";

const chatRoutes = express.Router();
chatRoutes.post("/new", optionalAuth, newChatCreate);
chatRoutes.get("/all", verifyToken, getAllChats);
chatRoutes.get("/delete", optionalAuth, deleteChats);

export default chatRoutes;