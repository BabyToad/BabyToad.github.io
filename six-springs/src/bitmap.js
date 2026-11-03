import { IDENTITY, inverse } from "./math.js";

/** Decorative RGBA flat in the same local/world space as a Rig. No tracing or alpha picking.
 * href is a local URL (resolved by the caller) or embedded PNG. Decode before starting playback.
 */
export class Bitmap {
  constructor({href,width,height,opacity=1,blend="source-over"}) {
    if(typeof href!=="string" || !href || ![width,height].every(x=>Number.isFinite(x)&&x>0) || !Number.isFinite(opacity) || opacity<0 || opacity>1 || !["source-over","multiply","screen"].includes(blend)) throw new Error("Invalid bitmap flat");
    this.href=href; this.width=width; this.height=height;
    this.views={default:{evaluate(_pose,world=IDENTITY) {
      if(world.length!==6 || !world.every(Number.isFinite)) throw new Error("Invalid bitmap transform");
      inverse(world);
      const matrix=[...world], command={kind:"bitmap",href,width,height,opacity,blend,world:matrix};
      return {world:matrix,paths:[],anchor(name){if(name!=="origin") throw new Error(`Unknown bitmap anchor ${name}`);return [...matrix];},
        paint(sink){sink(command);},hit(){return null;},draw(){throw new Error("Bitmaps require the paint renderer");}};
    }}};
  }
  neutral() { return {}; }
}

/** Browser-only decode boundary. Resource loading is outside simulation/evaluation. */
export async function loadBitmaps(assets) {
  const images=new Map();
  await Promise.all([...new Set(assets.map(a=>a.href))].map(async href=>{
    const image=new Image(); image.src=href; await image.decode(); images.set(href,image);
  }));
  return images;
}
