// Everything that happens when she decides to say something, on the scene's tick and nothing else.

import { compileScore, speechSource } from "../../../src/speech/score.js";
import { spliceTake } from "../../../src/speech/edit.js";
import { writtenAlignment } from "../../../src/speech/timing.js";
import { Lettering } from "../../../src/speech/lettering.js";
import { figureOccupancy } from "../../../src/speech/compose.js";
import { MOUTH, BROWS } from "../../../src/speech/text.js";
import { Follow } from "../../../src/motion/follow.js";
import { clamp } from "../../../src/math.js";
import { FOCUS, LINES, TARGETS } from "./direction.js";

// She looks round at words making way: it is not her doing, and she does not approve.
const GLANCE = {
  format: 1, tickRate: 24, duration: 34,
  tracks: { gaze: [[0, 0], [2, 1], [28, 1], [31, 0]], yaw: [[0, 0], [8, 0.4], [26, 0.4], [34, 0]] },
};

/**
 * Which take a line starts on until someone keeps one by ear: the lowest-energy take with no flag.
 * Jonas heard overdrive in the hot generations, and share of samples above 0.7 predicts it.
 * @param {{flags?:string[],hot?:number}[]} takes
 */
export function defaultTake(takes) {
  const heat = i => takes[i].hot ?? 0, order = takes.map((_, i) => i).sort((a, b) => heat(a) - heat(b) || a - b);
  return order.find(i => !takes[i].flags?.length) ?? order[0] ?? 0;
}

export class Speaker {
  /**
   * @param {object} actor performer; a `speech` slot is inserted below `action`
   * @param {object} assets {written:{number:{text}}, takes:{line:[take]}}
   * @param {object} wall {measure, wallAt, toPixel, scale, map} for the lettering
   * @param {() => number[]} [feet] where her feet are, in painting pixels, from simulation state
   */
  constructor(actor, assets, wall, feet = () => [620, 832]) {
    this.actor = actor; this.assets = assets; this.feet = feet; this.settled = 0; this.lastFeet = null;
    this.lettering = new Lettering(wall);
    this.current = null; this.count = 0;
    this.faceRequest = null; this.closing = -1;
    // Set by the stage when there is one: named frames, and where the visitor's pointer is.
    this.stage = null;
    this.gazeAt = { gaze: new Follow(6, 1), yaw: new Follow(2.8, 1), pitch: new Follow(2.5, 1) }; this.addressee = { gaze: 0, yaw: 0, pitch: 0 };
    if (!actor.slots.includes("speech")) actor.slots.splice(actor.slots.indexOf("action"), 0, "speech");
    // Drawing identity is chosen last, after every layer and fade, so it holds or cuts and is never
    // interpolated through unrelated drawings. Numbers fade; a mouth is a drawing.
    const inner = actor.constrain;
    actor.constrain = (pose, tick) => this.applyFace(inner(pose, tick), tick);
  }

  /** Where she is now, and where a register would write. */
  stance(register) {
    const [x, y] = this.feet(), f = FOCUS[register];
    return { focus: { x: x + f.x, y: y - 345 + f.y }, occupancy: figureOccupancy([x, y]) };
  }

  /** A gaze target for what she has written, so she can look round at her own words. */
  writtenTarget(register) {
    const { focus } = this.stance(register), [x, y] = this.feet();
    const dx = Math.max(-1, Math.min(1, (focus.x - x) / 200)), dy = Math.max(-0.6, Math.min(0.6, (focus.y - (y - 345)) / 300));
    return { gaze: dx, yaw: dx * 0.45, pitch: dy, eyes: "normal" };
  }

  /** A painting pixel as somewhere she can look, from where she stands now. */
  lookTo([px, py], eyes) {
    const [x, y] = this.feet(), dx = (px - x) / 420, dy = (py - (y - 345)) / 500;
    return { gaze: clamp(dx * 2.2, -1, 1), yaw: clamp(dx * 1.2, -0.65, 0.65), pitch: clamp(dy * (dy > 0 ? 1.3 : 2.4), -0.95, 0.95), eyes };
  }

  /** Things that move are looked at where they are when she starts the line. */
  liveTargets() {
    if (!this.stage) return {};
    const at = (name, eyes) => this.lookTo(this.stage.frame(name).screen, eyes);
    return { bowl: at("bowl", "down"), frog: at("frog.mouth", "down"), bell: at("bell", "up") };
  }

  /** Whoever she is talking to: the pointer when there is one, otherwise the person in front of her. Never whatever she is holding. */
  followAddressee() {
    if (!this.stage) return;
    const [x, y] = this.feet(), point = this.stage.pointer() ?? this.stage.frame("giver").screen;
    const dx = clamp((point[0] - x) / 420, -1, 1), dy = clamp((point[1] - (y - 350)) / 500, -0.6, 0.6);
    this.addressee = { gaze: this.gazeAt.gaze.step(dx), yaw: this.gazeAt.yaw.step(dx * 0.75), pitch: this.gazeAt.pitch.step(dy) };
  }

