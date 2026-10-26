// ===== ACCOUNTS (Google Sign-In) =====
// Paste your own Google OAuth Client ID here (steps are in the README / chat). Until then, Google sign-in shows a setup message and Guest works.
const GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
let ACC=null;try{ACC=JSON.parse(localStorage.getItem('pqacct')||'null')}catch(e){}
const pk=k=>k+':'+(ACC&&ACC.id||'guest');   // each account gets its own saved progress
// scale the menu screens to the window (same big size as the game screen)
function fit(){const w=typeof innerWidth=='number'?innerWidth:1200,h=typeof innerHeight=='number'?innerHeight:700;document.documentElement.style.setProperty('--k',Math.max(.4,Math.min(w,h*320/176)/812).toFixed(3))}
if(typeof addEventListener=='function')addEventListener('resize',fit);fit();
const T=16,W=320,H=176,cv=document.getElementById('c'),g=cv.getContext('2d'),ov=document.getElementById('ov');
const LV=[
{w:100,gaps:[[22,3],[45,3],[70,3]],pl:[[14,6,3],[26,6,3],[32,6,4],[50,6,3],[56,5,3],[62,6,3],[75,6,3],[36,6,1],[38,6,1]],en:[18,38,54,66,85],sp:[41,60,80],cp:48,bt:[[28,7],[56,7],[88,7]],mb:[[37,6],[10,6],[67,6],[90,6]],tu:[30,76],pp:[12,92]},
{w:120,gaps:[[15,3],[30,3],[50,3],[66,5],[90,4]],pl:[[10,7,3],[19,6,3],[33,6,3],[40,6,3],[53,6,3],[60,6,3],[68,7,2],[72,6,2],[80,6,3],[91,7,2],[95,6,3],[47,6,1],[49,6,1]],en:[12,25,44,58,76,84,100],sp:[22,47,62,86,105],cp:64,bt:[[24,7],[44,7],[74,7],[98,7],[103,7]],mb:[[48,6],[6,6],[28,6],[64,6],[85,6]],tu:[8,36,56,98],pp:[38,110]}
];
// ---- 100 levels: levels 1-2 are hand-made, 3-100 are generated (harder each time) ----
const MAXL=100,CACHE={};
let START=Math.max(0,Math.min(MAXL-1,(+new URLSearchParams(location.search).get('level')||1)-1));
const START0=START;
let unlocked=1;
const DN=['EASY','NORMAL','HARD'],DM=[.7,1,1.4],DL=[5,3,2];let SP=[],DIFF=1;
function loadProgress(){unlocked=1;DIFF=1;best=0;try{unlocked=Math.max(1,Math.min(MAXL,+localStorage.getItem(pk('pqu'))||1));const d=localStorage.getItem(pk('pqd'));if(d!==null)DIFF=Math.max(0,Math.min(2,+d));best=+localStorage.getItem(pk('pq'))||0}catch(e){}unlocked=Math.max(unlocked,START0+1)}
function setDiff(d){DIFF=d;try{localStorage.setItem(pk('pqd'),d)}catch(e){}document.querySelectorAll('.df').forEach(b=>b.classList.toggle('on',+b.dataset.d==DIFF))}
function saveUnlock(){try{localStorage.setItem(pk('pqu'),unlocked)}catch(e){}}
function unlockNext(){const n=Math.min(MAXL,lvl+2);if(n>unlocked){unlocked=n;saveUnlock()}}
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gen(n,sd){const r=rng((sd??n)*7919+13),d=Math.min(1,n/100),w=90+Math.floor(n*.6);
 const o={w,gaps:[],pl:[],en:[],sp:[],cp:0,bt:[],mb:[],tu:[],pp:[]};
 for(let x0=10;x0<w-14;x0+=9){
  if(r()<.25+.3*d)o.gaps.push([x0,2+(r()<.35+.4*d?1:0)]);
  if(r()<.2)o.mb.push([x0+3,6]);
  const q=r();
  if(q<.35)(r()<.4?o.tu:o.en).push(x0+6);
  else if(q<.55+.2*d)o.sp.push(x0+6);
  const pipe=q>=.75&&q<.9;if(pipe)o.pp.push(x0+5);
  if(r()<.5&&!pipe)o.pl.push([x0+5,6,2+Math.floor(r()*3)]);
  if(r()<.1+.4*d&&!pipe)o.bt.push([x0+3+Math.floor(r()*3),7]);
 }
 let c=Math.floor(w/2);while(o.gaps.some(([a,b])=>c>=a-1&&c<=a+b)||o.sp.includes(c)||o.sp.includes(c-1)||o.pp.some(a=>c>=a-1&&c<=a+2))c++;o.cp=c;return o}
function getLevel(n){return n<LV.length?LV[n]:(CACHE[n]=CACHE[n]||gen(n))}
// ---- 8 places (themes): the level number decides the place ----
const TH_LIST=[
{n:'GRASSLAND',e:'\u2600\uFE0F',s1:'#5cc8ff',s2:'#7bd6ff',s3:'#a6e4ff',far:'#9fd0e6',mid:'#7cc88f',mt:'#5fb87a',cl:'#fff',deco:'tree',d0:'#6b4220',d1:'#1f8f3a',d2:'#2fb04a',g1:'#3fbf4a',g2:'#2a9438',g3:'#7ee06a',so:'#8a5a2b',dt:'#6e4620',b1:'#e07a2f',b2:'#a84f1a',lq:'#2f8fe8',lq2:'#8fd0ff'},
{n:'NIGHT',e:'\uD83C\uDF19',s1:'#0a1038',s2:'#16235a',s3:'#2a3a7a',far:'#26346e',mid:'#1f4a5a',mt:'#1b3d4d',cl:'#3a4a8a',deco:'tree',d0:'#2a1a10',d1:'#0f4a3a',d2:'#17604a',g1:'#2a8f5a',g2:'#1d6b44',g3:'#5fd09a',so:'#4a3a5a',dt:'#382a48',b1:'#7a5aa8',b2:'#4a3470',lq:'#1a4aa0',lq2:'#6a9ae0',fx:'stars',tint:['#000a40',.22]},
{n:'RAINY',e:'\uD83C\uDF27\uFE0F',s1:'#4a5a6a',s2:'#6a7a8a',s3:'#8a9aa8',far:'#7a8a98',mid:'#5a7a6a',mt:'#4a6a5a',cl:'#9aa8b4',deco:'tree',d0:'#4a3320',d1:'#2a6a3a',d2:'#357a45',g1:'#3a9a4a',g2:'#2a7a38',g3:'#6ac07a',so:'#6a4a2a',dt:'#4a3018',b1:'#b0683a',b2:'#80481f',lq:'#3a6aa8',lq2:'#8ab0d8',fx:'rain',tint:['#102030',.2]},
{n:'UNDERGROUND',e:'\u26CF\uFE0F',s1:'#120c1c',s2:'#1c1428',s3:'#2a2038',far:'#2a2038',mid:'#352846',mt:'#2e2240',cl:null,deco:'rock',d0:'#4a3a5a',d1:'#5a4a6a',d2:'#6a5a7a',g1:'#6a5a4a',g2:'#4a3c30',g3:'#8a7a68',so:'#4a3a30',dt:'#352a22',b1:'#8a7a9a',b2:'#5a4a6a',lq:'#1a4a7a',lq2:'#5a9ad0',cave:1,tint:['#000',.12]},
{n:'UNDERWATER',e:'\uD83C\uDF0A',s1:'#1a7ac8',s2:'#2a9ad8',s3:'#5ac0e8',far:'#2a8ac0',mid:'#2a9a9a',mt:'#1a8a7a',cl:null,deco:'cactus',d0:'#1a8a5a',d1:'#2ab070',d2:'#4ad090',g1:'#e8d08a',g2:'#c8a860',g3:'#fff0b8',so:'#b89860',dt:'#98784a',b1:'#e86a8a',b2:'#a84060',lq:'#0a4a90',lq2:'#4a9ae0',fx:'bubbles',tint:['#0a5ab0',.2],jv:4.3,gv:.17,mf:3,jc:1.6},
{n:'VOLCANO',e:'\uD83C\uDF0B',s1:'#3a0a0a',s2:'#6a1a0a',s3:'#a03a10',far:'#5a1a1a',mid:'#4a1a14',mt:'#3a1410',cl:null,deco:'rock',d0:'#2a1a1a',d1:'#3a2424',d2:'#4a2e2e',g1:'#5a4a4a',g2:'#3a2c2c',g3:'#8a7070',so:'#3a2a2a',dt:'#241818',b1:'#a8402a',b2:'#6a2418',lq:'#e8501a',lq2:'#ffc23a',fx:'embers',tint:['#a02000',.14]},
{n:'SNOW',e:'\u2744\uFE0F',s1:'#8ab8e8',s2:'#b0d0f0',s3:'#dceaf8',far:'#c0d4e8',mid:'#e0ecf8',mt:'#c8dcec',cl:'#fff',deco:'tree',d0:'#5a4030',d1:'#2a7a5a',d2:'#fff',g1:'#f4f8ff',g2:'#c8d8ea',g3:'#fff',so:'#7a6a60',dt:'#5a4a44',b1:'#7ab0d8',b2:'#4a80a8',lq:'#4a8ad0',lq2:'#c0e0ff',fx:'snow'},
{n:'DESERT',e:'\uD83C\uDFDC\uFE0F',s1:'#f0a040',s2:'#f8c870',s3:'#fce8b0',far:'#e0a060',mid:'#d8b070',mt:'#c89858',cl:'#fff0d0',deco:'cactus',d0:'#2a8a3a',d1:'#3aa84a',d2:'#5ac86a',g1:'#e8c878',g2:'#c8a458',g3:'#fce8a0',so:'#c09050',dt:'#a07838',b1:'#d89a5a',b2:'#a86a30',lq:'#c8a040',lq2:'#e8d078'}
];
const THEMES=TH_LIST.map(t=>({jv:5.6,gv:.28,mf:6,jc:2,...t}));let TH=THEMES[0];
function deco(x){const d=TH.deco,y=9*T;
 if(d=='tree'){R(TH.d0,x+6,y-18,4,18);R(TH.d1,x-2,y-40,20,12);R(TH.d2,x+2,y-50,12,12);R(TH.d1,x-6,y-30,28,12)}
 else if(d=='cactus'){R(TH.d1,x+6,y-26,4,26);R(TH.d1,x,y-18,6,3);R(TH.d1,x,y-22,3,7);R(TH.d1,x+10,y-14,6,3);R(TH.d1,x+13,y-18,3,7);R(TH.d2,x+6,y-26,2,26)}
 else{R(TH.d1,x,y-8,16,8);R(TH.d2,x+3,y-16,10,8);R(TH.d1,x+6,y-24,4,8)}}
