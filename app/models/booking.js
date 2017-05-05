var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
  id: String,
  name: String,
  location: String
});

var Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;