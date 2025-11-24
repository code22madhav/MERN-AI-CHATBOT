import express from "express";
import { newChatCreate } from "../controllers/chat-controller";
import { verifyToken } from "../utils/token-manager";

const chatRoutes = express.Router();
chatRoutes.post("/new", verifyToken, newChatCreate);

export default chatRoutes;