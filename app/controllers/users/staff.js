/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var crypto = require('crypto');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var staffObj = require('../../models/users/staff.js');
var learnerObj = require('../../models/users/learner.js');
var tutorObj = require('../../models/users/tutor.js');
var constantObj = require('../../../config/constants.js');
var passport = require('../../../config/passport.js');
var cfg = require('../../../config/passport_config.js');
var smtp = require("nodemailer-smtp-transport");


var smtpTransport = nodemailer.createTransport(smtp({
    host: constantObj.gmailSMTPCredentials.host,
    secureConnection: constantObj.gmailSMTPCredentials.secure,
    port: constantObj.gmailSMTPCredentials.port,
    auth: {
        user: constantObj.gmailSMTPCredentials.username,
        pass: constantObj.gmailSMTPCredentials.password
    }
}));

var transporter = nodemailer.createTransport();


/*________________________________________________________________________
	* @Date:      	05 Aug,2016
	* @Method :   	login
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to authenticate user.
_________________________________________________________________________
*/

var login = function (req, res) {
    
    staffObj.findOne({email: req.body.email, password: req.body.password}, function (err, data) {
        if (err) {
            outputJSON = {'status': 203, 'message': "Please enter a valid email."};
            res.jsonp(outputJSON);
        } else {
            if (data) {
                
                var token = jwt.encode(data._id, cfg.secret);
                res.jsonp({'status': 200, token:  token});
            } else {
                res.jsonp({'status': 201, msg: 'Authentication failed.'});
            }
        }
    });
};


/*________________________________________________________________________
	* @Date:      	02 Aug,2016
	* @Method :   	forgot_password
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used when user forgots password.
_________________________________________________________________________
*/

var forgotPassword = function (req, res) {
    var outputJSON = "";
    crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
//console.log(req.body.email);
        staffObj.findOne({email: req.body.email}, function (err, data) {

            //console.log(err);console.log(data);return false;
            if (err) {
                outputJSON = {'status': 'failure', 'messageId': 203, 'message': "Please enter a valid email."};
                res.jsonp(outputJSON);
            } else if (!data) {
                outputJSON = {'status': 'failure', 'messageId': 203, 'message': "Email does not exists."};
                res.jsonp(outputJSON);

            } else {

                if (data) {
                    staffObj.findByIdAndUpdate({_id: data._id},
                    {$set: {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000
                        }
                    }, function (err, data) {

                        if (err) {
                            outputJSON = {'status': 'failure', 'messageId': 203, 'message': "Please enter a valid email."};
                        } else {
                            var transporter = nodemailer.createTransport(
                                    constantObj.gmailSMTPCredentials.type,
                                    {
                                        service: constantObj.gmailSMTPCredentials.service,
                                        auth: {
                                            user: constantObj.gmailSMTPCredentials.username,
                                            pass: constantObj.gmailSMTPCredentials.password
                                        }
                                    });

                            var mailOptions = {
                                from: constantObj.gmailSMTPCredentials.username,
                                to: req.body.email,
                                subject: 'Reset Password',
                                html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                        'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'

                            };

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: ' + info.response);

                            });

                            outputJSON = {'status': 'success', 'messageId': 200, 'message': "Email sent successfully."}

                        }
                        res.jsonp(outputJSON);
                    });
                } else {
                    outputJSON = {'status': 'success', 'messageId': 200, 'message': "Email sent successfully."}
                    res.jsonp(outputJSON);
                }
            }
        });

    });
};

/*________________________________________________________________________
	* @Date:      	02 Aug,2016
	* @Method :   	resetPassword
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to reset the password.
_________________________________________________________________________
*/

var resetPassword = function (req, res) {
    //console.log(req.body);
    staffObj.findOne({resetPasswordToken: req.body.token}, function (err, data) {
        if (err) {
            outputJSON = {'status': 'failure', 'messageId': 203, 'message': "No record found."};
            res.jsonp(outputJSON);
        } else {
            // console.log(data);return false;
            if (!data) {
                outputJSON = {'status': 'failure', 'messageId': 203, 'message': "Reset Password token has been expired"};
                res.jsonp(outputJSON);
            } else {
                data.password = req.body.newPassword;
                data.resetPasswordToken = undefined;
                data.resetPasswordExpires = undefined;

                data.save(function (err, data) {
                    if (err) {
                        outputJSON = {'status': 'failure', 'messageId': 203, 'message': "No record found."};
                        res.jsonp(outputJSON);
                    } else {

                        var transporter = nodemailer.createTransport(
                                constantObj.gmailSMTPCredentials.type,
                                {
                                    service: constantObj.gmailSMTPCredentials.service,
                                    auth: {
                                        user: constantObj.gmailSMTPCredentials.username,
                                        pass: constantObj.gmailSMTPCredentials.password
                                    }
                                });

                        var mailOptions = {
                            from: constantObj.gmailSMTPCredentials.username,
                            to: data.email,
                            subject: 'Reset Password',
                            html: 'Hello,\n\n' +
                                    'This is a confirmation that the password for your account ' + data.email + ' has just been changed.\n'
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);

                        });

                        outputJSON = {'status': 'success', 'messageId': 200, 'message': 'Password has been successfully updated'};
                        res.jsonp(outputJSON);
                    }
                });

            }
        }
    });
}

