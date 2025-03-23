const { createUser, getUser } = require('../models/User');

/**
 * Handle Google authentication data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleGoogleAuth = async (req, res) => {
    try {
        // Get the raw data from the request body
        const { userData } = req.body;
        console.log('Received data:', userData);
        
        // Parse the data if it's a string
        let parsedUserData = userData;
        if (typeof userData === 'string') {
            try {
                parsedUserData = JSON.parse(userData);
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON data format'
                });
            }
        }

        console.log('\n\nParsed data:', parsedUserData);
        
        // Validate required fields
        if (!parsedUserData.email || !parsedUserData.id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required user data' 
            });
        }

        // Check if user exists
        const existingUser = await getUser(parsedUserData.email);
        
        if (existingUser) {
            // Return existing user data
            return res.status(200).json({
                success: true,
                message: 'User found',
                user: existingUser
            });
        } else {
            // Format user data for Firebase
            const newUserData = {
                email: parsedUserData.email,
                name: parsedUserData.name || `${parsedUserData.givenName} ${parsedUserData.familyName}`,
                photoURL: parsedUserData.photo,
                googleId: parsedUserData.id
            };
            
            // Create new user
            const created = await createUser(newUserData);
            
            if (created) {
                // Get the newly created user
                const newUser = await getUser(parsedUserData.email);
                
                return res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    user: newUser
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create user'
                });
            }
        }
    } catch (error) {
        console.error('Error in Google auth handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    handleGoogleAuth
};