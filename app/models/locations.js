/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: {type: String},
    region: {type: String},
    colour: {type: String},
    lng: {type: Number, default: 0},
    lat: {type: Number, default: 0},
    isDeleted: {
        type: Boolean,
        'default': false
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

locationSchema.virtual('id').get(function () {
  return this._id;
});

var locations = mongoose.model('locations', locationSchema);
module.exports = locations;