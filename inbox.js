/* Inbox page: shows announcements posted from the admin tools (Supabase)
   together with anything still listed in announcements.json.
   Load AFTER supabase-config.js. */
(async function () {
  var $ = function (id) { return document.getElementById(id); };
  var newsEl = $("news"), chEl = $("challenge");
  if (!newsEl) return;

  var TABLE = "announcements";   // the Supabase table the admin tools post to

  function esc(s) { var e = document.createElement("div"); e.textContent = s == null ? "" : String(s); return e.innerHTML; }
  function when(d) {
    if (!d) return null;
    var dt = new Date(String(d).indexOf("T") > -1 ? d : d + "T12:00:00");
    return isNaN(dt) ? null : dt;
  }

  var items = [];

  /* 1) the static file (still supported) */
  try {
    var r = await fetch("announcements.json", { cache: "no-store" });
    if (r.ok) {
      var j = await r.json();
      if (j.challenge && chEl) chEl.textContent = j.challenge;
      (j.news || []).forEach(function (n) {
        if (typeof n === "string") items.push({ body: n });
        else items.push({ title: n.title || "", body: n.text || "", date: n.date, link: n.link });
      });
    }
  } catch (e) {}

  /* 2) announcements posted from the admin tools */
  if (typeof sb !== "undefined") {
    try {
      var res = await sb.from(TABLE).select("*").order("created_at", { ascending: false }).limit(50);
      if (res.error) res = await sb.from(TABLE).select("*").limit(50);
      if (!res.error && res.data) {
        res.data.forEach(function (row) {
          var body = row.body || row.message || row.content || row.text || "";
          var title = row.title || "";
          if (!title && !body) return;
          items.push({ title: title, body: body, date: row.created_at || row.date || row.inserted_at, link: row.link || row.url });
        });
      }
    } catch (e) {}
  }

  if (!items.length) { newsEl.textContent = "Nothing new yet."; return; }

  items.sort(function (a, b) {
    var x = when(a.date), y = when(b.date);
    return (y ? y.getTime() : 0) - (x ? x.getTime() : 0);
  });

  newsEl.className = "";
  newsEl.innerHTML = items.map(function (n) {
    var dt = when(n.date);
    var ds = dt ? dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";
    var ok = n.link && String(n.link).indexOf("https://") === 0;
    var head = n.title ? '<div class="nt"><b>' + esc(n.title) + '</b></div>' : "";
    var body = n.body ? '<div class="' + (n.title ? "muted" : "nt") + '">' + esc(n.body) + '</div>' : "";
    var meta = (ds || ok) ? '<span class="muted">' + esc(ds) + (ok ? (ds ? " · " : "") + '<a href="' + esc(n.link) + '" rel="noopener">Open link</a>' : "") + '</span>' : "";
    return '<div class="upitem">' + head + body + meta + '</div>';
  }).join("");
})();
