/* Turns the profile button into an account menu.
   - Desktop: the sidebar profile button (#me) opens the menu.
   - Phone: an "Ø Account" button is added to the top nav.
   Needs supabase-js and supabase-config.js loaded before it. */
(async function () {
  const btn = document.getElementById("me");
  if (!btn || typeof sb === "undefined") return;
  const sub = document.getElementById("me-sub");
  const SIGNED = "Signed in as admin";
  let admin = false;
  try {
    const { data } = await sb.auth.getSession();
    admin = await isAdmin(data.session && data.session.user);
  } catch (e) {}

  function label() { if (admin && sub && sub.textContent !== SIGNED) sub.textContent = SIGNED; }
  label();
  if (sub) new MutationObserver(label).observe(sub, { childList: true, characterData: true, subtree: true });

  const st = document.createElement("style");
  st.textContent = `
    .acct-pop{position:fixed;z-index:9999;display:flex;flex-direction:column;padding:6px;background:#151515;border:1px solid #2a2a2a;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.6)}
    .acct-pop button{background:none;border:0;color:#ededed;text-align:left;padding:12px 14px;border-radius:10px;font:inherit;cursor:pointer;white-space:nowrap}
    .acct-pop button:hover{background:#222}
    .acct-pop button:focus-visible{outline:2px solid #e11d2e}
    .acct-nav{flex:none;background:none;border:0;color:inherit;font:inherit;cursor:pointer;white-space:nowrap;padding:8px 14px}
    .acct-fab{position:fixed;left:14px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9997;width:46px;height:46px;border-radius:50%;border:1px solid #e11d2e;background:#151515;color:#e11d2e;font:inherit;font-size:1.3rem;font-weight:700;cursor:pointer}
    .adm-fab{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9997;padding:12px 18px;border:0;border-radius:999px;background:#e11d2e;color:#fff;font:inherit;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(225,29,46,.35)}
    .adm-drawer{position:fixed;top:0;right:0;bottom:0;width:min(480px,100vw);z-index:9998;display:flex;flex-direction:column;background:#000;border-left:1px solid #2a2a2a;transform:translateX(100%);transition:transform .25s}
    .adm-drawer.open{transform:none}
    .adm-drawer header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #2a2a2a;color:#ededed;font-weight:700}
    .adm-drawer header button{background:none;border:1px solid #2a2a2a;color:#ededed;border-radius:10px;padding:6px 12px;font:inherit;cursor:pointer}
    .adm-drawer iframe{flex:1;border:0;width:100%;background:#000}
    /* Phones: Admin tools lives in the menu only, so hide the floating pill */
    @media (max-width:800px){.adm-fab{display:none}}
    @media (prefers-reduced-motion:reduce){.adm-drawer{transition:none}}
  `;
  document.head.appendChild(st);

  /* Account entry point: nav button if the page has a nav, otherwise a small floating button. */
  const nav = document.querySelector("nav");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.setAttribute("aria-label", "Account menu");
  trigger.setAttribute("aria-haspopup", "menu");
  if (nav) {
    trigger.className = "acct-nav";
    trigger.textContent = "Ø Account";
    nav.appendChild(trigger);
  } else {
    trigger.className = "acct-fab";
    trigger.textContent = "Ø";
    document.body.appendChild(trigger);
  }

  let pop = null, bypass = false, drawer = null, fab = null;

  function toggleTools(open) {
    if (!drawer) return;
    if (open && !drawer.querySelector("iframe")) {
      const f = document.createElement("iframe");
      f.src = "admin.html"; f.title = "Admin tools";
      drawer.appendChild(f);
    }
    drawer.classList.toggle("open", open);
    fab.hidden = open;
  }

  if (admin) {
    drawer = document.createElement("aside");
    drawer.className = "adm-drawer";
    drawer.setAttribute("aria-label", "Admin tools");
    drawer.innerHTML = '<header><span>Admin tools</span><button type="button">Close</button></header>';
    drawer.querySelector("button").onclick = () => toggleTools(false);
    fab = document.createElement("button");
    fab.type = "button"; fab.className = "adm-fab"; fab.textContent = "Admin tools";
    fab.onclick = () => toggleTools(true);
    document.body.append(drawer, fab);
  }

  const close = () => { if (pop) { pop.remove(); pop = null; } };

  const item = (text, fn) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = text; b.setAttribute("role", "menuitem");
    b.onclick = () => { close(); fn(); };
    return b;
  };

  function openMenu(anchor) {
    pop = document.createElement("div");
    pop.className = "acct-pop";
    pop.setAttribute("role", "menu");

    pop.append(item("Edit profile", () => { bypass = true; btn.click(); }));
    if (admin) {
      pop.append(
        item("Admin tools", () => toggleTools(true)),
        item("Sign out", async () => { await sb.auth.signOut(); location.reload(); })
      );
    } else {
      pop.append(item("Admin sign in", () => { location.href = "login.html"; }));
    }
    document.body.appendChild(pop);

    /* Position after it is in the DOM so we can measure it. */
    const r = anchor.getBoundingClientRect();
    const w = Math.max(r.width, 200);
    pop.style.minWidth = w + "px";
    const pw = pop.offsetWidth;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pw - 8)) + "px";
    if (r.top < innerHeight / 2) pop.style.top = (r.bottom + 8) + "px";   // anchor near top: open downward
    else pop.style.bottom = (innerHeight - r.top + 8) + "px";             // anchor near bottom: open upward
    pop.querySelector("button").focus();
  }

  document.addEventListener("click", (e) => {
    const hit = e.target.closest && e.target.closest("#me, .acct-nav, .acct-fab");
    if (hit) {
      if (bypass) { bypass = false; return; }   // let the real #me click through for "Edit profile"
      e.stopImmediatePropagation();
      e.preventDefault();
      if (pop) { close(); return; }
      openMenu(hit);
    } else if (pop && !pop.contains(e.target)) {
      close();
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { close(); toggleTools(false); }
  });
})();
