// When she speaks. There is no dialogue system yet, so this is the whole of her conversation, and its
// real subject is silence. She is proud and unimpressed, and she is not at your service.
//
//  - Her body answers everything, at once. Her voice answers only some of it.
//  - The first line is an instruction: "Put it in the bowl." It teaches the page without a tutorial.
//  - She does not repeat herself. Each thing has a few lines, then only looks. A line can come back
//    after several minutes, because she has done this before, but nobody will hear her run out fast.
//  - You cannot talk over her. Clicking while she speaks gets a look, and at most the last thing you
//    clicked gets answered when she has finished. Only the world can stop her: a bell, a dropped bowl.
//  - Left alone she talks to herself, less and less often, then stops. A page left open goes quiet.
//  - Hover and restlessness count as doing something. She has noticed the arrow, and says so once.
//  - Poking her is how anything she is doing gets interrupted. There is no way to get stuck: a bowl
//    left on the floor, wherever it rolled, is one she eventually goes and fetches herself.
//
// All of it is pure over recorded inputs and simulation state, so a session replays exactly.

import { BROWS, MOUTH, EYE_SETS } from "../../../src/speech/text.js";
import { Reactions } from "./reactions.js";

const SECOND = 24;
/** What each thing can get out of her, in order. */
export const ANSWERS = {
  taken: ["merit", "small", "burn", "deeds"], // The bowl, taken up each time. Fewer compliments as it goes.
  bell: ["rang", "stairs"],
  frog: ["frog"],
  board: ["deeds"],
  sack: ["burn"],
  stool: ["small"],
  ribbon: ["stairs"],
  water: ["third", "sixth", "nothing"],
  saint: ["arrow", "arm", "before", "halls", "corpse"], // After the first poke, which only gets a look.
};
/** Talking to herself: what, and how many seconds of quiet each one takes. The wait grows. */
export const MUSINGS = [["bowl", 24], ["before", 30], ["arm", 45], ["halls", 60], ["corpse", 80], ["nothing", 110], ["sixth", 150]];
const OPENING_PAUSE = 58, GAP = 19, AFTER_CLICK = 5 * SECOND, FORGET = 6 * SECOND, REPEATS_AFTER = 240 * SECOND;
const FETCHES_AFTER = 30 * SECOND;
const RESTLESS = 2400, RESTLESS_DECAY = 0.985, NEVER_BEFORE = 12 * SECOND, HOVER_FACE = 30, HOVER_SAYS = 120;
// Places she might glance at when nobody is there, in painting pixels.
const GLANCES = [[474, 846], [875, 350], [1210, 740], [1090, 620], [300, 520]];

// A poke: she flinches and looks. She is mostly annoyed that it worked.
const POKED = {
  format: 1, tickRate: 24, duration: 22,
  tracks: { bob: [[0, 0], [2, -7], [7, 3], [14, 0], [22, 0]], head: [[0, 0], [2, -3], [8, 2], [22, 0]], spine: [[0, 0], [2, -3], [9, 1.5], [22, 0]] },
};
const LOOK_ROUND = {
  format: 1, tickRate: 24, duration: 30,
  tracks: { head: [[0, 0], [4, 1.5], [24, 1.5], [30, 0]], browR: [[0, 0], [3, -10], [22, -10], [30, 0]] },
};

export class Director extends Reactions {
  constructor(performance, speaker, places) {
    super(performance, speaker, places);
    this.saidAt = new Map(); this.entered = null; this.title = null; this.pokes = {}; this.lastClick = -1e9; this.lastLineEnd = 0;
    this.fetchAt = null; this.restless = 0; this.lastPointer = null; this.hovered = 0; this.touch = false; this.nextGlance = 12 * SECOND; this.demanded = 0;
  }

  /** A line she has not said lately. Lines she has said do come back, a long way off. */
  eligible(line, tick) { return !this.saidAt.has(line) || tick - this.saidAt.get(line) > REPEATS_AFTER; }

