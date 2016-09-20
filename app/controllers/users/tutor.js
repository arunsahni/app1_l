/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var tutorObj = require('../../models/users/tutor.js');
var notificationsObj = require('../../models/notifications.js');
var alertnotificationsObj = require('../../models/alertnotifications.js');
var constantObj = require('../../../config/constants.js');
var passport = require('../../../config/passport.js');
var cfg = require('../../../config/passport_config.js');
var crypto = require('crypto');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var twilio = require('twilio')(constantObj.twilioCredentials.ACCOUNTSID, constantObj.twilioCredentials.AUTHTOKEN);
var otp = require('otplib/lib/totp');
var smtp = require("nodemailer-smtp-transport");
var easyimg = require('easyimage');
var locationObj = require('../../models/locations.js');
var subjectObj = require('../../models/subjects.js');
var _ = require('lodash');
var bankObj = require('../../models/banks.js');
var institutionObj = require('../../models/institutions.js');
var ObjectId = require('mongoose').Types.ObjectId;

var smtpTransport = nodemailer.createTransport(smtp({
    host : constantObj.gmailSMTPCredentials.host,
    secureConnection : constantObj.gmailSMTPCredentials.secure,
    port: constantObj.gmailSMTPCredentials.port,
    auth : {
        user : constantObj.gmailSMTPCredentials.username,
        pass : constantObj.gmailSMTPCredentials.password
    }
}));
var transporter = nodemailer.createTransport();
/*________________________________________________________________________
	* @Date:      	02 Aug,2016
	* @Method :   	signup
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to register new tutor.
_________________________________________________________________________
*/

var signup = function (req, res) {
    var tutor = {};
    tutor = req.body.tutorObj || req.body;
    var token,userIdd;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');
        tutor.verificationToken = token;
        tutor.verifyEmail = {
            email: req.body.email,
            verificationStatus: false
        };
        var name = _.split(tutor.name,' ',2);
        tutor.firstname = name[0];
        tutor.lastname = name[1];
        var errorMessage = "";
        
        
        tutorObj(tutor).save(function (err, data) {
            if (err) {
                switch (err.name) {
                    case 'ValidationError':
                        for (field in err.errors) {
                            if (err.errors[field].path === 'email') {
                                errorMessage = 'Expected email to be unique!';
                            }
                        }//for
                        break;
                }//switch
                res.jsonp({status: 201, msg: errorMessage});
            } else {
                    userIdd = data._id;
                    var notificationsData = {};
                        notificationsData.userId = data._id;
                        notificationsData.description = 'Created a teaching account. You get 10 points.';
                        notificationsData.points = 10;
                        notificationsData.notificationDate = new Date();
                    
                    notificationsObj(notificationsData).save(function(err,notifications){
                        if(err){
                        } else{
                            //console.log("Notifications saved successfully",notifications);
                        }
                    });
                   
                    var alertNotifications = {};
                        alertNotifications.userId = data._id;
                        alertNotifications.userType = "tutor";
                        alertnotificationsObj(alertNotifications).save(function(err,alertnotifications){
                            if(err){
                            } else{
                                //console.log("alert Notifications saved successfully",alertnotifications);
                            }
                        });
                   
                    var verifyurl = 'verify-email/' + tutor.verificationToken;
                    var mailOptions = {
                            from: constantObj.gmailSMTPCredentials.username,
                            to: req.body.email,
                            subject: 'Learn Anything Registration',
                            html:  'You are receiving this because you have successfully registered.<br><br>' +
                                   'Please click on the following link, or paste this into your browser to complete the verification process:<br><br>' +
                                    '<a href="' + req.headers.referer + '#!/' + verifyurl + '" target="_blank" >' + req.headers.referer + '#!/'+ verifyurl +'</a><br><br>' +
                                    'If you did not request this, please ignore this email.<br><br>'
                        };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);

                    });
                res.jsonp({status: 200,msg: "user registered successfully."});
            }
        });
    });
  
};

/*________________________________________________________________________
	* @Date:      	21 Aug,2016
	* @Method :   	fastSignup
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to register new tutor with few parameters(fast sign-up).
_________________________________________________________________________
*/

