import { Request, Response, NextFunction } from 'express';
import User from "../models/user";
import { createToken } from "../utils/token-manager";
import { sendOTPEmail } from '../utils/sendOtpEmail';
const { hash, compare } = require('bcrypt');
const crypto = require('crypto');

export async function getAllUser(req:Request,res:Response){
    try {
        const Users=await User.find()
        return res.status(200).json({message:"ok", Users})
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Error occured in finding All users", error});
    }
}

export const createUser=async(name,email,password)=>{
    try {
        const hashedPassword=await hash(password, 10);
        const user=new User({
            name,
            email,
            password:hashedPassword
        });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

export async function userSignUp(req:Request,res:Response){
    try {
        const {name, email, password}=req.body;
        if(await User.findOne({email})){
            return res.status(401).json({error: "User already registered"});
        }
        const user=await createUser(name,email,password)

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
        user.emailOTP = hashedOTP;
        user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        user.isEmailVerified = false;

        await user.save();

        await sendOTPEmail(email, otp);

        return res.status(201).json({
            message: "Verify_OTP",
        });
    } catch (error) {
        if(error.code===11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({
            error: "Something went wrong",
            details: error.message,
        });
    }
}

export async function verifyEmailOTP(req: Request, res: Response){
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: "Email already verified" });
  }

  if (!user.emailOTP || !user.emailOTPExpires) {
    return res.status(400).json({ error: "OTP not found" });
  }

  if (user.emailOTPExpires < new Date()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (hashedOTP !== user.emailOTP) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  user.isEmailVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpires = undefined;

  await user.save();

    res.clearCookie("auth_token",{
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        signed: true,
    })
    const token=createToken(user._id.toString(), user.email, "7d");
    const expires=new Date();
    expires.setDate(expires.getDate()+7);
    res.cookie("auth_token",token,{
        path: '/',
        domain: 'localhost',
        expires,
        httpOnly: true,
        signed: true,
    });

  return res.json({
    message: "Email verified successfully",
    user,
  });
}

export async function userLogin(req:Request,res:Response){
    try {
        const {email, password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({error: "User not registered"});
        }
        const isPasswordCorrect= await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).json({error: "Incorrect password"});
        }
        res.clearCookie("auth_token",{
            path: '/',
            domain: 'localhost',
            httpOnly: true,
            signed: true,
        })
        const token=createToken(user._id.toString(), user.email, "7d");
        const expires=new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie("auth_token",token,{
            path: '/',
            domain: 'localhost',
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({user});
    } catch (error) {
        if(error.code===11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
export async function userLogout(req:Request,res:Response){
        try {
            const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
        }
        res.clearCookie("auth_token",{
            path: '/',
            domain: 'localhost',
            httpOnly: true,
            signed: true,
        })
        return res.status(200).json({message:"user logged out"});
    } catch (error) {
        if(error.code===11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
}

module.exports={
    getAllUser,
    userSignUp,
    userLogin,
    verifyUser,
    userLogout,
    verifyEmailOTP,
}