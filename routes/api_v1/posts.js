const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const config = require('../../config/index');
const requireAuth = passport.authenticate('jwt', {session: false});
const Post = require('../../models/post');

app.use(passport.initialize());
require('../../config/passport')(passport);

router.get('/', function(req, res) {
  Post.find({}).populate('owner').exec(function(err, posts) {
    var postList = [];
    posts.forEach(
      function(post) {
        postList.push({
          id: post.id,
          title: post.title,
          description: post.description,
          youtubeVideoID: post.youtubeVideoID,
          created_at: post.created,
          likes: post.likes,
          comments: post.comments,
          owner: post.owner.username,
          ownerAvatar: post.owner.avatar
        });
      }
    )
    res.status(200).json({
      success: true,
      posts: postList
    });
  });
});

router.post('/', requireAuth, function(req, res) {
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
});

router.get('/:id', function(req, res) {
  res.status(200).json({success: true, message: 'post' + req.params.id});
});

module.exports = router;
