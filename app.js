const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /assignments - Create a new assignment
app.post('/assignments', async (req, res) => {
  const { title, deadline } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *',
      [title, deadline]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /assignments - Return all assignments (newest first), with optional ?submitted=true filter
app.get('/assignments', async (req, res) => {
  try {
    let result;
    if (req.query.submitted !== undefined) {
      const submittedVal = req.query.submitted === 'true';
      result = await pool.query(
        'SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC',
        [submittedVal]
      );
    } else {
      result = await pool.query('SELECT * FROM assignments ORDER BY id DESC');
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
