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

export const verifyEmailreq = async (email: string, otp: string) => {
    try {
        const res = await axios.post("/user/verify_email", { email, otp });
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error //important it bubble up the error so that the next function catchs it that why use throw
    }
};

export const userSignUp= async (name:string, email:string, password: string)=>{
    try {
        const res= await axios.post('/user/signup',{name,email,password})
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error
    }
}

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
type ChatMessageType={
    role: string,
    content: string,
}
export const generateChat=async(message:string,chatHistory:ChatMessageType[])=>{
    try {
        const result=await axios.post<ChatResponse>("/chats/new",{message,chatHistory});
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

export const deleteChats=async()=>{
    try {
        const res=await axios.get<ChatArray>('/chats/delete');
        return res.data.chats;
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

type ForgetPasswordResponse = {
  message: string;
};
export const forgetPassword=async(email:string)=>{
    try {
        const res= await axios.post<Promise<ForgetPasswordResponse> >('/user/forgot-password',{email})
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error
    }
}

type VerifyResetOtpResponse = {
  resetToken: string;
};
export const verifyResetOtp=async(email:string,otp:string)=>{
    try {
        const res= await axios.post<Promise<VerifyResetOtpResponse> >('/user/verify-reset-otp',{email,otp})
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error
    }
}

type ResetPasswordResponse = {
  message: string;
};
export const resetPassword=async(resetToken:string,newPassword:string)=>{
    try {
        const res= await axios.post<Promise<ResetPasswordResponse> >('/user/reset-password',{resetToken,newPassword})
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error
    }
}
