import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import userRouter from './routess/user.route.js';
import authRouter from './routess/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routess/listing.route.js';

dotenv.config()


const app = express()
const port = 3000





mongoose.connect(process.env.MONGODB_ATLAS);

const db = mongoose.connection

db.on("error", console.error.bind(console,"MongoDb has Connection error:"));
db.once("open", ()=>{
    console.log(`MongoDB is connected sussesfully on Port ${port}`);
})


app.listen(3000, () =>{
    console.log("Server is Running on Port 3000");
})

app.use(express.json());

app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message  = err.message || "Internal server error!!"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});