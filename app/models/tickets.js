var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
  userId: String,
  ticketId: String,
  description: String,
  email: String,
  subject: String
});

var Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;