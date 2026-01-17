import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { generateChat, getAllChats, deleteChats } from "../helpers/api-communicator";
import { useAuth } from "./AuthContext";

type ChatMessageType={
    role: string,
    content: string,
}
type ChatContextType={
    chatMessage: ChatMessageType[],
    generateResponse:(content:string)=>Promise<void>;
    deleteUsersChat:()=>Promise<void>;
    shouldModalAppear: boolean;
    dismissPrompt: ()=>void,
}
const ChatContext=createContext<ChatContextType>({
    chatMessage: [],
    generateResponse: async () => {},
    deleteUsersChat: async ()=>{},
    shouldModalAppear: false,
    dismissPrompt: ()=>{}
});

export const ChatProvider=({children}:{children: ReactNode})=>{
    const [chatMessage, setChatMessage]=useState<ChatMessageType[]>([])
    const [shouldModalAppear,setShouldModalAppear]=useState<boolean>(false)
    const auth = useAuth();

    const onFirstMessage = () => {
        const dismissed = sessionStorage.getItem("loginPromptDismissed");
        if (!auth?.user && dismissed !== "true") {
            setShouldModalAppear(true);
        }
    };
    const generateResponse=async(content:string)=>{
        if(chatMessage.length===0){
            onFirstMessage();
        }
        setChatMessage((prev)=>[...prev,{role:"user",content}])
        const response= await generateChat(content,chatMessage);
        setChatMessage((prev)=>[...prev,{role:"model",content:response}])
    }
    const dismissPrompt = () => {
        sessionStorage.setItem("loginPromptDismissed", "true");
        setShouldModalAppear(false);
    };
    async function LoadChats(){
        const chats=await getAllChats();
        const formatedChatArray=chats.map((chat)=>{
            return {role: chat.role, content: chat.content}
        });
        setChatMessage(formatedChatArray);
    }
    async function deleteUsersChat(){
        const chats=await deleteChats();
        setChatMessage(chats);
    }
    useEffect(()=>{
        if (!auth?.isLoggedIn) return;
        LoadChats()},[auth?.user, auth?.isLoggedIn])
    const value={
        chatMessage,
        generateResponse,
        deleteUsersChat,
        shouldModalAppear,
        dismissPrompt,
    }
    return(<ChatContext.Provider key={auth?.user?.email ?? "guest"} value={value}>{children}</ChatContext.Provider>)
}

export const useChatContext=()=>useContext(ChatContext);