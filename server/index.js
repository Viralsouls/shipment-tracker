const express = require('express');
const path = require('path');
const { Pool } = require('pg');  // PostgreSQL client
const app = express();

// Set up PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dARMhxggLkanKczgWOsApobSIhnzPCtW@postgres.railway.internal:5432/railway',
});

// Serve static files (favicon, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fetch loads from PostgreSQL database and render the page
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loads');
    const loads = result.rows;
    res.render('index', { loads });
  } catch (err) {
    console.error(err);
    res.send('Error fetching loads');
  }
});

// Handle adding new loads
app.post('/add-load', async (req, res) => {
  const { origin, destination, status } = req.body;

  try {
    const load_id = await generateLoadId(); // Assuming this exists
    await db.query(
      'INSERT INTO shipments (load_id, origin, destination, status) VALUES ($1, $2, $3, $4)',
      [load_id, origin, destination, status]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new load:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
