/* ==========================================================
   BLUEPRINT — behaviour layer
   Degrades to a readable page if any of this fails.
   ========================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var D = window.DATA || {};
  root.classList.add("js-on");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var fmt = function (n) { return n.toLocaleString("en-US"); };

  /* ---------- 1. THEME ---------- */
  var themeBtn = $("#theme"), themeIcon = $("#themeIcon");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "light" ? "#e9e9ec" : "#0e0e11");
    if (themeIcon) themeIcon.innerHTML = '<use href="' + (t === "light" ? "#i-moon" : "#i-sun") + '"/>';
    if (themeBtn) themeBtn.setAttribute("aria-pressed", t === "light" ? "true" : "false");
    window.dispatchEvent(new CustomEvent("themechange"));
  }
  var saved = null;
  try { saved = localStorage.getItem("bp-theme"); } catch (e) {}
  setTheme(saved === "light" || saved === "dark" ? saved : "dark");
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem("bp-theme", next); } catch (e) {}
  }
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  /* ---------- 2. CLOCK ---------- */
  var clock = $("#clock");
  if (clock) {
    var tick = function () {
      clock.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata", hour12: false,
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
    };
    tick(); setInterval(tick, 1000);
  }
  var yr = $("#year"); if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- 3. CONTRIBUTION HEATMAP ---------- */
  (function () {
    var hm = D.heatmap, grid = $("#hmGrid"), months = $("#hmMonths");
    if (!hm || !grid) return;
    var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var t = hm.thresholds, start = new Date(hm.start + "T00:00:00Z");
    var gf = document.createDocumentFragment(), mf = document.createDocumentFragment();
    var lastMonth = -1;

    hm.cols.forEach(function (col, ci) {
      var colDate = new Date(start.getTime() + ci * 7 * 864e5);
      var m = colDate.getUTCMonth();
      var label = document.createElement("span");
      // One label per month, placed on the column where that month starts.
      if (m !== lastMonth && colDate.getUTCDate() <= 7) { label.textContent = MON[m]; lastMonth = m; }
      mf.appendChild(label);

      col.forEach(function (v, ri) {
        var cell = document.createElement("i");
        if (v === null) { cell.className = "pad"; gf.appendChild(cell); return; }
        var lvl = v === 0 ? 0 : v <= t[0] ? 1 : v <= t[1] ? 2 : v <= t[2] ? 3 : 4;
        if (lvl) cell.className = "l" + lvl;
        var d = new Date(colDate.getTime() + ri * 864e5);
        cell.title = v + (v === 1 ? " contribution" : " contributions") + " on " + d.toISOString().slice(0, 10);
        gf.appendChild(cell);
      });
    });
    grid.appendChild(gf);
    months.appendChild(mf);
    months.style.gridTemplateColumns = "repeat(" + hm.cols.length + ", 1fr)";
    grid.style.gridTemplateColumns = "repeat(" + hm.cols.length + ", 1fr)";
    var tot = $("#hmTotal"); if (tot) tot.textContent = fmt(hm.total);
  })();

  /* ---------- 4. REVEAL (fails visible) ---------- */
  (function () {
    var items = [].slice.call(document.querySelectorAll("[data-r]"));
    if (!items.length) return;
    var showAll = function () { items.forEach(function (n) { n.classList.add("show"); }); };
    if (!("IntersectionObserver" in window)) return showAll();
    var io = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.02 });
    items.forEach(function (n) { io.observe(n); });
    setTimeout(showAll, 2500);   // nothing stays hidden if the observer never fires
  })();

  /* ---------- 5. NAV ACTIVE ---------- */
  (function () {
    var links = [].slice.call(document.querySelectorAll(".nav__links a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
    var vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, r = 0;
      secs.forEach(function (s) { if ((vis[s.id] || 0) > r) { r = vis[s.id]; best = s; } });
      links.forEach(function (a) {
        a.setAttribute("aria-current", best && a.getAttribute("href") === "#" + best.id ? "true" : "false");
      });
    }, { threshold: [0, .15, .4, .7], rootMargin: "-62px 0px -45% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- 6. COMMAND PALETTE ---------- */
  (function () {
    var pal = $("#pal"), input = $("#palIn"), list = $("#palList"), hint = $("#kbdHint");
    if (!pal || !input || !list || !D.commands) return;
    var items = D.commands, filtered = items, sel = 0;

    function render() {
      list.innerHTML = "";
      if (!filtered.length) {
        list.innerHTML = '<li class="pal__empty" role="presentation">Nothing matches that.</li>';
        return;
      }
      filtered.forEach(function (it, i) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", i === sel ? "true" : "false");
        li.innerHTML = '<span>' + it[0] + '</span><span class="mono">' + it[2] + '</span>';
        li.addEventListener("mouseenter", function () { sel = i; render(); });
        li.addEventListener("click", function () { run(it); });
        list.appendChild(li);
      });
    }
    function run(it) {
      close();
      if (it[2] === "action" && it[1] === "theme") return toggleTheme();
      if (it[1].charAt(0) === "#") {
        var t = document.querySelector(it[1]);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.open(it[1], it[1].slice(0, 7) === "mailto:" ? "_self" : "_blank", "noopener");
    }
    function open() {
      pal.hidden = false; input.value = ""; filtered = items; sel = 0; render();
      input.focus();
    }
    function close() { pal.hidden = true; }

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      filtered = q ? items.filter(function (it) { return (it[0] + " " + it[2]).toLowerCase().indexOf(q) > -1; }) : items;
      sel = 0; render();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) run(filtered[sel]); }
      else if (e.key === "Escape") close();
    });
    pal.addEventListener("click", function (e) { if (e.target === pal) close(); });
    if (hint) hint.addEventListener("click", open);

    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); pal.hidden ? open() : close(); }
      else if (!typing && (e.key === "/" || e.key === "?")) { e.preventDefault(); open(); }
      else if (e.key === "Escape" && !pal.hidden) close();
    });
  })();

  /* ---------- CURSOR TARGETS ----------
     TargetCursor locks onto .cursor-target, so the interactive elements are
     tagged here rather than littering the markup with the class. */
  (function () {
    var TARGETS = [
      [".nav__mark", "Top"], [".nav__links a", "Jump"], [".nav__theme", "Theme"],
      [".pill-btn", "Open"], [".icon-btn", "Open"], [".inline-link", "Open"],
      [".wcard", "View"], [".wcard__links a", "Open"],
      [".exp__go", "Open"], [".merge", "Pull request"], [".repo", "Repo"],
      [".post", "Read"], [".hm__foot a", "GitHub"], [".kbd-hint", "Search"],
      [".feat__name", "Repo"], [".foot button", "Top"]
    ];
    TARGETS.forEach(function (pair) {
      [].slice.call(document.querySelectorAll(pair[0])).forEach(function (el) {
        el.classList.add("cursor-target");
        if (!el.hasAttribute("data-cursor-label")) el.setAttribute("data-cursor-label", pair[1]);
      });
    });
  })();

  /* ---------- 7. BACK TO TOP ---------- */
  var top = $("#toTop");
  if (top) top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
