# ✦ Crystalline — Elemental Knowledge Puzzle
Live Demo: https://crystal-line.vercel.app

## 🆕 What's New 
- **AI-Powered Questions** — OpenAI generates unique, never-repeated questions
- **Scaling AI Difficulty** — questions get harder every level (Novice → Master)
- **8 Topics** — Science, Math, History, Coding, Biology, Geography, Art, Space
- **Question Explanation** — AI explains the correct answer after each question


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

### Open the project in VS Code
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
3. Search for **"Live Server"** by Ritwick Dey
4. Click **Install**
5. Go to **File → Open Folder**
6. Select the `crystal_line` folder
7. Right-click on `index.html` in the Explorer sidebar
8. Select **"Open with Live Server"**


## 🎮 How to Play

- **Select a topic you would like to be quizzed on** 
- **Click a gem** to select it
- **Click an adjacent gem** to swap
- Match **3+ gems** in a row — horizontal or vertical
- **Rune Gems ✦** appear as you score — match them to unlock AI quiz questions
- Answer correctly: **+bonus points & +2 moves**
- Answer wrong: **lose moves** (penalty increases each level!)
- Reach the target score before moves run out

### ⚗️ Elemental Reactions (big bonuses when matched together!)
When your match touches two **different** element types, a reaction fires and awards bonus points on top of the match score. Reactions add strategic depth, positioning your swaps to trigger multiple reactions at once is key at higher levels.

| Reaction | Elements | Bonus |
|---|---|---|
| 🔥 + ❄️ Melt | Fire + Ice | +60 pts |
| 💧 + ⚡ Shock | Water + Lightning | +75 pts |
| ⚡ + 🔥 Ignite | Lightning + Fire | +70 pts |
| 🌿 + 💧 Absorb | Earth + Water | +55 pts |
| 🔥 + 🌿 Wildfire | Fire + Earth | +100 pts |
| 🔮 + any Phantom | Shadow + anything | +80 pts |


---

## 🧠 Algorithms Used

- **Match Detection** — O(n²) linear scan with group merging
- **Reaction Graph** — Adjacency lookup table, O(k²) per match set
- **AI Hint Search** — Greedy O(n² × 4) swap simulation
- **Physics** — Discrete spring integration: `y += (target - y) * k`
- **Particle Engine** — Velocity-Verlet with drag and gravity
- **Board Generation** — Constraint-based backtracking (no initial matches guaranteed)
- **Combo Scoring** — Multiplicative: `base × (1 + 0.25(combo-1)) × (1 + 0.35(chain-1))`

