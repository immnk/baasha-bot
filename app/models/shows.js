var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var showsSchema = new Schema({
  screen_id: String,
  movie_id: String,
  time: String
});

var Shows = mongoose.model('Shows', showsSchema);

module.exports = Shows;