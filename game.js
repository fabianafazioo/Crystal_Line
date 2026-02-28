/* ============================================================
   CRYSTALLINE — Elemental Gem Puzzle  v2 (bug-fixed)
   Fixes: gem rendering, click scaling, board init, gravity
   ============================================================ */
'use strict';

const COLS = 8, ROWS = 8, GEM_SIZE = 58, SWAP_DURATION = 220, SHAKE_FRAMES = 10;
const ELEMENTS = ['fire','water','ice','lightning','earth','shadow'];
const ELEMENT_COLORS = { fire:'#ff4e1a', water:'#00c8ff', ice:'#a8f0ff', lightning:'#ffe033', earth:'#7fff5e', shadow:'#cc44ff' };
const ELEMENT_GLOW   = { fire:'rgba(255,78,26,0.75)', water:'rgba(0,200,255,0.75)', ice:'rgba(168,240,255,0.75)', lightning:'rgba(255,224,51,0.75)', earth:'rgba(127,255,94,0.75)', shadow:'rgba(204,68,255,0.75)' };
const ELEMENT_EMOJI  = { fire:'🔥', water:'💧', ice:'❄️', lightning:'⚡', earth:'🌿', shadow:'🔮' };

const REACTIONS = [
  { a:'fire',b:'ice',bonus:180,label:'Melt!',color:'#ff9944' },
  { a:'water',b:'lightning',bonus:220,label:'Shock!',color:'#88eeff' },
  { a:'lightning',b:'fire',bonus:200,label:'Ignite!',color:'#ffdd55' },
  { a:'earth',b:'water',bonus:160,label:'Absorb!',color:'#88ff88' },
  { a:'fire',b:'earth',bonus:300,label:'Wildfire!',color:'#ff6600' },
  { a:'shadow',b:'fire',bonus:250,label:'Phantom!',color:'#ee44ff' },
  { a:'shadow',b:'water',bonus:250,label:'Phantom!',color:'#ee44ff' },
  { a:'shadow',b:'ice',bonus:250,label:'Phantom!',color:'#ee44ff' },
  { a:'shadow',b:'lightning',bonus:250,label:'Phantom!',color:'#ee44ff' },
  { a:'shadow',b:'earth',bonus:250,label:'Phantom!',color:'#ee44ff' },
];
const BASE_SCORE = { 3:100, 4:200, 5:350 };
const LEVELS = [
  { moves:20, target:500,  objective:'Get 500 points!' },
  { moves:18, target:900,  objective:'Reach 900 — use combos!' },
  { moves:16, target:1400, objective:'Chain reactions needed!' },
  { moves:15, target:2000, objective:'Master the elements!' },
  { moves:14, target:2800, objective:'Pure crystal mastery!' },
];

// ── State ────────────────────────────────────────────────────────────────────
let board=[], score=0, bestScore=parseInt(localStorage.getItem('crystalline_best')||'0');
let level=0, movesLeft=0, combo=0, selected=null, animating=false, gameActive=false;
let particles=[], hintCell=null, hintTimeout=null;

// ── Canvases ─────────────────────────────────────────────────────────────────
const canvas  = document.getElementById('game-canvas');
const pCanvas = document.getElementById('particle-canvas');
const bgCanvas= document.getElementById('bg-canvas');
const ctx     = canvas.getContext('2d');
const pCtx    = pCanvas.getContext('2d');
const bgCtx   = bgCanvas.getContext('2d');
const W = COLS*GEM_SIZE, H = ROWS*GEM_SIZE;
canvas.width = pCanvas.width = W;
canvas.height= pCanvas.height= H;

// ── DOM ───────────────────────────────────────────────────────────────────────
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

