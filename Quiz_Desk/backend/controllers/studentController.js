const db = require('../config/db');

// POST: Student starts an exam
const startExam = (req, res) => {
    const examId = req.params.id;
    const userId = req.user.user_id;

    const checkSql = `
        SELECT exam_id
        FROM exams
        WHERE exam_id = ? AND status = 'published'
    `;

    db.query(checkSql, [examId], (err, exams) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (exams.length === 0) {
            return res.status(404).json({
                message: 'Exam not found or not available'
            });
        }

        const insertSql = `
            INSERT INTO attempts (exam_id, user_id)
            VALUES (?, ?)
        `;

        db.query(insertSql, [examId, userId], (insertErr, result) => {
            if (insertErr) {
                return res.status(500).json({
                    message: 'Could not start exam'
                });
            }

            res.status(201).json({
                message: 'Exam started successfully',
                attempt_id: result.insertId,
                exam_id: examId
            });
        });
    });
};

// POST: Save a student's answer
const saveAnswer = (req, res) => {
    const attemptId = req.params.id;
    const { question_id, selected_option_id } = req.body;
    const userId = req.user.user_id;

    if (!question_id || !selected_option_id) {
        return res.status(400).json({
            message: 'Question and selected option are required'
        });
    }

    const checkSql = `
        SELECT attempt_id
        FROM attempts
        WHERE attempt_id = ?
        AND user_id = ?
        AND status = 'in_progress'
    `;

    db.query(checkSql, [attemptId, userId], (err, attempts) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (attempts.length === 0) {
            return res.status(403).json({
                message: 'Invalid or already submitted exam attempt'
            });
        }

        const optionSql = `
            SELECT option_id
            FROM options
            WHERE option_id = ? AND question_id = ?
        `;

        db.query(optionSql, [selected_option_id, question_id], (optionErr, options) => {
            if (optionErr) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (options.length === 0) {
                return res.status(400).json({
                    message: 'Invalid option for this question'
                });
            }

            const answerSql = `
                INSERT INTO answers (attempt_id, question_id, selected_option_id)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                selected_option_id = VALUES(selected_option_id)
            `;

            db.query(
                answerSql,
                [attemptId, question_id, selected_option_id],
                (answerErr) => {
                    if (answerErr) {
                        return res.status(500).json({
                            message: 'Could not save answer'
                        });
                    }

                    res.json({ message: 'Answer saved successfully' });
                }
            );
        });
    });
};

// POST: Submit exam and calculate result
const submitExam = (req, res) => {
    const attemptId = req.params.id;
    const userId = req.user.user_id;

    const checkSql = `
        SELECT attempt_id, exam_id
        FROM attempts
        WHERE attempt_id = ?
        AND user_id = ?
        AND status = 'in_progress'
    `;

    db.query(checkSql, [attemptId, userId], (err, attempts) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (attempts.length === 0) {
            return res.status(403).json({
                message: 'Invalid or already submitted attempt'
            });
        }

        const examId = attempts[0].exam_id;

        const resultSql = `
            SELECT
                COALESCE(SUM(
                    CASE WHEN o.is_correct = TRUE THEN q.marks ELSE 0 END
                ), 0) AS obtained_marks,
                COALESCE(SUM(q.marks), 0) AS total_marks
            FROM questions q
            LEFT JOIN answers a
                ON q.question_id = a.question_id AND a.attempt_id = ?
            LEFT JOIN options o
                ON a.selected_option_id = o.option_id
                AND o.question_id = q.question_id
            WHERE q.exam_id = ?
        `;

        db.query(resultSql, [attemptId, examId], (resultErr, results) => {
            if (resultErr) {
                return res.status(500).json({
                    message: 'Error calculating result'
                });
            }

            const obtainedMarks = Number(results[0].obtained_marks);
            const totalMarks = Number(results[0].total_marks);
            const percentage = totalMarks > 0
                ? (obtainedMarks / totalMarks) * 100
                : 0;

            const examSql = `
                SELECT passing_marks
                FROM exams
                WHERE exam_id = ?
            `;

            db.query(examSql, [examId], (examErr, exams) => {
                if (examErr || exams.length === 0) {
                    return res.status(500).json({
                        message: 'Could not get exam details'
                    });
                }

                const resultStatus = obtainedMarks >= exams[0].passing_marks
                    ? 'pass'
                    : 'fail';

                const saveSql = `
                    INSERT INTO results
                    (attempt_id, total_marks, obtained_marks, percentage, result_status)
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    saveSql,
                    [attemptId, totalMarks, obtainedMarks, percentage, resultStatus],
                    (saveErr) => {
                        if (saveErr) {
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

                        db.query(updateSql, [attemptId], (updateErr) => {
                            if (updateErr) {
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
        });
    });
};

// GET: View results of logged-in student
const getMyResults = (req, res) => {
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
        JOIN attempts ON results.attempt_id = attempts.attempt_id
        JOIN exams ON attempts.exam_id = exams.exam_id
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
            results
        });
    });
};

// GET: View exam history of logged-in student
const getExamHistory = (req, res) => {
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
                WHEN attempts.status = 'submitted' THEN 'Completed'
                ELSE 'Incomplete'
            END AS attempt_status
        FROM attempts
        JOIN exams ON attempts.exam_id = exams.exam_id
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
            results
        });
    });
};

// GET: View submitted exam answers with correct answers
const getResultReview = (req, res) => {
    const resultId = req.params.resultId;
    const userId = req.user.user_id;

    // Check whether this result belongs to logged-in student
    const checkSql = `
        SELECT
            results.result_id,
            attempts.attempt_id,
            attempts.exam_id
        FROM results
        JOIN attempts
            ON results.attempt_id = attempts.attempt_id
        WHERE results.result_id = ?
        AND attempts.user_id = ?
        AND attempts.status = 'submitted'
    `;

    db.query(checkSql, [resultId, userId], (err, resultRows) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (resultRows.length === 0) {
            return res.status(404).json({
                message: 'Result not found'
            });
        }

        const attemptId = resultRows[0].attempt_id;
        const examId = resultRows[0].exam_id;

        // Fetch questions, selected answers and correct answers
        const reviewSql = `
            SELECT
                q.question_id,
                q.question_text,
                q.marks,

                a.selected_option_id,

                selected.option_text AS selected_answer,

                correct.option_text AS correct_answer,

                CASE
                    WHEN a.selected_option_id IS NULL
                        THEN 'not_attempted'
                    WHEN selected.is_correct = TRUE
                        THEN 'correct'
                    ELSE 'wrong'
                END AS answer_status

            FROM questions q

            LEFT JOIN answers a
                ON q.question_id = a.question_id
                AND a.attempt_id = ?

            LEFT JOIN options selected
                ON a.selected_option_id = selected.option_id
                AND selected.question_id = q.question_id

            LEFT JOIN options correct
                ON correct.question_id = q.question_id
                AND correct.is_correct = TRUE

            WHERE q.exam_id = ?

            ORDER BY q.question_order
        `;

        db.query(
            reviewSql,
            [attemptId, examId],
            (reviewErr, answers) => {
                if (reviewErr) {
                    return res.status(500).json({
                        message: 'Error fetching answer review'
                    });
                }

                res.json({
                    message: 'Answer review fetched successfully',
                    answers
                });
            }
        );
    });
};

module.exports = {
    startExam,
    saveAnswer,
    submitExam,
    getMyResults,
    getExamHistory,
    getResultReview
};