// ---- monster flowers: they pop out of green pipes ----
function plantH(q){const t=(tick+q.o)%220;let h=0;if(t>=90&&t<110)h=(t-90)/20*22;else if(t>=110&&t<190)h=22;else if(t>=190&&t<210)h=22-(t-190)/20*22;
 const near=Math.abs(p.x+p.w/2-(q.x+16))<30&&p.y+p.h<=7*T+3;return near&&(t<110||ENDLESS)?0:h}
function drawPlants(){for(const q of plants){if(q.dead)continue;const h=plantH(q);if(h<1)continue;const x=q.x+9,y=7*T-h,o=Math.floor(tick/8)%2,m=y+(o?7:8);
 R('#2faa3a',x+5,y+10,4,12);R('#2faa3a',x+1,y+14,5,3);R('#2faa3a',x+8,y+14,5,3);R('#d8372c',x,y,14,10);R('#ff6a5a',x+1,y+1,12,2);R('#fff',x+2,y+3,3,3);R('#fff',x+9,y+3,3,3);R('#a01c14',x,m,14,o?3:2);R('#2a1010',x+2,m,10,o?2:1);R('#fff',x+3,m,2,2);R('#fff',x+9,m,2,2)}}
// ---- ENDLESS MODE: stages never stop; green pipes are portals to another place ----
let ENDLESS=false,ESEED=0,stg=0,ETH=0,ELV=null,flash=0;
function genE(s){const n=Math.min(99,6+s*7),o=gen(n,ESEED+s*977);
 for(let px=14;px<o.w-16&&o.pp.length<2;px+=3){const bad=o.gaps.some(([a,b])=>px+3>=a&&px-2<=a+b)||[...o.sp,...o.en,...o.tu].some(x=>Math.abs(x-px-.5)<4)||o.bt.some(([x])=>Math.abs(x-px-.5)<3)||o.mb.some(([x])=>Math.abs(x-px-.5)<3)||o.pl.some(([a,y,w])=>px+2>=a&&px-1<=a+w)||o.pp.some(a=>Math.abs(a-px)<8)||Math.abs(px-o.cp)<4;if(!bad)o.pp.push(px)}
 for(let px=14;px<o.w-16&&!o.pp.length;px+=2){   // crowded stage: clear the spot, then place a pipe
  if(o.gaps.some(([a,b])=>px+3>=a&&px-2<=a+b)||o.sp.some(x=>Math.abs(x-px-.5)<3)||o.pl.some(([a,y,w])=>px+2>=a&&px-1<=a+w)||Math.abs(px-o.cp)<4)continue;
  o.en=o.en.filter(x=>Math.abs(x-px-.5)>=4);o.tu=o.tu.filter(x=>Math.abs(x-px-.5)>=4);o.bt=o.bt.filter(([x])=>Math.abs(x-px-.5)>=3);o.mb=o.mb.filter(([x])=>Math.abs(x-px-.5)>=3);o.pp.push(px)}
 return o}
function newStage(th){ETH=th;ELV=genE(stg);load(stg)}
function startEndless(){ENDLESS=true;ESEED=Math.floor(Math.random()*1e6);stg=0;score=0;lives=DL[DIFF];got=0;IN.hidden=true;LS.hidden=true;HM.hidden=true;GM.hidden=false;document.body.classList.add('ig','endless');
 newStage(Math.floor(Math.random()*THEMES.length));state='play';ov.hidden=true;pops.push({x:cpx+60,y:70,t:240,s:'STAND ON A PIPE + PRESS DOWN TO WARP'});hud()}
