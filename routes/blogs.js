/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (app, express, passport) {
    var express = require('express');
    var blog = require('../app/controllers/blogs.js');
    require('../config/passport')(passport);
    var router = express.Router();
    var passport = require('passport');
   
    /* To fetch blog on the basis of id. */
    router.get('/fetch-blog/:id', blog.getBlog);
    
    /* To add an blog. */
    router.post('/add-blog',blog.addBlog);
    
    /* To get all blog list. */
    router.get('/manage-blog', blog.manageBlog);
    
    /* To update an blog. */
    router.post('/update-blog', blog.updateBlog);
    
    /* To delete an blog. */
    router.get('/delete-blog/:id', blog.deleteBlog);
   
    /* Default route. */
    app.use('/blog', router);
};

