import express from "express";
import { getAllChats, newChatCreate } from "../controllers/chat-controller";
import { verifyToken } from "../utils/token-manager";

const chatRoutes = express.Router();
chatRoutes.post("/new", verifyToken, newChatCreate);
chatRoutes.get("/all", verifyToken, getAllChats);

export default chatRoutes;