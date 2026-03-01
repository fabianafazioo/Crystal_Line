/* ================================================================
   CRYSTALLINE v6
   - Longer question timers (no rush)
   - Rune gems inherit element type → explode in their color
   - Lower base scores (50–150), lower reaction bonuses (55–100)
   - 8 longer levels
   - Home button, separated pause/restart
   - Mobile info drawer
   ================================================================ */
'use strict';

// ── TOPICS ───────────────────────────────────────────────────────────────────
const TOPICS = {
  science:   { name:'Science',     icon:'🔬', desc:'Physics, chemistry & biology',   color:'#00c8ff' },
  math:      { name:'Mathematics', icon:'📐', desc:'Algebra, geometry & calculus',    color:'#a78bfa' },
  history:   { name:'History',     icon:'🏛️', desc:'World events & civilizations',   color:'#ff9a00' },
  coding:    { name:'Coding',      icon:'💻', desc:'Programming & computer science',  color:'#7fff5e' },
  biology:   { name:'Biology',     icon:'🌿', desc:'Life, cells & ecosystems',        color:'#96f7d2' },
  geography: { name:'Geography',   icon:'🌍', desc:'Countries, capitals & nature',    color:'#ff6b9d' },
  art:       { name:'Art & Music', icon:'🎨', desc:'Artists, movements & composers',  color:'#e0c3fc' },
  space:     { name:'Space',       icon:'🚀', desc:'Astronomy & the cosmos',          color:'#60d0ff' },
};

// ── FALLBACK QUESTIONS ────────────────────────────────────────────────────────
const FALLBACK = {
  science:[
    {abbr:'DNA', q:'What does DNA stand for?',choices:['Deoxyribonucleic Acid','Dynamic Neural Assembly','Di-Nucleic Arrangement','Distributed Neuron Array'],answer:0,explanation:'DNA carries the genetic blueprint for all living things.'},
    {abbr:'Hz',  q:'Hertz (Hz) measures:',choices:['Temperature','Frequency','Pressure','Energy'],answer:1,explanation:'Hertz measures cycles per second.'},
    {abbr:'ATP', q:'ATP is the primary energy currency of:',choices:['Rocks','Cells','Stars','Oceans'],answer:1,explanation:'Adenosine Triphosphate powers most cellular processes.'},
    {abbr:'pH',  q:'A pH of 7 means a solution is:',choices:['Acidic','Basic','Neutral','Saturated'],answer:2,explanation:'pH 7 is neutral.'},
    {abbr:'c',   q:'In E=mc², "c" stands for:',choices:['Charge','Speed of light','A constant','Concentration'],answer:1,explanation:'c is the speed of light, ~3×10⁸ m/s.'},
    {abbr:'CO₂', q:'CO₂ is:',choices:['Carbon Dioxide','Carbon Monoxide','Calcium Dioxide','Copper Oxide'],answer:0,explanation:'Carbon Dioxide is a key greenhouse gas.'},
  ],
  math:[
    {abbr:'π',  q:'π (pi) is approximately:',choices:['2.718','3.14159','1.618','4.669'],answer:1,explanation:'Pi is the ratio of circumference to diameter.'},
    {abbr:'√',  q:'What is √144?',choices:['11','12','13','14'],answer:1,explanation:'12 × 12 = 144.'},
    {abbr:'∑',  q:'The symbol ∑ represents:',choices:['Product','Summation','Difference','Average'],answer:1,explanation:'Sigma denotes summation.'},
    {abbr:'i',  q:'The imaginary unit i equals:',choices:['√-1','√1','-1','1/2'],answer:0,explanation:'i = √-1.'},
    {abbr:'e',  q:"Euler's number e ≈ 2.718 is the base of:",choices:['Log base 10','Natural logarithm','Square root','Factorial'],answer:1,explanation:'e is the base of the natural logarithm.'},
  ],
  history:[
    {abbr:'WWI', q:'WWI began in:',choices:['1908','1912','1914','1918'],answer:2,explanation:'WWI started in 1914.'},
    {abbr:'UN',  q:'The UN was founded after:',choices:['WWI','Korean War','WWII','Vietnam War'],answer:2,explanation:'The UN was established in 1945 after WWII.'},
    {abbr:'USSR',q:'The USSR dissolved in:',choices:['1985','1989','1991','1995'],answer:2,explanation:'The Soviet Union dissolved December 25, 1991.'},
    {abbr:'D-Day',q:'D-Day (June 6, 1944) was the Allied invasion of:',choices:['Italy','Germany','Normandy, France','Poland'],answer:2,explanation:'The Normandy landings were the largest seaborne invasion in history.'},
  ],
  coding:[
    {abbr:'HTML',q:'HTML stands for:',choices:['HyperText Markup Language','High Transfer Markup Logic','Hyper Tool Making Language','HyperText Machine Learning'],answer:0,explanation:'HTML is the standard language for web pages.'},
    {abbr:'API', q:'API enables:',choices:['Faster internet','Software communication','Better graphics','Data storage'],answer:1,explanation:'An API allows different software systems to communicate.'},
    {abbr:'Git', q:'Git is a:',choices:['Programming language','Database','Version control system','Web framework'],answer:2,explanation:'Git tracks code changes so teams can collaborate.'},
    {abbr:'RAM', q:'RAM stands for:',choices:['Read Access Memory','Random Access Memory','Rapid Array Module','Read And Modify'],answer:1,explanation:'Random Access Memory is your computer\'s working memory.'},
  ],
  biology:[
    {abbr:'mRNA',q:'mRNA carries instructions for making:',choices:['Fats','Minerals','Proteins','Carbohydrates'],answer:2,explanation:'Messenger RNA carries the genetic code to ribosomes.'},
    {abbr:'RBC', q:'Red Blood Cells mainly:',choices:['Fight infection','Carry oxygen','Clot blood','Digest food'],answer:1,explanation:'RBCs contain hemoglobin which transports oxygen.'},
    {abbr:'CNS', q:'The CNS consists of the brain and:',choices:['Heart','Lungs','Spinal cord','Kidneys'],answer:2,explanation:'CNS = brain + spinal cord.'},
    {abbr:'GMO', q:'GMO stands for Genetically Modified:',choices:['Output','Organism','Origin','Operation'],answer:1,explanation:'GMOs have altered genetic material.'},
  ],
  geography:[
    {abbr:'GMT', q:'GMT is used as:',choices:['A climate zone','A time standard','A map projection','A currency standard'],answer:1,explanation:'Greenwich Mean Time is the global time reference.'},
    {abbr:'Mt.', q:'Mt. Everest is in the:',choices:['Alps','Andes','Himalayas','Rockies'],answer:2,explanation:'Everest sits on the Nepal-China border in the Himalayas.'},
    {abbr:'lat', q:'Latitude lines run:',choices:['North to south','East to west','Diagonally','Vertically'],answer:1,explanation:'Latitude lines are horizontal circles parallel to the equator.'},
    {abbr:'USA', q:'How many states does the USA have?',choices:['48','49','50','52'],answer:2,explanation:'Hawaii became the 50th state in 1959.'},
  ],
  art:[
    {abbr:'MoMA',q:'MoMA stands for:',choices:['Museum of Modern Art','Museum of Many Arts','Ministry of Modern Arts','Museum of Musical Arts'],answer:0,explanation:'MoMA is one of the world\'s most influential art museums.'},
    {abbr:'Pop', q:'Andy Warhol is associated with which movement?',choices:['Cubism','Surrealism','Pop Art','Impressionism'],answer:2,explanation:'Warhol was the leading figure of Pop Art.'},
    {abbr:'DaV', q:"Da Vinci painted the Mona Lisa. He was also known as a:",choices:['Poet','Scientist & inventor','Politician','Musician'],answer:1,explanation:'Da Vinci was a Renaissance polymath.'},
  ],
  space:[
    {abbr:'AU',  q:'One AU is the distance from:',choices:['Earth to Moon','Sun to Mars','Earth to Sun','Sun to Jupiter'],answer:2,explanation:'1 AU ≈ 150 million km — the Earth-Sun distance.'},
    {abbr:'LY',  q:'A light-year measures:',choices:['Time','Distance','Brightness','Mass'],answer:1,explanation:'A light-year is the distance light travels in one year.'},
    {abbr:'ISS', q:'The ISS orbits Earth at approximately:',choices:['200 km','400 km','800 km','1200 km'],answer:1,explanation:'The ISS orbits at ~400 km altitude.'},
  ],
};