var fastSignup = function (req, res) {
    var tutor = {};
    tutor = req.body.tutorObj || req.body;
    var token;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');
        tutor.verificationToken = token;
        tutor.verifyEmail = {
            email: req.body.email,
            verificationStatus: false
        };
        if(!req.body.password){
            crypto.randomBytes(4, function (err, buf) {
                tutor.password = buf.toString('hex');
                save(tutor);
            });
        } else{
           save(tutor);
        }
    });
        function save(tutor){
            tutorObj(tutor).save(function (err, data) {
                if (err) {
                    switch (err.name) {
                        case 'ValidationError':
                            for (field in err.errors) {
                                if (err.errors[field].path === 'email') {
                                    errorMessage = 'Expected email to be unique!';
                                }
                            }//for
                            break;
                    }//switch
                    res.jsonp({status: 201, msg: errorMessage});
                } else {
                        
                        var notificationsData = {};
                        notificationsData.userId = data._id;
                        notificationsData.description = 'Created a teaching account. You get 10 points.';
                        notificationsData.points = 10;
                        notificationsData.notificationDate = new Date();

                        notificationsObj(notificationsData).save(function (err, notifications) {
                            if (err) {
                            } else {
                                //console.log("Notifications saved successfully", notifications);
                            }
                        });
                        var alertNotifications = {};
                        alertNotifications.userId = data._id;
                        alertNotifications.userType = "tutor";
                        alertnotificationsObj(alertNotifications).save(function(err,alertnotifications){
                            if(err){
                            } else{
                                //console.log("alert Notifications saved successfully",alertnotifications);
                            }
                        });
                        
                        var verifyurl = 'verify-email/'+tutor.verificationToken;
                        var mailOptions = {
                            from: constantObj.gmailSMTPCredentials.username,
                            to: req.body.email,
                            subject: 'Learn Anything Registration',
                            html:  'You are receiving this because you have successfully registered.<br><br>' +
                                    'Your password is <b>'+ tutor.password + '</b><br><br>' +
                                    'Please click on the following link, or paste this into your browser to complete the verification process:<br><br>' +
                                    '<a href="' + req.headers.referer + '#!/' + verifyurl + '" target="_blank" >' + req.headers.referer + '#!/'+ verifyurl +'</a><br><br>' +
                                    'If you did not request this, please ignore this email.<br>'
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);

                        });
                    res.jsonp({status: 200,msg: "user registered successfully."});
                }
            });
        }
      
    
  
};

/*________________________________________________________________________
	* @Date:      	20 Aug,2016
	* @Method :   	verifyEmail
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to verify tutor email.
_________________________________________________________________________
*/

var verifyEmail = function (req, res) {
    var outputJSON = "";
    tutorObj.findOne({verificationToken: req.params.token}, function (err, data) {
        if (err) {
            outputJSON = {'status': 'failure', 'messageId': 203, 'message': constantObj.messages.errorRetreivingData};
            res.jsonp(outputJSON);
        } else {
            if (!data) {
                outputJSON = {'status': 'failure', 'messageId': 203, 'message': constantObj.messages.errorVerification};
                res.jsonp(outputJSON);
            } else {
                var verificationStatus = data.verifyEmail.verificationStatus;
                if (verificationStatus === true) { // already verified
                    outputJSON = {'status': 200, 'message': 'Account Already verified.'};
                    res.jsonp(outputJSON);
                } else { // to be verified
                    data.email = data.verifyEmail.email;
                    data.verifyEmail = {
                        email: data.verifyEmail.email,
                        verificationStatus: true
                    };

                    data.save(function (err, data) {
                        if (err) {
                            outputJSON = {'status': 201, 'message': constantObj.messages.errorRetreivingData};
                            res.jsonp(outputJSON);
                        } else {

                            var mailOptions = {
                                from: constantObj.gmailSMTPCredentials.username,
                                to: data.email,
                                subject: 'Account Activation',
                                html: 'Hello,<br><br>' +
                                        'This is a confirmation that your account has been activated.<br><br>' +
                                        'Please click on the following link to login,<br><br>' +
                                        '<a href="' + req.headers.referer + '#!/' + '" target="_blank" >' + req.headers.referer + '#!/' + '</a><br><br>'

                            };

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: ' + info.response);

                            });

                            //res.redirect('/#!/account-activation');
                            outputJSON = {'status': 200, 'message': 'Account Activated successfully'};
                            res.jsonp(outputJSON);
                        }
                    });
                }


            }
        }

    });
};
/*________________________________________________________________________
	* @Date:      	20 Aug,2016
	* @Method :   	uploadProfilePic
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload pic of tutor.
_________________________________________________________________________
*/

var uploadProfilePic = function (req, res) {

    var form = new formidable.IncomingForm();
    var RecordLocator = "";

    form.parse(req, function (err, fields, files) {
        var file_name = "";
        if (files.file.name) {
            uploadDir = __dirname + constantObj.imagePaths.tutor;
            file_name = files.file.name;
            var name = Math.floor(Date.now() / 1000).toString() + '_' + file_name;

            RecordLocator = file_name[0];

            fs.renameSync(files.file.path, uploadDir + "/" + name);

            var docName = name;

            var mediaCenterPath = constantObj.imagePaths.tutor;

            var srcPath = __dirname + mediaCenterPath + docName;
            var dstPath = __dirname + constantObj.imagePaths.tutorResize + docName;
            
            easyimg.thumbnail({
                src: srcPath, dst: dstPath,
                width: 290, height: 290,
                x: 0, y: 0
            }).then(
                    function (image) {
                        var conditions = {};
                        var fileName = {};
                        conditions._id = fields._id;
                        fileName = docName;
                        tutorObj.update(conditions, {$set: {"personalInfo.profileImg": fileName}}, function (err) {
                            if (err) {
                                console.log(err);
                                var response = {status: 201,message: "Something went wrong."};
                                res.jsonp(response);
                            } else {
                                var response = {status: 200,message: "document saved successfully.",data: fileName};
                                res.jsonp(response);
                            }
                        });
                    },
                    function (err) {
                        console.log(err);
                    }
            );
        }
    });
};

/*________________________________________________________________________
	* @Date:      	05 Aug,2016
	* @Method :   	login
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to authenticate user.
_________________________________________________________________________
*/

