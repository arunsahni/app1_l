/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var teachingexpert = require('../app/controllers/teachingexperts.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch teachingexpert on the basis of id. */
    router.get('/fetch-teachingexpert/:id', teachingexpert.getTeachingexpert);
    
    /* To add an teachingexpert. */
    router.post('/add-teachingexpert',teachingexpert.addTeachingexpert);
    
    /* To get all teachingexpert list. */
    router.post('/manage-teachingexpert', teachingexpert.manageTeachingexpert);
    
    /* To update an teachingexpert. */
    router.post('/update-teachingexpert', teachingexpert.updateTeachingexpert);
    
    /* To delete an teachingexpert. */
    router.get('/delete-teachingexpert/:id', teachingexpert.deleteTeachingexpert);
   
    /* To count. */
    router.get('/count-teachingexpert', teachingexpert.countExpertise);
    
    /* Default route. */
    app.use('/teachingexpert', router);
};