function nextStage(th){stg++;score+=50;beep(990,.2);newStage(th);hud()}
function warp(){let th;do{th=Math.floor(Math.random()*THEMES.length)}while(th==ETH);stg++;score+=100;beep(1200,.25,'triangle',.08);flash=36;newStage(th);pops.push({x:cpx+60,y:70,t:120,s:'WARP!'});hud()}
function again(){ENDLESS?startEndless():start()}
function drawPortals(){if(!ENDLESS)return;for(const px of L.pp){const x=px*T+16-cam,y=7*T,b=Math.sin(tick/8)*2;g.globalAlpha=.3+.2*Math.sin(tick/9);g.fillStyle='#b070ff';g.beginPath();g.ellipse(x,y-2,17,6,0,0,7);g.fill();g.globalAlpha=1;g.fillStyle='#fff';g.fillRect(Math.round(x-2),Math.round(y-42+b),4,6);g.beginPath();g.moveTo(x-5,y-36+b);g.lineTo(x+5,y-36+b);g.lineTo(x,y-30+b);g.fill()}}
function nightSky(){for(let i=0;i<40;i++){g.fillStyle=(tick+i*7)%60<8?'#fff':'#cfd8ff';const b=i%3==0?2:1;g.fillRect((i*83)%W,(i*37)%90,b,b)}g.fillStyle='#fff7c0';g.beginPath();g.arc(270,28,12,0,7);g.fill();g.fillStyle=TH.s1;g.beginPath();g.arc(275,25,10,0,7);g.fill()}
function cave(){g.fillStyle='#0c0814';g.fillRect(0,0,W,16);const o=-(cam*.5)%32;for(let i=-1;i<12;i++){const x=o+i*32,h=10+((i*7)&15);g.beginPath();g.moveTo(x,16);g.lineTo(x+16,16+h);g.lineTo(x+32,16);g.fill()}}
function fx(){const f=TH.fx;
 if(f=='rain'){g.strokeStyle='rgba(200,220,255,.55)';g.beginPath();for(let i=0;i<70;i++){const x=(i*47+tick*3)%(W+20),y=(i*29+tick*9)%H;g.moveTo(x,y);g.lineTo(x-3,y+8)}g.stroke()}
 else if(f=='snow'){g.fillStyle='#fff';for(let i=0;i<50;i++)g.fillRect((i*53+Math.sin((tick+i*9)/30)*8+tick*.3)%W,(i*31+tick*(.5+i%3*.3))%H,2,2)}
 else if(f=='bubbles'){g.strokeStyle='rgba(255,255,255,.7)';for(let i=0;i<16;i++){g.beginPath();g.arc((i*61+Math.sin((tick+i*20)/25)*5)%W,H-((tick*(.4+i%3*.25)+i*40)%H),2+i%2,0,7);g.stroke()}}
 else if(f=='embers'){for(let i=0;i<22;i++){g.fillStyle=i%2?'#ffb43a':'#ff6a20';g.fillRect((i*71+Math.sin((tick+i*15)/20)*6)%W,H-((tick*(.5+i%3*.3)+i*37)%H),2,2)}}
 if(TH.tint){g.globalAlpha=TH.tint[1];g.fillStyle=TH.tint[0];g.fillRect(0,0,W,H);g.globalAlpha=1}}
let L,grid,stars,en,p,cam,cpx,lvl,score,lives,got,state='title',inv=0,tick=0,AC,pw=null,pwt=0,rbt=0,want=null,pops=[],plants=[];
const k={l:0,r:0,j:0,d:0};let mute=false,music=true,best=0;
function saveBest(){try{best=Math.max(+localStorage.getItem(pk(ENDLESS?'pqe':'pq'))||0,score);localStorage.setItem(pk(ENDLESS?'pqe':'pq'),best)}catch(e){best=Math.max(best,score)}return best}
function beep(f,d=.08,t='square',vol=.05){if(mute)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),v=AC.createGain();o.type=t;o.frequency.value=f;v.gain.value=vol;o.connect(v);v.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function hud(){sc.textContent=score;st.textContent=got;lv.textContent=lvl+1;{const a=document.getElementById('lvl'),b=document.getElementById('lvmax');if(a)a.textContent=ENDLESS?'STAGE':'LEVEL';if(b)b.textContent=ENDLESS?'':'/100'}li.textContent=Math.max(lives,0)}
function load(n){lvl=n;START=n;L=ENDLESS?ELV:getLevel(n);TH=ENDLESS?THEMES[ETH]:THEMES[n%THEMES.length];grid=Array.from({length:11},()=>new Array(L.w).fill(0));
 for(let x=0;x<L.w;x++)if(!L.gaps.some(([a,b])=>x>=a&&x<a+b)){grid[9][x]=1;grid[10][x]=1}
 stars=[];L.pl.forEach(([x,y,w])=>{for(let i=0;i<w;i++){grid[y][x+i]=2;stars.push({x:(x+i)*T+4,y:(y-1)*T+4,t:0})}});
 L.mb.forEach(([x,y])=>grid[y][x]=3);
 L.pp.forEach(x=>{for(let dy=7;dy<9;dy++){grid[dy][x]=5;grid[dy][x+1]=5}});
 for(let x=7;x<L.w-6;x+=7)if(grid[9][x]&&!grid[8][x]&&!L.sp.includes(x)&&!L.en.includes(x))stars.push({x:x*T+4,y:8*T+4,t:0});
 en=L.en.map(x=>({x:x*T+2,y:9*T-12,d:-1,a:1})).concat(L.bt.map(([x,y])=>({x:x*T,y:y*T,x0:x*T,y0:y*T,d:1,a:1,fly:1}))).concat(L.tu.map(x=>({x:x*T+2,y:9*T-12,d:-1,a:1,tu:1})));
 plants=L.pp.map((x,i)=>({x:x*T,o:(i*57)%220,dead:0}));if(DIFF==0)plants=plants.filter((q,i)=>i%2==0);
 SP=DIFF==0?L.sp.filter((x,i)=>i%2==0):L.sp;
 if(DIFF==0)en=en.filter((e,i)=>i%2==0);
 if(DIFF==2)L.sp.forEach(x=>{const ex=x-4;if(grid[9][ex-1]&&grid[9][ex]&&grid[9][ex+1]&&!L.sp.includes(ex))en.push({x:ex*T+2,y:9*T-12,d:-1,a:1})});
 cpx=2*T;spawn();cam=0;hud();pops=[{x:cpx+50,y:46,t:150,s:(ENDLESS?'STAGE ':'LEVEL ')+(n+1)+' - '+TH.n+(ENDLESS?'':' - '+DN[DIFF])}]}
function spawn(){p={x:cpx,y:9*T-14,w:10,h:14,vx:0,vy:0,on:0,f:1};inv=60;pw=null;pwt=0;rbt=0;want=null}
function setSize(w,h){const ow=p.w,oh=p.h,cx=p.x+p.w/2,fy=p.y+p.h;p.w=w;p.h=h;p.x=cx-w/2;p.y=fy-h;if(hit(p)){p.w=ow;p.h=oh;p.x=cx-ow/2;p.y=fy-oh;return false}return true}
function endPower(){if(pw=='big'||pw=='small'){want=null;if(!setSize(10,14))want=[10,14]}pw=null;pwt=0}
function reward(tx,ty){const o=['LIFE','STAR','POINTS','BIG','SMALL','RAINBOW'][Math.floor(Math.random()*6)];let s;
 if(o=='LIFE'){lives=Math.min(lives+1,9);s='+1 LIFE'}
 else if(o=='STAR'){got++;score+=10;s='+1 STAR'}
 else if(o=='POINTS'){score+=100;s='+100 POINTS'}
 else if(o=='BIG'){if(pw=='small'){endPower();s='BACK TO NORMAL!'}else if(pw=='big'){pwt=900;s='BIG! 15s'}else{pw='big';pwt=900;want=null;if(!setSize(14,20))want=[14,20];s='BIG!'}}
 else if(o=='SMALL'){if(pw=='big'){endPower();s='BACK TO NORMAL!'}else if(pw=='small'){pwt=900;s='SMALL! 15s'}else{pw='small';pwt=900;want=null;setSize(7,10);s='SMALL!'}}
 else{rbt=480;s='RAINBOW!'}
 pops.push({x:tx*T+8,y:ty*T-2,t:70,s});beep(o=='LIFE'?1100:990,.12);hud()}
