import { MOUTH, EYE_SETS, BROWS } from "./text.js";

/**
 * Extend baked character data with her acting face: more mouths, eyes and brows, chosen by controls.
 * A pure data step before `new Rig`, so the character file and its baker stay untouched. The baked
 * drawings stay first, so the frown and severe rest face Jonas likes are still the defaults.
 *
 * Mouth, brow and eye set are drawing identities, declared discrete, so nothing can fade through
 * them. `eyeOpen` stays the aperture: an eye set replaces only the open row, so a blink closes over it.
 * Sets have fixed vertical gaze, so each repeats across the horizontal gaze columns.
 *
 * @param {object} baked format-2 character
 * @param {object} art {mouth, browL, browR, eyeL, eyeR} drawings by name (scenes/shrine/speech/face.json)
 * @param {string[]} [views] views that use the front head
 */
export function withFace(baked, art, views = ["front", "side-acting"]) {
  const out = structuredClone(baked);
  const add = (part, drawings, names) => {
    for (const name of names) {
      if (!drawings[name]) throw new Error(`Missing face drawing ${part}/${name}`);
      out.parts[part][name] = drawings[name];
    }
  };
  const mouths = Object.keys(MOUTH).slice(1).map(k => MOUTH_ART[k]);
  add("h:front.mouth", art.mouth, mouths);
  const eyeNames = Object.keys(EYE_SETS).slice(1), browNames = Object.keys(BROWS).slice(1);
  add("h:front.eyeL", art.eyeL, eyeNames); add("h:front.eyeR", art.eyeR, eyeNames);
  add("h:front.browL", art.browL, browNames); add("h:front.browR", art.browR, browNames);

  out.controls.mouth = [0, mouths.length];
  out.controls.browSet = [0, browNames.length];
  out.controls.eyeSet = [0, eyeNames.length];
  const drawing = count => ({ unit: "drawing", group: "face", meaning: "authored", blend: "discrete", values: Array.from({ length: count + 1 }, (_, i) => i) });
  out.controlInfo = { ...out.controlInfo, mouth: drawing(mouths.length), browSet: drawing(browNames.length), eyeSet: drawing(eyeNames.length) };
  out.defaults = { ...out.defaults, mouth: 0, browSet: 0, eyeSet: 0 };

  const singles = (control, names) => ({ rows: { control, at: names.map((_, i) => i) }, map: names.map(n => [n]) });
  for (const view of views) {
    const v = out.views[view];
    if (!v) throw new Error(`Unknown view ${view}`);
    v.choose ??= {};
    v.choose["h:front.mouth"] = singles("mouth", ["default", ...mouths]);
    for (const side of ["L", "R"]) {
      v.choose[`h:front.brow${side}`] = singles("browSet", ["default", ...browNames]);
      const eye = v.choose[`h:front.eye${side}`], columns = eye.cols.at.length;
      v.choose[`h:front.eye${side}`] = {
        ...eye,
        sets: { control: "eyeSet", over: eye.rows.at.indexOf(1), map: Object.fromEntries(eyeNames.map(n => [EYE_SETS[n], new Array(columns).fill(n)])) },
      };
    }
  }
  return out;
}

/** Control names to the art lane's sheet names. */
const MOUTH_ART = { press: "pressed", slit: "small-open", wide: "wide-EI", open: "mid-A", round: "round-OU", fv: "FV", smirk: "smirk", displeased: "displeased", sigh: "sigh", chew: "chew", laugh: "laugh" };