  /** The arrow does not exist on a touch screen, so she cannot have been looking at it. */
  allowed(line) { return line !== "arrow" || !this.touch; }

  next(pool, tick) { return ANSWERS[pool].find(line => this.allowed(line) && this.eligible(line, tick)) ?? null; }

  say(tick, line, id) {
    this.saidAt.set(line, tick);
    super.say(tick, line, id);
  }

  /** An answer waits for her. Only the last thing asked is remembered, and not for long. */
  ask(pool, tick, delay = 0) { this.pending = { pool, at: tick + delay, asked: tick }; }

  resolve(pending) {
    const tick = this.performance.scene.tick;
    if (pending.line) return this.allowed(pending.line) ? pending.line : null;
    return this.next(pending.pool, tick);
  }

  /** Enough of the body to show she noticed, without taking anything from what she is doing. */
  lookAt(point, tick) { this.performance.perception.observe({ kind: "visitor", point }, tick); }

  disapprove(tick, ticks = 30) { if (!this.speaker.current) this.speaker.requestFace(tick, { mouth: MOUTH.displeased, browSet: BROWS.skeptical }, ticks); }

  /** The first gesture. Her name soaks into the wall, and she gets on with it. */
  enter(tick) {
    this.entered = tick;
    if (this.title !== null) this.speaker.uninscribe(tick, this.title);
    this.plan("bowl", tick, OPENING_PAUSE);
    this.lastLineEnd = tick;
  }

  command(command, tick) {
    const { intent } = command;
    switch (intent.kind) {
      case "title": this.title = this.speaker.inscribe(tick, intent.text); return;
      case "enter": if (this.entered === null) this.enter(tick); return;
      case "pointer": this.watchPointer(intent); return;
      case "poke": this.poke(intent, tick); return;
      case "ring": case "offer": case "water": this.lastClick = tick; break;
      default:
    }
    super.command(command, tick);
  }

  /** She was busy. She looks at what you wanted, and carries on. */
  rejected({ intent }, tick) {
    if (intent.kind === "ring") this.lookAt(this.performance.frame("bell").screen, tick);
    else if (intent.kind === "offer") this.lookAt(this.performance.frame("bowl").screen, tick);
  }

  watchPointer(intent) {
    if (intent.active === false) { this.lastPointer = null; return; }
    this.touch = !!intent.touch;
    if (this.touch) return;
    if (this.lastPointer) this.restless += Math.hypot(intent.x - this.lastPointer[0], intent.y - this.lastPointer[1]);
    this.lastPointer = [intent.x, intent.y];
  }

  poke({ target, x, y, action = null }, tick) {
    this.lastClick = tick;
    this.pokes[target] = (this.pokes[target] ?? 0) + 1;
    if (target === "saint") { this.pokedHer(tick, action); return; }
    this.lookAt([x, y], tick);
    if (ANSWERS[target]) this.ask(target, tick, this.speaker.current ? GAP : 10);
  }

  /** @param {string|null} poked the action she was in when the visitor poked her, captured at that moment */
  pokedHer(tick, poked) {
    const { performance } = this;
    performance.actor.play("expression", POKED, { id: `poked:${tick}`, fade: 1, release: 4 });
    performance.send({ kind: "notice" });
    this.disapprove(tick, 24);
    // She is doing something and you have just poked her. With the bowl in her hands, this is the page's best joke.
    // Scoped to that action, so if it has since finished the stage rejects it, and anything started since goes on.
    if (poked) performance.send({ kind: "interrupt", request: poked });
    else if (this.pokes.saint > 1) this.ask("saint", tick, this.speaker.current ? GAP : 14);
  }

  knocked(word, tick) {
    this.lastClick = tick;
    if (this.speaker.current) return;
    this.performance.actor.play("expression", LOOK_ROUND, { id: `knocked:${tick}`, fade: 2, release: 5 });
    this.lookAt(this.speaker.lettering.wall.toPixel(word.s + word.width / 2, word.t), tick);
    this.disapprove(tick, 26);
  }

