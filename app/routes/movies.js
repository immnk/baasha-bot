var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


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

        /**var movies = Movies({
			id: '101',
  			name: 'A DOGS PURPOSE',
  			genre: 'Entertainment',
		  	language: 'English',
		  	location: 'Villivakam',
		  	releaseDate: new Date(),
		  	trailerLink: 'https://youtu.be/1jLOOCADTGs',
		  	imgLink: 'https://img.spicinemas.in/resources/images/movies/a-dogs-purpose/150x207.jpg'
		});**/

        var Theatreshowmovie = require(__base + 'models/theatreshowmovie');
        var theatreshowmovie = Theatreshowmovie({
            theatre_id: "590cd9c873ce64ad8a685cbe",
            movie_name: "Kavan",
            timing: "3 pm to 7 pm"

        });




        theatreshowmovie.save(function(err) {
            if (err) next(err);

            console.log('theatreshowmovie created!');
            res.send('theatreshowmovie created!');
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

    // TODO : Add wiki links at the end
    router.get('/getAllMoviesArray', function(req, res) {
        console.log(req.user);
        var Movies = require(__base + 'models/movies');

        // get all the movies
        Movies.find({}, function(err, movies) {
            if (err) next(err);

            console.log(movies);
            var moviesArray = [];
            for (var a = 0; a < movies.length; a++) {
                console.log(movies[a].Title);
                var obj = { "name": movies[a].Title };
                moviesArray.push(obj);
            }
            res.json({ "current": moviesArray });
        });

    });


    router.get('/getMoviesByLocation', function(req, res) {
        var Movies = require(__base + 'models/movies');

        console.log("req.location" + req.query.location);
        // get all the movies
        var locationObj = { location: req.query.location };
        Movies.find(locationObj, function(err, movies) {
            if (err) next(err);

            console.log(movies);
            res.json(movies);
        });

    });

    router.get('/getMovieByTitle', function(req, res) {
        var Movies = require(__base + 'models/movies');

        console.log("req.Title - " + req.query.title);
        // get all the movies
        var titleObj = { Title: req.query.title };
        Movies.find(titleObj, function(err, movies) {
            if (err) next(err);

            console.log(movies);
            res.json(movies);
        });

    });


    // Booking ticket flow - 3 rd
    router.post('/bookTicket', function(req, res) {
        var Booking = require(__base + 'models/booking');



        var bookingReq = Booking({
            user_id: req.body.user_id,
            shows_id: req.body.shows_id,
            seats: req.body.seats,
            time: req.body.time
        });

        var Shows = require(__base + 'models/shows');
        Shows.find({ "_id": req.body.shows_id }, function(err, shows) {
            if (err) {
                //next(err);
                console.error(err);
                return;
            }
            if (shows.length > 0) {
                res.time = shows[0].time;
            }
        });

        bookingReq.save(function(err) {
            if (err) next(err);

            var finalResponse = req.body;
            finalResponse = res.time;
            res.send(finalResponse);
        });
    });



    // 2nd flow said by Mani - 1st
    router.get('/getMoviesLocationsByTitle', function(req, res) {
        var Movies = require(__base + 'models/movies');
        var Shows = require(__base + 'models/shows');
        var Screens = require(__base + 'models/screens');
        var Theatre = require(__base + 'models/theatre');
        // get all the movies

        var nameObj = { Title: req.query.title };

        res.finalResponseArray = [];
        Movies.find(nameObj, function(err, movies) {
            if (err) next(err);
            if (movies.length > 0) {
                var finalReqObj = [];
                for (var j = 0; j < movies[0].Theatre_Arr.length; j++) {
                    finalReqObj.push(mongoose.Types.ObjectId(movies[0].Theatre_Arr[j]));
                }
                var finalResp = {};

                Theatre.find({ '_id': { $in: finalReqObj } }, function(err, theatre) {
                    for (var k = 0; k < theatre.length; k++) {
                        console.log('sap1' + theatre[k]);
                        if (!finalResp[theatre[k].location]) {
                            finalResp[theatre[k].location] = [];
                        }
                        finalResp[theatre[k].location].push(theatre[k]);
                    }
                    console.log('sap2' + finalResp);
                    finalResp.title = req.query.title;
                    finalResp.imgURL = req.query.imgURL;
                    res.json(finalResp);

                });
            } else {
                res.json([]);

            }
        });

    });



    // Pass movie title and URL -2nd
    router.get('/getShowsByMovieTheatre', function(req, res) {
        var Movies = require(__base + 'models/movies');


        var Shows = require(__base + 'models/shows');
        var Screens = require(__base + 'models/screens');
        var Theatreshowmovie = require(__base + 'models/theatreshowmovie');
        // get all the movies

        var reqObj = { "movie_name": req.query.title, "theatre_id": req.query.theatre_id };

        res.finalResponseArray = [];
        Theatreshowmovie.find(reqObj, function(err, showmovie) {
            if (err) next(err);
            console.log("showmovie" + showmovie);


            showmovie.title = req.query.title;
            showmovie.imgURL = req.query.imgURL;
            res.json(showmovie);


        });

    });

    // 2nd flow said by Mani
    router.get('/getMoviesByTitle', function(req, res) {
        var Movies = require(__base + 'models/movies');
        var Shows = require(__base + 'models/shows');
        var Screens = require(__base + 'models/screens');
        var Theatre = require(__base + 'models/theatre');
        // get all the movies

        var nameObj = { Title: req.query.title };

        res.finalResponseArray = [];
        Movies.find(nameObj, function(err, movies) {
            if (err) next(err);
            if (movies.length > 0) {
                console.log("Found!!" + movies[0]._id);
                var movie_id = { movie_id: movies[0]._id };
                res.Poster = movies[0].Poster;
                Shows.find(movie_id, function(err, shows) {
                    if (err) return next(err);

                    console.log(shows);
                    if (shows.length > 0) {
                        for (var i = 0; i < shows.length; i++) {
                            res.time = shows[i].time;
                            Screens.find({ "_id": shows[i].screen_id }, function(err, screens) {
                                if (err) next(err);
                                //theatre_id
                                Theatre.find({ "_id": screens[0].theatre_id }, function(err, theatre) {
                                    if (err) next(err);

                                    console.log("showsSap" + res.Poster);
                                    if (theatre.length > 0) {
                                        //Constructing final response
                                        var finalResponse = {
                                            "theatre_name": theatre[0].name,
                                            "location": theatre[0].location,
                                            "time": res.time,
                                            "screen_name": screens[0].name,
                                            "Poster": res.Poster
                                        }
                                        console.log("res.finalResponseArray2" + res.finalResponseArray);
                                        res.finalResponseArray.push(finalResponse);
                                        if (res.finalResponseArray.length > 0)
                                            res.json(res.finalResponseArray);
                                        else
                                            res.json([]);

                                        console.log("res.finalResponseArray1" + res.finalResponseArray);
                                    } else
                                        res.json([]);
                                });
                                console.log("Sap" + screens);
                                //res.json(screens);
                            });
                        }


                    } else {
                        res.json([]);
                    }
                    //res.json(shows);
                });
            } else {
                res.json([]);

            }
        });

    });

    router.get('/getLatestMovies', function(req, res) {
        console.log(req.user);
        var Movies = require(__base + 'models/movies');


        // get all the movies
        Movies.find({})
            .sort({ 'releaseDate': 'desc' })
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

        var idObj = { id: req.query.id };
        Movies.find(idObj)
            .exec(function(err, movies) {
                if (err) next(err);
                console.log(movies);
                res.json(movies);
            });
    });

    router.get('/getMoviesReviews', function(req, res) {

        var twitter = require('twitter');
        var sentiment = require('sentiment');

        var config = {
            consumer_key: 'QhwLrrMAeUmudMcYZqfCK7nLX',
            consumer_secret: 'WwME6kf1LYdlziTmH5XzqLvt7jCSH96yb5JjObB2DGq6zDgVYH',
            access_token_key: '2722051105-U7C5WLfWGFaqZK7lHnWUg1KgGfPJvJzAKE1uH9r',
            access_token_secret: '2DY0ZDp4bfns5HWKbylF6snesfvUOyQ7dxYAPttzLF83f'
        };

        var search = req.query.name;
        var options = { count: 100 };
        var twitterClient = new twitter(config);

        twitterClient.get('search/tweets', { q: search, count: 100 }, function(err, data, response) {
            var pos = 0;
            var neg = 0;
            var neut = 0;
            for (var i = 0; i < data.statuses.length; i++) {

                console.log(data.statuses[i].text);
                console.log(score);
                var score = sentiment(data.statuses[i].text).score;
                if (score == 0) {
                    neut++;
                } else if (score < 0) {
                    neg++;
                } else {
                    pos++;
                }

            };
            var op = {
                "pos": pos,
                "neg": neg,
                "neut": neut
            };
            res.json(op);
        });

    });

    return router;
}