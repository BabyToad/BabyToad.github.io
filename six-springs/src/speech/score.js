// A score is one utterance as integer scene ticks: words, stress, mouth drawings and body tracks.
// It is compiled once, by a pure function, from an alignment (a voice take's or the written timing
// model's). Mouth, body, lettering and audio all read this one timeline, so there is nothing to
// synchronize between them and nothing here that needs a clock, an audio file or a browser.

import { Follow } from "../motion/follow.js";
import { MOUTH, EYES, EYE_SETS, BROWS, bare, breakWeight, isLetter, isLight, nuclei, phraseStress, stressedNucleus, vowelShape } from "./text.js";

export const SPEECH_RATE = 24;

/** How each register carries the body. Numbers are authored, in the rig's control units. */
export const REGISTER = Object.freeze({
  said: { breath: 1, nod: 1, opens: 1.6, chin: -0.16, roll: 2.2, eyes: "normal", touch: "press", hold: 26, lead: 13, blinkOnBreak: 1 },
  mutter: { breath: 0.45, nod: 0.45, opens: 9, chin: 0.2, roll: 1, eyes: "down", touch: "chew", hold: 14, lead: 7, blinkOnBreak: 0.6 },
  ponder: { breath: 1.25, nod: 0.3, opens: 1.8, chin: -0.5, roll: 3.2, eyes: "normal", touch: "press", hold: 40, lead: 18, blinkOnBreak: 1 },
  sutra: { breath: 0.8, nod: 0.08, opens: 2.1, chin: 0.12, roll: 0.15, eyes: "normal", touch: "press", hold: 80, lead: 26, blinkOnBreak: 1 },
});

// A nod is drawn, not simulated: a small lift, a quick drop, a slow return with a little rebound.
const NOD = [[-4, 0], [-2, -0.22], [1, 1], [4, 0.72], [9, 0.12], [13, -0.08], [18, 0]];
const BLINK = [0.5, 0, 0, 0.5];
// She enters on her normal eyes and leaves on them, hidden in a blink. An eye set is an identity, so a
// fade cannot pass through another one, but a cut in the middle of a fade-in would still read as a tic.
const EYE_SAFE = 6;

