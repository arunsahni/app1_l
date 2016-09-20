/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

SALT_WORK_FACTOR = 10;
var staffSchema = new mongoose.Schema({
    email: {type: String, unique: true , required : 'Please enter the email' },
    password: {type : String, select: false },
    role: {type: String},
    personalInfo: {
        "firstName":  {type: String},
        "lastName": {type: String},
        "title": {
            type: {type: String},
            enum: ['Mr.', 'Mrs.', 'Miss.', 'Dr.'],
//             default:'Mr.'     
        },
        "profileName": {type: String},
        "age": {type: Number},
        "gender": {type: String, enum: ['male', 'female']},
        "mobileNo": {type: Number},
        "profileImg": {type: String, default: 'user.png' },
        "nickName": {type: String},
        "dob": {type: Date}
    },
    passportNo: {type: String},
    address: {
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
    subDomain: {type: String},
    permissions: {type: Array},
    isDeleted: { 
        type: Boolean, 
        'default': false 
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
});

staffSchema.pre('save', function (next) {
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
staffSchema.plugin(uniqueValidator);
var staff = mongoose.model('staff', staffSchema);

module.exports = staff;