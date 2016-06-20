'use strict';

exports.post = {
  hasAuthorization: function (req, res, next) {
    if (req.post.owner.id != req.user.id) {
      return res.status(401).send({success: false, message: 'You are not authorized.'});
    }
    next();
  }
};

exports.comment = {
  hasAuthorization: function (req, res, next) {
    if (req.user.id === req.comment.owner.id || req.user.id === req.post.owner.id) {
      next();
    } else {
      return res.status(401).send({success: false, message: 'You are not authorized.'});
    }
  }
};
