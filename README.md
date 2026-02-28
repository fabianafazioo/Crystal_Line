# ✦ Crystalline — Elemental Gem Puzzle

A senior-level JavaScript puzzle game featuring elemental gem matching, chain reactions, a greedy AI hint system, custom physics, and a particle engine — all built from scratch with zero libraries.

---

## 🎮 How to Play

- **Click a gem** to select it (it glows)
- **Click an adjacent gem** to swap them
- Match **3 or more gems** of the same element to clear them
- **Chain reactions** between different elements grant massive bonus points
- Reach the **target score** before running out of moves to advance
- Wait 5 seconds for an **AI hint** to appear (gold pulse)

### ⚗️ Elemental Reactions
| Combo | Effect | Bonus |
|-------|--------|-------|
| 🔥 Fire + ❄️ Ice | Melt! | +180 |
| 💧 Water + ⚡ Lightning | Shock! | +220 |
| ⚡ Lightning + 🔥 Fire | Ignite! | +200 |
| 🌿 Earth + 💧 Water | Absorb! | +160 |
| 🔥 Fire + 🌿 Earth | Wildfire! | +300 |
| 🔮 Shadow + anything | Phantom! | +250 |

---

## 🛠️ Technical Features (Senior-Level)

| Feature | Implementation |
|---------|---------------|
| Match engine | Multi-direction group scan with run-length detection |
| Chain reactions | Directed reaction graph (adjacency lookup) |
| Physics | Spring-based gravity lerp for smooth gem falling |
| Particle system | Object-pooled velocity/decay particle engine |
| AI hint system | Greedy board simulation — tests all O(n²) swaps |
| Scoring | Combo multiplier × chain depth multiplier × base score |
| Procedural board | Constraint-based generation (no initial matches) |
| Animation | Double canvas layer (game + particle overlay) |
| Persistence | localStorage high score |
| Adaptive UI | Moves bar color shifts with urgency |

---

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

---

*Created with ✨ for CPS 3500 — Senior Game Project*
