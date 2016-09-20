/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var learner = require('../app/controllers/users/learner.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To register a learner. */
    router.post('/sign-up', learner.signup);
     
    /* To register a learner with few parameters. */
    router.post('/fast-sign-up', learner.fastSignup);
    
    /* To verify learner email. */
    router.get('/verify-email/:token', learner.verifyEmail);
   
    /* To upload avatar of a learner. */
    router.post('/upload-profilepic', learner.uploadProfilePic);
   
    /* To login. */
    router.post('/login', learner.login);
    
    /* To recover password. */
    router.post('/forgot-password', learner.forgotPassword);

    /* To reset password. */
    router.post('/reset-password', learner.resetPassword);

    /* To change password. */
    router.post('/change-password', learner.changePassword);

    /* To end the user session. */
    router.post('/logout', learner.logout);

    /* To check the user session is active. */
    router.get('/is-user-logged-in', learner.isUserLoggedIn);
    
    /* To login using facebook. */
    router.post('/facebook', learner.facebookLogin);

    /* To login using google. */
    router.post('/google', learner.googleLogin);
    
    /* To update learner info. */
    router.post('/view-student', learner.getLearnerDetail);
    
    
    /* To update learner info. */
    router.post('/update-learner-details', learner.updateStudent);
    
    /* To get tutor details before login. */
    router.get('/get-learner-details', learner.getlearnerBeforeLogin);

    /* To get notifications of tutor . */
    router.get('/get-notifications/:id', learner.getNotifications);
    
     /* To update alert notifications settings of tutor . */
    router.post('/update-alertnotifications', learner.updatealertNotifications);
    
     /* To get alert notifications settings of tutor . */
    router.get('/get-alertnotifications/:userId', learner.getalertNotifications);
    
    /* To send verification email to learner . */
    router.post('/send-verification-email', learner.sendVerificationemail);
    
     /* To verify student mobile number. */
    router.post('/verify-mobile', learner.verifyMobile);
    
     /* To verify student mobile number. OTP */
    router.post('/verify-mobile-status', learner.verifyMobileStatus);    
    
    /* To add banking details of learner. */
    router.post('/banking-details', learner.setbankingDetails);
    /* To search banks. */
    router.get('/get-banks', learner.getBanks);
    /* Default route. */
    app.use('/student', router);
};

