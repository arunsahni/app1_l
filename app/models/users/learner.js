/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

SALT_WORK_FACTOR = 10;
var learnersSchema = new mongoose.Schema({
    email: {type: String, unique: true , required : 'Please enter the email' },
    password: {type : String},
    personalInfo: {
        "firstName": {type: String},
        "lastName": {type: String},
        "title": {
            type: String,
            enum: ['Mr.', 'Mrs.', 'Miss.', 'Dr.'],
             default:'Mr.'
        },
        "profileName": {type: String},
        "age": {type: Number},
        "gender": {type: String, enum: ['male', 'female']},
        "mobileNo": {type: String},
        "profileImg": {type: String, default: 'user.png' },
        "nickName": {type: String},
        "dob": {type: Date}
    },
    passportNo: {type: String},
    verifyEmail: {
        verificationStatus: {type: Boolean, default :false},
        email: {type:String}    
    },  
    verificationToken: {type: String},
    isEnabled: { 
         type: Boolean, 
        'default': false 
    },
    bankingDetails: [{
            bankName: {type: String},
            branchCode: {type: String},
            accountType: {type: String},
            accountNumber: {type: String}
        }],
    address: {
        address:{type:String},
        city: {type:String},
        state: {type:String},
        zipcode: {type:String},
        country:{type:String},
        location: {type: String},
    },
    qualifications: [{
            schoolName: {type: String},
            duration: {
                start: {type: Date},
                end: {type: Date}
            },
            file: {type: String}
        }],
    hobbies: {type: Array},
    notifications: {type: String},
    facebook: {type: String},
    google: {type: String},
    subDomain: {type: String},
    permissions: {type: Array},
    socialUrls: {
        facebook: {type: String},
        twitter: {type: String},
        google: {type: String}
    },
    studentSchedule: [{
            teacherId: {type: String},
            timePeriod: {
                start: {type: Date},
                end: {type: Date}
            }
        }],
    classesSchedule: [{
            timePeriod: {
                start: {type: Date},
                end: {type: Date}
            },
            teacherId: {type: String}
        }],
    studentWallet: {
        enrichment: {type: Number},
        academic: {type: Number},
        blogContribution: {type: Number},
        deposit: {type: Number},
        total: {type: Number}
    },
    myNotes: [{
            teacherId: {type: 'ObjectId'},
            note: {type: String}
        }],
    isDeleted: { 
        type: Boolean, 
        'default': false 
    },
    accountStatus : {
        type: Boolean, 
        'default': true
    },
    studentStatus: {
        type: String,
        enum: ['Prospective', 'Prospective pending', 'Active','Postponing', 'Cancelled']
    },
    verifyMobile: {
        code: {type: String},
        isverify: {type: Boolean, default: false},
        mobileno: {type:String}    
    },    
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    createdDate:{type:Date, default: Date.now}
});

learnersSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});
learnersSchema.plugin(uniqueValidator);
learnersSchema.plugin(uniqueValidator, {message: "Email already exists"});
var learners = mongoose.model('learners', learnersSchema);

module.exports = learners;