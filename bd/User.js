const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  id:  {
    type: Number,
    required: true
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;