//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//DB code
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = {
  title:String,
  content:String
};
const Article = mongoose.model("Article",articleSchema);

//"/articles" all chained routes
app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err)
      res.send(foundArticles);
    else
      res.send(err);
  });
})

.post(function(req,res){
  newArtcile = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArtcile.save(function(err){
    if(!err)
      res.send("Success");
    else
    res.send(err);
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err)
    res.send("deleted all items successfully.");
    else
    res.send(err);
  });
});

//"/articles/:title" chained routes

app.route("/articles/:title")

.get(function(req,res){
  Article.findOne({title:req.params.title},function(err,foundArticle){
    if(!err)
    {
      if(foundArticle)
        res.send(foundArticle);
        else
        res.send("No matching article found.");
    }
    else
    res.send(err);
  });
})

.put(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.title},
    {
      title:req.body.title,
      content:req.body.content
    },
    {overwrite:true},
    function(err){
      if(!err)
        res.send("Item replaced successfully.");
    else
    res.send(err);
  });
})

.patch(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.title},
    {$set: {title:req.body.title,content:req.body.content}},
    function(err,foundArticle){
      if(!err){
        if(foundArticle)
      res.send("Patched successfully.");
      else
      res.send("No such Article found.")
    } else
      res.send(err);
    }
  );
})

.delete(function(req,res){
  Article.findOneAndDelete(
    {title:req.params.title},
    function(err)
    {
      if(!err)
      res.send("Article Delete successfully.");
      else
      res.send(err);
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
