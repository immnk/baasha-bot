var express = require('express');
var router = express.Router();

module.exports = function() {

	router.get('/', function(req, res) {
		res.send('Theatres Home');
	});



	router.get('/addTheatres', function(req, res, next) {
		var Theatres = require(__base + 'models/theatre');

		/**var movies = Movies({
			id: '100',
  			name: '8 THOTTAKKAL',
  			genre: 'Entertainment',
		  	language: 'Tamil',
		  	location: 'Velachery',
		  	releaseDate: new Date(),
		  	trailerLink: 'https://youtu.be/AH3X-cIa40k',
		  	imgLink: 'https://img.spicinemas.in/resources/images/movies/8-thottakkal/150x207.jpg'
		});*/

		var theatres = Theatres({
			id: '101',
  			name: 'Ampa SkyWalk',
  			location: 'Aminjikarai'
		});
		



		theatres.save(function(err) {
			if (err) next(err);

			console.log('theatres created!');
			res.send('theatres created!');
		});

	});

	// TODO : Add wiki links at the end
	router.get('/getAllTheatres', function(req, res) {
		var Theatres = require(__base + 'models/theatre');

		// get all the movies
		Theatres.find({}, function(err, theatres) {
			if (err) next(err);

			console.log(theatres);
			res.json(theatres);
		});

	});

	router.get('/getTheatresByLoc', function(req, res) {
		var Theatres = require(__base + 'models/theatre');

		console.log("req.location"+req.query.location);
		// get all the movies
		var locationObj = {location : req.query.location};
		Theatres.find(locationObj, function(err, theatres) {
			if (err) next(err);

			console.log(theatres);
			res.json(theatres);
		});

	});

	return router;
}