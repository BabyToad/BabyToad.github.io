// Her words as things in the room, simulated on the scene's ticks and independent of any renderer.
// Each word is a tiny puppet: a function of plain pose numbers (where it sits on the wall, how far
// off it, how much ink is left) that the stage turns into a lit card. Replay needs no extra state.

import { smooth } from "../math.js";
import { composePage, rectFree } from "./compose.js";

/** One word's material: ink is cut out and casts a shadow, water is a stain on the plaster. */
export const STYLE = {
  said: { material: "ink", font: "DalangInk", size: 33, leading: 1.26, fill: "#14100e", rest: 0.05, light: 0.14, heavy: 0.34, fall: 4, keep: 44, soak: 26, supersede: 10, ghost: 0.05, width: 300, lines: 4 },
  mutter: { material: "ink", font: "DalangInkMedium", size: 21, leading: 1.3, fill: "#231a15", rest: 0.02, light: 0.05, heavy: 0.1, fall: 2, keep: 20, soak: 18, supersede: 8, ghost: 0.03, width: 150, lines: 5 },
  ponder: { material: "ink", font: "DalangInkLight", size: 28, leading: 1.3, fill: "#231a12", rest: 0.03, light: 0.12, heavy: 0.2, fall: 7, keep: 24, soak: 44, supersede: 14, ghost: 0, width: 210, lines: 4 },
  sutra: { material: "water", font: "DalangWater", size: 48, leading: 1.22, fill: "#000000", rest: 0.004, light: 0.004, heavy: 0.004, fall: 0, keep: 40, soak: 84, supersede: 34, sentencePages: true, ghost: 0, width: 340, lines: 4 },
};

const GRAVITY = 0.0105, GHOSTS = 18;

/** Deterministic -1..1 from a word's identity, so a knocked word falls the same way on replay. */
function tumble(word, salt) {
  let h = 2166136261 >>> 0;
  for (const c of `${word.id}/${salt}`) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return (h >>> 8) / 16777216 * 2 - 1;
}

/** Group a score's words into pages: a jump in the direction or, for scripture, a new sentence. */
function pagesOf(words, register, phrasing) {
  const pages = [];
  let current = null, sentence = -1;
  for (const word of words) {
    const jump = phrasing[word.text.toLowerCase()];
    if (!current || jump || (STYLE[register].sentencePages && word.sentence !== sentence)) {
      current = { words: [], near: jump ? jump.near : null };
      pages.push(current);
    }
    current.words.push(word); sentence = word.sentence;
  }
  return pages;
}

const boundsOf = ({ s, t, width, size }) => ({ s0: s, s1: s + width, t0: t - size * 0.28, t1: t + size * 0.95 });

/**
 * Compose pages onto the wall, each in space no other writing holds. Sizes shrink before a page
 * gives up its own space. Failing that it may share, and the words beneath are told to clear fast.
 * A page with nowhere at all to go is split at its middle, then placed plainly as a last resort.
 */
function composePages(pages, wall, focus, register, occupancy, held = []) {
  const base = STYLE[register], size = base.size * wall.scale;
  const metrics = { size, leading: base.leading, width: base.width, lines: base.lines };
  const queue = [...pages], out = [];
  // Older pages of a line are gone or going by the time a third arrives, so only the last one is reserved.
  let previous = [];
  while (queue.length) {
    const page = queue.shift(), wanted = page.near ? { x: page.near[0], y: page.near[1] } : focus;
    // A direction can name a place a narrow screen does not show. It goes as near as it can.
    const limit = wall.map?.limit, target = limit ? { ...wanted, x: Math.max(limit[0] + 40, Math.min(limit[1] - 40, wanted.x)) } : wanted;
    const single = page.words.length === 1;
    const attempt = (scale, reserved) => composePage(page.words, wall, target, { ...metrics, size: size * scale }, occupancy, reserved);
    const taken = [...held, ...previous];
    const result = attempt(1, taken) ?? attempt(0.8, taken) ?? attempt(1, []) ?? attempt(0.8, []) ?? (single ? attempt(0.62, []) : null);
    if (result) { out.push(result); previous = result.placed.map(boundsOf); continue; }
    if (!single) {
      const middle = Math.ceil(page.words.length / 2);
      queue.unshift({ words: page.words.slice(0, middle), near: page.near }, { words: page.words.slice(middle), near: page.near });
      continue;
    }
    const origin = wall.wallAt(target), word = page.words[0];
    out.push({ placed: [{ word, s: origin.s, t: origin.t, width: word.widthEm * size, size, line: 0 }] });
  }
  return out;
}

