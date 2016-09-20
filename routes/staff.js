/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var staff = require('../app/controllers/users/staff.js');
    var learner = require('../app/controllers/users/learner.js');
    var tutor = require('../app/controllers/users/tutor.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
    
   
    /* To add a staff. */
    router.post('/add-staff',passport.authenticate('jwt', { session: false}), staff.addStaff);
    
    /* To get all staff list. */
    router.get('/view-all-staff',passport.authenticate('jwt', { session: false}), staff.viewAll);
    
    /* To update a staff. */
    router.post('/update-staff',passport.authenticate('jwt', { session: false}), staff.updateStaff);
    
    /* To delete a staff. */
    router.post('/delete-staff',passport.authenticate('jwt', { session: false}), staff.deleteStaff);
    
    /* To manage a user. */
    router.post('/manage-user',passport.authenticate('jwt', { session: false}), staff.manageUser);
    
    /* To login. */
    router.post('/login', staff.login);
    
    /* To recover password. */
    router.post('/forgot-password', staff.forgotPassword);

    /* To reset password. */
    router.post('/reset-password', staff.resetPassword);

    /* To change password. */
    router.post('/change-password', staff.changePassword);

    /* To end the user session. */
    router.post('/logout', staff.logout);

    /* To check the user session is active. */
    router.get('/is-user-logged-in', staff.isUserLoggedIn);

    /* To check the user is admin. */
    router.post('/admin-login', staff.adminLogin);
    
    /* Learner api's. */
     
    /* To add a learner. */
    router.post('/add-student', learner.signup);

    /* To get listing of all learners. */
    router.post('/view-all-students', staff.viewAllStudents);
    
    /* To view a learner. */
    router.get('/view-student/:learnerId', staff.viewStudent);
    
    /* To update a learner info. */
    router.post('/update-student', learner.updateStudent);
    
    /* To delete a learner. */
    router.post('/delete-student', staff.deleteStudent);
   
    /* To search a learner. */
    router.post('/search-student', staff.searchStudent);
    
    /* To update account status of learner. */
    router.post('/account-status-student', staff.accountStatusStudent);
    
    /* To update status of learner. */
    router.post('/update-status-student', staff.updateStatusStudent);
   
    /* To manage settings of learner. */
    router.post('/manage-settings-student', staff.manageSettingsStudent);
    
    /* To count learners  . */
    router.get('/count-learners', staff.countLearners);
    
    /* Tutor api's. */
    
    /* To add a tutor. */
    router.post('/add-tutor', tutor.signup);

    /* To get listing of all tutors. */
    router.post('/view-all-tutors', staff.viewAllTutors);
    
    /* To view a tutor. */
    router.get('/view-tutor/:tutorId', staff.viewTutor);
    
    /* To update a tutor info. */
    router.post('/update-tutor', tutor.updateTutor);
    
    /* To delete a tutor. */
    router.post('/delete-tutor', staff.deleteTutor);
   
    /* To search a tutor. */
    router.post('/search-tutor', staff.searchTutor);
    
    /* To update account status of tutor. */
    router.post('/account-status-tutor', staff.accountStatusTutor);

    /* To count tutors  . */
    router.get('/count-tutors', staff.countTutors);

    /* To verify tutor. */
    router.post('/verify-tutor', staff.verifyTutor);
    
    /* Default route. */
    app.use('/staff', router);
};

