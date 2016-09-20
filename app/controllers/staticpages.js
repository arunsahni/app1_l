/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var staticpageObj = require('../models/staticpages.js');
var passport = require('../../config/passport.js');
var cfg = require('../../config/passport_config.js');
var crypto = require('crypto');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var fs = require('fs');
var formidable = require('formidable');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');


/*________________________________________________________________________
	* @Date:      	23 Aug,2016
	* @Method :   	getPageContent
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch static page content on the basis of slug.
_________________________________________________________________________
*/

var getPageContent = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        slug: req.params.slug
    };
//    if (token) {
    staticpageObj.findOne(conditions,fields, function (err, staticArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get content successfully.", staticPage: staticArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	23 Aug,2016
	* @Method :   	addPageContent
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add static page content.
_________________________________________________________________________
*/

var addPageContent = function (req, res) {
   // var token = getToken(req.headers);
    var staticPage = {};
    staticPage = req.body.staticpageObj || req.body;
    //if (token) {
        staticpageObj(staticPage).save(function (err, staticArray) {
            if (err) {
                res.jsonp(err);
            } else {
                res.jsonp({status: 200, message: "saved successfully."});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	uploadHeaderImage
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to upload header images for static pages.
_________________________________________________________________________
*/

var uploadHeaderImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var reqId =  fields.id;
        delete fields.id;
        var total_files = fields.total_files;
        for(var i=1; i<total_files; i++){ 
            var file_name = "";
            if(files['file['+i+']'].name){
                uploadDir = "public/images/staticpage/header";
                file_name = files['file['+i+']'].name;
                fs.renameSync(files['file['+i+']'].path, uploadDir + "/" + file_name)
                var docName = file_name;
                var mediaCenterPath = "public/images/staticpage/header/"
                var srcPath = mediaCenterPath + docName;
                if (fs.existsSync(srcPath)) {
                    try{
                        var fields = {
                            "header.image": {
                                name : file_name,
                                text : fields['text['+i+']']
                            },
                        };
                        console.log(fields);
                        var conditions = {
                            _id: reqId
                        };
                        staticpageObj.update(conditions,{$push: fields},function(err,data){
                            if(err){
                                var response = {
                                  status: 501,
                                  message: "Something went wrong."
                                }
                                //res.json(response);
                            } else{
                                var response = {
                                 status: 200,
                                 message: "image saved successfully.",
                                 data: file_name,
                                }
                                //res.json(response);
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
	* @Date:      	24 Aug,2016
	* @Method :   	uploadContentImage
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to upload content images for static pages.
_________________________________________________________________________
*/

var uploadContentImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var reqId =  fields.id;
        delete fields.id;
        var total_files = fields.total_files;
        for(var i=1; i<total_files; i++){ 
            var file_name = "";
            if(files['file['+i+']'].name){
                uploadDir = "public/images/staticpage/content";
                file_name = files['file['+i+']'].name;
                fs.renameSync(files['file['+i+']'].path, uploadDir + "/" + file_name)
                var docName = file_name;
                var mediaCenterPath = "public/images/staticpage/content/"
                var srcPath = mediaCenterPath + docName;
                if (fs.existsSync(srcPath)) {
                    try{
                        var fields = {
                            "content": {
                                image : file_name,
                                sequence : fields['text['+i+']']
                            }
                        };
                        var conditions = {
                            _id: reqId
                        };
                        staticpageObj.update(conditions,{$push: fields},function(err,data){
                            if(err){
                                var response = {
                                  status: 501,
                                  message: "Something went wrong."
                                }
                                res.json(response);
                            } else{
                                var response = {
                                 status: 200,
                                 message: "image saved successfully.",
                                 data: file_name,
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
	* @Date:      	23 Aug,2016
	* @Method :   	managePageContent
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all static page content.
_________________________________________________________________________
*/

var managePageContent = function (req, res) {
   // var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        isDeleted : false
    };
   // if (token) {
        staticpageObj.find(conditions,fields, function (err, staticArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: "get all content successfully.", staticPage: staticArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	23 Aug,2016
	* @Method :   	updatePageContent
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update static page content.
_________________________________________________________________________
*/

var updatePageContent = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var staticPage = req.body.staticpageObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        staticpageObj.update(conditions,{$set: staticPage}, function (err, staticArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', staticPage: staticArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	23 Aug,2016
	* @Method :   	deletePageContent
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete static page content.
_________________________________________________________________________
*/

var deletePageContent = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        staticpageObj.update(conditions,{$set: fields}, function (err, staticArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({success: 200, msg: 'content deleted successfully.'});
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


// static page functions
exports.getPageContent = getPageContent;
exports.addPageContent = addPageContent;
exports.updatePageContent = updatePageContent;
exports.deletePageContent = deletePageContent;
exports.managePageContent = managePageContent;
exports.uploadHeaderImage = uploadHeaderImage;
exports.uploadContentImage = uploadContentImage;






