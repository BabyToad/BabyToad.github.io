import { mul, transform } from "./math.js";

// Flatten only for picking, lazily. Rendering retains the original cubic paths.
function flatten(a,b,c,d,out,depth=0) {
  const dx=d[0]-a[0], dy=d[1]-a[1], length=Math.hypot(dx,dy);
  const distance = p => length ? Math.abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/length : Math.hypot(p[0]-a[0],p[1]-a[1]);
  if (depth === 12 || Math.max(distance(b),distance(c)) <= .35) { out.push(d); return; }
  const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
  const ab=mid(a,b), bc=mid(b,c), cd=mid(c,d), abc=mid(ab,bc), bcd=mid(bc,cd), center=mid(abc,bcd);
  flatten(a,ab,abc,center,out,depth+1); flatten(center,bcd,cd,d,out,depth+1);
}
function contours(path) {
  const at=i=>[path.X[i],path.Y[i]];
  return path.rows.map(([start,length])=>{
    const points=[at(start)];
    for(let i=start+1;i<start+length;i+=3) flatten(points.at(-1),at(i),at(i+1),at(i+2),points);
    return points;
  });
}
function contains(polygons,[x,y]) {
  let winding=0;
  for(const points of polygons) for(let i=0;i<points.length;i++) {
    const a=points[i], b=points[(i+1)%points.length];
    const cross=(b[0]-a[0])*(y-a[1])-(x-a[0])*(b[1]-a[1]);
    if (a[1]<=y && b[1]>y && cross>0) winding++;
    if (a[1]>y && b[1]<=y && cross<0) winding--;
  }
  return winding!==0;
}

/** Read-only-by-contract snapshot. Geometry, picking and anchors share one pose and transform.
 * Picking uses nonzero winding and .35 world-unit cubic flattening tolerance.
 */
export class Frame {
  constructor(view, pose, world, skeleton, paths) {
    this.view=view.name; this.pose={...pose}; this.world=[...world]; this.paths=paths;
    this.anchors={}; this.pickCache=new Map();
    for(const [name,a] of Object.entries(view.anchors)) {
      const p=typeof a.pivot === "string" ? view.pivots[a.pivot] : a.pivot;
      this.anchors[name]=mul(mul(world,skeleton[a.bone]),transform(p[0],p[1],a.angle ?? 0,a.scale ?? 1));
    }
  }
  anchor(name) {
    if (!Object.hasOwn(this.anchors,name)) throw new Error(`Unknown anchor ${name} in ${this.view}`);
    return [...this.anchors[name]];
  }
  draw(poseOrSink, sink=poseOrSink) { for(const p of this.paths) sink(p.fill,p.X,p.Y,p.rows); }
  paint(sink) { for(const p of this.paths) sink({kind:"path",...p}); }
  slice(layer) { return Object.assign(Object.create(Frame.prototype),this,{paths:this.paths.filter(p=>p.layer===layer),pickCache:new Map()}); }
  hit(point) {
    for(let i=this.paths.length-1;i>=0;i--) {
      const p=this.paths[i];
      if(!this.pickCache.has(i)) this.pickCache.set(i,contours(p));
      if(contains(this.pickCache.get(i),point)) return p.layer;
    }
    return null;
  }
}

export function worldPoints(X,Y,m) {
  const x=new Float64Array(X.length), y=new Float64Array(Y.length);
  for(let i=0;i<X.length;i++) { x[i]=m[0]*X[i]+m[2]*Y[i]+m[4]; y[i]=m[1]*X[i]+m[3]*Y[i]+m[5]; }
  return [x,y];
}
