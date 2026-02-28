/* ================================================================
   CRYSTALLINE v3 — Elemental Knowledge Puzzle
   New: Topic selection, Rune Gems, Quiz system, Scaling difficulty
   ================================================================ */
'use strict';

// ── TOPIC BANK ───────────────────────────────────────────────────────────────
const TOPICS = {
  science: {
    name: 'Science', icon: '🔬', desc: 'Physics, chemistry & biology',
    color: '#00c8ff',
    questions: [
      { abbr:'DNA', q:'What does DNA stand for?', choices:['Deoxyribonucleic Acid','Dynamic Neural Assembly','Di-Nucleic Arrangement','Distributed Neuron Array'], answer:0 },
      { abbr:'Hz', q:'What unit is Hz (Hertz) used to measure?', choices:['Temperature','Frequency','Pressure','Energy'], answer:1 },
      { abbr:'ATP', q:'ATP is the primary energy currency of what?', choices:['Rocks','Cells','Stars','Oceans'], answer:1 },
      { abbr:'pH', q:'A pH of 7 means a solution is:', choices:['Acidic','Basic','Neutral','Saturated'], answer:2 },
      { abbr:'UV', q:'UV stands for Ultraviolet. Which is correct about UV light?', choices:['Visible to human eye','Longer wavelength than red','Shorter wavelength than violet','A type of sound wave'], answer:2 },
      { abbr:'CO₂', q:'CO₂ is a greenhouse gas. What is its full name?', choices:['Carbon Dioxide','Carbon Monoxide','Calcium Dioxide','Copper Oxide'], answer:0 },
      { abbr:'RNA', q:'RNA carries genetic instructions FROM DNA TO:', choices:['The nucleus','Ribosomes','Mitochondria','Cell membrane'], answer:1 },
      { abbr:'H₂O', q:'Water (H₂O) is a molecule made of:', choices:['2 oxygen, 1 hydrogen','1 oxygen, 2 hydrogen','3 oxygen','2 hydrogen only'], answer:1 },
      { abbr:'E=mc²', q:'In E=mc², what does "c" represent?', choices:['Charge','Speed of light','Coulombs constant','Concentration'], answer:1 },
      { abbr:'G', q:'In physics, G is the gravitational constant. What does gravity do?', choices:['Repels all mass','Attracts masses together','Only affects planets','Stops time'], answer:1 },
      { abbr:'NaCl', q:'NaCl is the chemical formula for:', choices:['Baking soda','Table salt','Bleach','Sugar'], answer:1 },
      { abbr:'Fe', q:'The chemical symbol Fe stands for which element?', choices:['Fluorine','Fermium','Iron','Francium'], answer:2 },
    ]
  },
  math: {
    name: 'Mathematics', icon: '📐', desc: 'Algebra, geometry & more',
    color: '#a78bfa',
    questions: [
      { abbr:'π', q:'π (pi) is approximately equal to:', choices:['2.718','3.14159','1.618','4.669'], answer:1 },
      { abbr:'∞', q:'The symbol ∞ means:', choices:['Undefined','Zero','Infinity','Imaginary'], answer:2 },
      { abbr:'x²', q:'If x = 4, what is x²?', choices:['8','12','16','24'], answer:2 },
      { abbr:'√', q:'What is √144?', choices:['11','12','13','14'], answer:1 },
      { abbr:'∑', q:'The symbol ∑ (sigma) represents:', choices:['Product','Summation','Difference','Average'], answer:1 },
      { abbr:'e', q:"Euler's number e ≈ 2.718 is the base of:", choices:['Log base 10','Natural logarithm','Square root','Factorial'], answer:1 },
      { abbr:'f(x)', q:'f(x) notation means:', choices:['f times x','A function of x','f divided by x','Frequency of x'], answer:1 },
      { abbr:'%', q:'What is 15% of 200?', choices:['20','25','30','35'], answer:2 },
      { abbr:'P', q:'In probability, P(A) means:', choices:['Power of A','Probability of event A','Product of A','Perimeter A'], answer:1 },
      { abbr:'θ', q:'In trigonometry, θ (theta) usually represents:', choices:['A side length','An angle','A constant','A vector'], answer:1 },
      { abbr:'∫', q:'The symbol ∫ represents:', choices:['Derivative','Integral','Matrix','Set'], answer:1 },
      { abbr:'i', q:"The imaginary unit i equals:", choices:['√-1','√1','-1','1/2'], answer:0 },
    ]
  },
  history: {
    name: 'History', icon: '🏛️', desc: 'World events & civilizations',
    color: '#ff9a00',
    questions: [
      { abbr:'WWI', q:'WWI began in which year?', choices:['1908','1912','1914','1918'], answer:2 },
      { abbr:'BC', q:'"BC" in dates stands for:', choices:['Before Christ','British Columbia','Before Calendar','Beyond Century'], answer:0 },
      { abbr:'AD', q:'"AD" in dates means Anno Domini which translates to:', choices:['After Death','In the Year of the Lord','Ancient Dynasty','After Democracy'], answer:1 },
      { abbr:'UN', q:'The UN (United Nations) was founded after which war?', choices:['WWI','Korean War','WWII','Vietnam War'], answer:2 },
      { abbr:'CE', q:'CE in modern dating stands for:', choices:['Current Era','Christian Era','Colonial Epoch','Chronological Era'], answer:0 },
      { abbr:'USSR', q:'The USSR dissolved in which year?', choices:['1985','1989','1991','1995'], answer:2 },
      { abbr:'NASA', q:'NASA was founded in:', choices:['1945','1951','1958','1969'], answer:2 },
      { abbr:'RMS', q:'"RMS Titanic" — what does RMS stand for?', choices:['Royal Mail Ship','Really Massive Steamship','Royal Maritime Service','Regal Merchant Ship'], answer:0 },
      { abbr:'EU', q:'The European Union was established by which treaty?', choices:['Treaty of Rome','Maastricht Treaty','Treaty of Paris','Lisbon Treaty'], answer:1 },
      { abbr:'D-Day', q:'D-Day (June 6, 1944) was the Allied invasion of:', choices:['Italy','Germany','Normandy, France','Poland'], answer:2 },
      { abbr:'GDP', q:'GDP stands for Gross Domestic Product. It measures:', choices:['Government spending only','Military spending','A country\'s economic output','Population growth'], answer:2 },
      { abbr:'CIA', q:'The CIA was established in which year?', choices:['1941','1947','1952','1961'], answer:1 },
    ]
  },
  coding: {
    name: 'Coding', icon: '💻', desc: 'Programming & computer science',
    color: '#7fff5e',
    questions: [
      { abbr:'HTML', q:'HTML stands for:', choices:['HyperText Markup Language','High Transfer Markup Logic','Hyper Tool Making Language','HyperText Machine Learning'], answer:0 },
      { abbr:'CPU', q:'CPU stands for:', choices:['Central Processing Unit','Computer Power Unit','Core Program Utility','Central Program Upload'], answer:0 },
      { abbr:'OOP', q:'OOP stands for Object-Oriented Programming. Which is NOT an OOP principle?', choices:['Inheritance','Encapsulation','Compilation','Polymorphism'], answer:2 },
      { abbr:'API', q:'API stands for Application Programming Interface. What does it enable?', choices:['Faster internet','Communication between software','Better graphics','Data storage'], answer:1 },
      { abbr:'SQL', q:'SQL is used to:', choices:['Style websites','Query databases','Write machine code','Compress images'], answer:1 },
      { abbr:'Git', q:'Git is a:', choices:['Programming language','Database system','Version control system','Web framework'], answer:2 },
      { abbr:'CSS', q:'CSS is used for:', choices:['Database queries','Server logic','Styling web pages','Data structures'], answer:2 },
      { abbr:'RAM', q:'RAM stands for:', choices:['Read Access Memory','Random Access Memory','Rapid Array Module','Read And Modify'], answer:1 },
      { abbr:'SDK', q:'SDK stands for:', choices:['Software Development Kit','System Driver Key','Source Data Kernel','Server Deployment Kit'], answer:0 },
      { abbr:'HTTP', q:'HTTP stands for HyperText Transfer Protocol. Port 80 is used for HTTP, port 443 for:', choices:['FTP','HTTPS','SSH','SMTP'], answer:1 },
      { abbr:'IDE', q:'IDE stands for Integrated Development Environment. Which is an example?', choices:['Google Chrome','VS Code','Photoshop','Excel'], answer:1 },
      { abbr:'bool', q:'In most languages, a boolean can only be:', choices:['Any number','0 to 255','True or False','A string'], answer:2 },
    ]
  },
  biology: {
    name: 'Biology', icon: '🌿', desc: 'Life, cells & ecosystems',
    color: '#96f7d2',
    questions: [
      { abbr:'mRNA', q:'mRNA carries instructions for making:', choices:['Fats','Minerals','Proteins','Carbohydrates'], answer:2 },
      { abbr:'RBC', q:'RBC stands for Red Blood Cell. Its main job is:', choices:['Fight infection','Carry oxygen','Clot blood','Digest food'], answer:1 },
      { abbr:'CNS', q:'CNS stands for Central Nervous System. It consists of the brain and:', choices:['Heart','Lungs','Spinal cord','Kidneys'], answer:2 },
      { abbr:'ATP', q:'ATP is produced mainly in the:', choices:['Nucleus','Ribosome','Mitochondria','Cell membrane'], answer:2 },
      { abbr:'WBC', q:'WBC (White Blood Cell) is part of the:', choices:['Digestive system','Immune system','Respiratory system','Skeletal system'], answer:1 },
      { abbr:'GI', q:'The GI tract stands for Gastrointestinal tract. It is involved in:', choices:['Breathing','Circulation','Digestion','Hormone production'], answer:2 },
      { abbr:'ECG', q:'An ECG measures electrical activity of the:', choices:['Brain','Muscles','Heart','Kidneys'], answer:2 },
      { abbr:'BMI', q:'BMI stands for Body Mass Index. It uses weight and:', choices:['Age','Height','Waist size','Blood pressure'], answer:1 },
      { abbr:'GMO', q:'GMO stands for Genetically Modified:', choices:['Output','Organism','Origin','Operation'], answer:1 },
      { abbr:'PCR', q:'PCR in biology is used to:', choices:['Stain cells','Amplify DNA','Measure pH','Detect enzymes'], answer:1 },
      { abbr:'pH', q:'Blood must stay close to pH:', choices:['6.0','7.4','8.0','5.5'], answer:1 },
      { abbr:'HLA', q:'HLA stands for Human Leukocyte Antigen. It helps the body:', choices:['Digest food','Identify own vs. foreign cells','Produce hormones','Regulate temperature'], answer:1 },
    ]
  },
  geography: {
    name: 'Geography', icon: '🌍', desc: 'Countries, capitals & nature',
    color: '#ff6b9d',
    questions: [
      { abbr:'GMT', q:'GMT stands for Greenwich Mean Time. It is used as:', choices:['A climate zone','A time standard','A map projection','A currency standard'], answer:1 },
      { abbr:'GDP', q:'A country\'s GDP measures its:', choices:['Land area','Economic output','Population','Military size'], answer:1 },
      { abbr:'EU', q:'The EU (European Union) has its headquarters in:', choices:['Paris','London','Brussels','Berlin'], answer:2 },
      { abbr:'USA', q:'How many states does the USA have?', choices:['48','49','50','52'], answer:2 },
      { abbr:'Mt.', q:'Mt. Everest is located in the:', choices:['Alps','Andes','Himalayas','Rockies'], answer:2 },
      { abbr:'TZ', q:'How many time zones does Earth have?', choices:['12','18','24','36'], answer:2 },
      { abbr:'km', q:'1 kilometer equals how many meters?', choices:['10','100','1000','10000'], answer:2 },
      { abbr:'lat', q:'Latitude lines run:', choices:['North to south','East to west','Diagonally','Vertically'], answer:1 },
      { abbr:'lon', q:'The Prime Meridian (0° longitude) passes through:', choices:['Paris','New York','Greenwich, England','Cairo'], answer:2 },
      { abbr:'UN', q:'The UN has how many member states (approx)?', choices:['150','170','193','210'], answer:2 },
      { abbr:'CO₂', q:'Which country emits the most CO₂ annually (recent data)?', choices:['USA','India','Russia','China'], answer:3 },
      { abbr:'Eq.', q:'The Equator divides Earth into:', choices:['East and West','North and South','Land and Sea','Day and Night'], answer:1 },
    ]
  }
};

