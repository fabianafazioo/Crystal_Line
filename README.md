# ✦ Crystalline — Elemental Knowledge Puzzle
Live Demo: https://crystal-line.vercel.app

A browser-based match-3 puzzle game combined with an AI-powered trivia quiz system. Match colorful elemental gems to score points, and answer AI-generated quiz questions to earn massive bonuses.

---

## How to Play

### Step 1 — Choose Your Topic
When the game loads you will see 8 topic cards. Click one to choose the subject your quiz questions will be about, then click the gold **Begin** button.

| Topic | Subject |
|---|---|
| 🔬 Science | Physics, chemistry & biology |
| 📐 Mathematics | Algebra, geometry & calculus |
| 🏛️ History | World events & civilizations |
| 💻 Coding | Programming & computer science |
| 🌿 Biology | Life, cells & ecosystems |
| 🌍 Geography | Countries, capitals & nature |
| 🎨 Art & Music | Artists, movements & composers |
| 🚀 Space | Astronomy & the cosmos |

---

### Step 2 — Match Gems on the Board
The game board is an **8×8 grid** of colorful hexagonal gems. Each gem belongs to one of 6 elements:

| Gem | Element | Color |
|---|---|---|
| 🔥 | Fire | Red / orange |
| 💧 | Water | Blue |
| ❄️ | Ice | Light blue |
| ⚡ | Lightning | Yellow |
| 🌿 | Earth | Green |
| 🔮 | Shadow | Purple |

**Click one gem, then click an adjacent gem to swap them.** If the swap creates a line of 3 or more matching gems going horizontally or vertically, those gems explode and you earn points. Diagonal matches do not count. After gems disappear, the gems above fall down to fill the gaps and new gems drop in from the top — sometimes creating automatic chain reactions that multiply your score.

---

### Step 3 — Watch for Rune Gems ✦
Once you have earned enough points, **Rune Gems** start appearing on the board. They look like a normal gem of their element color, but they have a gold border, a gold **✦** symbol, and a quiz abbreviation written on them (like "DNA" or "WWI").

**Rune Gems match exactly like regular gems.** If a Rune Gem is part of a line of 3 or more matching gems — whether it is at the end, the beginning, or in the middle — it explodes along with the others and triggers a quiz question.

When a Rune Gem is matched, a quiz popup appears with:
- A multiple-choice question about your chosen topic
- A generous countdown timer so you have time to think
- 4 answer choices labeled A, B, C, D

| Result | Reward |
|---|---|
| ✅ Correct answer | Big bonus points + 2 extra moves |
| ❌ Wrong answer | Lose moves as a penalty |
| ⏰ Timer runs out | Treated as wrong — lose moves |

The game shows you the correct answer and a brief explanation after every question, whether you got it right or wrong.

---

### Step 4 — Reach the Score Target to Advance
Each level has a **score target**. Reach it before you run out of moves and you advance to the next level. Run out of moves first and it is Game Over.

You can always see:
- Your current score and the target in the HUD at the top
- How many moves you have left (the bar below the HUD)
- How many Rune Gems are currently on the board
- Your quiz accuracy and best combo in the side panel (desktop)
- A full scoring guide via the **📊 Info** button (mobile)

---

### Controls
| Action | How |
|---|---|
| Swap gems | Click gem → click adjacent gem |
| Pause game | Click **⏸ Pause** in the top bar, or press **P** or **Escape** |
| Resume | Click **▶ Resume** |
| Go to home screen | Click **🏠 Home** in the top bar |
| See scoring guide (mobile) | Click **📊 Info** in the top bar |

---

## How to Win

Beat all **8 levels** by reaching each level's score target. The difficulty increases every level — less time to answer questions, more Rune Gems on the board at once, and much higher score targets.

### Winning Strategy

**Basic gem matches alone will not get you to the finish line.** Each 3-match is only worth 50 base points, and level targets go up to 55,000 points. You need to stack all three scoring systems together:

**1. Chain combos** — Every consecutive match in one turn multiplies the score by +25%. The more you chain, the faster the points grow.

**2. Trigger elemental reactions** — When your match touches two different element types at the same time, a reaction fires:

