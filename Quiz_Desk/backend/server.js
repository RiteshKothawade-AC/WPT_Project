
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const examRoutes = require('./routes/examRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('QuizDesk Backend is Running!');
});

// Test database connection
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 AS result', (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Database query failed',
        error: err.message
      });
    }

    res.json({
      message: 'MySQL is working with QuizDesk!',
      data: results
    });
  });
});

const PORT = process.env.PORT || 5000;

app.use('/api/exams', examRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
