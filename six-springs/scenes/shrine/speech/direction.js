// How each line is played. Wording comes from lines.md (written) or the take (voiced); this file is
// only what a director would mark on the script. Looks, pauses and word styling are all by word,
// so changing a sentence degrades to defaults instead of breaking.

/**
 * Where things are, as the eyes and head reach them. gaze +: screen right. pitch +: down.
 * `you` follows the pointer's attention when there is one, so "you" is really you.
 * `eyes` names a drawing from the art lane's sheet: they have fixed vertical gaze.
 */
export const TARGETS = {
  you: { gaze: 0, yaw: 0, pitch: 0, you: true },
  down: { gaze: -0.5, yaw: -0.12, pitch: 0.55, eyes: "down" },
  ahead: { gaze: 0, yaw: 0.05, pitch: 0.1 },
  up: { gaze: 0.5, yaw: 0.3, pitch: -0.9, roll: 3, eyes: "up" },
  away: { gaze: 1, yaw: 0.35, pitch: 0.12, eyes: "normal" },
  bowl: { gaze: -1, yaw: -0.5, pitch: 0.6, eyes: "down" },
  frog: { gaze: -1, yaw: -0.42, pitch: 0.95, eyes: "down" },
  stairs: { gaze: -1, yaw: -0.65, pitch: -0.2, eyes: "normal" },
  temple: { gaze: -1, yaw: -0.55, pitch: -0.7, eyes: "up" },
  board: { gaze: 1, yaw: 0.62, pitch: 0.02, eyes: "normal" },
  bell: { gaze: 1, yaw: 0.5, pitch: -0.75, eyes: "up" },
  hand: { gaze: -1, yaw: -0.28, pitch: 0.85, eyes: "down" },
  wall: { gaze: 1, yaw: 0.4, pitch: -0.1, eyes: "normal" },
};

/** Where a register wants to write, relative to the middle of her head, in painting pixels. */
export const FOCUS = {
  said: { x: 190, y: 25 },
  mutter: { x: 175, y: 215 },
  ponder: { x: 170, y: -70 },
  sutra: { x: 260, y: 40 },
};

export const LINES = {
  bowl: { number: 1, register: "said", look: "bowl", stress: ["bowl"] },
  merit: { number: 2, register: "said", after: "written", look: "you", smile: [["end", -0.05]] },
  deeds: { number: 3, register: "said", look: "board", after: "board", stress: ["deeds"], light: ["almost"], face: [[0, { brow: "skeptical", eyes: "narrow" }], ["end", { mouth: "displeased" }]] },
  small: { number: 4, register: "mutter", look: "bowl", pauses: { bowl: 9 }, stress: ["know"], face: [["know", { brow: "skeptical" }], ["end", { mouth: "displeased" }]] },
  burn: { number: 5, register: "said", after: "written", look: [[0, "bowl"], ["it", "you"]], stress: ["burn"], pauses: { generous: 12 }, words: { burn: { fill: "#c62c18" } }, face: [["it", { brow: "furrowed" }]] },
  frog: { number: 6, register: "said", look: "frog", after: "frog", pauses: { nothing: 10 }, stress: ["stays"], face: [["but", { brow: "warm" }], ["end", { mouth: "smirk" }]] },
  rang: { number: 7, register: "said", after: "written", look: [[0, "bell"], ["i", "you"]], pauses: { it: 9 }, stress: ["already"], face: [["i", { brow: "skeptical" }]] },
  stairs: { number: 8, register: "said", look: [[0, "temple"], ["it", "you"]], after: "stairs", pauses: { temple: 8 }, face: [["it", { brow: "raised" }]] },
  arrow: { number: 9, register: "said", look: [[0, "you"], ["i", "away"], ["it", "you"]], stress: ["arrow", "looking"], face: [["i", { brow: "furrowed", eyes: "narrow" }], ["end", { mouth: "displeased" }]] },
  arm: {
    number: 10, register: "ponder", look: "hand", after: "hand", pauses: { arm: 14 }, stress: ["arm", "allow"], face: [["i", { brow: "skeptical", eyes: "narrow" }], ["end", { mouth: "displeased" }]],
    // Someone is lifting it. She watches it happen, and it is let down when she has decided.
    moves: [{ at: "someone", offset: 4, tracks: { uarmL: [[0, 0], [20, 11], [50, 22], [80, 24], [150, 24], [175, 0]], farmL: [[0, 0], [30, 8], [80, 16], [150, 16], [175, 0]] } }],
  },
  halls: {
    number: 11, register: "ponder", pauses: { halls: 16, think: 22 }, stress: ["halls", "gold", "tall"], light: ["someone"],
    look: [[0, "up"], ["gold", "bell"], ["someone", "up"]], after: "ahead", face: [["someone", { brow: "sad" }], ["end", { mouth: "sigh" }]],
    words: { gold: { fill: "#f2b23a", keyline: "#17120c" }, tall: { stretch: 1.9 } },
    phrasing: { "gold,": { near: [985, 500] }, "someone": { near: [1170, 330] } },
  },
  before: { number: 12, register: "ponder", look: "ahead", after: "away", stress: ["before"], face: [[0, { eyes: "heavy" }], ["end", { mouth: "smirk", brow: "warm" }]] },
  corpse: { number: 13, register: "said", look: [[0, "temple"], ["i'm", "ahead"]], after: "away", pauses: { flowers: 16 }, stress: ["flowers", "me"], face: [["i'm", { brow: "sad" }], ["end", { mouth: "sigh" }]] },
  sixth: { number: 14, register: "sutra", pauses: { spring: 12, stone: 12 }, stress: ["stone", "regardless"], face: [["regardless", { eyes: "normal", brow: "raised" }]] },
  third: { number: 15, register: "sutra", pauses: { river: 12, downstream: 12, it: 18 }, stress: ["river", "sit"], look: [[0, "ahead"], ["sit", "you"]], words: { sit: { scale: 1.7 } }, face: [["sit", { eyes: "normal", brow: "skeptical" }]] },
  nothing: { number: 16, register: "sutra", pauses: { here: 22 }, stress: ["here", "bowl"], look: [[0, "ahead"], ["there", "you"]], face: [["there", { eyes: "normal", brow: "sad" }]] },
};

/** The clicks in the room, and what she has to say about them. Bell rings as well. */
export const ANSWERS = {
  stool: ["bowl", "small"], sack: ["burn"],
  frog: ["frog"], board: ["deeds"], basin: ["third", "sixth"], stream: ["sixth"], spout: ["third"], ribbon: ["stairs"],
  saint: ["before", "arm", "halls", "corpse", "stairs", "nothing", "arrow"],
};

/** Parse `1. "Words." *intent*` rows of lines.md into {number: {text, intent}}. */
export function parseLines(markdown) {
  const out = {};
  for (const match of markdown.matchAll(/^(\d+)\.\s+"([^"]+)"(?:\s+\*(.+?)\*)?\s*$/gm)) out[+match[1]] = { text: match[2], intent: match[3] ?? "" };
  return out;
}
