// Timing for lines nobody recorded. It produces the same shape as a voice's character alignment, so
// everything downstream has exactly one path: an alignment goes in, a score comes out. A game's
// generated line and an actor's take differ here and nowhere else.

import { bare, breakWeight, isLight, isLetter, nuclei } from "./text.js";

/**
 * Pace of a written voice. Syllable durations and pauses are in seconds.
 * `tests/speech-fit.mjs` compares these against the recorded takes.
 */
export const PACE = Object.freeze({
  said: { syllable: 0.17, light: 0.115, final: 1.45, pause: [0, 0.2, 0.55, 0.9], speed: 1 },
  mutter: { syllable: 0.15, light: 0.1, final: 1.25, pause: [0, 0.12, 0.35, 0.6], speed: 1 },
  ponder: { syllable: 0.21, light: 0.15, final: 1.6, pause: [0, 0.32, 0.85, 1.2], speed: 1 },
  sutra: { syllable: 0.2, light: 0.17, final: 1.3, pause: [0, 0.28, 0.72, 1], speed: 1 },
});

/**
 * @param {string} text what she says
 * @param {keyof typeof PACE} register
 * @returns {{characters:string[],start:number[],end:number[]}} seconds, same as a voice take
 */
export function writtenAlignment(text, register = "said") {
  const pace = PACE[register];
  if (!pace) throw new Error(`Unknown register ${register}`);
  const characters = [...text], start = [], end = [];
  let clock = 0, index = 0;
  const words = text.match(/\s+|\S+/g) ?? [];
  words.forEach((token, position) => {
    if (/^\s/.test(token)) {
      for (const c of token) { start.push(clock); end.push(clock); index++; void c; }
      return;
    }
    const word = bare(token);
    const syllables = nuclei(word).length;
    const breakAfter = breakWeight(token);
    const isLast = position >= words.length - 1;
    let duration = syllables * (isLight(token) ? pace.light : pace.syllable);
    // Speakers slow into a boundary. This, not a longer pause, is most of what makes a phrase end.
    if (breakAfter || isLast) duration *= pace.final;
    duration /= pace.speed;
    const glyphs = [...token], letters = glyphs.filter(isLetter).length || 1;
    const step = duration / letters;
    for (const glyph of glyphs) {
      const isWordGlyph = isLetter(glyph);
      start.push(clock);
      if (isWordGlyph) clock += step;
      end.push(clock);
      index++;
    }
    clock += pace.pause[isLast ? 0 : breakAfter];
    // A hair of air between ordinary words keeps closures visible.
    if (!breakAfter && !isLast) clock += 0.02;
  });
  if (index !== characters.length) throw new Error("Written alignment lost characters");
  return { characters, start, end };
}
