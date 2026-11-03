// The voice is an output of the performance, like the picture. It reads the scene's position and
// follows; nothing in the scene ever reads it. So a replay, a slow machine or a muted page all
// produce exactly the same pose stream, and only this file has to care about real audio.

const RESYNC = 0.09, PREROLL = 0.012, FADE = 0.012;

/**
 * The last thing before the speakers. Takes are already leveled, so this should almost never act;
 * it is what keeps overlaps and bad days out of anyone's ears. Compressor, then a hard ceiling.
 */
export function outputChain(context) {
  const input = context.createGain();
  input.gain.value = 10 ** (-2.7 / 20); // Cancels the compressor's built-in makeup gain: measured, tests/browser-speech.py.
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -6; limiter.knee.value = 4; limiter.ratio.value = 20; limiter.attack.value = 0.002; limiter.release.value = 0.12;
  const ceiling = context.createWaveShaper(), curve = new Float32Array(2049), limit = 10 ** (-2 / 20);
  for (let i = 0; i < curve.length; i++) { const x = i / 1024 - 1; curve[i] = Math.abs(x) < limit ? x : Math.sign(x) * limit; }
  ceiling.curve = curve; ceiling.oversample = "2x";
  input.connect(limiter); limiter.connect(ceiling);
  return { input, output: ceiling };
}

export class Voice {
  /** @param {URL|string} baseURL where take files live */
  constructor(baseURL) { this.baseURL = baseURL; this.buffers = new Map(); this.active = null; this.context = null; this.drift = []; this.resyncs = 0; this.useOriginal = false; }

  /** Join an output someone else made: `context`, plus the node the voice goes into. */
  attach(context, output) { this.context = context; this.output = output; }

  /** AudioContext may only start on a user gesture. Call from the first click. */
  unlock() {
    if (!this.context) {
      this.context = new AudioContext({ latencyHint: "interactive" });
      const chain = outputChain(this.context);
      chain.output.connect(this.context.destination);
      this.output = chain.input;
    }
    return this.context.resume();
  }

  load(path) {
    if (!this.buffers.has(path)) {
      this.buffers.set(path, fetch(new URL(path, this.baseURL))
        .then(r => { if (!r.ok) throw new Error(`${r.status}: ${path}`); return r.arrayBuffer(); })
        .then(bytes => this.context.decodeAudioData(bytes)));
    }
    return this.buffers.get(path);
  }

  /**
   * Call per display frame.
   * @param {object|null} utterance the speaker's current utterance
   * @param {number} position fractional scene ticks now (tick + clock accumulator)
   */
  follow(utterance, position) {
    if (!this.context) return;
    if (!utterance?.audio) { this.stop(); return; }
    const path = this.useOriginal && utterance.original ? utterance.original : utterance.audio;
    const key = `${utterance.startTick}:${path}`;
    const wanted = (position - utterance.startTick - utterance.score.onset) / 24;
    if (this.active?.key !== key) { this.stop(); this.begin(key, path); return; }
    if (!this.active.buffer) return;
    // A freshly decoded take starts from where the scene is now, not from a guess made when loading began.
    if (!this.active.sources) { this.schedule(this.active, utterance, wanted); return; }
    // Where the score says the voice is, against where it was scheduled to be.
    const error = this.context.currentTime - this.active.zero - wanted;
    // Before her first word nothing is sounding, so a correction is free: get it exactly right there.
    if (wanted < -0.05) { if (Math.abs(error) > PREROLL) this.schedule(this.active, utterance, wanted); return; }
    if (wanted >= 0) { this.drift.push(error); if (this.drift.length > 1200) this.drift.shift(); }
    if (Math.abs(error) > RESYNC) { this.resyncs++; this.schedule(this.active, utterance, wanted); }
  }

  begin(key, path) {
    const active = { key, sources: null, gain: null, zero: 0, buffer: null };
    this.active = active;
    this.load(path).then(buffer => { active.buffer = buffer; }).catch(error => { this.failed = true; console.error(error); });
  }

  /** Start every segment still to come, on the audio clock, aligned so that `wanted` is now. */
  schedule(active, utterance, wanted) {
    this.silence(active);
    const now = this.context.currentTime;
    active.zero = now - wanted;
    active.gain = this.context.createGain();
    active.gain.connect(this.output);
    active.sources = [];
    for (const segment of utterance.segments) {
      const startAt = segment.tick / 24, length = Math.min(segment.to, active.buffer.duration) - segment.from;
      if (length <= 0 || wanted >= startAt + length) continue;
      const late = Math.max(0, wanted - startAt), when = now + Math.max(0, startAt - wanted), played = length - late;
      const source = this.context.createBufferSource(), edge = this.context.createGain();
      source.buffer = active.buffer;
      source.connect(edge); edge.connect(active.gain);
      edge.gain.setValueAtTime(0, when);
      edge.gain.linearRampToValueAtTime(1, when + FADE);
      edge.gain.setValueAtTime(1, when + played - FADE);
      edge.gain.linearRampToValueAtTime(0, when + played);
      source.start(when, segment.from + late, played);
      active.sources.push(source);
    }
  }

  silence(active) {
    if (!active?.gain) return;
    const t = this.context.currentTime;
    active.gain.gain.setValueAtTime(1, t);
    active.gain.gain.linearRampToValueAtTime(0, t + FADE * 2);
    for (const source of active.sources) source.stop(t + FADE * 2 + 0.01);
    active.sources = null; active.gain = null;
  }

  stop() { if (this.active) { this.silence(this.active); this.active = null; } }
  suspend() { return this.context?.suspend(); }
  resume() { return this.context?.resume(); }
}
