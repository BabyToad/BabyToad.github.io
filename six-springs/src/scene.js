import { IDENTITY, inverse, mul, transform } from "./math.js";

export const TICK_RATE = 24;

/** Full-frame inheritance, or position following with a supplied world linear basis.
 * The latter keeps an upright prop's own size/orientation, even as the parent rotates/scales.
 */
export function attachmentWorld(parent, child, offset=IDENTITY, linear=null) {
  const target=mul(parent,offset);
  if(!linear) return mul(target,inverse(child));
  const [a,b,c,d]=linear;
  return [a,b,c,d,target[4]-a*child[4]-c*child[5],target[5]-b*child[4]-d*child[5]];
}

/** One scene clock. State changes in step(update); evaluate and rendering are read-only.
 * Input logs contain accepted intent IDs and exact ticks, independent of display refresh.
 */
export class Scene {
  constructor() {
    this.tick=0; this.nodes=new Map(); this.pending=[]; this.inputs=[]; this.seen=new Set(); this.trace=[]; this.sequence=0;
    this.derivation=0; this.updating=false; this.camera={x:0,y:0};
  }
  add(id, rig, { view=Object.keys(rig.views)[0], pose=rig.neutral(), transform=IDENTITY, order=0, interactive=true, parallax=1 }={}) {
    if(this.nodes.has(id) || !rig.views[view]) throw new Error(`Duplicate node or unknown view: ${id}/${view}`);
    if(!Number.isFinite(parallax) || !Number.isFinite(order)) throw new Error("Invalid node parallax/order");
    const node={id,rig,view,pose,transform:[...transform],order,interactive,parallax,attachment:null};
    this.nodes.set(id,node); return node;
  }
  node(id) { const n=this.nodes.get(id); if(!n) throw new Error(`Unknown scene node ${id}`); return n; }
  enqueue(intent, tick=this.tick+1) {
    if(!Number.isSafeInteger(tick) || tick<=this.tick) throw new Error("Input tick must be in the future");
    if(!intent || typeof intent.kind!=="string" || !intent.kind) throw new Error("Intent requires a kind");
    const copy=structuredClone(intent);
    if(copy.id!==undefined && (typeof copy.id!=="string" || !copy.id)) throw new Error("Intent requires a string ID");
    if(this.updating) {
      if(copy.id===undefined) do { copy.id=`derived:${++this.derivation}`; } while(this.seen.has(copy.id));
      else copy.id=`derived:${copy.id}`;
    } else {
      if(copy.id?.startsWith?.("derived:")) throw new Error("The derived: ID namespace is reserved");
      if(copy.id===undefined) do { copy.id=`intent-${++this.sequence}`; } while(this.seen.has(copy.id));
    }
    if(typeof copy.id!=="string" || !copy.id) throw new Error("Intent requires a string ID");
    if(this.seen.has(copy.id)) return false;
    this.seen.add(copy.id);
    const entry={tick,intent:copy};
    this.pending.push(entry);
    // Commands caused by this simulation are regenerated, never supplied a second time by replay.
    if(!this.updating) this.inputs.push(structuredClone(entry));
    return true;
  }
  step(update) {
    if(this.updating) throw new Error("Scene steps cannot nest");
    this.tick++;
    // External observations precede consequences at the same tick. Stable sort
    // preserves each origin's enqueue order even when replay preloads inputs.
    const due=this.pending.filter(e=>e.tick===this.tick).sort((a,b)=>
      Number(a.intent.id.startsWith("derived:"))-Number(b.intent.id.startsWith("derived:")));
    this.pending=this.pending.filter(e=>e.tick>this.tick);
    this.updating=true;
    try { update(this.tick,due.map(e=>structuredClone(e.intent))); }
    finally { this.updating=false; }
  }
  record(kind, detail={}) {
    this.trace.push({tick:this.tick,kind,...structuredClone(detail)});
    if(this.trace.length>240) this.trace.shift();
  }
  evaluate() {
    if(![this.camera.x,this.camera.y].every(Number.isFinite)) throw new Error("Invalid camera position");
    const frames=new Map(), visiting=new Set();
    const evaluate=id=>{
      if(frames.has(id)) return frames.get(id);
      if(visiting.has(id)) throw new Error(`Attachment cycle at ${id}`);
      visiting.add(id);
      const n=this.node(id), view=n.rig.views[n.view];
      let world=n.transform;
      if(n.attachment) {
        const a=n.attachment, parent=evaluate(a.parent);
        const child=view.evaluate(n.pose).anchor(a.childAnchor);
        world=attachmentWorld(parent.anchor(a.anchor),child,a.offset,a.linear);
      }
      const frame=view.evaluate(n.pose,world);
      frames.set(id,frame); visiting.delete(id); return frame;
    };
    for(const id of this.nodes.keys()) evaluate(id);
    const parallax=n=>n.attachment ? parallax(this.node(n.attachment.parent)) : n.parallax;
    const projected=[...this.nodes.values()].sort((a,b)=>a.order-b.order).map(n=>{
      const world=frames.get(n.id), p=parallax(n);
      const frame=this.camera.x || this.camera.y ? n.rig.views[n.view].evaluate(n.pose,mul(transform(-this.camera.x*p,-this.camera.y*p),world.world)) : world;
      return {id:n.id,interactive:n.interactive,frame};
    });
    // Explicit insertion is a drawing decision, independent of attachment. Slice geometry once
    // for both paint and hit testing; never redraw a whole actor on top of an inserted prop.
    const before=new Map(), entries=new Map(projected.map(n=>[n.id,n]));
    for(const {id} of projected) { const node=this.node(id); if(node.paintBefore) {
      const {node:parent,layer}=node.paintBefore, entry=entries.get(parent);
      if(!entry || !entry.frame.paths.some(p=>p.layer===layer)) throw new Error(`Unknown insertion layer ${parent}/${layer}`);
      const key=JSON.stringify([parent,layer]); if(!before.has(key)) before.set(key,[]);
      before.get(key).push(entries.get(node.id));
    }}
    const order=[], emitted=new Set(), painting=new Set();
    const emit=entry=>{
      if(painting.has(entry.id)) throw new Error("Paint insertion cycle");
      if(emitted.has(entry.id)) return;
      painting.add(entry.id);
      const layers=[...new Set(entry.frame.paths.map(p=>p.layer))];
      if(layers.some(layer=>before.has(JSON.stringify([entry.id,layer])))) {
        for(const layer of layers) {
          for(const child of before.get(JSON.stringify([entry.id,layer])) || []) emit(child);
          order.push({...entry,frame:entry.frame.slice(layer)});
        }
      } else order.push(entry);
      painting.delete(entry.id);emitted.add(entry.id);
    };
    for(const entry of projected) if(!this.node(entry.id).paintBefore) emit(entry);
    if(emitted.size!==projected.length) throw new Error("Paint insertion cycle");
    return {
      tick:this.tick, frames, order,
      draw(poseOrSink,sink=poseOrSink) { for(const n of order) n.frame.draw(sink); },
      paint(sink) { for(const n of order) n.frame.paint(sink); },
      hit(point) { for(let i=order.length-1;i>=0;i--) { const n=order[i], layer=n.interactive && n.frame.hit(point); if(layer) return {node:n.id,layer}; } return null; },
    };
  }
  /** Without offset, preserve the child's current world transform. With offset, align the two anchors. */
  attach(id,parent,anchor,{childAnchor="origin",offset,inherit="frame"}={}) {
    if(!["frame","position"].includes(inherit)) throw new Error("Invalid attachment inheritance");
    const n=this.node(id); this.node(parent);
    for(let cursor=parent;cursor;cursor=this.node(cursor).attachment?.parent) if(cursor===id) throw new Error("Attachment cycle");
    const frames=this.evaluate().frames, p=frames.get(parent).anchor(anchor);
    const local=n.rig.views[n.view].evaluate(n.pose).anchor(childAnchor);
    const relative=offset ? [...offset] : mul(mul(inverse(p),frames.get(id).world),local);
    if(relative.length!==6 || !relative.every(Number.isFinite)) throw new Error("Invalid attachment offset");
    inverse(relative);
    const linear=inherit==="position" ? frames.get(id).world.slice(0,4) : null;
    n.attachment={parent,anchor,childAnchor,offset:relative,linear};
    this.record("attach",{node:id,parent,anchor,inherit});
  }
  detach(id) {
    const n=this.node(id);
    if(!n.attachment) return;
    const world=this.evaluate().frames.get(id).world;
    n.attachment=null; n.transform=[...world]; this.record("detach",{node:id});
  }
}

/** Presentation clock, with deliberate suspension policy. No variable-dt motion.
 * A gap over 250ms is treated as a pause; do not fast-forward unattended actors.
 */
export class Clock {
  constructor() { this.accumulator=0; }
  reset() { this.accumulator=0; }
  advance(seconds,step) {
    if(!Number.isFinite(seconds) || seconds<0) throw new Error("Invalid elapsed time");
    if(seconds>.25) { this.reset(); return 0; }
    this.accumulator+=seconds; let count=0;
    while(this.accumulator+1e-12>=1/TICK_RATE) { step(); this.accumulator-=1/TICK_RATE; count++; }
    this.accumulator=Math.max(0,this.accumulator); return count;
  }
}
