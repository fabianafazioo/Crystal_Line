# ✦ Crystalline — Elemental Knowledge Puzzle
Live Demo: https://crystal-line.vercel.app

## 🆕 What's New 
- **Diagonal Matches** — gems now match in ↗ and ↘ directions too!
- **AI-Powered Questions** — OpenAI generates unique, never-repeated questions
- **Scaling AI Difficulty** — questions get harder every level (Novice → Master)
- **8 Topics** — Science, Math, History, Coding, Biology, Geography, Art, Space
- **Question Explanation** — AI explains the correct answer after each question
- **Live vs Cached badge** — shows whether questions came from AI or local fallback

---

## 📁 Project Structure
```
crystal_line/
├── api/
│   └── questions.js     ← holds API key
├── public/
│   ├── index.html       ← Game UI
│   └── game.js          ← Full game engine
├── vercel.json          ← Tells Vercel how to route
├── .env                 ← LOCAL ONLY, never pushed (your real key)
├── .env.example         ← Pushed to GitHub (placeholder only)
└── .gitignore           ← Already blocks .env
```

---

## 🔑 Setting Up Your OpenAI API Key

1. Open the `.env` file in your project folder
2. Replace `sk-your-api-key-goes-here` with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-abc123...your-real-key
   ```
3. Save the file. **Never share this file or upload it to GitHub** — the `.gitignore` already protects it.
4. Use `.env.example` as a key holder example, key is never here.
---

## 💻 Running the Game (VS Code)

### Step 1 — Open the project in VS Code
Make sure to download liveserver and use it to see it in host 
Open game at: http://localhost:3000


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

 HEAD
*Crystalline v4 — CPS 3500 Senior Game Project*

## 📁 Project Structure

```
crystalline/
├── index.html      ← Full UI, layout, CSS, overlays
├── game.js         ← Game engine: board, physics, AI, particles
└── README.md       ← This file
```

---

## 💻 Setup in VS Code

### Step 1 — Install VS Code
Download from: https://code.visualstudio.com/

### Step 2 — Install the Live Server extension
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
3. Search for **"Live Server"** by Ritwick Dey
4. Click **Install**

### Step 3 — Open the project
1. Open VS Code
2. Go to **File → Open Folder**
3. Select the `crystalline` folder

### Step 4 — Run the game
1. Right-click on `index.html` in the Explorer sidebar
2. Select **"Open with Live Server"**
3. The game opens automatically in your browser at `http://127.0.0.1:5500`

> ⚠️ **Important:** You must use Live Server (or any local server). Opening `index.html` directly as a file (`file://`) may block Google Fonts from loading.

---

## 🐙 Publishing to GitHub

### Step 1 — Create a GitHub account
Go to https://github.com and sign up if you don't have an account.

### Step 2 — Install Git
Download from: https://git-scm.com/downloads  
Verify installation by opening a terminal and typing:
```bash
git --version
```

### Step 3 — Configure Git (first time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 4 — Initialize your repo
Open a terminal inside your `crystalline` folder:
```bash
git init
git add .
git commit -m "Initial commit: Crystalline gem puzzle game"
```

### Step 5 — Create a repo on GitHub
1. Go to https://github.com/new
2. Name it `crystalline` (or anything you like)
3. Leave it **Public**
4. Do **NOT** initialize with a README (you already have one)
5. Click **Create repository**

### Step 6 — Push your code
GitHub will show you the commands. They look like this:
```bash
git remote add origin https://github.com/YOUR-USERNAME/crystalline.git
git branch -M main
git push -u origin main
```

### Step 7 — Enable GitHub Pages (live demo!)
1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch, **/ (root)**
4. Click **Save**
5. Your game will be live at:  
   `https://YOUR-USERNAME.github.io/crystalline/`

---

## 🔄 Updating Your Game

After making changes:
```bash
git add .
git commit -m "Describe what you changed"
git push
```
GitHub Pages updates automatically within ~1 minute.

---

## 🧠 Algorithms Used (for your writeup)

- **Match Detection** — O(n²) linear scan with group merging
- **Reaction Graph** — Adjacency lookup table, O(k²) per match set
- **AI Hint Search** — Greedy O(n² × 4) swap simulation
- **Physics** — Discrete spring integration: `y += (target - y) * k`
- **Particle Engine** — Velocity-Verlet with drag and gravity
- **Board Generation** — Constraint-based backtracking (no initial matches guaranteed)
- **Combo Scoring** — Multiplicative: `base × (1 + 0.25(combo-1)) × (1 + 0.35(chain-1))`