// ── LEVELS ────────────────────────────────────────────────────────────────────
// runeThreshold: score needed before first rune appears
// runeEvery: score interval between subsequent runes
// maxRunes: max rune gems on board at once
// questionTime: seconds to answer
// wrongMovePenalty / correctMovebonus
const LEVELS = [
  { moves:22, target:600,  runeThreshold:150, runeEvery:200, maxRunes:1, questionTime:20, correctBonus:400, wrongPenalty:2, label:'Novice' },
  { moves:20, target:1100, runeThreshold:100, runeEvery:180, maxRunes:2, questionTime:18, correctBonus:500, wrongPenalty:2, label:'Apprentice' },
  { moves:18, target:1800, runeThreshold:80,  runeEvery:150, maxRunes:2, questionTime:15, correctBonus:600, wrongPenalty:3, label:'Adept' },
  { moves:17, target:2600, runeThreshold:60,  runeEvery:120, maxRunes:3, questionTime:13, correctBonus:700, wrongPenalty:3, label:'Expert' },
  { moves:15, target:3500, runeThreshold:50,  runeEvery:100, maxRunes:4, questionTime:10, correctBonus:900, wrongPenalty:4, label:'Master' },
];

// ── GEM CONSTANTS ─────────────────────────────────────────────────────────────
const COLS=8, ROWS=8, GEM_SIZE=58, SWAP_MS=220, SHAKE_N=10;
const ELEMENTS=['fire','water','ice','lightning','earth','shadow'];
const ECOLORS={ fire:'#ff4e1a',water:'#00c8ff',ice:'#a8f0ff',lightning:'#ffe033',earth:'#7fff5e',shadow:'#cc44ff' };
const EGLOW={ fire:'rgba(255,78,26,.7)',water:'rgba(0,200,255,.7)',ice:'rgba(168,240,255,.7)',lightning:'rgba(255,224,51,.7)',earth:'rgba(127,255,94,.7)',shadow:'rgba(204,68,255,.7)' };
const EEMOJI={ fire:'🔥',water:'💧',ice:'❄️',lightning:'⚡',earth:'🌿',shadow:'🔮' };
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
const BSCORE={3:100,4:200,5:350};

