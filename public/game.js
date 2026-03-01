/* ================================================================
   CRYSTALLINE v5
   Fixes: H+V matching only (no diagonal), pause button,
          AI questions read from .env.example via server
   ================================================================ */
'use strict';

// ── TOPICS ────────────────────────────────────────────────────────────────────
const TOPICS = {
  science:   { name:'Science',     icon:'🔬', desc:'Physics, chemistry & biology',  color:'#00c8ff' },
  math:      { name:'Mathematics', icon:'📐', desc:'Algebra, geometry & calculus',   color:'#a78bfa' },
  history:   { name:'History',     icon:'🏛️', desc:'World events & civilizations',  color:'#ff9a00' },
  coding:    { name:'Coding',      icon:'💻', desc:'Programming & computer science', color:'#7fff5e' },
  biology:   { name:'Biology',     icon:'🌿', desc:'Life, cells & ecosystems',       color:'#96f7d2' },
  geography: { name:'Geography',   icon:'🌍', desc:'Countries, capitals & nature',   color:'#ff6b9d' },
  art:       { name:'Art & Music', icon:'🎨', desc:'Artists, movements & composers', color:'#e0c3fc' },
  space:     { name:'Space',       icon:'🚀', desc:'Astronomy & the cosmos',         color:'#60d0ff' },
};

// ── FALLBACK QUESTIONS (used when server/API unavailable) ──────────────────────
const FALLBACK = {
  science:[
    {abbr:'DNA',q:'What does DNA stand for?',choices:['Deoxyribonucleic Acid','Dynamic Neural Assembly','Di-Nucleic Arrangement','Distributed Neuron Array'],answer:0,explanation:'DNA carries the genetic blueprint for all living things.'},
    {abbr:'Hz',q:'Hertz (Hz) measures:',choices:['Temperature','Frequency','Pressure','Energy'],answer:1,explanation:'Hertz measures frequency — cycles per second.'},
    {abbr:'ATP',q:'ATP is the primary energy currency of:',choices:['Rocks','Cells','Stars','Oceans'],answer:1,explanation:'Adenosine Triphosphate powers most cellular processes.'},
    {abbr:'pH',q:'A pH of 7 means a solution is:',choices:['Acidic','Basic','Neutral','Saturated'],answer:2,explanation:'pH 7 is neutral — neither acidic nor basic.'},
    {abbr:'E=mc²',q:'In Einstein\'s E=mc², "c" stands for:',choices:['Charge','Speed of light','A constant','Concentration'],answer:1,explanation:'c is the speed of light, ~3×10⁸ m/s.'},
    {abbr:'CO₂',q:'CO₂ is:',choices:['Carbon Dioxide','Carbon Monoxide','Calcium Dioxide','Copper Oxide'],answer:0,explanation:'Carbon Dioxide is a key greenhouse gas in Earth\'s atmosphere.'},
  ],
  math:[
    {abbr:'π',q:'π (pi) is approximately:',choices:['2.718','3.14159','1.618','4.669'],answer:1,explanation:'Pi is the ratio of a circle\'s circumference to its diameter.'},
    {abbr:'√',q:'What is √144?',choices:['11','12','13','14'],answer:1,explanation:'12 × 12 = 144.'},
    {abbr:'∑',q:'The symbol ∑ represents:',choices:['Product','Summation','Difference','Average'],answer:1,explanation:'Sigma (∑) denotes the sum of a sequence.'},
    {abbr:'i',q:'The imaginary unit i equals:',choices:['√-1','√1','-1','1/2'],answer:0,explanation:'i is defined as the square root of negative one.'},
    {abbr:'e',q:"Euler's number e ≈ 2.718 is the base of:",choices:['Log base 10','Natural logarithm','Square root','Factorial'],answer:1,explanation:'e is the base of the natural logarithm, used extensively in calculus.'},
  ],
  history:[
    {abbr:'WWI',q:'WWI began in:',choices:['1908','1912','1914','1918'],answer:2,explanation:'WWI started in 1914 following the assassination of Archduke Franz Ferdinand.'},
    {abbr:'UN',q:'The UN was founded after:',choices:['WWI','Korean War','WWII','Vietnam War'],answer:2,explanation:'The United Nations was established in 1945 after WWII.'},
    {abbr:'USSR',q:'The USSR dissolved in:',choices:['1985','1989','1991','1995'],answer:2,explanation:'The Soviet Union officially dissolved on December 25, 1991.'},
    {abbr:'D-Day',q:'D-Day (June 6, 1944) was the Allied invasion of:',choices:['Italy','Germany','Normandy, France','Poland'],answer:2,explanation:'Operation Overlord — the Normandy landings — was the largest seaborne invasion in history.'},
  ],
  coding:[
    {abbr:'HTML',q:'HTML stands for:',choices:['HyperText Markup Language','High Transfer Markup Logic','Hyper Tool Making Language','HyperText Machine Learning'],answer:0,explanation:'HTML is the standard language for creating web pages.'},
    {abbr:'API',q:'API enables:',choices:['Faster internet','Software communication','Better graphics','Data storage'],answer:1,explanation:'An Application Programming Interface allows different software systems to communicate.'},
    {abbr:'Git',q:'Git is a:',choices:['Programming language','Database','Version control system','Web framework'],answer:2,explanation:'Git tracks changes in code so teams can collaborate and revert changes.'},
    {abbr:'RAM',q:'RAM stands for:',choices:['Read Access Memory','Random Access Memory','Rapid Array Module','Read And Modify'],answer:1,explanation:'Random Access Memory is your computer\'s short-term working memory.'},
  ],
  biology:[
    {abbr:'mRNA',q:'mRNA carries instructions for making:',choices:['Fats','Minerals','Proteins','Carbohydrates'],answer:2,explanation:'Messenger RNA carries the genetic code from DNA to ribosomes.'},
    {abbr:'RBC',q:'Red Blood Cells mainly:',choices:['Fight infection','Carry oxygen','Clot blood','Digest food'],answer:1,explanation:'RBCs contain hemoglobin which binds and transports oxygen.'},
    {abbr:'CNS',q:'The CNS consists of the brain and:',choices:['Heart','Lungs','Spinal cord','Kidneys'],answer:2,explanation:'The Central Nervous System = brain + spinal cord.'},
    {abbr:'GMO',q:'GMO stands for Genetically Modified:',choices:['Output','Organism','Origin','Operation'],answer:1,explanation:'GMOs have their genetic material altered using biotechnology.'},
  ],
  geography:[
    {abbr:'GMT',q:'GMT is used as:',choices:['A climate zone','A time standard','A map projection','A currency standard'],answer:1,explanation:'Greenwich Mean Time is the reference point for global time zones.'},
    {abbr:'Mt.',q:'Mt. Everest is in the:',choices:['Alps','Andes','Himalayas','Rockies'],answer:2,explanation:'Everest sits on the Nepal-China border in the Himalayas.'},
    {abbr:'lat',q:'Latitude lines run:',choices:['North to south','East to west','Diagonally','Vertically'],answer:1,explanation:'Latitude lines are horizontal circles parallel to the equator.'},
    {abbr:'USA',q:'How many states does the USA have?',choices:['48','49','50','52'],answer:2,explanation:'The 50th state, Hawaii, joined the USA in 1959.'},
  ],
  art:[
    {abbr:'MoMA',q:'MoMA stands for:',choices:['Museum of Modern Art','Museum of Many Arts','Ministry of Modern Arts','Museum of Musical Arts'],answer:0,explanation:'The Museum of Modern Art in New York is one of the world\'s most influential art museums.'},
    {abbr:'Pop',q:'Andy Warhol is associated with which art movement?',choices:['Cubism','Surrealism','Pop Art','Impressionism'],answer:2,explanation:'Warhol was the leading figure of Pop Art, known for works like the Campbell\'s Soup Cans.'},
    {abbr:'Da V',q:"Leonardo da Vinci painted the Mona Lisa. He was also known as a:",choices:['Poet','Scientist & inventor','Politician','Musician'],answer:1,explanation:'Da Vinci was a Renaissance polymath — painter, scientist, engineer, and inventor.'},
  ],
  space:[
    {abbr:'AU',q:'One AU (Astronomical Unit) is roughly the distance from:',choices:['Earth to Moon','Sun to Mars','Earth to Sun','Sun to Jupiter'],answer:2,explanation:'1 AU ≈ 150 million km — the average Earth-Sun distance.'},
    {abbr:'LY',q:'A light-year measures:',choices:['Time','Distance','Brightness','Mass'],answer:1,explanation:'A light-year is the distance light travels in one year — about 9.46 trillion km.'},
    {abbr:'ISS',q:'The ISS orbits Earth at approximately:',choices:['200 km','400 km','800 km','1200 km'],answer:1,explanation:'The International Space Station orbits at ~400 km altitude.'},
  ],
};

