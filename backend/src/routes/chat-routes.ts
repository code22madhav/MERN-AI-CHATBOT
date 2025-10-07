const express = require('express');

const chatRoutes=express.Router();

chatRoutes.get('/',(req,res)=>{
    res.send('chat')
});

export default chatRoutes;