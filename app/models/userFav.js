var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userFavSchema = new Schema({
		id: String,
		movies: Array
});

var userFav = mongoose.model('Userfav', userFavSchema);

module.exports = userFav;

