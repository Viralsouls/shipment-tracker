const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/shipments', (req, res) => {
  try {
    const shipments = db.prepare('SELECT * FROM shipments').all();
    res.json(shipments);
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-load', (req, res) => {
  const { origin, destination, status } = req.body;
  const loadId = 'LD' + Date.now();

  try {
    const stmt = db.prepare('INSERT INTO shipments (load_id, origin, destination, status) VALUES (?, ?, ?, ?)');
    stmt.run(loadId, origin, destination, status);
    res.status(201).json({ message: 'Load added successfully' });
  } catch (err) {
    console.error('Error adding load:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ EDIT load
app.put('/update-load/:id', (req, res) => {
  const { id } = req.params;
  const { origin, destination, status } = req.body;

  try {
    const stmt = db.prepare('UPDATE shipments SET origin = ?, destination = ?, status = ? WHERE id = ?');
    stmt.run(origin, destination, status, id);
    res.json({ message: 'Load updated successfully' });
  } catch (err) {
    console.error('Error updating load:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ❌ DELETE load
app.delete('/delete-load/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM shipments WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Load deleted successfully' });
  } catch (err) {
    console.error('Error deleting load:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
