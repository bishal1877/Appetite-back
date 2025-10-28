import express from "express";
import cors from "cors";
import Router from "./routes/Foodroute.js";
import userrouter from "./routes/userroute.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/Cartroute.js";

const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();


app.use('/api/food',Router);
app.use('/images',express.static('uploads'));
app.use('/api/user',userrouter);
app.use("/api/cart", cartRouter);
const PORT = process.env.PORT || 4000;


app.listen(PORT,()=>{
console.log('Server is working');
});
