const { createPost, getAllPosts } = require('../models/Post');

/**
 * Create a new post
 * @param {Object} req - Express request object with post data in body
 * @param {Object} res - Express response object
 */
const handleCreatePost = async (req, res) => {
    try {
        const { post } = req.body;
        
        // Parse the data if it's a string
        let postData = post;
        if (typeof post === 'string') {
            try {
                postData = JSON.parse(post);
            } catch (parseError) {
                console.error('Error parsing post data:', parseError);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON data format'
                });
            }
        }
        
        // Validate required fields
        if (!postData.ownerName || !postData.ownerEmail || !postData.title) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: postOwner, ownerEmail, and title are required'
            });
        }
        
        // Create the post
        const result = await createPost(postData);
        
        if (result.success) {
            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                postId: result.postId
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in create post handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get all posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleGetAllPosts = async (req, res) => {
    try {
        // Fetch all posts
        const result = await getAllPosts();
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                posts: result.posts
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in get all posts handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    handleCreatePost,
    handleGetAllPosts
};