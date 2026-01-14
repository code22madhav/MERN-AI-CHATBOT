import { Box, Typography, Button } from "@mui/material";
import { IoIosLogIn } from "react-icons/io";
import CustomizedInput from "../components/shared/CustomizedInput";
import { useState } from "react";
import toast from "react-hot-toast";
import InputBoxContainer from '../components/otpcomponent/otpinput'
import { userSignUp } from "../helpers/api-communicator";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
};

type Step = "SIGNUP" | "OTP";
type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<Step>("SIGNUP");
  const [email_2b_verified, setEmail_2b_verified]=useState<string>('');
  const [signupData, setSignupData] = useState<SignupPayload | null>(null);
  const [timerKey, setTimerKey]=useState<number>(0);

  const signUpValidation=(name:string,email:string,password:string,confirm_password:string)=>{
    const newErrors: FormErrors = {};
    if (!name) {
    newErrors.name = "Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirm_password) {
      newErrors.confirm_password = "Confirm password is required";
    } else if (password !== confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length;
  }
  const executeSignup = async (data: SignupPayload) => {
  toast.loading("Sending OTP", { id: "signup" });

  const res = await userSignUp(
    data.name,
    data.email,
    data.password
  );

  if (res.message === "Verify_OTP") {
    toast.success("OTP Sent", { id: "signup" });
    setEmail_2b_verified(data.email);
    setStep("OTP");
  }
};
  const handleChange=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData= new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirm_password = String(formData.get("c_password") || "");
    const err=signUpValidation(name,email,password,confirm_password);
  
    if ( err> 0) return;
    setSignupData({ name, email, password });

  try {
      await executeSignup({ name, email, password });
  } catch (err:any) {
      const errmsg=JSON.parse(err.request.response).error;
      toast.error(`${errmsg}`,{id: "signup"});
  }
  }
  const resendOtp = async () => {
    if (!signupData) return;
    await executeSignup(signupData);
    setTimerKey((p)=>p+1)
  };
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
      {/* SIGNUP FORM CONDITIONAL RENDERING */}
      {step==='SIGNUP' && (<Box
        display="flex"
        flex={{ xs: 1, md: 0.5 }}
        justifyContent="center"
        alignItems="center"
        ml="auto"
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
                Sign-UP
                </Typography>

                <CustomizedInput type="text" name="name" label="Name" />
                {errors.name && (<Typography color="error" fontSize="12px">{errors.name}</Typography>)}

                <CustomizedInput type="email" name="email" label="Email" />
                {errors.email && <Typography color="error">{errors.email}</Typography>}

                <CustomizedInput type="password" name="password" label="Password" />
                {errors.password && <Typography color="error">{errors.password}</Typography>}

                <CustomizedInput type="password" name="c_password" label="Confirm Password" />
                {errors.confirm_password && (<Typography color="error">{errors.confirm_password}</Typography>)}

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
                SignUp
                </Button>
            </Box>
        </Box>
      </Box>)}
      {/* OTP INPUT CONDITIONAL RENDERING */}
      {step==="OTP" && (<Box
      display="flex"
        flex={{ xs: 1, md: 0.5 }}
        paddingTop={{xs: 16}} 
        justifyContent="center"
        alignItems="center"
        ml="auto"
        width="100%"><Box
                sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                }}
            >
                <Typography
                variant="h4"
                textAlign="center"
                fontWeight={600}
                >
                Enter OTP
                </Typography>
                <InputBoxContainer 
                  email={email_2b_verified} 
                  resendOTP={resendOtp} 
                  timerKey={timerKey} />
                </Box>
                </Box>)}
    </Box>
  )
}

export default SignUp