var login = function (req, res) {
  
    tutorObj.findOne({email: req.body.email}, function (err, data) {
        if (err) {
            outputJSON = {'status': 203, 'message': "Please enter a valid email."};
            res.jsonp(outputJSON);
        } else {
            if (data) {
                
                bcrypt.compare(req.body.password, data.password, function (err, result) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        if(result === true){
                            var token = jwt.encode(data._id, cfg.secret);
                            res.jsonp({'status': 200, token:  token, type:'tutor', data:data });
                        } else{
                             res.jsonp({'status': 201, msg: 'Authentication failed.'});
                        }
                    }
                });
            } else {
                res.jsonp({'status': 201, msg: 'Authentication failed.'});
            }
//        }
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
        tutorObj.findOne({email: req.body.email}, function (err, data) {

            //console.log(err);console.log(data);return false;
            if (err) {
                outputJSON = {'status': 203, 'message': "Please enter a valid email."};
                res.jsonp(outputJSON);
            } else if (!data) {
                outputJSON = {'status': 203, 'message': "Email does not exists."};
                res.jsonp(outputJSON);

            } else {

                if (data) {
                    crypto.randomBytes(4, function (err, buf) {
                        var password = buf.toString('hex');
                        
                        data.resetPasswordToken =  token,
                        data.resetPasswordExpires =  Date.now() + 3600000,
                        data.password = buf.toString('hex');
                            
                        data.save(function (err, data) {
                            if (err) {
                                outputJSON = {'status': 203, 'message': "Please enter a valid email."};
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
                                            'Your password is  ' +    password  + '.\n\n' 
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);

                                });

                                outputJSON = {'status': 200, 'message': "Email sent successfully."}

                            }
                            res.jsonp(outputJSON);
                        });
                    });
                } else {
                    outputJSON = {'status': 200, 'message': "Email sent successfully."}
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
    tutorObj.findOne({resetPasswordToken: req.body.token}, function (err, data) {
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
   
    var errorMessage = "";
    var outputJSON = "";

    if (req.body.password) {
        var id = req.body._id;
        tutorObj.findOne({_id: id}, {password: 1}, function (err, data) {
            console.log("Data: ",data);
            if (!err) {
                bcrypt.compare(req.body.password, data.password, function (err, result) {

                    if (result === false) {
                        outputJSON = {'status': 401, 'message': "Please enter correct old password."};
                        res.jsonp(outputJSON);
                    } else {
                        console.log(result);
                       
//                        var fields = {};
//                        var conditions = {
//                            _id: data._id    
//                        };
//                   
                        console.log("Pwd: ",req.body.newpassword);
//                        return false;
//                        
//                        fields.password = req.body.newpassword;
                        data.password = req.body.newpassword;
                        data.save(function (err, tutorObj) { 
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

                                outputJSON = {'status': 401, 'message': "Error occured while updating password."};
                                console.log(outputJSON);
                                res.jsonp(outputJSON);
                            }//if
                            else {
                                outputJSON = {'status': 200, 'message': "Password updated successfully."};
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
    req.logout();
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
        res.json({"code": "200", "msg": "Success"});
    } else {
        res.json({"code": "404", "msg": "Failed"})
    }
};

/*________________________________________________________________________
	* @Date:      	03 Aug,2016
	* @Method :   	facebookLogin
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to login using facebook.
	* @Param:     	
	* @Return:    	no
_________________________________________________________________________
*/

var facebookLogin = function (req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: constantObj.facebookCredentials.secret,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token
    request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken) {
        
        if (response.statusCode !== 200) {
            return res.status(500).send({message: accessToken.error.message});
        }

        // Step 2. Retrieve profile information about the current user.

        request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {

            if (response.statusCode !== 200) {
                return res.status(500).send({message: profile.error.message});
            }

            //Create new user account or return an existing one
            tutorObj.findOne({facebook: profile.id}, function (err, existingUser) {

                console.log("existing user =", existingUser);

                if (existingUser) {
                    var token = createJWT(existingUser);
                    res.jsonp({token: token, displayName: existingUser.personalInfo.profileName});
                }
                else {
                    //var user = new User();
                    var user = {};
                    
                    user.facebook = profile.id;
                    user.email = profile.email;
                    var profileImg = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                  
                    
//                    user.personalInfo.profileImg = profileImg;
                           
//                    user.personalInfo.profileName = profile.name;
                    tutorObj(user).save(function (err, doc) {
                        if(err){
                        }else{
                            var facebook_tok = createJWT(user);
                            var token = jwt.encode(doc._id, cfg.secret);
                            res.jsonp({tok: facebook_tok, token: token,displayName: profile.name}); 
                        }
                    });
                }
            });
        });
    });
};

/*________________________________________________________________________
	* @Date:      	03 Aug,2016
	* @Method :   	googleLogin
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to login using google.
	* @Param:     	
	* @Return:    	no
_________________________________________________________________________
*/

var googleLogin = function (req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: constantObj.googleCredentials.client_secret_key,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    //Step 1: Exchange authorization code for access token
    request.post(accessTokenUrl, {json: true, form: params}, function (err, response, token) {
        var access_token = token.access_token;
        var headers = {Authorization: 'Bearer ' + access_token};

        //Step2 : Retreive profile information about current user
        request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response, profile) {

            if (profile.error) {
                return res.status(500).send({message: profile.error.message});
            }
            else {
                //Create a new user account or return an existing one.

                tutorObj.findOne({google: profile.sub}, function (err, existingUser) {
                    if (existingUser) {
                        return res.jsonp({token: createJWT(existingUser), displayName: existingUser.personalInfo.profilename});
                    }

                    var googleUser = {};
                    googleUser.google = profile.sub;
                    googleUser.personalInfo.profileimg = profile.picture.replace('sz=50', 'sz=200');
                    googleUser.personalInfo.profilename = profile.name;
                    tutorObj(googleUser).save(function (err) {
                        var token = createJWT(googleUser);
                        res.jsonp({token: token, displayName: profile.name});
                    });
                });
            }
        });
    });
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	getTutorDetail
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to view a tutor info.
_________________________________________________________________________
*/

var getTutorDetail = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.body.id
    };
   
//    if (token) {
        tutorObj.findOne(conditions,fields, function (err, docs) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: "get tutor info successfully.", data: docs});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	11 Aug,2016
	* @Method :   	updateTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update a tutor info.
_________________________________________________________________________
*/

var updateTutor = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.body._id
    };

//    if (token) {
        tutorObj.update(conditions,{$set: req.body}, function (err, tutorObj) { 
            if(err){
                res.jsonp({status: 201, msg: "tutor info updated successfully.", data: err});
            } else{
                res.jsonp({status: 200, msg: "tutor info updated successfully.", data: tutorObj});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	17 Aug,2016
	* @Method :   	uploadDocument
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload document.
_________________________________________________________________________
*/

var uploadDocument = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file_name = "";
        if (files.file.name) {
            uploadDir = __dirname + "/../../../public/images/tutor/academic-docs/";
            file_name = files.file.name;
            file_name = Math.floor(Date.now() / 1000).toString() + '_' + file_name;

            fs.renameSync(files.file.path, uploadDir + "/" + file_name);

            if (files.file.type === "application/pdf" || files.file.type === "application/msword" || files.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || files.file.type === "application/vnd.ms-excel" || files.file.type === "application/vnd.oasis.opendocument.spreadsheet" || files.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.file.type === "application/vnd.ms-powerpoint" || files.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {

                var docName = file_name;
                var mediaCenterPath = "/../../../public/images/tutor/academic-docs/";
                var srcPath = __dirname + mediaCenterPath + docName;

                if (fs.existsSync(srcPath)) {
                    try {
                        var conditions = {}, fileName = {};
                        conditions._id = fields._id;
                        //fileName = Math.floor(Date.now() / 1000).toString() + '_' + file_name;
                        fileName = file_name;
                        academicName = fields.academicName;
                        tutorObj.update(conditions, {$push: {academics: {name: academicName, fileName: fileName}}}, function (err, data) {
                            if (err) {
                                var response = {
                                    status: 501,
                                    message: "Something went wrong."
                                }
                                res.jsonp(response);
                            } else {
                                var response = {
                                    status: 200,
                                    message: "document saved successfully.",
                                    data: fileName,
                                }
                                res.jsonp(response);
                            }
                        })
                    } catch (e) {
                        console.log("=========================ERROR : ", e);
                    }
                }
            }
        }
    });
};

/*________________________________________________________________________
	* @Date:      	17 Aug,2016
	* @Method :   	uploadOtherDoc
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload document other than acedmics.
_________________________________________________________________________
*/

var uploadOtherDoc = function (req, res) {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var file_name="";
      console.log("fields  --",fields)
      console.log("Files  --",files.file)
      if(files.file.name){
      uploadDir = __dirname + "/../../../public/images/tutor/academic-other-docs/";
      file_name = files.file.name;
      file_name = Math.floor(Date.now() / 1000).toString() + '_' + file_name;

      fs.renameSync(files.file.path, uploadDir + "/" + file_name)
     
      if(files.file.type === "application/pdf" || files.file.type === "application/msword" || files.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.file.type === "application/vnd.ms-excel" || files.file.type === "application/vnd.oasis.opendocument.spreadsheet" ||  files.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.file.type === "application/vnd.ms-powerpoint" || files.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      
        var docName = file_name;
        var mediaCenterPath = "/../../../public/images/tutor/academic-other-docs/";
        var srcPath = __dirname + mediaCenterPath + docName;

        if (fs.existsSync(srcPath)) {
          try{
                  var conditions = {},
                  fileName = {};
                  conditions._id = fields._id;
                  fileName = file_name;
                  otherName = fields.otherName;
                  tutorObj.update(conditions,{ $push: { otherAcademics: {name:otherName, fileName: fileName}} },function(err,data){
                    if(err){
                      console.log(err);
                      var response = {
                        status: 501,
                        message: "Something went wrong."
                      }
                      res.jsonp(response);
                    }
                    else{
                       var response = {
                        status: 200,
                        message: "document saved successfully.",
                        data: fileName,
                       }
                        res.jsonp(response);
                    }
                  })
                }
          catch(e){
            console.log("=========================ERROR : ",e);
          }
        }
      }
    }
  });
};

/*________________________________________________________________________
	* @Date:      	17 Aug,2016
	* @Method :   	supportingDocs
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload supporting documents.
_________________________________________________________________________
*/

var supportingDocs = function (req, res) {
    
    var form = new formidable.IncomingForm();
    var RecordLocator = "";

    form.parse(req, function(err, fields, files) {
      var file_name="";
      if(files.file.name){
      uploadDir = __dirname + "/../../../public/images/tutor/supporting-docs/";
      file_name = files.file.name;
      file_name = Math.floor(Date.now() / 1000).toString() + '_' + file_name;

      fs.renameSync(files.file.path, uploadDir + "/" + file_name);
     
      if(files.file.type=="application/pdf" || files.file.type=="application/msword" || files.file.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.file.type=="application/vnd.ms-excel" || files.file.type=="application/vnd.oasis.opendocument.spreadsheet" ||  files.file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.file.type=="application/vnd.ms-powerpoint" || files.file.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      
        var docName = file_name;
        var mediaCenterPath = "/../../../public/images/tutor/supporting-docs/";
        var srcPath = __dirname + mediaCenterPath + docName;

        if (fs.existsSync(srcPath)) {
          try{
                  var conditions = {},
                  fileName = {};
                  conditions._id = fields._id;
                  fileName = file_name;
                  supportName = fields.supportName;
                  tutorObj.update(conditions,{ $push: { supportingDocs: {name:supportName, fileName: fileName}} },function(err,data){
                    if(err){
                      console.log(err);
                      var response = {
                        status: 501,
                        message: "Something went wrong."
                      }
                      res.jsonp(response);
                    }
                    else{
                       var response = {
                        status: 200,
                        message: "document saved successfully.",
                        data: fileName,
                       }
                        res.jsonp(response);
                    }
                  })
                }
          catch(e){
            console.log("=========================ERROR : ",e);
          }
        }
      }
    }
  });
};

/*________________________________________________________________________
	* @Date:      	17 Aug,2016
	* @Method :   	experienceDocs
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload document related to experience.
_________________________________________________________________________
*/

var experienceDocs = function (req, res) {
    
    var form = new formidable.IncomingForm();
    var RecordLocator = "";

    form.parse(req, function(err, fields, files) {
      var file_name="";
      console.log("fields  --",fields)
      console.log("Files  --",files.file)
      if(files.file.name){
      uploadDir = __dirname + "/../../../public/images/tutor/teaching-exp-docs/";
      file_name = files.file.name;
//      file_name = file_name.split('.');
//      ext = file_name[file_name.length-1];
      RecordLocator = file_name[0];

      fs.renameSync(files.file.path, uploadDir + "/" + file_name)
     
      if(files.file.type=="application/pdf" || files.file.type=="application/msword" || files.file.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.file.type=="application/vnd.ms-excel" || files.file.type=="application/vnd.oasis.opendocument.spreadsheet" ||  files.file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.file.type=="application/vnd.ms-powerpoint" || files.file.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      
        var docName = file_name;
        var mediaCenterPath = "/../../../public/images/tutor/teaching-exp-docs/";
        var srcPath = __dirname + mediaCenterPath + docName;

        if (fs.existsSync(srcPath)) {
          try{
                  var conditions = {},
                  fileName = {};
                  conditions._id = fields._id;
                  fileName = file_name;
                  tutorObj.update(conditions,{ $push: { teachingExp: {documents: fileName}} },function(err,data){
                    if(err){
                      console.log(err);
                      var response = {
                        status: 501,
                        message: "Something went wrong."
                      }
                      res.json(response);
                    }
                    else{
                       var response = {
                        status: 200,
                        message: "document saved successfully.",
                        data: fileName,
                       }
                        res.json(response);
                    }
                  })
                }
          catch(e){
            console.log("=========================ERROR : ",e);
          }
        }
      }
    }
  });
};

/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	teachingSubjects
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update a tutor teaching subjects.
_________________________________________________________________________
*/

var teachingSubjects = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        subjectTeaches: req.body.teachingSub || req.body
    };
     
    var conditions = {
        _id: req.body._id
    };
    
//    if (token) {
        tutorObj.update(conditions, {$push: { subjectTeaches: {$each : fields.subjectTeaches} } }, function (err, data) { 
            if(err){
                res.jsonp({status: 201,msg: "There was an error "});
            } else{
                res.jsonp({status: 200,msg: "tutor info updated successfully.",data: data});
            }
        });
//    }
};


/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	availbilitySlots
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update tutor availble slots.
_________________________________________________________________________
*/

var availbilitySlots = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        availableSlots: req.body.availableSlots || req.body
    };
     
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.update(conditions, {$push: { availableSlots: fields.availableSlots} }, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "tutor info updated successfully.",tutor: tutorObj});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	getSubjects
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to find subjects based on type.
_________________________________________________________________________
*/

