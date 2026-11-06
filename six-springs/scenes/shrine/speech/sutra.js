// Shrine-specific recital direction. One compiled score still owns mouth, body and wet words.
// The familiar hand rhythm fails when she hears the ending herself. No timers or extra actor slot.
import { MOUTH, EYE_SETS } from "../../../src/speech/text.js";
import { Follow } from "../../../src/motion/follow.js";

const smooth = u => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };
const mix = (a, b, u) => a + (b - a) * u;
const curve = (keys, t) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [a, x] = keys[i - 1], [b, y] = keys[i];
    return mix(x, y, smooth((t - a) / (b - a)));
  }
  return keys.at(-1)[1];
};
const BODY = ["head", "spine", "pelvis", "bob", "uarmL", "uarmR", "farmL", "farmR", "handL", "handR"];

/** Compile the performance against the actual chosen take, or against written timing. */
export function directSutra(score, direction, targets) {
  if (score.register !== "sutra" || !direction.recital) return score;
  const { word, look, ending } = direction.recital;
  const anchor = score.words.findLast(w => w.word === word);
  // If Jonas replaces the line, leave its generic score alone until there is a new direction.
  if (!anchor) return score;
  const caught = ending === "wear" ? anchor.accent + 3 : anchor.end + 3;
  const release = caught + ({ wear: 28, fill: 22, bowl: 10, give: 30, work: 18 }[ending]);
  const end = score.ticks - 1, target = targets[look] ?? targets.ahead;
  const tr = score.tracks, quiet = [], gazeWeight = [], headWeight = [];
  tr.handR = new Array(score.ticks).fill(0);
  tr.pelvis = new Array(score.ticks).fill(0);
  const blink = (at, length = 6) => {
    for (let i = 0; i < length && at + i < score.ticks; i++) {
      if (at + i >= 0) tr.eyeOpen[at + i] = i === 0 || i === length - 1 ? 0.5 : 0;
    }
  };
  tr.eyeOpen.fill(1);
  blink(7, 7);
  // A breath at a sentence boundary; no ticking blink over the final realisation.
  for (let i = 0; i < score.phrases.length - 1; i++) {
    const p = score.phrases[i], next = score.phrases[i + 1];
    if (p.break >= 2 && next.start - p.end >= 8 && p.end + 8 < caught) blink(p.end + 2);
  }
  blink(Math.min(end - 15, release + 30));

  const phraseWrist = t => score.phrases.reduce((v, p) => p.start >= caught ? v : v +
    curve([[p.start - 4, 0], [p.start + 9, 1], [Math.max(p.start + 14, p.end), 0]], t), 0);

  for (let t = 0; t <= end; t++) {
    const enter = smooth(t / (score.onset - 3));
    const leave = 1 - smooth((t - (end - 24)) / 24);
    const noticing = smooth((t - caught) / 7);
    const headFollows = smooth((t - caught - 4) / 17);
    const letGo = smooth((t - release) / (ending === "wear" ? 34 : 26));
    const ritual = 1 - smooth((t - caught) / 5);
    let breath = curve([[0, 0], [score.onset - 3, 1], [score.onset + 40, 0]], t);
    for (let i = 1; i < score.phrases.length; i++) {
      const p = score.phrases[i], previous = score.phrases[i - 1];
      if (p.start >= caught || p.start - previous.end < 4) continue;
      const inhale = Math.max(previous.end + 1, p.start - 12);
      breath = Math.max(breath, curve([[inhale, 0], [p.start - 1, .65], [p.end, 0]], t));
    }
    const wrist = ending === "wear" ? phraseWrist(Math.min(t, caught)) * (1 - letGo) : phraseWrist(t) * ritual;
    // Hardness: an unfinished wrist stroke arrests, then softens before the elbow yields.
    const stroke = ending === "wear" ? curve([[anchor.start - 10, 0], [caught, 1]], t) * (1 - smooth((t - caught - 16) / 15)) : 0;
    // The fullness of the pot settles her weight before her hand remembers to lower.
    const weight = ending === "fill" ? smooth((t - caught - 2) / 18) : 0;
    // The instruction reaches the bowl that is actually here.
    const reluctant = ending === "bowl" ? smooth((t - caught - 12) / 24) : 0;
    breath *= ritual;
    // One hand keeps her place; the other hangs with its own weight. Neither traces every word.
    const scale = ending === "bowl" ? .65 : 1, raised = enter * (1 - letGo) * scale;
    tr.uarmR[t] = (-13 * raised - 4 * wrist * scale - breath * 1.5) * leave;
    tr.farmR[t] = (-39 * raised - 9 * wrist * scale - 4 * stroke) * leave;
    tr.handR[t] = (11 * raised + 7 * wrist * scale + 15 * stroke - 5 * letGo - 8 * weight * (1 - letGo)) * leave;
    tr.uarmL[t] = (3 * enter + breath * 1.3 - 2 * letGo + 3 * weight + 3 * reluctant) * leave;
    tr.farmL[t] = (6 * enter - 3 * letGo + 6 * reluctant) * leave;
    tr.handL[t] = (-4 * enter + 3 * letGo) * leave;
    tr.spine[t] = (-2.6 * enter - .5 * breath + (ending === "fill" ? 4.2 * weight : ending === "bowl" ? -1.2 * reluctant : 2.2 * letGo)) * leave;
    tr.pelvis[t] = -1.8 * weight * leave;
    tr.bob[t] = (-4 * breath + (ending === "fill" ? 9 * weight : ending === "bowl" ? 1.5 * reluctant : 2.5 * letGo)) * leave;
    tr.head[t] = (1.5 * enter - 2 * headFollows + .5 * letGo) * leave;
    tr.pitch[t] = mix(.22 * enter - .09 * breath, target.pitch + (ending === "fill" ? .22 : .04), headFollows) * leave;
    tr.yaw[t] = mix(.12 * enter, target.yaw, headFollows) * leave;
    tr.gaze[t] = mix(.35 * enter, target.gaze, noticing) * leave;
    tr.eyeSet[t] = EYE_SETS.normal;
    tr.browSet[t] = 0;
    tr.browL[t] = (-1 * enter - (ending === "wear" ? 5 : 2) * noticing + 1 * letGo) * leave;
    tr.browR[t] = (-1 * enter - (ending === "bowl" ? 5 : 3) * noticing + 1 * letGo) * leave;
    tr.smile[t] = 0;
    if (ending === "give") {
      // Giving first catches the hand that was waiting to receive. Open it, hold, then yield.
      const offer = noticing * (1 - smooth((t - release - 16) / 24)) * leave;
      tr.farmL[t] += 18 * offer; tr.handL[t] -= 14 * offer;
      tr.browR[t] -= 3 * offer;
    }
    if (ending === "work") {
      // Grand powers resolve into the weight of an ordinary chore, both hands together.
      const carry = headFollows * (1 - smooth((t - release - 12) / 26)) * leave;
      tr.farmL[t] += 13 * carry; tr.farmR[t] -= 10 * carry;
      tr.bob[t] += 5 * carry; tr.spine[t] += 2 * carry;
    }
    if (direction.recital.dialogue) {
      const at = name => score.words.find(w => w.word === name).start;
      const question = curve([[at("have") - 5, 0], [at("have") + 4, 1], [at("yes") - 5, 1], [at("yes"), 0]], t);
      const answer = curve([[at("yes") - 3, 0], [at("yes") + 3, 1], [at("then") - 2, 0]], t);
      const instruction = curve([[at("then") - 3, 0], [at("then") + 5, 1], [caught, 1], [caught + 8, 0]], t);
      tr.gaze[t] += -.55 * question + .45 * answer - .4 * instruction;
      tr.yaw[t] += -.15 * question + .12 * answer - .1 * instruction;
      tr.browR[t] -= 4 * question;
      tr.pitch[t] += -.1 * question + .19 * answer;
    }
    // Small spread/FV teeth read as pleasure at this scale. Keep the same syllable holds,
    // using the existing slit; rounded vowels and the occasional open accent survive.
    if (tr.mouth[t] === MOUTH.wide || tr.mouth[t] === MOUTH.fv) tr.mouth[t] = MOUTH.slit;
    score.attend[t] = 0;
    quiet[t] = enter * leave * mix(.8, 1, noticing);
    gazeWeight[t] = noticing * leave;
    headWeight[t] = headFollows * leave;
  }
  score.recital = { caught, release, quiet, ending, look, word, target, gazeWeight, headWeight };
  return score;
}

