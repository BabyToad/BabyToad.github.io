// What can be read off written English without a dictionary: where syllables sit, roughly how the
// lips shape them and which words a speaker would lean on. It is deliberately coarse. A limited-
// animation mouth has six drawings, so "close enough to pick the right drawing" is the whole target.

/** Mouth drawings, as values of the rig's `mouth` control. */
export const MOUTH = Object.freeze({ rest: 0, press: 1, slit: 2, wide: 3, open: 4, round: 5, fv: 6, smirk: 7, displeased: 8, sigh: 9, chew: 10, laugh: 11 });

/** Lid aperture, the continuous `eyeOpen`. */
export const EYES = Object.freeze({ closed: 0, half: 0.5, normal: 1 });

/** Which eye drawings, the discrete `eyeSet`. An identity: it holds or cuts, and a blink closes over any of them. */
export const EYE_SETS = Object.freeze({ normal: 0, up: 1, down: 2, heavy: 3, narrow: 4, wide: 5 });

/** Brow drawings, as values of `browSet`. */
export const BROWS = Object.freeze({ normal: 0, raised: 1, skeptical: 2, furrowed: 3, sad: 4, warm: 5 });

// Words that carry grammar rather than news. They are said, never leaned on.
const LIGHT = new Set(`a an the and or but so if of at in on to for from by with as than that this these those
  i you he she it we they me him her us them my your his its our their mine
  am is are was were be been being do does did have has had will would can could shall should may might must
  not n't there here then very just also too`.split(/\s+/).filter(Boolean));

export const isLetter = c => /[\p{L}\p{N}']/u.test(c) || c === "’";

/** Lowercased letters only: "can't," becomes "can't". */
export const bare = word => word.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").replace(/’/g, "'");

/**
 * Pause a word's trailing punctuation asks for: 0 none, 1 comma-weight, 2 sentence, 3 trailing off.
 * @param {string} word
 */
export function breakWeight(word) {
  const tail = word.match(/[.,;:!?…\-–—"'”’)]*$/)?.[0] ?? "";
  if (tail.includes("...") || tail.includes("…")) return 3;
  if (/[.!?]/.test(tail)) return 2;
  if (/[,;:\-–—]/.test(tail)) return 1;
  return 0;
}

export const isLight = word => LIGHT.has(bare(word)) || LIGHT.has(bare(word).replace(/'.*$/, ""));

/**
 * Vowel groups of a word as character offsets: one per syllable, approximately.
 * Handles silent final e and -ed. Good enough to place a mouth, not to hyphenate.
 * @param {string} word bare lowercase word
 * @returns {{at:number,text:string}[]}
 */
export function nuclei(word) {
  const found = [];
  for (const match of word.matchAll(/[aeiouy]+/g)) found.push({ at: match.index, text: match[0] });
  if (found.length > 1) {
    const last = found.at(-1);
    const tail = word.slice(last.at);
    const silentE = tail === "e" && !/[^aeiouy]le$/.test(word);
    const silentEd = tail === "ed" && !/[td]ed$/.test(word);
    const silentEs = tail === "es" && !/(s|x|z|ch|sh)es$/.test(word);
    if (silentE || silentEd || silentEs) found.pop();
  }
  return found.length ? found : [{ at: 0, text: word.slice(0, 1) }];
}

/** Which drawing a vowel group wants if the mouth is allowed to open at all. */
export function vowelShape(text) {
  if (/^(oo|ou|ow|ew|ue|oa|o|wo)/.test(text)) return MOUTH.round;
  if (/^(a|au|aw|ah)/.test(text)) return MOUTH.open;
  if (/^(e|i|y|ee|ea|ie|ei|ey)/.test(text)) return MOUTH.wide;
  return MOUTH.slit; // Short u: "but", "burn". A lazy, barely parted sound.
}

/** Which syllable of a word takes its stress. Unstressed prefixes shift it to the second. */
export function stressedNucleus(word, count) {
  if (count < 2) return 0;
  return /^(a|be|de|re|un|in|en|ex|for|with|al)/.test(word) && !/^(in|an|un)[aeiou]/.test(word) && count === 2 ? 1 : 0;
}

/**
 * Word stress without hearing it: 0 light, 1 content, 2 the phrase's nuclear accent, which in
 * English declaratives usually falls on the last content word.
 * @param {string[]} words one phrase
 * @returns {number[]}
 */
export function phraseStress(words) {
  const levels = words.map(w => isLight(w) ? 0 : 1);
  let nuclear = levels.lastIndexOf(1);
  if (nuclear < 0) nuclear = words.length - 1; // "Sit." "I was." Something still gets the weight.
  if (nuclear >= 0) levels[nuclear] = 2;
  return levels;
}