// ── LEVELS ────────────────────────────────────────────────────────────────────
// Question timers are generous — players need time to think.
// Base gem scores are low (50–150) so levels take real effort.
const LEVELS = [
  { moves:32, target:1200,  runeThreshold:220, runeEvery:320, maxRunes:1, questionTime:40, correctBonus:350,  wrongPenalty:1, label:'Novice',     diffColor:'#7fff5e', aiDiff:1 },
  { moves:30, target:2600,  runeThreshold:180, runeEvery:280, maxRunes:1, questionTime:36, correctBonus:450,  wrongPenalty:2, label:'Apprentice', diffColor:'#96f7d2', aiDiff:1 },
  { moves:28, target:4500,  runeThreshold:150, runeEvery:240, maxRunes:2, questionTime:32, correctBonus:580,  wrongPenalty:2, label:'Scholar',    diffColor:'#00c8ff', aiDiff:2 },
  { moves:26, target:7000,  runeThreshold:120, runeEvery:200, maxRunes:2, questionTime:28, correctBonus:700,  wrongPenalty:2, label:'Adept',      diffColor:'#a78bfa', aiDiff:3 },
  { moves:24, target:10500, runeThreshold:100, runeEvery:170, maxRunes:3, questionTime:24, correctBonus:820,  wrongPenalty:3, label:'Veteran',    diffColor:'#c084fc', aiDiff:3 },
  { moves:22, target:15000, runeThreshold:80,  runeEvery:140, maxRunes:3, questionTime:20, correctBonus:950,  wrongPenalty:3, label:'Expert',     diffColor:'#ff9a00', aiDiff:4 },
  { moves:20, target:21000, runeThreshold:60,  runeEvery:110, maxRunes:4, questionTime:17, correctBonus:1100, wrongPenalty:4, label:'Elite',      diffColor:'#f97316', aiDiff:4 },
  { moves:18, target:28000, runeThreshold:45,  runeEvery:85,  maxRunes:4, questionTime:14, correctBonus:1400, wrongPenalty:4, label:'Master',     diffColor:'#ff4e1a', aiDiff:5 },
];

// ── GEM CONSTANTS ─────────────────────────────────────────────────────────────
const COLS=8, ROWS=8, GEM_SIZE=58, SWAP_MS=220, SHAKE_N=10;
const ELEMENTS=['fire','water','ice','lightning','earth','shadow'];
const ECOLORS={fire:'#ff4e1a',water:'#00c8ff',ice:'#a8f0ff',lightning:'#ffe033',earth:'#7fff5e',shadow:'#cc44ff'};
const EGLOW={fire:'rgba(255,78,26,.7)',water:'rgba(0,200,255,.7)',ice:'rgba(168,240,255,.7)',lightning:'rgba(255,224,51,.7)',earth:'rgba(127,255,94,.7)',shadow:'rgba(204,68,255,.7)'};
const EEMOJI={fire:'🔥',water:'💧',ice:'❄️',lightning:'⚡',earth:'🌿',shadow:'🔮'};

// Reactions — lower bonuses (55–100) to keep scores balanced
const REACTIONS=[
  {a:'fire',      b:'ice',       bonus:60,  label:'Melt!',    color:'#ff9944'},
  {a:'water',     b:'lightning', bonus:75,  label:'Shock!',   color:'#88eeff'},
  {a:'lightning', b:'fire',      bonus:70,  label:'Ignite!',  color:'#ffdd55'},
  {a:'earth',     b:'water',     bonus:55,  label:'Absorb!',  color:'#88ff88'},
  {a:'fire',      b:'earth',     bonus:100, label:'Wildfire!',color:'#ff6600'},
  {a:'shadow',    b:'fire',      bonus:80,  label:'Phantom!', color:'#ee44ff'},
  {a:'shadow',    b:'water',     bonus:80,  label:'Phantom!', color:'#ee44ff'},
  {a:'shadow',    b:'ice',       bonus:80,  label:'Phantom!', color:'#ee44ff'},
  {a:'shadow',    b:'lightning', bonus:80,  label:'Phantom!', color:'#ee44ff'},
  {a:'shadow',    b:'earth',     bonus:80,  label:'Phantom!', color:'#ee44ff'},
];

// Base match scores: 3-match=50, 4-match=90, 5-match=150
const BSCORE={3:50, 4:90, 5:150};

// ── STATE ─────────────────────────────────────────────────────────────────────
let board=[],score=0,bestScore=parseInt(localStorage.getItem('cryst6_best')||'0');
let level=0,movesLeft=0,combo=0,bestCombo=0,selected=null,animating=false,gameActive=false;
let particles=[],hintCell=null,hintTimeout=null;
let topicKey=null,selectedTopic=null;
let runesAnswered=0,runesCorrect=0,runesOnBoard=0;
let scoreThisLevel=0,gemScoreThisLevel=0,runeScoreThisLevel=0;
let scoreToNextRune=0;
let questionActive=false,questionTimerInterval=null;
let aiCache={};
let usingAI=false;
let isPaused=false;
let infoDrawerOpen=false;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas  =document.getElementById('game-canvas');
const pCanvas =document.getElementById('particle-canvas');
const bgCanvas=document.getElementById('bg-canvas');
const ctx =canvas.getContext('2d');
const pCtx=pCanvas.getContext('2d');
const bgCtx=bgCanvas.getContext('2d');
const W=COLS*GEM_SIZE, H=ROWS*GEM_SIZE;
canvas.width=pCanvas.width=W;
canvas.height=pCanvas.height=H;

