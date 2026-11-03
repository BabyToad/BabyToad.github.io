// A small sound engine over Web Audio. It works on an AudioContext or an OfflineAudioContext, because
// we cannot hear this: the same graph is rendered silently to a file and measured (tests/sound-render.py).
// Everything is scheduled on absolute times, supplied by the caller, and nothing touches the scene.

export const dB = x => 10 ** (x / 20);

/** A private generator. The scene's own random stream is never drawn from, so sound cannot alter a replay. */
export function generator(seed = 11) {
  let a = seed >>> 0;
  const next = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  return next;
}

/** Equal-power crossfade shapes, so two uncorrelated textures keep their loudness through a join. */
const rise = new Float32Array(64).map((_, i) => Math.sin((i / 63) * Math.PI / 2)), fall = rise.slice().reverse();

/** A stone alcove with open air beyond it: a few early reflections, a short room, a long thin tail. Numbers, no file. */
function roomResponse(context, seed = 3) {
  const random = generator(seed), length = Math.floor(context.sampleRate * 1.8), buffer = context.createBuffer(2, length, context.sampleRate);
  const early = [[0.011, 0.55], [0.017, 0.42], [0.029, 0.3], [0.041, 0.22], [0.063, 0.14]];
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    let low = 0;
    for (let i = 0; i < length; i++) {
      const t = i / context.sampleRate, noise = random() * 2 - 1;
      // High frequencies die first, as they do on damp stone and in leaves.
      const cutoff = 0.08 + 0.5 * Math.exp(-t / 0.12);
      low += (noise - low) * cutoff;
      data[i] = low * (0.34 * Math.exp(-t / 0.13) + 0.05 * Math.exp(-t / 0.55)) * Math.min(1, t / 0.008);
    }
    for (const [time, gain] of early) data[Math.floor((time * (1 + c * 0.07)) * context.sampleRate)] += gain * (c ? -1 : 1) * (random() < 0.5 ? -1 : 1);
  }
  return buffer;
}

export class Engine {
  /**
   * @param {object} o
   * @param {BaseAudioContext} o.context
   * @param {AudioNode} o.bed ducked bus, room tone and music
   * @param {AudioNode} o.sfx unducked bus
   * @param {object} o.mix parsed mix.json
   * @param {object} o.bank parsed bank.json
   * @param {URL} o.baseURL where the bank's files live
   */
  constructor({ context, bed, sfx, mix, bank, baseURL, random }) {
    Object.assign(this, { context, mix, bank: bank.sounds, baseURL, random: random ?? generator() });
    this.buffers = new Map(); this.last = new Map(); this.stems = {}; this.extension = null; this.owned = new Set(); this.closed = false;
    this.room = context.createConvolver(); this.room.buffer = roomResponse(context);
    this.roomReturn = context.createGain(); this.roomReturn.gain.value = dB(mix.room?.return ?? 0);
    this.room.connect(this.roomReturn); this.roomReturn.connect(sfx);
    for (const [name, stem] of Object.entries(mix.stems)) {
      const fader = context.createGain(), send = context.createGain(), bus = stem.bus === "bed" ? bed : sfx;
      fader.gain.value = dB(stem.db); send.gain.value = stem.send === undefined ? 0 : dB(stem.send);
      fader.connect(bus); fader.connect(send); send.connect(this.room);
      this.stems[name] = { fader, send, db: stem.db, muted: false, limit: stem.voices ?? 6, sounding: [] };
    }
  }

  /** Remember anything that makes sound by itself, so that closing the engine can stop it. */
  own(source) {
    this.owned.add(source);
    source.addEventListener("ended", () => this.owned.delete(source));
    return source;
  }

  /** Stop everything and leave nothing connected. Safe to call twice, and final: nothing can start afterwards. */
  close() {
    if (this.closed) return;
    this.closed = true;
    for (const source of this.owned) { try { source.stop(); } catch { /* never started */ } try { source.disconnect(); } catch { /* already */ } }
    this.owned.clear();
    for (const stem of Object.values(this.stems)) { stem.fader.disconnect(); stem.send.disconnect(); }
    this.room.disconnect(); this.roomReturn.disconnect();
  }

  /** Change a stem's level or mute it, live. For the audition page. */
  setStem(name, { db, muted } = {}) {
    const stem = this.stems[name]; if (!stem || this.closed) return;
    if (db !== undefined) stem.db = db;
    if (muted !== undefined) stem.muted = muted;
    stem.fader.gain.setTargetAtTime(stem.muted ? 0 : dB(stem.db), this.context.currentTime, 0.02);
  }

