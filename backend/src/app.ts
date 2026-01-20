import cookieParser from "cookie-parser";
const express = require('express');
const morgan=require('morgan');
require('dotenv').config();
const path = require('path');
import cors from "cors";
import { Request, Response } from 'express';

const api_v1=require('./routes/api_v1');

const app=express();
app.use(cors({
    origin: 'http://localhost:5173', credentials: true
}))

app.use(morgan('combined')); //parameter passed here decide the format of output like combined give detailed logs
app.use(express.json()); //bydefault data is sent in streams through http there this middleware help to collect
                            //collect data by listening to data and end events 
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(express.static(path.join(__dirname,"..","public")));
app.use('/v1', api_v1);

//if you dont't use this then exress will break for frontend routing therefor to react take over
//from here if any route doesn't matches then serve index.html and from there react router will takecare
app.use((req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;