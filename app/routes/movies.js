var express = require('express');
var router = express.Router();

module.exports = function() {

	router.get('/', function(req, res) {
		res.send('Movie Home');
	});



	router.get('/addMovies', function(req, res, next) {
		var Movies = require(__base + 'models/movies');

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

		var movies = Movies({
			id: '101',
  			name: 'A DOGS PURPOSE',
  			genre: 'Entertainment',
		  	language: 'English',
		  	location: 'Villivakam',
		  	releaseDate: new Date(),
		  	trailerLink: 'https://youtu.be/1jLOOCADTGs',
		  	imgLink: 'https://img.spicinemas.in/resources/images/movies/a-dogs-purpose/150x207.jpg'
		});
		



		movies.save(function(err) {
			if (err) next(err);

			console.log('movies created!');
			res.send('movies created!');
		});

	});

	// TODO : Add wiki links at the end
	router.get('/getAllMovies', function(req, res) {
		console.log(req.user);
		var Movies = require(__base + 'models/movies');

		// get all the movies
		Movies.find({}, function(err, movies) {
			if (err) next(err);

			console.log(movies);
			res.json(movies);
		});

	});

	router.get('/getMoviesByLocation', function(req, res) {
		var Movies = require(__base + 'models/movies');

		console.log("req.location"+req.query.location);
		// get all the movies
		var locationObj = {location : req.query.location};
		Movies.find(locationObj, function(err, movies) {
			if (err) next(err);

			console.log(movies);
			res.json(movies);
		});

	});

	router.get('/getMoviesByName', function(req, res) {
		console.log(req.user);
		var Movies = require(__base + 'models/movies');


		// get all the movies

		var nameObj = {name : req.query.name}
		Movies.find(nameObj, function(err, movies) {
			if (err) next(err);

			console.log(movies);
			res.json(movies);
		});

	});

	router.get('/getLatestMovies', function(req, res) {
		console.log(req.user);
		var Movies = require(__base + 'models/movies');


		// get all the movies
		Movies.find({})
		     .sort({'releaseDate': 'desc'})
		     .exec(function(err, movies) {
		         if (err) next(err);
					console.log(movies);
					res.json(movies);
		     });
	});

	router.get('/getMovieTrailerById', function(req, res) {
		console.log(req.user);
		var Movies = require(__base + 'models/movies');


		// get all the movies

		var idObj = {id : req.query.id};
		Movies.find(idObj)
		     .exec(function(err, movies) {
		         if (err) next(err);
					console.log(movies);
					res.json(movies);
		     });
	});

	return router;
}