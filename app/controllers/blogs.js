/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var blogObj = require('../models/blogs.js');
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
	* @Date:      	26 Aug,2016
	* @Method :   	getBlog
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch blog on the basis of id.
_________________________________________________________________________
*/

var getBlog = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        _id: req.params.id
    };
//    if (token) {
    blogObj.findOne(conditions,fields, function (err, blogArray) {
        if(err){
            res.jsonp(err);
        } else{
            res.json({status: 200, msg: "get blog successfully.", blog: blogArray});
        }
    });
//    }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	addBlog
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to add blog.
_________________________________________________________________________
*/

var addBlog = function (req, res) {
   // var token = getToken(req.headers);
    var blog = {};
    blog = req.body.blogObj || req.body;
    //if (token) {
        blogObj(blog).save(function (err, blogArray) {
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
	* @Method :   	manageBlog
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to fetch all blogs.
_________________________________________________________________________
*/

var manageBlog = function (req, res) {
   // var token = getToken(req.headers);
    var fields = {};
    var conditions = {
        isDeleted : false,
        enable : true
    };
   // if (token) {
        blogObj.find(conditions,fields, function (err, blogArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: "get all blog successfully.", blog: blogArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	updateBlog
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to update blog.
_________________________________________________________________________
*/

var updateBlog = function (req, res) {
   // var token = getToken(req.headers);
    
    var reqId =  req.body._id;
    var blog = req.body.blogObj || req.body;
    delete req.body._id;
    var fields = {
    };
    var conditions = {
        _id: reqId
    };
   // if (token) {
        blogObj.update(conditions,{$set: blog}, function (err, blogArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({status: 200, msg: 'updated successfully.', blog: blogArray});
            }
        });
   // }
};

/*________________________________________________________________________
	* @Date:      	26 Aug,2016
	* @Method :   	deleteBlog
	* Created By: 	Devika Vyas
	* Modified On:	-
	* @Purpose:   	This function is used to delete blog.
_________________________________________________________________________
*/

var deleteBlog = function (req, res) {
    //var token = getToken(req.headers);
    var fields = {
        isDeleted : true
    };
    var conditions = {
        _id: req.params.id
    };
    //if (token) {
        blogObj.update(conditions,{$set: fields}, function (err, blogArray) {
            if(err){
                res.jsonp(err);
            } else{
                res.json({success: 200, msg: 'blog deleted successfully.'});
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


// blog functions
exports.getBlog = getBlog;
exports.addBlog = addBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.manageBlog = manageBlog;






