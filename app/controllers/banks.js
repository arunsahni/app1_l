/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var banksObj = require('../models/banks.js');
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
	* @Method :   	getBank
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get bank on the basis of id.
_________________________________________________________________________
*/

var getBank = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    banksObj.findOne(conditions,fields, function (err, bank) {
        if(err){
            res.jsonp(err);
        } else{
            res.jsonp({status: 200, msg: "get bank successfully.", data: bank});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	addBank
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add bank.
_________________________________________________________________________
*/

var addBank = function (req, res) {
   // var token = getToken(req.headers);
    var bank = {};
    bank = req.body;
    //if (token) {
        banksObj(bank).save(function (err, bank) {
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
	* @Method :   	uploadBankImage
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for bank.
_________________________________________________________________________
*/

var uploadBankImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var reqId =  fields.id;
        delete fields.id;
        if(files.file.name){
            uploadDir = "public/images/bankicons";
            file_name = files.file.name;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name)
            var docName = file_name;
            var mediaCenterPath = "public/images/bankicons/"
            var srcPath = mediaCenterPath + docName;
            if (fs.existsSync(srcPath)) {
               try{
                    var fields = {
                        image : file_name
                    };
                    
                    var conditions = {
                        _id: reqId
                    };
                    banksObj.update(conditions,{$set: fields},function(err,data){
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
	* @Method :   	getBanks
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get all banks.
_________________________________________________________________________
*/

var getBanks = function (req, res) {
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
       banksObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, bankArray) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        res.jsonp({status: 200, msg: "get all banks successfully.", data: bankArray});
                    }
        });
   // }
};


var countBanks = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {};
    var conditions = {};
//    if (token) {
        banksObj.find(conditions,fields).count(function (err, bankscount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200,msg: "get count.", data: bankscount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	updateBank
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update bank.
_________________________________________________________________________
*/

var updateBank = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var bank = req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        banksObj.update(conditions,{$set: bank}, function (err, bank) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'updated successfully.', data: bank});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	deleteBank
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to delete bank.
_________________________________________________________________________
*/

var deleteBank = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        banksObj.update(conditions,{$set: fields}, function (err, bank) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'bank deleted successfully.'});
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
exports.getBank = getBank;
exports.addBank = addBank;
exports.uploadBankImage = uploadBankImage;
exports.getBanks = getBanks;
exports.updateBank = updateBank;
exports.deleteBank = deleteBank;
exports.countBanks = countBanks;










