// The core idea: a character is a function from a pose (plain numbers) to a vector drawing.
// Drivers use authored controls; pose validity and contact still need authored constraints.
// A point moves through two stages: deformers (shape keys and the head dome), then bones (linear-blend skinning).

import { twoBone } from "./solve.js";
import { mul, apply, inverse, IDENTITY } from "./math.js";
import { validateBaked, controlInfo } from "./validate.js";
import { Frame, worldPoints } from "./frame.js";
export { mul, apply } from "./math.js";

/** @typedef {[number,number,number,number,number,number]} Mat  a,b,c,d,e,f: x' = a x + c y + e, y' = b x + d y + f */


/** Compile a list of channel terms into pose => number. A term is {k}, {c,k} or {c,curve}. */
function channel(terms) {
  if (!terms || !terms.length) return null;
  const fns = terms.map(t => {
    if (t.c === undefined) return () => t.k;
    if (t.curve) {
      const cv = t.curve;
      return q => {
        const x = q[t.c];
        if (x <= cv[0][0]) return cv[0][1];
        for (let i = 1; i < cv.length; i++) if (x <= cv[i][0]) {
          const u = (x - cv[i - 1][0]) / (cv[i][0] - cv[i - 1][0]);
          return cv[i - 1][1] + (cv[i][1] - cv[i - 1][1]) * u;
        }
        return cv[cv.length - 1][1];
      };
    }
    return q => q[t.c] * t.k;
  });
  return q => { let s = 0; for (const f of fns) s += f(q); return s; };
}

function nearest(at, x) {
  let best = 0, d = Infinity;
  for (let i = 0; i < at.length; i++) { const e = Math.abs(at[i] - x); if (e < d) { d = e; best = i; } }
  return best;
}

class View {
  constructor(name, def, parts, controls) {
    this.name = name;
    this.controls = controls;
    this.anchors = def.anchors || {};
    this.bias = Object.entries(def.bias || {});
    this.pivots = def.pivots;
    // An ik bone is the upper of a two-bone chain. Its rotation and its lower bone's are solved so the chain's end
    // reaches rest + (x, y) in character space, inverse-transformed into its parent's rest frame to solve.
    // Views still need authored correspondence. Keyed rot adds on top; a "level" bone cancels inherited angle.
    this.bones = def.bones.map(b => ({ name: b.name, parent: b.parent || null, pivot: b.pivot, scale: b.scale ?? 1, rot: channel(b.rot), tx: channel(b.tx), ty: channel(b.ty),
      ik: b.ik && { ...b.ik, rest: { root: b.pivot, mid: b.ik.mid, end: b.ik.end }, x: channel(b.ik.x), y: channel(b.ik.y), bend: b.ik.bend ?? 1 } }));
    this.secondary = def.secondary || [];
    this.choose = def.choose || {};
    this.drawOrder = def.layers.map(id => ({ id, part: parts[id], name: id.split(".")[1], deform: [] }));
    const byId = Object.fromEntries(this.drawOrder.map(l => [l.id, l]));
    for (const d of def.deformers || []) {
      if (d.type === "dome") {
        const x = channel(d.x), y = channel(d.y), { center: c, rx, ry } = d;
        for (const [id, depth] of Object.entries(d.depth)) if (byId[id]) byId[id].deform.push((px, py, q, out) => {
          const u = (px - c[0]) / rx, v = (py - c[1]) / ry, r2 = u * u + v * v;
          const f = Math.max(-1, Math.min(1, 1 - r2 * r2)) * depth;
          out[0] += x(q) * f; out[1] += y(q) * f;
        });
      } else if (d.type === "offset") {
        const x = channel(d.x), y = channel(d.y);
        for (const id of d.parts) if (byId[id]) byId[id].deform.push((px, py, q, out) => { if (x) out[0] += x(q); if (y) out[1] += y(q); });
      } else if (d.type === "bow") {
        for (const id of d.parts) if (byId[id]) {
          const pts = Object.values(byId[id].part)[0].points;
          let cx = 0; for (let i = 0; i < pts.length; i += 2) cx += pts[i]; cx /= pts.length / 2;
          byId[id].deform.push((px, py, q, out) => { const u = (px - cx) / d.halfWidth; out[1] += q[d.control] * d.amount * (1 - u * u); });
        }
      }
    }
  }

