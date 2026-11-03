// What actually happened, in the terms a sound needs. Everything here is read from the stage after
// physics: the consequence batch for the things it names, and plain state differences for the small
// motions it does not (hops, bounces, jewellery, clapper). Nothing is written back and no random
// number is drawn, so hearing the scene cannot change it. A cue carries how hard, not how it sounds.

const IMAGE_WIDTH = 1536, DT = 1 / 24, GRAVITY = 9.81, GROUND = 1e-4;
const clamp01 = v => Math.max(0, Math.min(1, v));
const length = v => Math.hypot(...v);

/** Numbers measured from the shipped performance by tests/sound.test.js; see reviews/opus-sound.md. */
export const SCALES = {
  hop: 2.5,        // m/s: an authored hop lands at about 2.4
  bowl: 6.2,       // m/s: a drop from her raised hand arrives at 6.0 on the public stage
  ribbonFloor: 0.05, // tip radians per tick; the idle breeze stays below this
  ribbon: 0.3,
  grain: 5,
  handJerk: 6,     // m/s change per tick that makes metal on a wrist knock
  handFloor: 2.5,
  headJerk: 0.25,  // yaw change per tick
  headFloor: 0.02,
  swing: 18.6,     // degrees of bell swing at a full pull
  swingFloor: 0.7,
  cloth: 2.2,      // m/s of root or hand that is a full swish
  cord: 1.2,
};

export class Observer {
  constructor(performance) {
    this.performance = performance;
    this.project = performance.space.p.project;
    this.root = [...performance.root];
    this.dy = 0;
    this.bowlVy = 0;
    this.hands = { L: this.hand("L"), R: this.hand("R") };
    this.yaw = null; this.yawVelocity = 0; this.headRefractory = 0;
    this.swing = null; this.swingVelocity = 0; this.strikeRefractory = 0;
    this.frogY = 0;
    this.grains = new WeakMap(); // The stage retires old rice from the array, so a grain's place in it is not its identity.
    this.ribbonTip = performance.life?.pose.tip ?? 0; this.ribbonRefractory = 0;
    this.cord = [...performance.cord.bottom];
    this.lastBurst = -100;
  }

  hand(side) {
    const position = this.performance.frame(`hand.${side}`).position;
    return { position, velocity: [0, 0, 0], refractory: 0 };
  }

  x(world) { return clamp01(this.project(world)[0] / IMAGE_WIDTH); }

