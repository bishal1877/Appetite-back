import express from "express";
import { addcart,getcart,removecart } from "../controllers/Cartcontrol.js";
import authmiddle from "../middlewares/auth.js";


const cartRouter=express.Router();

cartRouter.post('/get',authmiddle,getcart);
cartRouter.post('/add',authmiddle,addcart);
cartRouter.post('/remove',authmiddle,removecart);

export default cartRouter;