const mongoose = require('mongoose');
require('dotenv').config();
const URI=process.env.MONGO_URL;


mongoose.connection.once('open',()=>{
    console.log("Database Connected");
})
mongoose.connection.on('error',(err)=>{
    console.error(`Error encountred in connecting DB ${err}`);
})

async function connectDb(){
    await mongoose.connect(URI);
}

async function disconnectDb(){
    await mongoose.disconnect();
}

module.exports={
    connectDb,
    disconnectDb
}
