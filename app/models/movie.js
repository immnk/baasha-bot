var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
  id: String,
  name: String,
  genre: String,
  language: String
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;