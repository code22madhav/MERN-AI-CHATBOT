const express = require('express');
const morgan=require('morgan');

const api_v1=require('./routes/api_v1');

const app=express();


app.use(morgan('combined')); //parameter passed here decide the format of output like combined give detailed logs
app.use(express.json()); //bydefault data is sent in streams through http there this middleware help to collect
                            //collect data by listening to data and end events 

app.use('/v1', api_v1);

export default app;