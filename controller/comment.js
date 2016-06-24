'use strict';

const Post = require('../models/post');

exports.load = function (req, res, next, id) {

  req.comment = req.post.commentList
    .find(comment => comment.id === id);
  if (!req.comment) return next(new Error('Comment not found'));
  next();
};

exports.create = function(req, res) {
  if (!req.body.description) {
    res.status(400).json({success: false, message: 'Please enter someting.'});
  } else {
    Post.findOne({_id: req.params.id}, function(err, post) {
      if (!post) {
        res.status(401).send({success: false, message: 'Post not found.'});
      } else {
        post.addComment(req.user, req.body.description);
        var newComment = post.commentList[ post.commentList.length - 1 ];
        res.status(201).json({
          success: true,
          message: "Successfully add new comment.",
          comment: {
            id: newComment.id,
            description: newComment.description,
            created_at: newComment.created,
            owner: {
              _id: req.user.id,
              username: req.user.username,
              avatar: req.user.avatar
            }
          }
        });
      }
    })
  }
};

exports.destroy = function(req, res) {
  req.post.removeComment(req.params.commentId);
  res.status(201).json({success: true, message: 'Successfully delete comment.'});
};
