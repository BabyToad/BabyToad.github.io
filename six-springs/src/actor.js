import { Secondary } from "./motion/secondary.js";
import { compileClip, sampleClip } from "./motion/clip.js";
import { blendControl } from "./motion/mixer.js";
import { smooth } from "./math.js";

/** A small ordered performance stack. Each slot owns only its authored track keys.
 * On replacement or cancellation, capture the visible values before fading to the next source.
 * Scene advances this actor exactly once per tick. Rendering never advances it.
 */
export class Actor {
  constructor(rig,{view=Object.keys(rig.views)[0],base=()=>({}),constrain=pose=>pose,slots=["expression","action"],startTick=0}={}) {
    if(!Number.isSafeInteger(startTick) || startTick<0 || !rig.views[view]) throw new Error("Invalid actor start/view");
    this.rig=rig; this.view=view; this.base=base; this.constrain=constrain; this.slots=[...slots]; this.layers=new Map();
    this.pose=rig.neutral(); this.primary={...this.pose}; this.tick=startTick; this.secondary=new Secondary(24); this.events=[];
  }
  play(slot,source,options) {
    const clip=compileClip(source,this.rig.controls,this.rig.controlInfo);
    return this.drive(slot,{keys:Object.keys(clip.tracks),sample:age=>sampleClip(clip,age),duration:clip.duration,markers:clip.markers},options);
  }
  /** Tick-sampled source, optionally finite. External observations belong in recorded scene inputs.
   * sample(age,{tick,pose}) receives a copy of lower layers, once per tick and never from rendering.
   */
  drive(slot,source,{id,fade=4,release=8}={}) {
    if(!this.slots.includes(slot) || typeof id!=="string" || !id) throw new Error("Play requires a known slot and request ID");
    if(![fade,release].every(x=>Number.isSafeInteger(x) && x>=0)) throw new Error("Fade durations must be nonnegative ticks");
    if(!Array.isArray(source.keys) || !source.keys.every(k=>Object.hasOwn(this.rig.controls,k)) || typeof source.sample!=="function") throw new Error("Source needs known keys and a sample function");
    if(source.duration!==undefined && (!Number.isSafeInteger(source.duration) || source.duration<1)) throw new Error("Invalid source duration");
    const markers=structuredClone(source.markers || []);
    let previous=-1;
    for(const m of markers) { if(!Number.isSafeInteger(m.tick) || m.tick<0 || m.tick<previous || m.tick>(source.duration ?? Infinity) || typeof m.name!=="string") throw new Error("Invalid source marker"); previous=m.tick; }
    source={keys:[...new Set(source.keys)],sample:source.sample,duration:source.duration,markers};
    const old=this.layers.get(slot);
    if(old?.id===id) return false;
    const keys=new Set([...source.keys,...(old?.keys || [])]);
    if(old?.source) this.events.push({kind:"cancelled",id:old.id,slot});
    const retired=new Map();
    for(const key of old?.keys || []) if(!source.keys.includes(key)) {
      // A new source's fade only governs its own controls. In particular, a
      // fade:0 left-arm reach must not terminate the right arm's cancellation.
      retired.set(key,old.retired?.get(key) || (!old.source
        ? {from:old.from[key],age:old.age,fade:old.fade}
        : {from:this.primary[key],age:0,fade:old.release}));
    }
    this.layers.set(slot,{id,source,age:0,fade,release,keys,retired,from:{...this.primary},last:-1});
    this.events.push({kind:"started",id,slot}); return true;
  }
  cancel(slot,{id,fade=8}={}) {
    if(!Number.isSafeInteger(fade) || fade<0) throw new Error("Invalid fade");
    const layer=this.layers.get(slot);
    if(!layer || (id && id!==layer.id)) return false;
    if(layer.source) this.events.push({kind:"cancelled",id:layer.id,slot});
    this.layers.set(slot,{...layer,source:null,retired:new Map(),from:{...this.primary},age:0,fade}); return true;
  }
  step(tick) {
    if(tick!==this.tick+1) throw new Error("Actor must advance once per scene tick");
    this.tick=tick;
    const q=this.rig.neutral(this.base(tick)), owners=Object.fromEntries(Object.keys(this.rig.controls).map(k=>[k,"base"]));
    for(const slot of this.slots) {
      const layer=this.layers.get(slot); if(!layer) continue;
      const patch=layer.source ? layer.source.sample(layer.age,{tick,pose:{...q}}) : {};
      if(!patch || typeof patch!=="object" || Object.entries(patch).some(([k,v])=>!layer.source?.keys.includes(k) || !Number.isFinite(v))) throw new Error("Source returned unknown or non-finite control");
      const u=layer.fade ? smooth(layer.age/layer.fade) : 1;
      for(const key of layer.keys) {
        const retired=layer.retired?.get(key);
        const weight=retired ? (retired.fade ? smooth(retired.age/retired.fade) : 1) : u;
        q[key]=blendControl(retired ? retired.from : layer.from[key],patch[key] ?? q[key],weight,this.rig.controlInfo[key]);
        if(weight<1 || Object.hasOwn(patch,key)) owners[key]=slot;
        if(retired) {retired.age++;if(weight===1){layer.retired.delete(key);layer.keys.delete(key);}}
      }
      if(layer.source) {
        for(const marker of layer.source.markers) if(marker.tick>layer.last && marker.tick<=layer.age) this.events.push({kind:"marker",slot,id:layer.id,name:marker.name,clipTick:marker.tick});
        layer.last=layer.age;
        if(layer.age>=layer.source.duration) {
          this.events.push({kind:"completed",slot,id:layer.id});
          this.layers.set(slot,{...layer,source:null,from:{...q},age:-1,fade:layer.release});
        }
      } else if(layer.age>=layer.fade && !layer.retired?.size) this.layers.delete(slot);
      // The replacement release starts at age zero on the following scene tick.
      this.layers.get(slot) && this.layers.get(slot).age++;
    }
    this.primary={...q}; this.pose=this.secondary.step(this.rig.views[this.view],q,this.world);
    for(const rule of this.rig.views[this.view].secondary) for(const key of rule.into) owners[key]=rule.add ? `${owners[key]} + secondary` : "secondary";
    const before={...this.pose};
    this.pose=this.rig.neutral(this.constrain({...this.pose},tick));
    this.constraintDelta=Object.fromEntries(Object.keys(this.pose).map(key=>[key,this.pose[key]-before[key]]));
    for(const key of Object.keys(owners)) if(this.pose[key]!==before[key]) owners[key]="constraint";
    this.owners=owners;
    const events=this.events; this.events=[]; return events;
  }
}

/** Deterministic local PRNG; never shares the browser/game's random stream. */
export function random(seed=1) {
  let state=seed>>>0;
  return ()=>{ state=(Math.imul(state,1664525)+1013904223)>>>0; return state/4294967296; };
}
