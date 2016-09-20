/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var auth = require('../app/controllers/users/auth.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
  
    /* To login using facebook. */
    router.post('/facebook', auth.facebookLogin);

    /* To login using google. */
    router.post('/google', auth.googleLogin);
    
    /* Default route. */
    app.use('/auth', router);
};

