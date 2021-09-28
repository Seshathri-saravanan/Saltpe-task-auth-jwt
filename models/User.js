const mongoose = require("mongoose");
const {Schema} = mongoose;

var User = new Schema({
    username:{
       type:String,
       unique:true,
       required:true
    },
    password:{
       type:String,
       required:true,
    }
});


module.exports = mongoose.model('User',User);