// ── DOM ───────────────────────────────────────────────────────────────────────
const scoreEl        = document.getElementById('score-display');
const levelEl        = document.getElementById('level-display');
const bestEl         = document.getElementById('best-display');
const runeEl         = document.getElementById('rune-display');
const comboEl        = document.getElementById('combo-display');
const comboNum       = document.getElementById('combo-num');
const movesCount     = document.getElementById('moves-count');
const movesBar       = document.getElementById('moves-bar-fill');
const targetEl       = document.getElementById('target-display');
const objEl          = document.getElementById('objective-display');
const wrapper        = document.getElementById('canvas-wrapper');
const runeAlertEl    = document.getElementById('rune-alert');
const runeAlertTxt   = document.getElementById('rune-alert-text');
const runeBarFill    = document.getElementById('rune-bar-fill');
const runeCountInfo  = document.getElementById('rune-count-info');
const runesOnBoardEl = document.getElementById('runes-on-board');
const aiLoadingEl    = document.getElementById('ai-loading');
const aiLoadingTxt   = document.getElementById('ai-loading-text');
const topBar         = document.getElementById('top-bar');
const pauseIcon      = document.getElementById('pause-icon');
const pauseLabel     = document.getElementById('pause-label');
const pauseOverlay   = document.getElementById('pause-overlay');
const canvasPaused   = document.getElementById('canvas-paused');
const infoDrawer     = document.getElementById('info-drawer');

// ── TOP BAR VISIBILITY ────────────────────────────────────────────────────────
function showTopBar()  { topBar.classList.add('visible'); }
function hideTopBar()  { topBar.classList.remove('visible'); }

// ── PAUSE ─────────────────────────────────────────────────────────────────────
window.togglePause = function() {
  if (!gameActive && !isPaused) return;
  isPaused = !isPaused;
  pauseOverlay.classList.toggle('active', isPaused);
  canvasPaused.classList.toggle('visible', isPaused);
  pauseIcon.textContent  = isPaused ? '▶' : '⏸';
  pauseLabel.textContent = isPaused ? 'Resume' : 'Pause';
  if (isPaused) { clearTimeout(hintTimeout); hintCell=null; }
  else          { resetHintTimer(); }
};