export class Lettering {
  /** @param {object} wall {measure, wallAt, scale} supplied by the stage. Pure in tests. */
  constructor(wall) { this.wall = wall; this.words = []; this.tick = 0; this.nextId = 1; this.current = null; this.jolts = []; this.calm = false; this.heard = []; }

  /** What happened to words since last asked, for outputs such as sound. Nothing in the scene reads it. */
  drain() { const heard = this.heard; this.heard = []; return heard; }
  note(kind, word, tick = this.tick, extra = {}) {
    const [px] = this.wall.toPixel(word.s + word.width / 2, word.t);
    this.heard.push({ tick, kind, id: word.id, material: word.style.material, stress: word.stress, word: word.word, x: Math.max(0, Math.min(1, px / 1536)), ...extra });
  }

  /**
   * Put an utterance on the wall, composed around where she stands.
   * @param {object} score
   * @param {number} startTick
   * @param {object} direction the line's marks: `words` styling and `phrasing` places
   * @param {{focus:{x:number,y:number},occupancy:object[]}} stance from the speaker
   */
  say(score, startTick, direction, stance) {
    for (const word of this.words) if (["waiting", "arriving", "held"].includes(word.phase)) this.release(word, startTick);
    const uid = this.nextId++, base = STYLE[score.register];
    const prepared = score.words.map((w, i) => {
      const style = { ...base, ...direction.words?.[w.word] };
      return { ...w, index: i, style, widthEm: this.wall.measure(w.text, style) };
    });
    // What is still readable holds its space. Ghosts and fallen words do not.
    const visible = this.words.filter(w => ["arriving", "held", "soaking"].includes(w.phase) && w.erode < 0.5 && (w.style.ghost === 0 || w.ink > 0.3));
    const pages = composePages(pagesOf(prepared, score.register, direction.phrasing ?? {}), this.wall, stance.focus, score.register, stance.occupancy, visible.map(boundsOf));
    const placedBounds = pages.flatMap(page => page.placed.map(boundsOf));
    for (const word of visible) {
      const b = boundsOf(word);
      // It had nowhere else to go, so what is underneath gets out of the way quickly.
      if (placedBounds.some(r => b.s0 < r.s1 && b.s1 > r.s0 && b.t0 < r.t1 && b.t1 > r.t0)) { word.superseded = true; if (word.phase === "held") word.release = startTick; }
    }
    this.stance = { focus: stance.focus, register: score.register, utterance: uid };
    const pageStart = pages.map(page => startTick + page.placed[0].word.start);
    pages.forEach((page, pageIndex) => {
      for (const { word: w, s, t, width, size } of page.placed) {
        const style = w.style;
        // A word lands on its accented syllable, so the nod and the landing are the same event.
        const land = startTick + (w.stress === 2 ? w.accent : w.start);
        this.words.push({
          id: `${uid}.${w.index}`, utterance: uid, text: w.text, word: w.word, stress: w.stress, phrase: w.phrase, sentence: w.sentence, style, size, width, widthEm: w.widthEm,
          s, t, lift: 0, airborne: 0, rot: 0, sx: 1, sy: 1, ink: 1, erode: 0, reveal: 0, bleed: 0, drip: 0, flat: 0, velocity: [0, 0, 0], spin: 0, move: null, page: pageIndex,
          phase: "waiting", arrive: land - style.fall, voiceStart: startTick + w.start, voiceEnd: startTick + w.end,
          height: this.calm ? style.rest : w.stress === 2 ? style.heavy : style.light, stretch: style.stretch ?? 1, release: null,
          lineEnd: startTick + score.lastSound, nextPage: pageStart[pageIndex + 1] ?? null,
        });
      }
    });
    this.current = uid;
    this.jolts = score.words.filter(w => w.stress === 2).map(w => startTick + w.accent);
  }

