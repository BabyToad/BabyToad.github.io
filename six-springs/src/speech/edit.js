// Editing a voice take without touching its speed. Recorded lines tend to run sentences together;
// a film editor would open the silence at the cut, and so does this. The audio plays in segments
// and the alignment is shifted to match, so the rest of the system simply sees a slower thinker.

import { alignedWords } from "./score.js";

const RATE = 24;

/**
 * @param {{alignment:{characters:string[],start:number[],end:number[]},loudness:number[]}} take
 * @param {Record<string,number>} [pauses] extra silence in ticks after a word, by bare word.
 *   A word repeated in the line takes its first occurrence.
 * @returns {{alignment:object,loudness:number[],segments:{from:number,to:number,tick:number}[]}}
 *   `segments`: play audio seconds [from,to) starting `tick` scene ticks after the score's onset.
 */
export function spliceTake({ alignment, loudness }, pauses = {}) {
  const words = alignedWords(alignment);
  const remaining = new Map(Object.entries(pauses));
  const cuts = [];
  words.forEach((w, i) => {
    const next = words[i + 1], ticks = remaining.get(w.word);
    if (!next || !ticks) return;
    remaining.delete(w.word);
    // Cut at the quietest tick of the gap, away from either word's consonants.
    const first = Math.ceil(w.end * RATE), last = Math.max(first, Math.floor(next.start * RATE));
    let quietest = first;
    for (let t = first; t <= last; t++) if ((loudness[t] ?? 0) < (loudness[quietest] ?? 0)) quietest = t;
    cuts.push({ at: Math.min(next.start - 0.01, Math.max(w.end + 0.01, quietest / RATE)), ticks, firstChar: next.first });
  });
  const segments = [];
  let from = 0, shift = 0;
  for (const cut of cuts) {
    segments.push({ from, to: cut.at, tick: Math.round(from * RATE) + shift });
    from = cut.at;
    shift += cut.ticks;
  }
  segments.push({ from, to: Infinity, tick: Math.round(from * RATE) + shift });

  const delayOf = char => cuts.reduce((delay, cut) => delay + (char >= cut.firstChar ? cut.ticks : 0), 0) / RATE;
  const moved = {
    characters: alignment.characters,
    start: alignment.start.map((s, i) => s + delayOf(i)),
    end: alignment.end.map((s, i) => s + delayOf(i)),
  };
  const out = [];
  let position = 0;
  for (const cut of cuts) {
    const until = Math.round(cut.at * RATE);
    out.push(...loudness.slice(position, until), ...new Array(cut.ticks).fill(0));
    position = until;
  }
  out.push(...loudness.slice(position));
  return { alignment: moved, loudness: out, segments };
}