// ── LEVELS ────────────────────────────────────────────────────────────────────
// 8 levels — each one meaningfully harder than the last.
// targets are high enough that the player must use combos + rune bonuses to advance.
// moves decrease each level, timers shrink, and runes flood the board at high levels.
const LEVELS = [
  // Level 1 — Novice: generous moves, slow rune pace, easy questions, learn the game
  { moves:30, target:1200,  runeThreshold:200, runeEvery:300, maxRunes:1, questionTime:25, correctBonus:350,  wrongPenalty:1, label:'Novice',      diffColor:'#7fff5e', aiDiff:1 },
  // Level 2 — Apprentice: still comfortable but runes start appearing
  { moves:28, target:2500,  runeThreshold:160, runeEvery:260, maxRunes:1, questionTime:22, correctBonus:450,  wrongPenalty:2, label:'Apprentice',  diffColor:'#96f7d2', aiDiff:1 },
  // Level 3 — Scholar: medium targets, 2 runes can appear, questions harder
  { moves:26, target:4200,  runeThreshold:130, runeEvery:220, maxRunes:2, questionTime:20, correctBonus:580,  wrongPenalty:2, label:'Scholar',     diffColor:'#00c8ff', aiDiff:2 },
  // Level 4 — Adept: timer pressure starts, must use reaction bonuses
  { moves:24, target:6500,  runeThreshold:110, runeEvery:190, maxRunes:2, questionTime:17, correctBonus:700,  wrongPenalty:2, label:'Adept',       diffColor:'#a78bfa', aiDiff:3 },
  // Level 5 — Veteran: fewer moves, higher targets, questions need real knowledge
  { moves:22, target:9500,  runeThreshold:90,  runeEvery:160, maxRunes:3, questionTime:15, correctBonus:820,  wrongPenalty:3, label:'Veteran',     diffColor:'#c084fc', aiDiff:3 },
  // Level 6 — Expert: tight on moves, runes everywhere, 12s timer
  { moves:20, target:13500, runeThreshold:70,  runeEvery:130, maxRunes:3, questionTime:12, correctBonus:950,  wrongPenalty:3, label:'Expert',      diffColor:'#ff9a00', aiDiff:4 },
  // Level 7 — Elite: brutal targets, must chain combos AND answer rune questions
  { moves:18, target:18500, runeThreshold:55,  runeEvery:100, maxRunes:4, questionTime:10, correctBonus:1100, wrongPenalty:4, label:'Elite',       diffColor:'#f97316', aiDiff:4 },
  // Level 8 — Master: maximum difficulty, 8s per question, 4 runes on board at once
  { moves:16, target:25000, runeThreshold:40,  runeEvery:80,  maxRunes:4, questionTime:8,  correctBonus:1400, wrongPenalty:4, label:'Master',      diffColor:'#ff4e1a', aiDiff:5 },
];

// ── GEM CONSTANTS ─────────────────────────────────────────────────────────────
const COLS=8,ROWS=8,GEM_SIZE=58,SWAP_MS=220,SHAKE_N=10;
const ELEMENTS=['fire','water','ice','lightning','earth','shadow'];
const ECOLORS={fire:'#ff4e1a',water:'#00c8ff',ice:'#a8f0ff',lightning:'#ffe033',earth:'#7fff5e',shadow:'#cc44ff'};
const EGLOW={fire:'rgba(255,78,26,.7)',water:'rgba(0,200,255,.7)',ice:'rgba(168,240,255,.7)',lightning:'rgba(255,224,51,.7)',earth:'rgba(127,255,94,.7)',shadow:'rgba(204,68,255,.7)'};
const EEMOJI={fire:'🔥',water:'💧',ice:'❄️',lightning:'⚡',earth:'🌿',shadow:'🔮'};
const REACTIONS=[
  {a:'fire',b:'ice',bonus:180,label:'Melt!',color:'#ff9944'},
  {a:'water',b:'lightning',bonus:220,label:'Shock!',color:'#88eeff'},
  {a:'lightning',b:'fire',bonus:200,label:'Ignite!',color:'#ffdd55'},
  {a:'earth',b:'water',bonus:160,label:'Absorb!',color:'#88ff88'},
  {a:'fire',b:'earth',bonus:300,label:'Wildfire!',color:'#ff6600'},
  {a:'shadow',b:'fire',bonus:250,label:'Phantom!',color:'#ee44ff'},
  {a:'shadow',b:'water',bonus:250,label:'Phantom!',color:'#ee44ff'},
  {a:'shadow',b:'ice',bonus:250,label:'Phantom!',color:'#ee44ff'},
  {a:'shadow',b:'lightning',bonus:250,label:'Phantom!',color:'#ee44ff'},
  {a:'shadow',b:'earth',bonus:250,label:'Phantom!',color:'#ee44ff'},
];
const BSCORE={3:100,4:220,5:380};

