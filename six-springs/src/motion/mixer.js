// The mixer answers "who owns this control right now". Layers run in order over a base pose:
// a body clip, then acting on the face, then a reach on one arm. Masks name controls, so a layer
// touches only what it owns, and fading a weight is how anything starts or stops.

/** Drawing identity selects an endpoint; it never travels through other drawings.
 * Aperture, gaze and geometric controls remain continuous. */
export function blendControl(from,to,weight,info={}) {
  if(info.blend==='discrete') {
    if(!info.values.includes(from)||!info.values.includes(to))throw Error('Unknown discrete control value');
    return weight<.5?from:to;
  }
  return from+(to-from)*weight;
}

export const MASKS = {
  face: ["browL", "browR", "smile", "eyeOpen", "eyeSet", "gaze"],
  look: ["yaw", "pitch", "head"],
  armL: ["uarmL", "farmL", "handL"],
  armR: ["uarmR", "farmR", "handR"],
};

/** Apply one layer. mode "over" blends toward the layer's values, "add" offsets from what is already there. */
export function blend(pose, source, weight = 1, { mask, mode = "over", controlInfo = {} } = {}) {
  if (weight <= 0) return pose;
  for (const k of mask || Object.keys(source)) {
    const v = source[k];
    if (typeof v !== "number") continue;
    if(mode==='add'&&controlInfo[k]?.blend==='discrete')throw Error('Cannot add drawing identities');
    pose[k] = mode === "add" ? pose[k] + v * weight : blendControl(pose[k],v,weight,controlInfo[k]);
  }
  return pose;
}

/** Sample a list of [frame, value] keys with a smoothstep, for quick hand-keyed curves. */
export function curve(keys, f) {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) {
    const t = (f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
    return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * t * t * (3 - 2 * t);
  }
  return keys[keys.length - 1][1];
}
