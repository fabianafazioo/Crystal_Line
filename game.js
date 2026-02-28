/* ============================================================
   CRYSTALLINE — Elemental Gem Puzzle
   Full game engine: matching, physics, reactions, particles, AI
   ============================================================ */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const COLS = 8, ROWS = 8;
const GEM_SIZE = 58;          // px per cell
const ANIM_SPEED = 0.18;      // fall lerp
const SWAP_DURATION = 220;    // ms
const SHAKE_FRAMES = 10;

const ELEMENTS = ['fire','water','ice','lightning','earth','shadow'];

const ELEMENT_COLORS = {
  fire:      '#ff4e1a',
  water:     '#00c8ff',
  ice:       '#a8f0ff',
  lightning: '#ffe033',
  earth:     '#7fff5e',
  shadow:    '#cc44ff',
};

const ELEMENT_GLOW = {
  fire:      'rgba(255,78,26,0.75)',
  water:     'rgba(0,200,255,0.75)',
  ice:       'rgba(168,240,255,0.75)',
  lightning: 'rgba(255,224,51,0.75)',
  earth:     'rgba(127,255,94,0.75)',
  shadow:    'rgba(204,68,255,0.75)',
};

const ELEMENT_EMOJI = {
  fire:'🔥', water:'💧', ice:'❄️', lightning:'⚡', earth:'🌿', shadow:'🔮'
};

// Reaction graph: [a, b] => { result, bonus, label }
const REACTIONS = [
  { a:'fire',      b:'ice',       bonus:180, label:'Melt!',     color:'#ff9944' },
  { a:'water',     b:'lightning', bonus:220, label:'Shock!',    color:'#88eeff' },
  { a:'lightning', b:'fire',      bonus:200, label:'Ignite!',   color:'#ffdd55' },
  { a:'earth',     b:'water',     bonus:160, label:'Absorb!',   color:'#88ff88' },
  { a:'fire',      b:'earth',     bonus:300, label:'Wildfire!', color:'#ff6600' },
  { a:'shadow',    b:'fire',      bonus:250, label:'Phantom!',  color:'#ee44ff' },
  { a:'shadow',    b:'water',     bonus:250, label:'Phantom!',  color:'#ee44ff' },
  { a:'shadow',    b:'ice',       bonus:250, label:'Phantom!',  color:'#ee44ff' },
  { a:'shadow',    b:'lightning', bonus:250, label:'Phantom!',  color:'#ee44ff' },
  { a:'shadow',    b:'earth',     bonus:250, label:'Phantom!',  color:'#ee44ff' },
];

const BASE_SCORE = { 3:100, 4:200, 5:350 };

const LEVELS = [
  { moves:20, target:500,  objective:'Get 500 points!',         palette: ELEMENTS },
  { moves:18, target:900,  objective:'Reach 900 — use combos!', palette: ELEMENTS },
  { moves:16, target:1400, objective:'Chain reactions needed!', palette: ELEMENTS },
  { moves:15, target:2000, objective:'Master the elements!',    palette: ELEMENTS },
  { moves:14, target:2800, objective:'Pure crystal mastery!',   palette: ELEMENTS },
];

// ─── State ────────────────────────────────────────────────────────────────────
let board = [];       // board[row][col] = { type, y, targetY, opacity, scale, shake }
let score = 0;
let bestScore = parseInt(localStorage.getItem('crystalline_best') || '0');
let level = 0;
let movesLeft = 0;
let combo = 0;
let selected = null;  // {row, col}
let animating = false;
let gameActive = false;
let particles = [];
let shakeTimer = 0;
let hintCell = null;
let hintTimer = 0;

// ─── Canvas setup ─────────────────────────────────────────────────────────────
const canvas    = document.getElementById('game-canvas');
const pCanvas   = document.getElementById('particle-canvas');
const bgCanvas  = document.getElementById('bg-canvas');
const ctx       = canvas.getContext('2d');
const pCtx      = pCanvas.getContext('2d');
const bgCtx     = bgCanvas.getContext('2d');