var getSubjects = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};

//    if (token) {
//        subjectObj.find(conditions,fields, function (err, data) {
//            if(err){
//                res.jsonp({status: 201, msg: err});
//            } else{
//                res.json({status: 200, msg: "get all subjects.", data: data});
//            }
//        });

    subjectObj.aggregate([
        {$unwind: "$level"},
        {$project: {"type": 1, "name": 1, "level": 1, "id": "$level._id", "level":"$level.name"}},
    ]).exec(function (err, data) {
        if (err) {
            res.jsonp({status: 201, msg: err});
        } else {
            res.json({status: 200, msg: "get all subjects.", data: data});
        }
    });

//    }
};

/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	getLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to find location to arrange classes .
_________________________________________________________________________
*/

var getLocation = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};
   
//    if (token) {
        locationObj.find(conditions,fields, function (err, data) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: "get all users.", data: data});
            }
        });
//    }
};


/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	setOtherDetailsofTutor
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update tutor other details.
_________________________________________________________________________
*/

var setOtherDetailsofTutor = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        expInspecialCategory: req.body.expInspecialCategory || req.body,
        specialzation: req.body.specialzation || req.body,
        refundPolicy: req.body.refundPolicy || req.body,
        payoutFrequency: req.body.payoutFrequency || req.body
    };
     
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.update(conditions, {$push: { expInspecialCategory: { $each: [fields.expInspecialCategory]}, specialzation: { $each: [fields.specialzation]} },$set: {refundPolicy: fields.refundPolicy,payoutFrequency: fields.payoutFrequency }}, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "tutor info updated successfully.",tutor: tutorObj});
            }
        });
