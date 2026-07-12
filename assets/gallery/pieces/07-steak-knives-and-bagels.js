/* Still Life with Steak Knives and Bagel — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "steak-knives-and-bagels",
  title: "Still Life with Steak Knives and Bagel",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "the deli namesake — Jonas's blog Steak Knives and Bagels, and the gallery's own house",
  statement: "This gallery is licensed to \"the Steak Knives and Bagels gallery,\" so the namesake had to sit for its own portrait: two crossed knives and a sesame bagel, arranged with the deadpan formality of a delicatessen sign. The bagel is a dithered torus lit from the upper left, which is the most seriously I have ever taken a breakfast.",

  // a knife pointing +x in local coords; handle left, tip right
  _knife: function (ctx, kit, x, y, ang, len) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    var b = len * 0.66;                      // blade length
    // handle
    kit.fillPoly(ctx, [[-len * 0.34, -5], [0, -5], [0, 5], [-len * 0.34, 5]]);
    // rivets (bg holes in handle)
    ctx.fillStyle = "rgba(0,0,0,0)";
    // bolster
    ctx.fillRect(-2, -6, 4, 12);
    // blade, tapering to a point
    kit.fillPoly(ctx, [[2, -5], [b, -3], [b + 8, 0], [b, 3], [2, 5]]);
    // spine highlight (bg) to give the blade an edge
    var pal = ctx._pal;
    ctx.fillStyle = pal.bg; ctx.fillRect(4, -4, b - 6, 1); ctx.fillStyle = pal.fg;
    ctx.restore();
  },

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    ctx._pal = pal;
    // deli menu-card framing: a double rule with corner ticks
    ctx.strokeStyle = pal.fg; ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.strokeRect(13, 13, w - 26, h - 26);
    [[8, 8], [w - 8, 8], [8, h - 8], [w - 8, h - 8]].forEach(function (c) {
      ctx.fillRect(c[0] - 2, c[1] - 2, 4, 4);
    });

    // the two crossed knives, sliding into the cross as the piece assembles
    var slide = Math.min(1, progress * 1.5);
    var cxX = w * 0.42, cyX = h * 0.5;
    var off = (1 - slide) * 90;
    this._knife(ctx, kit, cxX - 150 - off, cyX + 70 + off, -0.42, 260);  // lower-left -> upper-right
    this._knife(ctx, kit, cxX - 150 - off, cyX - 70 - off, 0.42, 260);   // upper-left -> lower-right

    // the bagel: a dithered torus, lit from the upper-left, front-right
    if (progress > 0.35) {
      ctx.globalAlpha = Math.min(1, (progress - 0.35) / 0.4);
      var bx = w * 0.62, by = h * 0.52, R = 66, rIn = 24;
      var seedRnd = kit.lcg(5150);
      var x, y, d;
      for (y = -R; y <= R; y++) {
        for (x = -R; x <= R; x++) {
          d = Math.sqrt(x * x + y * y);
          if (d > R || d < rIn) continue;
          var nx = x / d, ny = y / d;
          var light = (-nx - ny) / 1.414;            // +1 at upper-left
          var dens = 0.55 - 0.42 * light;            // lit side lighter (less ink)
          // round the outer & inner edges down a touch
          var rp = (d - rIn) / (R - rIn);
          dens -= 0.18 * Math.max(0, 0.5 - Math.abs(rp - 0.5)) * 2;
          if (light > 0.72 && rp > 0.25 && rp < 0.8) continue; // specular gloss (bg)
          if (dens > kit.bayer(bx + x, by + y)) ctx.fillRect((bx + x) | 0, (by + y) | 0, 1, 1);
        }
      }
      // sesame seeds: small ink dabs scattered on the crown
      for (var s = 0; s < 46; s++) {
        var a = seedRnd() * Math.PI * 2;
        var rr = rIn + 6 + seedRnd() * (R - rIn - 12);
        var sxp = bx + Math.cos(a) * rr, syp = by + Math.sin(a) * rr;
        ctx.fillRect(sxp | 0, syp | 0, 2, 1);
      }
      ctx.globalAlpha = 1;
    }

    // a small mono-esque "OPEN" tick row under the still life for deli energy
    if (progress >= 1) {
      var ty = h - 26;
      for (var i = 0; i < 5; i++) ctx.fillRect(w * 0.62 - 22 + i * 10, ty, 6, 3);
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