const W = COLS * GEM_SIZE;
const H = ROWS * GEM_SIZE;
canvas.width  = pCanvas.width  = W;
canvas.height = pCanvas.height = H;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const scoreEl   = document.getElementById('score-display');
const levelEl   = document.getElementById('level-display');
const bestEl    = document.getElementById('best-display');
const comboEl   = document.getElementById('combo-display');
const comboNum  = document.getElementById('combo-num');
const movesCount= document.getElementById('moves-count');
const movesBar  = document.getElementById('moves-bar-fill');
const targetEl  = document.getElementById('target-display');
const objEl     = document.getElementById('objective-display');
const wrapper   = document.getElementById('canvas-wrapper');

// ─── Background starfield ─────────────────────────────────────────────────────
let stars = [];
function initStars() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  stars = Array.from({length: 200}, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 1.4 + 0.2,
    speed: Math.random() * 0.25 + 0.05,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.04 + 0.01,
  }));
}
function drawStars(t) {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  const grd = bgCtx.createRadialGradient(
    bgCanvas.width/2, bgCanvas.height/2, 0,
    bgCanvas.width/2, bgCanvas.height/2, bgCanvas.width * 0.7
  );
  grd.addColorStop(0, '#130924');
  grd.addColorStop(1, '#060310');
  bgCtx.fillStyle = grd;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    bgCtx.fillStyle = `rgba(220,210,255,${alpha})`;
    bgCtx.fill();
    s.y -= s.speed;
    if (s.y < -2) { s.y = bgCanvas.height + 2; s.x = Math.random()*bgCanvas.width; }
  });
}

// ─── Board init ───────────────────────────────────────────────────────────────
function randomType(palette) {
  return palette[Math.floor(Math.random() * palette.length)];
}

function createGem(type, row) {
  return {
    type,
    y: -(Math.random() * ROWS * GEM_SIZE + GEM_SIZE), // start above screen
    targetY: row * GEM_SIZE,
    opacity: 1,
    scale: 1,
    shake: 0,
  };
}

function initBoard() {
  const palette = LEVELS[level].palette;
  board = [];
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      let type;
      // Ensure no initial matches
      let tries = 0;
      do {
        type = randomType(palette);
        tries++;
      } while (tries < 20 && causesMatch(board, r, c, type));
      board[r][c] = createGem(type, r);
    }
  }
}

function causesMatch(b, row, col, type) {
  // check horizontal
  if (col >= 2 &&
      b[row][col-1] && b[row][col-1].type === type &&
      b[row][col-2] && b[row][col-2].type === type) return true;
  // check vertical
  if (row >= 2 &&
      b[row-1] && b[row-1][col] && b[row-1][col].type === type &&
      b[row-2] && b[row-2][col] && b[row-2][col].type === type) return true;
  return false;
}

// ─── Gem drawing ──────────────────────────────────────────────────────────────
function drawGem(c2d, gem, x, y, size, isSelected, isHint) {
  if (!gem) return;
  const s   = size * gem.scale;
  const pad = (size - s) / 2;
  const gx  = x + pad + gem.shake;
  const gy  = y + pad;
  const r   = s * 0.42;
  const col = ELEMENT_COLORS[gem.type];
  const glow= ELEMENT_GLOW[gem.type];

  c2d.save();
  c2d.globalAlpha = gem.opacity;
  c2d.translate(gx + s/2, gy + s/2);

  // Hint pulse
  if (isHint) {
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.008);
    c2d.shadowBlur  = 30 * pulse;
    c2d.shadowColor = '#ffe066';
  }

  // Selected glow
  if (isSelected) {
    c2d.shadowBlur  = 28;
    c2d.shadowColor = col;
    c2d.scale(1.12, 1.12);
  }

  // Crystal hexagon shape
  c2d.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI / 3) - Math.PI / 6;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    i === 0 ? c2d.moveTo(px, py) : c2d.lineTo(px, py);
  }
  c2d.closePath();

  // Gradient fill
  const grad = c2d.createRadialGradient(-r*0.2, -r*0.3, r*0.05, 0, 0, r);
  grad.addColorStop(0, lighten(col, 0.55));
  grad.addColorStop(0.5, col);
  grad.addColorStop(1, darken(col, 0.4));
  c2d.fillStyle = grad;
  c2d.fill();

  // Rim
  c2d.strokeStyle = isSelected ? '#ffffff' : lighten(col, 0.35);
  c2d.lineWidth   = isSelected ? 2.5 : 1.2;
  c2d.stroke();

  // Inner shine
  c2d.beginPath();
  c2d.arc(-r*0.18, -r*0.22, r*0.28, 0, Math.PI*2);
  c2d.fillStyle = 'rgba(255,255,255,0.28)';
  c2d.fill();

  // Emoji icon
  c2d.shadowBlur = 0;
  c2d.font = `${Math.floor(s * 0.38)}px serif`;
  c2d.textAlign    = 'center';
  c2d.textBaseline = 'middle';
  c2d.globalAlpha *= 0.9;
  c2d.fillText(ELEMENT_EMOJI[gem.type], 0, 1);

  c2d.restore();
}

