const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:dARMhxggLkanKczgWOsApobSIhnzPCtW@shortline.proxy.rlwy.net:54392/railway',
  ssl: { rejectUnauthorized: false } // Required for Railway SSL
});

module.exports = pool;