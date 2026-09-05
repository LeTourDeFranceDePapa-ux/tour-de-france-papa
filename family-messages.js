(function () {
  "use strict";

  const ASSET_ROOT = "images/messages/";
  const assets = {
    pigeonWaiting: ASSET_ROOT + "pigeon-attente.webp",
    pigeonFlying: ASSET_ROOT + "pigeon-message.webp",
    stickers: [
      ["coeur", "Avec tout mon cœur", "sticker-coeur.webp"],
      ["transpire", "Ouf, ça chauffe !", "sticker-transpire.webp"],
      ["rire", "Mort de rire", "sticker-rire.webp"],
      ["muscles", "Super motivé", "sticker-muscles.webp"],
      ["sandales", "Les sandales en feu", "sticker-sandales-feu.webp"],
      ["etonne", "Quelle surprise !", "sticker-etonne.webp"],
      ["pouces", "Double pouce !", "sticker-deux-pouces.webp"]
    ]
  };

  const storageKey = "tourPapaFamilyLettersV1";
  const senderKey = "tourPapaFamilySenderV1";
  const familyMode = new URLSearchParams(location.search).get("famille") === "1";
  let letters = readLetters();

  function readLetters() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function writeLetters() {
    localStorage.setItem(storageKey, JSON.stringify(letters));
    window.dispatchEvent(new CustomEvent("papa-letters-changed"));
  }

  function senderIdentity() {
    let id = localStorage.getItem(senderKey);
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random()).toString();
      localStorage.setItem(senderKey, id);
    }
    return id;
  }

  function esc(value) {
    return String(value || "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  }

  function prettyDate(value) {
    return new Intl.DateTimeFormat("fr-FR", {dateStyle:"long", timeStyle:"short"}).format(new Date(value));
  }

  const style = document.createElement("style");
  style.textContent = `
    .letter-pigeon{position:absolute;z-index:12;left:50%;top:37px;width:170px;padding:0;border:0;background:transparent;color:#173a5e;filter:drop-shadow(0 7px 7px #172d2a38);cursor:pointer;transform:translateX(-50%);transition:transform .2s ease}.letter-pigeon:hover{background:transparent;transform:translate(-50%,-4px) rotate(2deg)}.letter-pigeon img{width:136px;height:108px;display:block;margin:auto;object-fit:contain}.letter-pigeon span{display:block;margin:-7px auto 0;padding:7px 11px;border:2px solid #173a5e;border-radius:999px;background:#fff7df;color:#173a5e;box-shadow:0 3px 0 #e0a42f;font:900 .72rem/1.05 Nunito,sans-serif}.letter-pigeon.has-mail img{animation:pigeon-fly 1.5s ease-in-out infinite alternate}.letter-count{position:absolute;right:13px;top:2px;min-width:25px;height:25px;display:grid!important;place-items:center;padding:0!important;border:3px solid #fff7df!important;border-radius:50%!important;background:#e94f43!important;color:#fff!important;box-shadow:0 2px 5px #0003!important;font-size:.75rem!important}.letter-dialog{width:min(680px,calc(100% - 24px));max-height:90vh;padding:0;border:0;border-radius:18px;background:#f4e4bf;color:#28362f;box-shadow:0 28px 85px #13241e88;overflow:auto}.letter-dialog::backdrop{background:#152a25c9;backdrop-filter:blur(3px)}.letter-paper{position:relative;min-height:420px;padding:30px clamp(18px,5vw,48px);background:linear-gradient(90deg,#b98d4c18 1px,transparent 1px),linear-gradient(#fff8dfcc,#f3dfafdf),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E");border:9px solid #f6e8c6;outline:2px solid #b89054;box-shadow:inset 0 0 45px #8b642528}.letter-paper:before,.letter-paper:after{content:"";position:absolute;width:55px;height:18px;background:#e5cf9dba;box-shadow:0 1px 3px #0002}.letter-paper:before{left:18px;top:10px;transform:rotate(-7deg)}.letter-paper:after{right:18px;bottom:12px;transform:rotate(5deg)}.letter-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-bottom:13px;border-bottom:2px dashed #b38c57}.letter-head h2{margin:0;color:#173a5e;font:400 clamp(1.65rem,6vw,2.45rem)/1 Lobster,cursive}.letter-close{width:38px;min-height:38px;margin:0;padding:0;border:2px solid #173a5e;border-radius:50%;background:#fff7df;color:#173a5e;font-size:1.2rem}.letter-close:hover{background:#173a5e;color:white}.letter-intro{margin:15px 0;color:#665636;font:italic 1rem/1.45 Georgia,serif}.letter-form label{margin-top:12px;color:#173a5e;font-size:.85rem}.letter-form input,.letter-form textarea{width:100%;border:1px solid #b99866;border-radius:9px;background:#fffdf2c9;color:#2c332e;box-shadow:inset 0 2px 5px #74522416;font:700 1rem/1.5 Nunito,sans-serif}.letter-form textarea{min-height:145px;padding:12px;resize:vertical}.letter-limit{display:block;text-align:right;color:#75664b;font-size:.72rem}.letter-send{background:#e94f43;box-shadow:0 4px 0 #b93830}.letter-send:hover{background:#c83d34}.letter-list{display:grid;gap:14px;margin-top:18px}.letter-envelope{position:relative;padding:17px;border:2px solid #c19b60;border-radius:9px;background:#fff9e6;box-shadow:0 5px 0 #d7bd8f;overflow:hidden}.letter-envelope:after{content:"";position:absolute;right:-35px;bottom:-35px;width:85px;height:85px;border:2px solid #d0aa6d;border-radius:50%;opacity:.3}.letter-envelope.unread{border-left:7px solid #e94f43}.letter-envelope h3{margin:0 0 6px;color:#173a5e;font:900 1rem Nunito,sans-serif}.letter-envelope p{margin:7px 0;font:italic 1rem/1.5 Georgia,serif;white-space:pre-wrap}.letter-envelope small{color:#74664e}.letter-status{display:inline-block;margin-top:8px;padding:4px 8px;border-radius:999px;background:#e9d39f;color:#4f432d;font-size:.72rem;font-weight:900}.sticker-choice{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.sticker-choice button{min-height:105px;margin:0;padding:5px;border:2px solid transparent;background:#fffaf0;color:#173a5e;font-size:.66rem}.sticker-choice button:hover,.sticker-choice button.selected{border-color:#e0a42f;background:#fff0bd}.sticker-choice img{width:68px;height:68px;display:block;margin:auto;object-fit:contain}.letter-reaction{display:flex;align-items:center;gap:11px;margin-top:12px;padding:9px;border-radius:12px;background:#eaf5f1}.letter-reaction img{width:74px;height:74px;object-fit:contain}.letter-reaction b{color:#173a5e}.letter-actions{display:flex;gap:8px;margin-top:10px}.letter-actions button{margin:0}.archive-letter{background:#173a5e}.archive-letter:hover{background:#0d2b47}.empty-mail{text-align:center;padding:28px 10px;color:#695c43}.empty-mail img{width:125px;height:100px;object-fit:contain}.mode-ribbon{position:fixed;z-index:1840;left:14px;bottom:14px;padding:6px 10px;border-radius:999px;background:#173a5edb;color:#fff;font:900 .68rem Nunito,sans-serif;box-shadow:0 4px 10px #0003}@keyframes pigeon-fly{to{transform:translate(-8px,-7px) rotate(-3deg)}}
    @media(max-width:650px){.letter-pigeon{top:24px;width:118px}.letter-pigeon img{width:92px;height:73px}.letter-pigeon span{padding:5px 7px;font-size:.59rem}.letter-count{right:4px!important;top:-2px!important}.letter-paper{padding:25px 15px}.sticker-choice{grid-template-columns:repeat(3,1fr)}.sticker-choice button{min-height:94px}.sticker-choice img{width:58px;height:58px}.letter-actions{flex-direction:column}}
    @media(prefers-reduced-motion:reduce){.letter-pigeon.has-mail img{animation:none}}
  `;
  document.head.appendChild(style);
  const layoutStyle = document.createElement("style");
  layoutStyle.textContent = `.distance-steps{margin-top:8px;color:#765b1b;font-size:.72rem;font-weight:900}.distance-steps strong{display:inline!important;margin:0!important;color:#173a5e!important;font-size:.86rem!important}.messages-dashboard{position:relative;min-height:190px;padding:8px!important;overflow:visible!important;background:linear-gradient(160deg,#d7f3f1,#fff4ca)!important;border:2px solid #73cbd0!important}.messages-dashboard:after{display:none!important}.messages-dashboard .letter-pigeon{position:relative!important;left:auto!important;top:auto!important;width:100%!important;min-height:170px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;transform:none!important}.messages-dashboard .letter-pigeon:hover{transform:translateY(-4px) rotate(1deg)!important}.messages-dashboard .letter-pigeon img{width:142px!important;height:112px!important}.messages-dashboard .letter-pigeon span{margin:-5px auto 0!important}.messages-dashboard .letter-count{right:calc(50% - 72px)!important;top:12px!important}@media(max-width:700px){.journey-tools .messages-dashboard{order:2;grid-column:2;min-height:168px}.messages-dashboard .letter-pigeon{min-height:150px!important}.messages-dashboard .letter-pigeon img{width:112px!important;height:88px!important}.journey-tools .progress-card{min-height:168px}}@media(max-width:430px){.journey-tools .messages-dashboard{width:76%;grid-column:1;justify-self:center;min-height:150px}.messages-dashboard .letter-pigeon{min-height:132px!important}}`;
  document.head.appendChild(layoutStyle);

  const stepsCard = document.querySelector(".steps-dashboard");
  const stepsValue = document.querySelector("#todaySteps");
  const distanceTotal = document.querySelector(".moved-progress .total");
  if (stepsValue && distanceTotal) {
    const stepsLine = document.createElement("div");
    stepsLine.className = "distance-steps";
    stepsLine.append("Aujourd’hui · ", stepsValue);
    distanceTotal.insertAdjacentElement("afterend", stepsLine);
  }
  if (stepsCard) {
    stepsCard.replaceChildren();
    stepsCard.classList.remove("steps-dashboard");
    stepsCard.classList.add("messages-dashboard");
    stepsCard.id = "pigeonDashboard";
    stepsCard.setAttribute("aria-label", "Messagerie de Papa");
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "letter-pigeon";
  button.setAttribute("aria-haspopup", "dialog");
  const pigeonHome = document.querySelector("#pigeonDashboard") || document.querySelector(".journey-tools");
  (pigeonHome || document.body).appendChild(button);

  const mode = document.createElement("div");
  mode.className = "mode-ribbon";
  mode.textContent = familyMode ? "Espace famille" : "Courrier de Papa";
  document.body.appendChild(mode);

  const dialog = document.createElement("dialog");
  dialog.className = "letter-dialog";
  dialog.innerHTML = `<div class="letter-paper"><header class="letter-head"><h2></h2><button type="button" class="letter-close" aria-label="Fermer">×</button></header><div id="letterContent"></div></div>`;
  document.body.appendChild(dialog);

  function unreadLetters() {
    return letters.filter(letter => !letter.readAt && !letter.archivedAt);
  }

  function refreshPigeon() {
    letters = readLetters();
    const count = familyMode ? letters.filter(letter => letter.senderId === senderIdentity() && letter.reaction && !letter.reactionSeen).length : unreadLetters().length;
    const flying = familyMode ? count > 0 : unreadLetters().length > 0;
    button.classList.toggle("has-mail", flying);
    button.innerHTML = `<img src="${flying ? assets.pigeonFlying : assets.pigeonWaiting}" alt=""><span>${familyMode ? "Laisser un message" : flying ? "Une lettre pour Papa !" : "Le courrier de Papa"}</span>${count ? `<i class="letter-count">${count}</i>` : ""}`;
    button.setAttribute("aria-label", familyMode ? "Laisser un message à Papa" : flying ? `${count} lettre nouvelle pour Papa` : "Ouvrir le courrier de Papa");
  }

  function openFamily() {
    dialog.querySelector("h2").textContent = "Un petit mot pour Papa";
    const mine = letters.filter(letter => letter.senderId === senderIdentity()).slice().reverse();
    dialog.querySelector("#letterContent").innerHTML = `
      <p class="letter-intro">Quelques mots suffisent pour lui donner du courage sur la route.</p>
      <form class="letter-form" id="familyLetterForm">
        <label for="letterName">Ton prénom</label><input id="letterName" maxlength="30" required autocomplete="name" placeholder="Ex. Maureen">
        <label for="letterMessage">Ton message</label><textarea id="letterMessage" maxlength="300" required placeholder="Allez Papa, toute la famille marche avec toi !"></textarea>
        <small class="letter-limit"><span id="letterChars">0</span> / 300</small>
        <button class="letter-send" type="submit">Confier la lettre au pigeon</button>
      </form>
      <h3 class="section-title">Mes lettres envoyées</h3><div class="letter-list">${mine.length ? mine.map(familyLetter).join("") : '<div class="empty-mail">Aucune lettre envoyée pour le moment.</div>'}</div>`;
    const textarea = dialog.querySelector("#letterMessage");
    textarea.addEventListener("input", () => dialog.querySelector("#letterChars").textContent = textarea.value.length);
    dialog.querySelector("#familyLetterForm").addEventListener("submit", event => {
      event.preventDefault();
      const name = dialog.querySelector("#letterName").value.trim();
      const message = textarea.value.trim();
      if (!name || !message) return;
      letters.push({id: Date.now() + "-" + Math.random().toString(16).slice(2), senderId: senderIdentity(), senderName: name, message, createdAt: new Date().toISOString(), readAt: null, reaction: null, reactionAt: null, reactionSeen: false, archivedAt: null});
      writeLetters();
      openFamily();
      dialog.querySelector("#letterContent").insertAdjacentHTML("afterbegin", '<div class="letter-status">Le pigeon est parti avec ton message !</div>');
    });
    const newlySeen = mine.filter(letter => letter.reaction && !letter.reactionSeen);
    newlySeen.forEach(letter => letter.reactionSeen = true);
    if (newlySeen.length) writeLetters();
  }

  function familyLetter(letter) {
    const sticker = assets.stickers.find(item => item[0] === letter.reaction);
    return `<article class="letter-envelope"><h3>Pour Papa</h3><small>${prettyDate(letter.createdAt)}</small><p>${esc(letter.message)}</p>${sticker ? `<div class="letter-reaction"><img src="${ASSET_ROOT + sticker[2]}" alt=""><span><b>Papa a répondu :</b><br>${sticker[1]}</span></div>` : `<span class="letter-status">${letter.readAt ? "Lettre lue par Papa" : "Le pigeon est en chemin…"}</span>`}</article>`;
  }

  function openPapa() {
    letters = readLetters();
    let changed = false;
    letters.forEach(letter => { if (!letter.readAt && !letter.archivedAt) { letter.readAt = new Date().toISOString(); changed = true; } });
    if (changed) writeLetters();
    const active = letters.filter(letter => !letter.archivedAt).slice().reverse();
    const archived = letters.filter(letter => letter.archivedAt).slice().reverse();
    dialog.querySelector("h2").textContent = "Le courrier de Papa";
    dialog.querySelector("#letterContent").innerHTML = `<p class="letter-intro">Le pigeon a apporté les encouragements de la famille.</p><div class="letter-list">${active.length ? active.map(papaLetter).join("") : `<div class="empty-mail"><img src="${assets.pigeonWaiting}" alt=""><b>Aucune nouvelle lettre.</b><br>Le pigeon se repose en attendant.</div>`}</div>${archived.length ? `<details><summary>Ma boîte à souvenirs (${archived.length})</summary><div class="letter-list">${archived.map(papaLetter).join("")}</div></details>` : ""}`;
    dialog.querySelectorAll("[data-reaction]").forEach(control => control.addEventListener("click", () => {
      const letter = letters.find(item => item.id === control.dataset.letter);
      if (!letter) return;
      letter.reaction = control.dataset.reaction;
      letter.reactionAt = new Date().toISOString();
      letter.reactionSeen = false;
      writeLetters();
      openPapa();
    }));
    dialog.querySelectorAll("[data-archive]").forEach(control => control.addEventListener("click", () => {
      const letter = letters.find(item => item.id === control.dataset.archive);
      if (!letter) return;
      letter.archivedAt = new Date().toISOString();
      writeLetters();
      openPapa();
    }));
  }

  function papaLetter(letter) {
    const sticker = assets.stickers.find(item => item[0] === letter.reaction);
    const archived = Boolean(letter.archivedAt);
    return `<article class="letter-envelope"><h3>De ${esc(letter.senderName)}</h3><small>${prettyDate(letter.createdAt)}</small><p>${esc(letter.message)}</p>${sticker ? `<div class="letter-reaction"><img src="${ASSET_ROOT + sticker[2]}" alt=""><span><b>Réponse choisie :</b><br>${sticker[1]}</span></div>` : `<div class="sticker-choice" aria-label="Choisir une réponse">${assets.stickers.map(item => `<button type="button" data-letter="${letter.id}" data-reaction="${item[0]}" title="${item[1]}"><img src="${ASSET_ROOT + item[2]}" alt="">${item[1]}</button>`).join("")}</div>`}${!archived && letter.reaction ? `<div class="letter-actions"><button type="button" class="archive-letter" data-archive="${letter.id}">Ranger cette lettre dans mes souvenirs</button></div>` : archived ? '<span class="letter-status">Rangée dans la boîte à souvenirs</span>' : ""}</article>`;
  }

  button.addEventListener("click", () => {
    familyMode ? openFamily() : openPapa();
    dialog.showModal();
  });
  dialog.querySelector(".letter-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener("storage", refreshPigeon);
  window.addEventListener("papa-letters-changed", refreshPigeon);
  refreshPigeon();
})();
