// A player, not a track. Someone out of sight is working through a short piece on a zither at their own
// pace, and they pay attention: they stop to let her speak, take their hand off the strings when the bowl
// falls, wait until it is safe, and answer the bell. Each note is a real sample launched live, so
// a phrase can be left unfinished, and two plays of the piece are never quite the same.

import { dB } from "./engine.js";

const NAMES = "C C# D D# E F F# G G# A A# B".split(" ");
const midi = note => { const m = /^([A-G]#?)(\d)$/.exec(note); return NAMES.indexOf(m[1]) + 12 * (Number(m[2]) + 1); };
const LOOKAHEAD = 0.25, LISTEN_AFTER = [1.4, 3.2];

export class Musician {
  /** @param {import("./engine.js").Engine} engine @param {object} score parsed score.json */
  constructor(engine, score, { stem = "music", start = 7 } = {}) {
    Object.assign(this, { engine, score, stem });
    this.index = 0;
    this.phrase = null; this.position = 0; this.origin = 0;
    this.resumeAt = null; this.startDelay = start;
    this.holdUntil = 0; this.listening = false; this.silentUntilHome = false;
    this.ringing = new Set(); this.pending = null;
    this.available = new Set(Object.keys(engine.bank.zither?.notes ?? {}));
  }

  /** Launch one note at an absolute time. */
  note([pitch, beats, velocity, technique], when, { vel = 1 } = {}) {
    const { engine } = this, entry = engine.bank.zither.notes[pitch];
    if (!entry) return;
    const v = velocity * vel * engine.random.range(0.93, 1.05);
    const file = v > 0.5 ? entry.f : entry.mf ?? entry.f;
    const voice = engine.play(null, { stem: this.stem, file, when: when + engine.random.range(-0.012, 0.018), gain: dB(-26 * (1 - Math.min(1, v * 1.5))), lowpass: 900 + 6000 * v, pan: (midi(pitch) - 58) / 60 });
    if (!voice) return;
    const rate = voice.source.playbackRate, start = when;
    // A dan tranh is played with the left hand on the far side of the bridge: the pitch is a gesture.
    if (technique === "g") { rate.setValueAtTime(2 ** (-2 / 12), start); rate.exponentialRampToValueAtTime(1, start + 0.09); }
    else if (technique === "b") { rate.setValueAtTime(2 ** (1 / 12), start); rate.setValueAtTime(2 ** (1 / 12), start + 0.1); rate.exponentialRampToValueAtTime(1, start + 0.22); }
    else if (technique === "n") { rate.setValueAtTime(1, start + 0.45); rate.exponentialRampToValueAtTime(2 ** (1 / 12), start + 0.72); rate.setValueAtTime(2 ** (1 / 12), start + 1.0); rate.exponentialRampToValueAtTime(1, start + 1.35); }
    else if (technique === "v") {
      const lfo = engine.context.createOscillator(), depth = engine.context.createGain();
      lfo.frequency.value = engine.random.range(4.4, 5.6); depth.gain.setValueAtTime(0, start + 0.3); depth.gain.linearRampToValueAtTime(engine.random.range(14, 26), start + 0.9); depth.gain.linearRampToValueAtTime(0, start + 3.2);
      lfo.connect(depth); depth.connect(voice.source.detune); lfo.start(start + 0.3); lfo.stop(start + 3.3); engine.own?.(lfo);
    }
    this.ringing.add(voice); voice.source.addEventListener("ended", () => this.ringing.delete(voice));
    return voice;
  }

  /** Lay a hand across the strings: everything ringing stops, with the small sound of that. */
  damp(now) {
    for (const voice of this.ringing) voice.stop(now, 0.05);
    this.ringing.clear();
    if (this.engine.bank.knock) this.engine.play("knock", { stem: this.stem, when: now, gain: dB(-20), lowpass: 700, rate: 0.8 });
  }

  begin(phrase, now) { this.phrase = phrase; this.position = 0; this.origin = now; }

  /** Things that happened on stage. The player decides what they mean. */
  hear(cue, now) {
    switch (cue) {
      case "drop": // They look up. Whatever it was stops mid-air, and nothing begins until she has dealt with it.
        this.damp(now); this.phrase = null; this.silentUntilHome = true; this.pending = null; this.patience = now + 40; break;
      case "catch": // One note when the bowl arrives. It is the only time they play on her beat.
        this.note(["G#4", 0, 0.5], now); break;
      case "stamp": this.note(["C#3", 0, 0.62], now); this.engine.play("gongLight", { stem: "music", when: now, gain: dB(-12) }); break;
      case "home": this.silentUntilHome = false; this.answer("home", now); break;
      case "bell": this.phrase = null; if (!this.silentUntilHome) this.answer("bell", now); break;
      default:
    }
  }

  answer(name, now) {
    const answer = this.score.answers[name];
    this.pending = { phrase: answer, at: now + answer.wait };
    this.holdUntil = 0;
  }

  /**
   * Call regularly. While she speaks no new note begins: what is ringing rings, and they carry on from
   * where they were a breath after she stops.
   */
  tick(now, speaking) {
    if (speaking) {
      if (!this.listening) { this.listening = true; this.startDelay = 0; }
      this.holdUntil = now + this.engine.random.range(...LISTEN_AFTER);
      return;
    }
    this.listening = false;
    // If nobody picks the bowl up, they do eventually go back to playing.
    if (this.silentUntilHome && now > this.patience) this.silentUntilHome = false;
    if (now < this.holdUntil || this.silentUntilHome) return;
    if (this.resumeAt === null) this.resumeAt = now + this.startDelay;
    if (this.pending && now >= this.pending.at) { this.begin(this.pending.phrase, now); this.pending = null; }
    if (!this.phrase) {
      if (this.pending || now < this.resumeAt) return; // An answer owed comes before the next thing on the page.
      const { order, phrases } = this.score, id = order[this.index % order.length];
      this.index++;
      this.begin(phrases[id], now);
    }
    // Picking up mid-phrase after listening: no catching up, the next note simply comes next.
    const beat = this.score.beat, notes = this.phrase.notes;
    if (this.position < notes.length && this.next !== undefined && this.next < now - 0.5) this.next = now + 0.1;
    if (this.position === 0) this.next = now + 0.05;
    while (this.position < notes.length && this.next < now + LOOKAHEAD) {
      const note = notes[this.position], last = this.position === notes.length - 1;
      this.note(note, this.next);
      // A little give, and a little more at the end of a thought.
      this.next += note[1] * beat * this.engine.random.range(0.96, 1.05) * (last || this.position >= notes.length - 2 ? 1.08 : 1);
      if (note[1] === 0) this.next += 0.035; // the strum between two notes played together
      this.position++;
    }
    if (this.position >= notes.length && now > this.next - 0.4) {
      this.resumeAt = this.next + (this.phrase.rest ?? 6) * this.engine.random.range(0.8, 1.3);
      this.phrase = null;
    }
  }
}
