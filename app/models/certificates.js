/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var certificatesSchema = new mongoose.Schema({
    credential: {type: String},
    acroynm : {type: String},
    accreditedBy: {type: String},
    image: {type: String, required : 'Image is required'},
    isDeleted: { 
        type: Boolean, 
        'default': false 
    }
});

var certificates = mongoose.model('certificates', certificatesSchema);

module.exports = certificates;