  /** Words the current page has live on the wall that she is now standing in front of. */
  blocked(occupancy) {
    return this.words.filter(w => w.utterance === this.current && w.style.material === "ink" && ["waiting", "arriving", "held"].includes(w.phase) && !w.move
      && !rectFree(this.wall, w.s, w.t, w.s + w.width, w.t + w.size * 0.7, occupancy, true));
  }

  /**
   * She has stepped in front of what she said. Words are not painted on: they hop out from behind
   * her to the nearest place they fit, in reading order, in the same three-beat hop she uses.
   * Water cannot do this, since it is in the plaster. She just stands in front of it.
   */
  makeWay(tick, focus, occupancy) {
    const live = this.words.filter(w => w.utterance === this.current && w.style.material === "ink" && ["waiting", "arriving", "held"].includes(w.phase));
    const moved = [];
    for (const group of Map.groupBy(live, w => w.page).values()) {
      const words = group.map(w => ({ ...w, ref: w }));
      const others = live.filter(w => w.page < group[0].page).map(boundsOf);
      const pages = composePages([{ words, near: [focus.x, focus.y] }], this.wall, focus, this.stance.register, occupancy, others);
      pages.flatMap(p => p.placed).forEach(({ word, s, t }, order) => {
        const ref = word.ref;
        if (Math.hypot(ref.s - s, ref.t - t) < 0.02) return;
        // With motion reduced a word is simply elsewhere next time you look: no hop.
        if (ref.phase === "waiting" || this.calm) { ref.s = s; ref.t = t; return; }
        ref.move = { from: [ref.s, ref.t], to: [s, t], start: tick + order, length: 9 };
        moved.push(ref);
      });
    }
    return moved;
  }

  release(word, tick) {
    if (word.phase === "waiting") word.phase = "gone";
    else if (word.release === null || word.release > tick) word.release = tick;
  }

  /** The voice stopped short: what was not yet said is never written. */
  hush(tick) {
    for (const word of this.words) {
      if (word.utterance !== this.current) continue;
      if (word.phase === "waiting") word.phase = "gone";
      else if (word.release === null) word.release = tick + 30;
    }
    this.jolts = [];
  }

  /** A blow to the wall. Near words come off; far ones only shiver. */
  knock(tick, origin, reach = 3.2) {
    for (const word of this.words) {
      if (word.style.material !== "ink" || !["arriving", "held"].includes(word.phase)) continue;
      const distance = origin ? Math.hypot(word.s + word.width / 2 - origin.s, word.t - origin.t) : 0;
      if (distance < reach) this.dislodge(word, 1 - distance / reach);
      else word.shiver = tick;
    }
  }

  dislodge(word, strength = 1) {
    this.note("word-knocked", word);
    // With motion reduced a knocked word fades where it is instead of tumbling down the wall.
    if (this.calm) { word.superseded = true; word.release = this.tick; return; }
    word.phase = "falling"; word.move = null;
    word.velocity = [tumble(word, "x") * 0.012 * (0.5 + strength), 0.008 * tumble(word, "y") + 0.012 * strength, 0.006 + 0.009 * Math.abs(tumble(word, "z"))];
    word.spin = tumble(word, "spin") * 0.05;
    word.lift = Math.max(word.lift, 0.12);
  }

