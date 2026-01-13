const express = require('express');

import { verifyToken } from "../utils/token-manager";
import { loginValidator, signUpValidator, verifyEmailValidator, validation } from "../utils/validator";
import { getAllUser, userSignUp, userLogin, verifyUser, userLogout, verifyEmailOTP} from '../controllers/user-controller'

const userRoutes=express.Router();

userRoutes.get('/',getAllUser);
userRoutes.post('/signup',validation(signUpValidator),userSignUp);
userRoutes.post('/login',validation(loginValidator),userLogin);
userRoutes.post('/verify_email',validation(verifyEmailValidator),verifyEmailOTP);
userRoutes.get('/check_auth',verifyToken,verifyUser);
userRoutes.get('/logout',verifyToken,userLogout);

export default userRoutes;