// ── STATE ─────────────────────────────────────────────────────────────────────
let board=[], score=0, bestScore=parseInt(localStorage.getItem('cryst_best')||'0');
let level=0, movesLeft=0, combo=0, bestCombo=0, selected=null, animating=false, gameActive=false;
let particles=[], hintCell=null, hintTimeout=null;
let selectedTopic=null, topicKey=null;
let runesAnswered=0, runesCorrect=0;
let scoreThisLevel=0, gemScoreThisLevel=0, runeScoreThisLevel=0;
let scoreToNextRune=0; // score needed to spawn next rune
let runesOnBoard=0;
let questionQueue=[], usedQuestions=new Set();
let questionActive=false, questionTimer=null, questionTimerVal=0;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas  =document.getElementById('game-canvas');
const pCanvas =document.getElementById('particle-canvas');
const bgCanvas=document.getElementById('bg-canvas');
const ctx =canvas.getContext('2d');
const pCtx=pCanvas.getContext('2d');
const bgCtx=bgCanvas.getContext('2d');
const W=COLS*GEM_SIZE, H=ROWS*GEM_SIZE;
canvas.width=pCanvas.width=W; canvas.height=pCanvas.height=H;

// ── DOM ───────────────────────────────────────────────────────────────────────
const scoreEl   =document.getElementById('score-display');
const levelEl   =document.getElementById('level-display');
const bestEl    =document.getElementById('best-display');
const runeEl    =document.getElementById('rune-display');
const comboEl   =document.getElementById('combo-display');
const comboNum  =document.getElementById('combo-num');
const movesCount=document.getElementById('moves-count');
const movesBar  =document.getElementById('moves-bar-fill');
const targetEl  =document.getElementById('target-display');
const objEl     =document.getElementById('objective-display');
const wrapper   =document.getElementById('canvas-wrapper');
const runeAlert =document.getElementById('rune-alert');
const runeAlertText=document.getElementById('rune-alert-text');
const runeBar   =document.getElementById('rune-progress-bar');
const runeCountInfo=document.getElementById('rune-count-info');
const runesOnBoardEl=document.getElementById('runes-on-board');

// ── TOPIC SELECT UI ───────────────────────────────────────────────────────────
function buildTopicGrid(){
  const grid=document.getElementById('topic-grid');
  Object.entries(TOPICS).forEach(([key,t])=>{
    const btn=document.createElement('div');
    btn.className='topic-btn'; btn.dataset.key=key;
    btn.innerHTML=`<div class="topic-icon">${t.icon}</div><div class="topic-name">${t.name}</div><div class="topic-desc">${t.desc}</div>`;
    btn.addEventListener('click',()=>selectTopic(key));
    grid.appendChild(btn);
  });
}

