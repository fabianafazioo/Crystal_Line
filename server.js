// ================================================================
//  Crystalline v4 — Backend Server
//  Securely proxies OpenAI requests so your API key stays hidden
//  Run: node server.js
// ================================================================

const http    = require('http');
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const url     = require('url');

// ── CONFIG ───────────────────────────────────────────────────────────────────
// Put your OpenAI API key in a .env file as: OPENAI_API_KEY=sk-...
// OR paste it directly below (not recommended for shared projects)
require('./env-loader'); // simple env loader (no npm needed)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';
const PORT = 3000;

// ── MIME TYPES ───────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

// ── QUESTION CACHE (avoid duplicate calls) ───────────────────────────────────
const questionCache = new Map(); // key: "topic-level" → array of questions

// ── DIFFICULTY PROMPTS ───────────────────────────────────────────────────────
const DIFFICULTY_DESC = [
  'very easy, beginner level, simple definitions',
  'easy, introductory level',
  'medium difficulty, requires some knowledge',
  'hard, requires solid understanding',
  'very hard, expert level, tricky or nuanced',
];

// ── SERVER ────────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // ── CORS headers (allow browser to call this server) ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── API: Generate questions ──────────────────────────────────────────────
  if (parsed.pathname === '/api/questions' && req.method === 'GET') {
    const topic     = parsed.query.topic     || 'science';
    const level     = parseInt(parsed.query.level || '0');
    const count     = parseInt(parsed.query.count || '5');
    const topicName = parsed.query.topicName || topic;
    const cacheKey  = `${topic}-${level}`;

    // Return cached batch if available
    if (questionCache.has(cacheKey) && questionCache.get(cacheKey).length >= count) {
      const batch = questionCache.get(cacheKey).splice(0, count);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ questions: batch, source: 'cache' }));
      return;
    }

    // Generate fresh questions from OpenAI
    generateQuestions(topic, topicName, level, count + 5) // fetch extras for cache
      .then(questions => {
        // Cache the extras
        questionCache.set(cacheKey, questions.slice(count));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ questions: questions.slice(0, count), source: 'openai' }));
      })
      .catch(err => {
        console.error('OpenAI error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // ── SERVE STATIC FILES from /public ─────────────────────────────────────
  let filePath = path.join(__dirname, 'public',
    parsed.pathname === '/' ? 'index.html' : parsed.pathname);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404); res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

// ── OPENAI CALL ───────────────────────────────────────────────────────────────
function generateQuestions(topic, topicName, level, count) {
  const difficulty = DIFFICULTY_DESC[Math.min(level, DIFFICULTY_DESC.length - 1)];

  const prompt = `You are a quiz question generator for a puzzle game called Crystalline.

Generate exactly ${count} multiple-choice quiz questions about the topic: "${topicName}".

Difficulty level: ${difficulty} (this is level ${level + 1} of 5).

Rules:
- Each question must have exactly 4 answer choices labeled A, B, C, D
- Exactly one answer must be correct
- Questions must be unique and varied — no repeating the same concept
- Each question must have a short "abbreviation" (2-6 chars) like "DNA", "π", "WWI", "HTTP" that represents the topic of that specific question
- The abbreviation will appear on a gem in the game, so make it punchy and recognizable
- As difficulty increases, questions should be more nuanced, specific, and tricky
- For level 4-5: include trick questions, similar-sounding options, or advanced concepts

Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "abbr": "DNA",
    "q": "Full question text here?",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "answer": 0,
    "explanation": "Brief explanation of why the answer is correct"
  }
]

The "answer" field must be the 0-based index of the correct choice.`;

  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 2000,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const reqOpenAI = https.request(options, (resOpenAI) => {
      let data = '';
      resOpenAI.on('data', chunk => data += chunk);
      resOpenAI.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          const content = parsed.choices[0].message.content.trim();
          // Strip markdown code fences if present
          const cleaned = content.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
          const questions = JSON.parse(cleaned);
          if (!Array.isArray(questions)) throw new Error('Response is not an array');
          resolve(questions);
        } catch (e) {
          reject(new Error('Failed to parse OpenAI response: ' + e.message));
        }
      });
    });

    reqOpenAI.on('error', reject);
    reqOpenAI.write(body);
    reqOpenAI.end();
  });
}

server.listen(PORT, () => {
  console.log(`
  ✦ Crystalline Server Running ✦
  ─────────────────────────────
  Open game at:  http://localhost:${PORT}
  API endpoint:  http://localhost:${PORT}/api/questions
  
  API key loaded: ${OPENAI_API_KEY !== 'YOUR_API_KEY_HERE' ? '✅ Yes' : '❌ No — edit .env file!'}
  `);
});