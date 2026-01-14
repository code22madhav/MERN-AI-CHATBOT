import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    const auth=useAuth();
    const navigate=useNavigate();
    const handleChange=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData= new FormData(e.currentTarget);
        const email=formData.get("email") as string;
        const password=formData.get("password") as string;
        try {
            toast.loading("Logging In",{id: "login"});
            await auth?.login(email, password);  // IMPORTANT: add await otherwise try catch will not work
            toast.success("Login Success",{id: "login"});   //proprly and code will not wait to finsh login
        } catch (err:any) {                               //directly login success will be tosted
            console.log("error occured:", err);
            const errmsg=JSON.parse(err.request.response).error;
            if(errmsg==="Incorrect password" || errmsg==="User not registered") {
              toast.error("Invalid Email/Password",{id: "login"});
              return
            }
            toast.error("Login Failed",{id: "login"});
        }
    }
    useEffect(() => {
      if (auth?.isLoggedIn) {
        navigate("/chat");
      }
  }, [auth?.user]);
  return (
    <Box 
      width="100%" 
      height="100%" 
      display="flex" 
      flex={1} 
      overflow="hidden"
    >
      {/* LEFT IMAGE SECTION (Hidden on small screens) */}
      <Box 
        padding={4} 
        mt={4} 
        display={{ md: "flex", sm: "none", xs: "none" }}
      >
        <img 
          src="airobot.png" 
          alt="Robot" 
          style={{ width: "100%", maxWidth: "400px" }} 
        />
      </Box>

      {/* RIGHT FORM SECTION */}
      <Box
        display="flex"
        flex={{ xs: 1, md: 0.5 }}
        justifyContent="center"
        alignItems="center"
        ml="auto"
        mt={4}
        width="100%"
      >
        <Box
            component="form"
            onSubmit={handleChange}
            sx={{
                width: "100%",
                maxWidth: "400px",
                margin: "auto",
                padding: { xs: "30px 0", sm: "30px",md: "30px"},
                boxShadow: "10px 10px 20px #000",
                borderRadius: "10px",
                border: "none",
            }}
            >
            <Box
                sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                }}
            >
                <Typography
                variant="h4"
                textAlign="center"
                padding={2}
                fontWeight={600}
                >
                Login
                </Typography>

                <CustomizedInput type="email" name="email" label="Email" />
                <CustomizedInput type="password" name="password" label="Password" />
                <Typography mt={2} textAlign={"left"} sx={{fontSize: { xs: "14px", sm: "16px",md: "20px"}}}>Don't have a account? <Link style={{color:"#F2F0EF"}} to="/signup">Create New</Link></Typography>
                <Button
                type="submit"
                sx={{
                    px: 2,
                    py: 1,
                    mt: 2,
                    width: { xs: "100%", sm: "350px", md: "400px" },
                    borderRadius: 2,
                    bgcolor: "#00fffc",
                    color: "black",
                    ":hover": {
                    bgcolor: "white",
                    color: "black",
                    },
                }}
                endIcon={<IoIosLogIn />}
                >
                Login
                </Button>
            </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
