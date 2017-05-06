var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  id: String,
  ques: String,
  option: Array,
  answer: String
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;