  /** The pose this view actually draws: authored bias added onto the shared controls. */
  resolve(pose) {
    if (!this.bias.length) return pose;
    const q = { ...pose };
    for (const [k, v] of this.bias) q[k] = (q[k] || 0) + v;
    return q;
  }

  /** Forward kinematics: bone name => matrix. Bones are stored parents first. */
  skeleton(q) {
    const S = {}, solved = {}, level = new Set();
    for (const b of this.bones) {
      let m = b.parent ? S[b.parent] : IDENTITY;
      const tx = b.tx ? b.tx(q) : 0, ty = b.ty ? b.ty(q) : 0;
      if (tx || ty) m = mul(m, [1, 0, 0, 1, tx, ty]);
      if (b.ik) {
        // the goal is where the chain's end should be in stage space, as an offset from its rest place; bring it into the parent's frame
        const { rest } = b.ik;
        const target = [rest.end[0] + (b.ik.x ? b.ik.x(q) : 0), rest.end[1] + (b.ik.y ? b.ik.y(q) : 0)];
        const r = twoBone(rest, apply(inverse(m), target), b.ik.bend, 0, b.ik);
        solved[b.name] = r.upper; solved[b.ik.lower] = r.lower;
        if (b.ik.level) level.add(b.ik.level);
      }
      const deg = (b.rot ? b.rot(q) : 0) + (level.has(b.name) ? -Math.atan2(m[1], m[0]) * 180 / Math.PI : (solved[b.name] || 0));
      if ((deg || b.scale !== 1) && b.pivot) {
        const r = deg * Math.PI / 180, c = Math.cos(r) * b.scale, s = Math.sin(r) * b.scale, [px, py] = b.pivot;
        m = mul(m, [c, s, -s, c, px - c * px + s * py, py - s * px - c * py]);
      }
      S[b.name] = m;
    }
    return S;
  }

  drawingOf(layer, q) {
    const rule = this.choose[layer.id];
    if (!rule) return layer.part.default;
    const index = nearest(rule.rows.at, q[rule.rows.control]);
    // An alternate drawing set replaces one row by identity, so an aperture still closes over it.
    const row = (rule.sets && index === rule.sets.over && rule.sets.map[q[rule.sets.control]]) || rule.map[index];
    return layer.part[row[rule.cols ? nearest(rule.cols.at, q[rule.cols.control]) : 0]];
  }

  /** Deformed points of one layer, in stage space. */
  deform(layer, drawing, q, S) {
    const pts = drawing.points, n = pts.length / 2, X = new Float64Array(n), Y = new Float64Array(n), bones = drawing.bones, w = drawing.weights;
    const ms = bones.map(b => S[b]), out = [0, 0], fx = layer.deform;
    for (let i = 0; i < n; i++) {
      const px = pts[i * 2], py = pts[i * 2 + 1];
      out[0] = 0; out[1] = 0;
      for (let f = 0; f < fx.length; f++) fx[f](px, py, q, out);
      const x = px + out[0], y = py + out[1];
      let ox = 0, oy = 0;
      for (let k = 0; k < ms.length; k++) {
        const wt = w ? w[k][i] : 1;
        if (!wt) continue;
        const m = ms[k];
        ox += wt * (m[0] * x + m[2] * y + m[4]); oy += wt * (m[1] * x + m[3] * y + m[5]);
      }
      X[i] = ox; Y[i] = oy;
    }
    return [X, Y];
  }

