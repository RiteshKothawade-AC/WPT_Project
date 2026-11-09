const express = require('express');
const router = express.Router();

const {
    registerStudent,
    loginUser,
    getProfile,
    updateProfile
} = require('../controllers/authController');

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

// Student Registration
router.post('/register', registerStudent);

// Student / Admin Login
router.post('/login', loginUser);

// Student Profile
router.get(
    '/profile',
    authenticateToken,
    authorizeRole('student'),
    getProfile
);

// Update Student Profile
router.put(
    '/profile',
    authenticateToken,
    authorizeRole('student'),
    updateProfile
);

module.exports = router;