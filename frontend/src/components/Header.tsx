import { AppBar, Toolbar } from "@mui/material"
import Logo from "./shared/Logo"
import NavLink from "./shared/NavLink"
import { useAuth } from "../context/AuthContext"
const Header = () => {
    const auth=useAuth();
    const changeStep=async()=>{auth?.setLoginStepReset((prev)=>prev+1)}
  return (
    <AppBar sx={{bgcolor: "transparent", position: "static", boxShadow:"none"}}>
        <Toolbar sx={{display: "flex"}}><Logo/><div>
            {auth?.isLoggedIn ? 
            <NavLink
            bg="#00fffc"
            to="/login"
            text="Logout"
            textColor="black"
            onClick={auth.logout}
            />:
            <NavLink 
            bg="#00fffc"
            to="/login"
            text="Login"
            textColor="black"
            onClick={changeStep}
            />}
            </div></Toolbar>
    </AppBar>
  )
}

export default Header