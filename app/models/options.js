var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionsSchema = new Schema({
  id: String,
  name: String,
  location: String
});

var Options = mongoose.model('Options', optionsSchema);

module.exports = Options;