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

app.post('/posts', function(req, res){
    //Need to require author in the form of first and last same or
    //split the fullName into first and last names
    const requiredFields = ['author', 'title', 'content'];
    for(let i = 0; i < requiredFields.length; i++){
        if(!(requiredFields[i] in req.body)){
            res.status(400).json({message: `request does not contain ${requiredFields[i]}`});
        }
    }
    blogPost
    .create({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    })
    .then(function(newPost){
        console.log(newPost);
        res.status(201).json(newPost); //send client back created object
    })
    .catch(function(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"})
    })
});

app.put('/posts/:id', function(req, res){
    //check that one of required fields is present
        //if not return 400 status
    //check that params id and body id match
        //if not return 400 status
    // const requiredFields = ['author', 'title', 'content'];
    // for(let i= 0; i < requiredFields.length; i++){
    //     if(!('id' && i in req.body)){
    //         res.status(400).json({message: `request does not contain ${requiredFields[i]}`});
    //     }
    // }
    if(req.params.id !== req.body.id){
        res.status(400).json({message: `${req.params.id} and ${req.body.id} must match`});
    }
    let toUpdate = {};
    const updateableFields = ['author', 'title', 'content'];
    updateableFields.forEach(function(field){
        if(field in req.body){
            toUpdate[field] = req.body[field];
        }
    });
    console.log(toUpdate);

    blogPost
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})//use req.params.id instead of req.body.id
    .then(function(updatedPost){
        res.status(200).json(updatedPost);
    })
    .catch(function(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    });

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
