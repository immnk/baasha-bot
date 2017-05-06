var express = require('express');
var freshdesk = require('../modules/freshdesk');
var app = express.Router();

module.exports = function() {

    app.get('/createTicket', function(req, res) {
        freshdesk.createFDTicket(req, res);
    });

    app.get('/getTicketStatus', function(req, res) {
        console.log("router hit");
        freshdesk.getFDTicketStatus(req, res);
    });

    app.get('/pushOnResolution', function(req, res) {
        res.send('ticket resolved');
    });

    return app;
}