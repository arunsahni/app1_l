/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var certificatesObj = require('../models/certificates.js');
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
	* @Method :   	getCertificate
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get certificate on the basis of id.
_________________________________________________________________________
*/

var getCertificate = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    certificatesObj.findOne(conditions,fields, function (err, certificate) {
        if(err){
            res.jsonp(err);
        } else{
            res.jsonp({status: 200, msg: "get certificate successfully.", data: certificate});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	addCertificate
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to add certificate.
_________________________________________________________________________
*/

var addCertificate = function (req, res) {
   // var token = getToken(req.headers);
    var certificate = {};
    certificate = req.body;
    //if (token) {
        certificatesObj(certificate).save(function (err, certificate) {
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
	* @Method :   	uploadCertificateImage
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for certificates.
_________________________________________________________________________
*/

var uploadCertificateImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var reqId =  fields.id;
        delete fields.id;
        if(files.file.name){
            uploadDir = "public/images/certificates";
            file_name = files.file.name;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name)
            var docName = file_name;
            var mediaCenterPath = "public/images/certificates/"
            var srcPath = mediaCenterPath + docName;
            if (fs.existsSync(srcPath)) {
               try{
                    var fields = {
                        image : file_name
                    };
                    
                    var conditions = {
                        _id: reqId
                    };
                    certificatesObj.update(conditions,{$set: fields},function(err,data){
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
	* @Method :   	getCertificates
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to get all certificates.
_________________________________________________________________________
*/

var getCertificates = function (req, res) {
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
       certificatesObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, certificatesArray) {
                    if(err){
                        res.jsonp(err);
                    } else{
                        res.jsonp({status: 200, msg: "get all certificates successfully.", data: certificatesArray});
                    }
        });
   // }
};


var countCertificates = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
    };
//    if (token) {
        certificatesObj.find(conditions,fields).count(function (err, certificatesCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "get count.", data: certificatesCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	updateCertificate
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to update certificate.
_________________________________________________________________________
*/

var updateCertificate = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var certificate = req.body.certificate || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        certificatesObj.update(conditions,{$set: certificate}, function (err, certificate) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'updated successfully.', data: certificate});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	29 Aug,2016
	* @Method :   	deleteCertificate
	* Created By: 	arun sahani
	* Modified On:	-
	* @Purpose:   	This function is used to delete certificate.
_________________________________________________________________________
*/

var deleteCertificate = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        certificatesObj.update(conditions,{$set: fields}, function (err, certificate) {
            if(err){
                res.jsonp(err);
            } else{
                res.jsonp({status: 200, msg: 'certificate deleted successfully.'});
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
exports.getCertificate = getCertificate;
exports.addCertificate = addCertificate;
exports.uploadCertificateImage = uploadCertificateImage;
exports.getCertificates = getCertificates;
exports.updateCertificate = updateCertificate;
exports.deleteCertificate = deleteCertificate;
exports.countCertificates = countCertificates;









