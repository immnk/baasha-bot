var express = require('express');
var router = express.Router();

module.exports = function() {

	router.get('/', function(req, res) {
		res.send('Event Home');
	});

	router.get('/addOptions', function(req, res, next) {
		var Event = require(__base + 'models/options');

		var option = Event({
			id: '100',
  			name: 'Play',
  			value: 'Play'
		});

		event.save(function(err) {
			if (err) next(err);

			console.log('options created!');
			res.send('options created!');
		});

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

	router.get('/delalloptions', function(req, res) {
		var Options = require(__base + 'models/options');

		// get all the users
		Options.remove({}, function(err, data) {
			if (err) next(err);

			// console.log('all users removed!');
			res.send('all options removed!');
		});

	});

	return router;
}