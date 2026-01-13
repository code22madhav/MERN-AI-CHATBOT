const mongoose = require('mongoose');
import { Document, Schema } from "mongoose";

export type Chat={
    role: 'user' | 'model',
    content: String;
}
//We extend Document only for things that are standalone MongoDB documents.
//Chats are subdocuments, not standalone documents — so they should NOT extend Document.
//User is the standalone Document here Stored in users collection, Has its own _id, Can be saved independently
//Can be queried independently, Have it's own save() method but Chats is not having these it's just a plain
// JS object imbeded inside chats hence we are extending userInterface from Document but not Chat

export interface IUser extends Document{
    name: String;
    email: String;
    password: String;
    chats: Chat [];
    isEmailVerified: boolean;
    emailOTP?: string;
    emailOTPExpires?: Date;
}

const chatSchema=new Schema<Chat>({
    role:{
        type: String,
        enum: ["user", "model"],
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
})
const userSchema=new Schema<IUser>({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    chats:{type: [chatSchema], default:[]},
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailOTP: String,
    emailOTPExpires: Date,
})

export default mongoose.model('User', userSchema)