/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var teachingarea = require('../app/controllers/teachingareas.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch teachingarea on the basis of id. */
    router.get('/fetch-teachingarea/:id', teachingarea.getTeachingarea);
    
    /* To add an teachingarea. */
    router.post('/add-teachingarea',teachingarea.addTeachingarea);
    
    /* To get all teachingarea list. */
    router.post('/manage-teachingarea', teachingarea.manageTeachingarea);
    
    /* To update an teachingarea. */
    router.post('/update-teachingarea', teachingarea.updateTeachingarea);
    
    /* To delete an teachingarea. */
    router.get('/delete-teachingarea/:id', teachingarea.deleteTeachingarea);
   
    /* To count. */
    router.get('/count-teachingarea', teachingarea.countTeachingareas);
    
    /* Default route. */
    app.use('/teachingarea', router);
};