| Reaction | Elements | Bonus |
|---|---|---|
| Melt! | 🔥 Fire + ❄️ Ice | +60 pts |
| Shock! | 💧 Water + ⚡ Lightning | +75 pts |
| Ignite! | ⚡ Lightning + 🔥 Fire | +70 pts |
| Absorb! | 🌿 Earth + 💧 Water | +55 pts |
| Wildfire! | 🔥 Fire + 🌿 Earth | +100 pts |
| Phantom! | 🔮 Shadow + anything | +80 pts |

**3. Answer Rune questions correctly** — This is the most important part. Rune questions fire frequently throughout every level (every 75–120 pts depending on level), with up to 5 runes on the board at once. Every correct answer gives a bonus and adds 2 extra moves, which keeps you alive longer to earn even more score.

---

## Scoring Reference

### Base Match Points
| Match size | Points |
|---|---|
| 3 gems in a row | 50 pts |
| 4 gems in a row | 90 pts |
| 5 gems in a row | 150 pts |

### Multipliers
- **Combo:** each consecutive match in one turn adds **+25%**
- **Chain reaction:** each automatic chain after gems fall adds **+35%**

### Rune Question Bonus (Correct Answer)
| Level | Bonus | Timer |
|---|---|---|
| 1 — Novice | +200 pts + 2 moves | 40 seconds |
| 2 — Apprentice | +220 pts + 2 moves | 36 seconds |
| 3 — Scholar | +250 pts + 2 moves | 32 seconds |
| 4 — Adept | +280 pts + 2 moves | 28 seconds |
| 5 — Veteran | +310 pts + 2 moves | 24 seconds |
| 6 — Expert | +340 pts + 2 moves | 20 seconds |
| 7 — Elite | +380 pts + 2 moves | 17 seconds |
| 8 — Master | +420 pts + 2 moves | 14 seconds |

### Level Targets
| Level | Target | Moves | Max Runes on Board |
|---|---|---|---|
| 1 — Novice | 3,000 pts | 40 | 3 |
| 2 — Apprentice | 6,000 pts | 38 | 3 |
| 3 — Scholar | 10,000 pts | 36 | 4 |
| 4 — Adept | 15,000 pts | 34 | 4 |
| 5 — Veteran | 22,000 pts | 32 | 4 |
| 6 — Expert | 30,000 pts | 30 | 5 |
| 7 — Elite | 40,000 pts | 28 | 5 |
| 8 — Master | 55,000 pts | 26 | 5 |

---

## Technology Stack

| Component | Technology |
|---|---|
| Game UI & screens | HTML + CSS — no external framework |
| Game logic & rendering | Vanilla JavaScript + HTML Canvas API |
| Hosting | Vercel (auto-deploys from GitHub) |
| API key security | Vercel serverless function + Environment Variables |
| AI questions | OpenAI GPT — fresh unique questions every session |
| Fallback questions | Built-in question bank in game.js — used when AI is unavailable |
| Version control | Git + GitHub (.env is gitignored) |

---

## API Key Security

The OpenAI API key **never touches the browser**. It lives only in Vercel's encrypted Environment Variables dashboard. When the game needs questions, the browser calls `/api/questions`, Vercel runs `api/questions.js` as a serverless function, which reads the key securely, contacts OpenAI, and returns the questions. The key is never in any file pushed to GitHub.

If the API is unavailable for any reason, the game silently falls back to the built-in question bank so it always works.

---

## Project File Structure

```
/
├── public/
│   ├── index.html      — All screens, CSS styling, and HTML structure
│   └── game.js         — All game logic, canvas rendering, scoring, AI calls
├── api/
│   └── questions.js    — Vercel serverless function — holds API key, contacts OpenAI
├── vercel.json         — Routes /api/questions to the function; everything else serves /public
├── .env                — Local API key (never pushed to GitHub)
├── .env.example        — Template showing required environment variables
└── .gitignore          — Blocks .env, node_modules, logs from being committed
```

---

*Built with HTML, CSS, and Vanilla JavaScript. Deployed on Vercel. Powered by OpenAI.*