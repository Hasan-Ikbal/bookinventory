const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');  // Import the database module
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));  // Serve the static files (HTML, CSS, JS)

// Add new book
app.post('/api/books', async (req, res) => {
  const { title, author, genre, publication_date, isbn } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO bookstable (title, author, genre, publication_date, isbn) VALUES ($1, $2, $3, $4, $5)',
      [title, author, genre, publication_date, isbn]
    );
    res.status(201).json({ message: 'Book added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add the book' });
  }
});

// Filter books
app.get('/api/books', async (req, res) => {
  const { title, author, genre } = req.query;
  let query = 'SELECT * FROM bookstable WHERE 1=1';
  const values = [];

  if (title) {
    query += ' AND title ILIKE $' + (values.length + 1);
    values.push(`%${title}%`);
  }
  if (author) {
    query += ' AND author ILIKE $' + (values.length + 1);
    values.push(`%${author}%`);
  }
  if (genre) {
    query += ' AND genre ILIKE $' + (values.length + 1);
    values.push(`%${genre}%`);
  }

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Export books to JSON
app.get('/api/books/export/json', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookstable');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export books' });
  }
});

// Export books to CSV
app.get('/api/books/export/csv', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookstable');
    const csv = result.rows.map(row => Object.values(row).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=books.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export books' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