// ── STATE ─────────────────────────────────────────────────────────────────────
let board=[],score=0,bestScore=parseInt(localStorage.getItem('cryst5_best')||'0');
let level=0,movesLeft=0,combo=0,bestCombo=0,selected=null,animating=false,gameActive=false;
let particles=[],hintCell=null,hintTimeout=null;
let topicKey=null,selectedTopic=null;
let runesAnswered=0,runesCorrect=0,runesOnBoard=0;
let scoreThisLevel=0,gemScoreThisLevel=0,runeScoreThisLevel=0;
let scoreToNextRune=0;
let questionActive=false,questionTimerInterval=null;
let aiCache={};   // { "topicKey-level": [questions...] }
let usingAI=false;
let isPaused=false;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas  =document.getElementById('game-canvas');
const pCanvas =document.getElementById('particle-canvas');
const bgCanvas=document.getElementById('bg-canvas');
const ctx =canvas.getContext('2d');
const pCtx=pCanvas.getContext('2d');
const bgCtx=bgCanvas.getContext('2d');
const W=COLS*GEM_SIZE,H=ROWS*GEM_SIZE;
canvas.width=pCanvas.width=W;
canvas.height=pCanvas.height=H;

// ── DOM ───────────────────────────────────────────────────────────────────────
const scoreEl       =document.getElementById('score-display');
const levelEl       =document.getElementById('level-display');
const bestEl        =document.getElementById('best-display');
const runeEl        =document.getElementById('rune-display');
const comboEl       =document.getElementById('combo-display');
const comboNum      =document.getElementById('combo-num');
const movesCount    =document.getElementById('moves-count');
const movesBar      =document.getElementById('moves-bar-fill');
const targetEl      =document.getElementById('target-display');
const objEl         =document.getElementById('objective-display');
const wrapper       =document.getElementById('canvas-wrapper');
const runeAlertEl   =document.getElementById('rune-alert');
const runeAlertTxt  =document.getElementById('rune-alert-text');
const runeBarFill   =document.getElementById('rune-bar-fill');
const runeCountInfo =document.getElementById('rune-count-info');
const runesOnBoardEl=document.getElementById('runes-on-board');
const aiLoadingEl   =document.getElementById('ai-loading');
const aiLoadingTxt  =document.getElementById('ai-loading-text');
const pauseBtn      =document.getElementById('pause-btn');
const pauseOverlay  =document.getElementById('pause-overlay');
const canvasPaused  =document.getElementById('canvas-paused');
const pauseIcon     =document.getElementById('pause-icon');
const pauseLabel    =document.getElementById('pause-label');

// ── PAUSE SYSTEM ─────────────────────────────────────────────────────────────
window.togglePause = function() {
  if (!gameActive && !isPaused) return;
  isPaused = !isPaused;
  pauseOverlay.classList.toggle('active', isPaused);
  canvasPaused.classList.toggle('visible', isPaused);
  pauseIcon.textContent  = isPaused ? '▶' : '⏸';
  pauseLabel.textContent = isPaused ? 'Resume' : 'Pause';
  if (isPaused) {
    clearTimeout(hintTimeout);
    hintCell = null;
  } else {
    resetHintTimer();
  }
};

// ── TOPIC SELECT ──────────────────────────────────────────────────────────────
function buildTopicGrid() {
  const grid = document.getElementById('topic-grid');
  Object.entries(TOPICS).forEach(([key, t]) => {
    const btn = document.createElement('div');
    btn.className = 'topic-btn';
    btn.dataset.key = key;
    btn.innerHTML = `<div class="topic-icon">${t.icon}</div><div class="topic-name">${t.name}</div><div class="topic-desc">${t.desc}</div>`;
    btn.addEventListener('click', () => selectTopic(key));
    grid.appendChild(btn);
  });
}