//    }
};


/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	setbankingDetails
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update tutor banking details.
_________________________________________________________________________
*/

var setbankingDetails = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        bankingDetails: req.body.bankingDetails || req.body,
    };
     
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.update(conditions, {$push: { bankingDetails: fields.bankingDetails}}, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "tutor info updated successfully.",tutor: tutorObj});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	addteachingExp
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add teaching experience details of tutor.
_________________________________________________________________________
*/

var addteachingExp = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        teachingExp: req.body.teachingExp || req.body
    };
     
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.update(conditions, {$push: { teachingExp: fields.teachingExp}}, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "tutor info updated successfully.",tutor: tutorObj});
            }
        });
//    }
};


/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	personalityTraits
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update tutor personality traits details.
_________________________________________________________________________
*/

var personalityTraits = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        personalityTraits: req.body.personalityTraits || req.body
    };
     
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.update(conditions, {$set: {personalityTraits: fields.personalityTraits}}, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "tutor info updated successfully.",tutor: tutorObj});
            }
        });
//    }
};


/*________________________________________________________________________
	* @Date:      	19 Aug,2016
	* @Method :   	verifyMobile
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to verify mobile number of tutor.
_________________________________________________________________________
*/

var verifyMobile = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        personalInfo: {
            mobileNo: req.body.mobileNo || req.body,
            message: req.body.message || req.body
        }
    };
    var conditions = {
        _id: req.body._id
    };
    
    // user secret key 
    var secret = otp.utils.generateSecret();
    // OTP code 
    var code = otp.generate(secret);
   
     var verifyMobile = {
            code: code,
            mobileno : req.body.newmobileno,
            isverify : false
        };
 
    tutorObj.update(conditions, {$set: {verifyMobile: verifyMobile}}, function (err, tutorObj) { 
            if(err){
                res.jsonp(err);
            } else{
                twilio.sendMessage({
                    to: req.body.newmobileno, //'+917409575518', // Any number Twilio can deliver to   
                    from: constantObj.twilioCredentials.TwilioNumber, // A number you bought from Twilio and can use for outbound communication
                    body: 'Please enter the verification code to verify your mobile no '+code // body of the SMS message
                }, function(err, responseData) { //this function is executed when a response is received from Twilio
                    if (!err) {
                        res.jsonp({status: 200, msg: "OTP sent on your mobile"});
                        console.log(responseData.from); // outputs "+14506667788"
                        console.log(responseData.body); // outputs "word to your mother."
                    } else {
                        res.jsonp({status: 201, msg: "Wasn't able to send OTP."});
                    }
                });
            }
        });
};


