import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import sql from "../config/db.js"


export const loginuser= async(req,res)=>{
const {email,password} =req.body;
try{
const user=await sql `select *from usertable where email=${email}`
if(user.length==0)
{
return res.json({success:false,message:"User does not exists"});
}
const match=await bcrypt.compare(password,user[0].password);
if(!match)
{
return res.json({success:false,message:"Invalid credentials"});
}
const token=createToken(user[0].id);
return res.json({success:true,token,cartdata:user[0].cart});
} catch(error)
{
console.log(error);
res.json({success:false,message:"Error logging in."});
}
}

export const createToken =(id)=>{
console.log(id," create");
return jwt.sign({id:id},process.env.SECRET);
}


export const registeruser= async(req,res)=>{
const {email,name,password}=req.body;
try {
    const exist=await sql `select * from usertable where email=${email} `
if(exist.length>0)
{
    return res.json({success:false,message:"User already exists"})
}
if(!validator.isEmail(email))
{
    return res.json({success:false,message:"Please enter a valid email"})
}
if(!validator.isStrongPassword(password))
    return res.json({success:false,message:"Enter a Strong password"})

const hashpass = bcrypt.hashSync(password, 7);
const newuser =
  await sql`insert into usertable(name,email,password) values (${name},${email},${hashpass}) returning * `;
console.log(newuser[0].id);
  const token=createToken(newuser[0].id);
  return res.json({success:true,token})
} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
}
}