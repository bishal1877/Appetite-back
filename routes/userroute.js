import express from "express"
import {
  loginuser,
  registeruser,
  getemail,
} from "../controllers/usercontrol.js";
import authmiddle from "../middlewares/auth.js";



const userrouter=express.Router();

userrouter.post('/register',registeruser);
userrouter.post('/login',loginuser);
userrouter.get("/getemail", authmiddle,getemail);


export default userrouter