// ── Starfield ─────────────────────────────────────────────────────────────────
let stars=[];
function initStars(){
  bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight;
  stars=Array.from({length:200},()=>({ x:Math.random()*bgCanvas.width, y:Math.random()*bgCanvas.height, r:Math.random()*1.4+0.2, speed:Math.random()*0.2+0.04, tw:Math.random()*Math.PI*2, tws:Math.random()*0.04+0.01 }));
}
function drawStars(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  const g=bgCtx.createRadialGradient(bgCanvas.width/2,bgCanvas.height/2,0,bgCanvas.width/2,bgCanvas.height/2,bgCanvas.width*0.7);
  g.addColorStop(0,'#130924'); g.addColorStop(1,'#060310');
  bgCtx.fillStyle=g; bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);
  stars.forEach(s=>{ s.tw+=s.tws; const a=0.3+0.7*Math.abs(Math.sin(s.tw)); bgCtx.beginPath(); bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2); bgCtx.fillStyle=`rgba(220,210,255,${a})`; bgCtx.fill(); s.y-=s.speed; if(s.y<-2){s.y=bgCanvas.height+2;s.x=Math.random()*bgCanvas.width;} });
}

// ── Board ─────────────────────────────────────────────────────────────────────
function randomType(){ return ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]; }

function causesMatch(b,row,col,type){
  if(col>=2 && b[row][col-1]?.type===type && b[row][col-2]?.type===type) return true;
  if(row>=2 && b[row-1]?.[col]?.type===type && b[row-2]?.[col]?.type===type) return true;
  return false;
}

function makeGem(type, startY, targetY){
  return { type, y:startY, targetY, opacity:1, scale:1, shake:0, born:Date.now() };
}

function initBoard(){
  board=[];
  for(let r=0;r<ROWS;r++){
    board[r]=[];
    for(let c=0;c<COLS;c++){
      let type, tries=0;
      do{ type=randomType(); tries++; } while(tries<20 && causesMatch(board,r,c,type));
      // Gems start at their correct position immediately — no off-screen spawn on init
      board[r][c]=makeGem(type, r*GEM_SIZE, r*GEM_SIZE);
    }
  }
}

// ── Color helpers ─────────────────────────────────────────────────────────────
function hexToRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function lighten(h,a){ const [r,g,b]=hexToRgb(h); return `rgb(${Math.min(255,r+255*a)|0},${Math.min(255,g+255*a)|0},${Math.min(255,b+255*a)|0})`; }
function darken(h,a){  const [r,g,b]=hexToRgb(h); return `rgb(${Math.max(0,r-255*a)|0},${Math.max(0,g-255*a)|0},${Math.max(0,b-255*a)|0})`; }

