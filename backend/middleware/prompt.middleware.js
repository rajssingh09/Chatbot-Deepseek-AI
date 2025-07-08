import jwt from "jsonwebtoken";
function usermiddleware(req,res,next){
    const authHeader=req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({error:"Unauthorized"});
    }
try{
    const token=authHeader.split(" ")[1];
    const decoded=jwt.verify(token,process.env.JWT_PASSWORD);
    req.userId=decoded.id;
    next();
}catch(error){
    console.log("Error in usermiddleware",error);
    return res.status(401).json({error:"Invalid Token"});
}
}

export default usermiddleware;