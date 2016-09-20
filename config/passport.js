/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
var learner = require('../app/models/users/learner');
var tutor = require('../app/models/users/tutor');
var config = require('./passport_config'); // get passport config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  opts.exp = '1s';
  passport.use('learnerauth',new JwtStrategy(opts, function(jwt_payload, done) {
    learner.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  
   passport.use('tutorauth',new JwtStrategy(opts, function(jwt_payload, done) {
    tutor.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  
};