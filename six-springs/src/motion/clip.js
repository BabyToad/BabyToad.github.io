import { mix, smooth } from "../math.js";
import { TICK_RATE } from "../scene.js";

/** One-shot clip envelope. Key/marker times are integer simulation ticks, endpoints inclusive.
 * Easing on a key controls the segment arriving at it: linear, smooth, or hold.
 */
export function compileClip(source, controls, controlInfo={}) {
  const clip=structuredClone(source);
  clip.discrete=Object.keys(controlInfo).filter(k=>controlInfo[k].blend==='discrete');
  if(clip.format!==1 || clip.tickRate!==TICK_RATE || !Number.isSafeInteger(clip.duration) || clip.duration<1) throw new Error("Clip needs format 1, tickRate 24 and a positive integer duration");
  if(!clip.tracks || typeof clip.tracks!=="object" || Array.isArray(clip.tracks)) throw new Error("Clip requires a tracks object");
  for(const [key,keys] of Object.entries(clip.tracks || {})) {
    if(!Object.hasOwn(controls,key)) throw new Error(`Unknown clip control ${key}`);
    if(!Array.isArray(keys) || !keys.length) throw new Error(`Empty track ${key}`);
    let last=-1;
    for(const [tick,value,ease="smooth"] of keys) {
      if(!Number.isSafeInteger(tick) || tick<0 || tick<=last || tick>clip.duration || !Number.isFinite(value) || !["linear","smooth","hold"].includes(ease)) throw new Error(`Invalid keys in ${key}`);
      if(clip.discrete.includes(key)&&!controlInfo[key].values.includes(value))throw Error(`Unknown drawing identity in ${key}`);
      last=tick;
    }
  }
  clip.markers ??= [];
  let last=-1;
  for(const marker of clip.markers) {
    if(!Number.isSafeInteger(marker.tick) || marker.tick<last || marker.tick<0 || marker.tick>clip.duration || typeof marker.name!=="string") throw new Error("Invalid clip markers");
    last=marker.tick;
  }
  return clip;
}
export function sampleClip(clip,tick) {
  const patch={};
  for(const [key,keys] of Object.entries(clip.tracks || {})) {
    let value=keys[0][1];
    for(let i=1;i<keys.length;i++) {
      const a=keys[i-1], b=keys[i];
      if(tick>=b[0]) { value=b[1]; continue; }
      const u=Math.max(0,(tick-a[0])/(b[0]-a[0])), ease=clip.discrete?.includes(key)?"hold":b[2] ?? "smooth";
      value=mix(a[1],b[1],ease==="hold" ? 0 : ease==="linear" ? u : smooth(u)); break;
    }
    patch[key]=value;
  }
  return patch;
}
