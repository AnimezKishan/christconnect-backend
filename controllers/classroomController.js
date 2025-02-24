// /controllers/classroomController.js
const { google } = require('googleapis');

const getCourses = async (req, res) => {
    try {
        // console.log(req.user);
        // Ensure the user is authenticated
        if (!req.user || !req.user.accessToken) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: req.user.accessToken });

        // Initialize Google Classroom API
        const classroom = google.classroom({ version: 'v1', auth });

        // Fetch courses
        const response = await classroom.courses.list();
        const courses = response.data.courses;

        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

const getCourseAnnouncements = async (req, res) => {
    try {
        if (!req.user || !req.user.accessToken) {
            return res.status(401).json({ message: 'Unauthorized: Please log in first.' });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: req.user.accessToken });

        const tokenInfo = await oauth2Client.getTokenInfo(req.user.accessToken);
        console.log('Token Scopes:', tokenInfo.scopes);

        const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
        const response = await classroom.courses.announcements.list({
            courseId: req.params.courseID,
        });

        res.status(200).json({ success: true, data: response.data.announcements });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements.' });
    }
};

const getRecentAnnouncements = async (req, res) => {
    try {

        const accessToken = req.headers.authorization?.split(" ")[1];

        // if (!req.user || !req.user.accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Google Classroom API
        const classroom = google.classroom({ version: 'v1', auth });

        // First, get all courses
        const coursesResponse = await classroom.courses.list({
            courseStates: ['ACTIVE']  // Only get active courses
        });
        const courses = coursesResponse.data.courses || [];

        // Fetch announcements from all courses
        const allAnnouncements = [];
        await Promise.all(courses.map(async (course) => {
            try {
                const announcementsResponse = await classroom.courses.announcements.list({
                    courseId: course.id,
                    orderBy: 'updateTime desc',  // Get newest first
                    pageSize: 10  // Limit per course to avoid too many requests
                });
                
                const announcements = announcementsResponse.data.announcements || [];
                announcements.forEach(announcement => {
                    allAnnouncements.push({
                        ...announcement,
                        courseName: course.name,
                        courseId: course.id
                    });
                });
            } catch (error) {
                console.error(`Error fetching announcements for course ${course.id}:`, error);
            }
        }));

        // Sort all announcements by creation time
        allAnnouncements.sort((a, b) => {
            return new Date(b.creationTime) - new Date(a.creationTime);
        });

        // Optional: Implement pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedAnnouncements = allAnnouncements.slice(startIndex, endIndex);
        
        res.status(200).json({
            announcements: paginatedAnnouncements,
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: allAnnouncements.length,
                hasNextPage: endIndex < allAnnouncements.length
            }
        });

    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

const getRecentCoursework = async (req, res) => {
    try {

        const accessToken = req.headers.authorization?.split(" ")[1];
        // console.log("recent route token: ", accessToken);
        // if (!req.user || !req.user.accessToken) {
        //     return res.status(401).json({ error: 'User not authenticated' });
        // }

        // Configure OAuth2 client with the access token
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken ?? req.user.accessToken });

        // Initialize Google Classroom API
        const classroom = google.classroom({ version: 'v1', auth });

        // First, get all courses
        const coursesResponse = await classroom.courses.list({
            courseStates: ['ACTIVE']  // Only get active courses
        });
        const courses = coursesResponse.data.courses || [];

        // Fetch coursework from all courses
        const allCoursework = [];
        await Promise.all(courses.map(async (course) => {
            try {
                const courseworkResponse = await classroom.courses.courseWork.list({
                    courseId: course.id,
                    orderBy: 'updateTime desc',  // Get newest first
                    pageSize: 10  // Limit per course to avoid too many requests
                });
                
                const coursework = courseworkResponse.data.courseWork || [];
                coursework.forEach(work => {
                    allCoursework.push({
                        ...work,
                        courseName: course.name,
                        courseId: course.id
                    });
                });
            } catch (error) {
                console.error(`Error fetching coursework for course ${course.id}:`, error);
            }
        }));

        // Sort all coursework by creation time
        allCoursework.sort((a, b) => {
            return new Date(b.creationTime) - new Date(a.creationTime);
        });

        // Implement pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedCoursework = allCoursework.slice(startIndex, endIndex);
        
        res.status(200).json({
            coursework: paginatedCoursework,
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: allCoursework.length,
                hasNextPage: endIndex < allCoursework.length
            }
        });

    } catch (error) {
        console.error('Error fetching coursework:', error);
        res.status(500).json({ error: 'Failed to fetch coursework' });
    }
};

module.exports = {
    getCourses,
    getCourseAnnouncements,
    getRecentAnnouncements,
    getRecentCoursework
};
