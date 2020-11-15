const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/impdb",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("success"))
.catch((err)=>console.log(err));
 const playlistSchema  = new mongoose.Schema({
     Name:String,
     Emailid:String,
     TotalAmount:Number
 })
 const impdata = mongoose.model("impdata",playlistSchema);
 module.exports  = impdata;
 
