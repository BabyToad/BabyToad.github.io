/* Völkerschlachtdenkmal — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "voelkerschlachtdenkmal",
  title: "Völkerschlachtdenkmal",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "Leipzig — the Monument to the Battle of the Nations on the horizon of Jonas's city",
  statement: "This is the stone thing you can see from half of Leipzig, the city Jonas works from, so I put it on the horizon at the scale it actually holds in the skyline: a single geometric mass too heavy to argue with, doubled in the reflecting pool the way it always is at dusk. I kept it a pure silhouette because that is how you know it from a train window.",

  // Half-profile, crown -> base: [heightFromTop y, halfWidth]
  _profile: [
    [30, 0], [34, 14], [39, 26], [44, 40], [47, 46],   // domed crown
    [49, 44], [66, 49], [69, 54],                       // neck + shoulder
    [70, 74], [104, 86], [120, 92],                     // tapering body
    [122, 116], [126, 118], [150, 122]                  // stepped plinth + base
  ],

  _silhouette: function (cx) {
    var P = this._profile, pts = [], i;
    for (i = 0; i < P.length; i++) pts.push([cx - P[i][1], P[i][0]]);      // left, top->base
    for (i = P.length - 1; i >= 0; i--) pts.push([cx + P[i][1], P[i][0]]); // right, base->top
    return pts;
  },

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    var cx = w * 0.5, HORIZON = 150;
    // dusk sky: faint gradient thickening toward the horizon, sparse stars
    kit.vGradient(ctx, 0, 20, w, HORIZON - 20, 0.0, 0.12);
    kit.stars(ctx, w, 90, 1813, 45);

    // flanking base buttresses for mass, then the tower — built base-up
    var reveal = progress; // silhouette rises out of the pool
    ctx.save();
    // clip the monument to a rising reveal line
    var clipTop = HORIZON - (HORIZON - 28) * reveal;
    ctx.beginPath(); ctx.rect(0, clipTop, w, HORIZON - clipTop); ctx.clip();

    kit.fillPoly(ctx, [[cx - 150, HORIZON], [cx - 150, 132], [cx - 96, 132], [cx - 96, HORIZON]]);
    kit.fillPoly(ctx, [[cx + 150, HORIZON], [cx + 150, 132], [cx + 96, 132], [cx + 96, HORIZON]]);
    kit.fillPoly(ctx, this._silhouette(cx));
    ctx.restore();

    // reflecting pool: the monument doubled, dithered and rippled
    if (progress > 0.5) {
      ctx.globalAlpha = Math.min(1, (progress - 0.5) / 0.5);
      var poolH = h - HORIZON;
      // faint mirrored silhouette (density thins with depth)
      var P = this._profile;
      for (var yy = 0; yy < poolH; yy++) {
        var srcY = HORIZON - 1 - yy;               // mirror
        // find half width at srcY by scanning profile
        var hw = 0;
        for (var i = 0; i < P.length - 1; i++) {
          if (srcY >= P[i][0] && srcY <= P[i + 1][0]) {
            var t = (srcY - P[i][0]) / ((P[i + 1][0] - P[i][0]) || 1);
            hw = P[i][1] + (P[i + 1][1] - P[i][1]) * t; break;
          }
        }
        if (srcY >= 132) hw = 150; // base + buttresses
        var dens = 0.5 * (1 - yy / poolH);
        for (var x = -hw; x <= hw; x++) {
          if (dens > kit.bayer(cx + x, HORIZON + yy)) ctx.fillRect((cx + x) | 0, HORIZON + yy, 1, 1);
        }
      }
      // horizontal ripple lines break the reflection
      for (var r = HORIZON + 6; r < h; r += 5) {
        ctx.fillStyle = pal.bg; ctx.fillRect(cx - 150, r, 300, 1); ctx.fillStyle = pal.fg;
      }
      ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
