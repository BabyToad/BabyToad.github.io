/* ============================================================
   gallery.js — the footer gallery: registry, render, rotate.

   A piece is a small JS file that calls Gallery.register({...}).
   Each piece is a pure, deterministic function of (ctx, w, h, pal, kit):
   seeded LCG only, never Date/Math.random, so it prints identically on
   every visit and reads in both palettes (ink-on-paper by day, amber
   phosphor by night).

   Contract with assets/js/dither.js (window.Dither), if present:
     Dither.BAYER          8x8 array, normalised thresholds 0..1
     Dither.lcg(seed)      -> () => float 0..1
     Dither.palette()      -> { dark, fg, bg, dim }
     Dither.onThemeChange(fn)
   gallery.js is also self-sufficient: if window.Dither is absent it uses
   an internal fallback so load order can never break the footer.
   ============================================================ */
(function () {
  "use strict";

  /* ---- fallback dither primitives (used only if window.Dither absent) ---- */
  var FALLBACK_BAYER = [
    [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]
  ].map(function (r) { return r.map(function (v) { return (v + 0.5) / 64; }); });

  function fallbackLcg(seed) {
    seed = seed >>> 0;
    return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  }

  function fallbackPalette() {
    var el = document.documentElement;
    var cs = getComputedStyle(el);
    var dark = (el.dataset.theme || "dark") === "dark";
    function v(name) { return cs.getPropertyValue(name).trim(); }
    // Prefer the redesign tokens; fall back to the legacy token set so the
    // footer still renders during the token migration.
    var fg = dark
      ? (v("--accent") || "#ffb000")
      : (v("--ink") || v("--text-primary") || "#221c14");
    var bg = dark
      ? (v("--bg-dip") || v("--bg-primary") || "#0e0c0a")
      : (v("--bg") || v("--bg-primary") || "#f6f1e7");
    var dim = v("--ink-faint") || v("--text-tertiary") || (dark ? "#6f675a" : "#94886f");
    return { dark: dark, fg: fg, bg: bg, dim: dim };
  }

  var themeChangeListeners = [];
  function fallbackOnThemeChange(fn) {
    themeChangeListeners.push(fn);
    if (fallbackOnThemeChange._wired) return;
    fallbackOnThemeChange._wired = true;
    new MutationObserver(function () {
      themeChangeListeners.forEach(function (f) { try { f(); } catch (e) { /* keep others alive */ } });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  function D() { return window.Dither || null; }
  function BAYER() { var d = D(); return (d && d.BAYER) || FALLBACK_BAYER; }
  function lcg(seed) { var d = D(); return (d && d.lcg) ? d.lcg(seed) : fallbackLcg(seed); }
  function palette() { var d = D(); return (d && d.palette) ? d.palette() : fallbackPalette(); }
  function onThemeChange(fn) { var d = D(); if (d && d.onThemeChange) d.onThemeChange(fn); else fallbackOnThemeChange(fn); }

  /* ============================================================
     kit — the shared drawing vocabulary handed to every piece.
     Fills are integer-pixel dither (crisp in both themes); thin
     structures use ctx strokes. Everything is fg-on-bg two-tone.
     ============================================================ */
  function makeKit() {
    var B = BAYER();

    function bayer(x, y) { return B[((y | 0) % 8 + 8) % 8][((x | 0) % 8 + 8) % 8]; }

    function plot(ctx, x, y) { ctx.fillRect(x | 0, y | 0, 1, 1); }

    // Dither a rectangle at a coverage density (0..1). density may be a
    // number or a function (px,py) -> 0..1.
    function ditherRect(ctx, x, y, w, h, density) {
      var fn = (typeof density === "function") ? density : function () { return density; };
      var x0 = x | 0, y0 = y | 0, x1 = (x + w) | 0, y1 = (y + h) | 0, px, py, d;
      for (py = y0; py < y1; py++) {
        for (px = x0; px < x1; px++) {
          d = fn(px, py);
          if (d > 0 && d > bayer(px, py)) ctx.fillRect(px, py, 1, 1);
        }
      }
    }

    // Vertical density gradient over a band (topD at y, botD at y+h).
    function vGradient(ctx, x, y, w, h, topD, botD) {
      ditherRect(ctx, x, y, w, h, function (px, py) {
        var t = (py - y) / (h || 1);
        return topD + (botD - topD) * t;
      });
    }

    // Filled disc with a centre-bright radial falloff scaled by intensity.
    function ditherDisc(ctx, cx, cy, r, intensity) {
      intensity = (intensity == null) ? 1 : intensity;
      var x, y, d;
      for (y = -r; y <= r; y++) {
        for (x = -r; x <= r; x++) {
          d = Math.sqrt(x * x + y * y);
          if (d > r) continue;
          var dens = intensity * (1 - d / r);
          if (dens > bayer(cx + x, cy + y)) ctx.fillRect((cx + x) | 0, (cy + y) | 0, 1, 1);
        }
      }
    }

    function solidDisc(ctx, cx, cy, r) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }

    // Dithered annulus (rIn..rOut) at constant coverage density.
    function ditherRing(ctx, cx, cy, rOut, rIn, density) {
      density = (density == null) ? 1 : density;
      var x, y, d;
      for (y = -rOut; y <= rOut; y++) {
        for (x = -rOut; x <= rOut; x++) {
          d = Math.sqrt(x * x + y * y);
          if (d > rOut || d < rIn) continue;
          if (density > bayer(cx + x, cy + y)) ctx.fillRect((cx + x) | 0, (cy + y) | 0, 1, 1);
        }
      }
    }

    // Constant-density horizontal strip.
    function ditherStrip(ctx, x, y, w, h, density) { ditherRect(ctx, x, y, w, h, density); }

    // Sparse star field. Deterministic; fg dots, a few brighter 2px ones.
    function stars(ctx, w, maxY, seed, count) {
      var rnd = lcg(seed), i, x, yy, bright;
      for (i = 0; i < count; i++) {
        x = rnd() * w; yy = rnd() * maxY; bright = rnd();
        if (bright > 0.86) ctx.fillRect(x | 0, yy | 0, 2, 2);
        else if (bright > 0.4) ctx.fillRect(x | 0, yy | 0, 1, 1);
        else if (bayer(x, yy) < 0.5) ctx.fillRect(x | 0, yy | 0, 1, 1);
      }
    }

    function fillPoly(ctx, pts) {
      if (!pts.length) return;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); ctx.fill();
    }

    function strokePoly(ctx, pts, close) {
      if (!pts.length) return;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (close) ctx.closePath();
      ctx.stroke();
    }

    function line(ctx, x1, y1, x2, y2) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    // A jagged horizon ridge filled solid below yBase (amp px of relief).
    function ridge(ctx, w, yBase, amp, seed, step) {
      step = step || w / 24;
      var rnd = lcg(seed), x;
      ctx.beginPath(); ctx.moveTo(0, yBase + amp);
      ctx.lineTo(0, yBase);
      for (x = 0; x <= w; x += step) ctx.lineTo(x, yBase - rnd() * amp);
      ctx.lineTo(w, yBase); ctx.lineTo(w, yBase + amp);
      ctx.closePath(); ctx.fill();
    }

    return {
      bayer: bayer, lcg: lcg, plot: plot,
      ditherRect: ditherRect, vGradient: vGradient,
      ditherDisc: ditherDisc, solidDisc: solidDisc,
      ditherRing: ditherRing, ditherStrip: ditherStrip,
      stars: stars, fillPoly: fillPoly, strokePoly: strokePoly,
      line: line, ridge: ridge
    };
  }

  /* ============================================================
     Registry + rendering
     ============================================================ */
  var pieces = [];
  var kit = null;

  function reduced() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function prep(ctx, w, h, pal) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = pal.fg;
    ctx.strokeStyle = pal.fg;
  }

  function renderFrame(piece, ctx, w, h, pal, progress) {
    prep(ctx, w, h, pal);
    if (progress >= 1) {
      piece.draw(ctx, w, h, pal, kit);
    } else if (typeof piece.drawProgress === "function") {
      piece.drawProgress(ctx, w, h, pal, kit, progress);
    } else {
      piece.draw(ctx, w, h, pal, kit);
    }
  }

  // Render a piece into a canvas. animate => staged assembly (~1s) if the
  // piece supports drawProgress and reduced-motion is off.
  function renderInto(canvas, piece, animate) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    var pal = palette();
    var staged = animate && !reduced() && typeof piece.drawProgress === "function";
    // Each render bumps a generation token; an in-flight animation whose token
    // is stale bails on its next frame. Overlapping renders on one canvas
    // (rapid clicks, a theme change mid-assembly) can never fight each other.
    var gen = (canvas._gen = (canvas._gen || 0) + 1);
    if (canvas._raf) cancelAnimationFrame(canvas._raf);
    stopBreathing(canvas);
    if (!staged) {
      renderFrame(piece, ctx, w, h, pal, 1);
      canvas._done = true;
      if (canvas._onDone) canvas._onDone();
      return;
    }
    var t0 = performance.now();
    (function frame(now) {
      if (canvas._gen !== gen) return;
      // rAF's frame timestamp can precede the t0 we captured with
      // performance.now(), so clamp low as well as high — pieces must never
      // see progress outside [0,1].
      var p = Math.max(0, Math.min(1, (now - t0) / 1000));
      renderFrame(piece, ctx, w, h, pal, p);
      if (p < 1) canvas._raf = requestAnimationFrame(frame);
      else { canvas._done = true; if (canvas._onDone) canvas._onDone(); }
    })(t0);
  }

  /* ---- breathe: the life cycle of the footer piece ----
     assemble → land (a still beat) → breathe (a few seconds of faint
     phosphor sparkle: single dither pixels blinking off) → long stillness →
     breathe again. Runs only while the canvas is on screen, never under
     prefers-reduced-motion, and any re-render (click, theme) resets it. */
  var BREATHE = { land: 1800, inhale: 5200, hold: 9000, tick: 120, sparks: 12 };

  function rgbOf(color) {
    var c = document.createElement("canvas");
    c.width = c.height = 1;
    var x = c.getContext("2d");
    x.fillStyle = color;
    x.fillRect(0, 0, 1, 1);
    var d = x.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }

  function startBreathing(canvas) {
    if (reduced() || !canvas._done || canvas._breathing) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    var pal = palette();
    var base = ctx.getImageData(0, 0, w, h);
    var f = rgbOf(pal.fg), d = base.data, lit = [];
    for (var i = 0; i < d.length; i += 4) {
      if (Math.abs(d[i] - f[0]) < 12 && Math.abs(d[i + 1] - f[1]) < 12 && Math.abs(d[i + 2] - f[2]) < 12) {
        lit.push(i / 4);
      }
    }
    if (lit.length < 80) return;
    var gen = canvas._gen;
    var phase = "land", phaseStart = null, nextTick = 0, seed = 387;
    canvas._breathing = true;
    (function loop(now) {
      if (canvas._gen !== gen || !canvas._breathing) return;
      if (phaseStart === null) phaseStart = now;
      var el = now - phaseStart;
      if (phase === "land" && el >= BREATHE.land) { phase = "inhale"; phaseStart = now; nextTick = 0; }
      else if (phase === "inhale") {
        if (el >= BREATHE.inhale) {
          ctx.putImageData(base, 0, 0);
          phase = "hold"; phaseStart = now;
        } else if (now >= nextTick) {
          nextTick = now + BREATHE.tick;
          ctx.putImageData(base, 0, 0);
          var rnd = lcg((seed = (seed * 69069 + 1) >>> 0));
          ctx.fillStyle = pal.bg;
          for (var k = 0; k < BREATHE.sparks; k++) {
            var p = lit[Math.floor(rnd() * lit.length)];
            ctx.fillRect(p % w, Math.floor(p / w), 2, 1);
          }
        }
      }
      else if (phase === "hold" && el >= BREATHE.hold) { phase = "inhale"; phaseStart = now; nextTick = 0; }
      canvas._braf = requestAnimationFrame(loop);
    })(performance.now());
  }

  function stopBreathing(canvas) {
    canvas._breathing = false;
    if (canvas._braf) { cancelAnimationFrame(canvas._braf); canvas._braf = null; }
  }

  function pieceOfDay() {
    if (!pieces.length) return null;
    var now = new Date();
    var start = Date.UTC(now.getUTCFullYear(), 0, 0);
    var day = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000);
    return pieces[((day % pieces.length) + pieces.length) % pieces.length];
  }

  function caption(el, piece) {
    if (!el) return;
    el.textContent = "";
    var strong = document.createElement("span");
    strong.className = "footer-piece-title";
    strong.textContent = piece.title;
    var meta = document.createElement("span");
    meta.className = "footer-piece-meta";
    meta.textContent = " — " + piece.model + ", " + piece.date;
    var sep = document.createTextNode("  ");
    var link = document.createElement("a");
    link.className = "footer-piece-link";
    link.href = "/footer/";
    link.textContent = "the gallery →";
    el.appendChild(strong);
    el.appendChild(meta);
    el.appendChild(sep);
    el.appendChild(link);
  }

  /* ---- footer mode: piece of the day, drawn on scroll-arrival;
     clicking flips through the whole collection ---- */
  function initFooter() {
    var canvas = document.getElementById("footer-piece");
    if (!canvas) return;
    var piece = pieceOfDay();
    if (!piece) return;
    var idx = pieces.indexOf(piece);
    var captionEl = document.getElementById("footer-piece-caption");
    var frame = document.getElementById("footer-piece-frame");
    if (frame) frame.hidden = false;
    caption(captionEl, piece);
    canvas.title = "click for the next piece";

    var drewOnce = false;
    var visible = false;
    canvas._onDone = function () { if (visible) startBreathing(canvas); };
    var obs = new IntersectionObserver(function (entries) {
      visible = entries.some(function (e) { return e.isIntersecting; });
      if (visible && !drewOnce) {
        renderInto(canvas, pieces[idx], true);
        drewOnce = true;
      } else if (visible && canvas._done) {
        startBreathing(canvas);
      } else if (!visible) {
        stopBreathing(canvas);
      }
    }, { threshold: 0.35 });
    obs.observe(canvas);

    canvas.addEventListener("click", function () {
      idx = (idx + 1) % pieces.length;
      caption(captionEl, pieces[idx]);
      canvas.setAttribute("aria-label", pieces[idx].title + " — a dithered piece by " + pieces[idx].model + ". Click for the next piece.");
      renderInto(canvas, pieces[idx], true);
      drewOnce = true;
    });
    onThemeChange(function () { if (drewOnce) renderInto(canvas, pieces[idx], false); });
  }

  /* ---- gallery-page mode: every piece rendered into a grid ---- */
  function initGallery() {
    var grid = document.getElementById("gallery-grid");
    if (!grid) return;
    grid.textContent = "";
    var canvases = [];

    pieces.forEach(function (piece) {
      var fig = document.createElement("figure");
      fig.className = "gallery-item";
      fig.id = "piece-" + piece.slug;

      var canvas = document.createElement("canvas");
      canvas.className = "gallery-canvas";
      canvas.width = 720; canvas.height = 220;
      canvas.title = "click to redraw";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", piece.title + " — a dithered piece by " + piece.model);
      fig.appendChild(canvas);

      var cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.innerHTML =
        '<h3 class="gallery-title">' + esc(piece.title) + "</h3>" +
        '<p class="gallery-meta">' + esc(piece.model) + " · " + esc(piece.date) + "</p>" +
        '<p class="gallery-statement">' + esc(piece.statement) + "</p>" +
        '<p class="gallery-subject"><span>subject</span> ' + esc(piece.subject) + "</p>";
      fig.appendChild(cap);
      grid.appendChild(fig);

      canvas.addEventListener("click", function () { renderInto(canvas, piece, true); });
      canvases.push({ canvas: canvas, piece: piece });
    });

    // Draw each on scroll-arrival (staged), once.
    var seen = new WeakSet();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || seen.has(e.target)) return;
        seen.add(e.target);
        var rec = canvases.find(function (c) { return c.canvas === e.target; });
        if (rec) renderInto(rec.canvas, rec.piece, true);
      });
    }, { threshold: 0.25 });
    canvases.forEach(function (c) { obs.observe(c.canvas); });

    onThemeChange(function () {
      canvases.forEach(function (c) { if (c.canvas._done) renderInto(c.canvas, c.piece, false); });
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function init() {
    kit = makeKit();
    initFooter();
    initGallery();
  }

  window.Gallery = {
    register: function (piece) { pieces.push(piece); return this; },
    pieces: pieces,
    render: renderInto,
    kit: function () { return kit || (kit = makeKit()); }
  };

  /* Deferred scripts run while readyState is "interactive", BEFORE the piece
     files later in defer order have registered. DOMContentLoaded fires after
     all deferred scripts, so wait for it; the extra hooks cover dynamic
     injection after DCL/load. */
  var booted = false;
  function boot() { if (booted) return; booted = true; init(); }
  window.addEventListener("DOMContentLoaded", boot);
  window.addEventListener("load", boot);
  if (document.readyState === "complete") boot();
})();
