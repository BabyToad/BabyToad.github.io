import { apply, inverse, transform } from "../math.js";

/** World-space palm goal for a declared two-link arm and wrist. Channels must be unit-degree
 * rotations on the named bones. An invertible positive affine world frame is supported; bone links remain uniformly scaled.
 * Returns residual/clamped: the application must decide whether contact is possible.
 */
export function solveHand(view,pose,chain,{position,angle},world) {
  if(!position?.every(Number.isFinite) || position.length!==2 || !Number.isFinite(angle)) throw new Error("Invalid hand goal");
  const q={...pose}, {upper,lower,hand,wrist,palm,bend,channels}=chain;
  const end=view.pivots[wrist], tip=view.pivots[palm];
  if(!end || !tip || !channels?.every(k=>Object.hasOwn(q,k)) || channels.length!==3) throw new Error("Invalid hand chain");
  q[channels[2]]=0;
  const inv=inverse(world),r=angle*Math.PI/180;
  if(world[0]*world[3]-world[1]*world[2]<=0)throw Error('Hand goal requires positive world determinant');
  const direction=[inv[0]*Math.cos(r)+inv[2]*Math.sin(r),inv[1]*Math.cos(r)+inv[3]*Math.sin(r)];
  const localAngle=Math.atan2(direction[1],direction[0])*180/Math.PI;
  const inherited=view.skeleton(view.resolve(q))[hand];
  const scale=Math.hypot(inherited[0],inherited[1]);
  if(inherited[0]*inherited[3]-inherited[1]*inherited[2]<=0 || Math.abs(scale-Math.hypot(inherited[2],inherited[3]))>1e-7 || Math.abs(inherited[0]*inherited[2]+inherited[1]*inherited[3])>1e-7) throw new Error("Hand goal requires positive uniform scale");
  const delta=apply(transform(0,0,localAngle,scale),[tip[0]-end[0],tip[1]-end[1]]);
  const local=apply(inv,position),target=[local[0]-delta[0],local[1]-delta[1]];
  const solved=view.reach(q,{upper,lower,end:wrist,bend},target);
  q[channels[0]]=solved.upper; q[channels[1]]=solved.lower;
  const matrix=view.skeleton(view.resolve(q))[hand];
  q[channels[2]]=localAngle-Math.atan2(matrix[1],matrix[0])*180/Math.PI;
  const actual=apply(world,view.point(q,hand,palm)), error=Math.hypot(actual[0]-position[0],actual[1]-position[1]);
  return {pose:q,actual,error,clamped:solved.clamped};
}

/** Prefer the authored orientation, but allow a bounded turn to keep the wrist
 * inside its declared range. This is not a general joint-limit solver. Never
 * clamp a solved wrist afterwards: that silently moves the contact point. */
export function solveHandWithWristLimit(view,pose,chain,goal,world,{maxTurn=30}={}) {
  const key=chain.channels[2],[lo,hi]=view.controls[key];
  const solve=angle=>({...solveHand(view,pose,chain,{...goal,angle},world),angle});
  const valid=s=>!s.clamped&&s.pose[key]>=lo&&s.pose[key]<=hi;
  const first=solve(goal.angle);if(valid(first))return {...first,withinLimits:true};
  for(let turn=2;turn<=maxTurn;turn+=2)for(const sign of [-1,1]) {
    const found=solve(goal.angle+turn*sign);if(!valid(found))continue;
    let invalid=goal.angle,angle=found.angle,best=found;
    for(let i=0;i<18;i++){const mid=(invalid+angle)/2,candidate=solve(mid);if(valid(candidate)){angle=mid;best=candidate;}else invalid=mid;}
    return {...best,withinLimits:true};
  }
  return {...first,withinLimits:false};
}