function selectTopic(key) {
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.topic-btn[data-key="${key}"]`).classList.add('active');
  topicKey = key;
  selectedTopic = TOPICS[key];
  const btn = document.getElementById('start-btn');
  btn.textContent = `Begin with ${selectedTopic.name} ${selectedTopic.icon}`;
  btn.disabled = false;
}

window.confirmTopic = async function() {
  if (!topicKey) return;
  document.getElementById('topic-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('topic-badge').innerHTML = `${selectedTopic.icon} ${selectedTopic.name}`;
  pauseBtn.classList.add('visible');
  aiCache = {};
  level = 0;
  await prefetchQuestions(0);
  beginLevel();
};

window.goToTopicSelect = function() {
  ['level-overlay','gameover-overlay'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('topic-screen').classList.remove('hidden');
  pauseBtn.classList.remove('visible');
  topicKey = null; selectedTopic = null; isPaused = false;
  pauseOverlay.classList.remove('active');
  canvasPaused.classList.remove('visible');
};

// ── AI QUESTION SYSTEM ────────────────────────────────────────────────────────
async function prefetchQuestions(lvlIndex) {
  const cacheKey = `${topicKey}-${lvlIndex}`;
  if (aiCache[cacheKey] && aiCache[cacheKey].length >= 5) { usingAI = true; return; }

  showAILoading(`Generating ${LEVELS[lvlIndex].label} ${selectedTopic.name} questions…`);
  try {
    const url = `/api/questions?topic=${encodeURIComponent(topicKey)}&topicName=${encodeURIComponent(selectedTopic.name)}&level=${lvlIndex}&count=8`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (!data.questions || data.questions.length === 0) throw new Error('Empty questions array');

    aiCache[cacheKey] = shuffleArray(data.questions);
    usingAI = true;
    console.log(`✅ AI questions loaded for level ${lvlIndex}:`, aiCache[cacheKey].length);
  } catch (e) {
    console.warn('⚠️ AI unavailable, using fallback:', e.message);
    aiCache[cacheKey] = shuffleArray([...(FALLBACK[topicKey] || FALLBACK.science)]);
    usingAI = false;
  }
  hideAILoading();

  // Prefetch next level silently in background
  if (lvlIndex + 1 < LEVELS.length) {
    setTimeout(() => prefetchQuestions(lvlIndex + 1), 4000);
  }
}

function getNextQuestion() {
  const cacheKey = `${topicKey}-${level}`;
  if (!aiCache[cacheKey] || aiCache[cacheKey].length === 0) {
    aiCache[cacheKey] = shuffleArray([...(FALLBACK[topicKey] || FALLBACK.science)]);
    usingAI = false;
  }
  const q = aiCache[cacheKey].shift();
  // Replenish async if running low
  if (aiCache[cacheKey].length < 2) prefetchQuestions(level);
  return q;
}

function showAILoading(msg) { aiLoadingTxt.textContent = msg; aiLoadingEl.classList.add('visible'); }
function hideAILoading() { aiLoadingEl.classList.remove('visible'); }
function showRuneAlert(msg) {
  runeAlertTxt.textContent = msg;
  runeAlertEl.classList.add('visible');
  clearTimeout(runeAlertEl._t);
  runeAlertEl._t = setTimeout(() => runeAlertEl.classList.remove('visible'), 4000);
}

// ── STARFIELD ─────────────────────────────────────────────────────────────────
let stars = [];
function initStars() {
  bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight;
  stars = Array.from({length:220}, () => ({
    x: Math.random()*bgCanvas.width, y: Math.random()*bgCanvas.height,
    r: Math.random()*1.4+.2, speed: Math.random()*.2+.04,
    tw: Math.random()*Math.PI*2, tws: Math.random()*.04+.01
  }));
}
function drawStars() {
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  const g = bgCtx.createRadialGradient(bgCanvas.width/2,bgCanvas.height/2,0,bgCanvas.width/2,bgCanvas.height/2,bgCanvas.width*.7);
  g.addColorStop(0,'#130924'); g.addColorStop(1,'#060310');
  bgCtx.fillStyle=g; bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  stars.forEach(s => {
    s.tw += s.tws;
    const a = .3 + .7*Math.abs(Math.sin(s.tw));
    bgCtx.beginPath(); bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgCtx.fillStyle = `rgba(220,210,255,${a})`; bgCtx.fill();
    s.y -= s.speed;
    if (s.y < -2) { s.y = bgCanvas.height+2; s.x = Math.random()*bgCanvas.width; }
  });
}

// ── BOARD ─────────────────────────────────────────────────────────────────────
function randomType() { return ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]; }

// Only check H and V — no diagonal initial match prevention
function causesMatch(b, r, c, type) {
  if (c >= 2 && b[r][c-1]?.type === type && b[r][c-2]?.type === type) return true;
  if (r >= 2 && b[r-1]?.[c]?.type === type && b[r-2]?.[c]?.type === type) return true;
  return false;
}

function makeGem(type, y, targetY, isRune=false, runeData=null) {
  return { type, y, targetY, opacity:1, scale:1, shake:0, isRune, runeData, pulsePhase: Math.random()*Math.PI*2 };
}

function initBoard() {
  board = [];
  for (let r=0; r<ROWS; r++) {
    board[r] = [];
    for (let c=0; c<COLS; c++) {
      let type, tries=0;
      do { type = randomType(); tries++; } while (tries < 30 && causesMatch(board,r,c,type));
      board[r][c] = makeGem(type, r*GEM_SIZE, r*GEM_SIZE);
    }
  }
  runesOnBoard = 0; updateRunesOnBoard();
}

// ── RUNE SPAWNING ─────────────────────────────────────────────────────────────
function spawnRuneGem() {
  const lvl = LEVELS[level];
  if (runesOnBoard >= lvl.maxRunes || !gameActive || isPaused) return;
  const candidates = [];
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++)
    if (board[r][c] && !board[r][c].isRune) candidates.push([r,c]);
  if (!candidates.length) return;
  const [r,c] = candidates[Math.floor(Math.random()*candidates.length)];
  const q = getNextQuestion();
  if (!q) return;
  board[r][c].isRune   = true;
  board[r][c].runeData = q;
  board[r][c].scale    = 0.05;
  runesOnBoard++;
  updateRunesOnBoard();
  showRuneAlert(`✦ Rune Gem appeared! Match it to unlock a ${selectedTopic.name} challenge!`);
}

function updateRunesOnBoard() { runesOnBoardEl.textContent = runesOnBoard; }

function updateRuneProgress() {
  const pct = Math.min(100, score / Math.max(1, scoreToNextRune) * 100);
  runeBarFill.style.width = pct + '%';
  runeCountInfo.textContent = `${Math.min(score, scoreToNextRune).toLocaleString()} / ${scoreToNextRune.toLocaleString()} pts`;
}

// ── COLOR HELPERS ─────────────────────────────────────────────────────────────
function hexToRgb(h) { return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function lighten(h,a) { const[r,g,b]=hexToRgb(h); return `rgb(${Math.min(255,r+255*a)|0},${Math.min(255,g+255*a)|0},${Math.min(255,b+255*a)|0})`; }
function darken(h,a)  { const[r,g,b]=hexToRgb(h); return `rgb(${Math.max(0,r-255*a)|0},${Math.max(0,g-255*a)|0},${Math.max(0,b-255*a)|0})`; }

// ── DRAW GEM ──────────────────────────────────────────────────────────────────
function drawGem(gem, col, row) {
  if (!gem) return;
  const isSel  = selected  && selected.row===row  && selected.col===col;
  const isHint = hintCell  && hintCell.row===row  && hintCell.col===col;
  const cx = col*GEM_SIZE + GEM_SIZE/2 + gem.shake;
  const cy = gem.y + GEM_SIZE/2;
  const s  = GEM_SIZE * gem.scale * .86;
  const r  = s * .42;
  const cl = gem.isRune ? '#ffd700' : ECOLORS[gem.type];

  ctx.save();
  ctx.globalAlpha = gem.opacity;
  ctx.translate(cx, cy);

  if (isSel)      { ctx.shadowBlur=34; ctx.shadowColor=cl; ctx.scale(1.13,1.13); }
  else if (isHint){ const p=.6+.4*Math.sin(Date.now()*.008); ctx.shadowBlur=26*p; ctx.shadowColor='#fff'; ctx.scale(1+.05*p,1+.05*p); }
  else if (gem.isRune){ const p=.5+.5*Math.sin(Date.now()*.004+gem.pulsePhase); ctx.shadowBlur=18+18*p; ctx.shadowColor='#ffd700'; }
  else            { ctx.shadowBlur=10; ctx.shadowColor=EGLOW[gem.type]; }

  // Hexagon
  ctx.beginPath();
  for (let i=0; i<6; i++) {
    const ang = (i*Math.PI/3) - Math.PI/6;
    i===0 ? ctx.moveTo(Math.cos(ang)*r, Math.sin(ang)*r) : ctx.lineTo(Math.cos(ang)*r, Math.sin(ang)*r);
  }
  ctx.closePath();

  if (gem.isRune) {
    const grad = ctx.createRadialGradient(-r*.2,-r*.3,r*.05,0,0,r);
    grad.addColorStop(0,'#fffbe0'); grad.addColorStop(.4,'#ffd700'); grad.addColorStop(1,'#7a5200');
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createRadialGradient(-r*.2,-r*.3,r*.05,0,0,r);
    grad.addColorStop(0,lighten(cl,.5)); grad.addColorStop(.55,cl); grad.addColorStop(1,darken(cl,.38));
    ctx.fillStyle = grad;
  }
  ctx.fill();
  ctx.strokeStyle = isSel ? '#ffffff' : lighten(cl,.38);
  ctx.lineWidth   = isSel ? 2.5 : gem.isRune ? 2 : 1.4;
  ctx.stroke();

  // Shine spot
  ctx.beginPath(); ctx.arc(-r*.18,-r*.22,r*.26,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.shadowBlur=0; ctx.fill();

  // Label
  if (gem.isRune) {
    const abbr = gem.runeData?.abbr || '?';
    const fs   = abbr.length > 4 ? Math.max(7,Math.floor(s*.18)) : abbr.length > 3 ? Math.max(8,Math.floor(s*.21)) : Math.max(10,Math.floor(s*.25));
    ctx.font = `bold ${fs}px 'Rajdhani',sans-serif`;
    ctx.fillStyle='#3d1f00'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowBlur=6; ctx.shadowColor='#7a4000'; ctx.globalAlpha=gem.opacity*.95;
    ctx.fillText(abbr, 0, 1);
    ctx.font=`${Math.floor(s*.15)}px serif`; ctx.globalAlpha=gem.opacity*.5; ctx.fillStyle='#7a4000';
    ctx.fillText('✦', 0, -r*.64);
  } else {
    ctx.font=`${Math.floor(s*.36)}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowBlur=0; ctx.globalAlpha=gem.opacity*.92;
    ctx.fillText(EEMOJI[gem.type], 0, 1);
  }
  ctx.restore();
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderBoard() {
  ctx.clearRect(0,0,W,H);
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) {
    ctx.fillStyle = (r+c)%2===0 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.015)';
    ctx.beginPath(); ctx.roundRect(c*GEM_SIZE+2,r*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  if (selected) {
    ctx.fillStyle = 'rgba(255,215,0,.12)'; ctx.beginPath();
    ctx.roundRect(selected.col*GEM_SIZE+2,selected.row*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) if (board[r]?.[c]) drawGem(board[r][c],c,r);
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function spawnP(col,row,type,n=18) {
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for (let i=0; i<n; i++) {
    const a=Math.random()*Math.PI*2, sp=2+Math.random()*4;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,size:3+Math.random()*4,color:ECOLORS[type],alpha:1,decay:.025+Math.random()*.02,gravity:.12,sparkle:false});
  }
}
function spawnRP(col,row,color,n=35) {
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for (let i=0; i<n; i++) {
    const a=Math.random()*Math.PI*2, sp=3+Math.random()*7;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,size:4+Math.random()*6,color,alpha:1,decay:.018+Math.random()*.014,gravity:.09,sparkle:true});
  }
}
function spawnRuneParticles(col,row) {
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for (let i=0; i<55; i++) {
    const a=Math.random()*Math.PI*2, sp=4+Math.random()*9;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-3.5,size:5+Math.random()*7,color:'#ffd700',alpha:1,decay:.014+Math.random()*.012,gravity:.08,sparkle:true});
  }
}
function updateParticles() {
  pCtx.clearRect(0,0,W,H);
  particles = particles.filter(p => p.alpha > .01);
  particles.forEach(p => {
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=.97; p.alpha-=p.decay;
    pCtx.save(); pCtx.globalAlpha=Math.max(0,p.alpha);
    if (p.sparkle) { pCtx.shadowBlur=10; pCtx.shadowColor=p.color; }
    pCtx.beginPath(); pCtx.arc(p.x,p.y,p.size*p.alpha+.5,0,Math.PI*2);
    pCtx.fillStyle=p.color; pCtx.fill(); pCtx.restore();
  });
}