/*________________________________________________________________________
	* @Date:      	02 Aug,2016
	* @Method :   	changePassword
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update password.
_________________________________________________________________________
*/

var changePassword = function (req, res) {
    console.log(req.body);
    var errorMessage = "";
    var outputJSON = "";

    if (req.body.newPassword != req.body.confirmPassword) {
        outputJSON = {'status': 'failure', 'messageId': 401, 'message': "Confirm Password must match with New Password"};
        res.jsonp(outputJSON);
    } else {

        if (req.body.password) {

            var id = Object(req.body.userId);
            console.log(id);
            staffObj.findOne({_id: id}, {'password': 1}, function (err, data) {
                console.log('inside');
                console.log(data.password);
                if (!err) {

                    bcrypt.compare(req.body.password, data.password, function (err, result) {

                        if (result == false) {
                            outputJSON = {'status': 'failure', 'messageId': 401, 'message': "Please enter correct old password."};
                            res.jsonp(outputJSON);
                        } else {
                            data.password = req.body.newPassword;
                            data.save(function (err, data) {

                                if (err) {
                                    switch (err.name) {
                                        case 'ValidationError':
                                            for (field in err.errors) {
                                                if (errorMessage == "") {
                                                    errorMessage = err.errors[field].message;
                                                }
                                                else {
                                                    errorMessage += "\r\n" + err.errors[field].message;
                                                }
                                            }//for
                                            break;
                                    }//switch

                                    outputJSON = {'status': 'failure', 'messageId': 401, 'message': "Error occured while updating password."};
                                    console.log(outputJSON);
                                    res.jsonp(outputJSON);
                                }//if
                                else {
                                    outputJSON = {'status': 'success', 'messageId': 200, 'message': "Password updated successfully."};
                                    res.jsonp(outputJSON);
                                }


                            });

                        }
                    });

                } else {
                    outputJSON = {'status': 'success', 'messageId': 200, 'message': "Password required."};
                    res.jsonp(outputJSON);
                }
            });
        } else {
            outputJSON = {'status': 'success', 'messageId': 200, 'message': "Password required."};
            res.jsonp(outputJSON);

        }
    }
};

/*________________________________________________________________________
	* @Date:      	03 Aug,2016
	* @Method :   	logout
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to destroy the session of user.
_________________________________________________________________________
*/

var logout = function (req, res) {
    req.session.destroy();
    res.end();
    
};

/*________________________________________________________________________
	* @Date:      	03 Aug,2016
	* @Method :   	isUserLoggedIn
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to check the session is active.
_________________________________________________________________________
*/

var isUserLoggedIn = function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        res.jsonp({"code": "200", "msg": "Success"});
    } else {
        res.jsonp({"code": "404", "msg": "Failed"})
    }
};

/*________________________________________________________________________
	* @Date:      	03 Aug,2016
	* @Method :   	adminLogin
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to check the logged user is admin.
_________________________________________________________________________
*/

var adminLogin = function (req, res) {
    user = req.body;
    console.log("usr: ", user);
    if (user.role == 'admin') {
        res.jsonp({"code": "200", "msg": "login as admin"});
    } else {
        res.jsonp({"code": "404", "msg": "Failed to login as admin"});
    }
};

/*________________________________________________________________________
	* @Date:      	08 Aug,2016
	* @Method :   	addStaff
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add or register new staff.
_________________________________________________________________________
*/

