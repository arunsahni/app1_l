/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var locations = require('../app/controllers/locations.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch locations on the basis of id. */
    router.get('/fetch-locations/:id', locations.getLocation);
    
    /* To add an locations. */
    router.post('/add-locations',locations.addLocation);
    
    /* To get all locations list. */
    router.post('/manage-locations', locations.getLocations);
    
    /* To update an locations. */
    router.post('/update-locations', locations.updateLocation);
    
    /* To delete an locations. */
    router.get('/delete-locations/:id', locations.deleteLocation);
   
    /* To count location. */
    router.get('/count-locations', locations.countLocation);
    
    /* Default route. */
    app.use('/location', router);
};



