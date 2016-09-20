/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var subjectObj = require('../models/subjects.js');
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
	* @Method :   	getSubject
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch subject on the basis of id.
_________________________________________________________________________
*/

var getSubject = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    subjectObj.findOne(conditions,fields, function (err, subjectArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get subject successfully.", data: subjectArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	addSubject
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add subject.
_________________________________________________________________________
*/

var addSubject = function (req, res) {
   // var token = getToken(req.headers);
    var subject = {};
    subject = req.body;
    
    //if (token) {
        subjectObj(subject).save(function (err, subject) {
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
	* @Method :   	uploadSubjectImage
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for subjects.
_________________________________________________________________________
*/

var uploadSubjectImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var RecordLocator = "";
        if(files.file.name){
            uploadDir = "public/images/subjects";
            file_name = files.file.name;
            file_name = file_name.split('.');
            ext = file_name[file_name.length-1];
            RecordLocator = file_name[0];
            var name = (new Date()).getTime();
            file_name = 'subject_'+name+'.'+ext;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name);
            res.jsonp(file_name);
        }
    });
};

var deleteImageSubject = function(req, res){
    var uploadDir = "public/images/subjects";
    var image = req.body.image;
    var reqId =  req.body.id;
    delete req.body.id;
    var fields = {
        image : null
    };
    var conditions = {
        _id: reqId
    };
    subjectObj.update(conditions,{$set: fields}, function (err, subjectArray) {
        if(err){
            res.jsonp(err);
        } else{
            if(fs.existsSync(uploadDir+"/"+image)){  
                fs.unlink(uploadDir+"/"+image);
            }
            res.json({status: 200, msg: "Image Deleted successfully!", data: subjectArray});
        }
    });
}

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	manageSubject
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all subjects.
_________________________________________________________________________
*/

var manageSubject = function (req, res) {
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
        subjectObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, subjectArray) {
            if(err){
                res.jsonp(err);
            } else{
                
                res.json({status: 200,msg: "get all subjects successfully.", data: subjectArray});
            }
        });
   // }
};

var countSubject = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false,
        enable : true
    };
//    if (token) {
        subjectObj.find(conditions,fields).count(function (err, subjectCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "get all subjects successfully.", data: subjectCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	updateSubject
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update subject.
_________________________________________________________________________
*/

var updateSubject = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var subject = req.body.subjectObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        subjectObj.update(conditions,{$set: subject}, function (err, subjectArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', data: subjectArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	25 Aug,2016
	* @Method :   	deleteSubject
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete subject.
_________________________________________________________________________
*/

var deleteSubject = function (req, res) {
    //var token = getToken(req.headers);
    console.log(req.params.id);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        subjectObj.update(conditions,{$set: fields}, function (err, subjectArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'subject deleted successfully.'});
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


// subject functions
exports.getSubject = getSubject;
exports.addSubject = addSubject;
exports.uploadSubjectImage = uploadSubjectImage;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
exports.manageSubject = manageSubject;
exports.countSubject = countSubject;
exports.deleteImageSubject = deleteImageSubject;






