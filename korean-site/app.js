/* ============ APP ============ */
const $=id=>document.getElementById(id);
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const W=j=>DATA[j].w||(DATA[j].w=DATA[j].v.map(s=>{const[k,r,e,x,t]=s.split('|');return{k,r,e,x,t,id:DATA[j].id+k}}));
let lv=0,mode='cards',i=0,flipped=false,eng=false,order=shuf(W(0).map((_,x)=>x)),q=null,score={r:0,t:0},known={};
try{known=JSON.parse(localStorage.getItem('krKnown')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('krKnown',JSON.stringify(known))}catch(e){}window.Cloud&&window.Cloud.changed('known')};

function render(){
 $('lv').innerHTML=DATA.map((d,j)=>`<button class="${j==lv?'on':''}" onclick="setLv(${j})">${d.id}</button>`).join('');
 $('md').innerHTML=[['cards','Flashcards'],['quiz','Word quiz'],['words','Word list'],['gram','Grammar'],['cat','Categories']].map(([m,t])=>`<button class="${m==mode?'on':''}" onclick="setMode('${m}')">${t}</button>`).join('');
 $('lv').style.display=mode=='cat'?'none':'';
 $('prog').textContent=mode=='cat'?`${cats[ci].n}: ${P().filter(w=>known[w.id]).length} of ${cats[ci].v.length} words known`:`${DATA[lv].t}: ${W(lv).filter(w=>known[w.id]).length} of ${W(lv).length} words known`;
 $('main').innerHTML=mode=='cat'?catHTML():mode=='words'?rowsHTML(W(lv),false):mode=='cards'?cardsHTML():mode=='quiz'?quizHTML():gramHTML();
}
function setLv(j){lv=j;i=0;flipped=false;order=shuf(W(j).map((_,x)=>x));q=null;render()}
function setMode(m){mode=m;i=0;flipped=false;order=[];q=null;if(m=='quiz')newQ();render()}

function cardsHTML(){
 const w=cur();
 const front=eng?`<div class="en">${w.e}</div>`:`<div class="kr">${w.k}</div>`;
 const back=(eng?`<div class="kr">${w.k}</div><p>${w.r}</p>`:`<div class="en">${w.e}</div><p>${w.r}</p>`)+exLine(w);
 return `<button class="card" onclick="flipped=!flipped;render()" aria-label="Flip card">${flipped?back:front}<p>${known[w.id]?'Marked as known':'Tap to flip'}</p></button>
 <div class="acts"><button class="again" onclick="mark(0)">Again</button><button class="good" onclick="mark(1)">Got it</button></div>
 <p class="hint"><label><input type="checkbox" ${eng?'checked':''} onchange="eng=this.checked;flipped=false;render()"> Show English first</label></p>`;
}
function mark(ok){const w=cur();if(ok)known[w.id]=1;else delete known[w.id];save();i++;flipped=false;render()}

function newQ(){let pool=[];if(mode=='cat')pool=P();else for(let j=0;j<=lv;j++)pool.push(...W(j));const w=pick(pool);const o=[w];while(o.length<4){const x=pick(pool);if(!o.includes(x))o.push(x)}q={w,o:shuf(o),done:false}}
function quizHTML(){
 if(!q)newQ();
 return `<div class="card" style="cursor:default">${eng?`<div class="en">${q.w.e}</div>`:`<div class="kr">${q.w.k}</div><p>${q.w.r}</p>`}</div>
 <div class="opts">${q.o.map((o,x)=>`<button onclick="ans(${x},this)">${eng?o.k:o.e}</button>`).join('')}</div>
 <p class="hint" id="fb">${mode=='cat'?cats[ci].n:'Words from 1A up to '+DATA[lv].id}. Score: ${score.r} of ${score.t}</p>
 <div class="acts"><button onclick="newQ();render()">Next word</button><button onclick="eng=!eng;render()">${eng?'Ask in Korean':'Ask in English'}</button></div>`;
}
function ans(x,b){
 if(q.done)return;const ok=q.o[x]===q.w;
 b.classList.add(ok?'ok':'no');
 if(ok){q.done=true;score.r++;score.t++;known[q.w.id]=1;save();{const X=exOf(q.w);$('fb').innerHTML=`Correct: ${q.w.k} = ${q.w.e}`+(X?`<br>${X[0]} (${X[1]||''})`:'')}}
 else{score.t++;$('fb').textContent='Not quite. Try another answer.'}
}

