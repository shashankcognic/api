const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/product");

const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number,
});

const Product = new mongoose.model("product",productSchema);

app.post("/app/v1/product/new",async(req,res)=>{
    const product = await Product.create(req.body);
    res.status(200).json({
        success : true,
        product,
    })
})

app.get("/app/v1/products",async(req,res)=>{
    const products = await Product.find();
    res.status(200).json({
        success : true,
        products
    })
})

app.put("/app/v1/product/:id",async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success : false,
            msg : "Product Not Found"
        })
    }
    
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json({
        success : true,
        product
    })
})

app.delete("/app/v1/product/:id",async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success : false,
            msg : "Product Not Found"
        })
    }
    product.remove();
    res.status(200).json({
        success : true,
        msg : "Product is deleted"
    })
})

app.listen(4500,()=>{
    console.log("Server is working http://localhost:4500 ");
})