function selectTopic(key){
  document.querySelectorAll('.topic-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.topic-btn[data-key="${key}"]`).classList.add('active');
  topicKey=key; selectedTopic=TOPICS[key];
  const btn=document.getElementById('start-btn');
  btn.textContent=`Begin with ${selectedTopic.name} ${selectedTopic.icon}`;
  btn.disabled=false;
}

window.confirmTopic=function(){
  if(!topicKey) return;
  document.getElementById('topic-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('topic-badge').innerHTML=`${selectedTopic.icon} ${selectedTopic.name}`;
  // Shuffle questions
  questionQueue=shuffleArray([...selectedTopic.questions]);
  usedQuestions.clear();
  level=0; beginLevel();
};

window.goToTopicSelect=function(){
  ['level-overlay','gameover-overlay'].forEach(id=>document.getElementById(id).classList.remove('active'));
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('topic-screen').classList.remove('hidden');
};

// ── STARFIELD ─────────────────────────────────────────────────────────────────
let stars=[];
function initStars(){
  bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight;
  stars=Array.from({length:220},()=>({x:Math.random()*bgCanvas.width,y:Math.random()*bgCanvas.height,r:Math.random()*1.4+0.2,speed:Math.random()*0.2+0.04,tw:Math.random()*Math.PI*2,tws:Math.random()*0.04+0.01}));
}
function drawStars(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  const g=bgCtx.createRadialGradient(bgCanvas.width/2,bgCanvas.height/2,0,bgCanvas.width/2,bgCanvas.height/2,bgCanvas.width*.7);
  g.addColorStop(0,'#130924'); g.addColorStop(1,'#060310');
  bgCtx.fillStyle=g; bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  stars.forEach(s=>{s.tw+=s.tws;const a=.3+.7*Math.abs(Math.sin(s.tw));bgCtx.beginPath();bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);bgCtx.fillStyle=`rgba(220,210,255,${a})`;bgCtx.fill();s.y-=s.speed;if(s.y<-2){s.y=bgCanvas.height+2;s.x=Math.random()*bgCanvas.width;}});
}

// ── BOARD ─────────────────────────────────────────────────────────────────────
function randomType(){ return ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]; }
function causesMatch(b,r,c,type){
  if(c>=2&&b[r][c-1]?.type===type&&b[r][c-2]?.type===type)return true;
  if(r>=2&&b[r-1]?.[c]?.type===type&&b[r-2]?.[c]?.type===type)return true;
  return false;
}
function makeGem(type,y,targetY,isRune=false,runeData=null){
  return{type,y,targetY,opacity:1,scale:1,shake:0,isRune,runeData,pulsePhase:Math.random()*Math.PI*2};
}
function initBoard(){
  board=[];
  for(let r=0;r<ROWS;r++){
    board[r]=[];
    for(let c=0;c<COLS;c++){
      let type,tries=0;
      do{type=randomType();tries++;}while(tries<20&&causesMatch(board,r,c,type));
      board[r][c]=makeGem(type,r*GEM_SIZE,r*GEM_SIZE);
    }
  }
  runesOnBoard=0; updateRunesOnBoard();
}

// ── RUNE SPAWNING ─────────────────────────────────────────────────────────────
function spawnRuneGem(){
  const lvl=LEVELS[level];
  if(runesOnBoard>=lvl.maxRunes) return;
  // Find empty-ish cell (not selected, not already rune)
  const candidates=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    if(board[r][c]&&!board[r][c].isRune) candidates.push([r,c]);
  if(!candidates.length) return;
  const [r,c]=candidates[Math.floor(Math.random()*candidates.length)];
  // Pick question
  const q=getNextQuestion();
  if(!q) return;
  // Replace gem with rune version (keeps element type for matching, adds rune overlay)
  board[r][c].isRune=true;
  board[r][c].runeData=q;
  board[r][c].scale=0.1; // animate in
  runesOnBoard++;
  updateRunesOnBoard();
  showRuneAlert(`A Rune Gem appeared! Match it to unlock a ${selectedTopic.name} question!`);
}

function getNextQuestion(){
  if(!questionQueue.length) questionQueue=shuffleArray([...selectedTopic.questions]);
  // Try to avoid recently used
  for(let i=0;i<questionQueue.length;i++){
    if(!usedQuestions.has(i)){ usedQuestions.add(i); if(usedQuestions.size>6)usedQuestions.clear(); return questionQueue[i]; }
  }
  return questionQueue[0];
}

function showRuneAlert(msg){
  runeAlertText.textContent=msg;
  runeAlert.classList.add('visible');
  clearTimeout(runeAlert._t);
  runeAlert._t=setTimeout(()=>runeAlert.classList.remove('visible'),4000);
}

function updateRunesOnBoard(){
  runesOnBoardEl.textContent=runesOnBoard;
}

// ── RUNE PROGRESS ─────────────────────────────────────────────────────────────
function updateRuneProgress(){
  const lvl=LEVELS[level];
  const needed=scoreToNextRune;
  const progress=Math.min(100, score/Math.max(1,needed)*100);
  runeBar.style.width=progress+'%';
  runeCountInfo.textContent=`${Math.floor(score)}/${needed} pts`;
}

// ── COLOR HELPERS ─────────────────────────────────────────────────────────────
function hexToRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function lighten(h,a){const[r,g,b]=hexToRgb(h);return`rgb(${Math.min(255,r+255*a)|0},${Math.min(255,g+255*a)|0},${Math.min(255,b+255*a)|0})`;}
function darken(h,a){const[r,g,b]=hexToRgb(h);return`rgb(${Math.max(0,r-255*a)|0},${Math.max(0,g-255*a)|0},${Math.max(0,b-255*a)|0})`;}

