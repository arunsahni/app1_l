/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var tutorObj = require('../../models/users/tutor.js');
var learnerObj = require('../../models/users/learner.js');
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
var _ = require('lodash');
var nodemailer = require('nodemailer');
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
    //console.log("req.headers : ", req.headers.referer);
    var split = req.headers.referer.split('/');
    //console.log('split',split);
    //console.log("name: ",split[split.length-1]);
    var collectionName = "";
    var collectionType = "";

    if (split[split.length - 1] === 'tutor') {
        collectionName = tutorObj;
        collectionType = 'tutor';
    } else if (split[split.length - 1] !== 'tutor' || split[split.length - 1] !== 'admin') {
        collectionName = learnerObj;
        collectionType = 'learner';
    }
    

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

            //console.log("collection name --:",collectionName);
            //Create new user account or return an existing one
            collectionName.findOne({facebook: profile.id}, function (err, existingUser) {
                if(err) {
                    
                }
                if (existingUser) {
                    var facebook_tok = createJWT(existingUser);
                    var token = jwt.encode(existingUser._id, cfg.secret);
                    var response = {status: 200, tok: facebook_tok, token: token, type: collectionType, data: existingUser};
                    res.jsonp(response);
                } else {
                    var user = {};
                    var verificationToken;
                    crypto.randomBytes(20, function (err, buf) {
                        verificationToken = buf.toString('hex');
                        user.verificationToken = verificationToken;
                        user.facebook = profile.id;
                        user.email = profile.email;
                        //var profileImg = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

                        user.personalInfo = {
                            firstName: profile.first_name,
                            lastName: profile.last_name
                        };
                        
                        user.verifyEmail = {
                            email: profile.email,
                            verificationStatus: false
                        };

                        collectionName(user).save(function (err, doc) {
                            if (err) {
                            } else {

                                var notificationsData = {};
                                notificationsData.userId = doc._id;
                                if (collectionType === 'learner') {
                                    notificationsData.description = 'Created a learner account! Hooray! Let start learning !';
                                } else if (collectionType === 'tutor') {
                                    notificationsData.description = 'Created a teaching account. You get 10 points.';
                                    notificationsData.points = 10;
                                }

                                notificationsData.notificationDate = new Date();

                                notificationsObj(notificationsData).save(function (err, notifications) {
                                    if (err) {
                                    } else {
                                        //console.log("Notifications saved successfully", notifications);
                                    }
                                });

                                var alertNotifications = {};
                                alertNotifications.userId = doc._id;
                                alertNotifications.userType = collectionType;

                                alertnotificationsObj(alertNotifications).save(function (err, alertnotifications) {
                                    if (err) {
                                    } else {
                                        //console.log("alert Notifications saved successfully", alertnotifications);
                                    }
                                });


                                var verifyurl = 'verify-email/' + doc.verificationToken;

                                var mailOptions = {
                                    from: constantObj.gmailSMTPCredentials.username,
                                    to: doc.email,
                                    subject: 'Learn Anything Registration',
                                    html: 'You are receiving this because you have successfully registered.<br><br>' +
                                            'Please click on the following link, or paste this into your browser to complete the verification process:<br><br>' +
                                            '<a href="' +req.headers.referer + '#!/' + verifyurl + '" target="_blank" >' + req.headers.referer + '#!/' + verifyurl + '</a><br><br>' +
                                            'If you did not request this, please ignore this email.<br><br>'
                                };
                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);

                                });

                                var facebook_tok = createJWT(user);
                                var token = jwt.encode(doc._id, cfg.secret);
                                var response = {status: 200, tok: facebook_tok, token: token, type: collectionName, data: doc};
                                res.jsonp(response);
                            }
                        });
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

// auth functions

exports.facebookLogin = facebookLogin;
exports.googleLogin = googleLogin;





