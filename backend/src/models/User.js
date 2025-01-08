const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    trim: true, 
  },
  question1: {
    type: String,
    required: true, 
    trim: true,
  },
  question2: {
    type: String,
    required: true, 
    trim: true,
  },
  avatar: {
    type: String, 
    required: false,
    trim: true,
  },
  lobbyCode: {
    type: String, 
    required: true,
    trim: true,
  },
  isCreator: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
