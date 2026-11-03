// The shrine's sound design: what each thing that happens sounds like, here, today. The Observer says
// how hard; this file decides what that means. Variation comes from a private generator, so the
// picture's replay is unaffected, and the same bounce is never quite the same sound.

import { dB, Drift, Air, Engine, generator } from "./engine.js";
import { Observer } from "./observe.js";
import { Musician } from "./musician.js";

const fetchJSON = async url => { const response = await fetch(url); if (!response.ok) throw new Error(`${response.status}: ${url}`); return response.json(); };
const pan = x => (x === undefined ? 0 : (x * 2 - 1) * 0.65);
const clamp01 = v => Math.max(0, Math.min(1, v));
const FIRST = ["fallsDeep", "fallsAir", "spout", "crickets", "leaves", "bell", "foot", "bowlHard"];

/** Sound for the shrine. The page calls this once, from the first gesture. */
export function createSound({ context, bed, sfx, voice, performance, baseURL, seed = 41, now: clock, data }) {
  const sound = new ShrineSound({ context, bed, sfx, voice, performance, baseURL, seed, clock });
  // A failed load leaves a silent room and a working stage. whenReady() still rejects for anyone who asks.
  sound.ready = sound.load(data).catch(error => { console.warn("Room sound unavailable", error); sound.dispose(); throw error; });
  sound.ready.catch(() => {});
  return sound.api();
}

class ShrineSound {
  constructor({ context, bed, sfx, voice, performance, baseURL, seed, clock }) {
    Object.assign(this, { context, bed, sfx, voice, performance, baseURL, clock: clock ?? (() => context.currentTime) });
    this.random = generator(seed);
    this.observer = null; this.engine = null; this.drifts = []; this.pendingBatches = [];
    this.nextDrip = 2; this.nextBird = 18; this.nextCroak = 30; this.nextGong = 45; this.nextCicada = 15; this.gust = 0; this.gustTarget = 0.4; this.nextGust = 0;
    this.speaking = false; this.sutra = false; this.brushes = new Set(); this.lastLoud = -100; this.lastFlush = -100;
    this.pendingCues = []; this.hopCount = 0;
  }

  async load(data) {
    const base = this.baseURL;
    const [mix, bank, score] = data ?? await Promise.all(["mix.json", "bank.json", "score.json"].map(name => fetchJSON(new URL(name, base))));
    if (this.disposed) return;
    const engine = this.engine = new Engine({ context: this.context, bed: this.bed, sfx: this.sfx, mix, bank, baseURL: base, random: this.random });
    this.mix = mix;
    // The room fades up as if you had just come up the last stair: the falls, then what is near.
    const t = this.clock(), opening = mix.opening;
    // Panned to where they are in the painting: the falls up on the left, the spout low on the right.
    const groups = [["fallsDeep", "fallsDeep", 1, -0.2], ["fallsAir", "fallsAir", 1, -0.35], ["spout", "spout", 1, 0.5], ["leaves", "leaves", 0.7], ["crickets", "insects", 1]];
    groups.forEach(([group, stem, gain, panning = 0], i) => {
      const drift = new Drift(engine, group, { stem, gain: 0, pan: panning, crossfade: group === "crickets" ? 1.5 : 2.5, shortest: 5, longest: 11 });
      drift.home = gain; drift.level.gain.setValueAtTime(0, t);
      drift.level.gain.setTargetAtTime(gain, t + i * opening.stagger, opening.place / 3);
      this.drifts.push(drift); (this.named ??= {})[group] = drift;
    });
    // Stem-level moves that belong to the place: insects hush, music dips for her.
    this.insectHush = this.named.crickets.level;
    this.cloth = new Air(engine, { stem: "air", frequency: 1500, q: 0.6 });
    this.brush = new Drift(engine, "brush", { stem: "brush", gain: 0, crossfade: 0.8, shortest: 2, longest: 4, horizon: 2 });
    this.brush.level.gain.value = 0; this.drifts.push(this.brush);
    this.drone = new Drift(engine, "drone", { stem: "drone", gain: 0, crossfade: 1.6, shortest: 2.4, longest: 4, horizon: 3 });
    this.drifts.push(this.drone);
    this.leavesLevel = this.named.leaves.level;
    this.musician = new Musician(engine, score, { start: 8 });
    this.musicHome = dB(mix.stems.music.db);
    this.observer = new Observer(this.performance);
    if (this.voice && mix.room?.voiceSend !== undefined) { this.voiceSend = this.context.createGain(); this.voiceSend.gain.value = dB(mix.room.voiceSend); this.voice.connect(this.voiceSend); this.voiceSend.connect(engine.room); }
    await engine.load(engine.allFiles(FIRST));
    if (!this.disposed) this.loaded = true;
  }

