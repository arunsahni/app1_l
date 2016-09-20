/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var announcement = require('../app/controllers/announcements.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch announcement on the basis of id. */
    router.get('/fetch-announcement/:id', announcement.getAnnouncement);
    
    /* To add an announcement. */
    router.post('/add-announcement',announcement.addAnnouncement);
    
    /* To get all announcement list. */
    router.post('/manage-announcement', announcement.manageAnnouncement);
    
    /* To update an announcement. */
    router.post('/update-announcement', announcement.updateAnnouncement);
    
    /* To delete an announcement. */
    router.get('/delete-announcement/:id', announcement.deleteAnnouncement);
    
    /* To add an announcement with image. */
    router.post('/addImage-announcement', announcement.uploadAnnouncementImage);
    
    /* To delete an announcement image. */
    router.post('/deleteImage-announcement', announcement.deleteImageAnnouncement);
    
    /* To count announcement. */
    router.get('/count-announcement', announcement.countAnnouncement);
   
    /* Default route. */
    app.use('/announcement', router);
};