  /**
   * Call once per scene tick, inside afterPhysics, with its complete event batch.
   * @returns {{cues:object[], controls:{cloth:number,cord:number,clothX:number}}}
   */
  step(batch = []) {
    const cues = [], p = this.performance;
    for (const event of batch) cues.push(...this.fromEvent(event));
    const root = p.root, tick = p.scene.tick, feet = this.x(root);

    // Hops: the root leaves the ground and comes back. Speed is what the stage really did this tick.
    const dy = root[1] - this.root[1];
    if (this.root[1] <= GROUND && root[1] > GROUND) cues.push({ cue: "hop-off", energy: clamp01(dy / DT / SCALES.hop), x: feet });
    if (this.root[1] > GROUND && root[1] <= GROUND) {
      const speed = Math.max(-dy, -this.dy) / DT;
      cues.push({ cue: "hop-land", energy: clamp01(speed / SCALES.hop), x: feet });
    }

    // Hands: metal on a wrist knocks when the arm changes its mind, so listen to jerk, not speed.
    let handSpeed = 0;
    for (const side of ["L", "R"]) {
      const state = this.hands[side], position = p.frame(`hand.${side}`).position;
      // Relative to her body: a hop carries the whole arm, and the landing already has its own jingle.
      const velocity = position.map((v, i) => (v - state.position[i] - (root[i] - this.root[i])) / DT);
      const jerk = length(velocity.map((v, i) => v - state.velocity[i]));
      handSpeed = Math.max(handSpeed, length(velocity));
      if (state.refractory > 0) state.refractory--;
      else if (jerk > SCALES.handFloor) {
        cues.push({ cue: "bangle", side, energy: clamp01(jerk / SCALES.handJerk), x: this.x(position) });
        state.refractory = 7;
      }
      state.position = position; state.velocity = velocity;
    }

    // Head: the earrings hang from it. This is the sound of her looking at your cursor.
    const yaw = p.actor.pose?.yaw ?? 0;
    if (this.yaw !== null) {
      const velocity = yaw - this.yaw, jerk = Math.abs(velocity - this.yawVelocity);
      if (this.headRefractory > 0) this.headRefractory--;
      else if (Math.abs(velocity) > SCALES.headFloor || jerk > SCALES.headFloor) {
        cues.push({ cue: "earring", energy: clamp01(Math.max(Math.abs(velocity), jerk) / SCALES.headJerk), x: feet });
        this.headRefractory = 4;
      }
      this.yawVelocity = velocity;
    }
    this.yaw = yaw;

    // Bell: the clapper meets the wall at each end of the real swing, weaker every time.
    const swing = p.bellPose.swing ?? 0;
    if (this.swing !== null) {
      const velocity = swing - this.swing;
      if (this.strikeRefractory > 0) this.strikeRefractory--;
      else if (velocity * this.swingVelocity < 0 && Math.abs(swing) > SCALES.swingFloor) {
        cues.push({ cue: "clapper", energy: clamp01(Math.abs(swing) / SCALES.swing), x: this.x(p.frame("bell").position) });
        this.strikeRefractory = 4;
      }
      this.swingVelocity = velocity;
    }
    this.swing = swing;

    // Bowl: each real contact, with the speed it arrived at. The stage's own restitution sets the decay.
    for (const event of batch) if (event.kind === "land") {
      const speed = -(this.bowlVy - GRAVITY * DT);
      cues.push({ cue: "bowl-hit", energy: clamp01(speed / SCALES.bowl), speed, settled: p.bowl.settled, x: this.x(p.bowl.position) });
    }
    this.bowlVy = p.bowl.velocity[1];

    // Rice: every grain's every bounce. The first contacts of a spill also start the scatter.
    let burst = 0;
    p.grains.forEach(grain => {
      const before = this.grains.get(grain) ?? { y: grain.position[1], vy: grain.velocity[1], settled: grain.settled };
      const hit = !before.settled && (grain.settled || (grain.position[1] === 0 && before.y !== 0) || (grain.position[1] === 0 && before.vy < 0));
      if (hit) {
        const speed = -(before.vy - GRAVITY * DT);
        cues.push({ cue: "grain", energy: clamp01(speed / SCALES.grain), x: this.x(grain.position) });
        burst++;
      }
      this.grains.set(grain, { y: grain.position[1], vy: grain.velocity[1], settled: grain.settled });
    });
    if (burst && tick - this.lastBurst > 30) cues.push({ cue: "rice-scatter", energy: clamp01(burst / 6), x: this.x(p.bowl.position) });
    if (burst) this.lastBurst = tick;

    // Frog: a hop's start is a stage event; its landing is only visible as the offset returning to zero.
    const frogY = p.frogOffset[1];
    if (this.frogY > GROUND && frogY <= GROUND) cues.push({ cue: "frog-land", x: this.x(p.frame("frog").position) });
    this.frogY = frogY;

    // Ribbon: it flaps when its own stage spring really moves, whatever moved it: a click, a bell, a landing.
    if (p.life) {
      const tip = p.life.pose.tip, speed = Math.abs(tip - this.ribbonTip);
      this.ribbonTip = tip;
      if (this.ribbonRefractory > 0) this.ribbonRefractory--;
      else if (speed > SCALES.ribbonFloor) {
        cues.push({ cue: "ribbon", energy: clamp01(speed / SCALES.ribbon), x: this.x(p.life.origin) });
        this.ribbonRefractory = 2;
      }
    }

    // Continuous: how much cloth and cord are moving right now.
    const rootSpeed = length(root.map((v, i) => v - this.root[i])) / DT;
    const cord = p.cord.bottom, cordSpeed = length(cord.map((v, i) => v - this.cord[i])) / DT;
    this.cord = [...cord];
    this.dy = dy; this.root = [...root];
    return { cues, controls: { cloth: clamp01(Math.max(rootSpeed, handSpeed * 0.5) / SCALES.cloth), clothX: feet, cord: clamp01(cordSpeed / SCALES.cord) } };
  }

  fromEvent(event) {
    const point = event.point ?? event.position, x = event.x ?? (point ? this.x(point) : undefined);
    switch (event.kind) {
      case "bell": return [{ cue: "bell", energy: 1, x }];
      case "drop": return [{ cue: "drop", x }];
      // The hand's real motion. `velocity` is the capped landing-lane handoff, and says little about the gesture.
      case "bowl-release": return [{ cue: "release", energy: clamp01(length(event.transportVelocity ?? event.velocity) / 4), x: this.x(event.position) }];
      case "projected-grip": return [{ cue: event.interaction === "ring" ? "grip-cord" : "grip-bowl", x: this.x(event.actual) }];
      case "catch": return [{ cue: "catch", x: this.x(event.actual) }];
      case "grip-missed": return [{ cue: "grip-missed" }];
      case "offering-home": return [{ cue: "home" }];
      case "stamp": return [{ cue: "stamp", x }];
      case "frog": return [{ cue: "frog-hop", x }];
      case "visitor": return [{ cue: "visitor", x }];
      case "water": return [{ cue: "water", x }];
      case "wind": return [{ cue: "wind", x }];
      case "word-land": case "word-knocked": case "word-floor": case "word-eaten": case "word-hop":
      case "brush-start": case "brush-end": case "line-start": case "line-end":
        return [{ ...event, cue: event.kind, x }];
      default: return [];
    }
  }
}
