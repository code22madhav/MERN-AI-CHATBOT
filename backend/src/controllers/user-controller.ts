import { compare } from "bcrypt";
import User from "../models/user";
const mongoose = require('mongoose');
const { hash } = require('bcrypt');

async function getAllUser(req,res){
    try {
        const Users=await User.find()
        return res.status(200).json({message:"ok", Users})
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Error occured in finding All users", error});
    }
}

const createUser=async(name,email,password)=>{
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

async function userSignUp(req,res){
    try {
        const {name, email, password}=req.body;
        if(await User.findOne({email})){
            return res.status(401).json({error: "User already registered"});
        }
        const user=await createUser(name,email,password)
        return res.status(201).json({user});
    } catch (error) {
        if(error.code===11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
}
async function userLogin(req,res){
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
        return res.status(200).json({user});
    } catch (error) {
        if(error.code===11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
}
module.exports={
    getAllUser,
    userSignUp,
    userLogin,
}