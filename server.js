'use strict';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const {BlogPost} = require('./models');
const {DATABASE_URL, PORT} = require('./config');

const app = express();
app.use(bodyParser.json());
mongoose.connect(DATABASE_URL);

mongoose.Promise = global.Promise;

//still trying to get a GET request to send back test data

app.get('/blog-posts', function(req, res){
    BlogPost
    .find()
    .limit(10)
    .then(posts => {
  res.json({
    posts: posts.map(
      (post) => post.apiReturn())
  });
})
    .catch(function(err){
        console.log(err);
        res.status(500).send("Internal server error");
    });

});

app.listen(8000, function(){
    console.log("Listening on port 8000");
});
