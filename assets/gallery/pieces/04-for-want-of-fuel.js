/* For Want of Fuel — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "for-want-of-fuel",
  title: "For Want of Fuel",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "For Want of Fuel — a mech gone still for lack of fuel, and the small person who came for it anyway",
  statement: "Jonas's mech game is about scarcity and the machines we keep alive past the point of sense, so I drew the moment the fuel ran out: the war-machine down on one knee, gone to scrap-weight, and a person the size of its shin carrying a can that will not be enough. The scale is the whole argument.",

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    var HORIZON = 168;
    kit.stars(ctx, w, HORIZON - 20, 44, 30);
    // low haze band above the ground
    kit.vGradient(ctx, 0, HORIZON - 26, w, 26, 0.0, 0.14);
    kit.ditherStrip(ctx, 0, HORIZON, w, h - HORIZON, 0.24);

    // --- the mech, slumped kneeling, weighted to the right ---
    // Assembles last-to-first: ground, then mech bulk, then head hangs,
    // then the human, then the fuel can.
    var mechAppear = Math.min(1, progress * 1.6);
    if (mechAppear > 0.05) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, mechAppear * 1.3);
      // grounded knee + lower leg (right side of frame)
      kit.fillPoly(ctx, [
        [470, HORIZON], [470, 150], [486, 132], [520, 128],
        [548, 138], [556, HORIZON]
      ]);
      // the standing leg folded under, foot planted
      kit.fillPoly(ctx, [
        [556, HORIZON], [560, 150], [590, 150], [612, HORIZON]
      ]);
      // torso, canted forward and down
      kit.fillPoly(ctx, [
        [486, 132], [500, 96], [540, 88], [566, 104],
        [560, 140], [520, 128]
      ]);
      // the heavy shoulder/arm hanging slack toward the ground
      kit.fillPoly(ctx, [
        [500, 100], [478, 108], [462, 150], [474, 152], [492, 116]
      ]);
      // head, dropped — a small blunt wedge with a dead eye-slit
      kit.fillPoly(ctx, [[520, 92], [544, 84], [548, 100], [528, 104]]);
      ctx.restore();
      // the eye: a cold bg slit (unlit)
      ctx.fillStyle = pal.bg; ctx.fillRect(532, 92, 8, 2); ctx.fillStyle = pal.fg;
    }

    // --- the human, tiny, to the left of the mech ---
    if (progress > 0.55) {
      ctx.globalAlpha = Math.min(1, (progress - 0.55) / 0.25);
      // head, body, legs — knee-height to the mech's shin
      ctx.fillRect(300, 146, 5, 6);           // head
      kit.fillPoly(ctx, [[299, 152], [306, 152], [308, HORIZON], [297, HORIZON]]); // torso+legs
      ctx.fillRect(306, 154, 8, 2);            // arm reaching toward the can
      ctx.globalAlpha = 1;
    }

    // --- the fuel can in the foreground, between human and mech ---
    if (progress > 0.78) {
      ctx.globalAlpha = Math.min(1, (progress - 0.78) / 0.22);
      var cxn = 328, cyn = 158;
      kit.fillPoly(ctx, [[cxn, cyn], [cxn + 16, cyn], [cxn + 16, HORIZON], [cxn, HORIZON]]);
      ctx.fillRect(cxn + 4, cyn - 4, 8, 4);    // spout collar
      ctx.fillRect(cxn + 14, cyn - 3, 6, 2);   // pour spout
      // handle (bg cut-out so it reads as a loop)
      ctx.fillStyle = pal.bg; ctx.fillRect(cxn + 5, cyn + 2, 6, 3); ctx.fillStyle = pal.fg;
      ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