// ── DRAW GEM ──────────────────────────────────────────────────────────────────
function drawGem(gem,col,row){
  if(!gem)return;
  const isSel =selected&&selected.row===row&&selected.col===col;
  const isHint=hintCell&&hintCell.row===row&&hintCell.col===col;
  const cx=col*GEM_SIZE+GEM_SIZE/2+gem.shake;
  const cy=gem.y+GEM_SIZE/2;
  const s=GEM_SIZE*gem.scale*0.86;
  const r=s*0.42;
  const cl=gem.isRune?'#ffd700':ECOLORS[gem.type];

  ctx.save();
  ctx.globalAlpha=gem.opacity;
  ctx.translate(cx,cy);

  if(isSel){ctx.shadowBlur=34;ctx.shadowColor=cl;ctx.scale(1.13,1.13);}
  else if(isHint){const p=.6+.4*Math.sin(Date.now()*.008);ctx.shadowBlur=26*p;ctx.shadowColor='#fff';ctx.scale(1+.05*p,1+.05*p);}
  else if(gem.isRune){
    const p=.5+.5*Math.sin(Date.now()*.004+gem.pulsePhase);
    ctx.shadowBlur=20+20*p; ctx.shadowColor='#ffd700';
  } else{ctx.shadowBlur=10;ctx.shadowColor=EGLOW[gem.type];}

  // Hexagon shape
  ctx.beginPath();
  for(let i=0;i<6;i++){const ang=(i*Math.PI/3)-Math.PI/6;i===0?ctx.moveTo(Math.cos(ang)*r,Math.sin(ang)*r):ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);}
  ctx.closePath();

  if(gem.isRune){
    // Gold gradient for rune gems
    const grad=ctx.createRadialGradient(-r*.2,-r*.3,r*.05,0,0,r);
    grad.addColorStop(0,'#fffbe0'); grad.addColorStop(.4,'#ffd700'); grad.addColorStop(1,'#7a5200');
    ctx.fillStyle=grad;
  } else {
    const grad=ctx.createRadialGradient(-r*.2,-r*.3,r*.05,0,0,r);
    grad.addColorStop(0,lighten(cl,.5)); grad.addColorStop(.55,cl); grad.addColorStop(1,darken(cl,.38));
    ctx.fillStyle=grad;
  }
  ctx.fill();
  ctx.strokeStyle=isSel?'#ffffff':lighten(cl,.38); ctx.lineWidth=isSel?2.5:gem.isRune?2:1.4; ctx.stroke();

  // Shine
  ctx.beginPath(); ctx.arc(-r*.18,-r*.22,r*.26,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.shadowBlur=0; ctx.fill();

  if(gem.isRune){
    // Rune letter label instead of emoji
    ctx.shadowBlur=8; ctx.shadowColor='#7a4000';
    ctx.font=`bold ${Math.max(10,Math.floor(s*.28))}px 'Cinzel Decorative',serif`;
    ctx.fillStyle='#3d1f00';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.globalAlpha=gem.opacity*.95;
    const abbr=gem.runeData?.abbr||'?';
    // Scale font down for longer abbreviations
    const fontSize=abbr.length>3?Math.max(8,Math.floor(s*.2)):Math.max(10,Math.floor(s*.26));
    ctx.font=`bold ${fontSize}px 'Rajdhani',sans-serif`;
    ctx.fillText(abbr,0,1);
    // Small star corners
    ctx.font=`${Math.floor(s*.18)}px serif`;
    ctx.globalAlpha=gem.opacity*.6;
    ctx.fillStyle='#7a4000';
    ctx.fillText('✦',0,-r*.62);
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
  const cx=col*GEM_SIZE+GEM_SIZE/2,cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=2+Math.random()*4;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,size:3+Math.random()*4,color:ECOLORS[type],alpha:1,decay:.025+Math.random()*.02,gravity:.12,sparkle:false});}
}
function spawnRP(col,row,color,n=35){
  const cx=col*GEM_SIZE+GEM_SIZE/2,cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=3+Math.random()*7;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,size:4+Math.random()*6,color,alpha:1,decay:.018+Math.random()*.014,gravity:.09,sparkle:true});}
}
function spawnRuneParticles(col,row){
  const cx=col*GEM_SIZE+GEM_SIZE/2,cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<50;i++){const a=Math.random()*Math.PI*2,sp=4+Math.random()*8;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-3,size:5+Math.random()*7,color:'#ffd700',alpha:1,decay:.015+Math.random()*.012,gravity:.08,sparkle:true});}
}
function updateParticles(){
  pCtx.clearRect(0,0,W,H);
  particles=particles.filter(p=>p.alpha>.01);
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.97;p.alpha-=p.decay;
    pCtx.save();pCtx.globalAlpha=Math.max(0,p.alpha);
    if(p.sparkle){pCtx.shadowBlur=10;pCtx.shadowColor=p.color;}
    pCtx.beginPath();pCtx.arc(p.x,p.y,p.size*p.alpha+.5,0,Math.PI*2);pCtx.fillStyle=p.color;pCtx.fill();pCtx.restore();});
}

// ── POPUP ─────────────────────────────────────────────────────────────────────
function showPopup(col,row,text,color='#ffe066'){
  const el=document.createElement('div'); el.className='score-popup'; el.textContent=text; el.style.color=color;
  const wr=wrapper.getBoundingClientRect();
  el.style.left=(wr.left+col*GEM_SIZE*(wr.width/W)+GEM_SIZE*(wr.width/W)/2)+'px';
  el.style.top=(wr.top+row*GEM_SIZE*(wr.height/H))+'px';
  el.style.position='fixed'; el.style.transform='translateX(-50%)';
  document.body.appendChild(el); setTimeout(()=>el.remove(),1200);
}

// ── MATCH FINDING ─────────────────────────────────────────────────────────────
function findMatches(){
  const m=new Set();
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS-2;c++){
    const t=board[r][c]?.type; if(!t)continue;
    if(board[r][c+1]?.type===t&&board[r][c+2]?.type===t){
      let e=c+2;while(e+1<COLS&&board[r][e+1]?.type===t)e++;
      for(let i=c;i<=e;i++)m.add(`${r},${i}`);c=e;}}
  for(let c=0;c<COLS;c++) for(let r=0;r<ROWS-2;r++){
    const t=board[r][c]?.type; if(!t)continue;
    if(board[r+1][c]?.type===t&&board[r+2][c]?.type===t){
      let e=r+2;while(e+1<ROWS&&board[e+1][c]?.type===t)e++;
      for(let i=r;i<=e;i++)m.add(`${i},${c}`);r=e;}}
  return m;
}

