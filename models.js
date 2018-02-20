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
    const auth = this.author;
    return `${auth.firstName} ${auth.lastName}`;
});

blogSchema.methods.apiReturn = function(){
    console.log(this);
    return {
        author: this.fullName,
        title: this.title,
        content: this.content
    };
}

const blogPost = mongoose.model('blog', blogSchema, 'blogPosts');

module.exports = {blogPost};