// ── HOME FLOW ─────────────────────────────────────────────────────────────────
window.confirmGoHome = function() {
  // Close pause overlay if open
  if (isPaused) {
    pauseOverlay.classList.remove('active');
    canvasPaused.classList.remove('visible');
  }
  document.getElementById('confirm-home-overlay').classList.add('active');
};
window.cancelGoHome = function() {
  document.getElementById('confirm-home-overlay').classList.remove('active');
  // Reopen pause if we came from pause menu
};
window.goToTopicSelect = function() {
  ['level-overlay','gameover-overlay','confirm-home-overlay','pause-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  canvasPaused.classList.remove('visible');
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('topic-screen').classList.remove('hidden');
  hideTopBar();
  topicKey=null; selectedTopic=null; isPaused=false; gameActive=false;
  if (infoDrawerOpen) toggleInfoDrawer();
};

// ── INFO DRAWER (mobile) ──────────────────────────────────────────────────────
window.toggleInfoDrawer = function() {
  infoDrawerOpen = !infoDrawerOpen;
  infoDrawer.classList.toggle('open', infoDrawerOpen);
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
  topicKey = key; selectedTopic = TOPICS[key];
  const btn = document.getElementById('start-btn');
  btn.textContent = `Begin with ${selectedTopic.name} ${selectedTopic.icon}`;
  btn.disabled = false;
}
window.confirmTopic = async function() {
  if (!topicKey) return;
  document.getElementById('topic-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('topic-badge').innerHTML = `${selectedTopic.icon} ${selectedTopic.name}`;
  showTopBar();
  aiCache = {}; level = 0;
  await prefetchQuestions(0);
  beginLevel();
};

// ── AI QUESTIONS ──────────────────────────────────────────────────────────────
async function prefetchQuestions(lvlIndex) {
  const key = `${topicKey}-${lvlIndex}`;
  if (aiCache[key] && aiCache[key].length >= 5) { usingAI=true; return; }
  showAILoading(`Generating ${LEVELS[lvlIndex].label} ${selectedTopic.name} questions…`);
  try {
    const url = `/api/questions?topic=${encodeURIComponent(topicKey)}&topicName=${encodeURIComponent(selectedTopic.name)}&level=${lvlIndex}&count=8`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Server ${res.status}`);
    const data = await res.json();
    if (data.error || !data.questions?.length) throw new Error(data.error||'empty');
    aiCache[key] = shuffleArray(data.questions);
    usingAI = true;
  } catch(e) {
    console.warn('AI fallback:', e.message);
    aiCache[key] = shuffleArray([...(FALLBACK[topicKey]||FALLBACK.science)]);
    usingAI = false;
  }
  hideAILoading();
  if (lvlIndex+1 < LEVELS.length) setTimeout(()=>prefetchQuestions(lvlIndex+1), 4000);
}
function getNextQuestion() {
  const key = `${topicKey}-${level}`;
  if (!aiCache[key]?.length) { aiCache[key]=shuffleArray([...(FALLBACK[topicKey]||FALLBACK.science)]); usingAI=false; }
  const q = aiCache[key].shift();
  if (aiCache[key].length < 2) prefetchQuestions(level);
  return q;
}
function showAILoading(msg){ aiLoadingTxt.textContent=msg; aiLoadingEl.classList.add('visible'); }
function hideAILoading()   { aiLoadingEl.classList.remove('visible'); }
function showRuneAlert(msg){
  runeAlertTxt.textContent=msg; runeAlertEl.classList.add('visible');
  clearTimeout(runeAlertEl._t);
  runeAlertEl._t=setTimeout(()=>runeAlertEl.classList.remove('visible'),4000);
}

// ── STARFIELD ─────────────────────────────────────────────────────────────────
let stars=[];
function initStars() {
  bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight;
  stars=Array.from({length:220},()=>({
    x:Math.random()*bgCanvas.width, y:Math.random()*bgCanvas.height,
    r:Math.random()*1.4+.2, speed:Math.random()*.2+.04,
    tw:Math.random()*Math.PI*2, tws:Math.random()*.04+.01
  }));
}
function drawStars() {
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  const g=bgCtx.createRadialGradient(bgCanvas.width/2,bgCanvas.height/2,0,bgCanvas.width/2,bgCanvas.height/2,bgCanvas.width*.7);
  g.addColorStop(0,'#130924'); g.addColorStop(1,'#060310');
  bgCtx.fillStyle=g; bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  stars.forEach(s=>{
    s.tw+=s.tws;
    const a=.3+.7*Math.abs(Math.sin(s.tw));
    bgCtx.beginPath(); bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgCtx.fillStyle=`rgba(220,210,255,${a})`; bgCtx.fill();
    s.y-=s.speed;
    if(s.y<-2){s.y=bgCanvas.height+2; s.x=Math.random()*bgCanvas.width;}
  });
}

// ── BOARD ─────────────────────────────────────────────────────────────────────
function randomType(){ return ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]; }
function causesMatch(b,r,c,type){
  if(c>=2 && b[r][c-1]?.type===type && b[r][c-2]?.type===type) return true;
  if(r>=2 && b[r-1]?.[c]?.type===type && b[r-2]?.[c]?.type===type) return true;
  return false;
}
function makeGem(type, y, targetY, isRune=false, runeData=null){
  // Rune gems keep their element type so they match + explode in their color.
  // runeData is stored separately for the quiz.
  return { type, y, targetY, opacity:1, scale:1, shake:0, isRune, runeData, pulsePhase:Math.random()*Math.PI*2 };
}
function initBoard(){
  board=[];
  for(let r=0;r<ROWS;r++){
    board[r]=[];
    for(let c=0;c<COLS;c++){
      let type, tries=0;
      do{ type=randomType(); tries++; } while(tries<30 && causesMatch(board,r,c,type));
      board[r][c]=makeGem(type, r*GEM_SIZE, r*GEM_SIZE);
    }
  }
  runesOnBoard=0; updateRunesOnBoard();
}

// ── RUNE SPAWNING ─────────────────────────────────────────────────────────────
function spawnRuneGem(){
  const lvl=LEVELS[level];
  if(runesOnBoard>=lvl.maxRunes || !gameActive || isPaused) return;
  const candidates=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    if(board[r][c] && !board[r][c].isRune) candidates.push([r,c]);
  if(!candidates.length) return;
  const [r,c]=candidates[Math.floor(Math.random()*candidates.length)];
  const q=getNextQuestion();
  if(!q) return;
  // Mark as rune but KEEP the gem's existing element type intact
  // so it participates in matches exactly like a normal gem of that color.
  board[r][c].isRune   = true;
  board[r][c].runeData = q;
  board[r][c].scale    = 0.05;
  runesOnBoard++;
  updateRunesOnBoard();
  showRuneAlert(`✦ Rune Gem appeared! Match it to unlock a ${selectedTopic.name} challenge!`);
}
function updateRunesOnBoard(){ runesOnBoardEl.textContent=runesOnBoard; }
function updateRuneProgress(){
  const pct=Math.min(100,score/Math.max(1,scoreToNextRune)*100);
  runeBarFill.style.width=pct+'%';
  runeCountInfo.textContent=`${Math.min(score,scoreToNextRune).toLocaleString()} / ${scoreToNextRune.toLocaleString()} pts`;
}

// ── COLOR HELPERS ─────────────────────────────────────────────────────────────
function hexToRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function lighten(h,a){ const[r,g,b]=hexToRgb(h); return `rgb(${Math.min(255,r+255*a)|0},${Math.min(255,g+255*a)|0},${Math.min(255,b+255*a)|0})`; }
function darken(h,a){  const[r,g,b]=hexToRgb(h); return `rgb(${Math.max(0,r-255*a)|0},${Math.max(0,g-255*a)|0},${Math.max(0,b-255*a)|0})`; }

// ── DRAW GEM ──────────────────────────────────────────────────────────────────
function drawGem(gem, col, row){
  if(!gem) return;
  const isSel  = selected  && selected.row===row  && selected.col===col;
  const isHint = hintCell  && hintCell.row===row  && hintCell.col===col;
  const cx=col*GEM_SIZE+GEM_SIZE/2+gem.shake;
  const cy=gem.y+GEM_SIZE/2;
  const s =GEM_SIZE*gem.scale*.86;
  const r =s*.42;
  // Rune gems use their element color for the base, but get a gold ring + label
  const cl=ECOLORS[gem.type];

  ctx.save();
  ctx.globalAlpha=gem.opacity;
  ctx.translate(cx,cy);

  if(isSel)       { ctx.shadowBlur=34; ctx.shadowColor=cl; ctx.scale(1.13,1.13); }
  else if(isHint) { const p=.6+.4*Math.sin(Date.now()*.008); ctx.shadowBlur=26*p; ctx.shadowColor='#fff'; ctx.scale(1+.05*p,1+.05*p); }
  else if(gem.isRune){ const p=.5+.5*Math.sin(Date.now()*.004+gem.pulsePhase); ctx.shadowBlur=20+20*p; ctx.shadowColor='#ffd700'; }
  else            { ctx.shadowBlur=10; ctx.shadowColor=EGLOW[gem.type]; }

  // Hexagon fill — element color for ALL gems, rune gets a gold tint overlay
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const ang=(i*Math.PI/3)-Math.PI/6;
    i===0 ? ctx.moveTo(Math.cos(ang)*r,Math.sin(ang)*r) : ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);
  }
  ctx.closePath();

  const grad=ctx.createRadialGradient(-r*.2,-r*.3,r*.05,0,0,r);
  grad.addColorStop(0, lighten(cl,.5));
  grad.addColorStop(.55, cl);
  grad.addColorStop(1, darken(cl,.38));
  ctx.fillStyle=grad;
  ctx.fill();

  // Rune gems: gold border + inner glow ring to distinguish them
  if(gem.isRune){
    ctx.strokeStyle='#ffd700';
    ctx.lineWidth=isSel?3:2.2;
    // Draw a second, slightly smaller hexagon as inner gold ring
    ctx.beginPath();
    const r2=r*.78;
    for(let i=0;i<6;i++){
      const ang=(i*Math.PI/3)-Math.PI/6;
      i===0 ? ctx.moveTo(Math.cos(ang)*r2,Math.sin(ang)*r2) : ctx.lineTo(Math.cos(ang)*r2,Math.sin(ang)*r2);
    }
    ctx.closePath();
    ctx.strokeStyle='rgba(255,215,0,.45)';
    ctx.lineWidth=1.5;
    ctx.stroke();
    // Main gold border
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const ang=(i*Math.PI/3)-Math.PI/6;
      i===0 ? ctx.moveTo(Math.cos(ang)*r,Math.sin(ang)*r) : ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);
    }
    ctx.closePath();
    ctx.strokeStyle='#ffd700';
    ctx.lineWidth=isSel?3:2.2;
    ctx.stroke();
  } else {
    ctx.strokeStyle=isSel?'#ffffff':lighten(cl,.38);
    ctx.lineWidth=isSel?2.5:1.4;
    ctx.stroke();
  }

  // Shine spot
  ctx.beginPath(); ctx.arc(-r*.18,-r*.22,r*.26,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.shadowBlur=0; ctx.fill();

  // Label
  if(gem.isRune){
    // Show the quiz abbreviation in a dark color that works on any element bg
    const abbr=gem.runeData?.abbr||'?';
    const fs=abbr.length>4?Math.max(7,Math.floor(s*.17)):abbr.length>3?Math.max(8,Math.floor(s*.2)):Math.max(10,Math.floor(s*.24));
    ctx.font=`bold ${fs}px 'Rajdhani',sans-serif`;
    ctx.fillStyle='rgba(0,0,0,.8)'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowBlur=4; ctx.shadowColor='rgba(255,215,0,.6)'; ctx.globalAlpha=gem.opacity*.95;
    ctx.fillText(abbr,0,1);
    // Gold ✦ badge at top
    ctx.font=`${Math.floor(s*.16)}px serif`;
    ctx.globalAlpha=gem.opacity*.9; ctx.fillStyle='#ffd700';
    ctx.shadowBlur=6; ctx.shadowColor='#ffd700';
    ctx.fillText('✦',0,-r*.65);
  } else {
    ctx.font=`${Math.floor(s*.36)}px serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowBlur=0; ctx.globalAlpha=gem.opacity*.92;
    ctx.fillText(EEMOJI[gem.type],0,1);
  }
  ctx.restore();
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderBoard(){
  ctx.clearRect(0,0,W,H);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    ctx.fillStyle=(r+c)%2===0?'rgba(255,255,255,.03)':'rgba(255,255,255,.015)';
    ctx.beginPath(); ctx.roundRect(c*GEM_SIZE+2,r*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  if(selected){
    ctx.fillStyle='rgba(255,215,0,.12)'; ctx.beginPath();
    ctx.roundRect(selected.col*GEM_SIZE+2,selected.row*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r]?.[c]) drawGem(board[r][c],c,r);
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function spawnP(col,row,type,n=18){
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=2+Math.random()*4;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,size:3+Math.random()*4,color:ECOLORS[type],alpha:1,decay:.025+Math.random()*.02,gravity:.12,sparkle:false});
  }
}
function spawnRP(col,row,color,n=35){
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=3+Math.random()*7;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,size:4+Math.random()*6,color,alpha:1,decay:.018+Math.random()*.014,gravity:.09,sparkle:true});
  }
}
function spawnRuneParticles(col,row,color){
  // Rune particles use the gem's element color (not always gold)
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  const baseColor=color||'#ffd700';
  for(let i=0;i<55;i++){
    const a=Math.random()*Math.PI*2, sp=4+Math.random()*9;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-3.5,size:5+Math.random()*7,color:baseColor,alpha:1,decay:.014+Math.random()*.012,gravity:.08,sparkle:true});
  }
  // Always add some gold sparkles to signal rune
  for(let i=0;i<20;i++){
    const a=Math.random()*Math.PI*2, sp=3+Math.random()*5;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,size:3+Math.random()*4,color:'#ffd700',alpha:1,decay:.02+Math.random()*.015,gravity:.1,sparkle:true});
  }
}
function updateParticles(){
  pCtx.clearRect(0,0,W,H);
  particles=particles.filter(p=>p.alpha>.01);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=.97; p.alpha-=p.decay;
    pCtx.save(); pCtx.globalAlpha=Math.max(0,p.alpha);
    if(p.sparkle){pCtx.shadowBlur=10; pCtx.shadowColor=p.color;}
    pCtx.beginPath(); pCtx.arc(p.x,p.y,p.size*p.alpha+.5,0,Math.PI*2);
    pCtx.fillStyle=p.color; pCtx.fill(); pCtx.restore();
  });
}

