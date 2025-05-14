const express = require('express');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    load_id TEXT UNIQUE NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL
  );
`).then(() => console.log("✅ Shipments table ensured")).catch(console.error);

// Auto-generate load_id
function generateLoadID() {
  return 'LD' + Date.now().toString().slice(-6);
}

// Get all shipments
app.get('/api/shipments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shipments ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching shipments' });
  }
});

// Add shipment
app.post('/api/shipments', async (req, res) => {
  const { origin, destination, status } = req.body;
  const load_id = generateLoadID();

  try {
    await pool.query(
      'INSERT INTO shipments (load_id, origin, destination, status) VALUES ($1, $2, $3, $4)',
      [load_id, origin, destination, status]
    );
    res.json({ message: 'Shipment added' });
  } catch (err) {
    console.error('Error adding load:', err);
    res.status(500).json({ error: 'Error adding load' });
  }
});

// Delete shipment
app.delete('/api/shipments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM shipments WHERE id = $1', [id]);
    res.json({ message: 'Shipment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting shipment' });
  }
});

// Edit shipment
app.put('/api/shipments/:id', async (req, res) => {
  const { id } = req.params;
  const { origin, destination, status } = req.body;
  try {
    await pool.query(
      'UPDATE shipments SET origin = $1, destination = $2, status = $3 WHERE id = $4',
      [origin, destination, status, id]
    );
    res.json({ message: 'Shipment updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating shipment' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚚 Server running at http://localhost:${PORT}`);
});
