const express = require('express');
const app = express();
const passport = require('passport');
const expressSession = require('express-session');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');
const gmailRoutes = require('./routes/gmail');
const postRoutes = require('./routes/post');
const deletionRoutes = require('./routes/deletion');
const axios = require('axios');

const cors = require("cors");
app.use(cors());

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
require('./configs/googleStrategy');

app.use('/auth', authRoutes);
app.use('/classroom', classroomRoutes);
app.use('/gmail', gmailRoutes);
app.use('/post', postRoutes);
app.use('/deletion', deletionRoutes);


app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.status(401).send('Not logged in');
    }
    res.send(req.user);
});

app.get('/mobile-auth', (req, res) => {
    res.render('mobile-auth');
});

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy');
})

app.get('/terms-of-use', (req, res) => {
    res.render('t-and-c');
})
app.get('/request-account-deletion', (req, res) => {
    res.render('account-deletion');
});

app.listen(3000);