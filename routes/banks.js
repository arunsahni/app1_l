/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var banks = require('../app/controllers/banks.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch banks on the basis of id. */
    router.get('/fetch-banks/:id', banks.getBank);
    
    /* To add an banks. */
    router.post('/add-banks',banks.addBank);
    
    /* To get all banks list. */
    router.post('/manage-banks', banks.getBanks);
    
    /* To update an banks. */
    router.post('/update-banks', banks.updateBank);
    
    /* To delete an banks. */
    router.get('/delete-banks/:id', banks.deleteBank);
    
    /* To add an banks with image. */
    router.post('/addImage-banks', banks.uploadBankImage);
   
    /* To count banks. */
    router.get('/count-banks', banks.countBanks);
    
    /* Default route. */
    app.use('/banks', router);
};




