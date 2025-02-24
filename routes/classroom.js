// /routes/classroom.js
const express = require('express');
const router = express.Router();
const { getCourses, getCourseAnnouncements, getRecentAnnouncements, getRecentCoursework } = require('../controllers/classroomController');

// Fetch user's Google Classroom courses
router.get('/courses', getCourses);
router.get('/courses/:courseID/announcements', getCourseAnnouncements);
router.get('/courses/recentAnnouncements', getRecentAnnouncements);
router.get('/courses/recentCourseworks', getRecentCoursework);

module.exports = router;
