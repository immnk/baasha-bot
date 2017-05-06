var express = require('express');
var request = require('request');
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


	// Send cron msg
	router.get('/getTickets', function(req, res) {
        var Tickets = require(__base + 'models/tickets');

        // get all the users
        Tickets.find({}, function(err, tickets) {
            if (err) next(err);

            // object of all the tickets
            for( var k = 0; k < tickets.length ; k++){
            	console.log("tickets",tickets[k].userId+":"+tickets[k].ticketId);
            	req.senderID = tickets[k].userId;
            	var params = {
	                id: tickets[k].ticketId
            	}
            	request({ url: "https://thebotdesigners.herokuapp.com" + "/freshdesk/getTicket", qs: params }, function(err, response, body) {
                if (err) { console.log(err); return; }
                // console.log("Get response: " + response.statusCode);
                	sendTextMessage(req.senderID, "Ticket created. " + response.statusCode);
            	});
            }

            console.log(tickets);
            res.json(tickets);
        });

    });

	return router;
}