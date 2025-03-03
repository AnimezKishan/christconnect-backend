// const jwt = require('jsonwebtoken');
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


const { google } = require('googleapis');
const { createUser, getUser } = require('../models/User');

// const googleMobileAuth = async (req, res) => {
//     try {
//         const { code } = req.body;

//         if (!code) {
//             return res.status(400).json({ error: 'Authorization code is required' });
//         }

//         const oauth2Client = new google.auth.OAuth2(
//             process.env.CLIENT_ID,
//             process.env.CLIENT_SECRET,
//             process.env.MOBILE_CALLBACK_URL
//         );

//         // Exchange authorization code for tokens
//         const { tokens } = await oauth2Client.getToken(code);
        
//         // Get user profile information
//         oauth2Client.setCredentials(tokens);
//         const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
//         const userInfo = await oauth2.userinfo.get();

//         // Construct profile object similar to passport profile
//         const googleProfile = {
//             id: userInfo.data.id,
//             displayName: userInfo.data.name,
//             emails: [{ value: userInfo.data.email }],
//             photos: [{ value: userInfo.data.picture }],
//             accessToken: tokens.access_token,
//             refreshToken: tokens.refresh_token
//         };

//         // Check if user exists in Firebase
//         let user = await getUser(userInfo.data.email);
        
//         if (!user) {
//             // Create new user if doesn't exist
//             const userData = {
//                 email: userInfo.data.email,
//                 name: userInfo.data.name,
//                 photoURL: userInfo.data.picture
//             };
            
//             await createUser(userData);
//             user = await getUser(userInfo.data.email);
//         }

//         res.json({
//             success: true,
//             googleProfile,
//             user
//         });
//     } catch (error) {
//         console.error('Mobile auth error:', error);
//         res.status(500).json({ error: 'Authentication failed' });
//     }
// };

// Create OAuth2 client
// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.CALLBACK_URL
// );

// // Define the required scopes
// const SCOPES = [
//   'email',
//   'profile',
//   'openid',
//   'https://www.googleapis.com/auth/classroom.courses.readonly',
//   'https://www.googleapis.com/auth/classroom.announcements.readonly',
//   'https://www.googleapis.com/auth/gmail.readonly',
//   'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
//   'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
// ];

// // Controller function to handle the Google OAuth callback
// const handleGoogleAuth = async (req, res) => {
//   try {
//     const { code } = req.body;

//     console.log('Received code:', code);
//     console.log('Client ID:', process.env.CLIENT_ID);
//     console.log('Callback URL:', process.env.CALLBACK_URL);

//     if (!code) {
//       return res.status(400).json({ error: 'Authorization code is required' });
//     }

//     // Configure token request with scopes
//     const { tokens } = await oauth2Client.getToken({
//       code: code,
//       scope: SCOPES.join(' ')
//     });

//     console.log('Received tokens:', { 
//       access_token: tokens.access_token ? 'present' : 'missing',
//       refresh_token: tokens.refresh_token ? 'present' : 'missing',
//       scope: tokens.scope
//     });

//     // Verify that we got all the necessary tokens
//     if (!tokens.access_token || !tokens.refresh_token) {
//       return res.status(400).json({ 
//         error: 'Failed to obtain required tokens',
//         tokenInfo: {
//           hasAccessToken: !!tokens.access_token,
//           hasRefreshToken: !!tokens.refresh_token
//         }
//       });
//     }

//     // Set credentials to oauth2Client (optional - if you need to make immediate API calls)
//     oauth2Client.setCredentials({
//       ...tokens,
//       scope: SCOPES.join(' ')
//     });

//     // Return the tokens to the client
//     res.json({
//       access_token: tokens.access_token,
//       refresh_token: tokens.refresh_token,
//       expiry_date: tokens.expiry_date,
//       scope: tokens.scope
//     });

//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to authenticate with Google',
//       details: error.message 
//     });
//   }
// };

// // Controller function to refresh tokens
// const refreshGoogleToken = async (req, res) => {
//   try {
//     const { refresh_token } = req.body;

//     if (!refresh_token) {
//       return res.status(400).json({ error: 'Refresh token is required' });
//     }

//     // Set the refresh token and scopes
//     oauth2Client.setCredentials({
//       refresh_token: refresh_token,
//       scope: SCOPES.join(' ')
//     });

//     // Get a new access token
//     const { credentials } = await oauth2Client.refreshAccessToken();

//     res.json({
//       access_token: credentials.access_token,
//       expiry_date: credentials.expiry_date,
//       scope: credentials.scope
//     });

//   } catch (error) {
//     console.error('Token Refresh Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to refresh token',
//       details: error.message 
//     });
//   }
// };

module.exports = {
  
};