const express = require('express');
const router = express.Router();
const { handleCreatePost, handleGetAllPosts } = require('../controllers/postController');
router.get('/', (req, res) => {
    res.send('Post API route');
})

router.post('/create', handleCreatePost);
router.get('/getAll', handleGetAllPosts);

module.exports = router;