function solid(px,py){const tx=Math.floor(px/T),ty=Math.floor(py/T);if(tx<0||tx>=L.w)return true;if(ty<0||ty>10)return false;return grid[ty][tx]>0}
function hit(o){for(const cx of[o.x,o.x+o.w-.01])for(const cy of[o.y,o.y+o.h/2,o.y+o.h-.01])if(solid(cx,cy))return true;return false}
function over(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function die(){if(inv>0&&p.y<H)return;lives--;beep(120,.3,'sawtooth');hud();if(lives<=0){state='over';panel('GAME OVER',(ENDLESS?'Stage '+(stg+1)+'  ':'')+'Score: '+score+'  Best: '+saveBest(),'TRY AGAIN',again)}else spawn()}
function update(){
 const d=k.r-k.l;p.vx=d*1.7;if(d)p.f=d;
 if(k.j&&p.on){p.vy=-TH.jv;p.on=0;beep(520,.1)}
 if(!k.j&&p.vy<-TH.jc)p.vy=-TH.jc;
 p.vy=Math.min(p.vy+TH.gv,TH.mf);
 p.x+=p.vx;if(hit(p)){const s=Math.sign(p.vx);while(hit(p))p.x-=s*.25}
 p.on=0;p.y+=p.vy;if(hit(p)){const s=Math.sign(p.vy);while(hit(p))p.y-=s*.25;if(p.vy>0)p.on=1;if(p.vy<0){const tx=Math.floor((p.x+p.w/2)/T),ty=Math.floor((p.y-1)/T);if(grid[ty]&&grid[ty][tx]==3){grid[ty][tx]=4;reward(tx,ty)}}p.vy=0}
 if(inv>0)inv--;
 if(pwt>0&&--pwt==0)endPower();
 if(rbt>0)rbt--;
 if(want&&setSize(want[0],want[1]))want=null;
 pops.forEach(q=>{q.y-=.4;q.t--});pops=pops.filter(q=>q.t>0);
 if(p.y>9*T+2){inv=0;beep(200,.2,'sine',.08);die();return}
 for(const s of stars)if(!s.t&&over(p,{x:s.x,y:s.y,w:8,h:8})){s.t=1;score+=10;got++;beep(880,.06);hud()}
 for(const e of en){if(!e.a)continue;if(e.fly){e.x=e.x0+Math.sin(tick/45)*36;e.y=e.y0+Math.sin(tick/18)*8}else{e.x+=e.d*(e.tu?.35:.5)*(1+lvl*.006)*DM[DIFF];const fx=e.d>0?e.x+12:e.x-1;
  if(solid(fx,e.y+6)||!solid(fx,e.y+14))e.d*=-1}
  const eb={x:e.x,y:e.y,w:12,h:12};
  if(over(p,eb)&&(inv<=0||rbt>0)){if(rbt>0){e.a=0;score+=50;beep(300,.1);hud()}else if(p.vy>0&&p.y+p.h-p.vy<=e.y+6){e.a=0;p.vy=-4;score+=50;beep(300,.1);hud()}else die()}}
 if(ENDLESS&&k.d&&p.on&&Math.abs(p.y+p.h-7*T)<2){const cx=p.x+p.w/2;if(L.pp.some(x=>cx>x*T&&cx<x*T+32)){warp();return}}
 if(flash>0)flash--;
 for(const q of plants){if(q.dead)continue;const h=plantH(q);if(h>5&&over(p,{x:q.x+9,y:7*T-h,w:14,h:Math.min(h,12)})&&(inv<=0||rbt>0)){if(rbt>0){q.dead=1;score+=50;beep(300,.1);hud()}else{die();return}}}
 if(inv<=0&&rbt<=0)for(const x of SP)if(over(p,{x:x*T+2,y:8*T+8,w:12,h:8}))die();
 if(p.x>L.cp*T&&cpx<L.cp*T){cpx=L.cp*T;score+=25;beep(660,.15);hud()}
 if(p.x>(L.w-3)*T){if(ENDLESS){nextStage((ETH+1)%THEMES.length);return}state='clear';unlockNext();beep(990,.3);if(lvl<MAXL-1)panel('LEVEL '+(lvl+1)+' CLEAR!','Score: '+score+'<br>&#128275; LEVEL '+(lvl+2)+' UNLOCKED!','NEXT LEVEL',()=>{load(lvl+1);state='play';ov.hidden=true});else panel('YOU WIN!','Stars: '+got+'  Score: '+score+'  Best: '+saveBest(),'LEVELS',showLevels)}
 cam=Math.max(0,Math.min(p.x-W/2,L.w*T-W))}
function panel(h,s,b,fn){ov.hidden=false;ov.innerHTML='<h2>'+h+'</h2><p>'+s+'</p><button id="go">'+b+'</button>';const x=document.getElementById('go');x.onclick=fn;x.focus()}
function start(){score=0;lives=DL[DIFF];got=0;load(START);state='play';ov.hidden=true}
function R(c,x,y,w,h){g.fillStyle=c;g.fillRect(Math.round(x-cam),Math.round(y),w,h)}
function shadow(x,y,w){let gy=y;while(gy<H&&!solid(x,gy))gy+=2;g.globalAlpha=.3;g.fillStyle='#000';g.beginPath();g.ellipse(x-cam,gy,w*Math.max(.4,1-(gy-y)/60),2.5,0,0,7);g.fill();g.globalAlpha=1}
// ---- the player: crisp pixel art in 3 sizes, with shading, outline and colour glow ----
function drawMan(){
 const sz=p.h>16?2:p.h<12?0:1,cx=Math.round(p.x+p.w/2-cam),fy=Math.round(p.y+p.h),f=p.f>0?1:-1,wk=p.on&&p.vx?Math.floor(tick/6)%2:0;
 const B=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(cx+x,fy+y,w,h)};
 if(rbt>0){const RB=['#f33','#f93','#ff3','#3d3','#39f','#93f'];for(let i=0;i<6;i++){g.fillStyle=RB[(i+(tick>>2))%6];g.fillRect(f>0?cx-Math.round(p.w/2)-14:cx+Math.round(p.w/2),fy-p.h+Math.round(i*p.h/6),14,Math.ceil(p.h/6)+1)}}
 if(!(inv%8<4||state!='play'||rbt>0))return;
 if(sz==2){
  B('#e8453c',-8,-20,16,5);B('#ff8b80',-6,-20,8,1);B('#b02a22',-8,-16,16,1);B('#e8453c',f>0?0:-8,-17,8,2);
  B('#ffcf9e',-6,-15,12,6);B('#e8a878',f>0?-6:4,-15,2,6);B('#000',f>0?2:-4,-13,2,3);B('#6a3a1a',f>0?1:-7,-10,6,2);
  B('#2f6bff',-6,-9,12,6);B('#1d46b8',f>0?3:-6,-9,3,6);B('#6f9bff',-4,-9,4,1);B('#ffd23f',-1,-8,3,3);
  B('#ffcf9e',-8,-8,2,4);B('#ffcf9e',6,-8,2,4);
  B('#5a3a1a',wk?-7:-6,-3,5,3);B('#5a3a1a',wk?3:1,-3,5,3);B('#3a2410',wk?-7:-6,-1,5,1);B('#3a2410',wk?3:1,-1,5,1)}
 else if(sz==0){
  B('#e8453c',-4,-10,8,3);B('#ff8b80',-3,-10,3,1);B('#ffcf9e',-3,-7,6,3);B('#000',f>0?1:-2,-6,1,1);
  B('#2f6bff',-3,-4,6,2);B('#1d46b8',f>0?1:-3,-4,2,2);B('#ffd23f',-1,-4,1,1);
  B('#5a3a1a',wk?-4:-3,-2,3,2);B('#5a3a1a',wk?1:0,-2,3,2)}
 else{
  B('#e8453c',-6,-14,12,4);B('#ff8b80',-5,-14,6,1);B('#b02a22',-6,-11,12,1);B('#e8453c',f>0?-2:-8,-12,8,2);
  B('#ffcf9e',-5,-10,10,4);B('#e8a878',f>0?-5:3,-10,2,4);B('#000',f>0?1:-3,-9,2,2);
  B('#2f6bff',-5,-6,10,4);B('#1d46b8',f>0?2:-5,-6,3,4);B('#6f9bff',-4,-6,3,1);B('#ffd23f',-1,-5,2,2);
  B('#5a3a1a',wk?-6:-5,-2,4,2);B('#5a3a1a',wk?2:1,-2,4,2);B('#3a2410',wk?-6:-5,-1,4,1);B('#3a2410',wk?2:1,-1,4,1)}}
