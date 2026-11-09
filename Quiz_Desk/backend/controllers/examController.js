const db = require('../config/db');

// GET: Display all published exams
const getPublishedExams = (req, res) => {
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
};

// GET: View one published exam with its questions and options
const getPublishedExamById = (req, res) => {
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
            LEFT JOIN options o ON q.question_id = o.question_id
            WHERE q.exam_id = ?
            ORDER BY q.question_order, o.option_id
        `;

        db.query(questionSql, [id], (questionErr, questions) => {
            if (questionErr) {
                return res.status(500).json({
                    message: 'Error fetching questions'
                });
            }

            res.json({
                exam: exams[0],
                questions
            });
        });
    });
};

module.exports = {
    getPublishedExams,
    getPublishedExamById
};
