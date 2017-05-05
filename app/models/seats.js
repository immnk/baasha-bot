var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seatsSchema = new Schema({
  id: String,
  name: String,
  location: String
});

var Seats = mongoose.model('Seats', seatsSchema);

module.exports = Seats;