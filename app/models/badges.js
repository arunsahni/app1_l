/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var badgesSchema = new mongoose.Schema({
    name: {type: String},
    image: {type: String},
    texttoDisplay: {type: String},
    isDeleted: { 
        type: Boolean, 
        'default': false 
    }
});

var badges = mongoose.model('badges', badgesSchema);

module.exports = badges;