// Record handling choreography, separate from the motor/stylus simulation. Metres, +z up.
import * as G from './physics/gl-util.js';

const rotateX = a => {
  const m = G.ident(), c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
};

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

const EASING = {
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outQuint: t => 1 - Math.pow(1 - t, 5),
  inCubic: t => t * t * t
};

const HELD_POSE = [-0.30, -0.14, 0.34, 0.54, 0.05];

function normalizeHome(home) {
  if (Array.isArray(home)) {
    const a = home[4] || 0;
    return { pose: home.slice(), axis: [Math.sin(a), 0, Math.cos(a)] };
  }
  return { pose: home.pose.slice(), axis: home.axis.slice() };
}

function clearPose(home) {
  const [hx, hy, hz, rx, ry] = home.pose;
  const [ax, ay, az] = home.axis;
  // Slide strictly along the sleeve's open axis until completely clear of the 315mm jacket.
  return [hx + ax * 0.34, hy + ay * 0.34, hz + az * 0.34, rx, ry];
}

export class RecordPlacement {
  constructor() {
    this.phase = 'empty';
    this.pose = [0, 0, 0, 0, 0];
    this.segments = [];
    this.from = [0, 0, 0, 0, 0];
    this.elapsed = 0;
    this.finish = 'empty';
    this.home = { pose: [-0.60, -0.026, 0.095, Math.PI / 2 - 0.135, 0], axis: [0, 0.135, 0.991] };
  }

  get moving() { return this.segments.length > 0; }
  get placed() { return this.phase === 'placed'; }
  get visible() { return this.phase !== 'empty'; }
  get matrix() {
    return G.chain(G.T(...this.pose.slice(0, 3)), G.Ry(this.pose[4] || 0), rotateX(this.pose[3]));
  }

  start(phase, segments, finish) {
    this.phase = phase;
    this.segments = segments;
    this.from = this.pose.slice();
    this.elapsed = 0;
    this.finish = finish;
  }

  extract(home) {
    this.home = normalizeHome(home);
    this.pose = this.home.pose.slice();
    const clear = clearPose(this.home);
    this.start('extracting', [
      // Deliberate slip out along the sleeve plane, then continuous turn into held presentation.
      { to: clear, duration: 0.44, ease: 'inOutCubic', arch: 0 },
      { to: HELD_POSE, duration: 0.42, ease: 'outCubic', arch: 0.03 }
    ], 'held');
  }

  place() {
    if (this.phase !== 'held') return;
    this.start('placing', [
      // Smooth curved carry over the spindle while leveling horizontally.
      { to: [0, 0, 0.165, 0, 0], duration: 0.46, ease: 'inOutCubic', arch: 0.055 },
      // Strict vertical alignment and weighted settle straight onto the spindle and felt mat.
      { to: [0, 0, 0, 0, 0], duration: 0.40, ease: 'outQuint', arch: 0 }
    ], 'placed');
  }

  return(home = this.home) {
    if (!this.visible || this.moving) return;
    this.home = normalizeHome(home);
    const clear = clearPose(this.home);
    const segments = [];
    if (this.phase === 'placed') {
      segments.push({ to: [0, 0, 0.165, 0, 0], duration: 0.28, ease: 'outCubic', arch: 0 });
    }
    segments.push(
      { to: clear, duration: 0.48, ease: 'inOutCubic', arch: 0.075 },
      { to: this.home.pose, duration: 0.42, ease: 'outCubic', arch: 0 }
    );
    this.start('returning', segments, 'empty');
  }

  reset() {
    this.segments = [];
    this.phase = 'placed';
    this.pose = [0, 0, 0, 0, 0];
  }

  tick(dt, reduced = false) {
    if (!this.moving) return false;
    if (reduced) {
      const last = this.segments[this.segments.length - 1];
      this.pose = last.to.slice();
      this.segments = [];
      this.phase = this.finish;
      return true;
    }
    this.elapsed += dt;
    const seg = this.segments[0];
    const t = Math.min(1, this.elapsed / seg.duration);
    const eased = (EASING[seg.ease] || EASING.inOutCubic)(t);
    const p = mix(this.from, seg.to, eased);
    if (seg.arch) p[2] += Math.sin(Math.PI * t) * seg.arch;
    this.pose = p;
    if (t >= 1) {
      this.from = seg.to.slice();
      this.pose = seg.to.slice();
      this.segments.shift();
      this.elapsed = 0;
      if (!this.segments.length) this.phase = this.finish;
    }
    return true;
  }
}
