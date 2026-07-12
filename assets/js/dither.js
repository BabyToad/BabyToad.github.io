/* dither.js — shared Bayer-dither kit for "Print by day, CRT by night".
   Plain script (no modules); exposes window.Dither.
   Ported from the style-guide mockup (docs/redesign-plan.md, Phase 3). */
(function () {
  'use strict';

  // 8x8 ordered Bayer matrix, normalized to (0,1) thresholds.
  const BAYER = [
    [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]
  ].map(row => row.map(v => (v + 0.5) / 64));

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const Dither = {
    BAYER,

    // Deterministic LCG PRNG. Returns a function yielding floats in [0,1).
    lcg(seed) {
      return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    },

    // Resolve the active theme's dither colors from live CSS custom properties.
    // dark: phosphor lights the bright (fg=--accent on bg=--bg-dip).
    // light: ink the dark, positive print (fg=--ink on bg=--bg).
    palette() {
      const cs = getComputedStyle(document.documentElement);
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const get = n => cs.getPropertyValue(n).trim();
      return {
        dark,
        fg: dark ? get('--accent') : get('--ink'),
        bg: dark ? get('--bg-dip') : get('--bg'),
        dim: get('--ink-faint')
      };
    },

    // Draw a source (image or canvas) at cell resolution, threshold each low-res
    // pixel against the Bayer matrix, and paint fg blocks on a bg field.
    // Light mode inverts luminance so ink lands on the dark (positive print).
    ditherCanvas(cv, source, opts) {
      opts = opts || {};
      const cell = Math.max(1, opts.cell || 1);
      const pal = this.palette();
      const invert = opts.invert !== undefined ? opts.invert : !pal.dark;
      const W = cv.width, H = cv.height;
      const lw = Math.max(1, Math.ceil(W / cell));
      const lh = Math.max(1, Math.ceil(H / cell));

      const off = document.createElement('canvas');
      off.width = lw; off.height = lh;
      const octx = off.getContext('2d', { willReadFrequently: true });
      this._drawCover(octx, source, lw, lh);
      const px = octx.getImageData(0, 0, lw, lh).data;

      const ctx = cv.getContext('2d');
      ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = pal.fg;
      for (let y = 0; y < lh; y++) {
        for (let x = 0; x < lw; x++) {
          const i = (y * lw + x) * 4;
          const a = px[i + 3] / 255;
          let lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          if (invert) lum = 1 - lum;
          lum *= a; // transparent source stays bg in either mode
          if (lum > BAYER[y % 8][x % 8]) ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    },

    // Progressive develop: coarse -> fine cells over time.
    // opts.final: if truthy, the LAST step draws the true full-color image
    //   (final === true uses `source`; otherwise final is the image to draw).
    // opts.onDone: called after the final frame. Honors reduced-motion (jumps
    //   straight to the final frame). Cancelable per-canvas via clearTimeout.
    develop(cv, source, opts) {
      opts = opts || {};
      const steps = opts.steps || [16, 8, 4, 2, 1];
      const interval = opts.interval || 200;
      const final = opts.final;
      const onDone = opts.onDone;

      clearTimeout(cv._ditherTimer);

      const drawFinal = () => {
        if (final) {
          const img = final === true ? source : final;
          const ctx = cv.getContext('2d');
          ctx.clearRect(0, 0, cv.width, cv.height);
          this._drawCover(ctx, img, cv.width, cv.height);
        } else {
          this.ditherCanvas(cv, source, { cell: steps[steps.length - 1] });
        }
      };

      if (reduced()) {
        drawFinal();
        if (onDone) onDone();
        return;
      }

      let i = 0;
      const step = () => {
        const last = i === steps.length - 1;
        if (last) drawFinal();
        else this.ditherCanvas(cv, source, { cell: steps[i] });
        i++;
        if (i < steps.length) cv._ditherTimer = setTimeout(step, interval);
        else if (onDone) onDone();
      };
      step();
    },

    // Bayer-gradient divider strip. dir: 'lr' | 'rl' | 'center'.
    rule(cv, dir) {
      dir = dir || cv.dataset.dir || 'lr';
      const pal = this.palette();
      const ctx = cv.getContext('2d');
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = pal.fg;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          let l = x / W;
          if (dir === 'rl') l = 1 - l;
          else if (dir === 'center') l = 1 - Math.abs(x - W / 2) / (W / 2);
          if (l > BAYER[y % 8][x % 8]) ctx.fillRect(x, y, 1, 1);
        }
      }
    },

    // Run fn whenever documentElement's data-theme attribute changes.
    onThemeChange(fn) {
      const obs = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.attributeName === 'data-theme') { fn(); break; }
        }
      });
      obs.observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-theme']
      });
      return obs;
    },

    // Draw src into a dw x dh box with object-fit: cover semantics.
    _drawCover(ctx, src, dw, dh) {
      const sw = src.naturalWidth || src.width;
      const sh = src.naturalHeight || src.height;
      if (!sw || !sh) { ctx.drawImage(src, 0, 0, dw, dh); return; }
      const scale = Math.max(dw / sw, dh / sh);
      const w = sw * scale, h = sh * scale;
      ctx.drawImage(src, (dw - w) / 2, (dh - h) / 2, w, h);
    }
  };

  window.Dither = Dither;
})();
