import app from './app'
const { connectDb } = require('./db/connection');
const PORT=process.env.PORT || 8000;

async function startServer(){
    try {
        await connectDb();
        app.listen(PORT,()=>{
            console.log(`Listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(`Encountered Error in starting server ${error}`)
    }
}

startServer();