let lastPops='',lastPwr='';
function domFx(){const P=document.getElementById('pops'),Q=document.getElementById('pwr');if(!P||!Q)return;
 const a=pops.map(q=>'<span class="pop" style="left:'+((q.x-cam)/W*100).toFixed(2)+'%;top:'+(q.y/H*100).toFixed(2)+'%">'+q.s+'</span>').join('');if(a!==lastPops){P.innerHTML=a;lastPops=a}
 const b=(pw?'<span class="chip '+pw+'">'+(pw=='big'?'BIG ':'SMALL ')+Math.ceil(pwt/60)+'s</span>':'')+(rbt>0?'<span class="chip rb">RAINBOW '+Math.ceil(rbt/60)+'s</span>':'');if(b!==lastPwr){Q.innerHTML=b;lastPwr=b}}
function draw(){
 if(!L)return;
 g.fillStyle=TH.s1;g.fillRect(0,0,W,H);g.fillStyle=TH.s2;g.fillRect(0,60,W,60);g.fillStyle=TH.s3;g.fillRect(0,110,W,40);if(TH.fx=='stars')nightSky();
 g.fillStyle=TH.far;let o=-(cam*.15)%150;for(let i=-1;i<4;i++){const mx=o+i*150,hh=60+((i&1)?16:0);g.beginPath();g.moveTo(mx,144);g.lineTo(mx+75,144-hh);g.lineTo(mx+150,144);g.fill();g.fillStyle='#fff';g.fillRect(mx+71,144-hh,8,5);g.fillStyle=TH.far}
 g.fillStyle=TH.mid;o=-(cam*.3)%110;for(let i=-1;i<4;i++){g.beginPath();g.ellipse(o+i*110,152,70,26+((i&1)?8:0),0,0,7);g.fill()}
 g.globalAlpha=.25;g.fillStyle='#fff';g.fillRect(0,112,W,32);g.globalAlpha=1;
 o=-(cam*.6)%70;g.fillStyle=TH.mt;for(let i=-1;i<6;i++){const tx=o+i*70+20;g.beginPath();g.moveTo(tx,140);g.lineTo(tx+8,106);g.lineTo(tx+16,140);g.fill()}
 if(TH.cl)for(let i=0;i<10;i++){const cx=((i*97)%400)-(cam*.3)%400+(i>5?400:0),cy=14+(i*23)%48;const x=((cx%520)+520)%520-60;g.fillStyle=TH.cl;g.fillRect(x,cy,34,8);g.fillRect(x+6,cy-6,20,6);g.fillRect(x+-4,cy+4,8,6)}
 for(let i=0;i<L.w/9;i++){const tx=i*9+3;if(!grid[9][tx])continue;deco(tx*T)}
 const a=Math.floor(cam/T);
 if(TH.cave)cave();
 L.gaps.forEach(([gx,gw])=>{R(TH.lq,gx*T,9*T+3,gw*T,H);R(TH.lq2,gx*T+((tick>>3)%8),9*T+3,Math.max(gw*T-8,4),2);R(TH.lq2,gx*T+8-((tick>>4)%8),9*T+9,Math.max(gw*T-10,4),1)});
 drawPlants();drawPortals();
 for(let y=0;y<11;y++)for(let x=a;x<=a+21&&x<L.w;x++){const t=grid[y][x];if(!t)continue;
  if(t==1){R(TH.so,x*T,y*T,T,T);R(TH.dt,x*T+3,y*T+9,3,3);R(TH.dt,x*T+10,y*T+4,3,3);if(y==9){R(TH.g1,x*T,y*T,T,5);R(TH.g2,x*T,y*T+5,T,2);R(TH.g3,x*T,y*T,T,1)}else R('#a06a32',x*T,y*T,T,1);R('#5e3b1a',x*T,y*T+T-1,T,1)}
  else if(t==5){const l=grid[y][x-1]!=5,r=grid[y][x+1]!=5,e=(l?2:0)+(r?2:0),sx=x*T-(l?2:0);R('#2faa3a',x*T,y*T,T,T);if(l)R('#8cf09a',x*T+3,y*T,3,T);if(r)R('#1b7a2a',x*T+T-4,y*T,4,T);if(y==7){R('#3fcc4a',sx,y*T,T+e,7);R('#1b7a2a',sx,y*T+7,T+e,2);R('#8cf09a',sx,y*T,T+e,2)}}else if(t>2){const u=t==4;R(u?'#8a6a4a':'#ffb000',x*T,y*T,T,T);R(u?'#6a4a2a':'#a86000',x*T,y*T+T-2,T,2);R(u?'#6a4a2a':'#a86000',x*T+T-2,y*T,2,T);R(u?'#a88a6a':'#ffe27a',x*T,y*T,T,1);if(!u){R('#fff3a0',x*T+4,y*T+3,8,2);R('#fff3a0',x*T+10,y*T+5,2,3);R('#fff3a0',x*T+7,y*T+8,3,2);R('#fff3a0',x*T+7,y*T+11,2,2)}}else{R(TH.b1,x*T,y*T,T,T);R(TH.b2,x*T,y*T+7,T,2);R(TH.b2,x*T+7,y*T,2,7);R(TH.b2,x*T+3,y*T+9,2,7);R('#ffb066',x*T,y*T,T,2);R('#ffd9a8',x*T,y*T,1,T);R('#7a3a10',x*T,y*T+T-2,T,2);R('#7a3a10',x*T+T-1,y*T,1,T);g.globalAlpha=.22;R('#000',x*T,y*T+T,T,5);g.globalAlpha=1}}
 for(const x of SP){g.fillStyle='#d8dde8';for(let s=0;s<2;s++){g.beginPath();g.moveTo(x*T+s*8-cam,9*T);g.lineTo(x*T+s*8+4-cam,8*T+8);g.lineTo(x*T+s*8+8-cam,9*T);g.fill()}}
 const cf=cpx>=L.cp*T;R('#ddd',L.cp*T,7*T,2,32);R(cf?'#3fbf4a':'#ffd23f',L.cp*T+2,7*T,10,7);
 R('#fff',(L.w-3)*T,5*T,3,64);R('#e8453c',(L.w-3)*T+3,5*T,18,10);R('#ffd23f',(L.w-3)*T-3,5*T-4,9,4);{const cx=(L.w-2)*T-2;R('#8f98ae',cx,9*T-36,30,36);for(let i=0;i<4;i++)R('#8f98ae',cx+i*8,9*T-42,6,6);R('#6f7890',cx,9*T-36,30,2);R('#4a3a5a',cx+11,9*T-14,8,14);R('#4a3a5a',cx+4,9*T-26,4,6);R('#4a3a5a',cx+22,9*T-26,4,6)}
 for(const s of stars){if(s.t)continue;const b=Math.sin((tick+s.x)/12)*2;g.globalAlpha=.25;R('#fff3a0',s.x-2,s.y+b-2,12,12);g.globalAlpha=1;R('#ffd23f',s.x+2,s.y+b,4,8);R('#e0a010',s.x+5,s.y+5+b,3,3);R('#ffd23f',s.x,s.y+2+b,8,4);R('#fff3a0',s.x+2,s.y+2+b,3,3)}
 for(const e of en){if(!e.a)continue;shadow(e.x+6,e.y+(e.fly?8:12),e.fly?5:6);if(e.fly){const f=Math.floor(tick/8)%2;R('#6a3fb5',e.x+3,e.y+2,6,5);R('#6a3fb5',e.x,e.y+(f?0:3),4,3);R('#6a3fb5',e.x+8,e.y+(f?0:3),4,3);R('#fff',e.x+4,e.y+3,1,1);R('#fff',e.x+7,e.y+3,1,1);continue}if(e.tu){const w=Math.floor(tick/12)%2,r=e.d>0;R('#2f8f3a',e.x+(r?0:2),e.y+1,10,8);R('#6fd06a',e.x+(r?1:3),e.y+2,8,2);R('#c9a050',e.x+(r?10:-2),e.y+4,4,5);R('#5a3a1a',e.x+(w?1:3),e.y+9,3,3);R('#5a3a1a',e.x+(w?7:5),e.y+9,3,3);R('#000',e.x+(r?12:-1),e.y+5,1,1);continue}const w=Math.floor(tick/10)%2;R('#a8561f',e.x,e.y+2,12,8);R('#d98040',e.x+1,e.y+2,10,2);R('#6e3510',e.x,e.y+8,12,2);R('#a8561f',e.x+2,e.y,8,2);R('#fff',e.x+2,e.y+3,3,3);R('#fff',e.x+7,e.y+3,3,3);R('#000',e.x+3+(e.d>0),e.y+4,1,2);R('#000',e.x+8+(e.d>0),e.y+4,1,2);R('#4a2810',e.x+(w?0:2),e.y+10,4,2);R('#4a2810',e.x+(w?8:6),e.y+10,4,2)}
 drawMan();
 fx();
 if(flash>0){g.globalAlpha=flash/36;g.fillStyle='#fff';g.fillRect(0,0,W,H);g.globalAlpha=1}
 domFx();
 const vg=g.createRadialGradient(160,88,70,160,88,200);vg.addColorStop(0,'rgba(0,0,40,0)');vg.addColorStop(1,'rgba(0,0,40,.28)');g.fillStyle=vg;g.fillRect(0,0,W,H);
}
let last=0,acc=0;
function loop(t){acc+=Math.min(t-last,100);last=t;while(acc>=16.67){if(state=='play')update();acc-=16.67;tick++}draw();requestAnimationFrame(loop)}
function keyset(e,v){const c=e.code;if(c=='ArrowLeft'||c=='KeyA')k.l=v;else if(c=='ArrowRight'||c=='KeyD')k.r=v;else if(c=='ArrowDown'||c=='KeyS')k.d=v;else if(c=='Space'||c=='ArrowUp'||c=='KeyW'){k.j=v;if(state=='play')e.preventDefault()}}
addEventListener('keydown',e=>{if(e.code=='Escape'||e.code=='KeyP')state=='paused'?resume():pause();keyset(e,1)});addEventListener('keyup',e=>keyset(e,0));
[['bl','l'],['br','r'],['bj','j'],['bdn','d']].forEach(([id,key])=>{const b=document.getElementById(id);b.onpointerdown=e=>{e.preventDefault();k[key]=1};['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>k[key]=0))});
const HM=document.getElementById('home'),GM=document.getElementById('game'),LS=document.getElementById('lvsel'),IN=document.getElementById('intro');
function menu(){state='title';HM.hidden=false;GM.hidden=true;LS.hidden=true;ov.hidden=true;IN.hidden=true;document.body.classList.remove('endless')}
// ---- level select: finish a level to unlock the next one ----
// ---- NEW GAME screen: who the enemies are and what the mystery block gives ----
let howMenu=false,introBuilt=false;
function art(kind,cv){const c=cv.getContext('2d');c.clearRect(0,0,16,16);const Q=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
 const man=sc=>{c.save();c.translate(8,15);c.scale(sc,sc);Q('#e8453c',-6,-14,12,4);Q('#ffcf9e',-5,-10,10,4);Q('#000',1,-9,2,2);Q('#2f6bff',-5,-6,10,4);Q('#5a3a1a',-5,-2,4,2);Q('#5a3a1a',1,-2,4,2);c.restore()};
 if(kind=='walker'){Q('#a8561f',2,5,12,8);Q('#d98040',3,5,10,2);Q('#6e3510',2,11,12,2);Q('#a8561f',4,3,8,2);Q('#fff',4,6,3,3);Q('#fff',9,6,3,3);Q('#000',5,7,1,2);Q('#000',10,7,1,2);Q('#4a2810',2,13,4,2);Q('#4a2810',10,13,4,2)}
 else if(kind=='turtle'){Q('#2f8f3a',2,4,10,8);Q('#6fd06a',3,5,8,2);Q('#c9a050',11,7,4,5);Q('#5a3a1a',3,12,3,3);Q('#5a3a1a',8,12,3,3);Q('#000',14,8,1,1)}
 else if(kind=='bat'){Q('#6a3fb5',5,6,6,5);Q('#6a3fb5',1,4,4,3);Q('#6a3fb5',11,4,4,3);Q('#6a3fb5',2,7,3,2);Q('#6a3fb5',11,7,3,2);Q('#fff',6,7,1,1);Q('#fff',9,7,1,1)}
 else if(kind=='flower'){Q('#1fa03a',1,10,14,6);Q('#3fcc4a',0,10,16,3);Q('#2f8f3a',7,7,2,4);Q('#e8302a',3,1,10,3);Q('#e8302a',3,6,10,3);Q('#fff',4,1,2,2);Q('#fff',9,1,2,2);Q('#fff',4,4,2,2);Q('#fff',7,4,2,2);Q('#fff',10,4,2,2)}
 else if(kind=='spikes'){c.fillStyle='#d8dde8';for(let i=0;i<2;i++){c.beginPath();c.moveTo(i*8,14);c.lineTo(i*8+4,5);c.lineTo(i*8+8,14);c.fill()}Q('#8a93a8',0,14,16,2)}
 else if(kind=='water'){Q('#2f8fe8',0,6,8,10);Q('#8fd0ff',0,6,8,2);Q('#e8501a',8,6,8,10);Q('#ffc23a',8,6,8,2)}
 else if(kind=='pipe'){Q('#1fa03a',2,5,12,11);Q('#3fcc4a',1,5,14,4);Q('#7ae890',4,9,2,7);Q('#fff',7,0,2,3);Q('#fff',5,3,6,1);Q('#fff',6,4,4,1)}
 else if(kind=='block'){Q('#ffb000',1,1,14,14);Q('#a86000',1,13,14,2);Q('#a86000',13,1,2,14);Q('#ffe27a',1,1,14,1);Q('#fff3a0',5,3,6,2);Q('#fff3a0',9,5,2,3);Q('#fff3a0',7,8,3,2);Q('#fff3a0',7,11,2,2)}
 else if(kind=='life'){Q('#e8302a',2,3,4,4);Q('#e8302a',10,3,4,4);Q('#e8302a',1,5,14,4);Q('#e8302a',2,9,12,2);Q('#e8302a',4,11,8,2);Q('#e8302a',6,13,4,1);Q('#ff9a90',3,4,2,2)}
 else if(kind=='star'){Q('#ffd23f',7,1,2,14);Q('#ffd23f',1,7,14,2);Q('#ffd23f',4,4,8,8);Q('#fff3a0',6,6,3,3)}
 else if(kind=='points'){c.fillStyle='#ffd23f';c.font='bold 8px monospace';c.textAlign='center';c.fillText('100',8,11)}
 else if(kind=='big')man(1.1);
 else if(kind=='small')man(.6);
 else if(kind=='rainbow'){['#f33','#f93','#ff3','#3d3','#39f','#93f'].forEach((col,i)=>Q(col,0,2+i*2,16,2))}}
const ENEMY_INFO=[['walker','WALKER','Walks back and forth. Jump on its head!'],['turtle','TURTLE','Slow walker. Jump on it too.'],['bat','BAT','Flies up and down. Jump on it or run under.'],['flower','MONSTER FLOWER','Pops out of green pipes. Cannot be jumped on. Wait till it hides!'],['spikes','SPIKES','Never touch them. Jump over!'],['water','WATER / LAVA','Falling in costs a life.'],['pipe','GREEN PIPE','Stand on it. In ENDLESS mode press DOWN to warp.']];
const REWARD_INFO=[['life','+1 LIFE','An extra life (up to 9).'],['star','+1 STAR','Counts as a star, +10 points.'],['points','+100 POINTS','A big score bonus.'],['big','BIG','Grow for 15 seconds. If you are SMALL, it puts you back to normal.'],['small','SMALL','Shrink for 15 seconds. If you are BIG, it puts you back to normal.'],['rainbow','RAINBOW','8 seconds: beat enemies, spikes cannot hurt you.']];
function buildIntro(){if(introBuilt)return;introBuilt=true;
 const fill=(id,list)=>{const el=document.getElementById(id);el.innerHTML=list.map(a=>'<div class="it"><canvas width="16" height="16"></canvas><div><b>'+a[1]+'</b>'+a[2]+'</div></div>').join('');el.querySelectorAll('canvas').forEach((cv,i)=>art(list[i][0],cv))};
 fill('ienemies',ENEMY_INFO);fill('irewards',REWARD_INFO);art('block',document.getElementById('imb'))}
function showIntro(){state='title';HM.hidden=true;GM.hidden=true;LS.hidden=true;ov.hidden=true;IN.hidden=false;document.body.classList.remove('endless');buildIntro();setDiff(DIFF)}
function thumb(n,cv){const c=cv.getContext('2d'),Lv=getLevel(n),t=THEMES[n%THEMES.length],ox=6*T,gap=x=>Lv.gaps.some(([a,b])=>x>=a&&x<a+b);
 const Q=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x-ox),y,w,h)};
 c.scale(.5,.5);c.fillStyle=t.s1;c.fillRect(0,0,320,176);c.fillStyle=t.s2;c.fillRect(0,60,320,60);c.fillStyle=t.s3;c.fillRect(0,110,320,40);
 if(t.fx=='stars'){c.fillStyle='#fff';for(let i=0;i<22;i++)c.fillRect((i*83)%320,(i*37)%90,2,2);c.fillStyle='#fff7c0';c.beginPath();c.arc(270,28,12,0,7);c.fill();c.fillStyle=t.s1;c.beginPath();c.arc(275,25,10,0,7);c.fill()}
 c.fillStyle=t.far;for(let i=0;i<3;i++){c.beginPath();c.moveTo(i*150-30,144);c.lineTo(i*150+45,144-(60+(i&1)*16));c.lineTo(i*150+120,144);c.fill()}
 c.fillStyle=t.mid;for(let i=0;i<3;i++){c.beginPath();c.ellipse(i*110+30,152,70,28,0,0,7);c.fill()}
 if(t.cl){c.fillStyle=t.cl;c.fillRect(30,24,34,8);c.fillRect(36,18,20,6);c.fillRect(210,40,34,8);c.fillRect(216,34,20,6)}
 for(let i=0;i<6;i++){const x=(i*9+3)*T;if(gap(i*9+3))continue;const y=9*T;
  if(t.deco=='tree'){Q(t.d0,x+6,y-18,4,18);Q(t.d1,x-2,y-40,20,12);Q(t.d2,x+2,y-50,12,12);Q(t.d1,x-6,y-30,28,12)}
  else if(t.deco=='cactus'){Q(t.d1,x+6,y-26,4,26);Q(t.d1,x,y-18,6,3);Q(t.d1,x,y-22,3,7);Q(t.d1,x+10,y-14,6,3);Q(t.d1,x+13,y-18,3,7)}
  else{Q(t.d1,x,y-8,16,8);Q(t.d2,x+3,y-16,10,8);Q(t.d1,x+6,y-24,4,8)}}
 if(t.cave){c.fillStyle='#0c0814';c.fillRect(0,0,320,16);for(let i=0;i<11;i++){c.beginPath();c.moveTo(i*32,16);c.lineTo(i*32+16,26+((i*7)&15));c.lineTo(i*32+32,16);c.fill()}}
 for(let tx=6;tx<28;tx++){if(gap(tx)){Q(t.lq,tx*T,147,T,30);Q(t.lq2,tx*T,147,T,2)}else{Q(t.so,tx*T,144,T,32);Q(t.dt,tx*T+4,156,3,3);Q(t.g1,tx*T,144,T,5);Q(t.g3,tx*T,144,T,1)}}
 Lv.pl.forEach(([x,y,w])=>{for(let i=0;i<w;i++){Q(t.b1,(x+i)*T,y*T,T,T);Q(t.b2,(x+i)*T,y*T+7,T,2);Q('#ffd23f',(x+i)*T+4,(y-1)*T+4,8,8)}});
 Lv.mb.forEach(([x,y])=>{Q('#ffb000',x*T,y*T,T,T);Q('#fff3a0',x*T+5,y*T+3,6,10)});
 (Lv.pp||[]).forEach(x=>{Q('#d8372c',x*T+9,98,14,12);Q('#fff',x*T+11,100,3,3);Q('#2faa3a',x*T,112,32,32);Q('#3fcc4a',x*T-2,112,36,6)});
 Lv.sp.forEach(x=>{c.fillStyle='#d8dde8';for(let k=0;k<2;k++){c.beginPath();c.moveTo(x*T+k*8-ox,144);c.lineTo(x*T+k*8+4-ox,136);c.lineTo(x*T+k*8+8-ox,144);c.fill()}});
 Lv.en.forEach(x=>{Q('#a8561f',x*T+2,132,12,12);Q('#fff',x*T+4,136,3,3);Q('#fff',x*T+9,136,3,3)});
 Lv.tu.forEach(x=>{Q('#2f8f3a',x*T+2,134,12,10);Q('#c9a050',x*T+12,137,4,5)});
 Lv.bt.forEach(([x,y])=>{Q('#6a3fb5',x*T,y*T,12,6);Q('#6a3fb5',x*T-3,y*T+2,4,3);Q('#6a3fb5',x*T+11,y*T+2,4,3)});
 Q('#e8453c',ox+22,128,10,4);Q('#ffcf9e',ox+22,132,10,4);Q('#2f6bff',ox+22,136,10,8);
 c.fillStyle='rgba(200,220,255,.6)';c.strokeStyle='rgba(200,220,255,.6)';
 if(t.fx=='rain'){c.beginPath();for(let i=0;i<25;i++){const x=(i*47)%320,y=(i*29)%176;c.moveTo(x,y);c.lineTo(x-3,y+8)}c.stroke()}
 else if(t.fx=='snow'){c.fillStyle='#fff';for(let i=0;i<30;i++)c.fillRect((i*53)%320,(i*31)%176,2,2)}
 else if(t.fx=='bubbles'){for(let i=0;i<10;i++){c.beginPath();c.arc((i*61)%320,(i*43)%170,3,0,7);c.stroke()}}
 else if(t.fx=='embers'){for(let i=0;i<16;i++){c.fillStyle=i%2?'#ffb43a':'#ff6a20';c.fillRect((i*71)%320,(i*37)%170,2,2)}}
 if(t.tint){c.globalAlpha=t.tint[1];c.fillStyle=t.tint[0];c.fillRect(0,0,320,176);c.globalAlpha=1}}