function gramHTML(){
 return DATA[lv].g.map((g,gi)=>{const o=shuf(g.q.slice(1));
 return `<article class="g"><h3>${g.p}</h3><p class="m">${g.m}</p><p>${g.n}</p>
 <p class="x">${g.x[0]}<br><span>${g.x[1]}</span></p>
 <div class="pr"><b>${g.q[0].replace('___','<u></u>')}</b><div>${o.map(t=>`<button onclick="gAns(this,${gi})">${t}</button>`).join('')}</div><em></em></div></article>`}).join('');
}
function gAns(b,gi){
 const g=DATA[lv].g[gi],ok=b.textContent===g.q[1],fb=b.parentElement.nextElementSibling;
 b.classList.add(ok?'ok':'no');
 fb.style.color=ok?'var(--green)':'var(--red)';
 fb.textContent=ok?'Correct: '+g.q[0].replace('___',g.q[1]):'Not quite. Try another answer.';
 if(ok)b.parentElement.querySelectorAll('button').forEach(x=>x.disabled=true);
}
let ci=0,cv='list',bm='',bt='';
const base=CATS.map(c=>({n:c.n,b:1,v:c.v.map(s=>{const[k,r,e,x,t]=s.split('|');return{k,r,e,x,t,b:1}})}));
const wk=w=>w.k+'\u0001'+String(w.e).toLowerCase();
/* Words from data/categories.js are always read fresh from the file.
   Only what you add on the page (new tabs, extra words) is saved in this browser. */
function derive(list){const extra={},tabs=[];for(const c of list){const b=base.find(x=>x.n==c.n);
 if(b){const have=new Set(b.v.map(wk));const ex=c.v.filter(w=>!have.has(wk(w))).map(({k,r,e,x,t,at})=>({k,r,e,x,t,at}));if(ex.length)extra[c.n]=ex}
 else tabs.push({n:c.n,at:c.at,v:c.v.map(({k,r,e,x,t,at})=>({k,r,e,x,t,at}))})}return{extra,tabs}}
function assemble(u){const out=base.map(b=>({n:b.n,b:1,v:[...b.v,...((u.extra||{})[b.n]||[])]}));for(const t of u.tabs||[])out.push({n:t.n,at:t.at,v:(t.v||[]).slice()});return out}
let cats;
try{let u=JSON.parse(localStorage.getItem('krUser')||'null');
 if(!u){const old=JSON.parse(localStorage.getItem('krCats')||'null');u=Array.isArray(old)?derive(old):{}}
 cats=assemble(u)}catch(e){cats=assemble({})}
const saveC=()=>{try{localStorage.setItem('krUser',JSON.stringify(derive(cats)))}catch(e){}window.Cloud&&window.Cloud.changed('words')};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=()=>mode=='cat'?(cats[ci]?cats[ci].v.map(w=>({k:w.k,r:w.r,e:w.e,x:w.x,t:w.t,id:'c'+cats[ci].n+w.k})):[]):W(lv);
function cur(){const p=P();if(order.length!==p.length)order=shuf(p.map((_,x)=>x));return p[order[i%order.length]]}

function catHTML(){
 const c=cats[ci];
 const tabs=cats.map((x,j)=>`<button class="${j==ci?'on':''}" onclick="setCat(${j})">${x.n}</button>`).join('')+`<button class="add" onclick="addCat()">+ New tab</button>`;
 const views=[['list','Word list'],['cards','Flashcards'],['quiz','Quiz']].map(([v,t])=>`<button class="${v==cv?'on':''}" onclick="cv='${v}';q=null;flipped=false;render()">${t}</button>`).join('');
 let body;
 if(cv=='list')body=listHTML(c);
 else if(c.v.length<(cv=='quiz'?4:1))body=`<p class="hint">Add ${cv=='quiz'?'at least 4 words':'a word'} in the word list to practice this tab.</p>`;
 else body=cv=='cards'?cardsHTML():quizHTML();
 return `<div class="sub">${tabs}</div><div class="row">${views}</div>${body}`;
}
function listHTML(c){
 return `${rowsHTML(c.v,true)}
 <div class="af"><input id="nk" placeholder="한글" lang="ko"><input id="nr" placeholder="Romanization (optional)"><input id="ne" placeholder="Meaning"><input id="nx" placeholder="Example sentence (optional)" lang="ko"><input id="nt" placeholder="Example meaning (optional)"><button class="on" onclick="addWord()">Add word</button></div>
 <div class="bk"><h4>Add many words at once</h4>
 <p class="hint">One word per line: <b>한글, romanization, meaning</b> (romanization is optional: <b>한글, meaning</b>). You can also separate with | or a tab, so pasting from Excel or Google Sheets works. With | you can add an example too: <b>한글 | romanization | meaning | example | example meaning</b>.</p>
 <textarea id="bulk" class="bulk" lang="ko" placeholder="사과, sagwa, apple&#10;바나나, banana&#10;우유 | uyu | milk | 우유를 마셔요. | I drink milk.">${esc(bt)}</textarea>
 <div class="af"><button class="on" onclick="addBulk()">Add all words</button></div>
 <p class="hint" role="status" id="bmsg">${bm}</p></div>
 ${c.b?'<p class="hint">This tab comes from data/categories.js. Words you add here are saved in this browser only.</p>':'<p class="hint"><button onclick="delCat()">Delete this tab</button></p>'}`;
}
function setCat(j){bm='';bt='';ci=j;i=0;flipped=false;order=[];q=null;render()}
function addCat(){const n=(prompt('Name for the new tab (for example Food, Family, Colors):')||'').trim();if(!n)return;cats.push({n:esc(n),at:Date.now(),v:[]});ci=cats.length-1;cv='list';i=0;order=[];q=null;saveC();render()}
const dk=(k,e)=>k+'\u0001'+String(e).toLowerCase();
function addWord(){const k=$('nk').value.trim(),e=$('ne').value.trim();if(!k||!e){$('nk').focus();return}
 const K=esc(k),E=esc(e),v=cats[ci].v;
 if(v.some(w=>dk(w.k,w.e)===dk(K,E))){bm=`${K} (${E}) is already in this tab, so it was not added.`;$('bmsg').innerHTML=bm;alert(`Already in this tab, not added:\n${k} (${e})`);$('nk').focus();return}
 bm=v.some(w=>w.k===K)?`${K} was already here with a different meaning. This meaning was added too.`:'';
 v.push({k:K,r:esc($('nr').value.trim()),e:E,x:esc($('nx').value.trim()),t:esc($('nt').value.trim()),at:Date.now()});order=[];saveC();render();$('nk').focus()}
