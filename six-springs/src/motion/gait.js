// Walking as an animator keys it: four extremes per step (contact, down, pass, up), not a sine wave.
// The stride feels alive because of asymmetric timing in these poses: she drops onto the front foot,
// climbs over it, and the back heel peels late. Values are per leg; the other leg runs half a cycle behind.


const TAU = Math.PI * 2;

/** Periodic Catmull-Rom through evenly spaced keys, so poses are hit exactly and passed through smoothly. */
function loop(keys, u) {
  const n = keys.length, t = (((u % 1) + 1) % 1) * n, i = Math.floor(t), f = t - i;
  const a = keys[(i + n - 1) % n], b = keys[i % n], c = keys[(i + 1) % n], d = keys[(i + 2) % n];
  return .5 * (2 * b + (c - a) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (3 * b - a - 3 * c + d) * f * f * f);
}

// Eight beats per cycle. Leg x in strides (+1 front), lift in stage units, foot roll in degrees (+ is toe down).
export const GAITS = {
  walk: {
    x:    [ 1.00,  0.72,  0.30, -0.14, -0.55, -0.96, -0.62,  0.42],
    lift: [ 0,     0,     0,     0,     1,     8,    26,    14],
    roll: [-20,    0,     0,     4,    14,    42,    22,   -10],
    drop: [ 2,     9,     3,    -5,     2,     9,     3,    -5],   // body height, down is +, twice per cycle
    lean: [-1,     1,     0,    -2,    -1,     1,     0,    -2],
    arm:  [-1,    -.78,  -.2,    .42,   1,     .78,   .2,   -.42],
    elbow:[ .35,   .2,    .1,    .3,    .9,    .75,   .45,   .3],
    head: [ 1,    -1.4,  -.6,   1.6,    1,    -1.4,  -.6,   1.6],
  },
  run: {
    x:    [ 1.00,  0.42, -0.25, -0.86, -0.72,  0.02,  0.82,  1.16],
    lift: [ 0,     0,     0,     6,    46,    64,    30,     8],
    roll: [-6,     0,     8,    36,    46,    10,   -14,   -14],
    drop: [ 3,    11,     1,   -10,     3,    11,     1,   -10],
    lean: [ 0,     1.5,   0,    -1,     0,     1.5,   0,    -1],
    arm:  [-1,    -.6,    .1,    .8,    1,     .6,   -.1,   -.8],
    elbow:[ 1,    1,     1,     1,     1,     1,     1,     1],
    head: [ 1,    -2.2,  -.4,   2.2,    1,    -2.2,  -.4,   2.2],
  },
};

/** Stride length in stage units for a speed in stage units per tick. */
export const strideFor = (speed, run) => lerp(run ? 62 : 34, run ? 92 : 58, Math.min(1, speed / (run ? 16 : 8.5)));
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Advance the gait. Foot speed on the ground must match body speed or feet slide, so phase follows distance:
 * one cycle covers the distance the planted foot travels backward, over the share of the cycle it is planted.
 */
export function advance(phase, speed, runMix) {
  const L = lerp(strideFor(speed, false), strideFor(speed, true), runMix);
  // strides of backward foot travel per cycle while planted, read from the x keys: walk 1 to -.55 in half a cycle, run 1 to -.86 in three eighths
  return (phase + speed / (L * lerp(3.1, 4.96, runMix))) % 1;
}

export function sample(phase, runMix, speed) {
  const L = lerp(strideFor(speed, false), strideFor(speed, true), runMix);
  const get = (k, u) => lerp(loop(GAITS.walk[k], u), loop(GAITS.run[k], u), runMix);
  return {
    L, stride: L,
    legL: { x: get("x", phase) * L, y: get("lift", phase), roll: get("roll", phase) },
    legR: { x: get("x", phase + .5) * L, y: get("lift", phase + .5), roll: get("roll", phase + .5) },
    drop: get("drop", phase), lean: get("lean", phase), armL: get("arm", phase), armR: get("arm", phase + .5),
    elbowL: get("elbow", phase), elbowR: get("elbow", phase + .5), head: get("head", phase), tau: phase * TAU,
  };
}
