var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var theatreshowmovieSchema = new Schema({
  theatre_id: String,
  movie_name: String,
  timing: String
});

var Theatreshowmovie = mongoose.model('Theatreshowmovie', theatreshowmovieSchema);

module.exports = Theatreshowmovie;