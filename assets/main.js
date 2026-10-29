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

  /* ---------- 4. TYPE-SPEC OVERLAY ----------
     Guide positions are measured from the rendered font, not guessed:
     a zero-width inline probe gives the exact baseline, and canvas
     TextMetrics gives cap height, x-height and descender depth. */
  (function () {
    var wrap = $("#namewrap"), name = $("#name"), spec = $("#spec"), glyph = $("#glyph");
    if (!wrap || !name || !spec || !glyph) return;

    function metrics() {
      var probe = document.createElement("span");
      probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      name.appendChild(probe);
      var baseline = probe.getBoundingClientRect().top;
      name.removeChild(probe);

      var cs = getComputedStyle(name);
      var font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      var c = document.createElement("canvas").getContext("2d");
      c.font = font;
      var cap = 0, xh = 0, desc = 0;
      try {
        cap = c.measureText("H").actualBoundingBoxAscent;
        xh = c.measureText("x").actualBoundingBoxAscent;
        desc = c.measureText("g").actualBoundingBoxDescent;
      } catch (e) {}
      var fs = parseFloat(cs.fontSize);
      if (!cap) { cap = fs * 0.70; xh = fs * 0.50; desc = fs * 0.22; }
      return { baseline: baseline, cap: cap, xh: xh, desc: desc };
    }

    function draw() {
      spec.innerHTML = "";
      if (window.innerWidth < 860) return;
      var wr = wrap.getBoundingClientRect();
      var m = metrics();
      var baseY = m.baseline - wr.top;
      var right = wr.width + 10;
      var room = window.innerWidth - wr.right - 24;
      var showLabels = room > 112;

      [["cap height", baseY - m.cap], ["x-height", baseY - m.xh],
       ["baseline", baseY], ["descender", baseY + m.desc]].forEach(function (g) {
        var line = document.createElement("div");
        line.className = "spec__line";
        line.style.top = g[1] + "px";
        line.style.width = (right + 10) + "px";
        spec.appendChild(line);
        if (!showLabels) return;
        var lab = document.createElement("span");
        lab.className = "spec__label";
        lab.textContent = g[0];
        lab.style.top = g[1] + "px";
        lab.style.left = (right + 22) + "px";
        spec.appendChild(lab);
      });

      // selection box around the final glyph
      var gr = glyph.getBoundingClientRect();
      var pad = 3;
      var sel = document.createElement("div");
      sel.className = "spec__sel";
      sel.style.left = (gr.left - wr.left - pad) + "px";
      sel.style.top = (baseY - m.cap - pad) + "px";
      sel.style.width = (gr.width + pad * 2) + "px";
      sel.style.height = (m.cap + pad * 2) + "px";
      for (var i = 0; i < 8; i++) sel.appendChild(document.createElement("i"));
      spec.appendChild(sel);

      var dim = document.createElement("span");
      dim.className = "spec__dim";
      dim.innerHTML = "h &nbsp;" + Math.round(gr.width) + " <b>&times;</b> " + Math.round(m.cap);
      dim.style.left = (gr.left - wr.left - pad) + "px";
      dim.style.top = (baseY - m.cap - pad - 20) + "px";
      spec.appendChild(dim);
    }

    var raf;
    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("themechange", schedule);
  })();

  /* ---------- 5. REVEAL (fails visible) ---------- */
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

  /* ---------- 6. NAV ACTIVE ---------- */
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

  /* ---------- 7. STACK PILE (Matter.js physics, DOM-rendered) ---------- */
  (function () {
    var box = $("#stackbox"), fb = $("#stackFallback");
    if (!box || !fb || !D.stack) return;

    // Build the pills as real DOM so they keep the page's type and theming.
    var pills = D.stack.map(function (s) {
      var el = document.createElement("span");
      el.textContent = s[0];
      el.style.cssText =
        "position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:8px;" +
        "font-family:var(--sans);font-size:15px;font-weight:500;white-space:nowrap;" +
        "padding:9px 16px;border-radius:999px;will-change:transform;" +
        "background:" + s[1] + ";color:" + s[2] + ";" +
        // keeps near-black pills (Next.js, Vercel, Expo) legible on a near-black page
        "box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);";
      return el;
    });

    function fallback() {
      fb.innerHTML = "";
      D.stack.forEach(function (s) {
        var el = document.createElement("span");
        el.textContent = s[0];
        fb.appendChild(el);
      });
    }

    function start() {
      var M = window.Matter;
      if (!M) return fallback();
      var W = box.clientWidth, H = box.clientHeight;
      if (!W || !H) return fallback();

      fb.remove();
      var layer = document.createElement("div");
      layer.style.cssText = "position:absolute;inset:0;overflow:hidden";
      layer.setAttribute("aria-hidden", "true");
      box.appendChild(layer);
      pills.forEach(function (p) { layer.appendChild(p); });

      var engine = M.Engine.create();
      engine.gravity.y = 1;
      var world = engine.world;
      var wallOpts = { isStatic: true, restitution: .2, render: { visible: false } };
      var walls = [
        M.Bodies.rectangle(W / 2, H + 40, W * 2, 80, wallOpts),
        M.Bodies.rectangle(-40, H / 2, 80, H * 4, wallOpts),
        M.Bodies.rectangle(W + 40, H / 2, 80, H * 4, wallOpts)
      ];
      M.Composite.add(world, walls);

      var bodies = pills.map(function (p, i) {
        var w = p.offsetWidth, h = p.offsetHeight;
        var b = M.Bodies.rectangle(
          40 + Math.random() * Math.max(1, W - 80),
          -60 - Math.random() * 900,
          w, h,
          { chamfer: { radius: h / 2 }, restitution: .32, friction: .42, frictionAir: .012, density: .0012 }
        );
        b.plugin = { w: w, h: h, el: p };
        return b;
      });
      M.Composite.add(world, bodies);

      var mouse = M.Mouse.create(box);
      var mc = M.MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: .18, render: { visible: false } } });
      M.Composite.add(world, mc);
      // Let the page keep scrolling over the canvas area.
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

      var runner = M.Runner.create();
      M.Runner.run(runner, engine);

      (function paint() {
        bodies.forEach(function (b) {
          var p = b.plugin;
          p.el.style.transform =
            "translate(" + (b.position.x - p.w / 2) + "px," + (b.position.y - p.h / 2) + "px) rotate(" + b.angle + "rad)";
        });
        requestAnimationFrame(paint);
      })();

      function drop() {
        bodies.forEach(function (b) {
          M.Body.setPosition(b, { x: 40 + Math.random() * Math.max(1, box.clientWidth - 80), y: -60 - Math.random() * 900 });
          M.Body.setVelocity(b, { x: 0, y: 0 });
          M.Body.setAngularVelocity(b, 0);
          M.Body.setAngle(b, (Math.random() - .5) * .6);
        });
      }
      var rst = $("#stackReset"); if (rst) rst.addEventListener("click", drop);

      var rt;
      window.addEventListener("resize", function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          var nW = box.clientWidth, nH = box.clientHeight;
          M.Body.setPosition(walls[0], { x: nW / 2, y: nH + 40 });
          M.Body.setPosition(walls[2], { x: nW + 40, y: nH / 2 });
        }, 180);
      });
    }

    // Only run the pile once it is on screen, and only if Matter actually loaded.
    fallback();
    var began = false;
    function begin() {
      if (began) return; began = true;
      // The CDN script is deferred; wait a tick for it if needed.
      if (window.Matter) start();
      else setTimeout(function () { window.Matter ? start() : null; }, 900);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es, o) {
        es.forEach(function (e) { if (e.isIntersecting) { o.disconnect(); begin(); } });
      }, { rootMargin: "120px" });
      io.observe(box);
    } else { begin(); }
  })();

  /* ---------- 8. COMMAND PALETTE ---------- */
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

  /* ---------- 9. BACK TO TOP ---------- */
  var top = $("#toTop");
  if (top) top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
