/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var institutionsSchema = new mongoose.Schema({
    type: {
        type: String,
        required : 'Please enter type of the institution'
    },
    name: {
        type: String,
        unique: true,
        required : 'Please enter name of the institution'
    },
    image: {
        type: String,
        required : 'Image is required'
    },
    enable: {
        type: Boolean, 
        default:true
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

var institutions = mongoose.model('institutions', institutionsSchema);

module.exports = institutions;