var express = require('express');
var request = require('request');
var router = express.Router();

module.exports = function() {

	router.get('/', function(req, res) {
		res.send('Option Home');
	});

	

	router.get('/getOptions', function(req, res) {
		console.log(req.user);
		var Options = require(__base + 'models/options');

		// get all the users
		Options.find({}, function(err, options) {
			if (err) next(err);

			// object of all the users
			console.log(options);
			res.json(options);
		});

	});


	return router;
}