const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./models/User.js")
const jwt = require("jsonwebtoken");

const uri = "mongodb+srv://seshathri:seshathri@cluster0.wio17.mongodb.net/saltpe-jwt?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },()=>{
   console.log("connected to the db server");
   //console.log(User.find({}));
})

const app = express();
const secretKey = "afjafjhdsbnuig3klndsoikjiulbejhsdafjgf";

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/signup",(req,res,next)=>{
   res.sendFile(__dirname+"/pages/signup.html");
})
app.post('/signup', (req, res, next) => {
   User.find({username:req.body.username}).then((users)=>{
      if(users.length!=0){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({message:"user already exists"});
        return;
      }
   })
   User.create(req.body).then((user) => {
      console.log(user);
      res.statusCode = 200;
      res.sendFile(__dirname+"/pages/successful-signup.html");
     
   });
 });
app.get("/login",(req,res,next)=>{
   res.sendFile(__dirname+"/pages/login.html");
})
app.post("/login",(req,res,next)=>{
   //console.log("post req",req.body)
   var {username,password} = req.body;
   User.find({username}).then((users)=>{
      if(users.length==0){
         res.send("users does not exists");
         return;
      }
      if(users.length==1 &&users[0].password==password){
         var token = jwt.sign(
            {
            username:username
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
      else{
         res.send("incorrect password");
      }
   })
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

app.listen(process.env.PORT || 3000,()=>{console.log("Listening in port 3000")});
console.log("hello");