const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user, content, image } = req.body;
  try {
    const newPost = new Post({
      user,
      content,
      image
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username').populate('comments');
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('The post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('The post has been disliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
  
