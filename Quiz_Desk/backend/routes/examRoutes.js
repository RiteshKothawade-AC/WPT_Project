
const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

const db = require('../config/db');

// GET: Display all published exams
router.get('/', (req, res) => {

    const sql = `
        SELECT exam_id, title, description,
        duration_minutes, total_marks, passing_marks
        FROM exams
        WHERE status = 'published'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching exams'
            });
        }

        res.json(results);
    });
});
// GET: Display all exams for Admin
router.get(
    '/admin/all',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const sql = `
            SELECT *
            FROM exams
            ORDER BY exam_id DESC
        `;

        db.query(sql, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching exams'
                });
            }

            res.json(results);

        });

    }
);



// POST: Add a new exam
router.post('/', authenticateToken, authorizeRole('admin'), (req, res) => {

    const {
        title,
        description,
        duration_minutes,
        total_marks,
        passing_marks,
        status
    } = req.body;

    const created_by = req.user.user_id;

    if (
        !title ||
        !duration_minutes ||
        !total_marks ||
        passing_marks === undefined ||
        passing_marks === null
    ) {
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
        [
            title,
            description || null,
            duration_minutes,
            total_marks,
            passing_marks,
            status || 'draft',
            created_by
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error adding exam'
                });
            }

            res.status(201).json({
                message: 'Exam added successfully',
                exam_id: result.insertId
            });
        }
    );
});



// PUT: Update an existing exam
router.put('/:id', authenticateToken, authorizeRole('admin'), (req, res) => {    const { id } = req.params;

    const {
        title,
        description,
        duration_minutes,
        total_marks,
        passing_marks,
        status
    } = req.body;

    const sql = `
        UPDATE exams
        SET title = ?,
            description = ?,
            duration_minutes = ?,
            total_marks = ?,
            passing_marks = ?,
            status = ?
        WHERE exam_id = ?
    `;

    db.query(
        sql,
        [
            title,
            description || null,
            duration_minutes,
            total_marks,
            passing_marks,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error updating exam'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Exam not found'
                });
            }

            res.json({
                message: 'Exam updated successfully'
            });
        }
    );
});


// DELETE: Delete an exam
router.delete('/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM exams WHERE exam_id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error deleting exam. It may have student attempts.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        res.json({
            message: 'Exam deleted successfully'
        });
    });
});
// GET: Display all questions for Admin
router.get(
    '/admin/questions',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const sql = `
            SELECT
                q.question_id,
                q.exam_id,
                e.title AS exam_title,
                q.question_text,
                q.marks,
                q.question_order,
                o.option_id,
                o.option_text,
                o.is_correct
            FROM questions q
            JOIN exams e
                ON q.exam_id = e.exam_id
            LEFT JOIN options o
                ON q.question_id = o.question_id
            ORDER BY q.question_id, o.option_id
        `;

        db.query(sql, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching questions'
                });
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

    }
);
// POST: Add a new question
router.post(
    '/admin/questions',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const {
            exam_id,
            question_text,
            options
        } = req.body;

        if (
            !exam_id ||
            !question_text ||
            !Array.isArray(options) ||
            options.length !== 4 ||
            options.filter(option => option.is_correct).length !== 1
        ) {
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

            db.query(
                questionSql,
                [exam_id, question_text, 1, questionOrder],
                (err, questionResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error adding question'
                        });
                    }

                    const questionId = questionResult.insertId;

                    const optionSql = `
                        INSERT INTO options
                        (question_id, option_text, is_correct)
                        VALUES ?
                    `;

                    const optionValues = options.map(option => [
                        questionId,
                        option.option_text,
                        option.is_correct ? 1 : 0
                    ]);

                    db.query(optionSql, [optionValues], (err) => {

                        if (err) {
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

    }
);

// PUT: Update an existing question
router.put(
    '/admin/questions/:id',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const questionId = req.params.id;

        const {
            exam_id,
            question_text,
            options
        } = req.body;

        if (
            !exam_id ||
            !question_text ||
            !Array.isArray(options) ||
            options.length !== 4 ||
            options.filter(option => option.is_correct).length !== 1
        ) {
            return res.status(400).json({
                message: 'Please provide a question and four options with one correct answer'
            });
        }

        const questionSql = `
            UPDATE questions
            SET exam_id = ?, question_text = ?
            WHERE question_id = ?
        `;

        db.query(
            questionSql,
            [exam_id, question_text, questionId],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: 'Error updating question'
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: 'Question not found'
                    });
                }

                const deleteSql = `
                    DELETE FROM options
                    WHERE question_id = ?
                `;

                db.query(deleteSql, [questionId], (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error updating options'
                        });
                    }

                    const optionSql = `
                        INSERT INTO options
                        (question_id, option_text, is_correct)
                        VALUES ?
                    `;

                    const optionValues = options.map(option => [
                        questionId,
                        option.option_text,
                        option.is_correct ? 1 : 0
                    ]);

                    db.query(optionSql, [optionValues], (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: 'Error saving updated options'
                            });
                        }

                        res.json({
                            message: 'Question updated successfully'
                        });

                    });

                });

            }
        );

    }
);

// DELETE: Delete an existing question
router.delete(
    '/admin/questions/:id',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const questionId = req.params.id;

        // Check whether the question has student answers
        const checkSql = `
            SELECT COUNT(*) AS total
            FROM answers
            WHERE question_id = ?
        `;

        db.query(checkSql, [questionId], (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (results[0].total > 0) {
                return res.status(400).json({
                    message: 'Cannot delete a question that has student answers'
                });
            }

            // Delete its options first
            const optionSql = `
                DELETE FROM options
                WHERE question_id = ?
            `;

            db.query(optionSql, [questionId], (err) => {

                if (err) {
                    return res.status(500).json({
                        message: 'Error deleting options'
                    });
                }

                // Delete the question
                const questionSql = `
                    DELETE FROM questions
                    WHERE question_id = ?
                `;

                db.query(questionSql, [questionId], (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error deleting question'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: 'Question not found'
                        });
                    }

                    res.json({
                        message: 'Question deleted successfully'
                    });

                });

            });

        });

    }
);

// GET: View one exam with its questions and options
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const examSql = `
        SELECT exam_id, title, description,
        duration_minutes, total_marks, passing_marks
        FROM exams
        WHERE exam_id = ? AND status = 'published'
    `;

    db.query(examSql, [id], (err, exams) => {

        if (err) {
            return res.status(500).json({
                message: 'Error fetching exam'
            });
        }

        if (exams.length === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        const questionSql = `
            SELECT
                q.question_id,
                q.question_text,
                q.marks,
                o.option_id,
                o.option_text
            FROM questions q
            LEFT JOIN options o
                ON q.question_id = o.question_id
            WHERE q.exam_id = ?
            ORDER BY q.question_order, o.option_id
        `;

        db.query(questionSql, [id], (err, questions) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching questions'
                });
            }

            res.json({
                exam: exams[0],
                questions: questions
            });

        });

    });

});

 // POST: Student starts an exam
router.post(
    '/:id/start',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

        const examId = req.params.id;
        const userId = req.user.user_id;

        // Check whether the exam exists and is published
        const checkSql = `
            SELECT exam_id
            FROM exams
            WHERE exam_id = ? AND status = 'published'
        `;

        db.query(checkSql, [examId], (err, exams) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (exams.length === 0) {
                return res.status(404).json({
                    message: 'Exam not found or not available'
                });
            }

            // Create a new exam attempt
            const insertSql = `
                INSERT INTO attempts (exam_id, user_id)
                VALUES (?, ?)
            `;

            db.query(
                insertSql,
                [examId, userId],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Could not start exam'
                        });
                    }

                    res.status(201).json({
                        message: 'Exam started successfully',
                        attempt_id: result.insertId,
                        exam_id: examId
                    });

                }
            );

        });

    }
);


 // POST: Save a student's answer
router.post(
    '/:id/answer',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

        const attemptId = req.params.id;
        const { question_id, selected_option_id } = req.body;
        const userId = req.user.user_id;

        // Check whether this attempt belongs to the student
        const checkSql = `
            SELECT attempt_id
            FROM attempts
            WHERE attempt_id = ?
            AND user_id = ?
            AND status = 'in_progress'
        `;

        db.query(checkSql, [attemptId, userId], (err, attempts) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (attempts.length === 0) {
                return res.status(403).json({
                    message: 'Invalid or already submitted exam attempt'
                });
            }

            // Check whether the selected option belongs to the question
            const optionSql = `
                SELECT option_id
                FROM options
                WHERE option_id = ?
                AND question_id = ?
            `;

            db.query(
                optionSql,
                [selected_option_id, question_id],
                (err, options) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Database error'
                        });
                    }

                    if (options.length === 0) {
                        return res.status(400).json({
                            message: 'Invalid option for this question'
                        });
                    }

                    // Save or update the answer
                    const answerSql = `
                        INSERT INTO answers
                        (attempt_id, question_id, selected_option_id)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        selected_option_id = VALUES(selected_option_id)
                    `;

                    db.query(
                        answerSql,
                        [attemptId, question_id, selected_option_id],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    message: 'Could not save answer'
                                });
                            }

                            res.json({
                                message: 'Answer saved successfully'
                            });

                        }
                    );

                }
            );

        });

    }
);


 // POST: Submit exam and calculate result
router.post(
    '/:id/submit',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

        const attemptId = req.params.id;
        const userId = req.user.user_id;

        // Check whether the attempt belongs to the student
        const checkSql = `
            SELECT attempt_id, exam_id
            FROM attempts
            WHERE attempt_id = ?
            AND user_id = ?
            AND status = 'in_progress'
        `;

        db.query(checkSql, [attemptId, userId], (err, attempts) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (attempts.length === 0) {
                return res.status(403).json({
                    message: 'Invalid or already submitted attempt'
                });
            }

            const examId = attempts[0].exam_id;

            // Calculate marks using correct options
            const resultSql = `
                SELECT
                    COALESCE(SUM(
                        CASE
                            WHEN o.is_correct = TRUE THEN q.marks
                            ELSE 0
                        END
                    ), 0) AS obtained_marks,
                    COALESCE(SUM(q.marks), 0) AS total_marks
                FROM questions q
                LEFT JOIN answers a
                    ON q.question_id = a.question_id
                    AND a.attempt_id = ?
                LEFT JOIN options o
                    ON a.selected_option_id = o.option_id
                    AND o.question_id = q.question_id
                WHERE q.exam_id = ?
            `;

            db.query(
                resultSql,
                [attemptId, examId],
                (err, results) => {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error calculating result'
                        });
                    }

                    const obtainedMarks = results[0].obtained_marks;
                    const totalMarks = results[0].total_marks;

                    const percentage = totalMarks > 0
                        ? (obtainedMarks / totalMarks) * 100
                        : 0;

                    // Get passing marks
                    const examSql = `
                        SELECT passing_marks
                        FROM exams
                        WHERE exam_id = ?
                    `;

                    db.query(examSql, [examId], (err, exams) => {

                        if (err || exams.length === 0) {
                            return res.status(500).json({
                                message: 'Could not get exam details'
                            });
                        }

                        const resultStatus =
                            obtainedMarks >= exams[0].passing_marks
                                ? 'pass'
                                : 'fail';

                        // Save result and submit attempt
                        const saveSql = `
                            INSERT INTO results
                            (attempt_id, total_marks, obtained_marks,
                            percentage, result_status)
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        db.query(
                            saveSql,
                            [
                                attemptId,
                                totalMarks,
                                obtainedMarks,
                                percentage,
                                resultStatus
                            ],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: 'Could not save result'
                                    });
                                }

                                const updateSql = `
                                    UPDATE attempts
                                    SET status = 'submitted',
                                        submitted_at = CURRENT_TIMESTAMP
                                    WHERE attempt_id = ?
                                `;

                                db.query(updateSql, [attemptId], (err) => {

                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Result saved, but attempt update failed'
                                        });
                                    }

                                    res.json({
                                        message: 'Exam submitted successfully',
                                        total_marks: totalMarks,
                                        obtained_marks: obtainedMarks,
                                        percentage: Number(percentage.toFixed(2)),
                                        result_status: resultStatus
                                    });

                                });

                            }
                        );

                    });

                }
            );

        });

    }
);


