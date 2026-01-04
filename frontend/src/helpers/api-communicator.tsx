import axios from "axios";

export const userLogin = async (email: string, password: string) => {
    try {
        const res = await axios.post("/user/login", { email, password });
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error //important it bubble up the error so that the next function catchs it that why use throw
    }
};

export const checkAuth=async()=>{
    try {
        const res=await axios.get("/user/check_auth");
        return await res.data;
    } catch (error) {
        throw error;
    }
}

interface ChatResponse {
  reply: string;
}
export const generateChat=async(message:string)=>{
    try {
        const result=await axios.post<ChatResponse>("/chats/new",{message});
        return result.data.reply;
    } catch (error) {
        throw error;
    }
}

type Chat = {
  id: string;
  role: "user" | "model";
  content: string;
};

type ChatArray = {
    chats: Chat[]
};
export const getAllChats=async()=>{
    try {
        const result=await axios.get<ChatArray>('/chats/all');
        return result.data.chats;
    } catch (error) {
        throw error;
    }
}

export const userLogout=async()=>{
    try {
        await axios.get('/user/logout');
    } catch (error) {
        throw error;
    }
}