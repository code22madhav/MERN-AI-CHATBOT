import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { checkAuth, userLogin } from "../helpers/api-communicator";

type User={
    name: string,
    email: string,
}

type UserAuth={
    isLoggedIn: boolean,
    user: User | null,
    login: (email: string, password: string)=>Promise<void>,
    signup: (name: string, email: string, password: string)=>Promise<void>,
    logout: ()=>Promise<void>,
}

const UserContext=createContext<UserAuth | null>(null);

export const AuthProvider= ({children}:{children: ReactNode})=>{
    const [isLoggedIn, setisLoggedIn]=useState(false);
    const [user, SetUser]=useState<User | null>(null);
    const login = async (email: string, password: string) => {
        try {
            const data = await userLogin(email, password);
            SetUser({ name: data.name, email: data.email });
            setisLoggedIn(true);
        } catch (error) {
            console.log("Error inside auth login:", error);
            throw error;  // bubble to UI
        }
    };
    useEffect(()=>{
        const checkuserSesssion=async()=>{
            try {
                const data=await checkAuth();
                SetUser({ name: data.name, email: data.email });
                setisLoggedIn(true);
            } catch (error) {
                console.log("Error inside auth login:", error);
                throw error; 
            }
        };
        checkuserSesssion();
    },[])
    const signup=async (name: string, email: string, password: string)=>{};
    const logout=async()=>{};
    const value={
        isLoggedIn,
        user,
        login,
        signup,
        logout,
    }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useAuth=()=>useContext(UserContext);