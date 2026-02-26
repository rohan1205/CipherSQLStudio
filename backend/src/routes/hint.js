const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { question, userQuery, tableName } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const prompt = `You are a SQL tutor helping a student learn SQL.

Assignment Question: ${question}
Table being used: ${tableName}
Student's current query: ${userQuery || 'No query written yet'}

Give a helpful hint to guide the student towards the correct answer.
IMPORTANT RULES:
- Do NOT give the full solution or the complete SQL query
- Give only 2-3 sentences of guidance
- Point them in the right direction without solving it for them
- Be encouraging and educational`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!hint) return res.status(500).json({ error: 'Failed to generate hint' });

    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: 'Hint generation failed' });
  }
});

module.exports = router;