// ── POPUP ─────────────────────────────────────────────────────────────────────
function showPopup(col, row, text, color='#ffe066') {
  const el = document.createElement('div');
  el.className='score-popup'; el.textContent=text; el.style.color=color;
  const wr = wrapper.getBoundingClientRect();
  el.style.left   = (wr.left + col*GEM_SIZE*(wr.width/W)  + GEM_SIZE*(wr.width/W)/2) + 'px';
  el.style.top    = (wr.top  + row*GEM_SIZE*(wr.height/H)) + 'px';
  el.style.position='fixed'; el.style.transform='translateX(-50%)';
  document.body.appendChild(el); setTimeout(()=>el.remove(), 1200);
}

// ── MATCH FINDING — HORIZONTAL & VERTICAL ONLY ────────────────────────────────
function findMatches() {
  const m = new Set();

  // Horizontal
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS-2; c++) {
      const t = board[r][c]?.type; if (!t) continue;
      if (board[r][c+1]?.type===t && board[r][c+2]?.type===t) {
        let e = c+2;
        while (e+1 < COLS && board[r][e+1]?.type===t) e++;
        for (let i=c; i<=e; i++) m.add(`${r},${i}`);
        c = e;
      }
    }
  }

  // Vertical
  for (let c=0; c<COLS; c++) {
    for (let r=0; r<ROWS-2; r++) {
      const t = board[r][c]?.type; if (!t) continue;
      if (board[r+1][c]?.type===t && board[r+2][c]?.type===t) {
        let e = r+2;
        while (e+1 < ROWS && board[e+1][c]?.type===t) e++;
        for (let i=r; i<=e; i++) m.add(`${i},${c}`);
        r = e;
      }
    }
  }

  return m;
}

// ── REACTIONS ─────────────────────────────────────────────────────────────────
function checkReactions(matchedSet) {
  const cells = [...matchedSet].map(k => {
    const [r,c] = k.split(',').map(Number);
    return { r, c, type: board[r][c]?.type };
  }).filter(x => x.type);
  let total = 0; const seen = new Set();
  cells.forEach((a,i) => cells.slice(i+1).forEach(b => {
    const key = [a.type,b.type].sort().join(':');
    if (seen.has(key)) return;
    const rx = REACTIONS.find(rx => (rx.a===a.type&&rx.b===b.type)||(rx.a===b.type&&rx.b===a.type));
    if (rx) {
      seen.add(key); total += rx.bonus;
      const mc=Math.floor((a.c+b.c)/2), mr=Math.floor((a.r+b.r)/2);
      spawnRP(mc,mr,rx.color,40);
      setTimeout(()=>showPopup(mc,mr,`${rx.label} +${rx.bonus}`,rx.color),80);
    }
  }));
  return total;
}

