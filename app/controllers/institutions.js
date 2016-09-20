/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var institutionsObj = require('../models/institutions.js');
var passport = require('../../config/passport.js');
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
	* @Date:      	25 Aug,2016
	* @Method :   	getInstitutions
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch institutions on the basis of id.
_________________________________________________________________________
*/

var getInstitutions = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    institutionsObj.findOne(conditions,fields, function (err, institutionsArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get institutions successfully.", data: institutionsArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	addInstitutions
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add institutions.
_________________________________________________________________________
*/

var addInstitutions = function (req, res) {
   // var token = getToken(req.headers);
    var institutions = {};
    institutions = req.body.institutionsObj || req.body;
    //if (token) {
        institutionsObj(institutions).save(function (err, institutionsArray) {
            if (err) {
                res.jsonp(err);
            } else {
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	uploadInstitutionsImage
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for institutions.
_________________________________________________________________________
*/

var uploadInstitutionsImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var RecordLocator = "";
        if(files.file.name){
            uploadDir = "public/images/institutions";
            file_name = files.file.name;
            file_name = file_name.split('.');
            ext = file_name[file_name.length-1];
            RecordLocator = file_name[0];
            var name = (new Date()).getTime();
            file_name = 'institution_'+name+'.'+ext;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name);
            res.jsonp(file_name);
        }
    });
};

var deleteImageInstitutions = function(req, res){
    var uploadDir = "public/images/institutions";
    var image = req.body.image;
    var reqId =  req.body.id;
    delete req.body.id;
    var fields = {
        image : null
    };
    var conditions = {
        _id: reqId
    };
    institutionsObj.update(conditions,{$set: fields}, function (err, institutionsArray) {
        if(err){
            res.jsonp(err);
        } else{
            if(fs.existsSync(uploadDir+"/"+image)){  
                fs.unlink(uploadDir+"/"+image);
            }
            res.json({status: 200, msg: "Image Deleted successfully!", data: institutionsArray});
        }
    });
}

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	manageInstitutions
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all institutionss.
_________________________________________________________________________
*/

var manageInstitutions = function (req, res) {
   // var token = getToken(req.headers);
    var pageNo = parseInt(req.body.pageNo);
    var skipValue = 10 * (pageNo - 1);
    var limitValue = 10;
    var fields = {};
    var conditions = {
        isDeleted : false,
        enable : true
    };
    var otherParams = {
        $skip: skipValue,
        $limit: limitValue,
    };
   // if (token) {
        institutionsObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, institutionsArray) {
            if(err){
                res.jsonp(err);
            } else{
                
                res.json({status: 200,msg: "get all institutions successfully.", data: institutionsArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	updateInstitutions
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update institutions.
_________________________________________________________________________
*/

var updateInstitutions = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var institutions = req.body.institutionsObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        institutionsObj.update(conditions,{$set: institutions}, function (err, institutionsArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', data: institutionsArray});
            }
        });
   // }
};

var countInstitutions = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false,
        enable : true
    };
//    if (token) {
        institutionsObj.find(conditions,fields).count(function (err, institutionCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "get all institutions successfully.", data: institutionCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	deleteInstitutions
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete institutions.
_________________________________________________________________________
*/

var deleteInstitutions = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        institutionsObj.update(conditions,{$set: fields}, function (err, institutionsArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({success: 200, msg: 'institutions deleted successfully.'});
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
exports.getInstitutions = getInstitutions;
exports.addInstitutions = addInstitutions;
exports.uploadInstitutionsImage = uploadInstitutionsImage;
exports.updateInstitutions = updateInstitutions;
exports.deleteInstitutions = deleteInstitutions;
exports.manageInstitutions = manageInstitutions;
exports.countInstitutions = countInstitutions;
exports.deleteImageInstitutions = deleteImageInstitutions;






