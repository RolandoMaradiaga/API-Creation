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

//////////////////////////////////////////// Request targeting all  Articles////////////////////////

app.route("/articles")

    .get((req,res)=>{
        Article.find((err,foundArticles) =>{
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
        })
    })

    .post((req,res) => {
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

    .delete((req,res) => {
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Deleted all articles")
        } else {
            res.send(err)
        }
    })
});

//////////////////////////////////////////// Request targeting specific article////////////////////////

app.route("/articles/:articleTitle")

    .get((req,res) =>{
        Article.findOne({title:req.params.articleTitle}, (err, foundArticle) =>{
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No Matching title found");
            }
        })
    })

    .put((req,res) =>{
        Article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title, content: req.body.content},
            {upsert:true},
            function(err){
                if(!err){
                    res.send("successfully updated article");
                }
            }
            )
    });

app.listen(3000,() =>{
    console.log("Server started at port 3000");
});