  /** Compile a line. No take means written timing; the result says which it is. */
  compile(line, take) {
    const direction = LINES[line];
    if (!direction) throw new Error(`Unknown line ${line}`);
    const recorded = take === null || take === undefined ? null : this.assets.takes?.[line]?.[take];
    const text = recorded?.text ?? this.assets.written[direction.number]?.text;
    if (!text) throw new Error(`No text for line ${line}`);
    const common = { text, register: direction.register, direction, targets: { ...TARGETS, ...this.liveTargets(), written: this.writtenTarget(direction.register) } };
    if (!recorded) return { score: compileScore({ ...common, alignment: writtenAlignment(text, direction.register) }), audio: null, segments: [] };
    const edit = spliceTake(recorded, direction.pauses);
    return { score: compileScore({ ...common, alignment: edit.alignment, loudness: edit.loudness }), audio: recorded.audio, original: recorded.original, segments: edit.segments };
  }

  /** Scene-side command. `written` chooses whether words go on the wall at all. */
  say(tick, { line, take = null, written = true, id }) {
    const { score, audio, original, segments } = this.compile(line, take);
    this.actor.drive("speech", speechSource(score, this.stage ? () => this.addressee : null), { id: id ?? `say:${++this.count}`, fade: 4, release: 10 });
    if (written) this.lettering.say(score, tick, LINES[line], this.stance(score.register));
    this.current = { line, take, score, audio, original, segments, startTick: tick };
    return this.current;
  }

  /** Words on her wall that nobody said: the same material, no mouth, and they stay until released. */
  inscribe(tick, text, direction = {}) {
    const score = compileScore({ text, register: "said", alignment: writtenAlignment(text, "said"), direction, targets: TARGETS });
    this.lettering.say({ ...score, lastSound: 1e9 }, tick, direction, this.stance("said"));
    return this.lettering.current;
  }

  /** Let an inscription go. It soaks in like anything else she has said. */
  uninscribe(tick, uid) { for (const word of this.lettering.words) if (word.utterance === uid) this.lettering.release(word, tick); }

  /** Stop talking. A mouth that was open presses shut for a beat rather than fading through other drawings. */
  hush(tick) {
    if (!this.current) return;
    this.actor.cancel("speech", { fade: 3 });
    this.lettering.hush(tick);
    this.current = null;
    this.closing = tick + 2;
  }

  /** Hold named drawings for a while, when she is not talking: a laugh, a look of disapproval. */
  requestFace(tick, { mouth = MOUTH.rest, browSet = BROWS.normal, eyeSet = null }, ticks) { this.faceRequest = { mouth, browSet, eyeSet, until: tick + ticks }; }

  /** The final word on the face, above every layer. Non-rest drawings also take the smile bow off, since it would bend teeth. */
  applyFace(pose, tick) {
    const said = this.current, age = said ? tick - said.startTick : -1;
    let mouth = MOUTH.rest, browSet = BROWS.normal;
    if (said && age >= 0 && age < said.score.ticks) { mouth = said.score.tracks.mouth[age]; browSet = said.score.tracks.browSet[age]; }
    else if (this.faceRequest && tick < this.faceRequest.until) {
      ({ mouth, browSet } = this.faceRequest);
      if (this.faceRequest.eyeSet !== null) pose.eyeSet = this.faceRequest.eyeSet;
    }
    else if (tick < this.closing) mouth = MOUTH.press;
    pose.mouth = mouth; pose.browSet = browSet;
    if (mouth !== MOUTH.rest) pose.smile = 0;
    return pose;
  }

  /** Once she has settled somewhere, deal with anything of hers she is now standing in front of. */
  watchWhereSheStands(tick) {
    const feet = this.feet(), moved = this.lastFeet && Math.hypot(feet[0] - this.lastFeet[0], feet[1] - this.lastFeet[1]) > 0.5;
    this.lastFeet = feet;
    if (moved) { this.settled = 0; return; }
    if (++this.settled !== 5 || !this.lettering.stance) return;
    const { focus, occupancy } = this.stance(this.lettering.stance.register);
    if (!this.lettering.blocked(occupancy).length) return;
    const moving = this.lettering.makeWay(tick, focus, occupancy);
    if (moving.length && !this.current) {
      this.actor.play("expression", GLANCE, { id: `glance:${tick}`, fade: 3, release: 6 });
      this.requestFace(tick, { mouth: MOUTH.displeased, browSet: BROWS.skeptical }, 30);
    }
  }

  /** Before her pose is sampled: a finished line lets go, and the person she is talking to is followed. */
  beforePose(tick) {
    if (this.current && tick - this.current.startTick >= this.current.score.ticks) this.current = null;
    this.followAddressee();
  }

  /** After physics, with what actually happened: the wall and its writing advance once. */
  afterPhysics(tick) {
    this.watchWhereSheStands(tick);
    this.lettering.step(tick);
  }

  /** Both phases, for a speaker with no stage around it. */
  step(tick) { this.beforePose(tick); this.afterPhysics(tick); }
}
