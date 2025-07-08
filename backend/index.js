import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app=express();
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import promptRoutes from "./routes/prompt.routes.js";
import cors from "cors";

const PORT=process.env.PORT||4001;
const MONGO_URI=process.env.MONGODB_URI

//middelware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost:5173', // ✅ explicitly specify frontend origin
  credentials: true ,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]                // ✅ allow cookies and credentials
}));

mongoose.connect(MONGO_URI).then(()=>{
console.log("MongoDB connected successfully")
 app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err)=>{   
    console.error("MongoDB connection failed",err)
})

//routes
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/deepseekai",promptRoutes);


