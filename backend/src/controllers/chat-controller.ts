import { configureGemini } from '../config/openai-config'
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export const newChatCreate=async(req:Request,res:Response,next:NextFunction)=>{
    const model = configureGemini();
    const {message}=req.body;
    try {
        const user=await User.findById(res.locals.jwtData.id);
        //add new chat to the mongodb
        user.chats.push({ content: message, role: "user" });
        console.log(user.chats)
        //formated chat history according to gemini
        const chatHistory=user.chats.map((m) => ({
            role: m.role,
            parts: [{ text: m.content }]
        }))
        //shared chat history with genimi
        const chat= (await model).startChat({
        history: chatHistory,
        })
        //sending new message to gemini
        const result = await chat.sendMessage(message);
        const reply = result.response.text();
        //saves gemini response
        user.chats.push({ content: reply, role: "model" });
        await user.save();
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).send(error.message);
    }
}