function lighten(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.min(255,r+255*amt)|0},${Math.min(255,g+255*amt)|0},${Math.min(255,b+255*amt)|0})`;
}
function darken(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-255*amt)|0},${Math.max(0,g-255*amt)|0},${Math.max(0,b-255*amt)|0})`;
}
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

// ─── Render board ─────────────────────────────────────────────────────────────
function renderBoard() {
  ctx.clearRect(0, 0, W, H);

  // Grid background
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * GEM_SIZE, y = r * GEM_SIZE;
      const even = (r + c) % 2 === 0;
      ctx.fillStyle = even
        ? 'rgba(255,255,255,0.028)'
        : 'rgba(255,255,255,0.018)';
      ctx.beginPath();
      ctx.roundRect(x+2, y+2, GEM_SIZE-4, GEM_SIZE-4, 8);
      ctx.fill();
    }
  }

  // Gems
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const gem = board[r][c];
      if (!gem) continue;
      const x = c * GEM_SIZE;
      const drawY = gem.y + (gem.targetY - gem.y) * (1 - Math.pow(1 - ANIM_SPEED * 3.5, 1));
      // Actually animate in loop - just draw at gem.y which is updated in update()
      const isSel  = selected && selected.row === r && selected.col === c;
      const isHint = hintCell && hintCell.row === r && hintCell.col === c;
      drawGem(ctx, gem, x, gem.y, GEM_SIZE, isSel, isHint);
    }
  }
}

// ─── Particles ───────────────────────────────────────────────────────────────
function spawnParticles(col, row, type, count = 18) {
  const cx = col * GEM_SIZE + GEM_SIZE/2;
  const cy = row * GEM_SIZE + GEM_SIZE/2;
  const color = ELEMENT_COLORS[type];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      size: 3 + Math.random() * 5,
      color,
      alpha: 1,
      decay: 0.025 + Math.random() * 0.02,
      gravity: 0.12,
    });
  }
}

function spawnReactionParticles(col, row, color, count = 35) {
  const cx = col * GEM_SIZE + GEM_SIZE/2;
  const cy = row * GEM_SIZE + GEM_SIZE/2;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 7;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 7,
      color,
      alpha: 1,
      decay: 0.018 + Math.random() * 0.015,
      gravity: 0.09,
      sparkle: true,
    });
  }
}

function updateParticles() {
  pCtx.clearRect(0, 0, W, H);
  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.97;
    p.alpha -= p.decay;
    pCtx.save();
    pCtx.globalAlpha = Math.max(0, p.alpha);
    if (p.sparkle) {
      pCtx.shadowBlur  = 12;
      pCtx.shadowColor = p.color;
    }
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI*2);
    pCtx.fillStyle = p.color;
    pCtx.fill();
    pCtx.restore();
  });
}

// ─── Floating score popup ─────────────────────────────────────────────────────
function showPopup(col, row, text, color='#ffe066') {
  const el = document.createElement('div');
  el.className   = 'score-popup';
  el.textContent = text;
  el.style.color = color;
  const wRect = wrapper.getBoundingClientRect();
  const x = wRect.left + col * GEM_SIZE + GEM_SIZE/2;
  const y = wRect.top  + row * GEM_SIZE;
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.style.position = 'fixed';
  el.style.transform = 'translateX(-50%)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ─── Match finding ────────────────────────────────────────────────────────────
function findMatches() {
  const matched = new Set();

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 2; c++) {
      const t = board[r][c]?.type;
      if (!t) continue;
      if (board[r][c+1]?.type === t && board[r][c+2]?.type === t) {
        let end = c + 2;
        while (end + 1 < COLS && board[r][end+1]?.type === t) end++;
        for (let i = c; i <= end; i++) matched.add(`${r},${i}`);
        c = end;
      }
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 2; r++) {
      const t = board[r][c]?.type;
      if (!t) continue;
      if (board[r+1][c]?.type === t && board[r+2][c]?.type === t) {
        let end = r + 2;
        while (end + 1 < ROWS && board[end+1][c]?.type === t) end++;
        for (let i = r; i <= end; i++) matched.add(`${i},${c}`);
        r = end;
      }
    }
  }

  return matched;
}

