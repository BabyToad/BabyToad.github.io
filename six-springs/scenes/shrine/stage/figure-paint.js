import { drawCanvas } from '../../../src/render.js';
import { mul,apply } from '../../../src/math.js';
import { cupPreset } from './spatial.js';

/** Serving art is an authored view preset. Keep all of its registration here,
 * outside the generic rig and the Three renderer. The original curves survive. */
export function paintFigure(ctx,performance,hands,registration,bowlCut,parts=[]) {
  const view=performance.rig.views.front,pose=performance.actor.pose;
  if(!performance.cup){
    const active=parts.filter(part=>part.active());
    if(!active.length){drawCanvas(ctx,view,pose);return;}
    const frame=view.evaluate(pose),S=view.skeleton(view.resolve(pose));
    const packet=paths=>({paint(sink){for(const path of paths)sink({kind:'path',...path});}});
    drawCanvas(ctx,packet(frame.paths.filter(path=>!active.some(part=>part.layer===path.layer))));
    for(const part of active){
      const wrist=view.pivots[part.wrist],elbow=view.pivots[part.elbow],length=Math.hypot(wrist[0]-elbow[0],wrist[1]-elbow[1]);
      const d=[(wrist[0]-elbow[0])/length,(wrist[1]-elbow[1])/length],n=[-d[1],d[0]];
      const corners=[[-1000,-1000],[1000,-1000],[1000,3],[-1000,3]].map(([x,y])=>apply(S[part.bone],[wrist[0]+n[0]*x+d[0]*y,wrist[1]+n[1]*x+d[1]*y]));
      ctx.save();ctx.beginPath();corners.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
      drawCanvas(ctx,packet(frame.paths.filter(path=>path.layer===part.layer)));ctx.restore();
      ctx.save();part.paint(ctx,{performance,view,pose,S});ctx.restore();
    }
    return;
  }
  const frame=view.evaluate(pose),S=view.skeleton(view.resolve(pose));
  const packet=paths=>({paint(sink){for(const path of paths)sink({kind:'path',...path});}});
  const arm=path=>path.layer==='b:front.uarmL'||path.layer==='b:front.farmL';
  drawCanvas(ctx,packet(frame.paths.filter(x=>!arm(x))));
  drawCanvas(ctx,packet(frame.paths.filter(x=>x.layer==='b:front.uarmL')));
  // Clip the old integrated hand at its wrist, in the wrist's moving frame.
  // Forearm and bangles remain vector paths; the serving tab covers the join.
  const wrist=view.pivots['b.wrL'],elbow=view.pivots['b.elL'];
  const length=Math.hypot(wrist[0]-elbow[0],wrist[1]-elbow[1]);
  const d=[(wrist[0]-elbow[0])/length,(wrist[1]-elbow[1])/length],n=[-d[1],d[0]];
  const corners=[[-1000,-1000],[1000,-1000],[1000,3],[-1000,3]].map(([x,y])=>apply(S.handL,[wrist[0]+n[0]*x+d[0]*y,wrist[1]+n[1]*x+d[1]*y]));
  function forearm(){ctx.save();ctx.beginPath();corners.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
    drawCanvas(ctx,packet(frame.paths.filter(x=>x.layer==='b:front.farmL')));ctx.restore();}
  const basis=mul(S.handL,cupPreset(view).basis),mode=performance.bowl.held?'cup':'open';
  function part(name){const def=registration.parts[name],image=hands.get(name);
    ctx.save();ctx.transform(...basis);ctx.drawImage(image,...def.topLeft,image.width*def.scale,image.height*def.scale);ctx.restore();}
  part(`${mode}-palm`);part(`${mode}-back`);forearm();
  if(performance.bowl.held){
    const local=performance.characterFrame.local(performance.bowl.position),unit=performance.space.unit;
    const [x,y,w,h]=bowlCut.bounds,{depth,anchor}=performance.offering,scale=depth/performance.space.p.f/unit;
    ctx.drawImage(bowlCut.map.image,local[0]+(x-anchor[0])*scale,local[1]+(y-anchor[1])*scale,w*scale,h*scale);
  }
  part(`${mode}-fingers`);
}
