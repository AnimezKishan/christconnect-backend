const express = require('express');
const router = express.Router();
// const { googleOauth, googleMobileAuth, handleGoogleAuth, refreshGoogleToken } = require('../controllers/authController');
const passport = require('passport');
const { google } = require('googleapis');

router.get('/google', passport.authenticate('google', { 
    scope: [
        "profile", 
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.announcements.readonly',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    ],
    accessType: 'offline',
    prompt: 'consent'
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/google' }), (req, res) => {
    const accessToken = req.user.accessToken;
    console.log(accessToken);
    
    // Redirect to an intermediate webpage
    const redirectUrl = `https://christconnect-backend.onrender.com/mobile-auth?access_token=${accessToken}`;
    
    res.redirect(redirectUrl);
});

// Token refresh endpoint
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.CALLBACK_URL
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        
        res.json({
            access_token: credentials.access_token,
            expiry_date: credentials.expiry_date
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ error: 'Failed to refresh token' });
    }
});

// router.post('/google/mobile', googleMobileAuth);

module.exports = router;