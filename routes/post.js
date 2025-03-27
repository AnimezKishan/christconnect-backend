const express = require('express');
const router = express.Router();
const { handleCreatePost, handleGetAllPosts, handleDeletePost } = require('../controllers/postController');
router.get('/', (req, res) => {
    res.send('Post API route');
})

router.post('/create', handleCreatePost);
router.get('/getAll', handleGetAllPosts);
router.delete('/delete', handleDeletePost);

module.exports = router;