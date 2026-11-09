const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET: Display all students for Admin
const getAllStudents = (req, res) => {
    const sql = `
        SELECT user_id, full_name, email, student_code, course, status
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
};

// PUT: Update student details by Admin
const updateStudent = (req, res) => {
    const { name, email, studentId, course, status } = req.body;
    const studentIdFromUrl = req.params.id;

    if (!name || !email || !studentId || !course || !status) {
        return res.status(400).json({
            message: 'Please provide all student details'
        });
    }

    const sql = `
        UPDATE users
        SET full_name = ?, email = ?, student_code = ?, course = ?, status = ?
        WHERE user_id = ? AND role = 'student'
    `;

    db.query(
        sql,
        [name, email, studentId, course, status.toLowerCase(), studentIdFromUrl],
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
                return res.status(404).json({ message: 'Student not found' });
            }

            res.json({ message: 'Student updated successfully' });
        }
    );
};

// DELETE: Deactivate student account by Admin
const deactivateStudent = (req, res) => {
    const studentId = req.params.id;

    const sql = `
        UPDATE users
        SET status = 'inactive'
        WHERE user_id = ? AND role = 'student'
    `;

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error deactivating student'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deactivated successfully' });
    });
};

// POST: Add new student by Admin
const addStudent = (req, res) => {
    const { name, email, studentId, course, password } = req.body;

    if (!name || !email || !studentId || !course || !password) {
        return res.status(400).json({
            message: 'Please fill all student details'
        });
    }

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
            return res.status(500).json({ message: 'Error creating student' });
        }

        const sql = `
            INSERT INTO users
            (full_name, email, password_hash, role, student_code, course, status)
            VALUES (?, ?, ?, 'student', ?, ?, 'active')
        `;

        db.query(sql, [name, email, hashedPassword, studentId, course], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        message: 'Email or Student ID already exists'
                    });
                }

                console.log(err);
                return res.status(500).json({ message: 'Error adding student' });
            }

            res.status(201).json({
                message: 'Student added successfully',
                user_id: result.insertId
            });
        });
    });
};

// GET: Display all exams for Admin
const getAllExams = (req, res) => {
    const sql = 'SELECT * FROM exams ORDER BY exam_id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching exams' });
        }
        res.json(results);
    });
};

// POST: Add a new exam
const addExam = (req, res) => {
    const {
        title, description, duration_minutes,
        total_marks, passing_marks, status
    } = req.body;

    const created_by = req.user.user_id;

    if (!title || !duration_minutes || !total_marks ||
        passing_marks === undefined || passing_marks === null) {
        return res.status(400).json({
            message: 'Please fill all required fields'
        });
    }

    const sql = `
        INSERT INTO exams
        (title, description, duration_minutes, total_marks,
         passing_marks, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description || null, duration_minutes, total_marks,
            passing_marks, status || 'draft', created_by],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error adding exam' });
            }

            res.status(201).json({
                message: 'Exam added successfully',
                exam_id: result.insertId
            });
        }
    );
};

// PUT: Update an existing exam
const updateExam = (req, res) => {
    const { id } = req.params;
    const {
        title, description, duration_minutes,
        total_marks, passing_marks, status
    } = req.body;

    const sql = `
        UPDATE exams
        SET title = ?, description = ?, duration_minutes = ?,
            total_marks = ?, passing_marks = ?, status = ?
        WHERE exam_id = ?
    `;

    db.query(
        sql,
        [title, description || null, duration_minutes,
            total_marks, passing_marks, status, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating exam' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Exam not found' });
            }

            res.json({ message: 'Exam updated successfully' });
        }
    );
};

// DELETE: Delete an exam
const deleteExam = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM exams WHERE exam_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error deleting exam. It may have student attempts.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json({ message: 'Exam deleted successfully' });
    });
};