// ── PROCESS MATCHES ───────────────────────────────────────────────────────────
async function processMatches() {
  let chainDepth = 0;
  while (true) {
    const matched = findMatches(); if (matched.size === 0) break;
    chainDepth++; combo++; if (combo > bestCombo) bestCombo = combo;
    updateComboUI();

    const matchCells = [...matched].map(k => k.split(',').map(Number));
    const runeMatches = matchCells.filter(([r,c]) => board[r][c]?.isRune);
    const rxBonus = checkReactions(matched);

    const groups = {};
    matchCells.forEach(([r,c]) => {
      const t = board[r][c]?.type;
      if (t) groups[t] = (groups[t]||[]).concat([[r,c]]);
    });
    let ms = 0;
    Object.entries(groups).forEach(([type, gc]) => {
      const n    = Math.min(gc.length, 5);
      const base = BSCORE[n] || (n*80);
      const pts  = Math.floor(base * (1+(combo-1)*.25) * (1+(chainDepth-1)*.35));
      ms += pts;
      const mid = gc[Math.floor(gc.length/2)];
      spawnP(mid[1],mid[0],type,22);
      setTimeout(()=>showPopup(mid[1],mid[0],`+${pts}`,ECOLORS[type]),50);
    });
    addScore(ms + rxBonus, 'gem');

    matchCells.forEach(([r,c]) => { if (board[r][c]) { board[r][c].scale=.01; board[r][c].opacity=0; } });
    await sleep(260);

    const runeQuestions = runeMatches.map(([r,c]) => ({...board[r][c].runeData, boardCol:c, boardRow:r}));
    runeMatches.forEach(() => runesOnBoard = Math.max(0, runesOnBoard-1));
    updateRunesOnBoard();
    matchCells.forEach(([r,c]) => { board[r][c] = null; });

    // Gravity
    for (let c=0; c<COLS; c++) {
      let wr = ROWS-1;
      for (let r=ROWS-1; r>=0; r--) {
        if (board[r][c]) {
          if (r !== wr) { board[wr][c]=board[r][c]; board[wr][c].targetY=wr*GEM_SIZE; board[r][c]=null; }
          wr--;
        }
      }
    }
    await sleep(260);

    // Refill
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++)
      if (!board[r][c]) board[r][c] = makeGem(randomType(), -GEM_SIZE*(Math.floor(Math.random()*3)+1), r*GEM_SIZE);
    await sleep(300);

    // Rune questions
    if (runeQuestions.length > 0 && !questionActive) {
      for (const qd of runeQuestions) {
        spawnRuneParticles(qd.boardCol||4, qd.boardRow||4);
        await sleep(450);
        await askRuneQuestion(qd);
      }
    }
  }
  if (chainDepth === 0) combo = 0;
  updateComboUI();
}

// ── QUESTION SYSTEM ───────────────────────────────────────────────────────────
const DIFF_LABELS = ['','🟢 Easy','🔵 Medium','🟣 Challenging','🟠 Hard','🔴 Expert'];
const DIFF_COLORS = ['','#7fff5e','#00c8ff','#a78bfa','#ff9a00','#ff4e1a'];

function askRuneQuestion(qData) {
  return new Promise(resolve => {
    if (!gameActive) { resolve(); return; }
    questionActive = true;
    const lvl = LEVELS[level];
    const overlay = document.getElementById('question-overlay');

    document.getElementById('q-rune-letter').textContent = qData.abbr || '?';
    document.getElementById('q-topic-name').textContent  = `${selectedTopic.icon} ${selectedTopic.name}`;
    const db = document.getElementById('q-diff-badge');
    db.textContent  = DIFF_LABELS[lvl.aiDiff] || lvl.label;
    db.style.color        = DIFF_COLORS[lvl.aiDiff] || '#fff';
    db.style.borderColor  = DIFF_COLORS[lvl.aiDiff] || '#fff';
    document.getElementById('q-question-text').textContent = qData.q;
    document.getElementById('q-bonus').textContent   = lvl.correctBonus;
    document.getElementById('q-penalty').textContent = lvl.wrongPenalty;
    document.getElementById('q-feedback').textContent    = '';
    document.getElementById('q-feedback').className      = 'q-feedback';
    document.getElementById('q-explanation').textContent = '';
    document.getElementById('q-source').textContent      = usingAI
      ? '✦ Unique question generated by AI for this session'
      : '✦ Using built-in question bank';

    const choicesEl = document.getElementById('q-choices');
    choicesEl.innerHTML = '';
    const shuffled = shuffleChoices(qData.choices, qData.answer);
    shuffled.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-choice';
      btn.innerHTML = `<strong>${String.fromCharCode(65+i)}.</strong> ${choice}`;
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        choicesEl.querySelectorAll('.q-choice').forEach(b => { b.disabled=true; });
        clearInterval(questionTimerInterval);
        handleAnswer(i===shuffled.correctIndex, shuffled.correctIndex, qData.explanation||'', lvl, choicesEl, resolve);
      });
      choicesEl.appendChild(btn);
    });

    // Timer
    const timerBar = document.getElementById('q-timer-bar');
    timerBar.style.transition='none'; timerBar.style.width='100%';
    timerBar.style.background='linear-gradient(90deg,#ffd700,#ff9a00)';
    let elapsed = 0;
    setTimeout(() => {
      timerBar.style.transition = `width ${lvl.questionTime}s linear`;
      timerBar.style.width = '0%';
    }, 60);
    questionTimerInterval = setInterval(() => {
      elapsed += .1;
      if (lvl.questionTime - elapsed < 5) timerBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)';
      if (elapsed >= lvl.questionTime) {
        clearInterval(questionTimerInterval);
        choicesEl.querySelectorAll('.q-choice').forEach(b => { b.disabled=true; });
        handleAnswer(false, shuffled.correctIndex, qData.explanation||'', lvl, choicesEl, resolve, true);
      }
    }, 100);

    overlay.classList.add('active');
  });
}

function handleAnswer(isCorrect, correctIndex, explanation, lvl, choicesEl, resolve, timedOut=false) {
  runesAnswered++;
  const choices  = choicesEl.querySelectorAll('.q-choice');
  const feedback = document.getElementById('q-feedback');
  const explEl   = document.getElementById('q-explanation');

  choices[correctIndex].classList.add('reveal');

  if (isCorrect) {
    runesCorrect++;
    choices[correctIndex].classList.add('correct');
    feedback.textContent = `✅ Correct! +${lvl.correctBonus} pts & +2 moves!`;
    feedback.className   = 'q-feedback good';
    addScore(lvl.correctBonus, 'rune');
    runeEl.textContent = runesCorrect;
    movesLeft += 2; updateMovesUI();
    spawnRP(3,3,'#7fff5e',30); spawnRP(5,3,'#ffd700',30);
  } else {
    Array.from(choices).forEach((b,i) => { if (i!==correctIndex && b.disabled && !b.classList.contains('reveal')) b.classList.add('wrong'); });
    feedback.textContent = timedOut ? `⏰ Time's up! −${lvl.wrongPenalty} moves` : `❌ Incorrect! −${lvl.wrongPenalty} moves`;
    feedback.className   = 'q-feedback bad';
    movesLeft = Math.max(0, movesLeft - lvl.wrongPenalty);
    updateMovesUI();
    spawnRP(4,4,'#ff4e1a',20);
  }
  if (explanation) explEl.textContent = `💡 ${explanation}`;
  updateStats();

  setTimeout(() => {
    document.getElementById('question-overlay').classList.remove('active');
    questionActive = false; resolve();
    if (movesLeft <= 0 && gameActive) { gameActive=false; clearTimeout(hintTimeout); setTimeout(showGameOver,600); }
  }, 2800);
}

