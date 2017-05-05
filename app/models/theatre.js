var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var theatreSchema = new Schema({
  id: String,
  name: String,
  location: String
});

var Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;