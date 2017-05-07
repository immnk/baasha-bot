var constants = require('./constants');
var request = require('request');
var unirest = require('unirest');
var express = require('express');
var router = express.Router();

module.exports ={
		getUserFav: function(req, res) {
			var userFav = require(__base + 'models/userFav');
			var Movies = require(__base + 'models/movies');

			var userFavObj = {id:req.query.id};
			//console.log(req.query.id)
			// get all the movies
			userFav.find(userFavObj, function(err, resp) {
				if (err) next(err);

				//console.log(resp);
				//res.json(resp);
				//res.users = resp;
				global.__finalResp = resp[0];

					 // get all the movies
		        Movies.find({}, function(err, movies) {
		            if (err) next(err);

		            //console.log(movies);
		            var moviesArray = [];
		            for (var a = 0; a < movies.length; a++) {
		                //console.log(movies[a].Title);
		                var obj = { "name": movies[a].Title };
		                moviesArray.push(obj);
		            }
		            var finalResp = {};
		            var moviesKey = {"movies":moviesArray};
		            finalResp.current = moviesKey;

		            finalResp.user= global.__finalResp;
		            //global.__Resp
		            //res.current = moviesArray;

					/*request({
					  url: 'http://6ee843fe.ngrok.io/BaashaRecommends/rest/baasha/recommendation',
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(finalResp)
					}, function(error, response, body){
					  console.log('gggg'+body);
					});*/


					//var json_obj = JSON.parse(finalResp);
					console.log(finalResp);
   request.post({
        headers: {'content-type':'application/json','Accept':'*/*'},
        url:'http://6ee843fe.ngrok.io/BaashaRecommends/rest/baasha/recommendation',
        json: finalResp
    },function(error, response, body){
    console.log(body);
    res.send(body);
  });
    		
        var resFromService =  {"movies":[{"name":"GUARDIANS OF THE GALAXY VOL 2"},{"name":"THE BOSS BABY"}]};

    				//console.log(postData);
    				//res.send(resFromService);
		            
            	});

		           // console.log("Sap"+movies);
		            

		    });
		}       

		
}