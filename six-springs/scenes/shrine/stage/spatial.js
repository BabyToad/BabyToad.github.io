import { projection } from '../../../src/stage/projection.js';
import { transform,apply,inverse } from '../../../src/math.js';

/** One physical figure scale shared by simulation, texture placement and contacts. */
export function figureSpace(rig,config) {
  const p=projection(config),view=rig.views.front,neutral=view.evaluate(rig.neutral());
  const footY=neutral.paths.filter(x=>x.layer.includes('.foot')).reduce((v,x)=>x.Y.reduce((a,b)=>Math.max(a,b),v),-Infinity);
  const topY=neutral.paths.reduce((v,x)=>x.Y.reduce((a,b)=>Math.min(a,b),v),Infinity);
  const home=p.onPlane(config.saint.feet,p.floor);
  const unit=config.saint.heightPixels*(-home[2])/p.f/(footY-topY);
  function frame(root,{sx=1,sy=1,lean=0}={}) {
    const r=lean*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
    // World basis has upward Y; screen/rig basis has downward Y.
    const basis=[sx*c,sx*s,-sy*s,sy*c];
    const foot=p.project(root),scale=unit*p.f/-root[2];
    const screen=[scale*basis[0],-scale*basis[1],-scale*basis[2],scale*basis[3],0,0];
    screen[4]=foot[0]-screen[0]*360-screen[2]*footY;
    screen[5]=foot[1]-screen[1]*360-screen[3]*footY;
    const inv=inverse(screen),origin=[...root];
    return {basis,screen,
      world(local){const dx=(local[0]-360)*unit,dy=(footY-local[1])*unit;
        return [origin[0]+basis[0]*dx+basis[2]*dy,origin[1]+basis[1]*dx+basis[3]*dy,origin[2]];},
      local(world){return apply(inv,p.project(world));},
    };
  }
  return {p,home,unit,footY,frame,
    world(local,root,squash){return frame(root,squash).world(local);},
    local(world,root,squash){return frame(root,squash).local(world);},
    screen(root,squash){return frame(root,squash).screen;},
  };
}

export const CUP_ANGLE=76;
export const CUP_SCALE=.85*.78;
export function cupPreset(view) {
  const wrist=view.pivots['b.wrL'];
  const basis=transform(wrist[0],wrist[1],-CUP_ANGLE,CUP_SCALE);
  return {basis,support:apply(basis,[82,-8])};
}

/** Semi-implicit fixed-tick rigid point with an upright bowl's bottom as contact.
 * World gravity and the stage floor are shared; no screen-space falling offsets.
 */
export function fallStep(body,dt=1/24) {
  if(body.settled)return false;
  body.velocity[1]-=9.81*dt;
  for(let i=0;i<3;i++)body.position[i]+=body.velocity[i]*dt;
  if(body.position[1]>0)return false;
  body.position[1]=0;
  const speed=-body.velocity[1];body.velocity[1]=speed*.24;
  body.velocity[0]*=.56;body.velocity[2]*=.56;
  if(speed<.65){body.velocity=[0,0,0];body.settled=true;}
  return true;
}
