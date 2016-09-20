/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var certificates = require('../app/controllers/certificates.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch certificates on the basis of id. */
    router.get('/fetch-certificates/:id', certificates.getCertificate);
    
    /* To add an certificates. */
    router.post('/add-certificates',certificates.addCertificate);
    
    /* To get all certificates list. */
    router.post('/manage-certificates', certificates.getCertificates);
    
    /* To update an certificates. */
    router.post('/update-certificates', certificates.updateCertificate);
    
    /* To delete an certificates. */
    router.get('/delete-certificates/:id', certificates.deleteCertificate);
    
    /* To add an certificates with image. */
    router.post('/addImage-certificates', certificates.uploadCertificateImage);
   
    /* To count certificates. */
    router.get('/count-certificates', certificates.countCertificates);
    
    /* Default route. */
    app.use('/certificates', router);
};




