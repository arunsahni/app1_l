/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var banksSchema = new mongoose.Schema({
    bank: {type: String},
    image: {type: String, required: 'Image is required'},
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
    }});

banksSchema.virtual('id').get(function () {
    return this._id;
});

var banks = mongoose.model('banks', banksSchema);
module.exports = banks;