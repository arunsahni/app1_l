/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required : 'Please enter title of the blog'
    },
    description: {
        type: String,
        required : 'Please enter description of the blog'
    },
    postedDate: {
        type: Date, 
        default: Date.now,
        required : 'Please enter posted date'
    },
    postedTime: {
        type: String, 
        required : 'Please enter posted time'
    },
    totalLikes : {
        type : Number,
        default : 0
    },
    totalFollowers : {
        type : Number,
        default : 0
    },
    enabled: { 
        type: Boolean, 
        default: true 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    createdDate:{
        type:Date, 
        default: Date.now
    }
});

var blogs = mongoose.model('blogs', blogsSchema);

module.exports = blogs;