// GET: View results of the logged-in student
router.get(
    '/student/my-results',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

        const userId = req.user.user_id;

        const sql = `
            SELECT
                results.result_id,
                exams.title,
                results.total_marks,
                results.obtained_marks,
                results.percentage,
                results.result_status,
                attempts.submitted_at
            FROM results
            JOIN attempts
                ON results.attempt_id = attempts.attempt_id
            JOIN exams
                ON attempts.exam_id = exams.exam_id
            WHERE attempts.user_id = ?
            ORDER BY attempts.submitted_at DESC
        `;

        db.query(sql, [userId], (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching student results'
                });
            }

            res.json({
                message: 'Results fetched successfully',
                results: results
            });

        });

    }
);

// GET: View exam history of the logged-in student
router.get(
    '/student/exam-history',
    authenticateToken,
    authorizeRole('student'),
    (req, res) => {

        const userId = req.user.user_id;

        const sql = `
            SELECT
                attempts.attempt_id,
                exams.title AS exam_title,
                attempts.started_at,
                attempts.submitted_at,
                exams.duration_minutes,
                exams.total_marks,
                CASE
                    WHEN attempts.status = 'submitted'
                    THEN 'Completed'
                    ELSE 'Incomplete'
                END AS attempt_status
            FROM attempts
            JOIN exams
                ON attempts.exam_id = exams.exam_id
            WHERE attempts.user_id = ?
            ORDER BY attempts.started_at DESC
        `;

        db.query(sql, [userId], (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching exam history'
                });
            }

            res.json({
                message: 'Exam history fetched successfully',
                results: results
            });

        });

    }
);

