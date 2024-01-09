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
      // Retrieve all posts
      const posts = await PostModel.find();
  
      res.status(200).json({ success: true, message: 'All posts retrieved successfully', posts });
    } catch (error) {
      console.error('Error getting all posts:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  };
  
//Read post By id
const getPostById = async (req, res) => {
    try {
      const postId = req.params.id;
  
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
  
//create a slug and retrieve a post by slug
// const createSlug = async (req, res) => {
//     const { slug } = req.params;

//     if (req.body.title) {
//         req.body.slug = slugify(req.body.title, {
//             replacement: '-',
//             lower: true,
//             remove: /[*+~.()'"!:@]/g,
//         });
//     }
//     try {
//         // If the request has a title, create a new post with the slug
//         if (req.body.title) {
//             const newPost = new PostModel(req.body);
//             const savedPost = await newPost.save();
//             return res.status(201).json({
//                 success: true,
//                 message: 'Post created successfully',
//                 post: savedPost,
//             });
//         }
//         const post = await PostModel.findOne({ slug }).select('-_id');

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         res.json(post);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
  
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostByslugOrId,
  updatePost,
  deletePost,
  // createSlug 
};
