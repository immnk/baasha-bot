var constants = require('./constants');
var unirest = require('unirest');
var express = require('express');
var router = express.Router();

module.exports = {
    createFDTicket: function(req, res) {
        var PATH = "/api/v2/tickets";
        var URL = "https://" + constants.FD.FD_ENDPOINT + ".freshdesk.com" + PATH;

        var fields = {
            'email': req.query.emailId,
            'subject': req.query.subject,
            'description': req.query.description,
            'status': 2,
            'priority': 1
        }

        var Request = unirest.post(URL);

        Request.auth({
                user: constants.FD.FD_API_KEY,
                pass: "Ms-4113009",
                sendImmediately: true
            })
            .type('json')
            .send(fields)
            .end(function(response) {
                console.log(response.body)

                console.log("Response Status : " + response.status)

                if (response.status == 201) {
                    var ticket = require(__base + 'models/tickets');
                    var ticketSchema = new ticket({
                        userId: req.query.userId,
                        ticketId: response.body.id,
                        description: req.query.description,
                        email: req.query.emailId,
                        subject: req.query.subject,
                        status: 2
                    });
                    ticketSchema.save(function(err) {
                        if (err) next(err);

                        console.log('tickets persisted in db!');
                    });
                    res.send('Ticket created successfully. Ticket id is ' + response.body.id)
                    console.log("Location Header : " + response.headers['location'])
                } else {
                    console.log("X-Request-Id :" + response.headers['x-request-id']);
                }
            });
    },



    getFDTicketStatus: function(req, res) {
        console.log("getFDTicketStatus");
        var PATH = "/api/v2/tickets/" + req.query.id;
        var URL = "https://" + constants.FD.FD_ENDPOINT + ".freshdesk.com" + PATH;
        var Request = unirest.get(URL);
        //console.log("getFDTicketStatus" + req);
        Request.auth({
                user: constants.FD.FD_API_KEY,
                pass: "Ms-4113009",
                sendImmediately: true
            })
            .type('json')
            .end(function(response) {
                //console.log(response.body)
                var statusVal = response.body.status;
                var statusTxt;
                switch (statusVal) {
                    case 2:
                        statusTxt = 'Open';
                        break;
                    case 3:
                        statusTxt = "Pending";
                        break;
                    case 4:
                        statusTxt = "Resolved";
                        break;
                    case 5:
                        statusTxt = "Closed";
                        break;
                }
                response.statusTxt = statusTxt;
                console.log("Ticket Status Response Status : " + response.statusTxt);
                res.send(response.statusTxt);
                

            });
    }

   
}