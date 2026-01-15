import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { forgetPassword, verifyResetOtp, resetPassword } from "../helpers/api-communicator";
import InputBoxContainer from "../components/otpcomponent/otpinput";

type step= "LOGIN" | "EMAIL" | "OTP" | "PASSWORD";
const Login = () => {
    const auth=useAuth();
    const navigate=useNavigate();
    const [step,setStep]=useState<step>("LOGIN")
    const [timerKey, setTimerKey]=useState<number>(0);
    const [emailToVerify,setEmailToVerify]=useState<string | null>(null)
    const [errors,setErrors]=useState<string | null>(null);
    const [resetToken,setResetToken]=useState<string | null>(null)

    const handleLogin=async(e:React.FormEvent<HTMLFormElement>)=>{
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
    const handleSendOtp=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      const formData= new FormData(e.currentTarget);
      const email=formData.get("email") as string;
      try {
        toast.loading("Sending OTP",{id: "reset"});
        const res=await forgetPassword(email);
        setEmailToVerify(email);
        toast.success("OTP SENT",{id: "reset"});
        if(res.message==="Verify_OTP"){
          setStep("OTP")
        }
      } catch (err:any) {
            console.log("error occured:", err);
            const errmsg=JSON.parse(err.request.response).error;
            toast.error(`${errmsg}`,{id: "reset"});
      }
    }
    const submitOTP=async(otp:string)=>{
      try {
        if(!emailToVerify){
          throw new Error("Email is missing");
        }
        toast.loading("Verifying OTP",{id:"resetOTPvalidation"});
        const res=await verifyResetOtp(emailToVerify,otp);
        toast.success("OTP Verified",{id:"resetOTPvalidation"});
        if(res.resetToken){
          setStep("PASSWORD");
        }
        setResetToken(res.resetToken);
      } catch (error:any) {
            console.log("error occured:", error);
            const errmsg=JSON.parse(error.request.response).error;
            toast.error(`${errmsg}`,{id: "resetOTPvalidation"});
      }
    }
    const resendOtp = async () => {
      try {
        if(!emailToVerify){
          throw new Error("Email is missing");
        }
        toast.loading("Sending OTP",{id: "reset"});
        const res=await forgetPassword(emailToVerify);
        setEmailToVerify(emailToVerify);
        setTimerKey((p)=>p+1)
        toast.success("OTP SENT",{id: "reset"});
        if(res.message==="Verify_OTP"){
          setStep("OTP")
        }
      } catch (err:any) {
            console.log("error occured:", err);
            toast.error("Error Occured",{id: "reset"});
      }
  };
  const handleResetPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData=new FormData(e.currentTarget);
    const newPassword=formData.get("password") as string;
    const confirmPassword=formData.get("c_password")
    if(!newPassword|| !confirmPassword) return;
    if(newPassword!==confirmPassword){
      setErrors("Password & Confirm Password didn't matched");
      return;
    }
    try {
        if(resetToken && newPassword){
          let res=await resetPassword(resetToken,newPassword)
          toast.success('Password Successfully Reset',{id:"reset"})
        if(res.message==='Password reset successful'){
          setStep("LOGIN");
        }
    }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong",{id:'reset'});
        setStep('LOGIN');
    }
  };
    useEffect(() => {
      if (auth?.isLoggedIn) {
        navigate("/chat");
      }
  }, [auth?.user]);
  useEffect(()=>{setStep("LOGIN")},[auth?.loginStepReset])
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
      {step==="LOGIN" && <Box
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
            onSubmit={handleLogin}
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
                <Box
                  sx={{textAlign:"left", paddingTop:"20px"}}
                ><Button
                  onClick={()=>setStep("EMAIL")}
                  sx={{
                      padding: "0",
                      float:'left',
                      color: "white",
                      textTransform: "lowercase",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}>
                <span style={{textTransform: "uppercase",}}>F</span>orget Password?
                </Button></Box>
                <Typography 
                  mt={2} 
                  textAlign={"left"} 
                  sx={{fontSize: { xs: "14px", sm: "16px",md: "20px"}}}>Don't have a account?&nbsp;
                  <Link style={{color:"#F2F0EF"}} to="/signup">Create New</Link>
                  </Typography>
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
      </Box>}
      {step==="EMAIL" && <Box
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
            onSubmit={handleSendOtp}
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
                Registered Email
                </Typography>

                <CustomizedInput type="email" name="email" label="Email" />
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
                Send OTP
                </Button>
            </Box>
        </Box>
      </Box>}
      {step==="OTP" && <Box
        display="flex"
        flex={{ xs: 1, md: 0.5 }}
        justifyContent="center"
        alignItems="center"
        ml="auto"
        mt={4}
        width="100%"
      >
        <Box
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
                Veify OTP
                </Typography>
                <Typography>Please don't refresh the page</Typography>
                <InputBoxContainer 
                  submitOTP={submitOTP}
                  resendOTP={resendOtp} 
                  timerKey={timerKey} />
            </Box>
        </Box>
      </Box>}
      {step==="PASSWORD" && <Box
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
            onSubmit={handleResetPassword}
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
                Reset Password
                </Typography>
                <Typography>Please don't refresh the page</Typography>
                <CustomizedInput type="password" name="password" label="Password" />
                <CustomizedInput type="password" name="c_password" label="Confirm Password" />
                {errors && (<Typography color="error">{errors}</Typography>)}

                <Button
                type="submit"
                sx={{
                    px: 2,
                    py: 1,
                    mt: 3,
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
                Submit
                </Button>
            </Box>
        </Box>
      </Box>}
    </Box>
  );
};

export default Login;
