import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Link to={"/"}>
        <EmojiObjectsIcon sx={{width:"40px", height:"40px", color:"white"}}/>
      </Link>{" "}
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          mr: "auto",
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>MERN</span>-GPT
      </Typography>
    </div>
  );
};

export default Logo;