// ── POPUP ─────────────────────────────────────────────────────────────────────
function showPopup(col,row,text,color='#ffe066'){
  const el=document.createElement('div');
  el.className='score-popup'; el.textContent=text; el.style.color=color;
  const wr=wrapper.getBoundingClientRect();
  el.style.left=(wr.left+col*GEM_SIZE*(wr.width/W)+GEM_SIZE*(wr.width/W)/2)+'px';
  el.style.top=(wr.top+row*GEM_SIZE*(wr.height/H))+'px';
  el.style.position='fixed'; el.style.transform='translateX(-50%)';
  document.body.appendChild(el); setTimeout(()=>el.remove(),1200);
}

// ── MATCH FINDING — H + V ONLY ────────────────────────────────────────────────
function findMatches(){
  const m=new Set();
  // Horizontal
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS-2;c++){
      const t=board[r][c]?.type; if(!t) continue;
      if(board[r][c+1]?.type===t && board[r][c+2]?.type===t){
        let e=c+2;
        while(e+1<COLS && board[r][e+1]?.type===t) e++;
        for(let i=c;i<=e;i++) m.add(`${r},${i}`);
        c=e;
      }
    }
  }
  // Vertical
  for(let c=0;c<COLS;c++){
    for(let r=0;r<ROWS-2;r++){
      const t=board[r][c]?.type; if(!t) continue;
      if(board[r+1][c]?.type===t && board[r+2][c]?.type===t){
        let e=r+2;
        while(e+1<ROWS && board[e+1][c]?.type===t) e++;
        for(let i=r;i<=e;i++) m.add(`${i},${c}`);
        r=e;
      }
    }
  }
  return m;
}

// ── REACTIONS ─────────────────────────────────────────────────────────────────
function checkReactions(matchedSet){
  const cells=[...matchedSet].map(k=>{
    const[r,c]=k.split(',').map(Number);
    return{r,c,type:board[r][c]?.type};
  }).filter(x=>x.type);
  let total=0; const seen=new Set();
  cells.forEach((a,i)=>cells.slice(i+1).forEach(b=>{
    const key=[a.type,b.type].sort().join(':');
    if(seen.has(key)) return;
    const rx=REACTIONS.find(rx=>(rx.a===a.type&&rx.b===b.type)||(rx.a===b.type&&rx.b===a.type));
    if(rx){
      seen.add(key); total+=rx.bonus;
      const mc=Math.floor((a.c+b.c)/2), mr=Math.floor((a.r+b.r)/2);
      spawnRP(mc,mr,rx.color,30);
      setTimeout(()=>showPopup(mc,mr,`${rx.label} +${rx.bonus}`,rx.color),80);
    }
  }));
  return total;
}