function shuffleChoices(choices, correctIndex) {
  const indexed  = choices.map((c,i) => ({c,i}));
  const shuffled = shuffleArray(indexed);
  return { choices: shuffled.map(x=>x.c), correctIndex: shuffled.findIndex(x=>x.i===correctIndex) };
}

// ── SWAP ──────────────────────────────────────────────────────────────────────
async function trySwap(r1,c1,r2,c2) {
  if (animating || questionActive || isPaused) return;
  if (Math.abs(r1-r2) + Math.abs(c1-c2) !== 1) { selected={row:r2,col:c2}; return; }

  animating=true; selected=null;
  const g1=board[r1][c1], g2=board[r2][c2];
  board[r1][c1]=g2; board[r2][c2]=g1;
  if (g1) g1.targetY=r2*GEM_SIZE;
  if (g2) g2.targetY=r1*GEM_SIZE;
  await sleep(SWAP_MS);

  if (findMatches().size === 0) {
    board[r1][c1]=g1; board[r2][c2]=g2;
    if (g1) g1.targetY=r1*GEM_SIZE;
    if (g2) g2.targetY=r2*GEM_SIZE;
    shakeGem(r1,c1); shakeGem(r2,c2);
    await sleep(SWAP_MS);
  } else {
    movesLeft--; updateMovesUI();
    await processMatches();
  }
  animating=false; resetHintTimer(); checkGameState();
}

function shakeGem(r,c) {
  if (!board[r]?.[c]) return; let t=0;
  const iv = setInterval(() => {
    if (!board[r]?.[c]) { clearInterval(iv); return; }
    board[r][c].shake = Math.sin(t*2.8)*5; t++;
    if (t > SHAKE_N) { board[r][c].shake=0; clearInterval(iv); }
  }, 28);
}

// ── CLICK ─────────────────────────────────────────────────────────────────────
canvas.addEventListener('click', (e) => {
  if (!gameActive || animating || questionActive || isPaused) return;
  const rect   = canvas.getBoundingClientRect();
  const scaleX = W / rect.width, scaleY = H / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top)  * scaleY;
  const col = Math.floor(mx / GEM_SIZE), row = Math.floor(my / GEM_SIZE);
  if (row<0||row>=ROWS||col<0||col>=COLS||!board[row]?.[col]) return;
  if (!selected)                                    selected = {row,col};
  else if (selected.row===row && selected.col===col) selected = null;
  else                                               trySwap(selected.row,selected.col,row,col);
});

// Keyboard shortcut for pause
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
    if (gameActive || isPaused) window.togglePause();
  }
});

// ── SCORE ─────────────────────────────────────────────────────────────────────
function addScore(pts, source='gem') {
  if (pts <= 0) return;
  const prev = score; score += pts; scoreThisLevel += pts;
  if (source==='gem') gemScoreThisLevel+=pts; else runeScoreThisLevel+=pts;
  if (score > bestScore) { bestScore=score; localStorage.setItem('cryst5_best',bestScore); }
  animCount(scoreEl, prev, score, 380);
  animCount(bestEl, parseInt(bestEl.textContent.replace(/,/g,''))||0, bestScore, 380);
  scoreEl.classList.add('pop'); setTimeout(()=>scoreEl.classList.remove('pop'), 280);
  checkRuneSpawn(); updateRuneProgress();
}

function checkRuneSpawn() {
  if (score >= scoreToNextRune) {
    const lvl = LEVELS[level];
    scoreToNextRune = score + lvl.runeEvery;
    setTimeout(spawnRuneGem, 500);
  }
}

