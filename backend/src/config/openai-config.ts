import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function configureGemini(){
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return model;
  } catch (error) {
    throw error;
  }
}