  step(tick) {
    this.tick = tick;
    const jolt = this.jolts.includes(tick);
    for (const word of this.words) this.stepWord(word, tick, jolt);
    this.words = this.words.filter(w => w.phase !== "gone");
    const ghosts = this.words.filter(w => w.phase === "ghost");
    for (const old of ghosts.slice(0, Math.max(0, ghosts.length - GHOSTS))) old.phase = "gone";
  }

  stepWord(word, tick, jolt) {
    if (word.phase === "waiting") {
      if (tick < word.arrive) return;
      word.phase = "arriving"; word.lift = word.height; word.reveal = word.style.material === "water" ? 0 : 1;
      if (word.style.material === "water") this.note("brush-start", word, tick);
    }
    if (word.bleed < 1 && word.reveal > 0) word.bleed = Math.min(1, word.bleed + 1 / 30);
    if (word.phase === "arriving") this.arriving(word, tick);
    else if (word.phase === "held") this.held(word, tick, jolt);
    else if (word.phase === "soaking") this.soaking(word, tick);
    else if (word.phase === "falling") this.falling(word, tick);
    else if (word.phase === "floor") this.lying(word, tick);
    else if (word.phase === "eaten") this.eaten(word, tick);
    if (word.stretch !== 1 && tick >= word.voiceStart && word.phase !== "falling" && word.phase !== "floor") {
      word.sy = 1 + (word.stretch - 1) * smooth((tick - word.voiceStart) / Math.max(6, word.voiceEnd - word.voiceStart + 8));
    }
  }

  arriving(word, tick) {
    const style = word.style;
    if (style.material === "water") {
      // A brush goes across at the speed of the voice.
      word.reveal = Math.min(1, Math.max(0, (tick - word.voiceStart + 2) / Math.max(4, word.voiceEnd - word.voiceStart)));
      word.lift = style.rest;
      if (word.reveal >= 1) { word.phase = "held"; this.note("brush-end", word, tick); }
      return;
    }
    const age = tick - word.arrive;
    if (age >= style.fall) {
      // Contact: ink meets plaster with a little give, and the shadow closes under it.
      word.lift = style.rest; word.phase = "held";
      this.note("word-land", word, tick, { size: word.size / this.wall.scale });
      word.sx = 1.05; if (word.stretch === 1) word.sy = 0.92;
      return;
    }
    const u = age / style.fall;
    word.lift = style.rest + (word.height - style.rest) * (1 - u * u);
  }

  held(word, tick, jolt) {
    const style = word.style;
    word.sx += (1 - word.sx) * 0.42;
    if (word.stretch === 1) word.sy += (1 - word.sy) * 0.42;
    word.lift += ((jolt && word.stress !== 2 ? style.rest + 0.025 : style.rest) - word.lift) * 0.4;
    if (word.move) {
      const u = (tick - word.move.start) / word.move.length;
      if (tick === word.move.start) this.note("word-hop", word, tick);
      if (u >= 1) { [word.s, word.t] = word.move.to; word.move = null; }
      else if (u > 0) {
        const eased = smooth(u);
        word.s = word.move.from[0] + (word.move.to[0] - word.move.from[0]) * eased;
        word.t = word.move.from[1] + (word.move.to[1] - word.move.from[1]) * eased;
        // It leaves the wall and comes back, so the shadow tells you it jumped.
        word.lift = style.rest + 0.3 * Math.sin(Math.PI * u);
        word.sy = u < 0.15 ? 0.92 : u > 0.85 ? 0.94 : 1.03;
      }
    }
    word.rot = word.shiver !== undefined && tick - word.shiver < 10 ? Math.sin((tick - word.shiver) * 2.4) * 0.016 * (1 - (tick - word.shiver) / 10) : 0;
    // A page gives way as the next arrives, but is never gone before it has been read.
    if (word.nextPage !== null && tick >= Math.max(word.nextPage - (style.supersede ?? 0) - 1, word.voiceEnd + 18)) { this.release(word, tick); word.superseded = true; }
    if (style.material === "water") {
      word.drip = Math.min(1, word.drip + 1 / 26);
      // Water does not wait for the line to end: earlier sentences are already drying.
      this.release(word, Math.min(word.lineEnd + style.keep, word.voiceEnd + 62));
    } else {
      this.release(word, word.lineEnd + style.keep + word.text.length);
    }
    if (word.release !== null && tick >= word.release) { word.phase = "soaking"; word.soakStart = tick; }
  }

