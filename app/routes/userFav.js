var express = require('express');
var userFav = require('../modules/userFav');
var app = express.Router();

module.exports = function() {

    app.get('/getUserFav', function(req, res,next) {
    	userFav.getUserFav(req, res);
    });



    return app;
}