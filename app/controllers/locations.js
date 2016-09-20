/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var locationsObj = require('../models/locations.js');
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
	* @Method :   	getLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get location on the basis of id.
_________________________________________________________________________
*/

var getLocation = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    locationsObj.findOne(conditions,fields, function (err, location) {
        if(err){
            res.jsonp(err);
        } else{
            res.jsonp({status: 200, msg: "get location info successfully.", data: location});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	addLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add location.
_________________________________________________________________________
*/

var addLocation = function (req, res) {
   // var token = getToken(req.headers);
    var location = {};
    location = req.body.location || req.body;
    //if (token) {
        locationsObj(location).save(function (err, location) {
            if (err) {
                res.jsonp(err);
            } else {
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	getLocations
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get all locations.
_________________________________________________________________________
*/

var getLocations = function (req, res) {
     var pageNo = parseInt(req.body.pageNo);
    var skipValue = 10 * (pageNo - 1);
    var limitValue = 10;
    var fields = {};
    var conditions = {};
    var otherParams = {
        $skip: skipValue,
        $limit: limitValue,
    };
   // if (token) {
       locationsObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, locationsArray) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        res.jsonp({status: 200, msg: "get all locations successfully.", data: locationsArray});
                    }
        });
   // }
};

var countLocation = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
       
    };
//    if (token) {
        locationsObj.find(conditions,fields).count(function (err, locationsCount) { 
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
	* @Method :   	updateLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update location.
_________________________________________________________________________
*/

var updateLocation = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var location = req.body.location || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        locationsObj.update(conditions,{$set: location}, function (err, location) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'updated successfully.', data: location});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	deleteLocation
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to delete location.
_________________________________________________________________________
*/

var deleteLocation = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        locationsObj.update(conditions,{$set: fields}, function (err, location) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'location deleted successfully.'});
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


//  functions
exports.getLocation = getLocation;
exports.addLocation = addLocation;
exports.getLocations = getLocations;
exports.updateLocation = updateLocation;
exports.deleteLocation = deleteLocation;
exports.countLocation = countLocation;





