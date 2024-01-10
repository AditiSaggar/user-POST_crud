const PostModel = require('../models/post.schema');
const UserModel = require('../models/user.schema');
const mongoose = require('mongoose');


//const slugify = require('slugify');

//create post
const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {

      const savedPost = await newPost.save();

      res.status(201).json({
        success: true,
        message:"posted successfully",
      post:savedPost})

       } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: error.message });
      } 
  
};
  
 //Get Post
//  const readPost = async (req, res) => {
//     try {
//       const postId = req.params.id;
      
//       // Find post by ID
//       const post = await PostModel.findById(postId);
  
//       if (!post) {
//         return res.status(404).json({ 
//             success: false, 
//             message: 'Post not found', 
//             error: 'Post with the provided ID does not exist' });
//       }
  
//       res.status(200).json({ 
//         success: true, 
//         message: 'Post retrieved successfully', 
//         post });
//     } catch (error) {
//       console.error('Error reading post:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Internal Server Error', 
//         error: error.message });
//     }
// };

//Read All Post
const getAllPosts = async (req, res) => {
  try {
      // Check if req.user is defined and has a role property
      const role = req.user && req.user.role ? req.user.role : 'default';

      if (role === 'admin') {
          const posts = await PostModel.find();

          res.status(200).json({
              success: true,
              message: 'All posts retrieved successfully',
              posts
          });
      } else {
          res.status(403).json({
              success: false,
              message: 'Access denied. Only admins can retrieve all posts.'
          });
      }
  } catch (error) {
      console.error('Error getting all posts:', error);
      res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message
      });
  }
};



  
//Read post By id
const getPostById = async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Find post by ID
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ 
            success: false, 
            message: 'Post not found', 
            error: 'Post with the provided ID does not exist' });
      }
  
      res.status(200).json({ 
        success: true, 
        message: 'Post retrieved successfully',
         post });
    } catch (error) {
      console.error('Error getting post by ID:', error);
      res.status(500).json({
         success: false, 
         message: 'Internal Server Error', 
         error: error.message });
    }
};

//
const getPostByslugOrId = async (req, res) => {
  try {
    const criteria = {};
    criteria.$or = [];

    const postId = req.params.postId; // Assuming the post ID is part of the request parameters.

    if (mongoose.Types.ObjectId.isValid(postId)) {
      criteria.$or.push({ _id: postId });
    }

    criteria.$or.push({ slug: postId });

    const post = await PostModel.findOne(criteria);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        payload: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      payload: post,
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


//Update Post
const updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      
      // Check if the post exists
      const existingPost = await PostModel.findById(postId);
  
      if (!existingPost) {
        return res.status(404).json({ 
            success: false, 
            message: 'Post not found', 
            error: 'Post with the provided ID does not exist' });
      }
  
      // Update post data
      existingPost.title = req.body.title;
      existingPost.content = req.body.content;
  
      // Save the updated post
      const updatedPost = await existingPost.save();
  
      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post: updatedPost
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({
         success: false, 
         message: 'Internal Server Error', 
         error: error.message });
    }
};
  
//Delete Post
const deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find post by ID and remove it
      const deletedPost = await PostModel.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ 
            success: false, 
            message: 'Post not found', 
            error: 'Post with the provided ID does not exist' });
        }
  
      res.status(200).json({ 
        success: true, 
        message: 'Post deleted successfully', 
        post: deletedPost });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: error.message });
    }
};
  
//create a slug 
const createSlug = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const slug = title.replace(/\s+/g, '-');

    // If the request has a title, create a new post with the slug
    if (slug) {
      const newPostData = { ...req.body, slug };
      const newPost = new PostModel(newPostData);

      try {
        const savedPost = await newPost.save();

        return res.status(201).json({
          success: true,
          message: 'Post created and saved successfully',
          post: savedPost,
        });
      } catch (saveError) {
        console.error('Error saving post:', saveError);
        return res.status(500).json({
          success: false,
          message: 'Error saving post',
          error: saveError.message,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid title',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostByslugOrId,
  updatePost,
  deletePost,
  createSlug 
};
