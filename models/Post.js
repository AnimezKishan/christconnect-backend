const { db } = require('../configs/firebase');

/**
 * Create a new post in Firestore
 * @param {Object} postData - Post data containing postOwner, ownerEmail, title, description, postLink
 * @returns {Promise<Object>} - Object with success status and post ID if successful
 */
const createPost = async (postData) => {
    try {
        // Validate required fields
        if (!postData.ownerName || !postData.ownerEmail || !postData.title) {
            return { 
                success: false, 
                message: 'Missing required fields: ownerName, ownerEmail, and title are required' 
            };
        }

        // Create a new post document with a generated ID
        const postRef = db.collection('posts').doc();
        const postId = postRef.id;
        
        // Prepare post data with timestamp and ID
        const newPost = {
            id: postId,
            ownerName: postData.ownerName,
            ownerEmail: postData.ownerEmail,
            title: postData.title,
            description: postData.description || '',
            postLink: postData.postLink || '',
            createdAt: new Date().toISOString()
        };

        // Save the post to Firestore
        await postRef.set(newPost);
        
        return { 
            success: true, 
            message: 'Post created successfully',
            postId: postId 
        };
    } catch (error) {
        console.error('Error creating post:', error);
        return { 
            success: false, 
            message: 'Error creating post', 
            error: error.message 
        };
    }
};

/**
 * Delete a post from Firestore by ID
 * @param {string} postId - The ID of the post to delete
 * @returns {Promise<Object>} - Object with success status and message
 */
const deletePost = async (postId) => {
    try {
        // Check if post exists
        const postDoc = await db.collection('posts').doc(postId).get();
        
        if (!postDoc.exists) {
            return { 
                success: false, 
                message: 'Post not found' 
            };
        }
        
        // Delete the post
        await db.collection('posts').doc(postId).delete();
        
        return { 
            success: true, 
            message: 'Post deleted successfully' 
        };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { 
            success: false, 
            message: 'Error deleting post', 
            error: error.message 
        };
    }
};

/**
 * Get all posts from Firestore
 * @returns {Promise<Object>} - Object with success status and array of posts
 */
const getAllPosts = async () => {
    try {
        const postsSnapshot = await db.collection('posts')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (postsSnapshot.empty) {
            return { 
                success: true, 
                message: 'No posts found', 
                posts: [] 
            };
        }
        
        const posts = [];
        postsSnapshot.forEach(doc => {
            posts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { 
            success: true, 
            message: 'Posts retrieved successfully', 
            posts 
        };
    } catch (error) {
        console.error('Error getting posts:', error);
        return { 
            success: false, 
            message: 'Error retrieving posts', 
            error: error.message 
        };
    }
};

module.exports = {
    createPost,
    deletePost,
    getAllPosts
};