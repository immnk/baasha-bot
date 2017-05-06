var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var screenSchema = new Schema({
  id: String,
  name: String,
  theatre_id: String
});

var Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;