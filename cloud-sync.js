/* Cloud sync: saves the words you add and your "known" progress online
   (Firebase Realtime Database over plain web requests, no extra libraries).
   It stays off until you put your database URL in data/cloud-config.js. */
(function(){
 const url=((typeof CLOUD!=='undefined'&&CLOUD.dbUrl)||'').replace(/\/+$/,'');
 let meta={kts:0,del:{},code:''};
 try{Object.assign(meta,JSON.parse(localStorage.getItem('krMeta')||'{}'))}catch(e){}
 const sm=()=>{try{localStorage.setItem('krMeta',JSON.stringify(meta))}catch(e){}};
 const enc=k=>encodeURIComponent(k).replace(/\./g,'%2E');
 const wkey=w=>w.k+'\u0001'+String(w.e).toLowerCase();
 const ep=()=>`${url}/users/${encodeURIComponent(meta.code)}.json`;
 let timer=null,busy=false,again=false;
 const $=id=>document.getElementById(id);
 const say=m=>{const s=$('cs');if(s)s.textContent=m};

 function mergeUser(a,b,del){
  const ew=new Map(),tb=new Map();
  for(const u of [a||{},b||{}]){
   for(const [tab,ws] of Object.entries(u.extra||{}))for(const w of ws){const key=tab+'|'+wkey(w);if((del[enc(key)]||0)>(w.at||0))continue;ew.set(key,{tab,w})}
   for(const t of u.tabs||[]){if((del[enc('tab:'+t.n)]||0)>(t.at||0))continue;
    const cur=tb.get(t.n)||{n:t.n,at:t.at,m:new Map()};
    for(const w of t.v||[]){const key=t.n+'|'+wkey(w);if((del[enc(key)]||0)>(w.at||0))continue;cur.m.set(key,w)}
    tb.set(t.n,cur)}
  }
  const extra={};for(const {tab,w} of ew.values())(extra[tab]=extra[tab]||[]).push(w);
  return{extra,tabs:[...tb.values()].map(t=>({n:t.n,at:t.at,v:[...t.m.values()]}))};
 }
 async function sync(){
  if(!url||!meta.code)return;
  if(busy){again=true;return}
  busy=true;say('Syncing…');
  try{
   const r=await fetch(ep());if(!r.ok)throw new Error('read '+r.status);
   const R=(await r.json())||{};
   const Rk=R.known?JSON.parse(R.known):{},Ru=R.user?JSON.parse(R.user):{};
   const L=KR.get(),del=Object.assign({},R.del||{});
   for(const k in meta.del)del[k]=Math.max(del[k]||0,meta.del[k]);
   const rts=R.kts||0,known=rts>meta.kts?Rk:L.known,kts=Math.max(rts,meta.kts);
   const user=mergeUser(L.user,Ru,del);
   meta.kts=kts;meta.del=del;sm();
   KR.set(known,user);
   const w=await fetch(ep(),{method:'PUT',body:JSON.stringify({kts,known:JSON.stringify(known),user:JSON.stringify(user),del,ts:Date.now()})});
   if(!w.ok)throw new Error('write '+w.status);
   say('Synced at '+new Date().toLocaleTimeString());
  }catch(e){say('Sync failed ('+e.message+'). Check your internet connection and the database rules.')}
  busy=false;if(again){again=false;schedule()}
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(sync,1500)}
 window.Cloud={sync,changed(w){if(w==='known'){meta.kts=Date.now();sm()}schedule()},deleted(key){meta.del[enc(key)]=Date.now();sm()}};

 function panel(){
  const p=$('cp');
  if(!url){p.innerHTML='<p class="hint">Cloud sync is off. Put your database URL in <b>data/cloud-config.js</b> to turn it on.</p>';return}
  p.innerHTML=meta.code
   ?`<p class="hint">Your sync code: <b>${meta.code}</b><br>Type this same code on your other devices. Do not share it: anyone with the code can change your words.</p><div class="af"><button class="on" id="cn">Sync now</button><button id="cx">Disconnect</button></div>`
   :`<p class="hint">First device: press Make new code, then Connect. Other devices: type the same code, then Connect.</p><div class="af"><input id="ci" placeholder="Sync code" autocapitalize="off" autocomplete="off"><button id="cm">Make new code</button><button class="on" id="cc">Connect</button></div>`;
  if(meta.code){$('cn').onclick=sync;$('cx').onclick=()=>{meta.code='';sm();panel();say('Disconnected. Your words stay on this device.')}}
  else{
   $('cm').onclick=()=>{const a=new Uint8Array(20);crypto.getRandomValues(a);$('ci').value=Array.from(a,x=>'abcdefghjkmnpqrstuvwxyz23456789'[x%31]).join('')};
   $('cc').onclick=()=>{const c=$('ci').value.trim();if(!/^[A-Za-z0-9_-]{12,}$/.test(c)){say('The code needs at least 12 letters or numbers.');return}meta.code=c;sm();panel();sync()};
  }
 }
 addEventListener('load',()=>{
  const box=document.createElement('div');box.className='cloud';
  box.innerHTML='<button id="cb" aria-expanded="false">Cloud sync</button> <span id="cs" role="status"></span><div id="cp" hidden></div>';
  document.querySelector('.wrap').insertBefore(box,$('lv'));
  $('cb').onclick=()=>{const p=$('cp');p.hidden=!p.hidden;$('cb').setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)panel()};
  if(meta.code)sync();else say(url?'Not connected':'');
 });
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
})();
