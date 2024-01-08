const express = require('express')
const router = express.Router();

const postController = require('../controllers/post.controller');
//const authMiddleware = require("../middleware/verify")

// Create a post
router.post('/create', postController.createPost);

// Get all posts
router.get('/posts', postController.getAllPosts);

//Get post by id
router.get('/posts/:id', postController.getPostById);

// Update a post by ID
router.put('/update/:id', postController.updatePost);

// Delete a post by ID
router.delete('/delete/:id', postController.deletePost);

//slug title
router.get('/:slug', postController.createSlug);

module.exports = router;