// ── REACTIONS ─────────────────────────────────────────────────────────────────
function checkReactions(matchedSet){
  const cells=[...matchedSet].map(k=>{const[r,c]=k.split(',').map(Number);return{r,c,type:board[r][c]?.type};}).filter(x=>x.type);
  let total=0;const seen=new Set();
  cells.forEach((a,i)=>cells.slice(i+1).forEach(b=>{
    const key=[a.type,b.type].sort().join(':');if(seen.has(key))return;
    const rx=REACTIONS.find(r=>(r.a===a.type&&r.b===b.type)||(r.a===b.type&&r.b===a.type));
    if(rx){seen.add(key);total+=rx.bonus;const mc=Math.floor((a.c+b.c)/2),mr=Math.floor((a.r+b.r)/2);
      spawnRP(mc,mr,rx.color,40);setTimeout(()=>showPopup(mc,mr,`${rx.label} +${rx.bonus}`,rx.color),80);}
  }));
  return total;
}

// ── PROCESS MATCHES ───────────────────────────────────────────────────────────
async function processMatches(){
  let chainDepth=0;
  while(true){
    const matched=findMatches(); if(matched.size===0)break;
    chainDepth++; combo++; if(combo>bestCombo)bestCombo=combo;
    updateComboUI();

    // Check if any rune gems are in this match
    const matchCells=[...matched].map(k=>k.split(',').map(Number));
    const runeMatches=matchCells.filter(([r,c])=>board[r][c]?.isRune);

    const rxBonus=checkReactions(matched);
    const groups={};
    matchCells.forEach(([r,c])=>{const t=board[r][c]?.type;if(t)groups[t]=(groups[t]||[]).concat([[r,c]]);});
    let ms=0;
    Object.entries(groups).forEach(([type,gc])=>{
      const n=Math.min(gc.length,5),base=BSCORE[n]||(n*80);
      const pts=Math.floor(base*(1+(combo-1)*.25)*(1+(chainDepth-1)*.35));
      ms+=pts; const mid=gc[Math.floor(gc.length/2)];
      spawnP(mid[1],mid[0],type,22);
      setTimeout(()=>showPopup(mid[1],mid[0],`+${pts}`,ECOLORS[type]),50);
    });

    addScore(ms+rxBonus,'gem');

    // Animate out
    matchCells.forEach(([r,c])=>{if(board[r][c]){board[r][c].scale=.01;board[r][c].opacity=0;}});
    await sleep(260);

    // Capture rune data before clearing
    const runeQuestions=runeMatches.map(([r,c])=>({...board[r][c].runeData, boardCol:c, boardRow:r}));
    runeMatches.forEach(()=>runesOnBoard=Math.max(0,runesOnBoard-1));
    updateRunesOnBoard();

    matchCells.forEach(([r,c])=>{board[r][c]=null;});

    // Gravity
    for(let c=0;c<COLS;c++){let wr=ROWS-1;for(let r=ROWS-1;r>=0;r--)if(board[r][c]){if(r!==wr){board[wr][c]=board[r][c];board[wr][c].targetY=wr*GEM_SIZE;board[r][c]=null;}wr--;}}
    await sleep(260);

    // Refill
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(!board[r][c])
      board[r][c]=makeGem(randomType(),-GEM_SIZE*(Math.floor(Math.random()*3)+1),r*GEM_SIZE);
    await sleep(300);

    // Trigger rune questions after refill
    if(runeQuestions.length>0&&!questionActive){
      for(const qd of runeQuestions){
        spawnRuneParticles(qd.boardCol||4, qd.boardRow||4);
        await sleep(400);
        await askRuneQuestion(qd);
      }
    }
  }
  if(chainDepth===0)combo=0;
  updateComboUI();
}

// ── QUESTION SYSTEM ───────────────────────────────────────────────────────────
function askRuneQuestion(qData){
  return new Promise(resolve=>{
    if(!gameActive){resolve();return;}
    questionActive=true;
    const lvl=LEVELS[level];
    const overlay=document.getElementById('question-overlay');
    document.getElementById('q-rune-letter').textContent=qData.abbr||'?';
    document.getElementById('q-topic-name').textContent=`${selectedTopic.icon} ${selectedTopic.name} — Level ${level+1} (${lvl.label})`;
    document.getElementById('q-question-text').textContent=qData.q;
    document.getElementById('q-bonus').textContent=lvl.correctBonus;
    document.getElementById('q-feedback').textContent='';
    document.getElementById('q-feedback').className='q-feedback';

    const choicesEl=document.getElementById('q-choices');
    choicesEl.innerHTML='';
    // Shuffle choices but track correct answer
    const shuffled=shuffleChoices(qData.choices, qData.answer);
    shuffled.choices.forEach((choice,i)=>{
      const btn=document.createElement('button');
      btn.className='q-choice';
      btn.innerHTML=`<strong>${String.fromCharCode(65+i)}.</strong> ${choice}`;
      btn.addEventListener('click',()=>{
        if(btn.disabled)return;
        choicesEl.querySelectorAll('.q-choice').forEach(b=>b.disabled=true);
        clearInterval(questionTimer);
        const isCorrect=(i===shuffled.correctIndex);
        handleAnswer(isCorrect, shuffled.correctIndex, lvl, choicesEl, resolve);
      });
      choicesEl.appendChild(btn);
    });

    // Timer bar
    const timerBar=document.getElementById('q-timer-bar');
    timerBar.style.transition='none'; timerBar.style.width='100%';
    timerBar.style.background='linear-gradient(90deg,#ffd700,#ff9a00)';
    let elapsed=0;
    setTimeout(()=>{
      timerBar.style.transition=`width ${lvl.questionTime}s linear`;
      timerBar.style.width='0%';
    },50);

    questionTimer=setInterval(()=>{
      elapsed+=0.1;
      const remaining=lvl.questionTime-elapsed;
      if(remaining<5) timerBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)';
      if(elapsed>=lvl.questionTime){
        clearInterval(questionTimer);
        choicesEl.querySelectorAll('.q-choice').forEach(b=>b.disabled=true);
        handleAnswer(false, shuffled.correctIndex, lvl, choicesEl, resolve, true);
      }
    },100);

    overlay.classList.add('active');
  });
}

