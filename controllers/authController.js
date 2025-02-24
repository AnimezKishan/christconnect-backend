// const jwt = require('jsonwebtoken');
// const { createUser, getUser } = require('../models/User');
// const fetch = require('node-fetch');

// module.exports.googleOauth = async (req, res) => {
//     try {
//         // Get user data from Google OAuth
//         const userData = {
//             email: req.user.emails[0].value,
//             name: req.user.displayName,
//             photoURL: req.user.photos[0].value,
//             accessToken: req.user.accessToken
//         };

//         // Check if user exists in Firebase
//         let user = await getUser(userData.email);
        
//         if (!user) {
//             // Create new user if doesn't exist
//             await createUser(userData);
//             user = await getUser(userData.email);
//         }

//         // Create JWT token
//         const token = jwt.sign(
//             { 
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 accessToken: user.accessToken 
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '30d' }
//         );

//         res.json({
//             success: true,
//             token,
//             user: {
//                 email: user.email,
//                 name: user.name,
//                 photoURL: user.photoURL,
//                 isAdmin: user.isAdmin
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// const googleMobileAuth = async (req, res) => {
//     try {
//         const { accessToken } = req.body;
        
//         if (!accessToken) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'Access token is required' 
//             });
//         }

//         // Verify token with Google
//         const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//             headers: { Authorization: `Bearer ${accessToken}` }
//         });

//         if (!response.ok) {
//             return res.status(401).json({ 
//                 success: false, 
//                 error: 'Invalid access token' 
//             });
//         }

//         const googleData = await response.json();

//         // Prepare user data
//         const userData = {
//             email: googleData.email,
//             name: googleData.name,
//             photoURL: googleData.picture,
//             accessToken: accessToken
//         };

//         // Check if user exists in Firebase
//         let user = await getUser(userData.email);
        
//         if (!user) {
//             // Create new user if doesn't exist
//             await createUser(userData);
//             user = await getUser(userData.email);
//         }

//         // Create JWT token
//         const token = jwt.sign(
//             { 
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 accessToken: accessToken 
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '30d' }
//         );

//         res.json({
//             success: true,
//             token,
//             user: {
//                 email: user.email,
//                 name: user.name,
//                 photoURL: user.photoURL,
//                 isAdmin: user.isAdmin
//             }
//         });

//     } catch (error) {
//         console.error('Mobile auth error:', error);
//         res.status(500).json({ 
//             success: false, 
//             error: 'Authentication failed' 
//         });
//     }
// };

// module.exports = {
//     googleOauth,
//     googleMobileAuth
// };