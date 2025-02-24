const express = require('express');
const router = express.Router();
const { getMails, getAcademicMails, getOtherMails, getDepartmentMails } = require('../controllers/gmailController');

router.get('/', (req, res) => {
    res.send('Gmail API route');
})

router.get('/mails', getMails);
router.get('/academic', getAcademicMails);
router.get('/department', getDepartmentMails);
router.get('/others', getOtherMails);

module.exports = router;