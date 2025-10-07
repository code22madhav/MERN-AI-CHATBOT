const express = require('express');

const userRoutes=express.Router();

userRoutes.get('/',(req,res)=>{
    res.send('user')
});

export default userRoutes;