function handleAnswer(isCorrect, correctIndex, lvl, choicesEl, resolve, timedOut=false){
  runesAnswered++;
  const choices=choicesEl.querySelectorAll('.q-choice');
  const feedback=document.getElementById('q-feedback');

  if(isCorrect){
    runesCorrect++;
    choices[correctIndex].classList.add('correct');
    feedback.textContent='✅ Correct! +'+lvl.correctBonus+' pts & +2 moves!';
    feedback.className='q-feedback good';
    addScore(lvl.correctBonus,'rune');
    movesLeft+=2; updateMovesUI();
    spawnRP(3,3,'#7fff5e',30);
    spawnRP(5,3,'#ffd700',30);
  } else {
    choices[correctIndex].classList.add('reveal');
    if(!timedOut){const wrongBtns=Array.from(choices).filter((_,i)=>i!==correctIndex&&!choices[i].classList.contains('reveal'));
      wrongBtns.forEach(b=>{if(b.disabled&&!b.classList.contains('reveal'))b.classList.add('wrong');});}
    feedback.textContent=timedOut?`⏰ Time's up! −${lvl.wrongPenalty} moves`:`❌ Wrong! −${lvl.wrongPenalty} moves`;
    feedback.className='q-feedback bad';
    movesLeft=Math.max(0,movesLeft-lvl.wrongPenalty);
    updateMovesUI();
    spawnRP(4,4,'#ff4e1a',20);
  }

  updateStats();
  setTimeout(()=>{
    document.getElementById('question-overlay').classList.remove('active');
    questionActive=false;
    resolve();
    if(movesLeft<=0&&gameActive){gameActive=false;clearTimeout(hintTimeout);setTimeout(showGameOver,600);}
  },2200);
}

function shuffleChoices(choices, correctIndex){
  const indexed=choices.map((c,i)=>({c,i}));
  const shuffled=shuffleArray(indexed);
  const newCorrectIndex=shuffled.findIndex(x=>x.i===correctIndex);
  return{choices:shuffled.map(x=>x.c),correctIndex:newCorrectIndex};
}

// ── SWAP ──────────────────────────────────────────────────────────────────────
async function trySwap(r1,c1,r2,c2){
  if(animating||questionActive)return;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1){selected={row:r2,col:c2};return;}
  animating=true;selected=null;
  const g1=board[r1][c1],g2=board[r2][c2];
  board[r1][c1]=g2;board[r2][c2]=g1;
  if(g1)g1.targetY=r2*GEM_SIZE; if(g2)g2.targetY=r1*GEM_SIZE;
  await sleep(SWAP_MS);
  if(findMatches().size===0){
    board[r1][c1]=g1;board[r2][c2]=g2;
    if(g1)g1.targetY=r1*GEM_SIZE;if(g2)g2.targetY=r2*GEM_SIZE;
    shakeGem(r1,c1);shakeGem(r2,c2);await sleep(SWAP_MS);
  } else {
    movesLeft--;updateMovesUI();
    await processMatches();
  }
  animating=false;resetHintTimer();checkGameState();
}

function shakeGem(r,c){
  if(!board[r]?.[c])return;let t=0;
  const iv=setInterval(()=>{if(!board[r]?.[c]){clearInterval(iv);return;}board[r][c].shake=Math.sin(t*2.8)*5;t++;if(t>SHAKE_N){board[r][c].shake=0;clearInterval(iv);}},28);
}

// ── CLICK ─────────────────────────────────────────────────────────────────────
canvas.addEventListener('click',(e)=>{
  if(!gameActive||animating||questionActive)return;
  const rect=canvas.getBoundingClientRect();
  const scaleX=W/rect.width,scaleY=H/rect.height;
  const mx=(e.clientX-rect.left)*scaleX,my=(e.clientY-rect.top)*scaleY;
  const col=Math.floor(mx/GEM_SIZE),row=Math.floor(my/GEM_SIZE);
  if(row<0||row>=ROWS||col<0||col>=COLS||!board[row]?.[col])return;
  if(!selected)selected={row,col};
  else if(selected.row===row&&selected.col===col)selected=null;
  else trySwap(selected.row,selected.col,row,col);
});

// ── SCORE ─────────────────────────────────────────────────────────────────────
function addScore(pts,source='gem'){
  if(pts<=0)return;
  const prev=score; score+=pts; scoreThisLevel+=pts;
  if(source==='gem')gemScoreThisLevel+=pts;
  else runeScoreThisLevel+=pts;
  if(score>bestScore){bestScore=score;localStorage.setItem('cryst_best',bestScore);}
  animCount(scoreEl,prev,score,380);
  animCount(bestEl,parseInt(bestEl.textContent.replace(/,/g,''))||0,bestScore,380);
  scoreEl.classList.add('pop');setTimeout(()=>scoreEl.classList.remove('pop'),280);
  // Check rune spawn threshold
  checkRuneSpawn();
  updateRuneProgress();
}

function checkRuneSpawn(){
  const lvl=LEVELS[level];
  if(score>=scoreToNextRune){
    scoreToNextRune=score+lvl.runeEvery;
    setTimeout(spawnRuneGem,300);
  }
}

