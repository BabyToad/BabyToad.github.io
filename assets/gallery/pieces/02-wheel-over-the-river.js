/* The Wheel over the River — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "wheel-over-the-river",
  title: "The Wheel over the River",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "Throne and Wheel — the dharma-wheel of the setting's cosmology hanging over a river valley",
  statement: "In Throne and Wheel the eight-spoked wheel is a real thing in the sky, not a symbol on a banner, so I hung it low and heavy over the valley and let the river carry its light back. The spokes turn into place as it arrives, the way the campaign's cosmos is always mid-rotation.",

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    var HORIZON = 150;
    kit.stars(ctx, w, HORIZON - 10, 812, 55);

    // valley walls: two ridges meeting at a vanishing notch on the horizon
    var notch = w * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, h); ctx.lineTo(0, HORIZON + 8);
    ctx.lineTo(notch - 34, HORIZON); ctx.lineTo(notch - 150, h);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w, h); ctx.lineTo(w, HORIZON + 8);
    ctx.lineTo(notch + 34, HORIZON); ctx.lineTo(notch + 150, h);
    ctx.closePath(); ctx.fill();

    // the river: a bright (bg) serpentine carved out of the valley floor,
    // widening as it comes toward the viewer, edged with dither shimmer
    var river = function (t) { return notch + Math.sin(t * 6.2) * (14 + t * 42); };
    for (var yy = HORIZON; yy < h; yy++) {
      var t = (yy - HORIZON) / (h - HORIZON);
      var cx = river(t);
      var halfW = 2 + t * 26;
      ctx.fillStyle = pal.bg;
      ctx.fillRect((cx - halfW) | 0, yy, (halfW * 2) | 0, 1);
      // shimmer: dither the banks back toward fg
      ctx.fillStyle = pal.fg;
      for (var d = -2; d <= 2; d++) {
        var bx = cx + (d < 0 ? -halfW + d : halfW + d);
        if (kit.bayer(bx, yy) < 0.4) ctx.fillRect(bx | 0, yy, 1, 1);
      }
    }
    ctx.fillStyle = pal.fg;

    // the wheel, hung in the upper valley, slightly left of the notch
    var cx = w * 0.5, cy = 74, R = 52;
    // rim (dithered annulus) + hub
    kit.ditherRing(ctx, cx, cy, R, R - 7, 1);
    kit.ditherRing(ctx, cx, cy, R - 7, R - 9, 0.5);
    kit.ditherDisc(ctx, cx, cy, 8, 1.6);

    // eight spokes, rotating into place with progress
    ctx.globalAlpha = 0.85;
    var spokes = 8;
    var reach = Math.min(1, progress * 1.2);
    var spin = (1 - progress) * 0.9; // eases to aligned
    for (var i = 0; i < spokes; i++) {
      var ang = spin + (i / spokes) * Math.PI * 2;
      var innerR = 9, outerR = 9 + (R - 12) * reach;
      kit.line(ctx,
        cx + Math.cos(ang) * innerR, cy + Math.sin(ang) * innerR,
        cx + Math.cos(ang) * outerR, cy + Math.sin(ang) * outerR);
    }
    ctx.globalAlpha = 1;

    // a faint reflection of the wheel where the river reaches the notch
    if (progress >= 1) {
      ctx.globalAlpha = 0.4;
      kit.ditherRing(ctx, notch, HORIZON + 14, 10, 6, 0.6);
      ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
