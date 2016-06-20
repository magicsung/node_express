const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account');

var Post = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  youtubeVideoID: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', Post);
