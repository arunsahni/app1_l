/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var subjectsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: 'Please enter type of the subject'
    },
    name: {
        type: String,
        unique: true,
        required: 'Please enter name of the subject'
    },
    image: {
        type: String,
        required: 'Image is required'
    },
    level: [
        {
            name: {type: String, required: 'level is required'}
        }
    ],
    enable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }});

subjectsSchema.virtual('id').get(function () {
  return this._id;
});

var subjects = mongoose.model('subjects', subjectsSchema);
module.exports = subjects;