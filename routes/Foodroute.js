import express from "express";
import { addFood, listfood, ordereditems, removefood } from "../controllers/Foodcontrol.js";
import multer from "multer";
import authmiddle from "../middlewares/auth.js";

 const Router=express.Router();

const storage=multer.diskStorage({
    destination :"uploads",
        filename:(req,file,cb)=>{
            return cb(null,`${file.originalname}`);       
    }
})

const upload=multer({storage:storage});

Router.post('/add',upload.single("image"),addFood);
Router.get('/list',listfood);
Router.post('/remove',removefood);
Router.get('/order',authmiddle , ordereditems);

export default Router;