// ── PROCESS MATCHES ───────────────────────────────────────────────────────────
async function processMatches(){
  let chainDepth=0;
  while(true){
    const matched=findMatches(); if(matched.size===0) break;
    chainDepth++; combo++; if(combo>bestCombo) bestCombo=combo;
    updateComboUI();

    const matchCells=[...matched].map(k=>k.split(',').map(Number));
    const runeMatches=matchCells.filter(([r,c])=>board[r][c]?.isRune);
    const rxBonus=checkReactions(matched);

    const groups={};
    matchCells.forEach(([r,c])=>{
      const t=board[r][c]?.type;
      if(t) groups[t]=(groups[t]||[]).concat([[r,c]]);
    });
    let ms=0;
    Object.entries(groups).forEach(([type,gc])=>{
      const n=Math.min(gc.length,5);
      const base=BSCORE[n]||(n*30);
      const pts=Math.floor(base*(1+(combo-1)*.25)*(1+(chainDepth-1)*.35));
      ms+=pts;
      const mid=gc[Math.floor(gc.length/2)];
      spawnP(mid[1],mid[0],type,22);
      setTimeout(()=>showPopup(mid[1],mid[0],`+${pts}`,ECOLORS[type]),50);
    });
    addScore(ms+rxBonus,'gem');

    matchCells.forEach(([r,c])=>{ if(board[r][c]){board[r][c].scale=.01; board[r][c].opacity=0;} });
    await sleep(260);

    // Collect rune quiz data BEFORE clearing cells (includes element type for particles)
    const runeQuestions=runeMatches.map(([r,c])=>({
      ...board[r][c].runeData,
      boardCol:c, boardRow:r,
      elementColor: ECOLORS[board[r][c].type]  // pass element color for particles
    }));
    runeMatches.forEach(()=>runesOnBoard=Math.max(0,runesOnBoard-1));
    updateRunesOnBoard();
    matchCells.forEach(([r,c])=>{ board[r][c]=null; });

    // Gravity
    for(let c=0;c<COLS;c++){
      let wr=ROWS-1;
      for(let r=ROWS-1;r>=0;r--){
        if(board[r][c]){
          if(r!==wr){board[wr][c]=board[r][c]; board[wr][c].targetY=wr*GEM_SIZE; board[r][c]=null;}
          wr--;
        }
      }
    }
    await sleep(260);

    // Refill
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
      if(!board[r][c]) board[r][c]=makeGem(randomType(),-GEM_SIZE*(Math.floor(Math.random()*3)+1),r*GEM_SIZE);
    await sleep(300);

    // Rune questions — particles use the gem's own element color
    if(runeQuestions.length>0 && !questionActive){
      for(const qd of runeQuestions){
        spawnRuneParticles(qd.boardCol||4, qd.boardRow||4, qd.elementColor);
        await sleep(450);
        await askRuneQuestion(qd);
      }
    }
  }
  if(chainDepth===0) combo=0;
  updateComboUI();
}

// ── QUESTION SYSTEM ───────────────────────────────────────────────────────────
const DIFF_LABELS=['','🟢 Easy','🔵 Medium','🟣 Challenging','🟠 Hard','🔴 Expert'];
const DIFF_COLORS=['','#7fff5e','#00c8ff','#a78bfa','#ff9a00','#ff4e1a'];

function askRuneQuestion(qData){
  return new Promise(resolve=>{
    if(!gameActive){ resolve(); return; }
    questionActive=true;
    const lvl=LEVELS[level];
    const overlay=document.getElementById('question-overlay');

    document.getElementById('q-rune-letter').textContent=qData.abbr||'?';
    document.getElementById('q-topic-name').textContent=`${selectedTopic.icon} ${selectedTopic.name}`;
    const db=document.getElementById('q-diff-badge');
    db.textContent=DIFF_LABELS[lvl.aiDiff]||lvl.label;
    db.style.color=DIFF_COLORS[lvl.aiDiff]||'#fff';
    db.style.borderColor=DIFF_COLORS[lvl.aiDiff]||'#fff';
    document.getElementById('q-question-text').textContent=qData.q;
    document.getElementById('q-bonus').textContent=lvl.correctBonus;
    document.getElementById('q-penalty').textContent=lvl.wrongPenalty;
    document.getElementById('q-feedback').textContent='';
    document.getElementById('q-feedback').className='q-feedback';
    document.getElementById('q-explanation').textContent='';
    document.getElementById('q-source').textContent=usingAI
      ?'✦ Unique question generated by AI for this session'
      :'✦ Using built-in question bank';

    const choicesEl=document.getElementById('q-choices');
    choicesEl.innerHTML='';
    const shuffled=shuffleChoices(qData.choices,qData.answer);
    shuffled.choices.forEach((choice,i)=>{
      const btn=document.createElement('button');
      btn.className='q-choice';
      btn.innerHTML=`<strong>${String.fromCharCode(65+i)}.</strong> ${choice}`;
      btn.addEventListener('click',()=>{
        if(btn.disabled) return;
        choicesEl.querySelectorAll('.q-choice').forEach(b=>{ b.disabled=true; });
        clearInterval(questionTimerInterval);
        handleAnswer(i===shuffled.correctIndex,shuffled.correctIndex,qData.explanation||'',lvl,choicesEl,resolve);
      });
      choicesEl.appendChild(btn);
    });

    // Timer
    const timerBar=document.getElementById('q-timer-bar');
    timerBar.style.transition='none'; timerBar.style.width='100%';
    timerBar.style.background='linear-gradient(90deg,#ffd700,#ff9a00)';
    let elapsed=0;
    setTimeout(()=>{
      timerBar.style.transition=`width ${lvl.questionTime}s linear`;
      timerBar.style.width='0%';
    },60);
    questionTimerInterval=setInterval(()=>{
      elapsed+=.1;
      if(lvl.questionTime-elapsed<8) timerBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)';
      if(elapsed>=lvl.questionTime){
        clearInterval(questionTimerInterval);
        choicesEl.querySelectorAll('.q-choice').forEach(b=>{ b.disabled=true; });
        handleAnswer(false,shuffled.correctIndex,qData.explanation||'',lvl,choicesEl,resolve,true);
      }
    },100);

    overlay.classList.add('active');
  });
}