/*________________________________________________________________________
	* @Date:      	19 Aug,2016
	* @Method :   	verifyMobileStatus
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to compare otp to verify mobile number.
_________________________________________________________________________
*/

var verifyMobileStatus = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        verifyMobile : 1
    };
    var conditions = {
        _id: req.body._id
    };
//    if (token) {
        tutorObj.findOne(conditions,fields, function (err, data) {
            if (err) {
                res.jsonp(err);
            } else {
              
                if (data.verifyMobile.code === req.body.verificationCode) {
                 
                   var verificationStatus = {
                       verifyMobile : {
                            code : data.verifyMobile.code,
                            isverify: true,
                            mobileno : data.verifyMobile.mobileno,
                        }
                    }
                   
                    
                    tutorObj.update(conditions, {$set: {"personalInfo.mobileNo": data.verifyMobile.mobileno,verifyMobile:{}}}, function (err) { 
                        if(err){
                            res.jsonp(err);
                        } else{
                            res.jsonp({status: 200, msg: "Mobile no. verified"});
                        }
                    });
                }else {
                    res.jsonp({status: 201, msg: "Verification code not verified"});
                }
            }
        });
//        }
};

/*________________________________________________________________________
	* @Date:      	19 Aug,2016
	* @Method :   	getTutorBeforeLogin
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get tutor details.
_________________________________________________________________________
*/

