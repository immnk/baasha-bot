var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var constants = require('./modules/constants');
var fbMessenger = require('./modules/fbMessenger');
var mongoose = require('mongoose');
var config = require('./config');
var cronJob = require('cron').CronJob;

global.__base = __dirname + '/';

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
var freshdesk = require(__dirname + '/routes/freshdesk')();
var options = require(__dirname + '/routes/option')();
var uber = require(__dirname + '/routes/uber')();

/* Mapping the requests to routes (controllers) */
app.use('/movies', movies);
app.use('/theatre', theatre);
app.use('/freshdesk', freshdesk);
app.use('/option', options);
app.use('/uber', uber);

// Index route
app.get('/', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'index.html', { root: __dirname });
});

app.get('/privacy', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'privacy-policy.html', { root: __dirname });
});

app.get('/booking', function(req, res) {
    res.sendFile(constants.HTML_DIR + 'booking.html', { root: __dirname });
});

app.get('/movie', function(req, res) {
    var title = req.query.title;
    res.sendFile(constants.HTML_DIR + 'movie.html?title=' + title, { root: __dirname });
});

app.get('/getCab', function(req, res) {
    var senderID = req.query.sender;
    fbMessenger.sendCabBookButton(senderID);
    res.sendStatus(200);
});

app.get('/askReview', function(req, res) {
    var senderID = req.query.sender;
    fbMessenger.sendReviewButtons(senderID);
    res.sendStatus(200);
});

app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge']);
        return;
    }
    res.send('Error, wrong token');
});

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
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


var myJob = new cronJob('5 * * * * *', function() {
    var Tickets = require(__base + 'models/tickets');

    // get all the users
    Tickets.find({}, function(err, tickets) {
        if (err) next(err);

        // object of all the tickets
        for (var k = 0; k < tickets.length; k++) {
            console.log("tickets", tickets[k].userId + ":" + tickets[k].ticketId);
            if (tickets[k].status != 4) {
                console.log("tickets", tickets[k].userId + ":" + tickets[k].ticketId);
                global.__senderId = tickets[k].userId;
                global.__ticketId = tickets[k].ticketId;
                var params = {
                    "id": tickets[k].ticketId
                };
                request({ url: constants.LOCAL_URL + "/freshdesk/getTicketStatus", qs: params }, function(err, response, body) {
                    if (err) { console.log("err" + err); return; }
                    console.log(body);
                    if (body == 'Resolved' || body == 'Closed') {
                        Tickets.findOne({ ticketId: global.__ticketId }, function(err, updateTkt) {
                            if (!err) {
                                updateTkt.status = 4;
                                updateTkt.save(function(err) {
                                    if (!err) {
                                        console.log("err");
                                    } else {
                                        console.log("Success");
                                    }
                                });
                            }
                        });
                        sendTextMessage(global.__senderId, "Issue has been resolved! #" + global.__ticketId);
                    }
                });
            }
        }

    });

});

myJob.start();


/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
}


/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
    request({
        uri: constants.FB_MESSAGES_URL,
        qs: {
            access_token: constants.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}