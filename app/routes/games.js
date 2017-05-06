var express = require('express');
var router = express.Router();

module.exports = function() {

	router.get('/', function(req, res) {
		res.send('Games Home');
	});

	router.get('/addQuestion', function(req, res, next) {
		var Game = require(__base + 'models/games');

		var games = Game({
			id: '100',
  			ques: 'Who acted in Bahubali?',
  			option: [
  				{'optId':'A','optVal':'Shahrukh'},
  				{'optId':'B','optVal':'Pawan Kalyan'},
  				{'optId':'C','optVal':'Prabhas'},
  				{'optId':'D','optVal':'Rajesh'}
  			],
  			answer: 'C'
		});

		games.save(function(err) {
			if (err) next(err);

			console.log('questions created!');
			res.send('questions created!');
		});

	});

	router.get('/getQuestion', function(req, res) {
		console.log(req.user);
		var Games = require(__base + 'models/games');

		// get all the users
		Games.find({}, function(err, games) {
			if (err) next(err);

			// object of all the users
			console.log(games);
			res.json(games);
		});

	});


	return router;
}