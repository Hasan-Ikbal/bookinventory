const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'hasan',  // Replace with your database name
  password: 'Hasan.@123',  // Replace with your PostgreSQL password
  port: 5432,
});

pool.connect((err) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
    } else {
      console.log('Database connected successfully!');
    }
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
