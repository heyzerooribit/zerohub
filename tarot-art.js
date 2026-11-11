/* Adds a picture to each card on the Daily card page.
   Works alongside tarot.js: when a card name appears, the matching drawing is put on the card face. */
(function () {
  const G = (s) => `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s}</svg>`;
  const ART = {
    "fool": '<path d="M10 80h35l8-6"/><circle cx="72" cy="26" r="10"/><circle cx="40" cy="40" r="6"/><path d="M40 46v18l-8 10M40 56l12-6"/>',
    "magician": '<path d="M50 30c-10-12-30-12-30 0s20 12 30 0 30-12 30 0-20 12-30 0z"/><path d="M50 48v40M40 88h20"/>',
    "high priestess": '<path d="M22 20v60M78 20v60"/><path d="M58 32a20 20 0 1 0 0 36a15 15 0 1 1 0-36z"/>',
    "empress": '<circle cx="50" cy="36" r="18"/><path d="M50 54v32M38 70h24"/>',
    "emperor": '<path d="M24 84V40h52v44z"/><path d="M24 40l10-16 16 12 16-12 10 16"/>',
    "hierophant": '<path d="M50 14v74M34 28h32M28 46h44M34 64h32"/>',
    "lovers": '<circle cx="38" cy="50" r="22"/><circle cx="62" cy="50" r="22"/>',
    "chariot": '<circle cx="30" cy="72" r="13"/><circle cx="70" cy="72" r="13"/><path d="M20 58V34h60v24M50 34V18"/>',
    "strength": '<path d="M50 26c-8-10-26-10-26 0s18 10 26 0 26-10 26 0-18 10-26 0z"/><circle cx="50" cy="66" r="18"/><path d="M42 62h.1M58 62h.1M42 74c5 4 11 4 16 0"/>',
    "hermit": '<path d="M70 14v56M26 40h32v30H26zM42 28v12"/><circle cx="42" cy="55" r="6"/>',
    "wheel of fortune": '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="8"/><path d="M50 16v68M16 50h68M26 26l48 48M74 26L26 74"/>',
    "justice": '<path d="M50 14v72M30 86h40M24 30h52"/><path d="M24 30l-12 26h24zM76 30l-12 26h24z"/>',
    "hanged man": '<path d="M20 14h60M50 14v56"/><circle cx="50" cy="78" r="9"/><path d="M36 54l14 6 14-6"/>',
    "death": '<path d="M32 90L64 22"/><path d="M64 22c-18-6-34 2-42 18 18-4 30-6 42-18z"/>',
    "temperance": '<path d="M20 20h24l-4 22H24zM56 58h24l-4 22H60z"/><path d="M40 42c14 0 6 16 20 16"/>',
    "devil": '<circle cx="50" cy="50" r="34"/><path d="M50 82L24 38h52z"/>',
    "tower": '<path d="M34 90V40h32v50zM30 40l20-20 20 20"/><path d="M82 8L70 30h12L68 54"/>',
    "star": '<polygon points="50,12 60,40 88,40 66,58 74,86 50,70 26,86 34,58 12,40 40,40"/>',
    "moon": '<path d="M62 20a30 30 0 1 0 0 60a24 24 0 1 1 0-60z"/><path d="M80 70v14M70 74v10"/>',
    "sun": '<circle cx="50" cy="50" r="16"/><path d="M50 12v14M50 74v14M12 50h14M74 50h14M23 23l10 10M67 67l10 10M77 23L67 33M33 67L23 77"/>',
    "judgement": '<path d="M18 62L66 30l8 14L26 76z"/><path d="M80 24l8-8M84 40h10M72 14V4"/>',
    "world": '<ellipse cx="50" cy="50" rx="28" ry="38"/><circle cx="50" cy="50" r="8"/>'
  };
  ART["judgment"] = ART["judgement"];

  const SYM = {
    wands: '<path d="M0 10V-10M0 -1l-5-4M0 -6l5-4"/>',
    cups: '<path d="M-8 -8h16c0 10-3 12-8 12s-8-2-8-12zM0 4v6M-5 10h10"/>',
    swords: '<path d="M0 -13V5M-2.5 -10L0 -14l2.5 4M-6 5h12M0 5v6"/>',
    pentacles: '<circle r="9"/><polygon points="0,-6 1.8,-1.8 6,-1.8 2.6,0.8 4,5 0,2.5 -4,5 -2.6,0.8 -6,-1.8 -1.8,-1.8"/>'
  };
  const RANKS = ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"];
  const PIPS = [
    [[50,50]],[[50,28],[50,72]],[[50,22],[50,50],[50,78]],
    [[32,30],[68,30],[32,70],[68,70]],[[32,30],[68,30],[32,70],[68,70],[50,50]],
    [[32,24],[68,24],[32,50],[68,50],[32,76],[68,76]],
    [[32,24],[68,24],[32,50],[68,50],[32,76],[68,76],[50,37]],
    [[32,24],[68,24],[32,50],[68,50],[32,76],[68,76],[50,37],[50,63]],
    [[32,20],[68,20],[32,40],[68,40],[32,60],[68,60],[32,80],[68,80],[50,50]],
    [[32,20],[68,20],[32,40],[68,40],[32,60],[68,60],[32,80],[68,80],[50,30],[50,70]]
  ];
  const NUM = {1:"ace",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",10:"ten"};
  function crown(n) {
    const w = 52 / n; let d = "M24 38";
    for (let k = 0; k < n; k++) d += ` L${24 + (k + .5) * w} 14 L${24 + (k + 1) * w} 38`;
    return `<path d="${d}Z"/>`;
  }
  Object.keys(SYM).forEach((suit) => {
    RANKS.forEach((rank, r) => {
      let art;
      if (r < 10) {
        const sc = r === 0 ? 3.4 : r < 6 ? 1.5 : 1.1;
        art = PIPS[r].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(${sc})">${SYM[suit]}</g>`).join("");
      } else {
        art = crown(r - 9) + `<g transform="translate(50 68) scale(2.2)">${SYM[suit]}</g>`;
      }
      ART[`${rank} of ${suit}`] = art;
    });
  });

  function key(name) {
    let k = (name || "").toLowerCase()
      .replace(/\(.*?\)/g, " ").replace(/reversed|upright|inverted/g, " ")
      .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
    k = k.replace(/\b(\d+)\b/g, (m, n) => NUM[n] || m);
    k = k.replace(/^the /, "");
    return k;
  }

  const style = document.createElement("style");
  style.textContent = ".tart{position:absolute;inset:7% 10% 40%;display:flex;align-items:center;justify-content:center;pointer-events:none;color:var(--red,#e11d2e)}.tart svg{width:100%;height:100%}#tfront{display:flex!important;flex-direction:column!important;justify-content:flex-end!important;align-items:center!important;padding-bottom:9%!important}";
  document.head.appendChild(style);

  const nameEl = document.getElementById("tname");
  const front = document.getElementById("tfront");
  if (!nameEl || !front) return;

  function apply() {
    const k = key(nameEl.textContent);
    const old = front.querySelector(".tart");
    if (!k || !ART[k]) { if (old) old.remove(); return; }
    if (old && old.dataset.k === k) return;
    if (old) old.remove();
    const d = document.createElement("div");
    d.className = "tart"; d.dataset.k = k;
    d.innerHTML = G(ART[k]);
    front.prepend(d);
  }

  const mo = new MutationObserver(apply);
  mo.observe(nameEl, { childList: true, characterData: true, subtree: true });
  mo.observe(front, { childList: true });
  apply();
})();
