import express from "express";
import cors from "cors";
import Router from "./routes/Foodroute.js";
import userrouter from "./routes/userroute.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/Cartroute.js";
import sql from "./config/db.js";
import { body, validationResult } from "express-validator";
import { webhook ,checkout} from "./controllers/Paymentcontrol.js";

const app=express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://appetite-c1a2.onrender.com"], // Your frontend URL
    allowedHeaders: ["Content-Type", "token", "Authorization"], // Explicitly allow 'token'
    credentials: true,
  }),
);
dotenv.config();

app.post(
   "/webhook",
   express.raw({ type: "application/json" }),
  webhook
 );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/create-checkout-session",
  body("email").isEmail(),
  body("phone").isLength({min:10,max:10 }), 
    body("pin").isLength({min:6,max:6 }),
 checkout
);


app.get("/session-status", async (req, res) => {
  const session = await stripes.checkout.sessions.retrieve(
    req.query.session_id,
    { expand: ["payment_intent", "subscription"] },
  );
  const lineItems = await stripes.checkout.sessions.listLineItems(
 session.id,
  );
  res.send({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent?.id,
    payment_intent_status: session.payment_intent?.status,
    subscription_id: session.payment_intent ? null : session.subscription?.id,
    subscription_status: session.payment_intent
      ? null
      : session.subscription?.status,
  });
});

app.use('/api/food',Router);
app.use('/images',express.static('uploads'));
app.use('/api/user',userrouter);
app.use("/api/cart", cartRouter);
const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
console.log('Server is working');
});
