const express = require('express');
const router = express.Router();
const passport = require('passport');
const { google } = require('googleapis');
const { handleGoogleAuth } = require('../controllers/authController');

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

router.post('/google/mobile', handleGoogleAuth);

module.exports = router;