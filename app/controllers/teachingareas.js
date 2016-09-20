/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var teachingareaObj = require('../models/teachingareas.js');
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
	* @Method :   	getTeachingarea
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch teachingarea on the basis of id.
_________________________________________________________________________
*/

var getTeachingarea = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    teachingareaObj.findOne(conditions,fields, function (err, teachingareaArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get teachingarea successfully.", data: teachingareaArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	addTeachingarea
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add teachingarea.
_________________________________________________________________________
*/

var addTeachingarea = function (req, res) {
   // var token = getToken(req.headers);
    var teachingarea = {};
    teachingarea = req.body.teachingareaObj || req.body;
    //if (token) {
        teachingareaObj(teachingarea).save(function (err, teachingareaArray) {
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
	* @Method :   	manageTeachingarea
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all teachingareas.
_________________________________________________________________________
*/

var manageTeachingarea = function (req, res) {
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
       teachingareaObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, teachingareaArray) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        res.json({status: 200, msg: "get all teachingarea successfully.", data: teachingareaArray});
                    }
        });
   // }
};

var countTeachingareas = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};
//    if (token) {
        teachingareaObj.find(conditions,fields).count(function (err, teachingareacount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get count.", data: teachingareacount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	updateTeachingarea
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update teachingarea.
_________________________________________________________________________
*/

var updateTeachingarea = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var teachingarea = req.body.teachingareaObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        teachingareaObj.update(conditions,{$set: teachingarea}, function (err, teachingareaArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', data: teachingareaArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	deleteTeachingarea
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete teachingarea.
_________________________________________________________________________
*/

var deleteTeachingarea = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        teachingareaObj.update(conditions,{$set: fields}, function (err, teachingareaArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'teachingarea deleted successfully.'});
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


// teachingarea functions
exports.getTeachingarea = getTeachingarea;
exports.addTeachingarea = addTeachingarea;
exports.updateTeachingarea = updateTeachingarea;
exports.deleteTeachingarea = deleteTeachingarea;
exports.manageTeachingarea = manageTeachingarea;
exports.countTeachingareas = countTeachingareas;






