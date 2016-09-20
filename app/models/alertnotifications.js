/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');

var alertnotificationsSchema = new mongoose.Schema({
    userId: {
        type:  'ObjectId'
    },
    userType: {
        type: String
    },
    mobileNotifications: {
        type: Boolean,
        'default': false
    },
    announcements: {
        emailFrequency: {type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None', 'All Alerts'], default : 'None'}
        
    },
    myWallet: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['All transactions', 'None'], default : 'None'}
    },
    trainingsBylearnanything: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        }
    },
    newStudentbookings: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None', 'All Alerts'], default : 'None'}
    },
    lessonReminders: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None'], default : 'None'}
    },
    interviewRequests: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None', 'All Alerts'], default : 'None'}
    },
    popularPicks: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None'], default : 'None'}
    },
    calendarNotifications: {
        emailFrequency: {
            type: Boolean,
            'default': false
        },
        smsAlerts: {
            type: Boolean,
            'default': false
        },
        emailValue: {type: String, enum: ['None','1 day before', '2 days before', '3 days before', '2 hrs before'], default : 'None'}
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

var alertnotifications = mongoose.model('alertnotifications', alertnotificationsSchema);

module.exports = alertnotifications;