  /** Walk the draw list, handing each path to a sink: sink(fill, X, Y, rows). Renderers are just sinks. */
  draw(pose, sink) {
    const q = this.resolve(pose), S = this.skeleton(q);
    for (const layer of this.drawOrder) {
      const d = this.drawingOf(layer, q);
      const [X, Y] = this.deform(layer, d, q, S);
      for (const [fill, rows] of d.paths) sink(fill, X, Y, rows);
    }
  }

  /** Evaluate once for display, picking and attachments; no motion state advances here. */
  evaluate(pose, world = IDENTITY) {
    for (const key of Object.keys(this.controls)) if (!Number.isFinite(pose[key])) throw new Error(`${this.name}: missing or non-finite pose control ${key}`);
    if (world.length !== 6 || !world.every(Number.isFinite)) throw new Error("Invalid world transform");
    inverse(world);
    const q = this.resolve(pose), S = this.skeleton(q), paths = [];
    for (const layer of this.drawOrder) {
      const d = this.drawingOf(layer,q);
      const [X,Y] = worldPoints(...this.deform(layer,d,q,S),world);
      for (const [fill,rows] of d.paths) paths.push({ layer:layer.id, fill,X,Y,rows });
    }
    return new Frame(this,q,world,S,paths);
  }

  /** Character-space position of a named pivot carried by a bone. */
  point(pose, bone, pivot) {
    const q = this.resolve(pose);
    const S = this.skeleton(q), p = typeof pivot === "string" ? this.pivots[pivot] : pivot;
    if (!S[bone] || !Array.isArray(p) || p.length !== 2) throw new Error(`Unknown bone or pivot: ${bone}, ${pivot}`);
    return apply(S[bone], p);
  }

  /** Reach a character-space target. Upper/lower names identify bones, not controls. */
  reach(pose, { upper, lower, end, bend = 1 }, target) {
    const a = this.bones.find(b => b.name === upper), b = this.bones.find(b => b.name === lower);
    if (!a || !b || b.parent !== upper) throw new Error("Reach requires a direct two-bone chain");
    if (a.scale !== 1 || b.scale !== 1 || b.tx || b.ty) throw new Error("Reach requires unit-scale links and an untranslated lower joint");
    const q = this.resolve(pose), S = this.skeleton(q);
    let parent = a.parent ? S[a.parent] : IDENTITY;
    parent = mul(parent, [1,0,0,1,a.tx ? a.tx(q) : 0,a.ty ? a.ty(q) : 0]);
    const endPoint = typeof end === "string" ? this.pivots[end] : end;
    if (!endPoint) throw new Error(`Unknown reach endpoint ${end}`);
    return twoBone({ root: a.pivot, mid: b.pivot, end: endPoint }, apply(inverse(parent), target), bend);
  }
}

export class Rig {
  constructor(baked) {
    validateBaked(baked);
    this.name = baked.name;
    this.stage = baked.stage;
    this.controlInfo = controlInfo(baked.controls, baked.defaults, baked.controlInfo);
    this.controls = Object.fromEntries(Object.entries(this.controlInfo).map(([k,v])=>[k,v.range]));
    this.defaults = Object.fromEntries(Object.entries(this.controlInfo).map(([k,v])=>[k,v.default]));
    this.views = {};
    for (const [n, v] of Object.entries(baked.views)) this.views[n] = new View(n, v, baked.parts, this.controls);
  }

  /** A complete pose at rest. Drivers overwrite what they own. */
  neutral(over) {
    const q = {};
    for (const k of Object.keys(this.controls)) q[k] = 0;
    for (const [key,value] of Object.entries(over || {})) {
      if (!Object.hasOwn(this.controls,key) || !Number.isFinite(value)) throw new Error(`Unknown or non-finite control ${key}`);
      const info=this.controlInfo[key];
      if(info.blend==='discrete'&&!info.values.includes(value))throw new Error(`Unknown drawing identity ${key}:${value}`);
    }
    return Object.assign(q, this.defaults, over);
  }
}
export { Rig as Character };