function animCount(el, from, to, dur) {
  const start=performance.now(), diff=to-from;
  function step(now) {
    const p=Math.min(1,(now-start)/dur), e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(from+diff*e).toLocaleString();
    if (p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateComboUI() {
  if (combo > 1) {
    comboNum.textContent = combo; comboEl.classList.add('visible');
    clearTimeout(comboEl._t); comboEl._t = setTimeout(()=>comboEl.classList.remove('visible'), 2200);
  } else comboEl.classList.remove('visible');
}

function updateMovesUI() {
  const max = LEVELS[level].moves;
  movesCount.textContent = `${movesLeft} / ${max}`;
  const pct = movesLeft/max*100; movesBar.style.width=pct+'%';
  if (pct<=25) { movesBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)'; movesBar.style.boxShadow='0 0 8px rgba(255,78,26,.7)'; }
  else if (pct<=50) { movesBar.style.background='linear-gradient(90deg,#ffe033,#ffaa44)'; movesBar.style.boxShadow='0 0 8px rgba(255,224,51,.5)'; }
  else { movesBar.style.background='linear-gradient(90deg,#a78bfa,#60d0ff)'; movesBar.style.boxShadow='0 0 8px rgba(96,208,255,.6)'; }
}

function updateStats() {
  document.getElementById('stat-q').textContent  = runesAnswered;
  document.getElementById('stat-c').textContent  = runesCorrect;
  document.getElementById('stat-a').textContent  = runesAnswered>0 ? Math.round(runesCorrect/runesAnswered*100)+'%' : '—';
  document.getElementById('stat-bc').textContent = bestCombo;
}

// ── HINT ──────────────────────────────────────────────────────────────────────
function resetHintTimer() {
  hintCell=null; clearTimeout(hintTimeout);
  if (!gameActive || isPaused) return;
  hintTimeout = setTimeout(()=>{ hintCell=findBestHint(); }, 5000);
}
function findBestHint() {
  let best=-1, bc=null;
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) {
    for (const [nr,nc] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]) {
      if (nr<0||nr>=ROWS||nc<0||nc>=COLS) continue;
      const tmp=board[r][c]; board[r][c]=board[nr][nc]; board[nr][nc]=tmp;
      const cnt=findMatches().size; board[nr][nc]=board[r][c]; board[r][c]=tmp;
      if (cnt>best) { best=cnt; bc={row:r,col:c}; }
    }
  }
  return best>0 ? bc : null;
}

// ── DIFFICULTY PANEL ──────────────────────────────────────────────────────────
function updateDifficultyPanel() {
  const lvl = LEVELS[level];
  document.getElementById('difficulty-panel').innerHTML = `
    <div class="stat-row"><span class="stat-key">Level</span><span class="stat-val" style="color:${lvl.diffColor}">${lvl.label}</span></div>
    <div class="stat-row"><span class="stat-key">Timer</span><span class="stat-val">${lvl.questionTime}s</span></div>
    <div class="stat-row"><span class="stat-key">✅ Bonus</span><span class="stat-val gold">+${lvl.correctBonus}pts</span></div>
    <div class="stat-row"><span class="stat-key">❌ Penalty</span><span class="stat-val" style="color:#ff4e1a">−${lvl.wrongPenalty}mv</span></div>
    <div class="stat-row"><span class="stat-key">Max Runes</span><span class="stat-val">${lvl.maxRunes}</span></div>
  `;
}

// ── GAME STATE ────────────────────────────────────────────────────────────────
function checkGameState() {
  if (score >= LEVELS[level].target) { gameActive=false; clearTimeout(hintTimeout); setTimeout(showLevelComplete,500); }
  else if (movesLeft<=0 && !questionActive) { gameActive=false; clearTimeout(hintTimeout); setTimeout(showGameOver,500); }
}

function showLevelComplete() {
  const lvl      = LEVELS[level];
  const isLast   = level >= LEVELS.length - 1;
  const stars    = score >= lvl.target*2 ? 3 : score >= lvl.target*1.4 ? 2 : 1;
  const nextLvl  = !isLast ? LEVELS[level+1] : null;

  const feedbackByStars = [
    '', // 0 stars unused
    'You made it! Push harder next level 💪',
    'Solid run! Keep chaining those combos! ✨',
    'Outstanding! You\'re a natural! 🔮',
  ];
  const levelTitles = [
    '✦ Level Complete!',      // 1
    '✦ Level Complete!',      // 2
    '🔥 Rising Scholar!',     // 3
    '⚡ Adept Cleared!',      // 4
    '🌿 Veteran Achieved!',   // 5
    '💜 Expert Unlocked!',    // 6
    '🌟 Elite Status!',       // 7
    '🏆 You Are a Master!',   // 8 (last)
  ];

  document.getElementById('level-title').textContent = isLast
    ? '🏆 Grand Master! You Beat the Game!'
    : (levelTitles[level] || '✦ Level Complete!');

  document.getElementById('level-score').textContent    = score.toLocaleString();
  document.getElementById('level-feedback').textContent = isLast
    ? 'You conquered all 8 levels! Incredible! 🏆'
    : feedbackByStars[stars] || 'Great run!';

  document.getElementById('score-breakdown').innerHTML = `
    <div class="breakdown-row"><span class="label">Gem Matches</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Bonuses</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Quiz Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
    <div class="breakdown-row"><span class="label">Best Combo</span><span class="val">x${bestCombo}</span></div>
    ${nextLvl ? `<div class="breakdown-row"><span class="label">Next Target</span><span class="val" style="color:#ffd700">${nextLvl.target.toLocaleString()} pts</span></div>` : ''}
    <div class="breakdown-row"><span class="label">Level</span><span class="val" style="color:${lvl.diffColor}">${lvl.label} (${level+1}/${LEVELS.length})</span></div>
  `;

  document.querySelectorAll('.star').forEach((el,i) => {
    el.classList.remove('lit');
    if (i<stars) setTimeout(()=>el.classList.add('lit'), 180+i*160);
  });
  document.getElementById('level-overlay').classList.add('active');
  const celebColors = ['#ff4e1a','#00c8ff','#ffe033','#cc44ff','#ffd700','#7fff5e'];
  const bursts = isLast ? 16 : 8;
  for (let i=0;i<bursts;i++) setTimeout(()=>spawnRP(
    Math.floor(Math.random()*COLS), Math.floor(Math.random()*ROWS),
    celebColors[i%celebColors.length], isLast?40:25
  ), i*80);
}

function showGameOver() {
  document.getElementById('final-score').textContent = score.toLocaleString();
  const pct = score / LEVELS[level].target;
  document.getElementById('go-breakdown').innerHTML = `
    <div class="breakdown-row"><span class="label">Gem Score</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Score</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
  `;
  document.getElementById('gameover-feedback').textContent = pct>=.8 ? 'So close! Try again! 💜' : pct>=.5 ? 'Good effort — use Rune bonuses!' : 'Match Rune Gems for big score boosts!';
  document.getElementById('gameover-overlay').classList.add('active');
}

// ── LEVEL CONTROL ─────────────────────────────────────────────────────────────
function beginLevel() {
  score=0; combo=0; bestCombo=0; animating=false; selected=null; particles=[]; hintCell=null;
  questionActive=false; isPaused=false;
  scoreThisLevel=0; gemScoreThisLevel=0; runeScoreThisLevel=0; runesOnBoard=0;
  runesAnswered=0; runesCorrect=0;
  pauseOverlay.classList.remove('active'); canvasPaused.classList.remove('visible');
  pauseIcon.textContent='⏸'; pauseLabel.textContent='Pause';

  const lvl = LEVELS[level];
  movesLeft    = lvl.moves;
  scoreToNextRune = lvl.runeThreshold;

  scoreEl.textContent = '0'; levelEl.textContent = level+1;
  bestEl.textContent  = bestScore.toLocaleString(); runeEl.textContent='0';
  targetEl.textContent = lvl.target.toLocaleString();
  objEl.textContent    = lvl.label;
  updateMovesUI(); updateDifficultyPanel(); updateStats();
  comboEl.classList.remove('visible'); runeAlertEl.classList.remove('visible');
  runeBarFill.style.width='0%';
  runeCountInfo.textContent=`0 / ${lvl.runeThreshold.toLocaleString()} pts`;
  initBoard(); gameActive=true; resetHintTimer();
}

window.nextLevel = async function() {
  document.getElementById('level-overlay').classList.remove('active');
  level = level < LEVELS.length-1 ? level+1 : 0;
  await prefetchQuestions(level);
  beginLevel();
};

window.restartGame = function() {
  ['level-overlay','gameover-overlay','pause-overlay'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('active');
  });
  canvasPaused.classList.remove('visible');
  isPaused=false; level=0; beginLevel();
};

// ── PHYSICS UPDATE ────────────────────────────────────────────────────────────
function updateBoard() {
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) {
    const g = board[r]?.[c]; if (!g) continue;
    const dy = g.targetY - g.y; g.y += dy*.2; if (Math.abs(dy)<.4) g.y=g.targetY;
    g.scale += (1-g.scale)*.14;
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shuffleArray(arr) {
  const a=[...arr];
  for (let i=a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// ── MAIN LOOP ─────────────────────────────────────────────────────────────────
function gameLoop() {
  drawStars();
  if (!isPaused) { updateBoard(); renderBoard(); updateParticles(); }
  requestAnimationFrame(gameLoop);
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => { bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight; initStars(); });
buildTopicGrid();
initStars();
requestAnimationFrame(gameLoop);