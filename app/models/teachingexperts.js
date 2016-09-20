/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var teachingexpertsSchema = new mongoose.Schema({
    title: {
        type: String,
        required : 'Please enter title'
    },
    description: {
        type: String,
        required : 'Please enter description'
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

var teachingexperts = mongoose.model('teachingexperts', teachingexpertsSchema);

module.exports = teachingexperts;