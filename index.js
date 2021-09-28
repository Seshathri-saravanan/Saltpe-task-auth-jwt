const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


const app = express();
const secretKey = "afjafjhdsbnuig3klndsoikjiulbejhsdafjgf";

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/login",(req,res,next)=>{
   res.sendFile(__dirname+"/pages/login.html");
})
app.post("/login",(req,res,next)=>{
   //console.log("post req",req.body)
   var {username,password} = req.body;
   console.log(username,password);
   if(username=="hello"){
      var token = jwt.sign(
         {
         username:req.body.username
         }, 
         secretKey, 
         { expiresIn: 60 * 60 }
      );
      res.cookie('accessToken',token,{
         httpOnly: true,
         sameSite: "strict",
      })
      req.user = username;
      res.redirect('/dashboard');
      res.end();
      return;
   }
   else 
      res.send("authorize");
})
app.use(verifyToken);
app.get("/logout",(req,res,next)=>{
   console.log("logout route");
   res.clearCookie('accessToken');
   res.sendFile(__dirname+"/pages/logout.html");
})
app.get("/dashboard",(req,res,next)=>{
   console.log("In dashboard route");
   res.sendFile(__dirname+"/pages/dashboard.html");
})

app.get("")
function verifyToken(req,res,next){
   var token = req.cookies && req.cookies["accessToken"]
   if(token){
      jwt.verify(token,secretKey,(err,user)=>{
         if(!err){
            next();
         }
         else{
            res.redirect('/login');
         }
      })
      return;
   }
   else{
      res.redirect('/login');
   }
}

app.listen(3000,()=>{console.log("Listening in port 3000")});
console.log("hello");