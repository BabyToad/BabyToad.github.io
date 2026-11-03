// How speech lives in the shrine: what happens to what she said, and what she says about what happens.
// Runs in the stage's two phases from recorded inputs and simulation state, so replay is exact.
// Accepted commands arrive before her pose. The complete physical event batch arrives after physics,
// so a bell knocks the writing even when a louder landing has her attention.

import { MOUTH, EYES, BROWS } from "../../../src/speech/text.js";
import { defaultTake } from "./speaker.js";

export const LAUGH = {
  format: 1, tickRate: 24, duration: 36,
  tracks: {
    eyeOpen: [[0, EYES.closed, "hold"], [30, EYES.closed, "hold"], [31, EYES.normal, "hold"]],
    bob: [[0, 0], [5, 2], [9, 0], [14, 2], [18, 0], [24, 1], [36, 0]],
    head: [[0, 0], [5, 2], [9, -1], [14, 2], [18, -1], [36, 0]],
  },
};

export class Reactions {
  /**
   * @param {object} performance the shrine's stage performance
   * @param {object} speaker its Speaker
   * @param {{bell:()=>object,frogMouth:()=>object}} places live, in lettering coordinates
   */
  constructor(performance, speaker, places) {
    this.performance = performance; this.speaker = speaker; this.places = places;
    this.settings = { voiced: true, written: true, takes: {} };
    this.pending = null; this.fallen = false; this.answeredFall = false; this.fallenBefore = false; this.laughed = false;
    this.saying = null; this.lastLine = null; this.heard = [];
    speaker.stage = {
      frame: name => performance.frame(name),
      pointer: () => { const p = performance.perception.pointer; return p && performance.scene.tick <= p.until ? p.point : null; },
    };
  }

  say(tick, line, id) {
    const { voiced, written, takes } = this.settings;
    this.speaker.hush(tick);
    this.speaker.say(tick, { line, take: voiced ? takes[line] ?? defaultTake(this.speaker.assets.takes[line]) : null, written, id });
  }

  /** Say something once she is free, and not before a little silence has passed. */
  plan(line, tick, delay = 0) { this.pending = { line, at: tick + delay }; }

  /** The line a pending plan comes to now. A subclass can decide this late. */
  resolve(pending) { return pending.line; }

  /** Is she free to start a line? Holding a bowl does not stop her talking; walking somewhere does. */
  free() { return !this.speaker.current && (!this.performance.action || this.performance.bowl.held); }

  applySettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if ("calm" in settings) this.speaker.lettering.calm = settings.calm;
    if ("limit" in settings && this.speaker.lettering.wall.map) this.speaker.lettering.wall.map.limit = settings.limit;
  }

  command({ intent, accepted }, tick) {
    switch (intent.kind) {
      case "speech-settings": this.applySettings(intent.settings); break;
      case "say": this.pending = null; this.say(tick, intent.line, intent.id); break;
      case "hush": this.pending = null; this.speaker.hush(tick); break;
      case "interrupt":
        // A scoped cancellation belongs to the action it names, and the stage says if it was stale.
        // Only an unscoped interrupt stops her talking.
        if (accepted && !intent.request) { this.pending = null; this.speaker.hush(tick); }
        break;
      case "knock-word": {
        const word = this.speaker.lettering.words.find(w => w.id === intent.word);
        if (word && ["arriving", "held"].includes(word.phase)) { this.speaker.lettering.dislodge(word); this.knocked(word, tick); }
        break;
      }
      case "feed-frog": this.fedFrog(this.speaker.lettering.eat(tick, this.places.frogMouth()), tick); break;
      default:
    }
  }

  knocked() {}

  fedFrog(eaten, tick) {
    this.speaker.hush(tick);
    this.pending = null;
    const laughed = eaten && this.laugh(tick);
    this.plan("frog", tick, laughed ? 40 : eaten ? 12 : 0);
  }

  /** The art lane's one honest laugh. It only works if it is rare, so the frog gets it once. */
  laugh(tick) {
    if (this.laughed) return false;
    this.laughed = true;
    this.performance.actor.play("expression", LAUGH, { id: `laugh:${tick}`, fade: 2, release: 6 });
    this.speaker.requestFace(tick, { mouth: MOUTH.laugh, browSet: BROWS.warm }, 31);
    return true;
  }

  /** What she has to say about a consequence. Words and body have already reacted. */
  respond(kind, tick) {
    if (kind === "bell") this.plan("rang", tick, 20);
    else if (kind === "drop") this.pending = null;
    else if (kind === "land") this.plan("bowl", tick, 44);
    else if (kind === "taken") this.plan(this.fallenBefore ? "small" : "merit", tick, 6);
  }

  consequence(event, tick) {
    const { speaker, places } = this;
    switch (event.kind) {
      case "bell":
        // The wall takes the blow. What she was saying comes off it, and she stops to listen.
        speaker.hush(tick);
        speaker.lettering.knock(tick, places.bell());
        this.respond("bell", tick);
        break;
      case "drop":
        speaker.hush(tick);
        this.fallen = true; this.answeredFall = false;
        this.respond("drop", tick);
        break;
      case "land":
        // A bowl bounces. She answers the fall once.
        if (this.fallen && !this.answeredFall) { this.answeredFall = true; this.respond("land", tick); }
        break;
      case "projected-grip": case "catch":
        // Words as she takes the bowl, not when it is asked for.
        if (event.interaction !== "ring") {
          this.fallenBefore = this.fallen;
          this.fallen = false; this.answeredFall = false;
          this.respond("taken", tick);
        }
        break;
      default:
    }
  }

  /** Phase one: accepted commands, then any line that is due, for the pose about to be sampled. */
  before(tick, { commands }) {
    for (const command of commands) {
      if (command.accepted === false) this.rejected(command, tick);
      else this.command(command, tick);
    }
    this.speaker.beforePose(tick);
    this.think(tick);
    if (this.pending && tick >= this.pending.at && this.free()) {
      const line = this.resolve(this.pending);
      this.pending = null;
      if (line) this.say(tick, line, `reaction:${tick}`);
    }
    const current = this.speaker.current, key = current?.startTick ?? null;
    if (key !== this.saying) {
      if (this.saying !== null) this.heard.push({ tick, kind: "line-end", line: this.lastLine });
      if (current) this.heard.push({ tick, kind: "line-start", line: current.line, register: current.score.register });
      this.saying = key; this.lastLine = current?.line ?? null;
    }
  }

  rejected() {}
  think() {}

  /** Phase two: everything that physically happened, whoever has her attention. */
  after(tick, { events }) {
    for (const event of events) this.consequence(event, tick);
    this.speaker.lettering.followMouth(this.places.frogMouth());
    this.speaker.afterPhysics(tick);
  }

  /** For outputs such as sound: what happened to lines and words since last asked. Nothing in the scene reads it. */
  drain() { const out = [...this.heard, ...this.speaker.lettering.drain()]; this.heard = []; return out; }
}
