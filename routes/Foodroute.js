import express from "express";
import { addFood, listfood, removefood } from "../controllers/Foodcontrol.js";
import multer from "multer";

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

export default Router;