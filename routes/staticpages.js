/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var staticPage = require('../app/controllers/staticpages.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
    
   
    /* To fetch static pages on the basis of slug. */
    router.get('/fetch-staticpage/:slug', staticPage.getPageContent);
    
    /* To add a static pages. */
    router.post('/add-staticpage',staticPage.addPageContent);
    
    /* To get all static pages list. */
    router.get('/manage-staticpage', staticPage.managePageContent);
    
    /* To update a static pages. */
    router.post('/update-staticpage', staticPage.updatePageContent);
    
    /* To delete a static pages. */
    router.get('/delete-staticpage/:id', staticPage.deletePageContent);
    
    /* To add an announcement with image. */
    router.post('/headerImage-staticpage', staticPage.uploadHeaderImage);
    
    /* To add an announcement with image. */
    router.post('/contentImage-staticpage', staticPage.uploadContentImage);
   
    /* Default route. */
    app.use('/staticpage', router);
};

