var constants = require('./constants');
var request = require('request');
var game = require('./game');

module.exports = {

    sendCabBookButton: function(senderID) {
        var quickReply = [{
                "content_type": "text",
                "title": "Yes",
                "payload": constants.BOOK_CAB_PAYLOAD
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "IGNORE"
            }
        ];
        var text = "Do you want to book a cab?";
        sendQuickReply(senderID, quickReply, text);
    },
    sendReviewButtons: function(senderID) {
        var buttons = [{
            type: "postback",
            title: "Good",
            payload: constants.REVIEW.GOOD_PAYLOAD
        }, {
            type: "postback",
            title: "Average",
            payload: constants.REVIEW.AVERAGE_PAYLOAD
        }, {
            type: "postback",
            title: "Poor",
            payload: constants.REVIEW.POOR_PAYLOAD
        }];
        var title = "Please give your rating for the movie!";

        sendButtonMessage(senderID, title, buttons);

    },
    /*
     * Authorization Event
     *
     * The value for 'optin.ref' is defined in the entry point. For the "Send to 
     * Messenger" plugin, it is the 'data-ref' field. Read more at 
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
     *
     */
    receivedAuthentication: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfAuth = event.timestamp;

        // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
        // The developer can set this to an arbitrary value to associate the 
        // authentication callback with the 'Send to Messenger' click event. This is
        // a way to do account linking when the user clicks the 'Send to Messenger' 
        // plugin.
        var passThroughParam = event.optin.ref;

        console.log("Received authentication for user %d and page %d with pass " +
            "through param '%s' at %d", senderID, recipientID, passThroughParam,
            timeOfAuth);

        // When an authentication is received, we'll send a message back to the sender
        // to let them know it was successful.
        sendTextMessage(senderID, "Authentication successful");
    },

    /*
     * Message Event
     *
     * This event is called when a message is sent to your page. The 'message' 
     * object format can vary depending on the kind of message that was received.
     * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
     *
     * For this example, we're going to echo any text that we get. If we get some 
     * special keywords ('button', 'generic', 'receipt'), then we'll send back
     * examples of those bubbles to illustrate the special message bubbles we've 
     * created. If we receive a message with an attachment (image, video, audio), 
     * then we'll simply confirm that we've received the attachment.
     * 
     */
    receivedMessage: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var isEcho = message.is_echo;
        var messageId = message.mid;
        var appId = message.app_id;
        var metadata = message.metadata;

        // You may get a text or attachment but not both
        var messageText = message.text;
        var messageAttachments = message.attachments;
        var quickReply = message.quick_reply;

        if (isEcho) {
            // Just logging message echoes to console
            console.log("Received echo for message %s and app %d with metadata %s",
                messageId, appId, metadata);
            return;
        } else if (quickReply) {
            var quickReplyPayload = quickReply.payload;
            if (quickReplyPayload.indexOf("GAME_RIGHT") != -1) {
                sendTextMessage(senderID, constants.KANNA_MESSAGES.RIGHT_ANSWER);
                setTimeout(function() {
                    sendPlayMessage(senderID);
                }, 500);
            } else if (quickReplyPayload.indexOf("GAME_WRONG") != -1) {
                sendTextMessage(senderID, constants.KANNA_MESSAGES.WRONG_ANSWER);
                setTimeout(function() {
                    sendPlayMessage(senderID);
                }, 500);
            } else if (quickReplyPayload.indexOf("MAIN_SERVICE_") != -1) {
                switch (quickReplyPayload) {
                    case constants.RECOMMEND_PAYLOAD:
                        sendTextMessage(senderID, "Fetching you the list of recommendations.");
                        break;
                    case constants.LOG_PAYLOAD:
                        sendTextMessage(senderID, "Please brief your concern for us to address it promptly.");
                        break;
                    case constants.PLAY_PAYLOAD:
                        sendPlayMessage(senderID);
                        break;
                    default:
                        sendTextMessage(senderID, constants.KANNA_MESSAGES.CANT_UNDERSTAND);
                }
            } else if (quickReplyPayload.indexOf(constants.BOOK_CAB_PAYLOAD) != -1) {
                //code to book a cab service
                sendTypingOn(senderID);
                setTimeout(() => {
                    sendTypingOff(senderID);
                    sendTextMessage(senderID, "Your cab has been booked.");
                }, 3000);
            } else {
                console.log("Quick reply for message %s with payload %s",
                    messageId, quickReplyPayload);

                sendTextMessage(senderID, "Quick reply tapped");
            }
            return;
        }

        messageText = messageText.toUpperCase();
        if (messageText.indexOf(constants.COMMANDS.MOVIES_NEAR_ME) != -1) {
            sendMovies(senderID);
        } else if (messageText.indexOf(constants.COMMANDS.ISSUE_COMMAND) != -1) {
            // Create FD ticket
            var params = {
                userId: senderID,
                emailId: 'sapnasat@gmail.com',
                subject: 'Issue created from Baasha Bot',
                description: messageText
            }
            request({ url: constants.SERVER_URL + "/freshdesk/createTicket", qs: params }, function(err, response, body) {
                if (err) { console.log(err); return; }
                // console.log("Get response: " + response.statusCode);
                sendTextMessage(senderID, "Ticket created. " + response.statusCode);
            });
        } else if (messageText) {

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding example. Otherwise, just echo
            // the text we received.
            switch (messageText) {
                case constants.COMMANDS.HELP_COMMAND:
                    sendHelpMessage(senderID);
                    break;
                case constants.COMMANDS.PLAY_COMMAND:
                    sendPlayMessage(senderID);
                    break;
                case 'IMAGE':
                    sendImageMessage(senderID);
                    break;
                case 'GIF':
                    sendGifMessage(senderID);
                    break;

                case 'AUDIO':
                    sendAudioMessage(senderID);
                    break;

                case 'VIDEO':
                    sendVideoMessage(senderID);
                    break;

                case 'FILE':
                    sendFileMessage(senderID);
                    break;

                case 'BUTTON':
                    sendButtonMessage(senderID);
                    break;

                case 'GENERIC':
                    sendGenericMessage(senderID);
                    break;

                case 'RECEIPT':
                    sendReceiptMessage(senderID);
                    break;

                case 'QUICK REPLY':
                    sendQuickReply(senderID);
                    break;

                case 'READ RECEIPT':
                    sendReadReceipt(senderID);
                    break;

                case 'TYPING ON':
                    sendTypingOn(senderID);
                    break;

                case 'TYPING OFF':
                    sendTypingOff(senderID);
                    break;

                case 'ACCOUNT LINKING':
                    sendAccountLinking(senderID);
                    break;

                default:
                    sendTextMessage(senderID, messageText);
            }
        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }
    },


    /*
     * Delivery Confirmation Event
     *
     * This event is sent to confirm the delivery of a message. Read more about 
     * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
     *
     */
    receivedDeliveryConfirmation: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var delivery = event.delivery;
        var messageIDs = delivery.mids;
        var watermark = delivery.watermark;
        var sequenceNumber = delivery.seq;

        if (messageIDs) {
            messageIDs.forEach(function(messageID) {
                console.log("Received delivery confirmation for message ID: %s",
                    messageID);
            });
        }

        console.log("All message before %d were delivered.", watermark);
    },


    /*
     * Postback Event
     *
     * This event is called when a postback is tapped on a Structured Message. 
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
     * 
     */
    receivedPostback: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfPostback = event.timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback 
        // button for Structured Messages. 
        var payload = event.postback.payload;

        console.log("Received postback for user %d and page %d with payload '%s' " +
            "at %d", senderID, recipientID, payload, timeOfPostback);

        if (payload == 'GET_STARTED_PAYLOAD') {
            sendHelpMessage(senderID);
        } else if (payload.indexOf(constants.SELECT_SHOW_PAYLOAD) != -1) {
            // sendTextMessage(senderID, payload);
            console.log(payload);
            var showID = payload.substring(payload.indexOf("#") + 1, payload.indexOf('$'));
            var timing = payload.substring(payload.indexOf('$') + 1, payload.indexOf('@'));
            var movieName = payload.substring(payload.indexOf('_') + 1);
            // sendTextMessage(senderID, "Shall I go ahead and book the ticket for show @ " + showID + " at theatre " + theatreID + " for movie " + movieName);
            sendBookingConfirmation(senderID, showID, timing, movieName);
        } else if (payload.indexOf(constants.SELECT_THEATRE_PAYLOAD) != -1) {
            var theatreID = payload.substring(payload.indexOf("$") + 1, payload.indexOf("#"));
            var movieName = payload.substring(payload.indexOf('_') + 1);
            console.log('Theatre ID' + theatreID + " Moviename: " + movieName);
            sendTextMessage(senderID, "Requested for  ticket at " + theatreID + " for movie: " + movieName);
            sendShowTimings(senderID, theatreID, movieName);
        } else if (payload.indexOf(constants.SELECT_MOVIE_PAYLOAD) != -1) {
            // Selected a movie. Now just fetch out locations.
            sendLocations(senderID, payload.replace(constants.SELECT_MOVIE_PAYLOAD, ""));
        } else if (payload.indexOf(constants.TOUR_PAYLOAD) != -1) {
            sendHelpMessage(senderID)
        } else if (payload.indexOf("REVIEW_") != -1) {
            // Say thanks for the review
            sendTypingOn(senderID);
            setTimeout(() => {
                sendTypingOff(senderID);
                sendTextMessage(senderID, "Thanks for giving your feedback.");
            }, 3000);
        } else {
            // When a postback is called, we'll send a message back to the sender to 
            // let them know it was successful
            sendTextMessage(senderID, "Postback called");
        }
    },

    /*
     * Message Read Event
     *
     * This event is called when a previously-sent message has been read.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
     * 
     */
    receivedMessageRead: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;

        // All messages before watermark (a timestamp) or sequence have been seen.
        var watermark = event.read.watermark;
        var sequenceNumber = event.read.seq;

        console.log("Received message read event for watermark %d and sequence " +
            "number %d", watermark, sequenceNumber);
    },

    /*
     * Account Link Event
     *
     * This event is called when the Link Account or UnLink Account action has been
     * tapped.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
     * 
     */
    receivedAccountLink: function(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;

        var status = event.account_linking.status;
        var authCode = event.account_linking.authorization_code;

        console.log("Received account link event with for user %d with status %s " +
            "and auth code %s ", senderID, status, authCode);
    }
}

