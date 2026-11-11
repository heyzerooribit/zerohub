/* Turns the profile button in the sidebar into an account menu.
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
  st.textContent = ".acct-pop{position:fixed;z-index:9999;display:flex;flex-direction:column;padding:6px;background:#151515;border:1px solid #2a2a2a;border-radius:16px}.acct-pop button{background:none;border:0;color:#ededed;text-align:left;padding:11px 12px;border-radius:10px;font:inherit;cursor:pointer}.acct-pop button:hover{background:#222}.acct-pop button:focus-visible{outline:2px solid #e11d2e}";
  document.head.appendChild(st);

  let pop = null, bypass = false;
  const close = () => { if (pop) { pop.remove(); pop = null; } };
  const item = (text, fn) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = text; b.setAttribute("role", "menuitem");
    b.onclick = () => { close(); fn(); };
    return b;
  };

  document.addEventListener("click", (e) => {
    const onBtn = e.target.closest && e.target.closest("#me");
    if (onBtn) {
      if (bypass) { bypass = false; return; }
      e.stopImmediatePropagation(); e.preventDefault();
      if (pop) { close(); return; }
      pop = document.createElement("div");
      pop.className = "acct-pop"; pop.setAttribute("role", "menu");
      const r = btn.getBoundingClientRect();
      pop.style.left = r.left + "px";
      pop.style.minWidth = Math.max(r.width, 200) + "px";
      pop.style.bottom = (innerHeight - r.top + 8) + "px";
      pop.append(item("Edit profile", () => { bypass = true; btn.click(); }));
      if (admin) {
        pop.append(
          item("Admin page", () => { location.href = "admin.html"; }),
          item("Sign out", async () => { await sb.auth.signOut(); location.reload(); })
        );
      } else {
        pop.append(item("Admin sign in", () => { location.href = "login.html"; }));
      }
      document.body.appendChild(pop);
      pop.querySelector("button").focus();
    } else if (pop && !pop.contains(e.target)) close();
  }, true);

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();
