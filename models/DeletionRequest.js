const { db } = require('../configs/firebase');

/**
 * Save a user's email who has requested account deletion
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Object with success status and message
 */
const saveDeletionRequest = async (email) => {
    try {
        if (!email) {
            return {
                success: false,
                message: 'Email is required'
            };
        }

        // Create a document with the email as the ID
        await db.collection('deletionRequests').doc(email).set({
            email: email,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        });

        return {
            success: true,
            message: 'Deletion request saved successfully'
        };
    } catch (error) {
        console.error('Error saving deletion request:', error);
        return {
            success: false,
            message: 'Error saving deletion request',
            error: error.message
        };
    }
};

/**
 * Get all deletion requests
 * @returns {Promise<Object>} - Object with success status and array of requests
 */
const getAllDeletionRequests = async () => {
    try {
        const requestsSnapshot = await db.collection('deletionRequests').get();
        
        if (requestsSnapshot.empty) {
            return {
                success: true,
                message: 'No deletion requests found',
                requests: []
            };
        }
        
        const requests = [];
        requestsSnapshot.forEach(doc => {
            requests.push(doc.data());
        });
        
        return {
            success: true,
            message: 'Deletion requests retrieved successfully',
            requests
        };
    } catch (error) {
        console.error('Error getting deletion requests:', error);
        return {
            success: false,
            message: 'Error retrieving deletion requests',
            error: error.message
        };
    }
};

module.exports = {
    saveDeletionRequest,
    getAllDeletionRequests
};