'use strict';

const mongoose = require('mongoose');
const co = require('co');
const Post = require('../models/post');
const assign = Object.assign;

exports.load = co.wrap( function* (req, res, next, id) {
  try {
    req.post = yield Post.load(id);
    if (!req.post) return next(new Error('Post not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

exports.index = function(req, res) {
  Post.find({})
      .populate('owner', 'id username avatar')
      .populate('commentList.owner', 'id username avatar')
      .exec(function(err, posts) {
    var postList = [];
    posts.forEach(
      function(post) {
        var commentList = [];
        post.commentList.forEach(
          function(comment) {
            commentList.push({
              id: comment.id,
              descrtipion: comment.description,
              owner: comment.owner
            });
          }
        )
        postList.push({
          id: post.id,
          title: post.title,
          description: post.description,
          youtubeVideoID: post.youtubeVideoID,
          created_at: post.created,
          likes: post.likes,
          comments: post.comments,
          owner: post.owner,
          commentList: commentList
        });
      }
    )
    res.status(200).json({
      success: true,
      posts: postList
    });
  });
};

exports.create = function(req, res) {
  if (!req.body.title || !req.body.description || !req.body.youtubeVideoID) {
    res.status(400).json({success: false, message: 'Please enter full info.'});
  } else {
    var newPost = new Post({title: req.body.title,
                            description: req.body.description,
                            youtubeVideoID: req.body.youtubeVideoID,
                            owner: req.user._id
                          });
    newPost.save(function(err) {
      if (err) {
        return res.status(400).json({success: false, message: err});
      }
      res.status(201).json({success: true, message: 'Successfully created new post.'});
    });
  }
};

exports.show = function(req, res) {
  res.status(200).json({success: true, message: 'post' + req.params.id});
};
