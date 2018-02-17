'use strict';

let mongoose = require('mongoose');


let blogSchema = mongoose.Schema({
    //title
    title: String,
    //content
    content: String,
    //author
    author:{
        firstName: String,
        lastName: String
    }
});
