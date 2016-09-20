/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var announcementObj = require('../models/announcements.js');
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
	* @Date:      	24 Aug,2016
	* @Method :   	getAnnouncement
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch annoucement on the basis of id.
_________________________________________________________________________
*/

var getAnnouncement = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    announcementObj.findOne(conditions,fields, function (err, announcementArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get announcement successfully.", data: announcementArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	addAnnoucement
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add annoucement.
_________________________________________________________________________
*/

var addAnnouncement = function (req, res) {
   // var token = getToken(req.headers);
    var announcement = {};
    announcement = req.body.announcementObj || req.body;
    //if (token) {
        announcementObj(announcement).save(function (err, announcementArray) {
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
	* @Method :   	uploadAnnouncementImage
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to upload image for announcements.
_________________________________________________________________________
*/

var uploadAnnouncementImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var file_name="";
        var RecordLocator = "";
        if(files.file.name){
            uploadDir = "public/images/announcement";
            file_name = files.file.name;
            file_name = file_name.split('.');
            ext = file_name[file_name.length-1];
            RecordLocator = file_name[0];
            var name = (new Date()).getTime();
            file_name = 'announcement'+name+'.'+ext;
            fs.renameSync(files.file.path, uploadDir + "/" + file_name);
            res.jsonp(file_name);
        }
    });
};

var deleteImageAnnouncement = function(req, res){
    var uploadDir = "public/images/announcement";
    var image = req.body.image;
    var reqId =  req.body.id;
    delete req.body.id;
    var fields = {
        image : null
    };
    var conditions = {
        _id: reqId
    };
    announcementObj.update(conditions,{$set: fields}, function (err, announcementArray) {
        if(err){
            res.jsonp(err);
        } else{
            if(fs.existsSync(uploadDir+"/"+image)){  
                fs.unlink(uploadDir+"/"+image);
            }
            res.json({status: 200, msg: "Image Deleted successfully!", data: announcementArray});
        }
    });
}

/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	manageAnnouncement
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all announcements.
_________________________________________________________________________
*/

var manageAnnouncement = function (req, res) {
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
       announcementObj.find(conditions,fields)
                .skip(skipValue)
                .limit(limitValue)
                .exec(function (err, announcementArray) {
            if(err){
                res.jsonp(err);
            } else{
                
                res.json({status: 200,msg: "get all announcements successfully.", data: announcementArray});
            }
        });
   // }
};

var countAnnouncement = function (req, res) {
//    var token = getToken(req.headers);
    var fields = {
        
    };
    var conditions = {
        isDeleted: false,
        enable : true
    };
//    if (token) {
        announcementObj.find(conditions,fields).count(function (err, announcementCount) { 
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200,msg: "get all announcements successfully.", data: announcementCount});
            }
        });
//    }
};

/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	updateAnnouncement
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update announcement.
_________________________________________________________________________
*/

var updateAnnouncement = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var announcement = req.body.announcementObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        announcementObj.update(conditions,{$set: announcement}, function (err, announcementArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', data: announcementArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	24 Aug,2016
	* @Method :   	deleteAnnouncement
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete announcement.
_________________________________________________________________________
*/

var deleteAnnouncement = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        announcementObj.update(conditions,{$set: fields}, function (err, announcementArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'announcement deleted successfully.'});
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
exports.getAnnouncement = getAnnouncement;
exports.addAnnouncement = addAnnouncement;
exports.uploadAnnouncementImage = uploadAnnouncementImage;
exports.updateAnnouncement = updateAnnouncement;
exports.deleteAnnouncement = deleteAnnouncement;
exports.manageAnnouncement = manageAnnouncement;
exports.countAnnouncement = countAnnouncement;
exports.deleteImageAnnouncement = deleteImageAnnouncement;







