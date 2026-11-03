// Second-order follower: y + k1 y' + k2 y'' = x + k3 x', after t3ssel8r's "Giving Personality to Procedural Animations".
// f is how fast it responds (Hz), z how much it rings (0 wobbles forever, 1 settles), r how early it reacts.

export class Follow {
  constructor(f, z = 1, r = 0, x0 = 0, fps = 24) {
    this.tune(f, z, r);
    this.dt = 1 / fps;
    this.xp = x0; this.y = x0; this.yd = 0;
  }
  /** Change the response without discarding position, velocity or input history. */
  tune(f, z = 1, r = 0) {
    this.k1 = z / (Math.PI * f);
    this.k2 = 1 / (2 * Math.PI * f) ** 2;
    this.k3 = r * z / (2 * Math.PI * f);
  }
  step(x) {
    const dt = this.dt, xd = (x - this.xp) / dt;
    this.xp = x;
    const k2 = Math.max(this.k2, 1.1 * (dt * dt / 2 + dt * this.k1 / 2));
    this.y += dt * this.yd;
    this.yd += dt * (x + this.k3 * xd - this.y - this.k1 * this.yd) / k2;
    return this.y;
  }
  /** An impulse: landings, recoil, a slap. */
  kick(v) { this.yd += v; }
  /** Jump to a value with no motion, for cuts. */
  set(x) { this.xp = x; this.y = x; this.yd = 0; }
}
