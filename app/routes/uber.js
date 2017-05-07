var express = require('express');
var app = express.Router();
var uber = require('../modules/uber');
module.exports = function() {

    // Must init with token (str) and location (obj) 
    //	app.get('/bookUber',function(req, res, next) {
    //	uber.bookUber(req,res);
    //	});

    app.get('/bookUber', function(req, res, next) {
        uber.getAuth(req, res);
    });

    return app;

}
