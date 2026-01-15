const express = require('express');

import { verifyToken } from "../utils/token-manager";
import { loginValidator, signUpValidator, OTPEmailValidator, verifyEmail, validation } from "../utils/validator";
import { getAllUser, userSignUp, userLogin, verifyUser, userLogout, verifyEmailOTP, forgotPasword, verifyResetOTP, resetPassword} from '../controllers/user-controller'

const userRoutes=express.Router();

userRoutes.get('/',getAllUser);
//signup routes
userRoutes.post('/signup',validation(signUpValidator),userSignUp);
userRoutes.post('/verify_email',validation(OTPEmailValidator),verifyEmailOTP);

//login route
userRoutes.post('/login',validation(loginValidator),userLogin);

userRoutes.get('/check_auth',verifyToken,verifyUser);
userRoutes.get('/logout',verifyToken,userLogout);

//Reset password routes
userRoutes.post('/forgot-password',validation(verifyEmail),forgotPasword);
userRoutes.post('/verify-reset-otp',validation(OTPEmailValidator),verifyResetOTP);
userRoutes.post('/reset-password',resetPassword);

export default userRoutes;