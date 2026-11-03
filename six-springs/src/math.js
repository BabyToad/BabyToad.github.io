/** Affine matrices [a,b,c,d,e,f], points [x,y]. Character/world coordinates are y-down. */
export const IDENTITY = Object.freeze([1, 0, 0, 1, 0, 0]);
export const mul = (m, n) => [m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1], m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3], m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]];
export const apply = (m, p) => [m[0]*p[0]+m[2]*p[1]+m[4], m[1]*p[0]+m[3]*p[1]+m[5]];
export function inverse([a,b,c,d,e,f]) {
  const det = a*d-b*c;
  if (!Number.isFinite(det) || Math.abs(det) < 1e-12) throw new Error("Non-invertible transform");
  return [d/det, -b/det, -c/det, a/det, (c*f-d*e)/det, (b*e-a*f)/det];
}
export function transform(x = 0, y = 0, degrees = 0, scale = 1) {
  const r = degrees*Math.PI/180, c = Math.cos(r)*scale, s = Math.sin(r)*scale;
  return [c,s,-s,c,x,y];
}
export const mix = (a,b,u) => a+(b-a)*u;
export const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
export const smooth = u => { u = clamp(u,0,1); return u*u*(3-2*u); };
