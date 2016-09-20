/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var blogfollowersSchema = new mongoose.Schema({
    userId:  {
        type: 'ObjectId',
        required : 'User is required'
    },
    userType : {
        type : String,
        required : 'User type is required'
    },
    blogId: {
        type: 'ObjectId',
        required : 'Blog is required'
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

var blogfollowers = mongoose.model('blogfollowers', blogfollowersSchema);

module.exports = blogfollowers;