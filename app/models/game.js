var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  id: String,
  name: String,
  location: String
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;