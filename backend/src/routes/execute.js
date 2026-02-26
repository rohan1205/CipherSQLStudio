const express = require('express');
const router = express.Router();
const pool = require('../config/postgres');

// Improved SQL safety validation
const isQuerySafe = (query) => {
  const cleaned = query.trim().toUpperCase();

  // Must start with SELECT or WITH
  if (!cleaned.startsWith('SELECT') && !cleaned.startsWith('WITH')) {
    return false;
  }

  // Remove trailing semicolon (safe)
  const singleStatement = cleaned.replace(/;$/, '');

  // Block multiple statements (more than one semicolon)
  if (singleStatement.includes(';')) {
    return false;
  }

  // Block destructive keywords
  const blockedKeywords = [
    'DROP ',
    'DELETE ',
    'INSERT ',
    'UPDATE ',
    'CREATE ',
    'ALTER ',
    'TRUNCATE ',
    'GRANT ',
    'REVOKE '
  ];

  return !blockedKeywords.some(keyword =>
    singleStatement.includes(keyword)
  );
};

router.post('/', async (req, res) => {
  const { query, expectedColumns } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query cannot be empty' });
  }

  if (!isQuerySafe(query)) {
    return res.status(403).json({
      error: 'Only safe SELECT queries are allowed'
    });
  }

  try {
    // Remove trailing semicolon before execution
    const sanitizedQuery = query.trim().replace(/;$/, '');

    const result = await pool.query(sanitizedQuery);

    const returnedColumns = result.fields.map(f => f.name);

    // Optional correctness validation
    let isCorrect = false;
    if (expectedColumns && Array.isArray(expectedColumns)) {
      isCorrect =
        expectedColumns.length === returnedColumns.length &&
        expectedColumns.every(col =>
          returnedColumns.includes(col)
        );
    }

    res.json({
      columns: returnedColumns,
      rows: result.rows,
      rowCount: result.rowCount,
      isCorrect
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;