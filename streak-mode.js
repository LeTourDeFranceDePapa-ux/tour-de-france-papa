(() => {
"use strict";
const DK="tourPapaV1",SK="tourPapaStreakV1";
const goals=[
[3,"Bon départ","🥉","La machine est lancée, Papa !"],
[7,"Une semaine en marche","⭐","7 jours sans lâcher : tes sandales sont inarrêtables !"],
[10,"Cap des 10 jours","🏅","Dix jours de suite, ça devient une vraie habitude !"],
[14,"Double semaine","🎖️","Deux semaines au compteur. Quel rythme !"],
[21,"Habitude de champion","🏆","21 jours : la marche fait maintenant partie de l’aventure !"],
[30,"Marcheur du mois","🌟","Un mois de régularité. Papa entre dans la légende !"],
[50,"Sandales d’or","🩴","50 jours consécutifs : même le bitume demande une pause !"],
[100,"Légende du Tour","👑","100 jours ! Le Tour de Papa n’a plus aucune limite !"]
];
const st=document.createElement("style");st.textContent=`
.streak-widget{margin:7px 0 4px;padding:7px 9px;border:2px solid #e5bd54;border-radius:11px;background:#fff4c9;color:#082e5d}.streak-main{display:flex;justify-content:space-between;gap:6px}.streak-main b{font-size:.72rem}.streak-main strong{font-size:1rem}.streak-record{font-size:.58rem;font-weight:900;color:#6a5316}.streak-next{display:block;margin-top:3px;color:#765b1b;font-size:.56rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.streak-days{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-top:4px}.streak-day{text-align:center;color:#8c8062;font-size:.48rem;font-weight:900}.streak-day i{display:block;width:9px;height:9px;margin:2px auto 0;border:1px solid #cbb67e;border-radius:50%;background:#eadfca}.streak-day.on i{border-color:#15977d;background:#16a57d}
.streak-passport{margin:18px 0 10px;padding:15px;border:2px dashed #b8893e;border-radius:14px;background:#fff8e8}.streak-passport h3{margin:0 0 4px;color:#082e5d;font:700 1.25rem/1 Georgia,serif}.streak-passport>p{margin:0 0 12px;color:#66736d;font-size:.73rem}.streak-badges{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.streak-badge{min-height:96px;padding:8px 4px;display:grid;place-content:center;border:2px solid #d8c7a5;border-radius:50%;background:#eadfca;color:#8b806d;text-align:center;filter:grayscale(1);opacity:.62}.streak-badge.on{border-color:#d5a52f;background:radial-gradient(circle,#fff8d8 0 48%,#ffd34f 50% 65%,#f05245 67%);color:#082e5d;filter:none;opacity:1;box-shadow:0 5px 10px #082e5d2b}.streak-badge span{font-size:1.45rem}.streak-badge b{font-size:.56rem;line-height:1.05}.streak-badge small{font-size:.51rem;font-weight:900}
.streak-toast{position:fixed;z-index:9998;left:50%;bottom:22px;width:min(90vw,390px);padding:13px 17px;border:3px solid #ffd23f;border-radius:16px;background:#082e5d;color:#fff;text-align:center;box-shadow:0 12px 35px #00152b80;transform:translate(-50%,130%);transition:.35s}.streak-toast.show{transform:translate(-50%,0)}.streak-toast b{display:block;color:#ffd23f}.streak-toast span{font-size:.72rem}
.streak-party{position:fixed;z-index:10020;inset:0;display:grid;place-items:center;padding:20px;background:#041b36d9}.streak-party[hidden]{display:none!important}.streak-party-card{position:relative;width:min(92vw,470px);padding:22px 20px;border:5px solid #ffd23f;border-radius:25px;background:linear-gradient(160deg,#fff8df,#bfeaed);text-align:center;box-shadow:0 25px 70px #00152baa;overflow:hidden}.streak-papa{height:165px;margin:4px auto -7px;filter:drop-shadow(0 8px 5px #082e5d45);animation:sBounce .7s infinite alternate}.streak-medal{position:absolute;right:24px;top:70px;width:82px;height:82px;display:grid;place-items:center;border:4px solid #f05245;border-radius:50%;background:#ffd23f;font-size:2.4rem;box-shadow:0 0 0 5px #fff8df}.streak-party h3{margin:5px 0;color:#f05245;font-size:.85rem;text-transform:uppercase}.streak-party h2{margin:0;color:#082e5d;font:400 1.9rem/1 "Lobster",Georgia,serif}.streak-party p{color:#173a5e;font-weight:800}.streak-close{background:#082e5d!important}@keyframes sBounce{to{transform:translateY(-8px) rotate(2deg)}}
@media(max-width:700px){.streak-badges{grid-template-columns:repeat(2,1fr)}.streak-badge{min-height:108px}.streak-papa{height:145px}.streak-medal{right:14px;top:64px}}
`;document.head.appendChild(st);
function pd(v){const a=String(v||"").split("/");let d=a.length===3?new Date(+a[2],+a[1]-1,+a[0]):new Date(v);if(Number.isNaN(d.getTime()))return null;d.setHours(12,0,0,0);return d}
function key(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function walks(){try{const d=JSON.parse(localStorage.getItem(DK)||'{"walks":[]}');return Array.isArray(d.walks)?d.walks:[]}catch(e){return[]}}
function calc(){
 const arr=[...new Set(walks().map(x=>pd(x.date)).filter(Boolean).map(key))].sort(),set=new Set(arr);let record=0,run=0,prev=null;
 arr.forEach(k=>{const d=pd(k);run=prev&&d-prev===86400000?run+1:1;record=Math.max(record,run);prev=d});
 let current=0;if(arr.length){const last=pd(arr[arr.length-1]),today=new Date();today.setHours(12,0,0,0);if(Math.round((today-last)/86400000)<=1){current=1;for(let i=arr.length-1;i>0;i--){if(pd(arr[i])-pd(arr[i-1])===86400000)current++;else break}}}
 return{arr,set,record,current,last:arr[arr.length-1]||""};
}
function rs(){try{return JSON.parse(localStorage.getItem(SK))||{badges:[],announced:""}}catch(e){return{badges:[],announced:""}}}
function ws(x){localStorage.setItem(SK,JSON.stringify(x))}
const week=document.querySelector(".week-dashboard");if(!week)return;
const box=document.createElement("div");box.className="streak-widget";box.innerHTML='<div class="streak-main"><b>🔥 Série : <strong id="streakNow">0</strong> jours</b><span class="streak-record">Record : <b id="streakBest">0</b></span></div><span id="streakNext" class="streak-next"></span><div id="streakDays" class="streak-days"></div>';week.querySelector(":scope>strong").insertAdjacentElement("afterend",box);
const pages=document.querySelector(".passport-pages");if(pages){const sec=document.createElement("section");sec.className="streak-passport";sec.innerHTML='<h3>Mes exploits de régularité</h3><p>Les badges gagnés en marchant plusieurs jours de suite.</p><div id="streakBadges" class="streak-badges"></div>';pages.insertBefore(sec,pages.querySelector(".passport-detail"))}
document.body.insertAdjacentHTML("beforeend",'<div id="streakToast" class="streak-toast"><b></b><span></span></div><div id="streakParty" class="streak-party" hidden><div class="streak-party-card"><img class="streak-papa" src="images/papa/papa-carnet-suivi.webp" alt="Papa célèbre son badge"><div id="streakMedal" class="streak-medal">🏅</div><h3>Nouveau badge obtenu</h3><h2 id="streakTitle"></h2><p id="streakMessage"></p><button id="streakClose" class="streak-close" type="button">Continuer l’aventure</button></div></div>');
const labs=["L","M","M","J","V","S","D"];let known=localStorage.getItem(DK)||"",ready=false;
function render(announce){
 const s=calc(),state=rs(),today=new Date(),mon=new Date(today);mon.setHours(12,0,0,0);mon.setDate(today.getDate()-((today.getDay()+6)%7));
 document.querySelector("#streakNow").textContent=s.current;document.querySelector("#streakBest").textContent=s.record;
 const next=goals.find(g=>g[0]>s.current),left=next?next[0]-s.current:0;
 document.querySelector("#streakNext").textContent=s.current===0?"Une marche aujourd’hui peut lancer une nouvelle série !":next?"Encore "+left+" jour"+(left>1?"s":"")+" pour « "+next[1]+" » !":"Une régularité légendaire !";
 document.querySelector("#streakDays").innerHTML=labs.map((l,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return'<span class="streak-day '+(s.set.has(key(d))?"on":"")+'">'+l+'<i></i></span>'}).join("");
 const old=new Set(state.badges||[]),fresh=goals.filter(g=>s.record>=g[0]&&!old.has(g[0]));goals.filter(g=>s.record>=g[0]).forEach(g=>old.add(g[0]));state.badges=[...old];
 const grid=document.querySelector("#streakBadges");if(grid)grid.innerHTML=goals.map(g=>'<div class="streak-badge '+(old.has(g[0])?"on":"")+'"><span>'+(old.has(g[0])?g[2]:"🔒")+'</span><b>'+g[1]+'</b><small>'+g[0]+' jours</small></div>').join("");
 if(announce&&s.last&&s.last!==state.announced){state.announced=s.last;setTimeout(()=>fresh.length?party(fresh[fresh.length-1]):toast(s.current),4200)}ws(state)
}
function toast(n){const t=document.querySelector("#streakToast");t.querySelector("b").textContent=n+" jour"+(n>1?"s":"")+" de suite !";t.querySelector("span").textContent=n>1?"Bravo Papa, la série continue !":"Une nouvelle série commence. En route Papa !";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),4200)}
function party(g){document.querySelector("#streakMedal").textContent=g[2];document.querySelector("#streakTitle").textContent=g[1]+" · "+g[0]+" jours";document.querySelector("#streakMessage").textContent=g[3];document.querySelector("#streakParty").hidden=false}
document.querySelector("#streakClose").onclick=()=>document.querySelector("#streakParty").hidden=true;document.querySelector("#streakParty").onclick=e=>{if(e.target.id==="streakParty")e.currentTarget.hidden=true};
render(false);setTimeout(()=>ready=true,1200);setInterval(()=>{const n=localStorage.getItem(DK)||"";if(n!==known){known=n;render(ready)}},900);
})();