function buildLevels(){const gr=document.getElementById('lvgrid');gr.innerHTML='';
 for(let i=1;i<=MAXL;i++){const t=THEMES[(i-1)%THEMES.length],b=document.createElement('button'),cls=i<unlocked?'done':i==unlocked?'cur':'lock';
  b.className='card '+cls;b.disabled=i>unlocked;b.title=i>unlocked?'Finish level '+(i-1)+' to unlock':t.n;
  b.innerHTML=i>unlocked?'<span class="lk"></span>':'<span class="num">'+i+'</span><span class="nm">'+({GRASSLAND:'GRASS',UNDERGROUND:'CAVE',UNDERWATER:'WATER'}[t.n]||t.n)+'</span>';
  if(i<=unlocked){const cv=document.createElement('canvas');cv.width=160;cv.height=88;thumb(i-1,cv);b.insertBefore(cv,b.firstChild)}
  b.onclick=()=>play(i-1);gr.appendChild(b)}
 setDiff(DIFF);document.getElementById('lvgo').textContent='\u25B6 PLAY LEVEL '+unlocked;
 const c=gr.querySelector('.cur');if(c&&c.scrollIntoView)c.scrollIntoView({block:'nearest'})}
function showLevels(){state='title';HM.hidden=true;GM.hidden=true;ov.hidden=true;LS.hidden=false;IN.hidden=true;document.body.classList.remove('endless');buildLevels()}
function play(n){ENDLESS=false;document.body.classList.remove('endless');START=n;IN.hidden=true;LS.hidden=true;HM.hidden=true;GM.hidden=false;document.body.classList.add('ig');start()}
document.getElementById('hs').onclick=showIntro;document.getElementById('p1').onclick=showLevels;
document.getElementById('hw').onclick=()=>{howMenu=true;setView(true);$g('setp').hidden=false};
document.getElementById('lvback').onclick=menu;
document.getElementById('lvgo').onclick=()=>play(unlocked-1);
document.getElementById('lvend').onclick=startEndless;
document.getElementById('instart').onclick=()=>play(0);document.getElementById('inback').onclick=menu;
document.querySelectorAll('.df').forEach(b=>b.onclick=()=>setDiff(+b.dataset.d));
function syncSound(){const t='SOUND: '+(mute?'OFF':'ON'),$=i=>document.getElementById(i);if($('b4'))$('b4').textContent=t;$('s1').textContent=t;$('s2').textContent='MUSIC: '+(music?'ON':'OFF');$('sndb').textContent=mute?'\uD83D\uDD07':'\uD83D\uDD0A'}
function toggleSound(){mute=!mute;syncSound();if(!mute)beep(660,.08)}
const $g=i=>document.getElementById(i);
$g('sndb').onclick=toggleSound;$g('s1').onclick=toggleSound;
$g('s2').onclick=()=>{music=!music;syncSound()};
$g('s7').onclick=()=>{unlocked=1;saveUnlock();$g('s7').textContent='PROGRESS RESET'};
$g('s3').onclick=()=>{try{localStorage.removeItem(pk('pq'))}catch(e){}best=0;$g('s3').textContent='BEST SCORE RESET'};
function setView(how){$g('setmain').hidden=how;$g('how').hidden=!how}
$g('setb').onclick=()=>{howMenu=false;setView(false);$g('setp').hidden=false};
$g('s5').onclick=()=>setView(true);
$g('s6').onclick=()=>{if(howMenu){howMenu=false;$g('setp').hidden=true}setView(false)};
$g('s4').onclick=()=>{$g('setp').hidden=true;setView(false);$g('s3').textContent='RESET BEST SCORE';$g('s7').textContent='RESET LEVEL PROGRESS'};
// ---- in-game menu: Pause / Restart / Home ----
function pause(){if(state!='play')return;state='paused';ov.hidden=false;
 ov.innerHTML='<h2>MENU</h2><button id="b1">&#9654; RESUME</button><button id="b2">&#8635; RESTART</button><button id="b3">&#8962; HOME</button><button id="b5">&#9776; LEVELS</button><button id="b4">SOUND: ON</button>';
 $g('b1').onclick=resume;$g('b2').onclick=restart;$g('b3').onclick=menu;$g('b5').onclick=showLevels;$g('b4').onclick=toggleSound;syncSound();$g('b1').focus()}
