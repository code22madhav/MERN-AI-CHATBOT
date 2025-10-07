import chatRoutes from "./chat-routes";
import userRoutes from "./user-routes";

const express = require('express');

const api_v1=express.Router();

api_v1.use('/user', userRoutes);
api_v1.use('/chats', chatRoutes);

module.exports=api_v1;