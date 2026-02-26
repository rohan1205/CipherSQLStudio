const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { question, userQuery, tableName } = req.body;

    const fallbackHint = generateFallbackHint(question, tableName);

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({ hint: fallbackHint });
    }

    const prompt = `
You are a SQL tutor helping a student.

Question:
${question}

Table:
${tableName}

Student Query:
${userQuery || 'No query written yet'}

Rules:
- Do NOT give full SQL solution
- Only guidance
- Max 3 sentences
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openchat/openchat-7b:free',
        messages: [
          { role: 'system', content: 'You are a helpful SQL tutor.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();

    if (!response.ok || !data?.choices?.length) {
      console.log("LLM unavailable. Using fallback.");
      return res.json({ hint: fallbackHint });
    }

    const hint = data.choices[0].message.content;

    res.json({ hint });

  } catch (error) {
    console.log("LLM failed. Using fallback.");
    res.json({ hint: generateFallbackHint(req.body.question, req.body.tableName) });
  }
});


// 🔥 Smart deterministic fallback generator
function generateFallbackHint(question, tableName) {
  const lower = question.toLowerCase();

  if (lower.includes("greater than") || lower.includes(">")) {
    return `Try using a WHERE clause on the ${tableName} table with a comparison operator (>) to filter rows.`;
  }

  if (lower.includes("average") || lower.includes("avg")) {
    return `Consider using the AVG() aggregate function and GROUP BY to compute averages.`;
  }

  if (lower.includes("less than") || lower.includes("<")) {
    return `Use a WHERE clause with a less-than (<) condition to filter the rows properly.`;
  }

  if (lower.includes("count")) {
    return `You may need to use COUNT() along with GROUP BY depending on the requirement.`;
  }

  return `Think about which columns need filtering and whether you should use WHERE, GROUP BY, or an aggregate function.`;
}

module.exports = router;