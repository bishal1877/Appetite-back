import express from "express";
import cors from "cors";
import Router from "./routes/Foodroute.js";
import userrouter from "./routes/userroute.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/Cartroute.js";
import stripe from 'stripe';

const stripes=stripe(
  "sk_test_51SNDibRwQbGocfAWToDgs0X8fF77GKBkoMCz4jV6FUcEdXj6lZbaF9QeefZ8SBDbYMELovOQpn6iRBGlwDXhWMFB00H2Di4kAm",
  {
    apiVersion: "2026-03-25.dahlia",
  },
);
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const YOUR_DOMAIN = "http://localhost:5173";

app.post("/create-checkout-session", async (req, res) => {
    const customer = await stripes.customers.create({
      name: req.body.firstname + req.body.lastname,
      email: req.body.email,
      phone: (req.body.phone),
    shipping:{
address:{
  city:req.body.street+req.body.city,
  postal_code: Number(req.body.pin)
},
name:req.body.firstname + req.body.lastname
    }
    });
    let jp = JSON.parse(req.body.product);
   let lineitem=[]
    for(let item in jp)
   {
    const price = await stripes.prices.create({
      currency: "inr",
      unit_amount: jp[item].price*100,
      product_data: {
        name: jp[item].name,
      },
    });
lineitem.push({ price: price.id, quantity: jp[item].quantity });
   }
      const price = await stripes.prices.create({
        currency: "inr",
        unit_amount: 2 * 100,
        product_data: {
          name: "Delivery fee",
        },
      });
      lineitem.push({ price: price.id, quantity: 1 });
  const session = await stripes.checkout.sessions.create({
    line_items:lineitem
    ,
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/complete?session_id={CHECKOUT_SESSION_ID}`,
  });
  res.redirect(303, session.url);
});

app.get("/session-status", async (req, res) => {
  const session = await stripes.checkout.sessions.retrieve(
    req.query.session_id,
    { expand: ["payment_intent", "subscription"] },
  );
  const lineItems = await stripes.checkout.sessions.listLineItems(
 session.id,
  );
  console.log(lineItems)
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

app.listen(3000,()=>{
console.log('Server is working');
});
