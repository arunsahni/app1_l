/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

SALT_WORK_FACTOR = 10;
var tutorsSchema = new mongoose.Schema({
    email: {type: String, unique: true , required : 'Please enter the email' },
    password: {type : String},
    personalInfo: {
        "firstName": {type: String},
        "lastName": {type: String},
        "title":  {
            type: String,
            enum: ['Mr.', 'Mrs.', 'Miss.', 'Dr.'],
            default:'Mr.'    
        } ,
        "profileName": {type: String}, // unique:true
        "age": {type: Number},
        "gender": {type: String, enum: ['male', 'female']},
        "mobileNo": {type: String},
        "profileImg": {type: String, default: 'user.png' },
        "nickName": {type: String},
        "dob": {type: Date}
    },
    verifyEmail: {
        verificationStatus: {type: Boolean, default :false},
        email: {type:String}    
    },  
    passportNo: {type: String},   
    verificationToken: {type: String},
    isEnabled: { 
         type: Boolean, 
        'default': false 
    },
    academics: [{
            name : {type :String},
            fileName: {type: String}
        }],
    otherAcademics: [{
            name : {type :String},
            fileName: {type: String}
        }],
    supportingDocs: [{
            name : {type :String},
            fileName: {type: String}
        }],
    verifyMobile: {
        code: {type: String},
        isverify: {type: Boolean, default: false},
        mobileno: {type:String}    
    },
    skillSet: [{
            document: {type: String}
        }],
    specialzation: {type: Array},
    refundPolicy: {type: String, default: 'flexible'},
    payoutFrequency: {type: String},
    bankingDetails: [{
            bankName: {type: String},
            branchCode: {type: String},
            accountType: {type: String},
            accountNumber: {type: String}
        }],
    teachingExp: [{
            companyName: {type: String},
            position: {type: String},
            subjects: {type: Array},
            timePeriod: {
                start: {type: Date},
                end: {type: Date}
            },
            description: {type: String},
            documents: {type: String}
        }],
    expInspecialCategory: {type: Array},
    personalityTraits: {
        funFact: {type: String},
        hobbies: {type: String},
        favList: {type: String},
        favQuote: {type: String},
    },
    q_a: {type: Array},
    profileType: {
        points: {type: Number}, 
        enum: ["egglet", "owlet", "owl"]
    },
    favClicks: {type: Number, default:0},
    userViews: {type: Number, default:0},
    ratings: {type: Number, default:0},
    description: {type: String},
    price: {type: Number},
    fees: {type: Number},
    teachingLanguage: {type: String},
    address: {
        address:{type:String},
        city: {type:String},
        state: {type:String},
        zipcode: {type:String},
        country:{type:String},
        location: {type: String}
    },
    tutorBadges: [{
            type:'ObjectId',
            ref:'badges'
    }],
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
    subjectTeaches: [{
            type: {type: String},
            name: {type: String},
            level: {type: String},
            rate: {type: String},
            location: {type: String},
            color: {type: String}
        }],
    availableSlots: [{
            subjectName: {type: String},
            labelColor: {type: String},
            duration: {
                start: {type: Date},
                end: {type: Date}
            },
            notes: {type: String}
    }],
    quality: {type: Array},
    studentReview: [{
            studentId: {type: String},
            subjectname: {type: String},
            review: {type: String}
        }],
    blogs: [{
            title: {type: String},
            description: {type: String}
        }],
    profileScore: {type:Number,default:10},
    recentActivity: {type: String},
    facebook: {type: String},
    google: {type: String},
    subDomain: {type: String},
    permissions: {type: Array},
    socialUrls: {
        facebook: {type: String},
        twitter: {type: String},
        google: {type: String}
    },
    interviewSchedule: [{
            date: {type: Date},
            timePeriod: {
                start: {type: Date},
                end: {type: Date}
            },
            studentId: {type: 'ObjectId'}
        }],
    classesSchedule: [{
            timePeriod: {
                start: {type: Date},
                end: {type: Date}
            },
            studentId: {type: 'ObjectId'}
        }],
    tutorWallet: [{
            currentBalance: {type: Number},
            withdrawals: {type: Number}
        }],
    myNotes: [{
            teacherId: {type: 'ObjectId'},
            note: {type: String}
        }],
    cancellationPolicy: {
        type: String
    },
    isDeleted: { 
        type: Boolean, 
        'default': false 
    },
    accountStatus : {
        type: Boolean, 
        'default': true
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    buildstage: {type:String, default:'step1'},
    createdDate:{type:Date, default: Date.now},
    updatedDate:{type:Date, default: Date.now}
});

tutorsSchema.pre('save', function (next) {
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
tutorsSchema.plugin(uniqueValidator);
tutorsSchema.plugin(uniqueValidator, {message: "Email already exists"});
var tutors = mongoose.model('tutors', tutorsSchema);

module.exports = tutors;