/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var badges = require('../app/controllers/badges.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch badges on the basis of id. */
    router.get('/fetch-badges/:id', badges.getBadge);
    
    /* To add an badges. */
    router.post('/add-badges',badges.addBadge);
    
    /* To get all badges list. */
    router.post('/manage-badges', badges.getBadges);
    
    /* To update an badges. */
    router.post('/update-badges', badges.updateBadge);
    
    /* To delete an badges. */
    router.get('/delete-badges/:id', badges.deleteBadge);
    
    /* To add an badges with image. */
    router.post('/addImage-badges', badges.uploadBadgeImage);
   
    /* To count badges. */
    router.get('/count-badges', badges.countBadges);
    
    /* Default route. */
    app.use('/badges', router);
};

