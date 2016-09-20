/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var badgesObj = require('../models/badges.js');
var passport = require('../../config/passport.js');
var constantObj = require('../../config/constants.js');
var cfg = require('../../config/passport_config.js');
var crypto = require('crypto');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var fs = require('fs');
var formidable = require('formidable');
var bcrypt = require('bcrypt-nodejs');


/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	getBadge
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get badge on the basis of id.
_________________________________________________________________________
*/

var getBadge = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    badgesObj.findOne(conditions,fields, function (err, badge) {
        if(err){
            res.jsonp(err);
        } else{
            res.jsonp({status: 200, msg: "get badge successfully.", data: badge});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	addBadge
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add badge.
_________________________________________________________________________
*/

var addBadge = function (req, res) {
   // var token = getToken(req.headers);
    var badge = {};
    badge = req.body.badge || req.body;
    //if (token) {
        badgesObj(badge).save(function (err, badge) {
            if (err) {
                res.jsonp(err);
            } else {
                console.log("Save",badge);
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	uploadBadgeImage
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for badges.
_________________________________________________________________________
*/

var uploadBadgeImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var reqId =  fields.id;
        delete fields.id;
        
        if(files.file.name){
            uploadDir = "public/images/badges";
            file_name = files.file.name;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name)
            var docName = file_name;
            var mediaCenterPath = "public/images/badges/"
            var srcPath = mediaCenterPath + docName;
            if (fs.existsSync(srcPath)) {
               try{
                    var fields = {
                        image : file_name
                    };
                    
                    var conditions = {
                        _id: reqId
                    };
                    badgesObj.update(conditions,{$set: fields},function(err,data){
                      if(err){
                        var response = {
                          status: 501,
                          message: "Something went wrong."
                        }
                        res.jsonp(response);
                      }
                      else{
                         var response = {
                          status: 200,
                          message: "image saved successfully.",
                          data: file_name,
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
    });
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	getBadges
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get all badges.
_________________________________________________________________________
*/

var getBadges = function (req, res) {
   // var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        isDeleted : false
    };
   // if (token) {
        badgesObj.find(conditions,fields, function (err, badgesArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: "get all badges successfully.", data: badgesArray});
            }
        });
   // }
};

var countBadges = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false,
        enable : true
    };
//    if (token) {
        badgesObj.find(conditions,fields).count(function (err, locationsCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "get locations count.", data: locationsCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	updateBadge
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update badge.
_________________________________________________________________________
*/

var updateBadge = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var badge = req.body.badge || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        badgesObj.update(conditions,{$set: badge}, function (err, badge) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'updated successfully.', data: badge});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	deleteBadge
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to delete badge.
_________________________________________________________________________
*/

var deleteBadge = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        badgesObj.update(conditions,{$set: fields}, function (err, badge) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'badge deleted successfully.'});
            }
        });
    //}
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


// announcement functions
exports.getBadge = getBadge;
exports.addBadge = addBadge;
exports.uploadBadgeImage = uploadBadgeImage;
exports.getBadges = getBadges;
exports.updateBadge = updateBadge;
exports.deleteBadge = deleteBadge;
exports.countBadges = countBadges;






