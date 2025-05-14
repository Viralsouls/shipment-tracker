const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const generateLoadID = () => `LD${Date.now()}`;

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shipments ORDER BY id DESC');
    res.render('index', { shipments: result.rows });
  } catch (err) {
    res.status(500).send('Error loading shipments');
  }
});

app.post('/add-load', async (req, res) => {
  const { origin, destination, status } = req.body;
  const load_id = generateLoadID();
  try {
    await pool.query(
      'INSERT INTO shipments (load_id, origin, destination, status) VALUES ($1, $2, $3, $4)',
      [load_id, origin, destination, status]
    );
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error adding load');
  }
});

app.post('/edit-load', async (req, res) => {
  const { id, origin, destination, status } = req.body;
  try {
    await pool.query(
      'UPDATE shipments SET origin=$1, destination=$2, status=$3 WHERE id=$4',
      [origin, destination, status, id]
    );
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error editing load');
  }
});

app.post('/delete-load', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM shipments WHERE id=$1', [id]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting load');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