// ── Draw single gem ───────────────────────────────────────────────────────────
function drawGem(gem, col, row){
  if(!gem) return;
  const isSel  = selected  && selected.row===row  && selected.col===col;
  const isHint = hintCell  && hintCell.row===row  && hintCell.col===col;
  const cx = col*GEM_SIZE + GEM_SIZE/2 + gem.shake;
  const cy = gem.y + GEM_SIZE/2;
  const s  = GEM_SIZE * gem.scale * 0.86;
  const r  = s * 0.42;
  const cl = ELEMENT_COLORS[gem.type];

  ctx.save();
  ctx.globalAlpha = gem.opacity;
  ctx.translate(cx, cy);

  if(isSel){
    ctx.shadowBlur=32; ctx.shadowColor=cl; ctx.scale(1.13,1.13);
  } else if(isHint){
    const pulse=0.6+0.4*Math.sin(Date.now()*0.008);
    ctx.shadowBlur=26*pulse; ctx.shadowColor='#ffe066'; ctx.scale(1+0.05*pulse,1+0.05*pulse);
  } else {
    ctx.shadowBlur=10; ctx.shadowColor=ELEMENT_GLOW[gem.type];
  }

  // Crystal hexagon
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const ang=(i*Math.PI/3)-Math.PI/6;
    i===0 ? ctx.moveTo(Math.cos(ang)*r, Math.sin(ang)*r) : ctx.lineTo(Math.cos(ang)*r, Math.sin(ang)*r);
  }
  ctx.closePath();

  const grad=ctx.createRadialGradient(-r*0.2,-r*0.3,r*0.05,0,0,r);
  grad.addColorStop(0,lighten(cl,0.5)); grad.addColorStop(0.55,cl); grad.addColorStop(1,darken(cl,0.38));
  ctx.fillStyle=grad; ctx.fill();
  ctx.strokeStyle=isSel?'#ffffff':lighten(cl,0.38); ctx.lineWidth=isSel?2.5:1.4; ctx.stroke();

  // Shine
  ctx.beginPath(); ctx.arc(-r*0.18,-r*0.22,r*0.26,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.shadowBlur=0; ctx.fill();

  // Emoji
  ctx.font=`${Math.floor(s*0.36)}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowBlur=0; ctx.globalAlpha=gem.opacity*0.92;
  ctx.fillText(ELEMENT_EMOJI[gem.type],0,1);
  ctx.restore();
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderBoard(){
  ctx.clearRect(0,0,W,H);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    ctx.fillStyle=(r+c)%2===0?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.015)';
    ctx.beginPath(); ctx.roundRect(c*GEM_SIZE+2,r*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  if(selected){
    ctx.fillStyle='rgba(167,139,250,0.18)'; ctx.beginPath();
    ctx.roundRect(selected.col*GEM_SIZE+2,selected.row*GEM_SIZE+2,GEM_SIZE-4,GEM_SIZE-4,8); ctx.fill();
  }
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r]?.[c]) drawGem(board[r][c],c,r);
}

// ── Particles ─────────────────────────────────────────────────────────────────
function spawnParticles(col,row,type,n=18){
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2,sp=2+Math.random()*4;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,size:3+Math.random()*4,color:ELEMENT_COLORS[type],alpha:1,decay:0.025+Math.random()*0.02,gravity:0.12,sparkle:false}); }
}
function spawnReactionParticles(col,row,color,n=35){
  const cx=col*GEM_SIZE+GEM_SIZE/2, cy=row*GEM_SIZE+GEM_SIZE/2;
  for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2,sp=3+Math.random()*7;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,size:4+Math.random()*6,color,alpha:1,decay:0.018+Math.random()*0.014,gravity:0.09,sparkle:true}); }
}
function updateParticles(){
  pCtx.clearRect(0,0,W,H);
  particles=particles.filter(p=>p.alpha>0.01);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=0.97; p.alpha-=p.decay;
    pCtx.save(); pCtx.globalAlpha=Math.max(0,p.alpha);
    if(p.sparkle){pCtx.shadowBlur=10;pCtx.shadowColor=p.color;}
    pCtx.beginPath(); pCtx.arc(p.x,p.y,p.size*p.alpha+0.5,0,Math.PI*2);
    pCtx.fillStyle=p.color; pCtx.fill(); pCtx.restore();
  });
}

// ── Popup ─────────────────────────────────────────────────────────────────────
function showPopup(col,row,text,color='#ffe066'){
  const el=document.createElement('div'); el.className='score-popup'; el.textContent=text; el.style.color=color;
  const wr=wrapper.getBoundingClientRect();
  el.style.left=(wr.left+col*GEM_SIZE*(wr.width/W)+GEM_SIZE*(wr.width/W)/2)+'px';
  el.style.top =(wr.top +row*GEM_SIZE*(wr.height/H))+'px';
  el.style.position='fixed'; el.style.transform='translateX(-50%)';
  document.body.appendChild(el); setTimeout(()=>el.remove(),1200);
}

// ── Match finding ─────────────────────────────────────────────────────────────
function findMatches(){
  const m=new Set();
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS-2;c++){
    const t=board[r][c]?.type; if(!t) continue;
    if(board[r][c+1]?.type===t&&board[r][c+2]?.type===t){
      let e=c+2; while(e+1<COLS&&board[r][e+1]?.type===t)e++;
      for(let i=c;i<=e;i++) m.add(`${r},${i}`); c=e;
    }
  }
  for(let c=0;c<COLS;c++) for(let r=0;r<ROWS-2;r++){
    const t=board[r][c]?.type; if(!t) continue;
    if(board[r+1][c]?.type===t&&board[r+2][c]?.type===t){
      let e=r+2; while(e+1<ROWS&&board[e+1][c]?.type===t)e++;
      for(let i=r;i<=e;i++) m.add(`${i},${c}`); r=e;
    }
  }
  return m;
}

// ── Reactions ─────────────────────────────────────────────────────────────────
function checkReactions(matchedSet){
  const cells=[...matchedSet].map(k=>{const[r,c]=k.split(',').map(Number);return{r,c,type:board[r][c]?.type};}).filter(x=>x.type);
  let total=0; const seen=new Set();
  cells.forEach((a,i)=>cells.slice(i+1).forEach(b=>{
    const key=[a.type,b.type].sort().join(':'); if(seen.has(key))return;
    const rx=REACTIONS.find(r=>(r.a===a.type&&r.b===b.type)||(r.a===b.type&&r.b===a.type));
    if(rx){ seen.add(key); total+=rx.bonus;
      const mc=Math.floor((a.c+b.c)/2),mr=Math.floor((a.r+b.r)/2);
      spawnReactionParticles(mc,mr,rx.color,40);
      setTimeout(()=>showPopup(mc,mr,`${rx.label} +${rx.bonus}`,rx.color),80);
    }
  }));
  return total;
}

// ── Process matches ───────────────────────────────────────────────────────────
async function processMatches(){
  let chainDepth=0;
  while(true){
    const matched=findMatches(); if(matched.size===0) break;
    chainDepth++; combo++; updateComboUI();
    const rxBonus=checkReactions(matched);
    const cells=[...matched].map(k=>k.split(',').map(Number));
    const groups={};
    cells.forEach(([r,c])=>{ const t=board[r][c]?.type; if(t) groups[t]=(groups[t]||[]).concat([[r,c]]); });
    let ms=0;
    Object.entries(groups).forEach(([type,gc])=>{
      const n=Math.min(gc.length,5), base=BASE_SCORE[n]||(n*80);
      const pts=Math.floor(base*(1+(combo-1)*0.25)*(1+(chainDepth-1)*0.35));
      ms+=pts; const mid=gc[Math.floor(gc.length/2)];
      spawnParticles(mid[1],mid[0],type,22);
      setTimeout(()=>showPopup(mid[1],mid[0],`+${pts}`,ELEMENT_COLORS[type]),50);
    });
    addScore(ms+rxBonus);
    cells.forEach(([r,c])=>{ if(board[r][c]){board[r][c].scale=0.01;board[r][c].opacity=0;} });
    await sleep(260);
    cells.forEach(([r,c])=>{ board[r][c]=null; });
    // Gravity — compact downward
    for(let c=0;c<COLS;c++){
      let wr=ROWS-1;
      for(let r=ROWS-1;r>=0;r--) if(board[r][c]){ if(r!==wr){board[wr][c]=board[r][c];board[wr][c].targetY=wr*GEM_SIZE;board[r][c]=null;} wr--; }
    }
    await sleep(280);
    // Refill from above
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(!board[r][c])
      board[r][c]=makeGem(randomType(), -GEM_SIZE*(Math.floor(Math.random()*3)+1), r*GEM_SIZE);
    await sleep(320);
  }
  if(chainDepth===0) combo=0;
  updateComboUI();
}

// ── Swap ──────────────────────────────────────────────────────────────────────
async function trySwap(r1,c1,r2,c2){
  if(animating) return;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1){ selected={row:r2,col:c2}; return; }
  animating=true; selected=null;
  const g1=board[r1][c1], g2=board[r2][c2];
  board[r1][c1]=g2; board[r2][c2]=g1;
  if(g1) g1.targetY=r2*GEM_SIZE;
  if(g2) g2.targetY=r1*GEM_SIZE;
  await sleep(SWAP_DURATION);
  if(findMatches().size===0){
    board[r1][c1]=g1; board[r2][c2]=g2;
    if(g1) g1.targetY=r1*GEM_SIZE; if(g2) g2.targetY=r2*GEM_SIZE;
    shakeGem(r1,c1); shakeGem(r2,c2);
    await sleep(SWAP_DURATION);
  } else {
    movesLeft--; updateMovesUI();
    await processMatches();
  }
  animating=false; resetHintTimer(); checkGameState();
}

function shakeGem(r,c){
  if(!board[r]?.[c]) return; let t=0;
  const iv=setInterval(()=>{ if(!board[r]?.[c]){clearInterval(iv);return;} board[r][c].shake=Math.sin(t*2.8)*5; t++; if(t>SHAKE_FRAMES){board[r][c].shake=0;clearInterval(iv);} },28);
}

// ── Click handler — with CSS scaling fix ─────────────────────────────────────
canvas.addEventListener('click',(e)=>{
  if(!gameActive||animating) return;
  const rect=canvas.getBoundingClientRect();
  // Account for CSS scaling: canvas may be rendered at different size than its pixel dimensions
  const scaleX=W/rect.width, scaleY=H/rect.height;
  const mx=(e.clientX-rect.left)*scaleX;
  const my=(e.clientY-rect.top)*scaleY;
  const col=Math.floor(mx/GEM_SIZE), row=Math.floor(my/GEM_SIZE);
  if(row<0||row>=ROWS||col<0||col>=COLS||!board[row]?.[col]) return;
  if(!selected){ selected={row,col}; }
  else if(selected.row===row&&selected.col===col){ selected=null; }
  else{ trySwap(selected.row,selected.col,row,col); }
});

// ── UI helpers ────────────────────────────────────────────────────────────────
function addScore(pts){
  if(pts<=0) return; const prev=score; score+=pts;
  if(score>bestScore){ bestScore=score; localStorage.setItem('crystalline_best',bestScore); }
  animateCounter(scoreEl,prev,score,380);
  animateCounter(bestEl,parseInt(bestEl.textContent.replace(/,/g,''))||0,bestScore,380);
  scoreEl.classList.add('pop'); setTimeout(()=>scoreEl.classList.remove('pop'),280);
}
function animateCounter(el,from,to,dur){
  const start=performance.now(),diff=to-from;
  function step(now){ const p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(from+diff*e).toLocaleString(); if(p<1)requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
function updateComboUI(){
  if(combo>1){ comboNum.textContent=combo; comboEl.classList.add('visible'); clearTimeout(comboEl._t); comboEl._t=setTimeout(()=>comboEl.classList.remove('visible'),2200); }
  else comboEl.classList.remove('visible');
}
function updateMovesUI(){
  const max=LEVELS[level].moves; movesCount.textContent=`${movesLeft} / ${max}`;
  const pct=movesLeft/max*100; movesBar.style.width=pct+'%';
  if(pct<=25){movesBar.style.background='linear-gradient(90deg,#ff4e1a,#ff8844)';movesBar.style.boxShadow='0 0 8px rgba(255,78,26,0.7)';}
  else if(pct<=50){movesBar.style.background='linear-gradient(90deg,#ffe033,#ffaa44)';movesBar.style.boxShadow='0 0 8px rgba(255,224,51,0.5)';}
  else{movesBar.style.background='linear-gradient(90deg,#a78bfa,#60d0ff)';movesBar.style.boxShadow='0 0 8px rgba(96,208,255,0.6)';}
}

// ── Hint ──────────────────────────────────────────────────────────────────────
function resetHintTimer(){ hintCell=null; clearTimeout(hintTimeout); if(!gameActive)return; hintTimeout=setTimeout(()=>{ hintCell=findBestHint(); },5000); }
function findBestHint(){
  let best=-1,bc=null;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    for(const[nr,nc] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]){
      if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;
      const tmp=board[r][c]; board[r][c]=board[nr][nc]; board[nr][nc]=tmp;
      const cnt=findMatches().size; board[nr][nc]=board[r][c]; board[r][c]=tmp;
      if(cnt>best){best=cnt;bc={row:r,col:c};}
    }
  return best>0?bc:null;
}

// ── Game state ────────────────────────────────────────────────────────────────
function checkGameState(){
  if(score>=LEVELS[level].target){ gameActive=false; clearTimeout(hintTimeout); setTimeout(showLevelComplete,500); return; }
  if(movesLeft<=0){ gameActive=false; clearTimeout(hintTimeout); setTimeout(showGameOver,500); }
}
function showLevelComplete(){
  const lvl=LEVELS[level], stars=score>=lvl.target*2?3:score>=lvl.target*1.4?2:1;
  document.getElementById('level-title').textContent=level>=LEVELS.length-1?'🏆 You Win!':'✨ Level Complete!';
  document.getElementById('level-score').textContent=score.toLocaleString();
  document.getElementById('level-feedback').textContent=['','Keep going!','Nice work!','Amazing! 🔮'][stars]||'Brilliant!';
  document.querySelectorAll('.star').forEach((el,i)=>{ el.classList.remove('lit'); if(i<stars)setTimeout(()=>el.classList.add('lit'),180+i*160); });
  document.getElementById('level-overlay').classList.add('active');
  for(let i=0;i<6;i++) setTimeout(()=>spawnReactionParticles(Math.floor(Math.random()*COLS),Math.floor(Math.random()*ROWS),['#ff4e1a','#00c8ff','#ffe033','#cc44ff','#7fff5e'][i%5],28),i*110);
}
function showGameOver(){
  document.getElementById('final-score').textContent=score.toLocaleString();
  const pct=score/LEVELS[level].target;
  document.getElementById('gameover-feedback').textContent=pct>=0.8?'So close! Try again! 💜':pct>=0.5?'Good effort — keep practising!':'Every master started here. Try again!';
  document.getElementById('gameover-overlay').classList.add('active');
}

// ── Level control ─────────────────────────────────────────────────────────────
function beginLevel(){
  score=0; combo=0; animating=false; selected=null; particles=[]; hintCell=null;
  const lvl=LEVELS[level]; movesLeft=lvl.moves;
  scoreEl.textContent='0'; levelEl.textContent=level+1; bestEl.textContent=bestScore.toLocaleString();
  targetEl.textContent=lvl.target.toLocaleString(); objEl.textContent=lvl.objective;
  updateMovesUI(); comboEl.classList.remove('visible');
  initBoard(); gameActive=true; resetHintTimer();
}

window.startGame  = ()=>{ document.getElementById('start-overlay').classList.remove('active'); level=0; beginLevel(); };
window.nextLevel  = ()=>{ document.getElementById('level-overlay').classList.remove('active'); level=level<LEVELS.length-1?level+1:0; beginLevel(); };
window.restartGame= ()=>{ document.getElementById('level-overlay').classList.remove('active'); document.getElementById('gameover-overlay').classList.remove('active'); level=0; beginLevel(); };

// ── Physics update ────────────────────────────────────────────────────────────
function updateBoard(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const g=board[r]?.[c]; if(!g)continue;
    const dy=g.targetY-g.y; g.y+=dy*0.2; if(Math.abs(dy)<0.4)g.y=g.targetY;
    g.scale+=(1-g.scale)*0.14;
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────────
function gameLoop(){ drawStars(); updateBoard(); renderBoard(); updateParticles(); requestAnimationFrame(gameLoop); }

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize',()=>{ bgCanvas.width=window.innerWidth; bgCanvas.height=window.innerHeight; initStars(); });
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
initStars();
requestAnimationFrame(gameLoop);