// GET: Display all questions for Admin
const getAllQuestions = (req, res) => {
    const sql = `
        SELECT q.question_id, q.exam_id, e.title AS exam_title,
               q.question_text, q.marks, q.question_order,
               o.option_id, o.option_text, o.is_correct
        FROM questions q
        JOIN exams e ON q.exam_id = e.exam_id
        LEFT JOIN options o ON q.question_id = o.question_id
        ORDER BY q.question_id, o.option_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching questions' });
        }

        const questions = {};

        results.forEach((row) => {
            if (!questions[row.question_id]) {
                questions[row.question_id] = {
                    question_id: row.question_id,
                    exam_id: row.exam_id,
                    exam_title: row.exam_title,
                    question_text: row.question_text,
                    marks: row.marks,
                    question_order: row.question_order,
                    options: []
                };
            }

            if (row.option_id) {
                questions[row.question_id].options.push({
                    option_id: row.option_id,
                    option_text: row.option_text,
                    is_correct: row.is_correct
                });
            }
        });

        res.json(Object.values(questions));
    });
};

// POST: Add a new question
const addQuestion = (req, res) => {
    const { exam_id, question_text, options } = req.body;

    if (!exam_id || !question_text || !Array.isArray(options) ||
        options.length !== 4 ||
        options.filter(option => option.is_correct).length !== 1) {
        return res.status(400).json({
            message: 'Please provide a question and four options with one correct answer'
        });
    }

    const orderSql = `
        SELECT COUNT(*) AS total
        FROM questions
        WHERE exam_id = ?
    `;

    db.query(orderSql, [exam_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error checking question order'
            });
        }

        const questionOrder = result[0].total + 1;

        const questionSql = `
            INSERT INTO questions
            (exam_id, question_text, marks, question_order)
            VALUES (?, ?, ?, ?)
        `;

        db.query(questionSql, [exam_id, question_text, 1, questionOrder],
            (questionErr, questionResult) => {
                if (questionErr) {
                    return res.status(500).json({ message: 'Error adding question' });
                }

                const questionId = questionResult.insertId;
                const optionSql = `
                    INSERT INTO options (question_id, option_text, is_correct)
                    VALUES ?
                `;

                const optionValues = options.map(option => [
                    questionId, option.option_text, option.is_correct ? 1 : 0
                ]);

                db.query(optionSql, [optionValues], (optionErr) => {
                    if (optionErr) {
                        return res.status(500).json({
                            message: 'Question added, but options could not be saved'
                        });
                    }

                    res.status(201).json({
                        message: 'Question added successfully',
                        question_id: questionId
                    });
                });
            }
        );
    });
};

// PUT: Update an existing question
const updateQuestion = (req, res) => {
    const questionId = req.params.id;
    const { exam_id, question_text, options } = req.body;

    if (!exam_id || !question_text || !Array.isArray(options) ||
        options.length !== 4 ||
        options.filter(option => option.is_correct).length !== 1) {
        return res.status(400).json({
            message: 'Please provide a question and four options with one correct answer'
        });
    }

    const questionSql = `
        UPDATE questions
        SET exam_id = ?, question_text = ?
        WHERE question_id = ?
    `;

    db.query(questionSql, [exam_id, question_text, questionId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating question' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const deleteSql = 'DELETE FROM options WHERE question_id = ?';

        db.query(deleteSql, [questionId], (deleteErr) => {
            if (deleteErr) {
                return res.status(500).json({ message: 'Error updating options' });
            }

            const optionSql = `
                INSERT INTO options (question_id, option_text, is_correct)
                VALUES ?
            `;

            const optionValues = options.map(option => [
                questionId, option.option_text, option.is_correct ? 1 : 0
            ]);

            db.query(optionSql, [optionValues], (optionErr) => {
                if (optionErr) {
                    return res.status(500).json({
                        message: 'Error saving updated options'
                    });
                }

                res.json({ message: 'Question updated successfully' });
            });
        });
    });
};

// DELETE: Delete an existing question
const deleteQuestion = (req, res) => {
    const questionId = req.params.id;

    const checkSql = `
        SELECT COUNT(*) AS total
        FROM answers
        WHERE question_id = ?
    `;

    db.query(checkSql, [questionId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results[0].total > 0) {
            return res.status(400).json({
                message: 'Cannot delete a question that has student answers'
            });
        }

        const optionSql = 'DELETE FROM options WHERE question_id = ?';

        db.query(optionSql, [questionId], (optionErr) => {
            if (optionErr) {
                return res.status(500).json({ message: 'Error deleting options' });
            }

            const questionSql = 'DELETE FROM questions WHERE question_id = ?';

            db.query(questionSql, [questionId], (questionErr, result) => {
                if (questionErr) {
                    return res.status(500).json({ message: 'Error deleting question' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Question not found' });
                }

                res.json({ message: 'Question deleted successfully' });
            });
        });
    });
};

// GET: Admin dashboard statistics
const getDashboardStats = (req, res) => {
    const statsSql = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
            (SELECT COUNT(*) FROM exams) AS total_exams,
            (SELECT COUNT(*) FROM questions) AS total_questions
    `;

    const recentExamsSql = `
        SELECT e.exam_id, e.title, e.duration_minutes, e.status,
               COUNT(q.question_id) AS question_count
        FROM exams e
        LEFT JOIN questions q ON e.exam_id = q.exam_id
        GROUP BY e.exam_id, e.title, e.duration_minutes, e.status, e.created_at
        ORDER BY e.created_at DESC
        LIMIT 3
    `;

    db.query(statsSql, (err, stats) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching dashboard statistics'
            });
        }

        db.query(recentExamsSql, (examErr, exams) => {
            if (examErr) {
                return res.status(500).json({
                    message: 'Error fetching recent exams'
                });
            }

            res.json({
                message: 'Dashboard data fetched successfully',
                stats: stats[0],
                recentExams: exams
            });
        });
    });
};

// GET: View all student exam results by Admin
const getAllResults = (req, res) => {
    const sql = `
        SELECT r.result_id, u.full_name, u.student_code,
               e.title AS exam_title, r.obtained_marks, r.total_marks,
               r.percentage, r.result_status, r.evaluated_at
        FROM results r
        JOIN attempts a ON r.attempt_id = a.attempt_id
        JOIN users u ON a.user_id = u.user_id
        JOIN exams e ON a.exam_id = e.exam_id
        ORDER BY r.evaluated_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error fetching exam results'
            });
        }
        res.json(results);
    });
};

module.exports = {
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
};
