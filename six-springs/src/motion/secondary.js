// Secondary motion is computed, never keyed: it reads what the primary motion did and trails behind it.
// The rules live in the character data, so a new character brings its own hair and cloth.

import { Follow } from "./follow.js";
import { apply } from "../rig.js";

const clip = (v, r) => r ? Math.max(r[0], Math.min(r[1], v)) : v;

export class Secondary {
  /** State is keyed by control name, so springs shared by two views survive a view change. */
  constructor(fps = 24) { this.fps = fps; this.spring = new Map(); this.prevPoint = new Map(); this.prevRate = new Map(); }

  follower(key, f, z) {
    if (!this.spring.has(key)) this.spring.set(key, new Follow(f, z, 0, 0, this.fps));
    else this.spring.get(key).tune(f, z);
    return this.spring.get(key);
  }

  /** Mutates pose. world = {vx, vy}: movement that happens outside the rig, such as the character's stage position. */
  step(view, pose, world = { vx: 0, vy: 0 }) {
    // a new view moves every tracked point at once, which must not read as velocity
    if (this.lastView !== view) { this.prevPoint.clear(); this.prevRate.clear(); this.lastView = view; }
    const q = view.resolve(pose), S = view.skeleton(q);
    // All readers compare against the previous tick. A rule must not consume a
    // motion sample that a later rule also needs (for example, two skirt panels).
    const nextPoint = new Map(), nextRate = new Map();
    for (const rule of view.secondary) {
      let x = 0;
      for (const input of rule.input) {
        if (input.vel) {
          const [bone, pv] = input.vel;
          const piv = view.pivots[pv] || view.pivots["h." + pv] || view.pivots["b." + pv];
          const p = apply(S[bone], piv), key = JSON.stringify([bone, pv, input.axis]);
          const prev = this.prevPoint.has(key) ? this.prevPoint.get(key) : p[input.axis];
          nextPoint.set(key, p[input.axis]);
          x += (p[input.axis] - prev + (input.axis === 0 ? world.vx : world.vy)) * input.gain;
        } else if (input.control) {
          x += pose[input.control] * input.gain;
        } else if (input.rate) {
          let v = 0; for (const c of input.rate) v += pose[c];
          const key = JSON.stringify(input.rate);
          const prev = this.prevRate.has(key) ? this.prevRate.get(key) : v;
          nextRate.set(key, v);
          x += (v - prev) * input.gain;
        }
      }
      x = clip(x, rule.clamp);
      rule.into.forEach((name, i) => {
        const z = Array.isArray(rule.z) ? rule.z[i] : rule.z;
        const y = this.follower(name, rule.f[i], z).step(x);
        const out = clip(y, rule.outClamp);
        pose[name] = rule.add ? pose[name] + out : out;
        if (rule.chain) x = y;
      });
    }
    this.prevPoint = nextPoint;
    this.prevRate = nextRate;
    return pose;
  }
}
