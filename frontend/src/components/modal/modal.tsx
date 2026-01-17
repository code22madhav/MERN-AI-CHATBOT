import { Button, Typography } from "@mui/material";
import { useChatContext } from "../../context/ChatContext";
import { ModalContainer, Backdrop, ModalBox } from "./modal.style";
import { useNavigate } from "react-router-dom";
const Modal=()=>{
    const chat=useChatContext();
    const navigate=useNavigate();
    return(
        <div>
            <ModalContainer>
                <Backdrop />
                <ModalBox>
                    <Typography variant="h5" fontWeight={500} sx={{color:"black"}}>Thanks for trying MERN GPT</Typography>
                    <Typography sx={{color:"#414a4c", pt:2}}>Log in or sign up to persist your chats</Typography>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        mt: 2,
                        width: {xs: "100%", md: "300px"},
                        borderRadius: 5,
                        bgcolor: "black",
                        color: "white"}}
                        onClick={()=>navigate("/login")}>Log in</Button>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        mt: 1,
                        width: {xs: "100%", md: "300px"},
                        borderRadius: 5,
                        bgcolor: "black",
                        color: "white"}}
                        onClick={()=>navigate("/signup")}>Sign up</Button>
                    <Button
                        sx={{
                            mt: 1,
                            padding: "0",
                            float:'left',
                            color: "#414a4c",
                            textTransform: "lowercase",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                        }}
                        onClick={()=>{chat.dismissPrompt()}}>
                    <span style={{textTransform: "uppercase",}}>S</span>tay logged out
                    </Button>
                </ModalBox>
            </ModalContainer>
        </div>
    )
}

export default Modal;