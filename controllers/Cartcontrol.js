import sql from "../config/db.js";

const addcart= async(req,res)=>{
try {
  
    let userdata= await sql `select * from usertable where id=${req.body.userid}`
    let cartdata=(userdata[0].cart);
if(!cartdata[req.body.itemid])
{
    cartdata[req.body.itemid]=1;
}
else
    cartdata[req.body.itemid]+=1;
await sql `update usertable set cart=${JSON.stringify(cartdata)} where id=${req.body.userid}` 
return res.json({success:true,message:"Item add to cart"});
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error adding."});
}
}

const removecart = async (req, res) => {
try {
        let userdata =
          await sql`select * from usertable where id=${req.body.userid}`;
        let cartdata = userdata[0].cart;
        if(cartdata[req.body.itemid]>0)
            cartdata[req.body.itemid]--;
        await sql`update usertable set cart=${JSON.stringify(
          cartdata
        )} where id=${req.body.userid}`; 
       return res.json({ success: true, message: "Removed from cart" }); 
} catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Error removing" });
}
}

const getcart = async (req, res) => {
try {
    let userdata =
      await sql`select * from usertable where id=${req.body.userid}`;
        let cartdata = userdata[0].cart;
        res.json({success:true,cartdata:cartdata});
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error fetching"})
}
}

export {addcart,getcart,removecart};