function sendHelpMessage(senderID) {
    console.log('sendHelpMessage method called');
    var quickReply = [{
            "content_type": "text",
            "title": "Movies",
            "payload": constants.RECOMMEND_PAYLOAD
        },
        {
            "content_type": "text",
            "title": "Play",
            "payload": constants.PLAY_PAYLOAD
        },
        {
            "content_type": "text",
            "title": "Contact",
            "payload": constants.LOG_PAYLOAD
        }
    ];
    var title = "I'm Baasha.. Maaanik Baasha!! Kanna how can I help you? ";
    sendQuickReply(senderID, quickReply, title);
}

function sendPlayMessage(senderID) {
    var ques = game.getRandomGame();
    var quickReply = ques.options;
    var title = ques.question;
    sendQuickReply(senderID, quickReply, title);
}

function sendMovies(senderID) {
    request(constants.SERVER_URL + '/movies/getAllMovies', function(error, response, body) {
        if (error) {
            sendTextMessage(senderID, constants.KANNA_MESSAGES.ERROR);
            return;
        }
        var movies = JSON.parse(response.body);
        var elements = [];
        movies.forEach((movie) => {
            var element = {
                title: movie.Title,
                subtitle: movie.Plot,
                item_url: constants.SERVER_URL + "/movie?title=" + movie.Title,
                image_url: movie.Poster,
                buttons: [{
                    type: "postback",
                    title: "Select " + movie.Title,
                    payload: constants.SELECT_MOVIE_PAYLOAD + movie.Title,
                }],
            }
            elements.push(element);
        });
        sendGenericMessage(senderID, elements);
    });
}

