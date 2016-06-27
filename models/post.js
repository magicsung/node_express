'use strict';

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
    type: Schema.ObjectId,
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
  },
  commentList: [{
    description: { type : String, required: true },
    owner: { type : Schema.ObjectId, ref : 'Account' },
    created: { type : Date, default : Date.now }
  }]
});

Post.methods = {
  addComment: function (user, comment) {
    this.commentList.push({
      description: comment,
      owner: user._id
    });
    this.comments += 1;

    return this.save();
  },
  removeComment: function (commentId) {
    const index = this.commentList
      .map(comment => comment.id)
      .indexOf(commentId);

    if (~index) {
      this.commentList.splice(index, 1);
      this.comments -= 1;
    }
    else throw new Error('Comment not found');
    return this.save();
  }
};

Post.statics = {
  load: function (_id) {
    return this.findOne({ _id })
      .populate('owner', 'id username avatar')
      .populate('commentList.owner', 'id username avatar')
      .exec();
  }
};

module.exports = mongoose.model('Post', Post);
