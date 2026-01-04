import { configureGemini } from '../config/openai-config'
import { Request, Response } from 'express';
import User from '../models/user';

export const newChatCreate=async(req:Request,res:Response)=>{
    const model = configureGemini();
    const {message}=req.body;
    try {
        const user=await User.findById(res.locals.jwtData.id);
        //add new chat to the mongodb
        user.chats.push({ content: message, role: "user" });
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
        const firstCandidate = result?.response?.candidates?.[0];
        if (!firstCandidate) {
        throw new Error("No candidate returned by Gemini");
        }

        // Gemini candidate content shape can vary; commonly:
        // firstCandidate.content.parts[0].text
        const reply =
        firstCandidate?.content?.[0]?.parts?.[0]?.text ??
        firstCandidate?.content?.parts?.[0]?.text ??
        result.response.text?.() ?? // fallback if SDK helper exists
        "No text";
        //saves gemini response
        user.chats.push({ content: reply, role: "model" });
        await user.save();
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const getAllChats=async(req:Request,res:Response)=>{
    try {
        const user=await User.findById(res.locals.jwtData.id);
        const chats=user.chats;
        res.status(200).json({chats});
    } catch (error) {
        res.status(500).send(error.message);
    }
}