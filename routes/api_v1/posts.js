'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const config = require('../../config/index');
const requireAuth = passport.authenticate('jwt', {session: false});
const posts = require('../../controller/post');
const comments = require('../../controller/comment');

const auth = require('../../config/auth');
const postAuth = [requireAuth, auth.post.hasAuthorization];
const commentAuth = [requireAuth, auth.comment.hasAuthorization];

app.use(passport.initialize());
require('../../config/passport')(passport);

router.param('id', posts.load);
router.get('/', posts.index);
router.post('/', requireAuth, posts.create);
router.get('/:id', posts.show);

router.param('commentId', comments.load);
router.post('/:id/comments', requireAuth, comments.create);
router.delete('/:id/comments/:commentId', commentAuth, comments.destroy);

module.exports = router;
