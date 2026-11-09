const express = require('express');
const router = express.Router();

const {
    getPublishedExams,
    getPublishedExamById
} = require('../controllers/examController');

// Get All Published Exams
router.get('/', getPublishedExams);

// Get Single Published Exam with Questions
router.get('/:id', getPublishedExamById);

module.exports = router;