import { smooth,mix,clamp } from '../../../src/math.js';

/** Pose-to-pose helpers. A key is [tick,value,ease], where ease shapes the segment arriving at it.
 * "f" snaps out and settles, "i" gathers speed, "h" holds then cuts, default eases both ways. */
const EASE={f:u=>1-(1-u)**3,i:u=>u*u*u,h:()=>0};
export function curve(age,keys) {
  if(age<=keys[0][0])return keys[0][1];
  for(let i=1;i<keys.length;i++)if(age<=keys[i][0]) {
    const a=keys[i-1],b=keys[i],u=(age-a[0])/(b[0]-a[0]);
    return mix(a[1],b[1],(EASE[b[2]]||smooth)(u));
  }
  return keys[keys.length-1][1];
}

/** She doesn't walk: front-view cutouts can't. She hops, two or three short ones, and her feet only
 * move while she's in the air, so they can't slide on the stones. */
export const HOP=9;
export function hops(start,from,to,pixels) {
  const n=pixels<8?0:Math.max(1,Math.ceil(pixels/85));
  return {start,from,to,n,end:start+n*HOP,dir:Math.sign(to[0]-from[0])};
}
export function hopAt(plan,age,height=.17) {
  const t=age-plan.start;
  if(t<0)return {position:[...plan.from],active:false};
  if(!plan.n||t>=plan.n*HOP)return {position:[...plan.to],active:false};
  const i=Math.floor(t/HOP),f=t-i*HOP,air=clamp((f-2)/5,0,1),u=mix(i/plan.n,(i+1)/plan.n,smooth(air));
  const position=plan.from.map((v,k)=>mix(v,plan.to[k],u));
  position[1]=height*Math.sin(Math.PI*air);
  return {position,active:true,air:air>0&&air<1?Math.sin(Math.PI*air):0,stretch:f<2?.96:f<7?1.03:.95,index:i};
}
