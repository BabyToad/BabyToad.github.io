// Pure geometry. Targets must already be in the limb's parent/rest coordinate frame.
const DEG = 180 / Math.PI;
const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));

/** Two-link IK. Margins are lengths in rest coordinates; defaults are scale-relative.
 * parentDeg is retained for old callers, but cannot correct a translated root. Prefer inverse(parent)*target.
 */
export function twoBone(rest, target, bend = 1, parentDeg = 0, margins = {}) {
  const { root, mid, end } = rest;
  if (![...root, ...mid, ...end, ...target, parentDeg].every(Number.isFinite)) throw new Error("IK requires finite points and angles");
  if (bend !== 1 && bend !== -1) throw new Error("IK bend must be +1 or -1");
  const a = Math.hypot(mid[0]-root[0], mid[1]-root[1]), b = Math.hypot(end[0]-mid[0], end[1]-mid[1]);
  if (!(a > 0 && b > 0)) throw new Error("IK links must have positive length");
  const eps = Math.min(a,b)*1e-6;
  const { extensionMargin = eps, foldMargin = eps } = margins;
  if (![extensionMargin,foldMargin].every(x => Number.isFinite(x) && x >= 0)) throw new Error("Invalid IK margins");
  const max = a+b-Math.max(eps,extensionMargin), min = Math.abs(a-b)+Math.max(eps,foldMargin);
  if (min > max) throw new Error("IK margins leave no reachable interval");
  const dx = target[0]-root[0], dy = target[1]-root[1], requested = Math.hypot(dx,dy);
  const restUp = Math.atan2(mid[1]-root[1], mid[0]-root[0]), restLow = Math.atan2(end[1]-mid[1], end[0]-mid[0]);
  const base = requested > eps ? Math.atan2(dy,dx) : restUp;
  const d = Math.max(min,Math.min(max,requested));
  const A = Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));
  const up = base+bend*A;
  const low = Math.atan2(Math.sin(base)*d-Math.sin(up)*a, Math.cos(base)*d-Math.cos(up)*a);
  const upper = wrap(up-restUp)*DEG-parentDeg, lowerWorld = wrap(low-restLow)*DEG;
  return { upper, lower: lowerWorld-upper-parentDeg, lowerWorld, reach: d, clamped: Math.abs(d-requested) > eps };
}
