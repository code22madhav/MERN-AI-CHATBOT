import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { IoIosLogIn } from "react-icons/io";
/* Styling done here only not made seperate file*/
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top:60px;
`;

const InputBox = styled.input`
  height: 36px;
  width: 36px;
  margin-left: 10px;
  border: 1px solid black;
  background-color: #f5f5f5; /* Light gray instead of 'smoke' */
  text-align: center;
  font-size: 18px;
  border-radius: 4px;
  outline: none;
  font-family: 'DM Sans', sans-serif;

  &:focus {
    border: 2px solid #007BFF; /* Bootstrap blue */
    box-shadow: 0 0 3px #007BFF;
    background-color: white;
  }
`;
//style section end

interface InputBoxContainerProps {
  email: string;
}

const InputBoxContainer=({email}: InputBoxContainerProps)=>{
    const [otpfields, setOtpfields]=useState<string[]>(new Array(6).fill(""));
    const inputBoxRef=useRef<(HTMLInputElement | null)[]>([]);
    const auth=useAuth()
    const navigate=useNavigate();
    useEffect(()=>inputBoxRef.current[0]?.focus(),[]);
    const handlekeydown=(e:React.KeyboardEvent<HTMLInputElement>,index:number): void =>{
        const key:string=e.key;
        const copyOtpArray: string[]=[...otpfields];
        if(key===" ") return;
        if(key==="Backspace"){
            copyOtpArray[index]="";
            setOtpfields(copyOtpArray);
            if(index>0) inputBoxRef.current[index-1]?.focus();
            return;
        }
        if(key==="ArrowRight") if(index<5) inputBoxRef.current[index+1]?.focus();
        if(key==="ArrowLeft") if(index>0) inputBoxRef.current[index-1]?.focus();
        if(!/^\d$/.test(key)) return;
        copyOtpArray[index]=key;
        setOtpfields(copyOtpArray);
        if(index<5) inputBoxRef.current[index+1]?.focus();
    }

    const submitOTP=()=>{
        const otp=otpfields.join('');
        try {
            toast.loading("verifying",{id: "verifying"});
            auth?.verifyEmail(email,otp)
            toast.success("SignUp Success",{id:"verifying"})
        } catch (error) {
            console.log("error occured:", error);
            toast.error("SignUp Failed",{id: "verifying"});
        }
    }

    useEffect(() => {
        if (auth?.isLoggedIn) {
        navigate("/chat");
        }
      }, [auth?.user]);
    
    
    return(
        <>
        <Container>
            {otpfields.map((item,index)=><InputBox ref={(currentNode: HTMLInputElement | null) => {inputBoxRef.current[index] = currentNode;}} key={index} type="text" value={item} onKeyDown={(e)=>handlekeydown(e,index)}/>)}
        </Container>
        <Button
                sx={{
                    px: 2,
                    py: 1,
                    mt: 4,
                    width: { xs: "100%", sm: "350px", md: "400px" },
                    borderRadius: 2,
                    bgcolor: "#00fffc",
                    color: "black",
                    ":hover": {
                    bgcolor: "white",
                    color: "black",
                    },
                }}
                onClick={submitOTP}
                endIcon={<IoIosLogIn />}
                >
                Verify
                </Button>
        </>
    )
}
export default InputBoxContainer;