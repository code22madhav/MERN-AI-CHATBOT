const express = require('express');

import { loginValidator, signUpValidator, validation } from "../utils/validator";
const { getAllUser, userSignUp, userLogin }=require('../controllers/user-controller')

const userRoutes=express.Router();

userRoutes.get('/',getAllUser);
userRoutes.post('/signup',validation(signUpValidator),userSignUp);
userRoutes.post('/login',validation(loginValidator),userLogin);

export default userRoutes;