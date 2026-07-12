/* Nusantara Stellar Radio — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "nusantara-stellar-radio",
  title: "Nusantara Stellar Radio",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "The Golden Triangle — a broadcast dish flinging concentric waves out across the sector's stars",
  statement: "The Golden Triangle is a setting held together by signal — pirate radio, distress calls, gossip crossing light-years — so I drew the dish as the small thing and the broadcast as the big thing, the waves already past the frame before the antenna finishes tuning. The stars it reaches are exactly the stars it will never hear back from.",

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    kit.stars(ctx, w, h, 1997, 90);

    // emitter: a satellite dish on a mast, low-left, aimed up into open sky
    var ex = 116, ey = 150;
    kit.ditherStrip(ctx, 0, h - 10, w, 10, 0.22);
    // tripod mast + base
    ctx.fillRect(ex - 2, ey, 4, h - 10 - ey);
    kit.line(ctx, ex, h - 12, ex - 12, h - 10);
    kit.line(ctx, ex, h - 12, ex + 12, h - 10);
    // the dish face: an ellipse tilted to aim up-right, hollowed to a bowl
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(-0.62);
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal.bg;
    ctx.beginPath(); ctx.ellipse(3, -2, 23, 14, 0, 0, Math.PI * 2); ctx.fill(); // concavity
    ctx.fillStyle = pal.fg;
    ctx.beginPath(); ctx.ellipse(6, -4, 12, 7, 0, 0, Math.PI * 2); ctx.fill();  // dish depth
    ctx.restore();
    // feed arm + horn out in front of the dish, where the beam originates
    var ox = ex + 26, oy = ey - 30;
    kit.line(ctx, ex + 6, ey - 8, ox, oy);
    ctx.fillRect(ox - 2, oy - 2, 5, 5);

    // concentric broadcast arcs sweeping up-right from the horn
    var maxR = 760;
    var nArcs = 7;
    ctx.globalAlpha = 0.8;
    for (var i = 0; i < nArcs; i++) {
      // each arc's radius grows with progress and its index (outer = older)
      var phase = progress * 1.15 - i * 0.13;
      if (phase <= 0) continue;
      var r = Math.min(1, phase) * maxR * ((i + 2) / (nArcs + 1));
      if (r < 12) continue;
      ctx.globalAlpha = 0.75 * (1 - r / maxR) + 0.12;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      // arc opening toward up-right (roughly -60deg to +30deg)
      ctx.arc(ox, oy, r, -Math.PI * 0.62, Math.PI * 0.18);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // a couple of brighter "carrier" stars the signal is aimed through
    if (progress > 0.6) {
      [[430, 60], [560, 96], [650, 40]].forEach(function (p) {
        kit.ditherDisc(ctx, p[0], p[1], 3, 1.7);
      });
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
