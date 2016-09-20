/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var institutions = require('../app/controllers/institutions.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
    
   
    /* To fetch institutions on the basis of id. */
    router.get('/fetch-institutions/:id', institutions.getInstitutions);
    
    /* To add a institutions. */
    router.post('/add-institutions',institutions.addInstitutions);
    
    /* To get all institutions list. */
    router.post('/manage-institutions', institutions.manageInstitutions);
    
    /* To update a institutions. */
    router.post('/update-institutions', institutions.updateInstitutions);
    
    /* To delete a institutions. */
    router.get('/delete-institutions/:id', institutions.deleteInstitutions);
    
    /* To add an institutions with image. */
    router.post('/addImage-institutions', institutions.uploadInstitutionsImage);
    
    /* To delete an institutions image. */
    router.post('/deleteImage-institutions', institutions.deleteImageInstitutions);
    
    /* To count institutions. */
    router.get('/count-institutions', institutions.countInstitutions);
   
    /* Default route. */
    app.use('/institutions', router);
};

