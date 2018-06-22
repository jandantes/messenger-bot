const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  userId: String,
  mobileNo: String,
  address: String,
  plateNo: String,
  details: String,
  messageId: String,
}, {
  timestamps: true,
});

const Rescue = mongoose.model('Rescue', mongoSchema);

module.exports = Rescue;
