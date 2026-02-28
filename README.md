# ✦ Crystalline v4 — Elemental Knowledge Puzzle

## 🆕 What's New in v4
- **Diagonal Matches** — gems now match in ↗ and ↘ directions too!
- **AI-Powered Questions** — OpenAI generates unique, never-repeated questions
- **Scaling AI Difficulty** — questions get harder every level (Novice → Master)
- **8 Topics** — Science, Math, History, Coding, Biology, Geography, Art, Space
- **Question Explanation** — AI explains the correct answer after each question
- **Live vs Cached badge** — shows whether questions came from AI or local fallback

---

## 📁 Project Structure
```
crystalline-v4/
├── server.js          ← Node.js backend (holds your API key securely)
├── env-loader.js      ← Reads your .env file
├── .env               ← YOUR API KEY GOES HERE (never commit this!)
├── .gitignore         ← Protects your .env from being uploaded
├── public/
│   ├── index.html     ← Game UI
│   └── game.js        ← Full game engine
└── README.md
```

---

## 🔑 Setting Up Your OpenAI API Key

1. Open the `.env` file in your project folder
2. Replace `sk-your-api-key-goes-here` with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-abc123...your-real-key
   ```
3. Save the file. **Never share this file or upload it to GitHub** — the `.gitignore` already protects it.

---

## 💻 Running the Game (VS Code)

### Step 1 — Make sure Node.js is installed
Download from: https://nodejs.org (choose the LTS version)

Verify it's installed:
```bash
node --version
```

### Step 2 — Open the project in VS Code
File → Open Folder → select `crystalline-v4`

### Step 3 — Open the terminal in VS Code
Terminal → New Terminal

### Step 4 — Start the server
```bash
node server.js
```

You should see:
```
✦ Crystalline Server Running ✦
Open game at:  http://localhost:3000
API key loaded: ✅ Yes
```

### Step 5 — Play!
Open your browser and go to: **http://localhost:3000**

> ⚠️ You must use `http://localhost:3000` — NOT Live Server or file:// this time!

---

## 🐙 Pushing to GitHub (safely)

The `.gitignore` already excludes your `.env` file, so your API key is protected.

```bash
git add .
git commit -m "Add AI questions, diagonal matching, v4"
git push
```

### What about GitHub Pages?
GitHub Pages only hosts static files — it can't run a Node.js server. For public hosting with a live server, use one of these free options:
- **Railway** → railway.app (easiest, free tier)
- **Render** → render.com (free tier)
- **Glitch** → glitch.com (free, great for students)

On any of these, set your `OPENAI_API_KEY` as an environment variable in their dashboard (never in the code itself).

---

## 🎮 How to Play

- **Click a gem** to select it
- **Click an adjacent gem** (including diagonal!) to swap
- Match **3+ gems** in a row — horizontal, vertical, or diagonal
- **Rune Gems ✦** appear as you score — match them to unlock AI quiz questions
- Answer correctly: **+bonus points & +2 moves**
- Answer wrong: **lose moves** (penalty increases each level!)
- Reach the target score before moves run out

### ⚗️ Elemental Reactions (big bonuses when matched together!)
| Combo | Effect | Bonus |
|-------|--------|-------|
| 🔥 + ❄️ | Melt! | +180 |
| 💧 + ⚡ | Shock! | +220 |
| ⚡ + 🔥 | Ignite! | +200 |
| 🌿 + 💧 | Absorb! | +160 |
| 🔥 + 🌿 | Wildfire! | +300 |
| 🔮 + anything | Phantom! | +250 |

---

## 🧠 Algorithms & Technical Features (for your writeup)

| Feature | Implementation |
|---------|---------------|
| Match Engine | Multi-direction scan: H + V + 2 diagonals, O(n²) per direction |
| Diagonal Matching | ↘ and ↗ directions with run-length extension |
| AI Question Gen | GPT-4o-mini via secure Node.js proxy, difficulty-prompted |
| Question Caching | Map-based cache prefetches next level in background |
| Fallback System | Built-in questions used when API unavailable |
| Chain Reactions | Directed graph adjacency lookup, BFS cascade |
| Physics | Spring-based gravity: `y += (target - y) * k` |
| Particle Engine | Velocity-Verlet with drag, gravity, and sparkle layers |
| AI Hint | Greedy O(n² × 8) swap simulation (includes diagonal swaps) |
| Combo Scoring | `base × (1 + 0.25(combo-1)) × (1 + 0.35(chain-1))` |

---

*Crystalline v4 — CPS 3500 Senior Game Project*
