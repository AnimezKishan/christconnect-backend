const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
    // takes two things, one is credentials and one is actions to perform.
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        accessType: 'offline',  // Request refresh token
        prompt: 'consent'       // Force consent screen to ensure refresh token
    }, (accessToken, refreshToken, profile, done)=>{
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        console.log(profile);

        done(null, profile); // it is a callback function whose first param is error and second is with you wanna proceed
    })
);

// making the data available
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})