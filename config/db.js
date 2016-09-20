/*
 * @author : arun sahani    
 * @creationDate : 29/07/2016
 * @usage : The file will take care of the database connectivity
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/learnanything');

//check if we are connected successfully or not
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));