var getTutorBeforeLogin = function (req, res) {

    var fields = {
        personalInfo: 1, 
        email:1
    };
    var conditions = {
        _id: req.params.id
    };

    tutorObj.findOne(conditions, fields, function (err, data) {
        if (err) {
            res.jsonp(err);
        } else {
            res.json({status: 200, msg: "get tutor info successfully.", data: data});
        }
    });

};


/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	getNotifications
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get tutor notifications.
_________________________________________________________________________
*/

var getNotifications = function (req, res) {

    var fields = {
    };
    
    var conditions = {
        userId: req.params.id
    };

    notificationsObj.findOne(conditions, fields, function (err, data) {
        if (err) {
            res.jsonp(err);
        } else {
            res.jsonp({status: 200, msg: "get tutor notifications successfully.", data: data});
        }
    });

};

/*________________________________________________________________________
	* @Date:      	28 Aug,2016
	* @Method :   	updatealertNotifications
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update alert notifications of tutor.
_________________________________________________________________________
*/

var updatealertNotifications = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        body: req.body
    };
    
    var conditions = {
        userId: req.body.userId
    };
    
    var data = req.body.modal;
    alertnotificationsObj.update(conditions, {$set: data}, {upsert:true}, function (err) {
        if (err) {
            res.jsonp(err);
        } else {
            res.jsonp({status: 200, msg: "alert notifications info updated successfully."});
        }
    });
                                   
//        }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	getalertNotifications
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get tutor alert notifications settings.
_________________________________________________________________________
*/

var getalertNotifications = function (req, res) {

    var fields = {
        isDeleted : 0,
        createdDate :0,
        _id : 0,
        userId:0,        
    };
    
    var conditions = {
        userId: req.params.userId
    };

    alertnotificationsObj.findOne(conditions, fields, function (err, data) {
        if (err) {
            res.jsonp(err);
        } else {
            res.jsonp({status: 200, msg: "get tutor alert notifications successfully.", data: data});
        }
    });

};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	sendVerificationemail
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to send verification token on tutor email.
_________________________________________________________________________
*/

var sendVerificationemail = function (req, res) {

    if (req.body.newemail != req.body.email) {
        crypto.randomBytes(20, function (err, buf) {
            var fields = {};
            var conditions = {
                _id: req.body._id
            };

            var token = buf.toString('hex');
            fields.verificationToken = token;
            fields.verifyEmail = {
                verificationStatus: false,
                email: req.body.newemail
            };
            

            tutorObj.update(conditions, {$set: fields}, function (err, data) {
                if (err) {
                    res.jsonp(err);
                } else {
                    var verifyurl = 'tutor/verify-email/' + fields.verificationToken;
                    var mailOptions = {
                        from: constantObj.gmailSMTPCredentials.username,
                        to: req.body.newemail,
                        subject: 'Learn Anything Registration',
                        html: 'You are receiving this because you have successfully registered a new email.<br>' +
                              'Please click on the following link, or paste this into your browser to complete the verification process:<br>' +
                              '<a href="http://' + req.headers.host + '/' + verifyurl + '" target="_blank" >http://' + req.headers.host + '/' + verifyurl + '</a><br>' +
                              'If you did not request this, please ignore this email.<br>'
                    };
                    
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);

                    });
                    res.jsonp({status: 200, msg: "Verification email has been sent.", data: data});
                }
            });
        });
    } else {
        res.jsonp({status: 201, msg: "New Email cannot be same as previous email.", data: false});
    }
};

/*________________________________________________________________________
	* @Date:      	09 Sep,2016
	* @Method :   	sendVerificationemail
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to resend verification token on tutor mobile.
_________________________________________________________________________
*/
var resendVerificationCode = function (req, res) {
    var token = getToken(req.headers);
    var fields = {
        verifyMobile : 1
    };
    var conditions = {
        _id: req.body._id
    };

    
//    if (token) {
        tutorObj.findOne(conditions,fields, function (err, data) {
            if (err) {
                res.jsonp(err);
            } else {
              
                if (data.verifyMobile.mobileno === req.body.mobileno) {
                    // user secret key 
                    var secret = otp.utils.generateSecret();
                    // OTP code 
                    var code = otp.generate(secret);
   
                    var verifyMobile = {
                           code: code,
                           mobileno : req.body.mobileno,
                           isverify : false
                       };
 
                        tutorObj.update(conditions, {$set: {verifyMobile: verifyMobile}}, function (err) { 
                                if(err){
                                    res.jsonp(err);
                                } else{
                                    twilio.sendMessage({
                                        to: req.body.mobileno, //'+917409575518', // Any number Twilio can deliver to   
                                        from: constantObj.twilioCredentials.TwilioNumber, // A number you bought from Twilio and can use for outbound communication
                                        body: 'Please enter the verification code to verify your mobile no '+code // body of the SMS message
                                    }, function(err, responseData) { //this function is executed when a response is received from Twilio
                                        if (!err) {
                                            res.jsonp({status: 200, msg: "OTP sent on your mobile"});
                                            console.log(responseData.from); // outputs "+14506667788"
                                            console.log(responseData.body); // outputs "word to your mother."
                                        } else {
                                            res.jsonp({status: 201, msg: "Wasn't able to send OTP."});
                                        }
                                    });
                                }
                            });    
                }else {
                    res.jsonp({status: 201, msg: "Mobile No. was not verified!"});
                }
            }
        });
};

