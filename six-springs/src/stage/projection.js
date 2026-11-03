// Camera-space metres, right-handed: camera at (0,height,0), looks down -Z.
// cx/cy are the off-axis principal point. Focal length and scale are authored,
// NOT recovered from monocular relative depth. No Three.js dependency here.
export function projection(config) {
  const {width,height}=config.image, {cx,cy,focal:f,height:h}=config.camera;
  if(![width,height,f,h].every(v=>Number.isFinite(v)&&v>0) || ![cx,cy].every(Number.isFinite)) throw Error("Invalid camera");
  const [[x0,y0],[x1,y1]]=config.wall.line, slope=(y1-y0)/(x1-x0), intercept=y0-slope*x0-cy+slope*cx;
  if(!Number.isFinite(slope)||intercept<=0) throw Error("Invalid wall line");
  const wall={normal:[slope*f,0,-intercept],constant:-h*f};
  const floor={normal:[0,1,0],constant:0};
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  function rayPlane(origin,direction,plane) {
    const denominator=dot(plane.normal,direction);
    if(Math.abs(denominator)<1e-10) return null;
    const t=-(dot(plane.normal,origin)+plane.constant)/denominator;
    return t<0 ? null : origin.map((v,i)=>v+t*direction[i]);
  }
  function atDepth([x,y],depth) {
    if(![x,y].every(Number.isFinite)||!Number.isFinite(depth)||depth<=0) throw Error("Pixel must be finite and depth positive");
    return [(x-cx)*depth/f,h+(cy-y)*depth/f,-depth];
  }
  function project([x,y,z]) {
    if(![x,y,z].every(Number.isFinite)||z>=0) throw Error("Point must be finite and in front of camera");
    return [cx-x*f/z,cy+(y-h)*f/z];
  }
  function onPlane(pixel,plane) {
    const v=atDepth(pixel,1); v[1]-=h;
    const point=rayPlane([0,h,0],v,plane);
    if(!point) throw Error("Pixel ray misses receiver");
    return point;
  }
  return {width,height,cx,cy,f,h,wall,floor,atDepth,project,onPlane,rayPlane,
    wallY:x=>y0+slope*(x-x0),depthAtFloor:p=>-onPlane(p,floor)[2]};
}

/** First physical receiver along a light ray; the wall and floor meet at y=0.
 * Used for independent witnesses/tests, never to draw the shadow (WebGL does that).
 */
export function shadowWitness(camera,point,direction) {
  const hits=[['floor',camera.floor],['wall',camera.wall]].map(([surface,plane])=>{
    const hit=camera.rayPlane(point,direction,plane);
    if(!hit || (surface==='wall' && hit[1]<-1e-8)) return null;
    if(surface==='floor' && camera.wall.normal.reduce((s,v,i)=>s+v*hit[i],camera.wall.constant)>1e-8) return null;
    return {surface,point:hit,distance:Math.hypot(...hit.map((v,i)=>v-point[i]))};
  }).filter(Boolean).sort((a,b)=>a.distance-b.distance);
  return hits[0] || null;
}
