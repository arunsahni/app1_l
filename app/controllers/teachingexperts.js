/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var teachingexpertObj = require('../models/teachingexperts.js');
var passport = require('../../config/passport.js');
var cfg = require('../../config/passport_config.js');
var crypto = require('crypto');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');


/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	getTeachingexpert
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch teachingexpert on the basis of id.
_________________________________________________________________________
*/

var getTeachingexpert = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    teachingexpertObj.findOne(conditions,fields, function (err, teachingexpertArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get teachingexpert successfully.", data: teachingexpertArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	addTeachingexpert
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add teachingexpert.
_________________________________________________________________________
*/

var addTeachingexpert = function (req, res) {
   // var token = getToken(req.headers);
    var teachingexpert = {};
    teachingexpert = req.body.teachingexpertObj || req.body;
    //if (token) {
        teachingexpertObj(teachingexpert).save(function (err, teachingexpertArray) {
            if (err) {
                res.jsonp(err);
            } else {
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	manageTeachingexpert
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all teachingexperts.
_________________________________________________________________________
*/

var manageTeachingexpert = function (req, res) {
    var pageNo = parseInt(req.body.pageNo);
    var skipValue = 10 * (pageNo - 1);
    var limitValue = 10;
    var fields = {};
    var conditions = {
        isDeleted: false
    };
    var otherParams = {
        $skip: skipValue,
        $limit: limitValue,
    };
   // if (token) {
       teachingexpertObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, teachingexpertArray) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        res.jsonp({status: 200, msg: "get all teachingexpert successfully.", data: teachingexpertArray});
                    }
        });
   // }
};


var countExpertise = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
    };
    var conditions = {
        isDeleted: false,
        enable : true
    };
//    if (token) {
        teachingexpertObj.find(conditions,fields).count(function (err, expertiseCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get all successfully.", data: expertiseCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	updateTeachingexpert
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update teachingexpert.
_________________________________________________________________________
*/

var updateTeachingexpert = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var teachingexpert = req.body.teachingexpertObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        teachingexpertObj.update(conditions,{$set: teachingexpert}, function (err, teachingexpertArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', data: teachingexpertArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	deleteTeachingexpert
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete teachingexpert.
_________________________________________________________________________
*/

var deleteTeachingexpert = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        teachingexpertObj.update(conditions,{$set: fields}, function (err, teachingexpertArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'teachingexpert deleted successfully.'});
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


// teachingexpert functions
exports.getTeachingexpert = getTeachingexpert;
exports.addTeachingexpert = addTeachingexpert;
exports.updateTeachingexpert = updateTeachingexpert;
exports.deleteTeachingexpert = deleteTeachingexpert;
exports.manageTeachingexpert = manageTeachingexpert;
exports.countExpertise = countExpertise;






