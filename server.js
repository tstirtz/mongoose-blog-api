'use strict';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const {blogPost} = require('./models');
const {DATABASE_URL, PORT} = require('./config');

let app = express();
app.use(bodyParser.json());


mongoose.Promise = global.Promise;

//still trying to get a GET request to send back test data


app.get('/posts', function(req, res){
    blogPost
    .find()
    .then(function(posts){
        res.json(
            posts.map(post => {
                return post.apiReturn();
            })
    );

    })
    .catch(function(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    })
});

app.get('/posts/:id', function(req, res){
    blogPost
    .findById(req.params.id)
    .then(function(posts){  //pass result of findById to promise and send it back to client in res.json
        res.json(posts);
    })
    .catch(function(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    })
});


let server;

function runServer(dataBaseUrl, port=PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(dataBaseUrl, err => {
            if(err){
                return reject(err);
            }
            server = app.listen(port, ()=>{
                console.log(`Your app is listening on port ${port}`)
                resolve()
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer(){
    return mongoose.disconnect().then(() =>{
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err=>{
                if(err){
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if(require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err));
}

// app.listen(8000, function(){
//     console.log("Listening on port 8000");
// });