/*________________________________________________________________________
	* @Date:      	18 Aug,2016
	* @Method :   	getLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to find location to arrange classes .
_________________________________________________________________________
*/

var getBanks = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};
   
//    if (token) {
        bankObj.find(conditions,fields, function (err, data) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: "get all banks.", data: data});
            }
        });
//    }
};




var removeDocument = function (req, res) {
var conditions = {_id : new ObjectId(req.body._id)};
tutorObj.update(conditions, {$pull: {academics: {_id: new ObjectId(req.body.academic)}}}, function (err, data) {
                            if (err) {
                                var response = {
                                    status: 201,
                                    message: "Something went wrong."
                                }
                                res.jsonp(response);
                            } else {
                                var response = {
                                    status: 200,
                                    message: "document saved successfully.",
                                    data: data,
                                }
                                res.jsonp(response);
                            }
                        })
};


var removeOtherDocument = function (req, res) {
var conditions = {_id : new ObjectId(req.body._id)};
tutorObj.update(conditions, {$pull: {otherAcademics: {_id: new ObjectId(req.body.otheracademic)}}}, function (err, data) {
                            if (err) {
                                var response = {
                                    status: 201,
                                    message: "Something went wrong."
                                }
                                res.jsonp(response);
                            } else {
                                var response = {
                                    status: 200,
                                    message: "document saved successfully.",
                                    data: data,
                                }
                                res.jsonp(response);
                            }
                        })
};

var removeSupportDocument = function (req, res) {
var conditions = {_id : new ObjectId(req.body._id)};
tutorObj.update(conditions, {$pull: {supportingDocs: {_id: new ObjectId(req.body.supportdoc)}}}, function (err, data) {
                            if (err) {
                                var response = {
                                    status: 201,
                                    message: "Something went wrong."
                                }
                                res.jsonp(response);
                            } else {
                                var response = {
                                    status: 200,
                                    message: "document saved successfully.",
                                    data: data,
                                }
                                res.jsonp(response);
                            }
                        })
};

var getInstitutions = function (req, res) {
    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};
   
//    if (token) {
        institutionObj.find(conditions,fields, function (err, data) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: "get all institutions.", data: data});
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
};

var resize_image = function (srcPath, dstPath, w, h) {
    console.log("source : ", srcPath);
    console.log(" ---- destination : " + dstPath);

    try {
        im.identify(srcPath, function (err, features) {
            if (err) {
                console.log(err);
            } else {
                console.log(features.width + "======================" + features.height);
                if (parseInt(features.height) >= parseInt(h)) {
                    console.log('========================================================================== here1');
                    im.resize({
                        srcPath: srcPath,
                        dstPath: dstPath,
                        height: h
                    });
                }
                else if (parseInt(features.width) >= parseInt(w)) {
                    console.log('========================================================================== here2');
                    im.resize({
                        srcPath: srcPath,
                        dstPath: dstPath,
                        width: w
                    });
                }
                else {
                    console.log('========================================================================== here3');
                    console.log("dstpath: ",dstPath);
                    im.resize({
                        srcPath: srcPath,
                        dstPath: dstPath,
                        width: features.width,
                        height: features.height
                    });
                }
            }
        });
    }
    catch (e) {
        console.log("=========================ERROR : ", e);
    }
};


// auth functions
exports.signup = signup;
exports.fastSignup = fastSignup;
exports.uploadProfilePic = uploadProfilePic;
exports.verifyEmail =verifyEmail;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
exports.logout = logout;
exports.isUserLoggedIn = isUserLoggedIn;
exports.facebookLogin = facebookLogin;
exports.googleLogin = googleLogin;

// tutor functions
exports.getTutorDetail = getTutorDetail;
exports.updateTutor = updateTutor;
exports.uploadDocument = uploadDocument;
exports.uploadOtherDoc = uploadOtherDoc;
exports.supportingDocs = supportingDocs;
exports.experienceDocs = experienceDocs;
exports.teachingSubjects = teachingSubjects;
exports.availbilitySlots = availbilitySlots;
exports.getSubjects = getSubjects;
exports.getLocation = getLocation;
exports.setOtherDetailsofTutor = setOtherDetailsofTutor;
exports.setbankingDetails = setbankingDetails;
exports.addteachingExp = addteachingExp;
exports.personalityTraits = personalityTraits;
exports.verifyMobile = verifyMobile;
exports.verifyMobileStatus = verifyMobileStatus;
exports.getTutorBeforeLogin = getTutorBeforeLogin;
exports.getNotifications = getNotifications;
exports.updatealertNotifications = updatealertNotifications;
exports.getalertNotifications = getalertNotifications;
exports.sendVerificationemail = sendVerificationemail;
exports.resendVerificationCode = resendVerificationCode;
exports.getBanks = getBanks;
exports.removeDocument = removeDocument;
exports.removeOtherDocument = removeOtherDocument;
exports.removeSupportDocument = removeSupportDocument;
exports.getInstitutions = getInstitutions;