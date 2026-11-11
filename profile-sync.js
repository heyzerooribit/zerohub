/* Syncs the profile editor (zero.js) to Supabase for signed-in accounts.
   Load AFTER zero.js, supabase-config.js and account.js.
   Guests (anonymous sessions) stay local to their browser. */
(async function () {
  if (typeof sb === "undefined") return;

  const KEY = "zero-profile";       // same key zero.js uses
  let user = null;
  try {
    const { data } = await sb.auth.getSession();
    user = data.session && data.session.user;
  } catch (e) {}
  if (!user || user.is_anonymous) return;

  const note = (t) => { const n = document.getElementById("psync"); if (n) n.textContent = t; };
  const localGet = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
  const localSet = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} };

  async function push(p) {
    const { error } = await sb.from("profiles").upsert({
      user_id: user.id,
      display_name: p.name || "ZERØ",
      status: p.status || "",
      avatar_color: String(p.color || 0),
      avatar_url: p.img || null,
      updated_at: new Date().toISOString()
    });
    return !error;
  }

  async function pull() {
    const { data, error } = await sb.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (error) return;
    if (data) {
      localSet({
        name: data.display_name || "ZERØ",
        status: data.status || "",
        color: parseInt(data.avatar_color, 10) || 0,
        img: data.avatar_url || ""
      });
      document.dispatchEvent(new Event("zero:profile-updated"));
    } else {
      // First sign-in with no saved profile yet: upload what this browser already has.
      const p = localGet();
      if (p) await push(p);
    }
  }

  document.addEventListener("zero:profile-saved", async (e) => {
    note("Saving…");
    const ok = await push(e.detail || localGet() || {});
    note(ok ? "Synced to your account." : "Saved here, but syncing failed. Try Save again.");
  });

  // Pick up changes made on another device when you come back to this tab.
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pull(); });

  note("Synced to your account.");
  pull();
})();
