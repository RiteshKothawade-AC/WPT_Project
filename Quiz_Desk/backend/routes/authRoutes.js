
const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

const db = require('../config/db');
const bcrypt = require('bcrypt');

// Student Registration API
router.post('/register', async (req, res) => {

    const { full_name, email, password, student_code, course } = req.body;

    // Check required fields
    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    try {

        // Check whether email already exists
        const checkSql = 'SELECT user_id FROM users WHERE email = ?';

        db.query(checkSql, [email], async (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: 'Email already registered'
                });
            }

            // Convert password into a secure hash
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert student into database
            const insertSql = `
                INSERT INTO users
                (full_name, email, password_hash, role, student_code, course)
                VALUES (?, ?, ?, 'student', ?, ?)
            `;

            db.query(
                insertSql,
                [
                    full_name,
                    email,
                    hashedPassword,
                    student_code || null,
                    course || null
                ],
                (err, result) => {

                    if (err) {
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

    } catch (error) {

        res.status(500).json({
            message: 'Something went wrong'
        });

    }

});


const jwt = require('jsonwebtoken');

// Student Login API
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message: 'Please enter email and password'
        });
    }

    // Find student by email
    const sql = `
        SELECT user_id, full_name, email, password_hash, role, status
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = results[0];

        // Check account status
        if (user.status !== 'active') {
            return res.status(403).json({
                message: 'Your account is inactive'
            });
        }

        // Compare entered password with saved hash
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send login response
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    });

});

// GET: View the logged-in student's profile
router.get(
    '/profile',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

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
                return res.status(404).json({
                    message: 'Student not found'
                });
            }

            res.json({
                message: 'Profile fetched successfully',
                user: results[0]
            });

        });

    }
);


// PUT: Update the logged-in student's profile
router.put(
    '/profile',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

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

        db.query(
            sql,
            [full_name, email, course || null, userId],
            (err, result) => {

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
                    return res.status(404).json({
                        message: 'Student not found'
                    });
                }

                res.json({
                    message: 'Profile updated successfully'
                });

            }
        );

    }
);

// GET: Display all students for Admin
router.get(
    '/admin/students',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const sql = `
            SELECT
                user_id,
                full_name,
                email,
                student_code,
                course,
                status
            FROM users
            WHERE role = 'student'
            ORDER BY user_id DESC
        `;

        db.query(sql, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching students'
                });
            }

            res.json(results);

        });

    }
);

// PUT: Update student details by Admin
router.put(
    '/admin/students/:id',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {
        const { name, email, studentId, course, status } = req.body;
        const studentIdFromUrl = req.params.id;

        const sql = `
            UPDATE users
            SET full_name = ?,
                email = ?,
                student_code = ?,
                course = ?,
                status = ?
            WHERE user_id = ?
            AND role = 'student'
        `;

        db.query(
            sql,
            [
                name,
                email,
                studentId,
                course,
                status.toLowerCase(),
                studentIdFromUrl
            ],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({
                            message: 'Email already exists'
                        });
                    }

                    return res.status(500).json({
                        message: 'Error updating student'
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: 'Student not found'
                    });
                }

                res.json({
                    message: 'Student updated successfully'
                });
            }
        );
    }
);

// DELETE: Deactivate student account by Admin
router.delete(
    '/admin/students/:id',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {
        const studentId = req.params.id;

        const sql = `
            UPDATE users
            SET status = 'inactive'
            WHERE user_id = ?
            AND role = 'student'
        `;

        db.query(sql, [studentId], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error deactivating student'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Student not found'
                });
            }

            res.json({
                message: 'Student deactivated successfully'
            });
        });
    }
);
// POST: Add new student by Admin
router.post(
    '/admin/students',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        const { name, email, studentId, course, password } = req.body;

        if (!name || !email || !studentId || !course || !password) {
            return res.status(400).json({
                message: 'Please fill all student details'
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users
                (full_name, email, password_hash, role, student_code, course, status)
                VALUES (?, ?, ?, 'student', ?, ?, 'active')
            `;

            db.query(
                sql,
                [name, email, hashedPassword, studentId, course],
                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({
                                message: 'Email or Student ID already exists'
                            });
                        }

                        console.log(err);
                        return res.status(500).json({
                            message: 'Error adding student'
                        });
                    }

                    res.status(201).json({
                        message: 'Student added successfully',
                        user_id: result.insertId
                    });
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error creating student'
            });
        }
    }
);

module.exports = router;
