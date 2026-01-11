import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/chat/ChatItem";
import { red } from '@mui/material/colors';
import { useRef, useEffect, useMemo } from "react";
import { useChatContext } from "../context/ChatContext";
const Chat = () => {
  const inputRef=useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const chat=useChatContext();
  const chatContext=useChatContext();
  const handleInputSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const msg = inputRef.current?.value;
    if (!msg || msg.trim() === "") return;
    chatContext.generateResponse(msg);
    inputRef.current!.value = "";
  }
  const name = auth?.user?.name;
  const initials = useMemo(() => {
    if (!name) return "U";
    return name.split(" ").map(w => w[0]).slice(0, 2).join("");
  }, [name]);

  const clearConversation=()=>{
    chat.deleteUsersChat();
  }
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatContext.chatMessage]);
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
        overflow: "hidden",
        minWidth: 0, 
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
          minWidth: 0, 
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
            minWidth: 0, 
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
            onClick={clearConversation}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: { xs: 0, sm: 1, md: 3 },
          minWidth: 0, 
        }}
      >
        <Typography
          sx={{
            fontSize: {xs: "18px", sm: "18px", md: "24px"},
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - Gemini 2.5 Flash
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            minWidth: 0, 
            /* Hide scrollbar for Chrome, Safari, Edge */
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {chatContext.chatMessage.map((chat, index) => (
             //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
          <div ref={bottomRef}></div>
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
            marginTop: "20px",
            minWidth: 0, 
          }}
        >
          {" "}
          <form onSubmit={handleInputSubmit} style={{width: "100%", display: "flex", minWidth: 0}}>
            <input
              type="text"
              ref={inputRef}
              name="searchInput"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "15px",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "16px",
              }}
            />
            <IconButton sx={{ color: "white", mx: 1 }} type="submit">
              <IoMdSend />
            </IconButton>
          </form>
        </div>
      </Box>
    </Box>
  )
}

export default Chat