const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, default: 'admin' }, // Default usertype as 'admin'
});

module.exports = mongoose.model('User', userSchema);
