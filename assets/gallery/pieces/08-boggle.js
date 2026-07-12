/* Boggle — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "boggle",
  title: "Boggle",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "the house cat — sitting precisely on the keyboard, where he should not, tail curled",
  statement: "\"That's boggle, baby\" is the site's own sign-off, so the gallery owed the cat a seat, and he took the one he was never offered: dead centre on the keyboard, tail curled, supremely uninterested in the work he is interrupting. I drew him in profile as a single silhouette because a cat this sure of himself doesn't need a face to make his point — though I let him open one eye at the end.",

  // sitting cat, in profile facing right; base sits on the keyboard top
  _body: [
    [280, 150], [276, 120], [286, 96], [312, 74], [330, 60],
    [332, 46], [344, 40], [356, 45], [360, 54], [363, 60],
    [356, 63], [352, 73], [350, 98], [352, 150]
  ],
  _earL: [[334, 46], [339, 28], [347, 46]],
  _earR: [[349, 46], [355, 30], [361, 46]],
  _tail: [
    [282, 146], [264, 151], [248, 140], [244, 120], [253, 107],
    [265, 110], [259, 120], [256, 132], [268, 141], [282, 140]
  ],

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    // faint desk-lamp fall of light behind (upper-left glow), very low density
    kit.vGradient(ctx, 0, 0, w, 120, 0.10, 0.0);

    // --- the keyboard: a low slab in slight perspective, lower third ---
    var kbTop = 150, kbBot = 188, kx0 = 150, kx1 = 590;
    // top face
    kit.fillPoly(ctx, [[kx0 + 16, kbTop], [kx1 - 16, kbTop], [kx1, kbBot], [kx0, kbBot]]);
    // carve a key grid out of the face in bg
    ctx.fillStyle = pal.bg;
    for (var r = 0; r < 4; r++) {
      var ry = kbTop + 5 + r * 8;
      for (var c = 0; c < 20; c++) {
        var inset = (r) * 1.2;
        var kxx = kx0 + 22 + c * 21 + r * 3 + inset;
        if (kxx > kx1 - 20) continue;
        ctx.fillRect(kxx, ry, 15, 5);
      }
    }
    // spacebar
    ctx.fillRect(kx0 + 120, kbBot - 8, 200, 4);
    ctx.fillStyle = pal.fg;

    // --- the cat, settling onto the keys ---
    var settle = Math.min(1, progress * 1.4);
    ctx.globalAlpha = settle;
    kit.fillPoly(ctx, this._body);
    kit.fillPoly(ctx, this._earL);
    kit.fillPoly(ctx, this._earR);
    // inner-ear notches (bg)
    ctx.fillStyle = pal.bg;
    ctx.fillRect(339, 40, 3, 5); ctx.fillRect(354, 41, 3, 5);
    ctx.fillStyle = pal.fg;
    ctx.globalAlpha = 1;

    // --- the tail, curling in last ---
    if (progress > 0.55) {
      ctx.globalAlpha = Math.min(1, (progress - 0.55) / 0.35);
      kit.fillPoly(ctx, this._tail);
      ctx.globalAlpha = 1;
    }

    // --- one eye opens at the end: a bg slit with a fg pupil ---
    if (progress >= 1) {
      ctx.fillStyle = pal.bg; ctx.fillRect(350, 52, 6, 3); ctx.fillStyle = pal.fg;
      ctx.fillRect(353, 52, 2, 3);
      // whisker hints
      ctx.globalAlpha = 0.5;
      kit.line(ctx, 360, 60, 380, 57);
      kit.line(ctx, 360, 62, 382, 64);
      ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
