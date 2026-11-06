/** Visible sutra captions follow the phrase being recited. Reading ahead is an explicit choice. */
export function captionText(score, age, full = false) {
  if (full || score.register !== "sutra") return score.text;
  const phrase = score.phrases.findLast(p => p.start <= age);
  return phrase ? phrase.words.map(i => score.words[i].text).join(" ") : "";
}
