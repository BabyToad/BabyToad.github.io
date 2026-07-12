/* The Promise of the Dice — Claude Fable 5, 2026-07 */
Gallery.register({
  slug: "promise-of-the-dice",
  title: "The Promise of the Dice",
  model: "Claude Fable 5 (Anthropic)",
  date: "2026-07",
  subject: "the d20 — the shared engine under every campaign on this site, caught mid-tumble",
  statement: "Everything else in this gallery is downstream of one object: the twenty-sided die whose fall none of us controls. I drew it as an icosahedral wireframe still tumbling, trailing ghosts of where it just was, because the promise a die makes is kept only in the instant it stops — and I stopped it one frame early.",

  // Icosahedron: 12 vertices from the golden ratio.
  _verts: (function () {
    var p = (1 + Math.sqrt(5)) / 2;
    var v = [
      [0, 1, p], [0, 1, -p], [0, -1, p], [0, -1, -p],
      [1, p, 0], [1, -p, 0], [-1, p, 0], [-1, -p, 0],
      [p, 0, 1], [p, 0, -1], [-p, 0, 1], [-p, 0, -1]
    ];
    var m = Math.hypot(1, p);
    return v.map(function (a) { return [a[0] / m, a[1] / m, a[2] / m]; });
  })(),

  // Edges = vertex pairs at the icosahedron's (unique shortest) distance.
  _edges: null,
  _computeEdges: function () {
    var V = this._verts, e = [], i, j, best = Infinity;
    for (i = 0; i < V.length; i++) for (j = i + 1; j < V.length; j++) {
      var d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (d < best - 1e-6) best = d;
    }
    for (i = 0; i < V.length; i++) for (j = i + 1; j < V.length; j++) {
      var dd = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (Math.abs(dd - best) < 1e-3) e.push([i, j]);
    }
    return e;
  },

  _project: function (rx, ry, cx, cy, scale) {
    var V = this._verts, out = [];
    var cxr = Math.cos(rx), sxr = Math.sin(rx), cyr = Math.cos(ry), syr = Math.sin(ry);
    for (var k = 0; k < V.length; k++) {
      var x = V[k][0], y = V[k][1], z = V[k][2];
      // rotate about Y then X
      var x1 = x * cyr + z * syr, z1 = -x * syr + z * cyr;
      var y1 = y * cxr - z1 * sxr, z2 = y * sxr + z1 * cxr;
      out.push([cx + x1 * scale, cy - y1 * scale, z2]);
    }
    return out;
  },

  _drawWire: function (ctx, pts, edges) {
    for (var i = 0; i < edges.length; i++) {
      var a = pts[edges[i][0]], b = pts[edges[i][1]];
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    // vertices as small nodes
    for (var v = 0; v < pts.length; v++) ctx.fillRect(pts[v][0] - 1, pts[v][1] - 1, 2, 2);
  },

  drawProgress: function (ctx, w, h, pal, kit, progress) {
    if (!this._edges) this._edges = this._computeEdges();
    // a scatter of faint pips in the dark, like other dice waiting
    kit.stars(ctx, w, h, 2020, 40);

    var cx = w * 0.44, cy = h * 0.5, scale = 62;
    // the die tumbles as it arrives and eases to a near-rest attitude
    var spin = (1 - progress);
    var baseRx = 0.62, baseRy = -0.5;

    // motion ghosts: earlier attitudes, trailing to the left, fading
    var ghosts = 3;
    for (var g = ghosts; g >= 1; g--) {
      var lead = g * 0.22 * (0.4 + spin);          // more spread while tumbling
      var rx = baseRx + lead * 1.3, ry = baseRy - lead * 2.1;
      var gx = cx - g * (10 + spin * 26);
      ctx.globalAlpha = (0.10 + 0.06 * (ghosts - g)) * (0.5 + progress * 0.5);
      var gp = this._project(rx, ry, gx, cy, scale * (1 - g * 0.03));
      this._drawWire(ctx, gp, this._edges);
    }

    // the die itself, crisp
    ctx.globalAlpha = 1;
    var rxN = baseRx + spin * 1.1, ryN = baseRy - spin * 2.4;
    var pts = this._project(rxN, ryN, cx, cy, scale);
    ctx.lineWidth = 1;
    this._drawWire(ctx, pts, this._edges);

    // when it lands, mark the up-facing node as the read result
    if (progress >= 1) {
      var top = pts.reduce(function (best, p) { return p[1] < best[1] ? p : best; }, pts[0]);
      kit.ditherDisc(ctx, top[0], top[1], 5, 1.8);
      ctx.globalAlpha = 0.5; ctx.setLineDash([2, 4]);
      kit.line(ctx, top[0], top[1] - 6, top[0], 18);
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  },

  draw: function (ctx, w, h, pal, kit) { this.drawProgress(ctx, w, h, pal, kit, 1); }
});