// ─── Reaction check ───────────────────────────────────────────────────────────
function checkReactions(matchedSet) {
  const cells = [...matchedSet].map(k => {
    const [r,c] = k.split(',').map(Number);
    return { r, c, type: board[r][c]?.type };
  });

  let totalReactionBonus = 0;
  const seen = new Set();

  for (let i = 0; i < cells.length; i++) {
    for (let j = i+1; j < cells.length; j++) {
      const a = cells[i].type, b = cells[j].type;
      const key = [a,b].sort().join(':');
      if (seen.has(key)) continue;
      const rx = REACTIONS.find(r =>
        (r.a === a && r.b === b) || (r.a === b && r.b === a)
      );
      if (rx) {
        seen.add(key);
        totalReactionBonus += rx.bonus;
        // Spawn reaction particles near midpoint
        const mc = Math.floor((cells[i].c + cells[j].c) / 2);
        const mr = Math.floor((cells[i].r + cells[j].r) / 2);
        spawnReactionParticles(mc, mr, rx.color, 40);
        setTimeout(() => showPopup(mc, mr, `${rx.label} +${rx.bonus}`, rx.color), 100);
      }
    }
  }
  return totalReactionBonus;
}

// ─── Process matches ──────────────────────────────────────────────────────────
async function processMatches() {
  let anyMatch = true;
  let chainDepth = 0;

  while (anyMatch) {
    const matched = findMatches();
    if (matched.size === 0) { anyMatch = false; break; }

    chainDepth++;
    combo++;
    updateComboUI();

    // Reaction bonus
    const reactionBonus = checkReactions(matched);

    // Score per match
    let matchScore = 0;
    const matchCells = [...matched].map(k => k.split(',').map(Number));

    // Group by type for scoring
    const groups = {};
    matchCells.forEach(([r,c]) => {
      const t = board[r][c]?.type;
      if (t) { groups[t] = (groups[t]||[]).concat([[r,c]]); }
    });

    Object.entries(groups).forEach(([type, cells]) => {
      const n = Math.min(cells.length, 5);
      const base = BASE_SCORE[n] || (n * 80);
      const comboMult = 1 + (combo - 1) * 0.25;
      const chainMult = 1 + (chainDepth - 1) * 0.35;
      const pts = Math.floor(base * comboMult * chainMult);
      matchScore += pts;
      const mid = cells[Math.floor(cells.length/2)];
      spawnParticles(mid[1], mid[0], type, 22);
      setTimeout(() => showPopup(mid[1], mid[0], `+${pts}`, ELEMENT_COLORS[type]), 50);
    });

    const totalPts = matchScore + reactionBonus;
    addScore(totalPts);

    // Animate matched gems out
    matchCells.forEach(([r,c]) => {
      if (board[r][c]) {
        board[r][c].scale = 0.01;
        board[r][c].opacity = 0;
      }
    });

    await sleep(280);

    // Remove matched gems
    matchCells.forEach(([r,c]) => { board[r][c] = null; });

    // Gravity: drop gems
    await dropGems();
    await sleep(260);

    // Refill
    refillBoard();
    await sleep(340);
  }

  if (chainDepth === 0) combo = 0;
  updateComboUI();
}

// ─── Drop gems (gravity) ──────────────────────────────────────────────────────
async function dropGems() {
  for (let c = 0; c < COLS; c++) {
    let empty = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][c]) empty.push(r);
      else if (empty.length > 0) {
        const newR = empty.shift();
        board[newR][c] = board[r][c];
        board[newR][c].targetY = newR * GEM_SIZE;
        board[r][c] = null;
        empty.push(r);
      }
    }
  }
}

// ─── Refill board ─────────────────────────────────────────────────────────────
function refillBoard() {
  const palette = LEVELS[level].palette;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c]) {
        board[r][c] = createGem(randomType(palette), r);
      }
    }
  }
}