const between = (curve, x) => {
  if (x <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) if (x <= curve[i][0]) {
    const [x0, y0] = curve[i - 1], [x1, y1] = curve[i];
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return curve.at(-1)[1];
};

/** Small deterministic hash, so a line's small variations stay the same on every replay. */
function hashed(text, seed = 1) {
  let h = (2166136261 ^ seed) >>> 0;
  for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
}

/**
 * Words of an alignment, with their seconds and character ranges.
 * @param {{characters:string[],start:number[],end:number[]}} alignment
 */
export function alignedWords({ characters, start, end }) {
  const words = [];
  let current = null;
  characters.forEach((c, i) => {
    if (/\s/.test(c)) { current = null; return; }
    if (!current) { current = { text: "", first: i, chars: [] }; words.push(current); }
    current.text += c;
    current.chars.push(i);
  });
  for (const w of words) {
    const letters = w.chars.filter(i => isLetter(characters[i]));
    const span = letters.length ? letters : w.chars;
    w.letters = span;
    w.start = start[span[0]];
    w.end = end[span.at(-1)];
    w.word = bare(w.text);
  }
  return words;
}

function assignPhrases(words) {
  let phrase = 0, sentence = 0;
  words.forEach((w, i) => {
    w.phrase = phrase; w.sentence = sentence; w.break = breakWeight(w.text);
    const gap = i + 1 < words.length ? words[i + 1].start - w.end : 0;
    if (w.break || gap > 0.28) phrase++;
    if (w.break >= 2) sentence++;
  });
}

/** Stress from text, corrected by what the voice actually did where one exists. */
function assignStress(words, onset, loudness, direction) {
  const phrases = Map.groupBy(words, w => w.phrase);
  for (const members of phrases.values()) {
    const levels = phraseStress(members.map(w => w.text));
    members.forEach((w, i) => { w.stress = levels[i]; });
    if (loudness) {
      let best = null, bestScore = -1;
      for (const w of members) {
        const first = w.startTick - onset, last = Math.max(first, w.endTick - onset);
        const peak = Math.max(0, ...loudness.slice(first, last + 1));
        const perSyllable = (last - first + 1) / nuclei(w.word).length;
        w.acoustic = peak * (0.6 + Math.min(perSyllable / 7, 1));
        const score = w.acoustic * (isLight(w.text) ? 0.55 : 1);
        if (score > bestScore) { bestScore = score; best = w; }
      }
      for (const w of members) if (w.stress === 2) w.stress = 1;
      if (best) best.stress = 2;
    }
  }
  for (const w of words) if (direction.stress?.includes(w.word)) w.stress = 2;
  for (const w of words) if (direction.light?.includes(w.word)) w.stress = 0;
}

/**
 * The mouth, as limited animation: a syllable picks a drawing and the drawing holds. Light words
 * stay in the slit. Syllables too quick to be seen get swallowed rather than flapped. Sound lags
 * the drawing by a tick, because that is the direction the eye forgives.
 */
function compileMouth(words, alignment, onset, ticks, register, loudness) {
  const settings = REGISTER[register], tickOf = s => onset + Math.round(s * SPEECH_RATE);
  const events = [];
  for (const w of words) {
    const syllables = nuclei(w.word), main = stressedNucleus(w.word, syllables.length);
    syllables.forEach((n, index) => {
      const char = w.letters[Math.min(w.letters.length - 1, n.at)];
      const tick = tickOf(alignment.start[char]);
      const weight = (index === main ? w.stress : 0) + (loudness && (loudness[tick - onset] ?? 0) > 0.72 ? 0.7 : 0);
      const wants = vowelShape(n.text);
      let shape = MOUTH.slit;
      if (weight >= settings.opens) shape = wants;
      else if (wants === MOUTH.wide && weight >= settings.opens - 0.8) shape = MOUTH.wide;
      else if (wants === MOUTH.round && weight >= settings.opens - 0.8) shape = MOUTH.round;
      events.push({ tick, shape, weight: 1 + weight });
    });
    // Closures are the sharpest thing a mouth does. They read at any size.
    w.letters.forEach((char, offset) => {
      if (/[mbp]/.test(w.word[offset] ?? "")) events.push({ tick: tickOf(alignment.start[char]), shape: MOUTH.press, weight: 1.2 });
      // The art lane calls this the weakest distinction, so only leaned-on words get it.
      else if (w.stress >= 1 && /[fv]/.test(w.word[offset] ?? "")) events.push({ tick: tickOf(alignment.start[char]), shape: MOUTH.fv, weight: 1.1 });
    });
  }
  events.sort((a, b) => a.tick - b.tick || b.weight - a.weight);

  // Never faster than twos. When two drawings collide, the heavier one wins; a later one may slip a tick.
  const kept = [];
  for (const e of events) {
    const last = kept.at(-1);
    if (!last || e.tick - last.tick >= 2) { kept.push({ ...e }); continue; }
    if (e.weight > last.weight + 0.5) kept.push({ ...e, tick: last.tick + 2 });
  }

  // A long run of one drawing while sound is changing reads as a stuck mouth, even a proud one.
  // The lips touch briefly before the next syllable, which is what limited animation calls a chew.
  for (let i = kept.length - 1; i > 0; i--) {
    const a = kept[i - 1], b = kept[i];
    if (a.shape === MOUTH.slit && b.shape === MOUTH.slit && b.tick - a.tick >= 5) kept.splice(i, 0, { tick: b.tick - 2, shape: MOUTH[settings.touch], weight: 0 });
  }
  const track = new Array(ticks).fill(MOUTH.rest);
  const shut = [];
  words.forEach((w, i) => {
    const next = words[i + 1];
    const endTick = tickOf(alignment.end[w.letters.at(-1)]);
    // Between words of a phrase the lips simply stay parted. Between phrases they come together.
    if (!next) shut.push(endTick + 1);
    else if (next.start - w.end > 0.2) shut.push(endTick + 1);
  });
  const parted = tickOf(words[0].start) - 3;
  let shape = MOUTH.rest;
  const at = new Map(kept.map(e => [e.tick - 1, e.shape]));
  const closes = new Set(shut);
  const reopen = [parted, ...words.slice(1).filter((w, i) => w.start - words[i].end > 0.45).map(w => tickOf(w.start) - 2)];
  const parts = new Set(reopen);
  let pressed = 0;
  for (let t = 0; t < ticks; t++) {
    if (parts.has(t)) shape = MOUTH.slit;
    if (at.has(t)) shape = at.get(t);
    if (closes.has(t)) { shape = MOUTH.press; pressed = 3; }
    else if (pressed > 0 && --pressed === 0) shape = MOUTH.rest;
    track[t] = shape;
  }
  // Closures and phrase ends can still collide with a syllable. A one-tick drawing is never kept.
  for (let t = 1; t < ticks - 1; t++) if (track[t] !== track[t - 1] && track[t] !== track[t + 1]) track[t] = track[t - 1];
  return track;
}

function lookPlan(words, direction, register, onset) {
  const defaults = { said: "you", mutter: "down", ponder: "up", sutra: "ahead" };
  const raw = direction.look ?? defaults[register];
  const list = typeof raw === "string" ? [[0, raw]] : raw;
  return list.map(([when, target]) => {
    let tick = onset - 8;
    if (typeof when === "string") {
      const word = words.find(w => w.word === when);
      if (word) tick = word.startTick - 3;
    } else if (when > 0) tick = words[Math.min(words.length - 1, when)].startTick - 3;
    return { tick: Math.max(EYE_SAFE, tick), target };
  });
}

/**
 * Compile one utterance.
 * @param {object} input
 * @param {string} input.text
 * @param {"said"|"mutter"|"ponder"|"sutra"} input.register
 * @param {{characters:string[],start:number[],end:number[]}} input.alignment seconds from first sound
 * @param {number[]} [input.loudness] per tick from first sound, 0..1; only a voice has it
 * @param {object} [input.direction] look, after, stress, light, smile, brow, moves, and word styling
 * @param {Record<string,{gaze:number,yaw:number,pitch:number,roll?:number}>} input.targets
 * @param {number} [input.seed]
 */
export function compileScore({ text, register, alignment, loudness = null, direction = {}, targets, seed = 1 }) {
  const settings = REGISTER[register];
  if (!settings) throw new Error(`Unknown register ${register}`);
  if (!targets) throw new Error("A score needs gaze targets");
  if (![alignment.characters.length, alignment.start.length, alignment.end.length].every(n => n === alignment.characters.length)) throw new Error("Malformed alignment");
  const words = alignedWords(alignment);
  if (!words.length) throw new Error("Nothing to say");
  const random = hashed(text, seed);

  const onset = settings.lead + 4;
  const tickOf = s => onset + Math.round(s * SPEECH_RATE);
  for (const w of words) { w.startTick = tickOf(w.start); w.endTick = Math.max(w.startTick + 1, tickOf(w.end)); }
  assignPhrases(words);
  assignStress(words, onset, loudness, direction);
  const lastSound = words.at(-1).endTick;
  const ticks = lastSound + settings.hold + 1;

  const mouth = compileMouth(words, alignment, onset, ticks, register, loudness);

  // Beats. The head does not nod per syllable: a nuclear accent nods, a strong content word may
  // nod lightly, and two nods never crowd each other.
  const beats = [];
  for (const w of words) {
    if (w.stress < 1) continue;
    const syllables = nuclei(w.word), char = w.letters[Math.min(w.letters.length - 1, syllables[stressedNucleus(w.word, syllables.length)].at)];
    const tick = tickOf(alignment.start[char]);
    w.accentTick = tick;
    const weight = w.stress === 2 ? 1 : 0.35;
    const last = beats.at(-1);
    if (last && tick - last.tick < 13) {
      if (weight > last.weight) beats[beats.length - 1] = { tick, weight, word: w.word };
      continue;
    }
    beats.push({ tick, weight, word: w.word });
  }

  // Each new phrase takes a little breath if it has time, and a small new head attitude.
  const phrases = [...Map.groupBy(words, w => w.phrase).values()].map(members => ({
    start: members[0].startTick, end: members.at(-1).endTick, sentence: members[0].sentence, break: members.at(-1).break,
    words: members.map(w => words.indexOf(w)),
  }));
  const breaths = [{ start: onset - settings.lead, peak: onset - 1, size: 1 }];
  phrases.forEach((p, i) => {
    if (i && p.start - phrases[i - 1].end >= 8) breaths.push({ start: Math.max(phrases[i - 1].end + 1, p.start - 9), peak: p.start - 1, size: 0.55 });
  });

  const blinks = new Set();
  phrases.forEach((p, i) => {
    if (random() <= settings.blinkOnBreak && p.break >= 1 && (phrases[i + 1]?.start ?? p.end + 12) - p.end >= 7) blinks.add(p.end + 2);
  });

  // Attention. The eyes jump, the head arrives later. A long saccade usually carries a blink.
  const look = lookPlan(words, direction, register, onset);
  if (direction.after) look.push({ tick: lastSound + Math.min(12, settings.hold - 8), target: direction.after });
  for (let i = 0; i < look.length; i++) {
    const from = targets[i ? look[i - 1].target : "you"], to = targets[look[i].target];
    if (!to) throw new Error(`Unknown gaze target ${look[i].target}`);
    if (from && Math.abs(from.yaw - to.yaw) + Math.abs(from.pitch - to.pitch) > 0.7) blinks.add(Math.max(0, look[i].tick - 1));
  }

  const keys = ["mouth", "browSet", "eyeSet", "gaze", "yaw", "pitch", "head", "eyeOpen", "browL", "browR", "smile", "bob", "spine", "uarmL", "uarmR", "farmL", "farmR", "handL"];
  const tracks = Object.fromEntries(keys.map(k => [k, new Array(ticks).fill(0)]));
  // How much of her attention is on whoever she is talking to. That person is the pointer, when there is one.
  const attend = new Array(ticks).fill(0), attendFollow = new Follow(2.4, 1, 0, 0, SPEECH_RATE);
  tracks.mouth = mouth;
  const yaw = new Follow(1.9, 0.82, 0.3, 0, SPEECH_RATE), pitch = new Follow(1.9, 0.82, 0.3, 0, SPEECH_RATE), roll = new Follow(0.8, 0.9, 0, 0, SPEECH_RATE);
  const browFollow = new Follow(3, 0.6, 0, 0, SPEECH_RATE);
  let lookIndex = -1, eyes = 0, headTarget = { yaw: 0, pitch: 0, roll: 0 }, eyeSet = EYE_SETS.normal, toYou = 1;
  const rolls = phrases.map((p, i) => (i % 2 ? 1 : -1) * settings.roll * (0.55 + 0.45 * random()));

  for (let t = 0; t < ticks; t++) {
    while (lookIndex + 1 < look.length && look[lookIndex + 1].tick <= t) {
      lookIndex++;
      const target = targets[look[lookIndex].target];
      eyes = target.gaze;
      eyeSet = EYE_SETS[target.eyes ?? settings.eyes];
      toYou = target.you ? 1 : 0;
      headTarget = { yaw: target.yaw, pitch: target.pitch, roll: target.roll ?? 0 };
    }
    // The head answers a few ticks behind the eyes.
    const y = yaw.step(headTarget.yaw);
    const p = pitch.step(headTarget.pitch + settings.chin);
    let nod = 0;
    for (const beat of beats) nod += beat.weight * between(NOD, t - beat.tick);
    const phrase = phrases.findLastIndex(q => q.start - 6 <= t);
    const r = roll.step((phrase >= 0 ? rolls[phrase] : 0) + headTarget.roll);

    let breath = 0;
    for (const b of breaths) {
      if (t < b.start) continue;
      if (t <= b.peak) breath = Math.max(breath, b.size * (t - b.start) / (b.peak - b.start || 1));
      else breath = Math.max(breath, b.size * Math.max(0, 1 - (t - b.peak) / 70));
    }
    attend[t] = attendFollow.step(toYou);
    tracks.eyeSet[t] = t < EYE_SAFE || t >= ticks - EYE_SAFE - 1 ? EYE_SETS.normal : eyeSet;
    let eyeOpen = EYES.normal;
    for (const blink of blinks) if (t >= blink && t < blink + BLINK.length) eyeOpen = Math.min(eyeOpen, BLINK[t - blink]);
    const brow = browFollow.step(beats.some(b => b.weight === 1 && t >= b.tick - 3 && t < b.tick + 5) ? 1 : 0);

    tracks.gaze[t] = eyes;
    tracks.yaw[t] = y;
    tracks.pitch[t] = p + nod * 0.17 * settings.nod - breath * 0.05 * settings.breath;
    tracks.head[t] = r + nod * 0.7 * settings.nod;
    tracks.eyeOpen[t] = eyeOpen;
    tracks.browL[t] = -brow * (register === "ponder" ? 3.5 : 0.8);
    tracks.browR[t] = -brow * (register === "ponder" ? 5.5 : 2.2);
    tracks.bob[t] = -breath * 3.4 * settings.breath + nod * 1 * settings.nod;
    tracks.spine[t] = nod * 0.35 * settings.nod;
    const shoulder = breath * 1.5 * settings.breath;
    tracks.uarmL[t] = shoulder;
    tracks.uarmR[t] = -shoulder;
  }

  applyMoves(tracks, words, direction, ticks, lastSound);
  applyFace(tracks, words, direction, ticks, lastSound);
  // Leaving an acting eye for her normal one is a cut, so hide it in a blink.
  const leave = ticks - EYE_SAFE - 1 - BLINK.length + 1;
  if (tracks.eyeSet[leave - 1] !== EYE_SETS.normal) BLINK.forEach((v, i) => { tracks.eyeOpen[leave + i] = v; });

  // Fade every additive track back to nothing by the end so the actor's release has nothing to do.
  const tail = 10;
  for (const key of ["yaw", "pitch", "head", "bob", "spine", "browL", "browR", "smile", "uarmL", "uarmR", "farmL", "farmR", "handL"]) {
    for (let i = 0; i < tail; i++) tracks[key][ticks - 1 - i] *= smoothRamp(i / tail);
  }
  return {
    format: 1, text, register, ticks, onset, lastSound, words: words.map(publicWord),
    phrases, beats, tracks, attend, voiced: !!loudness,
  };
}

const smoothRamp = u => u * u * (3 - 2 * u);

/**
 * Held changes of expression: `[["it",{brow:"skeptical"}],["end",{mouth:"smirk",eyes:"heavy"}]]`.
 * An `end` mouth takes over once she has stopped talking, and holds until just before she lets go.
 */
function applyFace(tracks, words, direction, ticks, lastSound) {
  for (const [when, face] of direction.face ?? []) {
    const word = typeof when === "string" ? words.find(w => w.word === when) : words[when];
    const from = when === "end" ? lastSound + 4 : word?.startTick ?? 0;
    const until = ticks - EYE_SAFE - 1;
    for (let t = from; t < until; t++) {
      if (face.brow) tracks.browSet[t] = BROWS[face.brow];
      if (face.eyes) tracks.eyeSet[t] = EYE_SETS[face.eyes];
      if (face.mouth) tracks.mouth[t] = MOUTH[face.mouth];
    }
  }
}

/** Authored acting anchored on words: `{at:"arm",offset:-4,tracks:{uarmL:[[0,0],[20,-16]]}}`. */
function applyMoves(tracks, words, direction, ticks, lastSound) {
  for (const key of ["smile", "brow"]) {
    for (const [when, value] of direction[key] ?? []) {
      const word = typeof when === "string" ? words.find(w => w.word === when) : words[when];
      const from = when === "end" ? lastSound : word?.startTick ?? 0;
      for (let t = from; t < ticks; t++) {
        const u = smoothRamp(Math.min(1, (t - from) / 10));
        if (key === "smile") tracks.smile[t] += value * u;
        else { tracks.browL[t] += value * u; tracks.browR[t] += value * u; }
      }
    }
  }
  for (const move of direction.moves ?? []) {
    const word = words.find(w => w.word === move.at);
    const from = (move.at === "end" ? lastSound : word?.startTick ?? 0) + (move.offset ?? 0);
    for (const [key, curve] of Object.entries(move.tracks)) {
      if (!tracks[key]) throw new Error(`Unknown move track ${key}`);
      for (let t = 0; t < ticks; t++) {
        const eased = between(curve, t - from);
        tracks[key][t] += eased;
      }
    }
  }
}

const publicWord = w => ({
  text: w.text, word: w.word, start: w.startTick, end: w.endTick, stress: w.stress,
  accent: w.accentTick ?? w.startTick, phrase: w.phrase, sentence: w.sentence, break: w.break,
});

/**
 * The score as an Actor source. Additive tracks ride on whatever the lower layers do, so her idle
 * sway keeps going underneath speech. Eye drawings and aperture are absolute.
 * @param {object} score
 * @param {() => {gaze:number,yaw:number,pitch:number}} [you] where the person she addresses is, now
 */
export function speechSource(score, you = null) {
  const absolute = new Set(["eyeOpen", "eyeSet"]);
  const attention = new Set(["gaze", "yaw", "pitch"]);
  // Mouth and brow drawings are identities, not quantities: the speaker applies them after all fading.
  const keys = Object.keys(score.tracks).filter(key => key !== "mouth" && key !== "browSet");
  return {
    keys,
    duration: score.ticks - 1,
    markers: [
      { tick: score.onset, name: "onset" },
      ...score.words.map(w => ({ tick: w.start, name: `word:${w.word}` })),
      { tick: score.lastSound, name: "last-sound" },
    ].sort((a, b) => a.tick - b.tick),
    sample(age, { pose }) {
      const t = Math.min(score.ticks - 1, age), patch = {};
      for (const key of keys) {
        const value = score.tracks[key][t];
        if (absolute.has(key)) patch[key] = value;
        // Attending is to whoever she is talking to, resolved live: not whatever the lower layers happen to be looking at.
        else if (attention.has(key)) patch[key] = value + ((you ? you()[key] : pose[key]) - value) * score.attend[t];
        else patch[key] = pose[key] + value;
      }
      return patch;
    },
  };
}
