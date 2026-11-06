import {smooth,mix} from '../../../../src/math.js';
import {curve} from '../keys.js';
import {paintBeetle} from './insect-paint.js';
import {startle} from '../acoustics.js';

// A bronze leaf beetle: proposed stage business, not campaign lore. Coordinates
// follow the upper edge of the existing foreground leaf; the painting is intact.
const SLOT='insect.notice', DEPTH=4.8;
// Its nerve in dB: a bell across the shrine is a big check, a bowl on stone a
// smaller one; far rustles stay below the threshold. Wind is air, not sound.
const NERVE=34,SPAN=33,FLOOR=.12;
const leaf=u=>[mix(145,233,u),842+25*u+15*u*u];
export function insect(host){
  const rng=host.random('insect');
  let mode='rest',start=0,duration=78,u=.32,from=u,to=u,dir=1;
  let visits=0,alarm=0,lastTouch=-1000,quiet=0,returnAt=0,flightFrom=leaf(u);
  let focus=false,pan={from:0,to:0,start:0},response=null,landed=0,previous=leaf(u),speed=0,heading=-1.11;
  const age=()=>host.tick-start;
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start)/12));
  function framing(open){pan={from:panAmount(),to:open?1:0,start:host.tick};focus=open;}
  function enter(next,length){mode=next;start=host.tick;duration=length;}
  function position(){
    if(mode==='fly'){
      const a=smooth((age()-10)/38);
      return [flightFrom[0]-a*250,flightFrom[1]-Math.sin(a*Math.PI*.7)*150];
    }
    if(mode==='return'){
      const a=smooth(age()/42),p=leaf(u);
      return [mix(-65,p[0],a),mix(p[1]-140,p[1],a)-Math.sin(a*Math.PI)*45];
    }
    return leaf(u);
  }
  const world=()=>host.p.atDepth(position(),DEPTH);
  function leave(){if(response)host.actor.cancel(SLOT,{id:response,fade:8});response=null;}
  function notice(id){
    if(host.action||host.bowl.held)return;
    response=id;
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','browR'],duration:66,
      sample(a,{pose}){const t=curve(a,[[0,0],[8,1],[28,1],[42,0],[66,0]]);
        return {gaze:mix(pose.gaze,-.85,t),yaw:mix(pose.yaw,-.5,t),pitch:mix(pose.pitch,.5,t),
          head:pose.head-3*t,browR:pose.browR-3*t};}}, {id,fade:5,release:8});
  }
  function depart(reason){
    if(['fly','away','return'].includes(mode))return;
    flightFrom=position();dir=1;enter('fly',49);
    host.consequence('insect-wing-open',{point:world(),reason});
  }
  function disturb(strength,reason){
    if(['fly','away','return'].includes(mode))return false;
    quiet=0;alarm=Math.min(4,alarm+strength);
    if(alarm>=2.5)depart(reason);
    else {enter('freeze',36+Math.round(strength*24));host.consequence('insect-freeze',{point:world(),strength,reason});}
    return true;
  }
  return {id:'insect',layers:[SLOT],
    targets:{insect:{control:'insect',priority:3,point:()=>position(),
      hit:(x,y)=>mode!=='away'&&Math.hypot(x-position()[0],y-position()[1])<24,
      interact:()=>({kind:'insect-touch'})}},
    intents:{'insect-touch'(intent){
      if(mode!=='away'&&host.tick-lastTouch<8)return false;
      host.consequence('scenic-focus',{resident:'insect'});framing(true);
      visits++;
      // A missing beetle stays missing. A patient visitor can watch its return;
      // rapid clicks never restart a flight or postpone it indefinitely.
      if(mode==='away'){returnAt=Math.min(returnAt,host.tick+90);return true;}
      lastTouch=host.tick;disturb(visits===1?.7:1.15,'visitor');notice(intent.id);return true;
    },'insect-dismiss'(){framing(false);leave();return true;}},
    onEvent(e){
      if(e.kind==='scenic-focus'&&e.resident!=='insect'){focus=false;pan={from:0,to:0,start:host.tick};leave();}
      if(e.kind==='wind'){disturb(.5,'wind');return;}
      if(e.kind.startsWith('insect-'))return;
      const strength=startle(e,world(),NERVE,SPAN);
      if(strength>FLOOR)disturb(strength,e.kind==='land'?'bowl':e.kind);
    },
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&['ring','offer','poke','notice','interrupt','water','feed-frog'].includes(intent.kind))){framing(false);leave();}
      if(focus&&tick-pan.start>320)framing(false);
    },
    afterPhysics(tick){
      quiet++;alarm=Math.max(0,alarm-.004);
      const goal=dir<0?2.03:-1.11,turn=Math.atan2(Math.sin(goal-heading),Math.cos(goal-heading));
      heading+=turn*.16;
      if(mode==='walk')u=mix(from,to,smooth(age()/duration));
      const current=position();speed=Math.hypot(current[0]-previous[0],current[1]-previous[1])*24;previous=current;
      if(mode==='fly'&&age()===11)host.consequence('insect-takeoff',{point:world(),speed,reason:'flight'});
      if(mode==='away'){
        if(tick>=returnAt){u=.15+rng()*.55;dir=-1;enter('return',42);}
        return;
      }
      if(age()<duration)return;
      if(mode==='fly'){enter('away',0);returnAt=tick+180+Math.floor(rng()*150);return;}
      if(mode==='return'){
        landed=tick;alarm=.3;enter('settle',18);
        host.consequence('insect-land',{point:world(),speed,visits});
        if(focus)notice(`insect-return-${tick}`);return;
      }
      if(mode==='freeze'){enter('peek',30);return;}
      if(mode==='walk'){enter('groom',52+Math.floor(rng()*22));return;}
      if(mode==='groom'){enter('rest',55+Math.floor(rng()*90));return;}
      if(mode==='rest'&&quiet>580){depart('wander');quiet=0;return;}
      from=u;to=dir>0?.88:.08;dir*=-1;enter('walk',100+Math.floor(rng()*80));
    },
    frames:{insect:world},
    framing:()=>({bounds:[65,490,745,520],amount:panAmount(),open:focus,
      dismiss:{kind:'insect-dismiss'},returnControl:'insect'}),
    speech:{command({intent},tick,director){if(intent.kind==='insect-touch'&&'lastClick'in director)director.lastClick=tick;}},
    get state(){return {mode,start,duration,u,from,to,dir,visits,alarm,lastTouch,quiet,returnAt,
      flightFrom:[...flightFrom],focus,pan:{...pan},response,landed,speed,heading,position:position()};},
    mount({THREE,cutGeometry,basic,objects,own,pick}){
      const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
      const ctx=canvas.getContext('2d'),map=own(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;
      const mesh=new THREE.Mesh(cutGeometry([-64,-64,128,128],DEPTH),basic(map,{transparent:true,alphaTest:.03,depthWrite:false}));
      // Geometry centred around the projection origin, then move by the current
      // projected location. Rendering never advances this resident's clock.
      const zero=host.p.atDepth([0,0],DEPTH);mesh.geometry.translate(...zero.map(v=>-v));
      objects.add(mesh);pick(mesh,'insect');mesh.name='insect';
      return {update(){
        mesh.visible=mode!=='away';if(!mesh.visible)return;
        paintBeetle(ctx,{mode,age:age(),tick:host.tick,heading,land:host.tick-landed});map.needsUpdate=true;
        mesh.position.fromArray(world());
      },dispose(){objects.remove(mesh);}};
    },
  };
}
