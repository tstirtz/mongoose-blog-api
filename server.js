'use strict';
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let express = require('express');

let app = express();


app.get('/', function(req, res){
    res.send("Hello World");
});

app.listen()
