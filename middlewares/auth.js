import jwt from "jsonwebtoken";


const authmiddle= async(req,res,next)=>{
const {token}=req.headers;
if(!token)
{
    return res.json({success:false,message:"Not authorised.Login again"})
}
try {
    const td=jwt.verify(token,process.env.SECRET);
    req.body.userid=td.id;
    next();
} catch (error) {
    console.log(error);
    res.json({success:false,message:"An error occured"})
}
}

export default authmiddle;