function handleAnswer(isCorrect,correctIndex,explanation,lvl,choicesEl,resolve,timedOut=false){
  runesAnswered++;
  const choices=choicesEl.querySelectorAll('.q-choice');
  const feedback=document.getElementById('q-feedback');
  const explEl=document.getElementById('q-explanation');
  choices[correctIndex].classList.add('reveal');
  if(isCorrect){
    runesCorrect++;
    choices[correctIndex].classList.add('correct');
    feedback.textContent=`✅ Correct! +${lvl.correctBonus} pts & +2 moves!`;
    feedback.className='q-feedback good';
    addScore(lvl.correctBonus,'rune');
    runeEl.textContent=runesCorrect;
    movesLeft+=2; updateMovesUI();
    spawnRP(3,3,'#7fff5e',30); spawnRP(5,3,'#ffd700',30);
  } else {
    Array.from(choices).forEach((b,i)=>{ if(i!==correctIndex&&b.disabled&&!b.classList.contains('reveal')) b.classList.add('wrong'); });
    feedback.textContent=timedOut?`⏰ Time's up! −${lvl.wrongPenalty} moves`:`❌ Incorrect! −${lvl.wrongPenalty} moves`;
    feedback.className='q-feedback bad';
    movesLeft=Math.max(0,movesLeft-lvl.wrongPenalty);
    updateMovesUI();
    spawnRP(4,4,'#ff4e1a',20);
  }
  if(explanation) explEl.textContent=`💡 ${explanation}`;
  updateStats();
  setTimeout(()=>{
    document.getElementById('question-overlay').classList.remove('active');
    questionActive=false; resolve();
    if(movesLeft<=0&&gameActive){ gameActive=false; clearTimeout(hintTimeout); setTimeout(showGameOver,600); }
  },3200);
}

function shuffleChoices(choices,correctIndex){
  const indexed=choices.map((c,i)=>({c,i}));
  const shuffled=shuffleArray(indexed);
  return{choices:shuffled.map(x=>x.c), correctIndex:shuffled.findIndex(x=>x.i===correctIndex)};
}

// ── SWAP ──────────────────────────────────────────────────────────────────────
async function trySwap(r1,c1,r2,c2){
  if(animating||questionActive||isPaused) return;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1){ selected={row:r2,col:c2}; return; }
  animating=true; selected=null;
  const g1=board[r1][c1], g2=board[r2][c2];
  board[r1][c1]=g2; board[r2][c2]=g1;
  if(g1) g1.targetY=r2*GEM_SIZE;
  if(g2) g2.targetY=r1*GEM_SIZE;
  await sleep(SWAP_MS);
  if(findMatches().size===0){
    board[r1][c1]=g1; board[r2][c2]=g2;
    if(g1) g1.targetY=r1*GEM_SIZE;
    if(g2) g2.targetY=r2*GEM_SIZE;
    shakeGem(r1,c1); shakeGem(r2,c2);
    await sleep(SWAP_MS);
  } else {
    movesLeft--; updateMovesUI();
    await processMatches();
  }
  animating=false; resetHintTimer(); checkGameState();
}

function shakeGem(r,c){
  if(!board[r]?.[c]) return; let t=0;
  const iv=setInterval(()=>{
    if(!board[r]?.[c]){clearInterval(iv);return;}
    board[r][c].shake=Math.sin(t*2.8)*5; t++;
    if(t>SHAKE_N){board[r][c].shake=0; clearInterval(iv);}
  },28);
}

// ── CLICK ─────────────────────────────────────────────────────────────────────
canvas.addEventListener('click',e=>{
  if(!gameActive||animating||questionActive||isPaused) return;
  const rect=canvas.getBoundingClientRect();
  const scaleX=W/rect.width, scaleY=H/rect.height;
  const mx=(e.clientX-rect.left)*scaleX;
  const my=(e.clientY-rect.top)*scaleY;
  const col=Math.floor(mx/GEM_SIZE), row=Math.floor(my/GEM_SIZE);
  if(row<0||row>=ROWS||col<0||col>=COLS||!board[row]?.[col]) return;
  if(!selected) selected={row,col};
  else if(selected.row===row&&selected.col===col) selected=null;
  else trySwap(selected.row,selected.col,row,col);
});

// Keyboard: Escape / P = pause
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'||e.key==='p'||e.key==='P'){
    if(gameActive||isPaused) window.togglePause();
  }
});

// ── SCORE ─────────────────────────────────────────────────────────────────────
function addScore(pts,source='gem'){
  if(pts<=0) return;
  const prev=score; score+=pts; scoreThisLevel+=pts;
  if(source==='gem') gemScoreThisLevel+=pts; else runeScoreThisLevel+=pts;
  if(score>bestScore){ bestScore=score; localStorage.setItem('cryst6_best',bestScore); }
  animCount(scoreEl,prev,score,380);
  animCount(bestEl,parseInt(bestEl.textContent.replace(/,/g,''))||0,bestScore,380);
  scoreEl.classList.add('pop'); setTimeout(()=>scoreEl.classList.remove('pop'),280);
  checkRuneSpawn(); updateRuneProgress();
}
function checkRuneSpawn(){
  if(score>=scoreToNextRune){
    const lvl=LEVELS[level];
    scoreToNextRune=score+lvl.runeEvery;
    setTimeout(spawnRuneGem,500);
  }
}
function animCount(el,from,to,dur){
  const start=performance.now(), diff=to-from;
  function step(now){
    const p=Math.min(1,(now-start)/dur), e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(from+diff*e).toLocaleString();
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function updateComboUI(){
  if(combo>1){
    comboNum.textContent=combo; comboEl.classList.add('visible');
    clearTimeout(comboEl._t); comboEl._t=setTimeout(()=>comboEl.classList.remove('visible'),2200);
  } else comboEl.classList.remove('visible');
}
function updateMovesUI(){
  const max=LEVELS[level].moves;
  movesCount.textContent=`${movesLeft} / ${max}`;
  const pct=movesLeft/max*100; movesBar.style.width=pct+'%';
  if(pct<=25){movesBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)';movesBar.style.boxShadow='0 0 8px rgba(255,78,26,.7)';}
  else if(pct<=50){movesBar.style.background='linear-gradient(90deg,#ffe033,#ffaa44)';movesBar.style.boxShadow='0 0 8px rgba(255,224,51,.5)';}
  else{movesBar.style.background='linear-gradient(90deg,#a78bfa,#60d0ff)';movesBar.style.boxShadow='0 0 8px rgba(96,208,255,.6)';}
}
function updateStats(){
  document.getElementById('stat-q').textContent=runesAnswered;
  document.getElementById('stat-c').textContent=runesCorrect;
  document.getElementById('stat-a').textContent=runesAnswered>0?Math.round(runesCorrect/runesAnswered*100)+'%':'—';
  document.getElementById('stat-bc').textContent=bestCombo;
}

// ── HINT ──────────────────────────────────────────────────────────────────────
function resetHintTimer(){
  hintCell=null; clearTimeout(hintTimeout);
  if(!gameActive||isPaused) return;
  hintTimeout=setTimeout(()=>{ hintCell=findBestHint(); },5000);
}
function findBestHint(){
  let best=-1, bc=null;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    for(const[nr,nc] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]){
      if(nr<0||nr>=ROWS||nc<0||nc>=COLS) continue;
      const tmp=board[r][c]; board[r][c]=board[nr][nc]; board[nr][nc]=tmp;
      const cnt=findMatches().size; board[nr][nc]=board[r][c]; board[r][c]=tmp;
      if(cnt>best){best=cnt; bc={row:r,col:c};}
    }
  }
  return best>0?bc:null;
}

