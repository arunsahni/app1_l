/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var announcementsSchema = new mongoose.Schema({
    title: {
        type: String , required : 'Please enter title'
    },
    announcementDate: {
        type: Date, 
        default: Date.now,
        required : 'Please enter announcement date'
    },
    startTime: {
        type: String, 
        required : 'Please enter announcement start time'
    },
    endTime: {
        type: String, 
        required : 'Please enter announcement end time'
    },
    image: {
        type: String, 
        required : 'Image is required'
    },
    price: {
        type: String, 
        default:null
    },
    venue: {
        type: String, 
        default:null
    },
    url: {
        type: String, 
        default:null
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

var announcements = mongoose.model('announcements', announcementsSchema);

module.exports = announcements;