function sendLocations(senderID, movieName) {
    console.log('sendLocation method start');
    console.log(movieName);
    var url = constants.SERVER_URL + '/movies/getMoviesLocationsByTitle';
    var params = { title: movieName }
    request({ url: url, qs: params }, function(error, response, body) {
        if (error) {
            sendTextMessage(senderID, constants.KANNA_MESSAGES.ERROR);
            return;
        }
        sendTextMessage(senderID, "Showing theatres by locations for movie: " + movieName);
        var theatresByLocations = JSON.parse(response.body);
        var movieTitle = theatresByLocations.title;
        for (var location in theatresByLocations) {
            if (theatresByLocations.hasOwnProperty(location)) {
                // console.log(location + " -> " + theatresByLocations[location]);
                if (location != 'title') {
                    var theatres = theatresByLocations[location];
                    var allButtons = [];
                    theatres.forEach((theatre) => {
                        var theatreButton = {
                            type: "postback",
                            title: theatre.name,
                            payload: constants.SELECT_THEATRE_PAYLOAD + theatre._id + '#' + constants.SELECT_MOVIE_PAYLOAD + movieTitle
                        }
                        allButtons.push(theatreButton);
                    });
                    sendButtonMessage(senderID, location, allButtons);
                }
            }
        }
    });
}

