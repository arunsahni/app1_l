/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var tutor = require('../app/controllers/users/tutor.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
    
 
    /* To register a tutor. */
    router.post('/sign-up', tutor.signup);
    
    /* To register a tutor. */
    router.post('/fast-sign-up', tutor.fastSignup);
    
    /* To verify tutor email. */
    router.get('/verify-email/:token', tutor.verifyEmail);
    
    /* To upload avatar of a tutor. */
    router.post('/upload-profilepic', tutor.uploadProfilePic);
    
    /* To login. */
    router.post('/login', tutor.login);
    
    /* To recover password. */
    router.post('/forgot-password', tutor.forgotPassword);

    /* To reset password. */
    router.post('/reset-password', tutor.resetPassword);

    /* To change password. */
    router.post('/change-password', tutor.changePassword);

    /* To end the user session. */
    router.post('/logout', tutor.logout);

    /* To check the user session is active. */
    router.get('/is-user-logged-in', tutor.isUserLoggedIn);
  
    /* To login using facebook. */
    router.post('/facebook', tutor.facebookLogin);

    /* To login using google. */
    router.post('/google', tutor.googleLogin);
    
     /* To view tutor. */
    router.post('/view-tutor', tutor.getTutorDetail);
    
    /* To upload acedemic documents. */
    router.post('/upload-document', tutor.uploadDocument);

    /* To upload other documents. */
    router.post('/upload-other-doc', tutor.uploadOtherDoc);
    
    /* To upload other supporting documents. */
    router.post('/supporting-doc', tutor.supportingDocs);
    
    /* To upload documents related to experience. */
    router.post('/experience-docs', tutor.experienceDocs);
    
    /* To add teaching subjects by tutor. */
    router.post('/teaching-subjects', tutor.teachingSubjects);
    
    /* To add availbility slots. */
    router.post('/set-availbility', tutor.availbilitySlots);
    
    /* To search subjects based on type. */
    router.get('/get-subjects', tutor.getSubjects);
    router.get('/get-institutes', tutor.getInstitutions);
    
    /* To search location for subjects. */
    router.get('/get-location', tutor.getLocation);
    
     
    /* To add details of tutor. */
    router.post('/set-details', tutor.setOtherDetailsofTutor);
    
    /* To add banking details of tutor. */
    router.post('/banking-details', tutor.setbankingDetails);
    
    /* To add experience details of tutor. */
    router.post('/teaching-details', tutor.addteachingExp);
    
    /* To add personality traits details of tutor. */
    router.post('/personality-details', tutor.personalityTraits);
    
     /* To verify tutor mobile number. */
    router.post('/verify-mobile', tutor.verifyMobile);
    
     /* To verify tutor mobile number. */
    router.post('/change-mobile', tutor.verifyMobileStatus);
    
     /* To get tutor details before login. */
    router.get('/get-tutor-details/:id', tutor.getTutorBeforeLogin);
    
    /* To get tutor details before login. */
    router.post('/update-tutor-details', tutor.updateTutor);
    
    /* To get notifications of tutor . */
    router.get('/get-notifications/:id', tutor.getNotifications);
       
    /* To update alert notifications settings of tutor . */
    router.post('/update-alertnotifications', tutor.updatealertNotifications);
    
    
    /* To get alert notifications settings of tutor . */
    router.get('/get-alertnotifications/:userId', tutor.getalertNotifications);
    
    /* To send verification email to tutor . */
    router.post('/send-verification-email', tutor.sendVerificationemail);
    /* To resend verification code */
    router.post('/resend-verification-code', tutor.resendVerificationCode);
    /* To search banks. */
    router.get('/get-banks', tutor.getBanks);
    /* */
    router.post('/remove-document', tutor.removeDocument);
    /* To upload other documents. */
    router.post('/remove-other-doc', tutor.removeOtherDocument);
    router.post('/remove-support-doc', tutor.removeSupportDocument);
    
    /* Default route. */
    app.use('/tutor', router);
};