// GET: Admin dashboard statistics
router.get(
    '/admin/dashboard/stats',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {

        const statsSql = `
            SELECT
                (SELECT COUNT(*)
                 FROM users
                 WHERE role = 'student') AS total_students,

                (SELECT COUNT(*)
                 FROM exams) AS total_exams,

                (SELECT COUNT(*)
                 FROM questions) AS total_questions
        `;

        const recentExamsSql = `
            SELECT
                e.exam_id,
                e.title,
                e.duration_minutes,
                e.status,
                COUNT(q.question_id) AS question_count
            FROM exams e
            LEFT JOIN questions q
                ON e.exam_id = q.exam_id
            GROUP BY
                e.exam_id,
                e.title,
                e.duration_minutes,
                e.status,
                e.created_at
            ORDER BY e.created_at DESC
            LIMIT 3
        `;

        db.query(statsSql, (err, stats) => {

            if (err) {
                return res.status(500).json({
                    message: 'Error fetching dashboard statistics'
                });
            }

            db.query(recentExamsSql, (err, exams) => {

                if (err) {
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

    }
);

// GET: View all student exam results by Admin
router.get(
    '/admin/results',
    authenticateToken,
    authorizeRole('admin'),
    (req, res) => {
        const sql = `
            SELECT
                r.result_id,
                u.full_name,
                u.student_code,
                e.title AS exam_title,
                r.obtained_marks,
                r.total_marks,
                r.percentage,
                r.result_status,
                r.evaluated_at
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
    }
);

module.exports = router;
