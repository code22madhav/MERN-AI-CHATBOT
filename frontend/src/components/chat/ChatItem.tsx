import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import ReactMarkDown from "react-markdown"
import { useMemo } from "react";
import PersonIcon from '@mui/icons-material/Person';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const ChatItem = ({content, role}:{content:string; role: "user" | "model"}) => {
  const auth=useAuth();
  const name = auth?.user?.name;
  const initials = useMemo(() => {
    if (!name) return;
    return name.split(" ").map(w => w[0]).slice(0, 2).join("");
  }, [name]);
  return role === "model"? 
  <Box sx={{
        display: "flex",
        p: 1,
        bgcolor: "#004d5612",
        gap: {xs: 1, sm: 1, md: 2},
        borderRadius: 2,
        my: {xs: 1.5, sm: 1, md: 1},
        minWidth: 0, 
      }}>
    <Avatar sx={{ ml: "0", width: {xs: 25, sm: 25, md: 30}, height: {xs: 25, sm: 25, md: 30}}}>
      <EmojiObjectsIcon width={"18px"} height={"18px"}/>
    </Avatar>
    <Box sx={{ fontSize: { xs: "12px", sm: "14px", md: "14px" }, 
        display:"block", 
        minWidth: 0, 
        overflowWrap: "break-word",
        wordBreak: "break-word", 
        textAlign:"left", 
        "& > *:first-of-type": {
          marginTop: 0,
          lineHeight: 1.25,
      }}}><ReactMarkDown>{content}</ReactMarkDown></Box>
  </Box>
  :
  <Box sx={{
        display: "flex",
        p: 1,
        bgcolor: "#004d56",
        gap: {xs: 1, sm: 1, md: 2},
        borderRadius: 2,
      }}>
    <Avatar sx={{ ml: "0", bgcolor: "black", color: "white", 
      width: {xs: 25, sm: 25, md: 30},
       height: {xs: 25, sm: 25, md: 30},
       fontSize: { xs: "9px", sm: "10px", md: "12px" } }}>
        {initials ? initials : <PersonIcon/>}
    </Avatar>
    <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "14px" }}}>{content}</Typography>
  </Box>; 
}

export default ChatItem