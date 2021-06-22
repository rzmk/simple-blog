const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
require('dotenv').config({path:__dirname+"/.env"})
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

postSchema = {
  postTitle: String,
  postContent: String
}

const Post = mongoose.model("Post", postSchema)

const homeStartingContent = "A text-only blog about random things, perhaps about projects."
const aboutContent = "Hi there! This is a simple blog setup made with Node.JS, Heroku, and MongoDB. I'm Mueez Khan and I learned how to develop full stack applications, this blog being my proof of learning."

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

Post.find({}, (err, allPosts) => {
  allPosts.forEach((post) => {
    
    const diffPost = {
      title: post.postTitle,
      content: post.postContent
    };
    
    posts.push(diffPost)

  })
})

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/login", function(req, res){
  res.render("login", {
    password: process.env.PASSWORD
  });
});

app.post("/login", function(req, res){
  const password = process.env.PASSWORD
  if (req.body.passInput === password) {
    res.render("compose")
  }
})

app.post("compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  const newPost = new Post ({
    postTitle: post.title,
    postContent: post.content
  })
  
  newPost.save()
  posts.push(post);

  res.redirect("/");

})

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName)

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title)

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      })
    }
  })

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
})