/** Stillness must include the lower idle sway. Higher action/interaction layers keep their priority. */
export function sutraSource(score, source, room = null) {
  if (!score.recital) return source;
  return { ...source, sample(age, context) {
    const patch = source.sample(age, context);
    const t = Math.min(score.ticks - 1, age), recital = score.recital, quiet = recital.quiet[t];
    for (const key of BODY) patch[key] -= (context.pose[key] ?? 0) * quiet;
    if (room) {
      for (const key of ["gaze", "yaw", "pitch"]) patch[key] += (room.target[key] - recital.target[key]) * (key === "gaze" ? recital.gazeWeight[t] : recital.headWeight[t]);
      if (room.notice) {
        const weight = curve([[0, 0], [3, .85], [9, .85], [22, 0]], t - room.notice.age);
        patch.gaze = mix(patch.gaze, room.notice.target.gaze, weight);
        patch.yaw = mix(patch.yaw, room.notice.target.yaw, weight * .18);
      }
    }
    return patch;
  } };
}

/** Mutable attention belongs to one utterance and advances before pose, never during rendering. */
export function recitalRoom(score) {
  if (!score.recital) return null;
  const target = { ...score.recital.target };
  return { target, notice: null, lastNotice: -Infinity, follow: Object.fromEntries(["gaze", "yaw", "pitch"].map(k => [k, new Follow(k === "gaze" ? 5 : 2.5, 1, 0, target[k])])) };
}

export function noticeRecital(score, room, age, target) {
  if (!room || age < score.onset || (age >= score.recital.caught - 10 && age < score.recital.release + 26)
      || age - room.lastNotice < 30) return false;
  room.notice = { age, target };
  room.lastNotice = age;
  return true;
}

export function followRecital(score, room, age, target) {
  if (!room) return;
  if (age >= score.recital.caught) for (const key of ["gaze", "yaw", "pitch"]) room.target[key] = room.follow[key].step(target[key]);
  if (room.notice && (age - room.notice.age > 22 || age >= score.recital.caught - 10 && age < score.recital.release + 26)) room.notice = null;
}