function resume(){if(state!='paused')return;state='play';ov.hidden=true}
function restart(){ov.hidden=true;ENDLESS?startEndless():start()}
$g('pz').onclick=e=>{e.currentTarget.blur();state=='paused'?resume():pause()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
const tune=[262,330,392,330,294,349,440,349];let ni=0;
setInterval(()=>{if(state=='play'&&!mute&&music)beep(tune[ni++%8],.16,'triangle',.02)},240);
// ---- sign in / sign out ----
const GUEST_PIC="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Crect width='12' height='12' fill='%235cc8ff'/%3E%3Crect x='1' y='1' width='10' height='3' fill='%23e8453c'/%3E%3Crect x='2' y='4' width='8' height='6' fill='%23ffcf9e'/%3E%3C/svg%3E";
function jwt(t){try{const b=t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(atob(b).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')))}catch(e){return null}}
function showWho(){const on=!!ACC;$g('acct').hidden=on;$g('who').hidden=!on;if(on){$g('wname').textContent=ACC.guest?'Guest':ACC.name;$g('avatar').src=ACC.pic||GUEST_PIC;$g('signout').textContent=ACC.guest?'SIGN IN':'SIGN OUT'}}
function setAcct(a){ACC=a;try{a?localStorage.setItem('pqacct',JSON.stringify(a)):localStorage.removeItem('pqacct')}catch(e){}loadProgress();showWho()}
function initGoogle(){const gm=$g('gmsg'),box=$g('gbtn');
 const fake=msg=>{box.innerHTML='<button class="gfake"><b>G</b> Sign in with Google</button>';box.firstChild.onclick=()=>{gm.textContent=msg}};
 if(GOOGLE_CLIENT_ID.startsWith('YOUR_')){fake('Google sign-in is not set up yet: add your Client ID in script.js. Use a username and password instead.');return}
 const sc2=document.createElement('script');sc2.src='https://accounts.google.com/gsi/client';sc2.async=true;
 sc2.onload=()=>{try{google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:r=>{const u=jwt(r.credential);if(u)setAcct({id:u.sub,name:u.name||u.email,email:u.email,pic:u.picture})}});google.accounts.id.renderButton(box,{theme:'filled_blue',size:'large',text:'signin_with',shape:'pill'})}catch(e){fake('Google sign-in could not start. Check your Client ID and web address.')}};
 sc2.onerror=()=>fake('Could not load Google sign-in. Check your internet.');
 document.head.appendChild(sc2)}
// ---- create account / sign in with a username and password (saved on this device) ----
async function hashPw(pw,salt){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+pw));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;const t=salt+':'+pw;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return 'f'+(h>>>0).toString(16)}}
function users(){try{return JSON.parse(localStorage.getItem('pqusers')||'{}')}catch(e){return{}}}
async function doAcct(create){const u=$g('acUser').value.trim(),p=$g('acPass').value,m=$g('acMsg');m.textContent='';
 if(!/^[A-Za-z0-9_]{3,16}$/.test(u)){m.textContent='Username: 3-16 letters, numbers or _';return}
 if(p.length<4){m.textContent='Password: at least 4 characters';return}
 const all=users(),key=u.toLowerCase(),r=all[key];
 if(create){if(r){m.textContent='That username is already taken';return}
  const salt=Math.random().toString(36).slice(2);all[key]={name:u,salt,hash:await hashPw(p,salt)};
  try{localStorage.setItem('pqusers',JSON.stringify(all))}catch(e){m.textContent='Could not save the account on this device';return}}
 else if(!r||r.hash!==await hashPw(p,r.salt)){m.textContent='Wrong username or password';return}
 $g('acPass').value='';setAcct({id:'u_'+key,name:all[key].name,local:true})}
$g('acIn').onclick=()=>doAcct(false);$g('acNew').onclick=()=>doAcct(true);
$g('acPass').onkeydown=e=>{if(e.key=='Enter')doAcct(false)};
$g('signout').onclick=()=>{try{google.accounts.id.disableAutoSelect()}catch(e){}setAcct(null)};
initGoogle();loadProgress();showWho();
load(0);
requestAnimationFrame(loop);
