'use strict';

const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
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

blogSchema.virtual('fullName').get(function(){
    //mongoose will access "fullName property anytime fullName is called"
    return bloSchema.author.firstName + ' ' + blogSchema.author.lastName;
});

blogSchema.methods.apiReturn = function(){
    return {
        title: this.title,
        content: this.content,
        author: this.fullName
    };
}

const blogPost = mongoose.model('blog', blogSchema, 'blogPosts');

module.exports = {blogPost};
