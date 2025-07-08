import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import  config  from "dotenv";
import jwt from "jsonwebtoken";

config.config();    


export const signup=async (req, res) => {
 const { firstname, lastname, email, password } = req.body;
 try{
  const user=await User.findOne({email:email});
    if(user){
        return res.status(401).json({errror:"User already exists"})
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser= await User.create({
        firstname,
        lastname,
        email,
        password:hashedPassword
    })
    await newUser.save();
    return res.status(201).json({message:"User created successfully",user:newUser})
 }catch(err){
    console.log("Error in signup function",err);
    return res.status(500).json({error:"Internal server error"})
 }  

 
}

export const login=async (req, res) => {
   const { email, password } = req.body;   
   try{
    const user=await User.findOne({email:email}).select("+password");
   if(!user){
       return res.status(401).json({error:"Invalid email or password"})
   }
   const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
         return res.status(401).json({error:"Invald Email or password"})
    }
    //jwt code
    const token=jwt.sign({id:user._id},process.env.JWT_PASSWORD,{
    expiresIn:"1d"});
   
    const cookieOptions={
        expires:new Date(Date.now()+24*60*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"Strict",
    }
    res.cookie("jwt",token,cookieOptions);
    res.status(200).json({message:"Login successful",user,token});

   }catch(err){
    console.log("Error in login ",err);
    return res.status(500).json({error:"Error in login function"})
  }
}

export const logout=async (req, res) => {
    try{
        res.cookie("jwt")
    return res.status(200).json({message:"Logout successful"})
    }catch(err){    
        console.log("Error in logout function",err);
        return res.status(500).json({error:"Internal server error"})
    }
}