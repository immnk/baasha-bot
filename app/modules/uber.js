var constants = require('./constants');
var unirest = require('unirest');
var uber_access_token;
var eta="5";
var driver="kamal";
module.exports = {
		
		
	    
	    
	    
	    getAuth: function(req, res) {
	    	var oauthToken=req.query.code;
	    	console.log(req.query.code);
	    	unirest.post('https://login.uber.com/oauth/v2/token')
	    	.send({
	    	       "client_secret": "1O8550xBLd7A3yV9J1BhwxhmNj07tpxcxG_smZw9",
	    	       "client_id": "NOAdsESZIE2CPWaL4Fg0d71uNVjFzcLU",
	    	       "grant_type":"authorization_code",
	    	       "redirect_uri": constants.UBER_AUTH_REDIRECT,
	    	       "code":req.query.code
	    	       
	    	     })
	    	.end(function (response) {
	    		getFareEstimate(req,response)
	    	});
	    }
    
    
    	
}

function getFareEstimate(req,res)
{
	if(res.body.access_token)
	{
		uber_access_token=res.body.access_token;
	console.log("access_token="+res.body.access_token)
	unirest.post('https://sandbox-api.uber.com/v1.2/requests/estimate')
	.headers({'Authorization': 'Bearer '+res.body.access_token, 'Accept-Language': 'en_US','Content-Type': 'application/json'})
	.send({
	       "start_latitude": 37.7752278,
	       "start_longitude": -122.4197513,
	       "end_latitude": 37.7773228,
	       "end_longitude": -122.4272052
	     })
	.end(function (response) {
	  bookUber(req,response);
	});
	}
}

function bookUber(req, fareResponse) {
	console.log("fare_id="+fareResponse.body.fare.fare_id);
	console.log("uber_access_token="+uber_access_token);
	unirest.post('https://sandbox-api.uber.com/v1/requests')
	.headers({'Authorization': 'Bearer '+uber_access_token, 'Accept-Language': 'en_US','Content-Type': 'application/json'})
	.send({
	       "start_latitude": 37.7752278,
	       "start_longitude": -122.4197513,
	       "end_latitude": 37.7773228,
	       "end_longitude": -122.4272052,
	       "fare_id":fareResponse.body.fare.fare_id
	     })
	.end(function (response) {
	  console.log(response.body);
	  unirest.post('https://sandbox-api.uber.com/v1/requests')
	  .send({
		  userId: req.query.userId,
    	  driverName: driver,
    	  eta: etaVal,
    	  fareEstimate: fareResponse.body.fare.value
	  })
	});
}

