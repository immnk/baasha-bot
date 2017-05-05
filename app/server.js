var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var constants = require('./modules/constants');
var fbMessenger = require('./modules/fbMessenger');
var mongoose = require('mongoose');
var config = require('./config');
global.__base = __dirname + '/';
var FD_API_KEY = "USyBH4BxWXMHNlsuvxh3";
var FD_ENDPOINT = "meesun";
var https = require("https");
var unirest = require('unirest');

var app = express();

app.set('port', (process.env.PORT || 8080));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Process application/json
app.use(bodyParser.json());
app.use(express.static('WebContent'));


// Connect to database
mongoose.connect(config.database.mlabs);


/*Router Declarations*/

var movies = require(__dirname + '/routes/movies')(); 
var theatre = require(__dirname + '/routes/theatre')(); 
// Index route
app.get('/', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'index.html', { root: __dirname });
});
app.get('/createTicket', function(req,res){
	createFDTicket(req,res);
	
});

app.get('/getTicketStatus', function(req,res){
	getFDTicketStatus(req,res);
});

app.get('/pushOnResolution', function(req,res){
	res.send('ticket resolved')
});

app.get('/privacy', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'privacy-policy.html', { root: __dirname });
});


app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge']);
        return;
    }
    res.send('Error, wrong token');
});

/* Mapping the requests to routes (controllers) */


app.use('/movies', movies);
app.use('/theatre', theatre);


app.post('/webhook/', function(req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    fbMessenger.receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    fbMessenger.receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    fbMessenger.receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    fbMessenger.receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    fbMessenger.receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    fbMessenger.receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've 
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});
function createFDTicket(req,res)
{
	var PATH = "/api/v2/tickets";
	var URL =  "https://" + FD_ENDPOINT + ".freshdesk.com"+ PATH;

	var fields = {
	  'email': req.query.emailId,
	  'subject': req.query.subject,
	  'description': req.query.description,
	  'status': 2,
	  'priority': 1
	}

	var Request = unirest.post(URL);

	Request.auth({
	  user: FD_API_KEY,
	  pass: "Ms-4113009",
	  sendImmediately: true
	})
	.type('json')
	.send(fields)
	.end(function(response){
	  console.log(response.body)
	  
	  console.log("Response Status : " + response.status)
	  
	  if(response.status == 201){
		var ticket = require(__base + 'models/tickets');
		var ticketSchema = new ticket({
			  userId: req.query.userId,
			  ticketId: response.body.id,
			  description: req.query.description,
			  email: req.query.emailId,
			  subject: req.query.subject
			});
		ticketSchema.save(function(err) {
			if (err) next(err);

			console.log('tickets persisted in db!');
		});
		res.send('Ticket created successfully. Ticket id is '+response.body.id)
	    console.log("Location Header : "+ response.headers['location'])
	  }
	  else{
	    	console.log("X-Request-Id :" + response.headers['x-request-id']);
	  }
	  });
}

function getFDTicketStatus(req,res){
	var PATH = "/api/v2/tickets/"+req.query.id;
	var URL =  "https://" + FD_ENDPOINT + ".freshdesk.com"+ PATH;
	var Request = unirest.get(URL);

	Request.auth({
	  user: FD_API_KEY,
	  pass: "Ms-4113009",
	  sendImmediately: true
	})
	.type('json')
	.end(function(response){
	  console.log(response.body)
	  var status=response.body.status;
	  var statusTxt;
	  switch(status)
	  {
	  case 2:
		  statusTxt='Open';
		  break;
	  case 3:
		  statusTxt="Pending";
		  break;
	  case 4:
		  statusTxt="Resolved";
		  break;
	  case 5:
		  statusTxt="Closed";
		  break;
	  }
	  res.send(statusTxt);
	  console.log("Ticket Status Response Status : " + response.body.status)
	  
	  });
}
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});

