import express from "express";
import cors from "cors";
import Router from "./routes/Foodroute.js";
import userrouter from "./routes/userroute.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/Cartroute.js";
import stripe from 'stripe';
import sql from "./config/db.js";
import { body, validationResult } from "express-validator";
const app=express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://appetite-c1a2.onrender.com"], // Your frontend URL
    allowedHeaders: ["Content-Type", "token", "Authorization"], // Explicitly allow 'token'
    credentials: true,
  }),
);
dotenv.config();
const stripes = stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2026-03-25.dahlia",
});
app.post(
   "/webhook",
   express.raw({ type: "application/json" }),
   (request, response) => {
     let event = request.body;

     if (endpointSecret) {
       const signature = request.headers["stripe-signature"];
       try {
         event = stripe.webhooks.constructEvent(
           request.body,
           signature,
           endpointSecret,
         );
       } catch (err) {
         console.log(`⚠️  Webhook signature verification failed.`, err.message);
         return response.sendStatus(400);
       }
     }
             const paymentIntent = event.data.object;
     switch (event.type) {
       case "payment_intent.succeeded":
         console.log(
           `PaymentIntent for ${paymentIntent.amount} was successful!`,
         );
         break;
       case "checkout.session.completed":
       (async  function pay()
         {
           try {
           const paymentMethod = event.data.object;
           const lineItems = await stripes.checkout.sessions.listLineItems(
             paymentMethod.id,
           );
           let linearray={}
           for(let key of lineItems.data)
           {
linearray[key.description] = {
quantity:key.quantity,
amount:key.amount_total/100
}
           }
           const customer = await stripes.customers.retrieve(paymentMethod.customer);
   await sql`insert into ordertable(email,amount,address,items,phone,name) values (${customer.email},${paymentMethod.amount_total / 100},${customer.shipping.address},${linearray},${customer.shipping.phone},${customer.name})  `;
           } catch (error) {
             console.log(error.message)
           }
 })()
         break;
       default:
         console.log(`Unhandled event type ${event.type}.`);
     }
 return response.sendStatus(200);
   },
 );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const YOUR_DOMAIN = "http://localhost:5173";
const endpointSecret =
  "whsec_a20dd13a46d31221de44329065fd8b291949fcd3005238e60b87c533978cb6b1";
app.post(
  "/create-checkout-session",
  body("email").isEmail(),
  body("phone").isLength({min:10,max:10 }),
    body("pin").isLength({min:6,max:6 }),
  async (req, res) => {
    const result = validationResult(req);
  if(result.errors)
  {
const errors=result.errors;
       if (errors.length>0) {
         return res
           .status(400)
           .send(`Invalid ${errors[0].path}. Please try again.`);
       }
  }
    const customer = await stripes.customers.create({
      name: req.body.firstname + req.body.lastname,
      email: req.body.email,
      shipping: {
        address: {
          city: req.body.street + req.body.city,
          postal_code: Number(req.body.pin),
        },
        name: req.body.firstname + " " + req.body.lastname,
        phone: Number(req.body.phone),
      },
    });
    let jp = JSON.parse(req.body.product);
    let lineitem = [];
    for (let item in jp) {
      const price = await stripes.prices.create({
        currency: "inr",
        unit_amount: jp[item].price * 100,
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
      line_items: lineitem,
      mode: "payment",
      customer: customer.id,
      success_url: `${YOUR_DOMAIN}/complete?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/complete?success=false&session_id={CHECKOUT_SESSION_ID}`,
    });
    res.redirect(303, session.url);
  },
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
const PORT = process.env.PORT || 4000;


app.listen(PORT,()=>{
console.log('Server is working');
});
