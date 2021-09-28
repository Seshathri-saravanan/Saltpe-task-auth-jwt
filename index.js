const express = require("express");
const bodyParser = require("body-parser");



const app = express();

app.use(bodyParser.json());
app.use(auth);
app.get("/dashboard",(req,res,next)=>{
   console.log("In dashboard route");
   res.sendFile(__dirname+"/pages/dashboard.html");
})

app.get("")
function auth(req,res,next){
   if(req.body.username=="hello"){
      next();
   }
   else{
      res.sendStatus(403).end();
   }
}

app.listen(3000,()=>{console.log("Listening in port 3000")});
console.log("hello");