  async decode(path) {
    const fetchOne = async extension => {
      const response = await fetch(new URL(`${path}.${extension}`, this.baseURL));
      if (!response.ok) throw new Error(`${response.status}: ${path}.${extension}`);
      return this.context.decodeAudioData(await response.arrayBuffer());
    };
    if (this.extension) return fetchOne(this.extension);
    // Older Safari cannot decode Opus. Learn that once, from the first file, and only fetch one format after.
    try { const buffer = await fetchOne("ogg"); this.extension = "ogg"; return buffer; }
    catch { const buffer = await fetchOne("m4a"); this.extension = "m4a"; return buffer; }
  }

  /** Load groups, in the order given. A cue for something not yet here is silently dropped. */
  async load(paths, concurrency = 6) {
    const queue = [...paths];
    if (!this.extension && queue.length) { const first = queue.shift(); this.buffers.set(first, await this.decode(first).catch(e => (console.error(e), null))); }
    await Promise.all(Array.from({ length: concurrency }, async () => {
      while (queue.length && !this.closed) { const path = queue.shift(); this.buffers.set(path, await this.decode(path).catch(e => (console.error(e), null))); }
    }));
  }

  /** Every file in the bank, the given groups first. */
  allFiles(first = []) {
    const out = [], seen = new Set(), push = p => { if (!seen.has(p)) { seen.add(p); out.push(p); } };
    for (const group of first) for (const file of this.bank[group]?.files ?? []) push(file);
    for (const entry of Object.values(this.bank)) {
      for (const file of entry.files ?? []) push(file);
      for (const note of Object.values(entry.notes ?? {})) { if (note.f) push(note.f); if (note.mf) push(note.mf); }
    }
    return out;
  }

  /** A variant of a group, never the one just used. */
  pick(group) {
    const files = this.bank[group]?.files; if (!files?.length) return null;
    const ready = files.filter(f => this.buffers.get(f));
    if (!ready.length) return null;
    if (ready.length === 1) return ready[0];
    let choice = ready[Math.floor(this.random() * ready.length)];
    if (choice === this.last.get(group)) choice = ready[(ready.indexOf(choice) + 1) % ready.length];
    this.last.set(group, choice);
    return choice;
  }

  /**
   * Play a buffer from the bank once.
   * @param {string} group bank group, or a file path with `file`
   * @param {object} o {stem, when, gain (linear), rate, pan (-1..1), lowpass, highpass, send (linear extra to the room), offset, duration, file}
   * @returns {{stop(at:number,fade?:number), source, gain}|null}
   */
  play(group, { stem, when = this.context.currentTime, gain = 1, rate = 1, pan = 0, lowpass, highpass, send = 0, offset = 0, duration, file } = {}) {
    const bus = this.stems[stem], path = file ?? this.pick(group), buffer = path && this.buffers.get(path);
    if (this.closed || !bus || !buffer) return null;
    // Counted by when things end, not by callbacks, so an offline render limits voices the same way.
    const span = (duration ?? buffer.duration - offset) / rate;
    bus.sounding = bus.sounding.filter(end => end > when);
    if (bus.sounding.length >= bus.limit) return null;
    bus.sounding.push(when + span);
    const { context } = this, source = context.createBufferSource(), amp = context.createGain();
    source.buffer = buffer; source.playbackRate.value = rate; amp.gain.value = gain;
    let tail = source;
    if (highpass) { const f = context.createBiquadFilter(); f.type = "highpass"; f.frequency.value = highpass; tail.connect(f); tail = f; }
    if (lowpass) { const f = context.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lowpass; f.Q.value = 0.5; tail.connect(f); tail = f; }
    tail.connect(amp); tail = amp;
    if (pan && context.createStereoPanner) { const p = context.createStereoPanner(); p.pan.value = pan; tail.connect(p); tail = p; }
    tail.connect(bus.fader);
    if (send) { const s = context.createGain(); s.gain.value = send; tail.connect(s); s.connect(this.room); }
    source.addEventListener("ended", () => tail.disconnect());
    this.own(source);
    // Anything cut out of the middle of a recording gets its own edges, so a cut is never a click.
    if (offset) { amp.gain.setValueAtTime(0, when); amp.gain.linearRampToValueAtTime(gain, when + 0.006); }
    if (duration) { const end = when + duration / rate, edge = Math.min(0.12, duration / rate / 3); amp.gain.setValueAtTime(gain, end - edge); amp.gain.linearRampToValueAtTime(0, end); }
    source.start(when, offset, duration);
    return { source, gain: amp, stop(at, fade = 0.03) { amp.gain.setTargetAtTime(0, at, fade / 3); try { source.stop(at + fade * 2); } catch { /* already ended */ } } };
  }
}

