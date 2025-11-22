import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    const auth=useAuth();
    const handleChange=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData= new FormData(e.currentTarget);
        const email=formData.get("email") as string;
        const password=formData.get("password") as string;
        try {
            toast.loading("Logging In",{id: "login"});
            await auth?.login(email, password);  // IMPORTANT: add await otherwise try catch will not work
            toast.success("Login Success",{id: "login"});   //proprly and code will not wait to finsh login
        } catch (error) {                               //directly login success will be tosted
            console.log("error occured:", error);
            toast.error("Login Failed",{id: "login"});
        }
    }
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
        padding={8} 
        mt={8} 
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
        padding={2}
        ml="auto"
        mt={16}
        width="100%"
      >
        <form
            onSubmit={handleChange}
            style={{
                width: "100%",
                maxWidth: "400px",
                margin: "auto",
                padding: "30px",
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
        </form>
      </Box>
    </Box>
  );
};

export default Login;
