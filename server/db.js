const { Pool } = require('pg');

// Set up PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dARMhxggLkanKczgWOsApobSIhnzPCtW@postgres.railway.internal:5432/railway',
});

module.exports = pool;
