var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
    id: String,
    name: String,
    location: String,
    user_id: String,
    shows_id: String,
    seats: Array
});

var Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
