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
  water: { gaze: 1, yaw: 0.55, pitch: 0.55 },
  inspect: { gaze: 0, yaw: 0, pitch: 0.65 },
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
  burn: { number: 5, register: "said", after: "written", look: [[0, "bowl"], ["would", "you"]], stress: ["generous", "burn"], pauses: { generous: 6 }, words: { burn: { fill: "#c62c18" } }, face: [["would", { brow: "furrowed" }]] },
  frog: { number: 6, register: "said", look: [[0, "frog"], ["but", "you"], ["like", "frog"]], after: "frog", pauses: { nothing: 6 }, stress: ["like"], face: [["like", { brow: "warm" }], ["end", { mouth: "smirk" }]] },
  rang: { number: 7, register: "said", after: "you", look: [[0, "bell"], ["yet", "you"]], pauses: { it: 4, yet: 3 }, stress: ["already"], light: ["yet"], face: [["yet", { brow: "skeptical" }]], moves: [{ at: "yet", tracks: { head: [[0, 0], [4, -2], [11, -2], [20, 0]] } }] },
  stairs: { number: 8, register: "said", look: [[0, "inspect"], ["monk", "you"]], after: "you", pauses: { monk: 7 }, stress: ["not", "why"], face: [["why", { brow: "raised" }]] },
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
  dhammapada: { number: 14, register: "sutra", pauses: { good: 7 }, stress: ["small", "filled"], recital: { word: "filled", look: "water", ending: "fill" } },
  zhaozhou: { number: 15, register: "sutra", pauses: { instruction: 6, eaten: 6, yes: 7 }, stress: ["eaten", "wash"], recital: { word: "bowl", look: "bowl", ending: "bowl", dialogue: true } },
  beings: { number: 16, register: "sutra", pauses: { giving: 5 }, phrasing: { they: {} }, stress: ["giving", "first"], recital: { word: "first", look: "bowl", ending: "give" } },
  softer: { number: 17, register: "sutra", pauses: { water: 8 }, phrasing: { softer: {} }, stress: ["softer", "hard"], recital: { word: "hard", look: "written", ending: "wear" } },
  pang: { number: 18, register: "sutra", pauses: { activity: 9 }, phrasing: { carrying: {} }, stress: ["miraculous", "water", "wood"], recital: { word: "wood", look: "hand", ending: "work" } },
  // She puts the praise at arm's length, then supplies a literal demonstration.
  movement: { number: 19, register: "said", look: [[0, "away"], ["they", "you"], ["hop", "ahead"]], pauses: { say: 9 }, stress: ["hop"], face: [[0, { brow: "raised" }], ["i", { brow: "normal" }], ["end", { mouth: "displeased" }]], hop: "hop" },
  wars: { number: 20, register: "said", look: [[0, "bell"], ["veteran", "you"], ["wars", "away"]], after: "bell", stress: ["thousand", "psychic"], face: [["veteran", { brow: "skeptical" }]] },
  // Short clauses share the plaster in time. Index 9 starts the appraisal, not its second "you".
  loot: { number: 21, register: "said", clearPages: true, phrasing: { goes: {}, 9: {} }, look: [[0, "board"], ["you", "inspect"], ["have", "you"]], after: "bowl", pauses: { temple: 9 }, stress: ["share", "loot"], face: [["you", { brow: "skeptical" }], ["end", { mouth: "smirk" }]] },
  devil: { number: 22, register: "ponder", look: [[0, "away"], ["holy", "ahead"], ["you", "you"]], after: "away", pauses: { name: 5, now: 8 }, stress: ["holy", "guards", "worse"], face: [["you", { brow: "skeptical" }], ["end", { mouth: "smirk" }]] },
  monks: { number: 23, register: "said", clearPages: true, phrasing: { not: {}, you: {} }, look: [[0, "stairs"], ["not", "you"], ["think", "inspect"], ["organised", "you"]], after: "you", pauses: { monks: 7, think: 9 }, stress: ["kidnapping", "organised"], face: [["not", { brow: "raised" }], ["organised", { brow: "skeptical" }]] },
  weather: { number: 24, register: "ponder", clearPages: true, phrasing: { a: {}, the: {} }, look: [[0, "up"], ["called", "away"], [10, "you"]], after: "ahead", pauses: { opinions: 9 }, stress: ["weather", "accurate"], face: [["called", { brow: "raised" }], [10, { brow: "skeptical" }], ["end", { mouth: "displeased" }]] },
};

/** The clicks in the room, and what she has to say about them. Bell rings as well. */
export const ANSWERS = {
  stool: ["bowl", "small"], sack: ["burn"],
  frog: ["frog"], board: ["deeds", "loot"], basin: ["dhammapada", "zhaozhou", "beings", "softer"], stream: ["dhammapada", "zhaozhou", "beings", "softer"], spout: ["pang"], ribbon: ["stairs"],
  saint: ["before", "arm", "halls", "corpse", "stairs", "arrow"],
};

/** Parse `1. "Words." *intent*` rows of lines.md into {number: {text, intent}}. */
export function parseLines(markdown) {
  const out = {};
  for (const match of markdown.matchAll(/^(\d+)\.\s+"(.+)"(?:\s+\*(.+?)\*)?\s*$/gm)) out[+match[1]] = { text: match[2], intent: match[3] ?? "" };
  return out;
}