function animCount(el,from,to,dur){
  const start=performance.now(),diff=to-from;
  function step(now){const p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.floor(from+diff*e).toLocaleString();if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
function updateComboUI(){
  if(combo>1){comboNum.textContent=combo;comboEl.classList.add('visible');clearTimeout(comboEl._t);comboEl._t=setTimeout(()=>comboEl.classList.remove('visible'),2200);}
  else comboEl.classList.remove('visible');
}
function updateMovesUI(){
  const max=LEVELS[level].moves;movesCount.textContent=`${movesLeft} / ${max}`;
  const pct=movesLeft/max*100;movesBar.style.width=pct+'%';
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
function resetHintTimer(){hintCell=null;clearTimeout(hintTimeout);if(!gameActive)return;hintTimeout=setTimeout(()=>{hintCell=findBestHint();},5000);}
function findBestHint(){
  let best=-1,bc=null;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    for(const[nr,nc]of[[r-1,c],[r+1,c],[r,c-1],[r,c+1]]){
      if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;
      const tmp=board[r][c];board[r][c]=board[nr][nc];board[nr][nc]=tmp;
      const cnt=findMatches().size;board[nr][nc]=board[r][c];board[r][c]=tmp;
      if(cnt>best){best=cnt;bc={row:r,col:c};}
    }
  return best>0?bc:null;
}

// ── DIFFICULTY PANEL ──────────────────────────────────────────────────────────
function updateDifficultyPanel(){
  const panel=document.getElementById('difficulty-panel');
  const lvl=LEVELS[level];
  panel.innerHTML=`
    <div class="stat-row"><span class="stat-key">Difficulty</span><span class="stat-val gold">${lvl.label}</span></div>
    <div class="stat-row"><span class="stat-key">Timer</span><span class="stat-val">${lvl.questionTime}s</span></div>
    <div class="stat-row"><span class="stat-key">Correct</span><span class="stat-val gold">+${lvl.correctBonus}pts</span></div>
    <div class="stat-row"><span class="stat-key">Wrong</span><span class="stat-val" style="color:#ff4e1a">−${lvl.wrongPenalty} moves</span></div>
    <div class="stat-row"><span class="stat-key">Max Runes</span><span class="stat-val">${lvl.maxRunes}</span></div>
  `;
}

// ── GAME STATE ────────────────────────────────────────────────────────────────
function checkGameState(){
  if(score>=LEVELS[level].target){gameActive=false;clearTimeout(hintTimeout);setTimeout(showLevelComplete,500);}
  else if(movesLeft<=0&&!questionActive){gameActive=false;clearTimeout(hintTimeout);setTimeout(showGameOver,500);}
}

function showLevelComplete(){
  const lvl=LEVELS[level];
  const stars=score>=lvl.target*2?3:score>=lvl.target*1.4?2:1;
  document.getElementById('level-title').textContent=level>=LEVELS.length-1?'🏆 You Are a Master!':'✦ Level Complete!';
  document.getElementById('level-score').textContent=score.toLocaleString();
  document.getElementById('level-feedback').textContent=['','Keep at it!','Nice work!','Amazing!','Perfect master!'][stars+1]||'Brilliant!';
  document.getElementById('score-breakdown').innerHTML=`
    <div class="breakdown-row"><span class="label">Gem Matches</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Bonuses</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Quiz Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
    <div class="breakdown-row"><span class="label">Best Combo</span><span class="val">x${bestCombo}</span></div>
  `;
  document.querySelectorAll('.star').forEach((el,i)=>{el.classList.remove('lit');if(i<stars)setTimeout(()=>el.classList.add('lit'),180+i*160);});
  document.getElementById('level-overlay').classList.add('active');
  for(let i=0;i<8;i++)setTimeout(()=>spawnRP(Math.floor(Math.random()*COLS),Math.floor(Math.random()*ROWS),['#ff4e1a','#00c8ff','#ffe033','#cc44ff','#ffd700'][i%5],25),i*100);
}

function showGameOver(){
  document.getElementById('final-score').textContent=score.toLocaleString();
  const pct=score/LEVELS[level].target;
  document.getElementById('go-breakdown').innerHTML=`
    <div class="breakdown-row"><span class="label">Gem Score</span><span class="val">+${gemScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Rune Score</span><span class="val">+${runeScoreThisLevel.toLocaleString()}</span></div>
    <div class="breakdown-row"><span class="label">Quiz Accuracy</span><span class="val">${runesAnswered>0?Math.round(runesCorrect/runesAnswered*100):0}%</span></div>
  `;
  document.getElementById('gameover-feedback').textContent=pct>=.8?'So close! Try again!':pct>=.5?'Good effort — use the Rune bonuses!':'Use Rune answers to boost your score!';
  document.getElementById('gameover-overlay').classList.add('active');
}

// ── LEVEL CONTROL ─────────────────────────────────────────────────────────────
function beginLevel(){
  score=0;combo=0;bestCombo=0;animating=false;selected=null;particles=[];hintCell=null;questionActive=false;
  scoreThisLevel=0;gemScoreThisLevel=0;runeScoreThisLevel=0;runesOnBoard=0;
  runesAnswered=0;runesCorrect=0;
  const lvl=LEVELS[level];
  movesLeft=lvl.moves;
  scoreToNextRune=lvl.runeThreshold;
  scoreEl.textContent='0';levelEl.textContent=level+1;bestEl.textContent=bestScore.toLocaleString();
  runeEl.textContent='0';
  targetEl.textContent=lvl.target.toLocaleString();
  objEl.textContent=lvl.label+' — reach '+lvl.target.toLocaleString()+' pts';
  updateMovesUI();updateDifficultyPanel();updateStats();
  comboEl.classList.remove('visible');runeAlert.classList.remove('visible');
  runeBar.style.width='0%';runeCountInfo.textContent=`0/${lvl.runeThreshold} pts`;
  initBoard();gameActive=true;resetHintTimer();
}

window.startGame =function(){ document.getElementById('start-overlay')?.classList.remove('active'); level=0; beginLevel(); };
window.nextLevel =function(){ document.getElementById('level-overlay').classList.remove('active'); level=level<LEVELS.length-1?level+1:0; beginLevel(); };
window.restartGame=function(){
  ['level-overlay','gameover-overlay'].forEach(id=>document.getElementById(id).classList.remove('active'));
  level=0; beginLevel();
};

// ── PHYSICS UPDATE ────────────────────────────────────────────────────────────
function updateBoard(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const g=board[r]?.[c];if(!g)continue;
    const dy=g.targetY-g.y;g.y+=dy*.2;if(Math.abs(dy)<.4)g.y=g.targetY;
    g.scale+=(1-g.scale)*.14;
  }
}

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function shuffleArray(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

// ── MAIN LOOP ─────────────────────────────────────────────────────────────────
function gameLoop(){drawStars();updateBoard();renderBoard();updateParticles();requestAnimationFrame(gameLoop);}

// ── BOOT ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize',()=>{bgCanvas.width=window.innerWidth;bgCanvas.height=window.innerHeight;initStars();});
buildTopicGrid();
initStars();
requestAnimationFrame(gameLoop);