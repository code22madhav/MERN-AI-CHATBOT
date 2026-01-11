import express from "express";
import { deleteChats, getAllChats, newChatCreate } from "../controllers/chat-controller";
import { verifyToken } from "../utils/token-manager";

const chatRoutes = express.Router();
chatRoutes.post("/new", verifyToken, newChatCreate);
chatRoutes.get("/all", verifyToken, getAllChats);
chatRoutes.get("/delete", verifyToken, deleteChats);

export default chatRoutes;