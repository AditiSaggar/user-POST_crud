const express = require('express')
const router = express.Router();
const postController = require('../controllers/post.controller');
const { verify } = require('jsonwebtoken');
const authMiddleware = require("../middleware/verify")

// Create a post
router.post('/create', postController.createPost);

// Get all posts
router.get('/posts', authMiddleware.accessAdmin, postController.getAllPosts);

//Get post by id
router.get('/posts/:id', postController.getPostById);

//get Post By slug Or Id
router.get('/post/:id', postController.getPostByslugOrId);

// Update a post by ID
router.put('/update/:id.', postController.updatePost);

// Delete a post by ID
router.delete('/delete/:id', postController.deletePost);

//slug title
router.get('/:slug', postController.createSlug);


module.exports = router;


