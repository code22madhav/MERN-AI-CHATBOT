import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { checkAuth, userLogin, userLogout, verifyEmailreq } from "../helpers/api-communicator";

type User={
    name: string,
    email: string,
}

type UserAuth={
    isLoggedIn: boolean,
    user: User | null,
    login: (email: string, password: string)=>Promise<void>,
    verifyEmail: (email: string, otp: string)=>Promise<void>,
    logout: ()=>Promise<void>,
    loginStepReset:number,
    setLoginStepReset:React.Dispatch<React.SetStateAction<number>>
}

const UserContext=createContext<UserAuth | null>(null);

export const AuthProvider= ({children}:{children: ReactNode})=>{
    const [isLoggedIn, setisLoggedIn]=useState(false);
    const [user, SetUser]=useState<User | null>(null);
    const [loginStepReset,setLoginStepReset]=useState<number>(0);
    const login = async (email: string, password: string) => {
        try {
            const data = await userLogin(email, password);
            if (!data?.user?.name || !data?.user?.email) {
                SetUser(null);
                setisLoggedIn(false);
                return;
            }
            SetUser({name: data.user.name, email: data.user.email,});
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
                if (!data?.name || !data?.email) {
                    SetUser(null);
                    setisLoggedIn(false);
                    return;
                }
                SetUser({ name: data.name, email: data.email });
                setisLoggedIn(true);
            } catch (error) {
                //console.log("Error inside auth login:", error);
                //throw error; 
                //we should not throw error's from the async functions in useEffect because useEffect runs after
                // component is rendered on ui and if the promise will return a error then by that time
                //react will not be there to handle it and look for error boundary and app may crash
                //so better in such case use state to identify there is a error and update state like below
                //also when the user is not logged in this checkAuth will throw 401 which is a error but
                // its not error for us because simply it means user not signed in
                SetUser(null);
                setisLoggedIn(false);
            }
        };
        checkuserSesssion();
    },[])
    const verifyEmail=async (email: string, otp: string)=>{
        try {
            const data = await verifyEmailreq(email, otp);
            if (!data?.user?.name || !data?.user?.email) {
                SetUser(null);
                setisLoggedIn(false);
                return;
            }
            SetUser({name: data.user.name, email: data.user.email,});
            setisLoggedIn(true);
        } catch (error) {
            console.log("Error inside auth login:", error);
            throw error;  // bubble to UI
        }
    };
    const logout=async()=>{ 
        await userLogout()
        setisLoggedIn(false);
        SetUser(null);
    };
    const value={
        isLoggedIn,
        user,
        login,
        verifyEmail,
        logout,
        loginStepReset,
        setLoginStepReset
    }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useAuth=()=>useContext(UserContext);