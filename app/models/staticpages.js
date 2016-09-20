/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var staticpagesSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        required : 'Please enter title of the page'
    },
    header: {
        scrollable: {type: Boolean, default: true},
        image: [{
            name : {type: String},
            text: {type: String}
        }]
    },
    content: [{
        image: {type:String},
        sequence: {type: Number}
    }],
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    createdDate:{
        type:Date, 
        default: Date.now
    }
});

var staticpages = mongoose.model('staticpages', staticpagesSchema);

module.exports = staticpages;