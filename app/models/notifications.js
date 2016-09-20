/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var notificationsSchema = new mongoose.Schema({
    userId: {type: 'ObjectId'},
    description: {type: String},
    points: {type: Number,default:0},
    notificationDate: {type: Date, default: Date.now},
    isDeleted: { 
        type: Boolean, 
        'default': false 
    }
});

var notifications = mongoose.model('notifications', notificationsSchema);

module.exports = notifications;