  fedFrog(eaten, tick) {
    this.lastClick = tick;
    this.lookAt(this.performance.frame("frog").screen, tick);
    // With nothing to eat it is only a frog hopping, and that does not stop her.
    if (!eaten) { this.ask("frog", tick, this.speaker.current ? GAP : 10); return; }
    this.speaker.hush(tick);
    this.pending = null;
    this.ask("frog", tick, this.laugh(tick) ? 40 : 12);
  }

  respond(kind, tick) {
    if (kind === "bell") this.ask("bell", tick, 20);
    else if (kind === "drop") this.pending = null;
    // "Put it in the bowl" is her refrain, the one line a fall may get twice more.
    else if (kind === "land") { if (++this.demanded <= 2) this.plan("bowl", tick, 44); }
    else if (kind === "taken") {
      if (this.fallenBefore && this.eligible("small", tick)) this.plan("small", tick, 6);
      else this.ask("taken", tick, 6);
    }
  }

  /** Decide, once a tick, whether anything is worth saying unasked, and keep her eyes occupied. */
  think(tick) {
    if (this.entered === null) return;
    const { speaker, performance } = this;
    if (speaker.current) this.lastLineEnd = tick;
    if (this.pending?.asked !== undefined && tick - Math.max(this.pending.asked, this.lastLineEnd) > FORGET && !performance.action) this.pending = null;
    this.restless *= RESTLESS_DECAY;
    this.watchHover(tick);
    this.glance(tick);
    this.fetchBowl(tick);
    const quiet = tick - this.lastLineEnd;
    if (this.pending || speaker.current || performance.action || tick - this.lastClick < AFTER_CLICK) return;
    if (tick - this.entered > NEVER_BEFORE && quiet > GAP * 4 && (this.restless > RESTLESS || this.hovered > HOVER_SAYS) && this.allowed("arrow") && this.eligible("arrow", tick)) {
      this.restless = 0;
      this.plan("arrow", tick, 2);
      return;
    }
    const musing = MUSINGS.find(([line]) => !this.saidAt.has(line));
    if (musing && quiet > musing[1] * SECOND) this.plan(musing[0], tick);
  }

  /** Nobody is going to hand it to her. Wherever it ended up, however hidden, it does not stay lost. */
  fetchBowl(tick) {
    const { bowl, action } = this.performance;
    if (!bowl.moved || !bowl.settled || bowl.held || action) { this.fetchAt = null; return; }
    this.fetchAt ??= tick + FETCHES_AFTER;
    if (tick >= this.fetchAt && !this.speaker.current) { this.fetchAt = null; this.performance.send({ kind: "offer" }); }
  }

  /** The pointer on her face: she will not stand for it for long. */
  watchHover(tick) {
    const point = this.speaker.stage.pointer();
    const [x, y] = this.speaker.feet();
    const onHer = !this.touch && point && ((point[0] - x) / 75) ** 2 + ((point[1] - (y - 345)) / 95) ** 2 < 1;
    this.hovered = onHer ? this.hovered + 1 : 0;
    if (this.hovered > HOVER_FACE && !this.speaker.current) this.speaker.requestFace(tick, { browSet: BROWS.skeptical, eyeSet: EYE_SETS.narrow }, 8);
  }

  /** With no pointer to watch she does not stare at nothing. She has a frog, and a wall. */
  glance(tick) {
    if (tick < this.nextGlance || this.speaker.stage.pointer() || this.speaker.current || this.performance.action) return;
    const h = Math.imul(tick, 2654435761) >>> 0;
    this.performance.perception.observe({ kind: "water", point: GLANCES[h % GLANCES.length] }, tick);
    this.nextGlance = tick + (8 + h % 9) * SECOND;
  }
}