// ── DIFFICULTY PANEL ──────────────────────────────────────────────────────────
function updateDifficultyPanel(){
  const lvl=LEVELS[level];
  document.getElementById('difficulty-panel').innerHTML=`
    <div class="stat-row"><span class="stat-key">Rank</span><span class="stat-val" style="color:${lvl.diffColor}">${lvl.label}</span></div>
    <div class="stat-row"><span class="stat-key">Timer</span><span class="stat-val">${lvl.questionTime}s</span></div>
    <div class="stat-row"><span class="stat-key">✅ Bonus</span><span class="stat-val gold">+${lvl.correctBonus}pt</span></div>
    <div class="stat-row"><span class="stat-key">❌ Penalty</span><span class="stat-val" style="color:#ff4e1a">−${lvl.wrongPenalty}mv</span></div>
    <div class="stat-row"><span class="stat-key">Max Runes</span><span class="stat-val">${lvl.maxRunes}</span></div>
  `;
}

// ── GAME STATE ────────────────────────────────────────────────────────────────
function checkGameState(){
  if(score>=LEVELS[level].target){ gameActive=false; clearTimeout(hintTimeout); setTimeout(showLevelComplete,500); }
  else if(movesLeft<=0&&!questionActive){ gameActive=false; clearTimeout(hintTimeout); setTimeout(showGameOver,500); }
}

function showLevelComplete(){
  const lvl=LEVELS[level];
  const isLast=level>=LEVELS.length-1;
  const stars=score>=lvl.target*2?3:score>=lvl.target*1.4?2:1;
  const nextLvl=!isLast?LEVELS[level+1]:null;
  const titles=['✦ Level Complete!','✦ Level Complete!','🔥 Rising Scholar!','⚡ Adept Cleared!','🌿 Veteran!','💜 Expert!','🌟 Elite!','🏆 Master!'];
  document.getElementById('level-title').textContent=isLast?'🏆 Grand Master! You Beat the Game!':(titles[level]||'✦ Level Complete!');
  document.getElementById('level-score').textContent=score.toLocaleString();
  document.getElementById('level-feedback').textContent=isLast?'You conquered all 8 levels! 🏆':['','Push harder!','Nice work! ✨','Outstanding! 🔮'][stars]||'Great run!';
  document.getElementById('score-breakdown').innerHTML=`
    <div class="breakdown-row"><span class="label">Gem Matches</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Bonuses</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Quiz Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
    <div class="breakdown-row"><span class="label">Best Combo</span><span class="val">x${bestCombo}</span></div>
    ${nextLvl?`<div class="breakdown-row"><span class="label">Next Target</span><span class="val" style="color:#ffd700">${nextLvl.target.toLocaleString()} pts</span></div>`:''}
    <div class="breakdown-row"><span class="label">Progress</span><span class="val" style="color:${lvl.diffColor}">${lvl.label} (${level+1}/${LEVELS.length})</span></div>
  `;
  document.querySelectorAll('.star').forEach((el,i)=>{ el.classList.remove('lit'); if(i<stars) setTimeout(()=>el.classList.add('lit'),180+i*160); });
  document.getElementById('level-overlay').classList.add('active');
  const cc=['#ff4e1a','#00c8ff','#ffe033','#cc44ff','#ffd700','#7fff5e'];
  const bursts=isLast?16:8;
  for(let i=0;i<bursts;i++) setTimeout(()=>spawnRP(Math.floor(Math.random()*COLS),Math.floor(Math.random()*ROWS),cc[i%cc.length],isLast?40:25),i*80);
}

function showGameOver(){
  document.getElementById('final-score').textContent=score.toLocaleString();
  const pct=score/LEVELS[level].target;
  document.getElementById('go-breakdown').innerHTML=`
    <div class="breakdown-row"><span class="label">Gem Score</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Score</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
  `;
  document.getElementById('gameover-feedback').textContent=pct>=.8?'So close! Try again! 💜':pct>=.5?'Good effort — answer Rune questions for big bonuses!':'Match Rune Gems for massive score boosts!';
  document.getElementById('gameover-overlay').classList.add('active');
}

// ── LEVEL CONTROL ─────────────────────────────────────────────────────────────
function beginLevel(){
  score=0; combo=0; bestCombo=0; animating=false; selected=null; particles=[]; hintCell=null;
  questionActive=false; isPaused=false;
  scoreThisLevel=0; gemScoreThisLevel=0; runeScoreThisLevel=0; runesOnBoard=0;
  runesAnswered=0; runesCorrect=0;
  pauseOverlay.classList.remove('active'); canvasPaused.classList.remove('visible');
  pauseIcon.textContent='⏸'; pauseLabel.textContent='Pause';
  const lvl=LEVELS[level];
  movesLeft=lvl.moves; scoreToNextRune=lvl.runeThreshold;
  scoreEl.textContent='0'; levelEl.textContent=level+1;
  bestEl.textContent=bestScore.toLocaleString(); runeEl.textContent='0';
  targetEl.textContent=lvl.target.toLocaleString();
  objEl.textContent=lvl.label;
  updateMovesUI(); updateDifficultyPanel(); updateStats();
  comboEl.classList.remove('visible'); runeAlertEl.classList.remove('visible');
  runeBarFill.style.width='0%';
  runeCountInfo.textContent=`0 / ${lvl.runeThreshold.toLocaleString()} pts`;
  initBoard(); gameActive=true; resetHintTimer();
}
window.nextLevel=async function(){
  document.getElementById('level-overlay').classList.remove('active');
  level=level<LEVELS.length-1?level+1:0;
  await prefetchQuestions(level);
  beginLevel();
};
window.restartGame=function(){
  ['level-overlay','gameover-overlay','pause-overlay','confirm-home-overlay'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.classList.remove('active');
  });
  canvasPaused.classList.remove('visible');
  isPaused=false; level=0; beginLevel();
};

// ── PHYSICS UPDATE ────────────────────────────────────────────────────────────
function updateBoard(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const g=board[r]?.[c]; if(!g) continue;
    const dy=g.targetY-g.y; g.y+=dy*.2; if(Math.abs(dy)<.4) g.y=g.targetY;
    g.scale+=(1-g.scale)*.14;
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function shuffleArray(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// ── MAIN LOOP ─────────────────────────────────────────────────────────────────
function gameLoop(){
  drawStars();
  if(!isPaused){ updateBoard(); renderBoard(); updateParticles(); }
  requestAnimationFrame(gameLoop);
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize',()=>{ bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight; initStars(); });
buildTopicGrid();
initStars();
requestAnimationFrame(gameLoop);