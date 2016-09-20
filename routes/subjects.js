/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var subject = require('../app/controllers/subjects.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch subject on the basis of id. */
    router.get('/fetch-subject/:id', subject.getSubject);
    
    /* To add an subject. */
    router.post('/add-subject',subject.addSubject);
    
    /* To get all subject list. */
    router.post('/manage-subject', subject.manageSubject);
    
    /* To update an subject. */
    router.post('/update-subject', subject.updateSubject);
    
    /* To delete an subject. */
    router.get('/delete-subject/:id', subject.deleteSubject);
    
    /* To add an subject with image. */
    router.post('/addImage-subject', subject.uploadSubjectImage);
    
    /* To delete an subject image. */
    router.post('/deleteImage-subject', subject.deleteImageSubject);
    
    /* To count subject. */
    router.get('/count-subject', subject.countSubject);
   
    /* Default route. */
    app.use('/subject', router);
};