  api() {
    return {
      events: batch => this.events(batch),
      frame: state => this.frame(state),
      setStem: (name, change) => this.engine?.setStem(name, change),
      stems: () => this.engine?.stems,
      cue: (name, detail) => { if (this.engine && !this.disposed) this.handle({ cue: name, ...detail }, this.clock()); },
      ui: name => this.ui(name),
      whenReady: () => this.ready,
      dispose: () => this.dispose(),
      sound: this,
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true; this.loaded = false;
    this.pendingCues = []; this.observer = null;
    this.engine?.close();
    if (this.voiceSend) { this.voice.disconnect(this.voiceSend); this.voiceSend.disconnect(); this.voiceSend = null; }
  }

  /** Once per scene tick, inside afterPhysics. */
  events(batch) {
    if (this.disposed || !this.observer) return;
    const { cues, controls } = this.observer.step(batch), now = this.clock();
    for (const cue of cues) this.handle(cue, now);
    this.cloth.set(controls.cloth ** 1.5 * 0.9, now, pan(controls.clothX));
    if (controls.cord > 0.25 && this.random() < 0.18) this.engine.play("rope", { stem: "rope", when: now, gain: controls.cord * 0.6, rate: this.random.range(0.85, 1.15), pan: pan(0.57) });
    this.flushDelayed(now);
  }

  later(when, fn) { this.pendingCues.push({ when, fn }); }
  flushDelayed(now) {
    if (!this.pendingCues.length) return;
    this.pendingCues = this.pendingCues.filter(item => { if (item.when > now + 0.05) return true; item.fn(Math.max(now, item.when)); return false; });
  }

  /** Per display frame, and the only clock the bed and the player need. */
  frame({ speaking = false, hidden = false } = {}) {
    if (this.disposed || !this.engine) return;
    const now = this.clock();
    this.flushDelayed(now);
    for (const drift of this.drifts) drift.tick(now);
    this.place(now, speaking);
    if (speaking !== this.speaking) this.speech(speaking, now);
    if (this.loaded) this.musician.tick(now, speaking);
  }

  speech(speaking, now) {
    this.speaking = speaking;
    const stem = this.engine.stems.music, dip = this.mix.speech.musicDip;
    if (!stem.muted) stem.fader.gain.setTargetAtTime(dB(stem.db + (speaking ? dip : 0)), now, speaking ? 0.12 : 0.7);
  }

  /** The place's own slow life. All of it waits politely while she is speaking. */
  place(now, speaking) {
    const { engine, random } = this;
    if (!this.loaded) return;
    // Wind: a wandering value that moves the leaves and shakes the ribbon when it gusts.
    if (now > this.nextGust) { this.gustTarget = random() ** 1.6; this.nextGust = now + random.range(3, 11); this.leavesLevel.gain.setTargetAtTime(0.45 + this.gustTarget * 0.95, now, random.range(1, 2.6)); this.gust = this.gustTarget; }
    if (now > this.nextDrip) { engine.play("drip", { stem: "wet", when: now, gain: random.range(0.35, 1), rate: random.range(0.85, 1.2), pan: random.range(0.25, 0.75) }); this.nextDrip = now + (random() < 0.25 ? random.range(0.25, 0.7) : random.range(1.8, 6.5)); }
    if (speaking) return;
    if (now > this.nextBird) { const n = 1 + Math.floor(random() * 3); for (let i = 0; i < n; i++) engine.play("bird", { stem: "far", when: now + i * random.range(0.45, 0.8), gain: random.range(0.6, 1), rate: random.range(0.97, 1.03), pan: -0.45 }); this.nextBird = now + random.range(22, 65); }
    if (now > this.nextCicada) { engine.play("cicada", { stem: "insects", when: now, gain: dB(4), pan: -0.3 }); this.nextCicada = now + random.range(30, 75); }
    if (now > this.nextCroak) { this.croak(now, 0.5, pan(0.3)); this.nextCroak = now + random.range(28, 80); }
    if (now > this.nextGong) { engine.play("gong", { stem: "temple", when: now, gain: 1, pan: -0.5, lowpass: 1400 }); this.nextGong = now + random.range(85, 170); }
  }

  croak(when, gain, panning) {
    const { engine, random } = this, count = random() < 0.3 ? 2 : 1;
    for (let i = 0; i < count; i++) engine.play("croak", { stem: "frog", when: when + i * random.range(0.28, 0.5), gain: gain * random.range(0.8, 1), rate: random.range(0.92, 1.06), pan: panning });
  }

  /** Something loud happened near them. Insects stop at once and come back slowly, one by one as it were. */
  startle(now, amount) {
    const param = this.insectHush.gain, low = 1 - clamp01(amount) * 0.92;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(low, now, 0.07);
    param.setTargetAtTime(1, now + 1 + amount * 2.5, 2.8);
    this.lastLoud = now; this.nextBird = Math.max(this.nextBird, now + 14);
  }

  ui(name) { if (name === "tap" && !this.disposed) this.engine?.play("knock", { stem: "ui", gain: 0.8, when: this.clock() }); }

  handle(cue, now) {
    const { engine, random } = this, p = pan(cue.x), e = cue.energy ?? 1;
    const jitter = (amount = 0.05) => random.range(1 - amount, 1 + amount);
    switch (cue.cue) {
      case "hop-off":
        engine.play("foot", { stem: "body", when: now, gain: dB(-13) * random.range(0.7, 1), rate: jitter(0.1) * 1.08, lowpass: 2200, pan: p });
        engine.play("cloth", { stem: "body", when: now, gain: dB(-15) * random.range(0.5, 1), rate: jitter(0.12), pan: p });
        break;
      case "hop-land":
        engine.play("foot", { stem: "body", when: now, gain: dB(-5) * e ** 1.2 * random.range(0.72, 1), rate: jitter(0.09), lowpass: 1400 + 4000 * e, pan: p });
        // An anklet and whatever else is on her settle a moment after the foot.
        engine.play("bangle", { stem: "jewels", when: now + random.range(0.015, 0.05), gain: dB(-4) * e * random.range(0.4, 0.9), rate: jitter(0.1), pan: p });
        if (random() < 0.5) engine.play("earring", { stem: "jewels", when: now + random.range(0.04, 0.1), gain: dB(-8) * random.range(0.5, 1), rate: jitter(0.1), pan: p });
        break;
      case "bangle":
        engine.play("bangle", { stem: "jewels", when: now, gain: dB(-2) * e ** 1.3 * random.range(0.6, 1), rate: jitter(0.1), lowpass: 5000 + 9000 * e, pan: p });
        break;
      case "earring":
        engine.play("earring", { stem: "jewels", when: now, gain: dB(-4) * e ** 1.1 * random.range(0.6, 1), rate: jitter(0.14), pan: p });
        break;
      case "visitor":
        engine.play("cloth", { stem: "body", when: now, gain: dB(-22), rate: jitter(0.1), pan: p });
        break;

      case "grip-cord":
        engine.play("rope", { stem: "rope", when: now, gain: 0.9, rate: jitter(), pan: p });
        engine.play("creak", { stem: "rope", when: now + 0.04, gain: 0.35, rate: jitter(0.08), pan: p });
        break;
      case "bell": {
        // One real recording at three speeds: the speed the bell is, its body, and the original's glint.
        const strike = { stem: "bell", when: now, pan: p };
        engine.play("bell", { ...strike, gain: 1, rate: 0.5 });
        engine.play("bell", { ...strike, gain: dB(-9), rate: 1 });
        engine.play("bell", { ...strike, gain: dB(-8), rate: 0.25, lowpass: 1800 });
        engine.play("creak", { stem: "rope", when: now + 0.03, gain: 0.8, rate: jitter(0.08), pan: p });
        this.startle(now, 0.9);
        if (now - this.lastFlush > 30) { engine.play("flush", { stem: "far", when: now + random.range(0.25, 0.6), gain: dB(10), pan: -0.4 }); this.lastFlush = now; }
        this.musician?.hear("bell", now);
        break;
      }
      case "clapper": {
        // Weaker each swing and darker with it. Slightly different strike speed: a clapper never hits one spot.
        const strength = e ** 1.5;
        engine.play("bell", { stem: "bell", when: now, gain: strength * 0.8, rate: 0.5 * jitter(0.0015), lowpass: 1200 + 7000 * e, pan: p });
        if (e > 0.3) engine.play("bell", { stem: "bell", when: now, gain: strength * dB(-14), rate: 1, pan: p });
        break;
      }

      case "grip-bowl":
        engine.play("bowlWood", { stem: "bowl", when: now, gain: dB(-20), rate: jitter(0.06), pan: p });
        engine.play("palm", { stem: "bowl", when: now + 0.02, gain: dB(-22), rate: jitter(), lowpass: 2800, pan: p });
        engine.play("bangle", { stem: "jewels", when: now + 0.03, gain: dB(-3), rate: jitter(), pan: p });
        break;
      case "release":
        engine.play("cloth", { stem: "body", when: now, gain: dB(-14) + dB(-6) * e, rate: 1.1 * jitter(), pan: p });
        break;
      case "drop":
        engine.play("bangle", { stem: "jewels", when: now, gain: dB(0), rate: jitter(), pan: p });
        this.musician?.hear("drop", now);
        break;
      case "bowl-hit": {
        if (cue.speed !== undefined && cue.speed < 0.2) break;
        // Bigger drop, bigger clank: louder, brighter, longer. Two files blended by how hard it came down.
        const hard = e ** 1.4, soft = 1 - hard;
        engine.play("bowlHard", { stem: "bowl", when: now, gain: hard, rate: jitter(0.04), lowpass: 2000 + 12000 * e, duration: 0.5 + 1.2 * e, send: hard * 0.2, pan: p });
        engine.play("bowlTap", { stem: "bowl", when: now, gain: dB(-4) * e * (0.35 + 0.65 * soft), rate: jitter(0.1), pan: p });
        engine.play("foot", { stem: "bowl", when: now, gain: dB(-8) * e, rate: 0.6, lowpass: 400, pan: p });
        this.startle(now, 0.35 + 0.55 * e);
        if (this.bowlEnergy === undefined || now - this.bowlAt > 1) this.bowlEnergy = e;
        this.bowlAt = now;
        // The stage's bowl settles flat in two contacts; a real one keeps rocking. This is mine and is sound only.
        if (cue.settled || cue.speed < 2) {
          this.later(now + 0.14, t => engine.play("bowlSettle", { stem: "bowl", when: t, gain: dB(-14) * (0.4 + this.bowlEnergy), rate: jitter(0.06) * (1.1 - this.bowlEnergy * 0.2), duration: 0.5 + 1.4 * this.bowlEnergy, pan: p }));
        }
        break;
      }
      case "rice-scatter":
        engine.play("rice", { stem: "rice", when: now, gain: dB(0), rate: jitter(0.08), pan: p, lowpass: 12000 });
        break;
      case "grain":
        // A tick can hold many grains; spread them inside it so they do not fuse into one click.
        engine.play("grain", { stem: "rice", when: now + random() * 0.04, gain: dB(2) * e ** 0.9 * random.range(0.4, 1), rate: jitter(0.22), pan: pan(cue.x) });
        break;
      case "home":
        engine.play("bowlWood", { stem: "bowl", when: now, gain: dB(-6), rate: jitter(0.05), pan: pan(0.24) });
        engine.play("bangle", { stem: "jewels", when: now + 0.02, gain: dB(-3), rate: jitter(), pan: pan(0.3) });
        this.musician?.hear("home", now);
        break;

      case "stamp":
        engine.play("stamp", { stem: "body", when: now, file: engine.bank.stamp.files[0], gain: 1, rate: jitter(0.04), pan: p, send: 0.2 });
        engine.play("bangle", { stem: "jewels", when: now + 0.02, gain: dB(2), rate: jitter(), pan: p });
        engine.play("swoosh", { stem: "bowl", when: now + 0.03, gain: dB(-20), rate: jitter(), pan: p });
        this.startle(now, 0.6);
        this.musician?.hear("stamp", now);
        break;
      case "catch":
        engine.play("palm", { stem: "bowl", when: now, gain: dB(-4), rate: jitter(0.05), pan: p });
        engine.play("bangle", { stem: "jewels", when: now + 0.015, gain: dB(0), rate: jitter(), pan: p });
        this.musician?.hear("catch", now);
        break;
      case "grip-missed":
        engine.play("cloth", { stem: "body", when: now, gain: dB(-12), rate: 1.2 * jitter(), pan: p });
        break;

      case "frog-hop":
        engine.play("plop", { stem: "frog", when: now, gain: dB(-12), rate: 1.2 * jitter(0.08), lowpass: 2600, pan: p });
        break;
      case "frog-land":
        engine.play("plop", { stem: "frog", when: now, gain: dB(-3), rate: jitter(0.1), pan: p });
        if (random() < 0.55) { this.later(now + random.range(0.45, 1.5), t => { if (!this.speaking) this.croak(t, 0.85, p); }); this.nextCroak = Math.max(this.nextCroak, now + 25); }
        break;
      case "word-eaten":
        engine.play("gulp", { stem: "frog", when: now + 0.08, gain: dB(-2), rate: jitter(0.08), pan: p });
        this.later(now + 0.5, t => { if (random() < 0.4) this.croak(t, 0.6, p); });
        break;

      case "wind":
        // The air the click implies, in the leaves. The ribbon's own flapping follows from its real motion.
        this.leavesLevel?.gain.setTargetAtTime(1.3, now, 0.25);
        this.nextGust = now + random.range(1.2, 2.2);
        break;
      case "ribbon":
        engine.play("ribbon", { stem: "ribbon", when: now, gain: e ** 0.8 * random.range(0.7, 1), rate: jitter(0.14), pan: p });
        break;

      case "water":
        engine.play("splash", { stem: "water", when: now, gain: 1, rate: jitter(0.06), pan: p });
        this.startle(now, 0.2);
        break;

      case "word-land": {
        // Soft and below her: a word landing is felt under the voice band, not heard across it.
        const heavy = cue.stress === 2, size = clamp01((cue.size ?? 30) / 48);
        if (cue.material === "water") break;
        engine.play(heavy ? "thud" : "pat", { stem: "words", when: now, gain: (heavy ? dB(0) : dB(-7)) * (0.5 + 0.5 * size) * random.range(0.8, 1), rate: jitter(0.1), lowpass: 1500, pan: p });
        break;
      }
      case "word-hop":
        engine.play("wordHop", { stem: "words", when: now, gain: dB(-4) * random.range(0.6, 1), rate: jitter(0.12), pan: p });
        break;
      case "word-knocked":
        engine.play("flake", { stem: "words", when: now, gain: dB(4) * random.range(0.5, 1), rate: jitter(0.1), offset: random.range(0, 1.2), duration: 0.9, pan: p });
        break;
      case "word-floor":
        engine.play("wordFloor", { stem: "words", when: now, gain: dB(4) * clamp01((cue.speed ?? 6) / 8) * random.range(0.6, 1), rate: jitter(0.12), pan: p });
        break;
      case "brush-start":
        this.brushes.add(cue.id ?? "one"); this.setBrush(now);
        break;
      case "brush-end":
        this.brushes.delete(cue.id ?? "one"); this.setBrush(now);
        break;
      case "line-start":
        if (cue.register === "sutra") this.setSutra(true, now);
        break;
      case "line-end":
        this.setSutra(false, now);
        break;
      default:
    }
  }

  setBrush(now) {
    const on = Math.min(2, this.brushes.size);
    this.brush.level.gain.setTargetAtTime(on ? 0.7 + on * 0.3 : 0, now, on ? 0.04 : 0.15);
  }

  /** A sutra is the one thing that gets a ground under it. She recites; the room gets a floor, and a knock calls it in. */
  setSutra(on, now) {
    if (on === this.sutra) return;
    this.sutra = on;
    if (on) this.engine.play("knock", { stem: "ui", when: now, gain: 0.8 });
    this.drone.level.gain.setTargetAtTime(on ? 1 : 0, now, on ? 1.4 : 2.4);
  }
}
