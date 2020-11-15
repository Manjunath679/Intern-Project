const express = require('express');
var bodyparser = require('body-parser'); 
const bank = require('../new/customersdb'); 
const path = require('path');
const  app = express();
const port = process.env.PORT || 8000;

const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
const { callbackify } = require('util');
const url = "mongodb://localhost:27017";
const dbName ='impdb';
const client = new MongoClient(url);



app.set("view engine","ejs");

const staticPath = path.join(__dirname,"../new/public")

app.use(express.static(staticPath));

app.use(express.urlencoded({
    extended : false
}));


 

app.get("/index",(req,res)=>{
    res.render('index');
});
app.get("/customers",function(req,res){
      
        const db = client.db(dbName);
        const collection = db.collection('impdatas');
        collection.find({}).toArray(function(err,customer_list){
            assert.equal(err,null);
            res.render('customers',{'customers':customer_list})
        });
       
});
app.get("/transfermoney", async(req,res)=>{
    //const customers = await bank.find();
    //const person = await bank.findOne({});
    res.render('transfermoney');
});

app.post("/transfer",async(req,res) =>{
    const amount = req.body.Amount;
    const receiver_name = req.body.Recipient;
    const sender_name = req.body.Sender;
    const db = client.db(dbName);
    const collection = db.collection('impdatas');
    const detail = await collection.findOne({Name:sender_name});
  
    if(detail.TotalMoney >= amount)
    {
        const detail2 = await collection.findOne({Name:receiver_name});
        const updateDocument2 = {
            $set:{TotalMoney: detail2.TotalMoney + parseInt(amount)},
        }
        const result2 = await collection.updateOne(detail2,updateDocument2);
        
        const updateDocument= {
            $set:{TotalMoney : detail.TotalMoney - amount},
        }
        const result = await collection.updateOne(detail,updateDocument);
       
        const amount1 = detail.TotalMoney;
        console.log("sender_name");
        console.log(detail2.TotalMoney);
        console.log(detail.Name);
        res.render('index');
    }
    else{
        res.send("error");
    }

})



client.connect(function(err){
    assert.equal(null,err);
    console.log("connected success");
   
    app.listen(port,()=>{
        console.log(`listening to ${port}`);
    });

});

