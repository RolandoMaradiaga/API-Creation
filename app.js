const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


app.get("/articles", (req,res)=>{
    Article.find((err,foundArticles) =>{
    if(!err){
        res.send(foundArticles);
    } else {
        res.send(err);
    }
    })
})

app.post("/articles", (req,res) => {
   var title = req.body.title;
   var content = req.body.content;

    const newArticle = new Article({
        title: title,
        content: content
    })
    
    newArticle.save((err) =>{
        if(!err){
            res.send("Successfully added new article")
        } else {
            res.send(err);
        }
    });
})

app.listen(3000,() =>{
    console.log("Server started at port 3000");
});