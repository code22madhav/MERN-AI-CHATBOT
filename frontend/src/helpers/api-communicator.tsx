import axios from "axios";

export const userLogin = async (email: string, password: string) => {
    try {
        const res = await axios.post("/login", { email, password });
        return res.data;
    } catch (error: any) {
        console.log("Error from axios:", error.response?.data || error.message);
        throw error //important it bubble up the error so that the next function catchs it that why use throw
    }
};

export const checkAuth=async()=>{
    try {
        const res=await axios.get("/check_auth");
        return await res.data;
    } catch (error) {
        throw error;
    }
}