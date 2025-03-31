const { saveDeletionRequest, getAllDeletionRequests } = require('../models/DeletionRequest');

/**
 * Handle account deletion request
 * @param {Object} req - Express request object with email in body
 * @param {Object} res - Express response object
 */
const handleDeletionRequest = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Save the deletion request
        const result = await saveDeletionRequest(email);
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Account deletion request received'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in deletion request handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get all deletion requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleGetAllDeletionRequests = async (req, res) => {
    try {
        const result = await getAllDeletionRequests();
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                requests: result.requests
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in get deletion requests handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    handleDeletionRequest,
    handleGetAllDeletionRequests
};