function sendShowTimings(senderID, theatreID, movieName) {
    console.log('Send show timing');
    var url = constants.SERVER_URL + '/movies/getShowsByMovieTheatre';
    var params = { title: movieName, theatre_id: theatreID }
    request({ url: url, qs: params }, function(error, response, body) {
        if (error) {
            sendTextMessage(senderID, constants.KANNA_MESSAGES.ERROR);
            return;
        }
        sendTextMessage(senderID, "Showing theatres by locations for movie: " + movieName);
        var showTimings = JSON.parse(response.body);
        console.log('show timings');
        console.log(showTimings);
        var allButtons = [];
        showTimings.forEach((show) => {
            var showButton = {
                type: "postback",
                title: show.timing,
                payload: constants.SELECT_SHOW_PAYLOAD + show._id + "&" + constants.SELECT_THEATRE_PAYLOAD + show.timing + "@" + constants.SELECT_MOVIE_PAYLOAD + show.movie_name
            }
            allButtons.push(showButton);
        });
        if (allButtons.length > 0) {
            console.log(allButtons);
            sendButtonMessage(senderID, "Select show time", allButtons);
        } else {
            sendTextMessage(senderID, "Couldnt fetch all shows available");
        }

    });
}

function sendBookingConfirmation(senderID, showID, timing, movieName) {
    console.log("Send booking confirmaion method");
    var url = constants.SERVER_URL + '/movies/bookTicket';
    var postData = {
        json: {
            user_id: senderID,
            shows_id: showID,
            seats: ['h1', 'h2'],
            time: timing
        }
    }
    request.post(url, postData, function(error, response, body) {
        if (error || response.statusCode != 200) {
            sendTextMessage(senderID, constants.KANNA_MESSAGES.ERROR);
            return;
        }

        if (response.statusCode == 200) {
            sendTextMessage(senderID, constants.KANNA_MESSAGES.SHOW_BOOKED);
            var buttons = [{
                type: "web_url",
                url: constants.SERVER_URL + "/booking?senderID=" + senderID + "&showID=" + showID,
                title: "Show ticket"
            }, {
                type: "postback",
                title: "Tour",
                payload: constants.TOUR_PAYLOAD
            }, {
                type: "phone_number",
                title: "Call Support",
                payload: "+16144957219"
            }];
            var title = "Kanna, these options might help you.";
            sendButtonMessage(senderID, title, buttons);
        } else
            sendTextMessage(senderID, constants.KANNA_MESSAGES.ERROR);
    });
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: constants.SERVER_URL + "/assets/rift.png"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: constants.SERVER_URL + "/assets/instagram_logo.gif"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "audio",
                payload: {
                    url: constants.SERVER_URL + "/assets/sample.mp3"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 *
 */
function sendVideoMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: constants.SERVER_URL + "/assets/allofus480.mov"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a file using the Send API.
 *
 */
function sendFileMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "file",
                payload: {
                    url: constants.SERVER_URL + "/assets/test.txt"
                }
            }
        }
    };

    callSendAPI(messageData);
}

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
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, title, buttons) {
    if (!buttons) {
        buttons = [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
        }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
        }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
        }];
        title = "This is test text";
    }
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: title,
                    buttons: buttons
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, elements) {
    if (!elements) {
        elements = [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: constants.SERVER_URL + "/assets/rift.png",
            buttons: [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/rift/",
                title: "Open Web URL"
            }, {
                type: "postback",
                title: "Call Postback",
                payload: "Payload for first bubble",
            }],
        }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: constants.SERVER_URL + "/assets/touch.png",
            buttons: [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/touch/",
                title: "Open Web URL"
            }, {
                type: "postback",
                title: "Call Postback",
                payload: "Payload for second bubble",
            }]
        }];
    }

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a receipt message using the Send API.
 *
 */
