const express = require('express');
const router = express.Router();
const { handleDeletionRequest, handleGetAllDeletionRequests } = require('../controllers/deletionController');

// Route to handle account deletion requests
router.post('/request', handleDeletionRequest);

// Route to get all deletion requests (admin only)
router.get('/requests', handleGetAllDeletionRequests);

module.exports = router;