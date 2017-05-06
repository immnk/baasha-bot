var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
  id: String,
  name: String,
  genre: String,
  language: String,
  location: String,
  releaseDate: Date,
  trailerLink: String,
  Poster: String,
  popularImgLink: String,
  Theatre_Arr:Array
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;