function sendReceiptMessage(recipientId) {
    // Generate a random receipt ID as the API requires a unique ID
    var receiptId = "order" + Math.floor(Math.random() * 1000);

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "receipt",
                    recipient_name: "Peter Chang",
                    order_number: receiptId,
                    currency: "USD",
                    payment_method: "Visa 1234",
                    timestamp: "1428444852",
                    elements: [{
                        title: "Oculus Rift",
                        subtitle: "Includes: headset, sensor, remote",
                        quantity: 1,
                        price: 599.00,
                        currency: "USD",
                        image_url: constants.SERVER_URL + "/assets/riftsq.png"
                    }, {
                        title: "Samsung Gear VR",
                        subtitle: "Frost White",
                        quantity: 1,
                        price: 99.99,
                        currency: "USD",
                        image_url: constants.SERVER_URL + "/assets/gearvrsq.png"
                    }],
                    address: {
                        street_1: "1 Hacker Way",
                        street_2: "",
                        city: "Menlo Park",
                        postal_code: "94025",
                        state: "CA",
                        country: "US"
                    },
                    summary: {
                        subtotal: 698.99,
                        shipping_cost: 20.00,
                        total_tax: 57.67,
                        total_cost: 626.66
                    },
                    adjustments: [{
                        name: "New Customer Discount",
                        amount: -50
                    }, {
                        name: "$100 Off Coupon",
                        amount: -100
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId, quickReply, text) {
    if (!quickReply) {
        quickReply = [{
                "content_type": "text",
                "title": "Action",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
            },
            {
                "content_type": "text",
                "title": "Comedy",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
            },
            {
                "content_type": "text",
                "title": "Drama",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            }
        ];
        text = "What's your favorite movie genre?";
    }
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text,
            quick_replies: quickReply
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
    console.log("Sending a read receipt to mark message as seen");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "mark_seen"
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
    console.log("Turning typing indicator on");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
    console.log("Turning typing indicator off");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    callSendAPI(messageData);
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Welcome. Link your account.",
                    buttons: [{
                        type: "account_link",
                        url: constants.SERVER_URL + "/authorize"
                    }]
                }
            }
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