  soaking(word, tick) {
    const style = word.style, u = Math.min(1, (tick - word.soakStart) / (word.superseded ? style.supersede ?? style.soak : style.soak));
    word.lift += (Math.max(0.002, style.rest * 0.1) - word.lift) * 0.14;
    if (style.ghost > 0) {
      // The plaster keeps a little of everything she has said.
      word.ink = style.ghost + (1 - style.ghost) * (1 - smooth(u));
      if (u >= 1) { word.phase = "ghost"; word.lift = 0.002; }
      return;
    }
    if (style.material === "water") word.drip = 1;
    word.erode = smooth(u);
    if (u >= 1) word.phase = "gone";
  }

  falling(word, tick) {
    const v = word.velocity;
    v[1] -= GRAVITY;
    word.s += v[0]; word.t += v[1]; word.lift += v[2];
    word.airborne = Math.min(1, word.airborne + 1 / 8);
    word.rot += word.spin;
    word.sx = 1; word.sy = 1;
    // The floor is t = 0 at the wall's foot. The word comes to rest there with its descenders above it.
    if (word.t <= word.size * 0.15) {
      this.note("word-floor", word, tick, { speed: Math.abs(v[1]) * 24 });
      word.t = word.size * 0.28; word.phase = "floor"; word.landed = tick; word.airborne = 1;
      word.lift = Math.max(word.lift, word.size * 1.1);
      word.tilted = word.rot;
    }
  }

  lying(word, tick) {
    const age = tick - word.landed;
    word.flat = smooth(age / 6);
    word.rot = word.tilted * (1 - word.flat * 0.5);
    if (age > 520) {
      word.ink = Math.max(0, 1 - (age - 520) / 40);
      if (word.ink <= 0) word.phase = "gone";
    }
  }

  /** Something eats a word off the floor: it is pulled to `mouth` over a few ticks, then gone. */
  eat(tick, mouth) {
    const word = this.words.filter(w => w.phase === "floor").sort((a, b) => Math.hypot(a.s - mouth.s, a.lift - mouth.lift) - Math.hypot(b.s - mouth.s, b.lift - mouth.lift))[0];
    if (!word) return null;
    word.phase = "eaten"; word.eatenAt = tick; word.mouth = mouth; word.from = { s: word.s, lift: word.lift };
    this.note("word-eaten", word, tick);
    return word;
  }

  eaten(word, tick) {
    const u = (tick - word.eatenAt) / 7;
    if (u >= 1) { word.phase = "gone"; return; }
    // Out and back on one flick: the tongue reaches for three ticks, and the word rides it home.
    const home = u < 0.4 ? 0 : smooth((u - 0.4) / 0.6);
    word.s = word.from.s + (word.mouth.s - word.from.s) * home;
    word.lift = word.from.lift + (word.mouth.lift - word.from.lift) * home;
    word.sx = word.sy = 1 - home * 0.6;
  }

  /** A frog that hops while it eats takes the word home to where its mouth is now. */
  followMouth(mouth) { for (const word of this.words) if (word.phase === "eaten") word.mouth = mouth; }

  /** Stable text of everything visible, for diagnostics and replay tests. */
  fingerprint() {
    return this.words.map(w => [w.id, w.phase, w.s, w.t, w.lift, w.ink, w.erode, w.reveal, w.rot, w.flat].join()).join("|");
  }
}
