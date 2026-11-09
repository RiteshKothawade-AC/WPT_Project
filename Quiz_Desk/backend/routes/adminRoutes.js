const express = require('express');
const router = express.Router();

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

const {
    getAllStudents,
    updateStudent,
    deactivateStudent,
    addStudent,
    getAllExams,
    addExam,
    updateExam,
    deleteExam,
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getDashboardStats,
    getAllResults
} = require('../controllers/adminController');

// Admin authentication middleware
const adminOnly = [
    authenticateToken,
    authorizeRole('admin')
];

// Student Management
router.get('/auth/admin/students', ...adminOnly, getAllStudents);
router.post('/auth/admin/students', ...adminOnly, addStudent);
router.put('/auth/admin/students/:id', ...adminOnly, updateStudent);
router.delete('/auth/admin/students/:id', ...adminOnly, deactivateStudent);

// Exam Management
router.get('/exams/admin/all', ...adminOnly, getAllExams);
router.post('/exams', ...adminOnly, addExam);
router.put('/exams/:id', ...adminOnly, updateExam);
router.delete('/exams/:id', ...adminOnly, deleteExam);

// Question Management
router.get('/exams/admin/questions', ...adminOnly, getAllQuestions);
router.post('/exams/admin/questions', ...adminOnly, addQuestion);
router.put('/exams/admin/questions/:id', ...adminOnly, updateQuestion);
router.delete('/exams/admin/questions/:id', ...adminOnly, deleteQuestion);

// Dashboard
router.get(
    '/exams/admin/dashboard/stats',
    ...adminOnly,
    getDashboardStats
);

// Results
router.get('/exams/admin/results', ...adminOnly, getAllResults);

module.exports = router;