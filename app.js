const express = require('express');
const app = express();
const passport = require('passport');
const expressSession = require('express-session');
const db = require('./configs/db');
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classroom');
const gmailRoutes = require('./routes/gmail');
const axios = require('axios');
const { getRecentCoursework } = require('./controllers/classroomController')
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

db();

require('./configs/googleStrategy');

app.use('/auth', authRoutes);
app.use('/classroom', classroomRoutes);
app.use('/gmail', gmailRoutes);


app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.get('/test1', async (req, res) => {
    try {
        // Extract accessToken from different possible sources
        const accessToken = process.env.ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(400).json({ error: "Access Token is required" });
        }

        const response = await axios.get(`http://localhost:3000/classroom/courses/recentCourseworks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.send(response.data);

        // // Extract accessToken from different possible sources
        // const accessToken = req.body.accessToken || req.query.accessToken || req.headers.authorization?.split(" ")[1];

        // if (!accessToken) {
        //     return res.status(400).json({ error: "Access Token is required" });
        // }

        // // Call getRecentCoursework with accessToken
        // req.body.accessToken = accessToken; // Ensure it's available in req.body
        // await getRecentCoursework(req, res);
        
    } catch (error) {
        console.error("Error in /test route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/test2', async (req, res) => {
    try {
        // Extract accessToken from different possible sources
        const accessToken = process.env.ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(400).json({ error: "Access Token is required" });
        }

        const response = await axios.get(`http://localhost:3000/classroom/courses/recentAnnouncements`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.send(response.data);

        // // Extract accessToken from different possible sources
        // const accessToken = req.body.accessToken || req.query.accessToken || req.headers.authorization?.split(" ")[1];

        // if (!accessToken) {
        //     return res.status(400).json({ error: "Access Token is required" });
        // }

        // // Call getRecentCoursework with accessToken
        // req.body.accessToken = accessToken; // Ensure it's available in req.body
        // await getRecentCoursework(req, res);
        
    } catch (error) {
        console.error("Error in /test route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/test3', async (req, res) => {
    try {
      const LOCAL_IP = "localhost"; // Replace with your actual IP
      const selectedFilter = "Department"
      const baseUrl =
        selectedFilter === "All"
          ? `http://localhost:3000/gmail/mails`
          : selectedFilter === "Department" 
          ? `http://${LOCAL_IP}:3000/gmail/department`
          : selectedFilter === "External"
          ? `http://${LOCAL_IP}:3000/gmail/others`
          : selectedFilter === "Classroom"
          ? `http://${LOCAL_IP}:3000/gmail/academic`
          : ``; // firebase important mails api

      const accessToken = process.env.ACCESS_TOKEN;
      
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      res.send(response.data);
    } catch (error) {
        console.log(error);
    }
})


app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.status(401).send('Not logged in');
    }
    res.send(req.user);
});

app.listen(3000);