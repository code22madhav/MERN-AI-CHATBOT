import { AppBar, Toolbar } from "@mui/material"
import Logo from "./shared/Logo"
import NavLink from "./shared/NavLink"
import { useAuth } from "../context/AuthContext"
const Header = () => {
    const auth=useAuth();
  return (
    <AppBar sx={{bgcolor: "transparent", position: "static", boxShadow:"none"}}>
        <Toolbar sx={{display: "flex"}}><Logo/><div>
            {auth?.isLoggedIn ? <>
            <NavLink 
            bg="#00fffc"
            to="/chat"
            text="chat"
            textColor="black"
            />
            <NavLink
            bg="#51538f"
            to="/logout"
            text="Logout"
            textColor="white"
            onClick={auth.logout}
            />
            </>: <>
            <NavLink 
            bg="#00fffc"
            to="/login"
            text="Login"
            textColor="black"
            />
            <NavLink
            bg="#51538f"
            to="/signup"
            text="SignUp"
            textColor="white"
            />
            </>}
            </div></Toolbar>
    </AppBar>
  )
}

export default Header