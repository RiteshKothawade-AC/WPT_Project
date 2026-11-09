const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST: Student Registration
const registerStudent = (req, res) => {
    const { full_name, email, password, student_code, course } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    const checkSql = 'SELECT user_id FROM users WHERE email = ?';

    db.query(checkSql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                return res.status(500).json({
                    message: 'Password encryption failed'
                });
            }

            const insertSql = `
                INSERT INTO users
                (full_name, email, password_hash, role, student_code, course)
                VALUES (?, ?, ?, 'student', ?, ?)
            `;

            db.query(
                insertSql,
                [full_name, email, hashedPassword, student_code || null, course || null],
                (insertErr, result) => {
                    if (insertErr) {
                        return res.status(500).json({
                            message: 'Registration failed'
                        });
                    }

                    res.status(201).json({
                        message: 'Student registered successfully',
                        user_id: result.insertId
                    });
                }
            );
        });
    });
};

// POST: Login for Admin and Student
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Please enter email and password'
        });
    }

    const sql = `
        SELECT user_id, full_name, email, password_hash, role, status
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = results[0];

        if (user.status !== 'active') {
            return res.status(403).json({
                message: 'Your account is inactive'
            });
        }

        bcrypt.compare(password, user.password_hash, (compareErr, isMatch) => {
            if (compareErr) {
                return res.status(500).json({ message: 'Login failed' });
            }

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign(
                { user_id: user.user_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    });
};

// GET: Logged-in student's profile
const getProfile = (req, res) => {
    const userId = req.user.user_id;

    const sql = `
        SELECT user_id, full_name, email, student_code, course
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching profile'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: 'Profile fetched successfully',
            user: results[0]
        });
    });
};

// PUT: Update logged-in student's profile
const updateProfile = (req, res) => {
    const userId = req.user.user_id;
    const { full_name, email, course } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    const sql = `
        UPDATE users
        SET full_name = ?, email = ?, course = ?
        WHERE user_id = ?
    `;

    db.query(sql, [full_name, email, course || null, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'This email is already registered'
                });
            }

            return res.status(500).json({
                message: 'Error updating profile'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    });
};

module.exports = {
    registerStudent,
    loginUser,
    getProfile,
    updateProfile
};