// ─── Swap logic ───────────────────────────────────────────────────────────────
async function trySwap(r1, c1, r2, c2) {
  if (animating) return;
  if (Math.abs(r1-r2) + Math.abs(c1-c2) !== 1) return; // must be adjacent

  animating = true;

  // Animate swap visually
  const g1 = board[r1][c1], g2 = board[r2][c2];
  board[r1][c1] = g2;
  board[r2][c2] = g1;
  if (g1) g1.targetY = r2 * GEM_SIZE;
  if (g2) g2.targetY = r1 * GEM_SIZE;

  await sleep(SWAP_DURATION);

  const matches = findMatches();
  if (matches.size === 0) {
    // Invalid swap — revert
    board[r1][c1] = g1;
    board[r2][c2] = g2;
    if (g1) g1.targetY = r1 * GEM_SIZE;
    if (g2) g2.targetY = r2 * GEM_SIZE;
    // Shake both
    shakeGem(r1, c1);
    shakeGem(r2, c2);
    await sleep(SWAP_DURATION);
  } else {
    // Valid swap
    movesLeft--;
    updateMovesUI();
    await processMatches();
  }

  selected  = null;
  animating = false;
  hintCell  = null;
  hintTimer = 0;

  checkGameState();
}

function shakeGem(r, c) {
  if (!board[r][c]) return;
  let t = 0;
  const interval = setInterval(() => {
    if (!board[r][c]) { clearInterval(interval); return; }
    board[r][c].shake = Math.sin(t * 2.5) * 5;
    t++;
    if (t > SHAKE_FRAMES) {
      board[r][c].shake = 0;
      clearInterval(interval);
    }
  }, 30);
}

// ─── Click handler ────────────────────────────────────────────────────────────
canvas.addEventListener('click', (e) => {
  if (!gameActive || animating) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const col = Math.floor(mx / GEM_SIZE);
  const row = Math.floor(my / GEM_SIZE);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
  if (!board[row][col]) return;

  if (!selected) {
    selected = { row, col };
    // Bounce effect
    if (board[row][col]) board[row][col].scale = 1;
  } else {
    if (selected.row === row && selected.col === col) {
      selected = null; // deselect
    } else {
      trySwap(selected.row, selected.col, row, col);
    }
  }
});

// ─── UI updates ───────────────────────────────────────────────────────────────
function addScore(pts) {
  score += pts;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('crystalline_best', bestScore);
    bestEl.textContent = bestScore;
  }
  // Animate score counter
  const current = parseInt(scoreEl.textContent.replace(/,/g,'')) || 0;
  animateCounter(scoreEl, current, score, 400);
  scoreEl.classList.add('pop');
  setTimeout(() => scoreEl.classList.remove('pop'), 300);
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  const diff = to - from;
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(from + diff * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateComboUI() {
  if (combo > 1) {
    comboNum.textContent = combo;
    comboEl.classList.add('visible');
    clearTimeout(comboEl._timer);
    comboEl._timer = setTimeout(() => comboEl.classList.remove('visible'), 2000);
  } else {
    comboEl.classList.remove('visible');
  }
}

function updateMovesUI() {
  const lvl = LEVELS[level];
  movesCount.textContent = `${movesLeft} / ${lvl.moves}`;
  const pct = movesLeft / lvl.moves * 100;
  movesBar.style.width = pct + '%';
  if (pct <= 25) {
    movesBar.style.background = 'linear-gradient(90deg, #ff4e1a, #ff8844)';
    movesBar.style.boxShadow  = '0 0 8px rgba(255,78,26,0.7)';
  } else if (pct <= 50) {
    movesBar.style.background = 'linear-gradient(90deg, #ffe033, #ffaa44)';
    movesBar.style.boxShadow  = '0 0 8px rgba(255,224,51,0.5)';
  } else {
    movesBar.style.background = 'linear-gradient(90deg, #a78bfa, #60d0ff)';
    movesBar.style.boxShadow  = '0 0 8px rgba(96,208,255,0.6)';
  }
}

// ─── Game state checks ────────────────────────────────────────────────────────
function checkGameState() {
  const lvl = LEVELS[level];
  if (score >= lvl.target) {
    setTimeout(() => showLevelComplete(), 400);
    return;
  }
  if (movesLeft <= 0) {
    if (score >= lvl.target) {
      setTimeout(() => showLevelComplete(), 400);
    } else {
      setTimeout(() => showGameOver(), 400);
    }
    return;
  }
  // Auto-hint after 5s inactivity
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    hintCell = findBestHint();
  }, 5000);
}

