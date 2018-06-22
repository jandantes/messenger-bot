const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  userId: String,
  message: String,
  created: { type: Date, default: Date.now },
});
const Sms = mongoose.model('Sms', mongoSchema);

module.exports = Sms;
