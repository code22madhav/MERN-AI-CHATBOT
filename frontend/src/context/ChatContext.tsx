import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { generateChat, getAllChats } from "../helpers/api-communicator";
import { useAuth } from "./AuthContext";

type ChatMessageType={
    role: string,
    content: string,
}
type ChatContextType={
    chatMessage: ChatMessageType[],
    generateResponse:(content:string)=>Promise<void>;
}
const ChatContext=createContext<ChatContextType>({
    chatMessage: [],
    generateResponse: async () => {},
});

export const ChatProvider=({children}:{children: ReactNode})=>{
    const [chatMessage, setChatMessage]=useState<ChatMessageType[]>([])
    const auth = useAuth();
    const generateResponse=async(content:string)=>{
        setChatMessage((prev)=>[...prev,{role:"user",content}])
        const response= await generateChat(content);
        setChatMessage((prev)=>[...prev,{role:"model",content:response}])
    }
    async function LoadChats(){
        const chats=await getAllChats();
        const formatedChatArray=chats.map((chat)=>{
            return {role: chat.role, content: chat.content}
        });
        setChatMessage(formatedChatArray);
    }
    useEffect(()=>{
        if (!auth?.isLoggedIn) return;
        if (!auth?.user) {
            setChatMessage([]); //tackles when user logout otherwise old users chat remains in context
            return;
        }
        LoadChats()},[auth?.user, auth?.isLoggedIn])
    const value={
        chatMessage,
        generateResponse
    }
    return(<ChatContext.Provider value={value}>{children}</ChatContext.Provider>)
}

export const useChatContext=()=>useContext(ChatContext);