function addBulk(){
 const lines=$('bulk').value.split(/\r?\n/).map(l=>l.trim()).filter(Boolean),v=cats[ci].v;
 const have=new Set(v.map(w=>dk(w.k,w.e))),ks=new Set(v.map(w=>w.k));
 let added=0;const bad=[],dups=[],alts=[];
 for(const l of lines){
  const sp=l.includes('|')||l.includes('\t');
  let a=(l.includes('|')?l.split('|'):l.includes('\t')?l.split('\t'):l.split(/\s*[,，]\s*/)).map(z=>z.trim());
  if(!sp)a=a.filter(z=>z!=='');
  let k,r,e,x='',t='';
  if(sp&&a.length>2){[k,r,e,x='',t='']=a}else{k=a[0];r=a.length>2?a[1]:'';e=a.length>2?a.slice(2).join(', '):a[1]}
  if(!k||!e){bad.push(l);continue}
  const K=esc(k),E=esc(e);
  if(have.has(dk(K,E))){dups.push(`${k} (${e})`);continue}
  if(ks.has(K))alts.push(k);
  v.push({k:K,r:esc(r),e:E,x:esc(x),t:esc(t),at:Date.now()});have.add(dk(K,E));ks.add(K);added++;
 }
 bt=bad.join('\n');
 bm=`Added ${added} word${added==1?'':'s'}.`
  +(dups.length?` Skipped ${dups.length} already in this tab: ${esc(dups.join(', '))}.`:'')
  +(alts.length?` Same word with a new meaning added: ${esc(alts.join(', '))}.`:'')
  +(bad.length?` ${bad.length} line${bad.length==1?'':'s'} need a meaning and stayed in the box.`:'');
 order=[];saveC();render();
 if(dups.length)alert(`Already in this tab, not added (${dups.length}):\n${dups.join('\n')}\n\nAdded ${added} new word${added==1?'':'s'}.`);
}
function delWord(x){const w=cats[ci].v[x];if(!w||w.b){alert('This word comes from data/categories.js. Edit that file to remove it.');return}window.Cloud&&window.Cloud.deleted(cats[ci].n+'|'+wk(w));cats[ci].v.splice(x,1);order=[];saveC();render()}
function delCat(){if(cats[ci].b){alert('This tab comes from data/categories.js. Edit that file to remove it.');return}if(cats.length<2){alert('Keep at least one tab.');return}if(!confirm('Delete the tab "'+cats[ci].n+'" and all its words?'))return;window.Cloud&&window.Cloud.deleted('tab:'+cats[ci].n);cats.splice(ci,1);ci=0;order=[];q=null;saveC();render()}
window.KR={get:()=>({known,user:derive(cats)}),set:(k,u)=>{known=k;try{localStorage.setItem('krKnown',JSON.stringify(k));localStorage.setItem('krUser',JSON.stringify(u))}catch(e){}cats=assemble(u);if(ci>=cats.length)ci=0;order=[];q=null;render()}};
const exOf=w=>w.x?[w.x,w.t]:(EX[w.k+'|'+w.e]||EX[w.k]||null);
const exLine=w=>{const X=exOf(w);return X?`<p class="exl"><b>${X[0]}</b><br>${X[1]||''}</p>`:''};
function rowsHTML(ws,del){
 if(!ws.length)return '<ul class="wl"><li><p class="hint" style="padding:0 14px">No words yet. Add your first one below.</p></li></ul>';
 return `<ul class="wl">${ws.map((w,x)=>{const X=exOf(w);
  return `<li><button class="wr" aria-expanded="false" onclick="togEx(this)"><span class="k">${w.k}</span><span>${w.e}<br><small>${w.r||''}</small></span></button>${del&&!w.b?`<button class="del" onclick="delWord(${x})" aria-label="Delete ${w.k}">×</button>`:''}<div class="ex" hidden>${X?`<b>${X[0]}</b><br><span>${X[1]||''}</span>`:'<span>No example yet for this word.</span>'}</div></li>`}).join('')}</ul>`;
}
function togEx(b){const d=b.parentElement.querySelector('.ex');d.hidden=!d.hidden;b.setAttribute('aria-expanded',String(!d.hidden))}
render();