var addStaff = function (req, res) {
    var token = getToken(req.headers);
    var staff = {};
    staff = req.body.staffObj || req.body;
    console.log("user: ", staff);
    if (token) {
        staffObj(staff).save(function (err, data) {
            if (err) {
                res.jsonp(err);
            } else {
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	08 Aug,2016
	* @Method :   	viewAll
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get list of all staff users.
_________________________________________________________________________
*/

var viewAll = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        password: 0
    };
    var conditions = {
        role : 'admin'
    };
   
    if (token) {
        staffObj.find(conditions,fields, function (err, staffArray) {
            if(err){
                res.jsonp(err);
            } else{
              
                res.jsonp({status: 200, msg: "get all users.", staff: staffArray});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	08 Aug,2016
	* @Method :   	updateStaff
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update a user.
_________________________________________________________________________
*/

var updateStaff = function (req, res) {
    var token = getToken(req.headers);
    var staff = req.body.staffObj || req.body;
    
    var fields = {
        
    };
    var conditions = {
        _id: req.body._id
    };
   
    if (token) {
        staffObj.update(conditions,{$set: staff}, function (err, staff) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'updated successfully.', staff: staff});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	08 Aug,2016
	* @Method :   	deleteStaff
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to remove a staff.
_________________________________________________________________________
*/

var deleteStaff = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.body._id 
    };
   
    if (token) {
        staffObj.update(conditions,{$set: fields}, function (err, staff) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({success: 200, msg: 'staff deleted successfully.'});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	08 Aug,2016
	* @Method :   	manageUser
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get list of all staff users.
_________________________________________________________________________
*/

var manageUser = function (req, res) {  
    var token = getToken(req.headers);
    var staff = req.body.staffObj || req.body;
    var fields = {
        
    };
    var conditions = {
       _id: req.body._id
    };
   
    if (token) {
        staffObj.update(conditions,{$set: staff}, function (err, staff) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({success: 200, msg: 'updated successfully.',  staff: staff});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	viewAllStudents
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get list of all students.
_________________________________________________________________________
*/

var viewAllStudents = function (req, res) {
    var token = getToken(req.headers);
    
    var pageNo = parseInt(req.body.pageNo);
    var skipValue = 10 * (pageNo - 1);
    var limitValue = 10;

    var fields = {
        password: 0
    };
    var conditions = {
        isDeleted: false
    };
    var otherParams = {
        $skip: skipValue,
        $limit: limitValue
    };
    var sortBy = req.body.sortBy;
    var sortDir = req.body.sortDir;
    
    console.log("By:",sortBy);
    console.log("Dir:",sortDir);
    var sortVal;
    var sortObj = {};
    if(sortDir === 'desc'){
        sortVal = -1;
       
    } else{
        sortVal = 1;
    }
    
    if(sortBy === 'email'){
        sortObj = {
            email: sortVal
        };
        
    } else{
        sortObj  = {
            "personalInfo.firstName": sortVal
        };
    }
      learnerObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .sort(sortObj)
                .exec(function (err, studentsArray) {
            if(err){
                res.jsonp(err);
            } else{
                
                res.jsonp({status: 200,msg: "get all learners successfully.", data: studentsArray});
            }
        });
};

var countLearners = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false
    };
    console.log(req.body);
//    if (token) {
        learnerObj.find(conditions,fields).count(function (err, learnersCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get all learners successfully.", data: learnersCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	viewStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to view a learner.
_________________________________________________________________________
*/

var viewStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        password: 0
    };
    var conditions = {
        _id: req.params.learnerId
    };
   
//    if (token) {
        learnerObj.findOne(conditions,fields, function (err, student) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get student info successfully.", data: student});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	deleteStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to remove a student.
_________________________________________________________________________
*/

var deleteStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.body._id 
    };
   
//    if (token) {
        learnerObj.update(conditions,{$set: fields}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "deleted student successfully."});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	searchStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to search a student.
_________________________________________________________________________
*/

var searchStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        password: 0
    };
    var conditions = {
    };
   
    if (token) {
        learnerObj.find(conditions,fields, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get info successfully.",learner: docs});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	accountStatusStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to activate or de-activate student account.
_________________________________________________________________________
*/

var accountStatusStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        accountStatus : req.body.accountStatus
    };
    var conditions = {
        _id: req.body._id 
    };
   
//    if (token) {
        learnerObj.update(conditions,{$set: fields}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "account status updated."});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	updateStatusStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update student status.
_________________________________________________________________________
*/

var updateStatusStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
      studentStatus : req.body.studentStatus  
    };
    var conditions = {
        _id: req.body._id 
    };
   
    if (token) {
        learnerObj.update(conditions,{$set: fields}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "updated student successfully."});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	manageSettingsStudent
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to manage settings of student profile.
_________________________________________________________________________
*/

var manageSettingsStudent = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        _id: req.body._id 
    };
   
    if (token) {
        learnerObj.update(conditions,{$set: req.body}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "student status updated."});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	viewAllTutors
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get list of all tutors.
_________________________________________________________________________
*/

var viewAllTutors = function (req, res) {
//    var token = getToken(req.headers);
    var pageNo = parseInt(req.body.pageNo);
    var skipValue = 10 * (pageNo - 1);
    var limitValue = 10;
    var sortBy = req.body.sortBy;
    var sortDir = req.body.sortDir;
    
    console.log("By:",sortBy);
    console.log("Dir:",sortDir);
    var sortVal;
    var sortObj = {};
    
    if(sortDir === 'desc'){
        sortVal = -1;
       
    } else{
        sortVal = 1;
    }
    
    if(sortBy === 'email'){
        sortObj = {
            email: sortVal
        };
        
    } else{
        sortObj  = {
            "personalInfo.firstName": sortVal
        };
    }
    
    var fields = {
        password: 0
    };
    var conditions = {
        isDeleted: false
    };
    var otherParams = {
        $skip: skipValue,
        $limit: limitValue,
    }

//    if (token) {
        tutorObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .sort(sortObj)
                .exec(function (err, tutorsArray) {
            if(err){
                res.jsonp(err);
            } else{
                
                res.jsonp({status: 200,msg: "get all tutors successfully.", data: tutorsArray});
            }
        });
//    }
};

var countTutors = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false
    };
    console.log(req.body);
//    if (token) {
        tutorObj.find(conditions,fields).count(function (err, tutorsCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get all tutors successfully.", data: tutorsCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	viewTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to view a tutor info.
_________________________________________________________________________
*/

var viewTutor = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        password: 0
    };
    var conditions = {
        _id: req.params.tutorId
    };
   console.log("id:",req.params.tutorId);
//    if (token) {
        tutorObj.findOne(conditions,fields, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: "get tutor info successfully.", data: docs});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	deleteTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to remove a tutor.
_________________________________________________________________________
*/

var deleteTutor = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.body._id
    };
 
//    if (token) {
        tutorObj.update(conditions,{$set: fields}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "tutor deleted successfully."});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	searchTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to search a tutor.
_________________________________________________________________________
*/

var searchTutor = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
       password: 0
    };
    var conditions = {
       
    };
   
    if (token) {
        tutorObj.find(conditions,fields, function (err, tutorsArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get tutors info successfully.", tutors: tutorsArray});
            }
        });
    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	accountStatusTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to activate or de-activate tutor account.
_________________________________________________________________________
*/

var accountStatusTutor = function (req, res) {
    
    console.log("req.body",req.body.accountStatus);
    var token = getToken(req.headers);
    var fields = {
        accountStatus : req.body.accountStatus
    };
    var conditions = {
        _id: req.body._id 
    };
   
//    if (token) {
        tutorObj.update(conditions,{$set: fields}, function (err, docs) {
            
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "tutor account info updated successfully."});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	13 Sept,2016
	* @Method :   	verifyTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to verify tutor account via admin.
_________________________________________________________________________
*/

var verifyTutor = function (req, res) {
    
    console.log("req.body",req.body);
    var token = getToken(req.headers);
    var fields = {
        isEnabled : req.body.isEnabled,
        tutorBadges: req.body.tutorBadges
    };
    var conditions = {
        _id: req.body._id
    };
   
//    if (token) {
        tutorObj.update(conditions,{$set: fields}, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                var mailOptions = {
                    from: constantObj.gmailSMTPCredentials.username,
                    to: req.body.email,
                    subject: 'Learn Anything Account Verification',
                    html: 'You are receiving this because you are sucessfully verified by admin and you have access to all features in your account.\n\n' +
                          'If you did not request this, please ignore this email.\n'
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.jsonp({status: 200,msg: "tutor verified successfully."});
            }
        });
//    }
};


// Private functions

var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

var createJWT = function (user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, constantObj.facebookCredentials.token_secret);
}

// auth functions
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
exports.logout = logout;
exports.isUserLoggedIn = isUserLoggedIn;
exports.adminLogin = adminLogin;

// staff functions
exports.addStaff = addStaff;
exports.viewAll = viewAll;
exports.updateStaff = updateStaff;
exports.deleteStaff = deleteStaff;
exports.manageUser = manageUser;

// learner functions
exports.viewAllStudents = viewAllStudents;
exports.viewStudent = viewStudent;
exports.deleteStudent = deleteStudent;
exports.searchStudent = searchStudent;
exports.accountStatusStudent = accountStatusStudent;
exports.updateStatusStudent = updateStatusStudent;
exports.manageSettingsStudent = manageSettingsStudent;
exports.countLearners = countLearners;

// tutor functions
exports.viewAllTutors = viewAllTutors;
exports.viewTutor = viewTutor;
exports.deleteTutor = deleteTutor;
exports.searchTutor = searchTutor;
exports.accountStatusTutor = accountStatusTutor;
exports.countTutors = countTutors;
exports.verifyTutor = verifyTutor;

