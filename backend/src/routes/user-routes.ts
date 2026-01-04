const express = require('express');

import { verifyToken } from "../utils/token-manager";
import { loginValidator, signUpValidator, validation } from "../utils/validator";
const { getAllUser, userSignUp, userLogin, verifyUser, userLogout}=require('../controllers/user-controller')

const userRoutes=express.Router();

userRoutes.get('/',getAllUser);
userRoutes.post('/signup',validation(signUpValidator),userSignUp);
userRoutes.post('/login',validation(loginValidator),userLogin);
userRoutes.get('/check_auth',verifyToken,verifyUser);
userRoutes.get('/logout',verifyToken,userLogout);

export default userRoutes;