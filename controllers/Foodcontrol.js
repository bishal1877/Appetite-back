import sql from "../config/db.js";
import fs from "fs";

const addFood =async(req,res)=>{
try
{
    let imgfile = `${req.file.filename}`;
 await sql`Insert into foodlist(name,price,category,describe,image) values(${req.body.name},${req.body.price},${req.body.category},${req.body.desc},${imgfile})`;
    res.status(200).json({ success: true, message:"Added successfully" });
}
catch (error)
{
res.status(401).json({success:false,message:error.message});
}
}

const listfood=async(req,res)=>{
try
{
    const food=await sql`Select * from foodlist`;
    res.json({success:true,list:food});
}
catch(error)
{
    console.log(error);
    res.json({success:false,message:"error"});
}

}

const removefood=async(req,res)=>{
try
{
let respons=await sql`Delete from foodlist where id=${req.body.id} returning *`;
await fs.unlink(`uploads\${respons.image}`,()=>{});
res.json({success:true,message:"food removed"});
}catch(error)
{
console.log(error);
res.json({success:false,message:"error"});
}
}

export {listfood,addFood,removefood};