/**
 * A texture that never repeats: overlapping windows at random offsets of random takes. Codec padding
 * cannot click because nothing butts against anything, and a period cannot be learned because there is none.
 * Call tick() regularly with the time; it keeps a few seconds scheduled ahead.
 */
export class Drift {
  constructor(engine, group, { stem, gain = 1, crossfade = 2, shortest = 6, longest = 14, horizon = 6, pan = 0 }) {
    Object.assign(this, { engine, group, stem, crossfade, shortest, longest, horizon, pan });
    const { context } = engine;
    this.level = context.createGain(); this.level.gain.value = gain;
    this.pan = context.createStereoPanner ? context.createStereoPanner() : null;
    if (this.pan) { this.pan.pan.value = pan; this.level.connect(this.pan); this.pan.connect(engine.stems[stem].fader); }
    else this.level.connect(engine.stems[stem].fader);
    this.next = null;
  }

  tick(now) {
    const { engine, crossfade } = this;
    if (engine.closed) return;
    if (this.next === null || this.next < now) this.next = now;
    while (this.next < now + this.horizon) {
      const path = engine.pick(this.group), buffer = path && engine.buffers.get(path);
      if (!buffer) return;
      const room = buffer.duration - crossfade - 0.05;
      const length = Math.max(crossfade + 0.05, Math.min(room, engine.random.range(this.shortest, this.longest)));
      const offset = engine.random() * Math.max(0, room - length);
      const source = engine.context.createBufferSource(), edge = engine.context.createGain(), at = this.next;
      source.buffer = buffer; source.connect(edge); edge.connect(this.level);
      edge.gain.setValueCurveAtTime(rise, at, crossfade);
      edge.gain.setValueCurveAtTime(fall, at + length, crossfade);
      source.start(at, offset, length + crossfade + 0.01);
      source.addEventListener("ended", () => edge.disconnect());
      engine.own(source);
      this.next = at + length;
    }
  }
}

/** Breathy filtered noise whose level follows something moving: the cloth you do not hear as a sample. */
export class Air {
  constructor(engine, { stem, frequency = 1400, q = 0.7, seconds = 3 }) {
    const { context } = engine, buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate), data = buffer.getChannelData(0), random = generator(29);
    let low = 0;
    for (let i = 0; i < data.length; i++) { low += ((random() * 2 - 1) - low) * 0.35; data[i] = low; }
    const fadeLength = Math.floor(context.sampleRate * 0.1);
    for (let i = 0; i < fadeLength; i++) { const u = i / fadeLength; data[i] = data[i] * u + data[data.length - fadeLength + i] * (1 - u); }
    this.source = context.createBufferSource(); this.source.buffer = buffer; this.source.loop = true; this.source.loopEnd = seconds - 0.1;
    this.filter = context.createBiquadFilter(); this.filter.type = "bandpass"; this.filter.frequency.value = frequency; this.filter.Q.value = q;
    this.level = context.createGain(); this.level.gain.value = 0;
    this.pan = context.createStereoPanner ? context.createStereoPanner() : null;
    this.source.connect(this.filter); this.filter.connect(this.level);
    if (this.pan) { this.level.connect(this.pan); this.pan.connect(engine.stems[stem].fader); } else this.level.connect(engine.stems[stem].fader);
    this.frequency = frequency; this.started = false; this.context = context; this.engine = engine;
  }

  /** @param {number} amount 0..1 @param {number} when @param {number} [pan] */
  set(amount, when, pan = 0) {
    if (this.engine.closed) return;
    if (!this.started) { this.source.start(when); this.engine.own(this.source); this.started = true; }
    if (Math.abs(amount - (this.lastAmount ?? -1)) < 0.003) return; // Stillness schedules nothing.
    this.level.gain.setTargetAtTime(amount, when, amount > this.lastAmount ? 0.018 : 0.07);
    this.filter.frequency.setTargetAtTime(this.frequency * (0.7 + amount * 0.9), when, 0.04);
    this.pan?.pan.setTargetAtTime(pan, when, 0.05);
    this.lastAmount = amount;
  }
}
