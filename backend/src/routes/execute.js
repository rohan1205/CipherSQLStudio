const express = require('express');
const router = express.Router();
const pool = require('../config/postgres');

// Allowed SQL keywords (SELECT only - no destructive queries)
const isQuerySafe = (query) => {
  const upper = query.trim().toUpperCase();
  const blocked = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE'];
  for (const keyword of blocked) {
    if (upper.includes(keyword)) return false;
  }
  if (!upper.startsWith('SELECT') && !upper.startsWith('WITH')) return false;
  return true;
};

router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query cannot be empty' });
  }

  if (!isQuerySafe(query)) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }

  try {
    const result = await pool.query(query);
    res.json({
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;