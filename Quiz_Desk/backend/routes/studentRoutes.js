const express = require('express');
const router = express.Router();

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

const {
    startExam,
    saveAnswer,
    submitExam,
    getMyResults,
    getExamHistory,
    getResultReview
} = require('../controllers/studentController');

// Student authentication middleware
const studentOnly = [
    authenticateToken,
    authorizeRole('student')
];

// Start Exam
router.post('/:id/start', ...studentOnly, startExam);

// Save Answer
router.post('/:id/answer', ...studentOnly, saveAnswer);

// Submit Exam
router.post('/:id/submit', ...studentOnly, submitExam);

// Get Student Results
router.get('/student/my-results', ...studentOnly, getMyResults);

// Get Student Exam History
router.get('/student/exam-history', ...studentOnly, getExamHistory);

// View submitted exam answers
router.get(
    '/student/my-results/:resultId/review',
    ...studentOnly,
    getResultReview
);

module.exports = router;