// ─── AI Hint: greedy search for best move ─────────────────────────────────────
function findBestHint() {
  let bestScore = -1, bestCell = null;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
      neighbors.forEach(([nr,nc]) => {
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
        // Simulate swap
        const tmp = board[r][c];
        board[r][c] = board[nr][nc];
        board[nr][nc] = tmp;
        const matches = findMatches().size;
        // Undo
        board[nr][nc] = board[r][c];
        board[r][c] = tmp;
        if (matches > bestScore) {
          bestScore = matches;
          bestCell = { row: r, col: c };
        }
      });
    }
  }
  return bestScore > 0 ? bestCell : null;
}

// ─── Level complete ───────────────────────────────────────────────────────────
function showLevelComplete() {
  gameActive = false;
  const lvl = LEVELS[level];
  const stars = score >= lvl.target * 2 ? 3
              : score >= lvl.target * 1.4 ? 2 : 1;
  document.getElementById('level-title').textContent =
    level >= LEVELS.length - 1 ? '🏆 You Win!' : '✨ Level Complete!';
  document.getElementById('level-score').textContent = score.toLocaleString();
  document.getElementById('level-feedback').textContent =
    ['Almost there!','Great work!','Excellent!','Amazing!','Perfect! 🔮'][stars + 1] || 'Brilliant!';

  // Animate stars
  const starEls = document.querySelectorAll('.star');
  starEls.forEach((el, i) => {
    el.classList.remove('lit');
    if (i < stars) setTimeout(() => el.classList.add('lit'), 200 + i * 180);
  });

  document.getElementById('level-overlay').classList.add('active');
  // Big particle burst
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      spawnReactionParticles(
        Math.floor(Math.random() * COLS),
        Math.floor(Math.random() * ROWS),
        ['#ff4e1a','#00c8ff','#ffe033','#cc44ff','#7fff5e'][i % 5],
        30
      );
    }, i * 120);
  }
}

function showGameOver() {
  gameActive = false;
  document.getElementById('final-score').textContent = score.toLocaleString();
  const pct = score / LEVELS[level].target;
  document.getElementById('gameover-feedback').textContent =
    pct >= 0.8 ? 'So close! Try again!'
    : pct >= 0.5 ? 'Good effort, keep practising!'
    : 'Keep training, you\'ll get there!';
  document.getElementById('gameover-overlay').classList.add('active');
}

// ─── Game control ─────────────────────────────────────────────────────────────
function startGame() {
  document.getElementById('start-overlay').classList.remove('active');
  level = 0;
  beginLevel();
}

function beginLevel() {
  score = 0;
  combo = 0;
  animating = false;
  selected  = null;
  particles = [];
  hintCell  = null;
  const lvl = LEVELS[level];
  movesLeft = lvl.moves;
  scoreEl.textContent = '0';
  levelEl.textContent = level + 1;
  bestEl.textContent  = bestScore.toLocaleString();
  targetEl.textContent = lvl.target.toLocaleString();
  objEl.textContent    = lvl.objective;
  updateMovesUI();
  comboEl.classList.remove('visible');
  initBoard();
  gameActive = true;
}

function nextLevel() {
  document.getElementById('level-overlay').classList.remove('active');
  if (level < LEVELS.length - 1) {
    level++;
    beginLevel();
  } else {
    level = 0;
    beginLevel();
  }
}

function restartGame() {
  document.getElementById('level-overlay').classList.remove('active');
  document.getElementById('gameover-overlay').classList.remove('active');
  level = 0;
  beginLevel();
}

// ─── Physics update ───────────────────────────────────────────────────────────
function updateBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const gem = board[r][c];
      if (!gem) continue;
      // Smooth fall using spring-like lerp
      const dy = gem.targetY - gem.y;
      gem.y += dy * 0.22;
      if (Math.abs(dy) < 0.5) gem.y = gem.targetY;
      // Scale spring back to 1
      gem.scale += (1 - gem.scale) * 0.15;
    }
  }
}

// ─── Main loop ────────────────────────────────────────────────────────────────
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  drawStars(timestamp);
  updateBoard();
  renderBoard();
  updateParticles();

  requestAnimationFrame(gameLoop);
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ─── Window resize ────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  initStars();
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
initStars();
requestAnimationFrame(gameLoop);