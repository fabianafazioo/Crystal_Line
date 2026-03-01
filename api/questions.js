const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { topic, topicName, level, count } = req.query;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // ← Vercel injects this

  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'API key not configured on server' });
    return;
  }

  const difficulty = [
    'very easy, simple definitions',
    'easy, basic familiarity needed',
    'medium, requires real understanding',
    'hard, tricky similar-sounding options',
    'very hard, expert level, nuanced',
  ][parseInt(level)] || 'medium';

  const prompt = `Generate exactly ${count || 6} multiple-choice quiz questions about "${topicName || topic}".
Difficulty: ${difficulty} (Level ${parseInt(level)+1} of 5).
Rules: 4 choices each, one correct answer, varied sub-topics, short "abbr" (2-6 chars) per question.
Respond ONLY with a JSON array, no markdown:
[{"abbr":"XYZ","q":"Question?","choices":["A","B","C","D"],"answer":0,"explanation":"Why A is correct."}]`;

  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 2500,
  });

  try {
    const data = await callOpenAI(body, OPENAI_API_KEY);
    const content = data.choices[0].message.content.trim()
      .replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const questions = JSON.parse(content);
    res.status(200).json({ questions, source: 'openai' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

function callOpenAI(body, key) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}