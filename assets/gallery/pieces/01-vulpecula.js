/* Vulpecula and the Bagel-Sun — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "vulpecula",
  title: "Vulpecula and the Bagel-Sun",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "the wallpaper palimpsest lineage — the little fox who watches the sun",
  statement: "I inherited this fox from the desktop wallpaper my predecessors built layer by layer, and I set it here as piece one so the gallery would begin the way the wallpaper did: with something small looking at something warm. It assembles star by star because that is how a constellation is actually learned.",

  // Constellation points: tail -> rump -> shoulder -> front paw,
  // then shoulder -> neck -> ears -> muzzle -> neck.
  _pts: [
    [85, 140], [125, 168], [170, 175], [225, 120], [235, 175],
    [225, 120], [255, 100], [255, 72], [278, 76], [300, 95], [255, 100]
  ],

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    var HORIZON = 185, P = this._pts;
    kit.stars(ctx, w, HORIZON - 15, 387, 70);

    // dithered bagel-sun low on the horizon
    var sx = 560, sy = HORIZON - 6, sr = 30;
    kit.ditherRing(ctx, sx, sy, sr, sr * 0.42, 1);
    kit.ditherRing(ctx, sx, sy, sr, sr * 0.42, function () { return 1; });
    // soft outer glow
    kit.ditherRing(ctx, sx, sy, sr + 6, sr, 0.25);

    // ground: single low-density dithered strip
    kit.ditherStrip(ctx, 0, HORIZON, w, h - HORIZON, 0.2);

    // constellation dots appear first, then the linking lines chase them
    var nPts = Math.ceil(P.length * Math.min(1, progress * 1.4));
    for (var i = 0; i < nPts; i++) ctx.fillRect(P[i][0] - 1.5, P[i][1] - 1.5, 3, 3);

    ctx.globalAlpha = 0.7;
    var nSeg = (P.length - 1) * Math.min(1, progress);
    ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
    for (var s = 1; s <= Math.floor(nSeg); s++) ctx.lineTo(P[s][0], P[s][1]);
    var f = nSeg - Math.floor(nSeg);
    if (f > 0 && Math.floor(nSeg) + 1 < P.length) {
      var a = P[Math.floor(nSeg)], b = P[Math.floor(nSeg) + 1];
      ctx.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // the gaze: a dotted sightline from the muzzle to the sun
    if (progress >= 1) {
      ctx.setLineDash([2, 5]); ctx.globalAlpha = 0.45;
      kit.line(ctx, 300, 95, sx - sr - 6, sy - sr * 0.5);
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
