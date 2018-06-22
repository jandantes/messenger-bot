const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  userId: String,
  mobileNo: String,
  emailAddress: String,
}, {
  timestamps: true,
});
const User = mongoose.model('User', mongoSchema);

module.exports = User;
