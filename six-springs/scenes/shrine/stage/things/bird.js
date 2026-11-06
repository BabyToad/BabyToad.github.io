import { clamp, mix, smooth } from '../../../../src/math.js';
import { curve } from '../keys.js';
import { heard } from '../acoustics.js';
import { Rig } from '../../../../src/rig.js';
import { drawCanvas } from '../../../../src/render.js';

const PERCHES=[[605,174],[690,149],[774,124]], DEPTH=11.6;
// The sparrow is a Dalang rig like the saint: pose numbers in, inked cutout out.
// Its 400 px stage maps onto SIZE painting pixels; feet sit at FEET of its width/height.
const SIZE=80, CANVAS=400, FEET=[180/400,330/400], FLAP=.95;
const REST={pitch:0,head:0,headX:0,headY:0,eye:1,beak:0,spread:0,wingN:0,wingF:0,tail:0,tuck:0};
// Deterministic texture for idle life: a pure function of the tick, so sampling
// for a frame never draws from the resident's random stream.
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
// Birds look in saccades: hold a head angle, then snap to the next within two ticks.
function saccade(t,lo,hi,period=17){
  const k=Math.floor(t/period),at=i=>lo+(hi-lo)*hash(i);
  return mix(at(k-1),at(k),smooth((t-k*period)/2));
}
/** Continuous flapping on the spread drawings; glide holds them level, brake cups them up. */
function flight(a,{glide=0,brake=0}={}){
  const s=Math.sin(a*FLAP),f=Math.sin(a*FLAP-.5);
  return {spread:1,tuck:1-brake,
    wingN:mix(mix(mix(-100,20,(s+1)/2),-38,glide),32,brake),
    wingF:mix(mix(mix(-92,14,(f+1)/2),-32,glide),26,brake),
    pitch:mix(mix(22,14,glide),-14,brake),tail:mix(-4*s,-22,brake)};
}
const SLOT='bird.notice';
// Decibels where she stands on the roof: above SKITTISH she leaves, above CURIOUS she
// turns toward it. Calibrated so the bell, a dropped bowl and a stamp still clear the roof.
const SKITTISH=62,CURIOUS=30;
/** A roof neighbour. Random decisions happen only on the scene clock. */
export function bird(host){
  const rng=host.random('bird');
  let perch=1,run=null,mode='watch',until=95,visits=0,pressure=0,lastTouch=-1000,lastNoise=-1000;
  let facing=1,lookAt=0,returnAt=0,departures=0,notice=null;
  let pan={from:0,to:0,start:0},focusUntil=0;
  let previousPoint=host.p.atDepth(PERCHES[perch],DEPTH);
  const age=()=>run?host.tick-run.start:0;
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start)/12));
  function focus(open){pan={from:panAmount(),to:open?1:0,start:host.tick};if(open)focusUntil=host.tick+240;}
  function position(a=age()){
    const base=PERCHES[perch];if(!run)return [...base];
    if(run.kind==='hop'){
      const u=clamp((a-5)/10,0,1);return [mix(run.from[0],run.to[0],u),mix(run.from[1],run.to[1],u)-Math.sin(Math.PI*u)*18];
    }
    if(run.kind==='leave'){
      if(run.airborne){
        // Redirect in flight with the incoming tangent; never plant/crouch in air.
        const u=clamp(a/38,0,1),u2=u*u,u3=u2*u;
        return run.from.map((v,i)=>v+(u3-2*u2+u)*run.velocity[i]*38+
          (-2*u3+3*u2)*(i===0?run.direction*660:-185)+(u3-u2)*(i===0?run.direction*660:-90));
      }
      const u=clamp((a-5)/38,0,1);return [run.from[0]+run.direction*660*u,run.from[1]-90*u-95*Math.sin(Math.PI*u/2)];
    }
    if(run.kind==='return'){
      const u=smooth(a/42);return [mix(run.from[0],base[0],u),mix(run.from[1],base[1],u)-30*Math.sin(Math.PI*u)];
    }
    return [...base];
  }
  function pose(){
    const a=age(),t=host.tick,q={...REST};
    if(run?.kind==='leave'){
      if(run.airborne)Object.assign(q,flight(a+(run.phase??0)));
      else if(a<5){const c=smooth(a/5);q.pitch=16*c;q.tail=-10*c;q.head=6*c;}
      else Object.assign(q,flight(a-5));
    }else if(run?.kind==='return'){
      const u=a/42;
      Object.assign(q,flight(a,{glide:clamp((u-.3)/.15,0,1)*clamp((.72-u)/.1,0,1),brake:clamp((u-.78)/.18,0,1)}));
    }else if(run?.kind==='hop'){
      if(a<5){const c=smooth(a/5);q.pitch=12*c;q.tail=-6*c;}
      else if(a<15){const u=(a-5)/10;q.spread=1;q.wingN=mix(20,-75,u);q.wingF=q.wingN+8;q.pitch=mix(12,-6,u);q.tail=-10;}
      else{const b=a-15;q.pitch=-8*Math.exp(-b/3)*Math.cos(b*.9);q.tail=-18*Math.exp(-b/4)*Math.cos(b*1.1);}
    }else if(mode==='preen'){
      q.head=36+4*Math.sin(t/7);q.eye=0;q.beak=Math.floor(t/5)%2;q.pitch=6;q.wingN=-7;
    }else if(mode==='peek'){q.head=saccade(t,10,26);}
    else{
      q.head=saccade(t,-14,8);
      if(hash(Math.floor(t/9)+.5)<.09&&t%9<3)q.eye=0; // blink
      q.tail=-9*Math.max(0,Math.sin((t-lookAt)/5))*Math.exp(-Math.max(0,t-lookAt)/12);
    }
    // Head stabilisation: the world head angle is pitch + head, so a pitching
    // body leaves the gaze where it was, as on a real bird.
    if(mode!=='preen')q.head-=q.pitch;
    if(run?.kind==='leave'&&run.airborne&&a<4){
      // Numbers blend; drawing substitutions (spread, tuck, eye, beak) switch after the first tick.
      const u=smooth(a/4),from=run.initial.pose;
      if(a===0)return {...from};
      for(const k of Object.keys(q))if(k!=='spread'&&k!=='tuck'&&k!=='eye'&&k!=='beak')q[k]=mix(from[k],q[k],u);
    }
    return q;
  }
  function sample(){
    const a=age(),redirect=run?.kind==='leave'&&run.airborne,flight=run&&(run.kind==='return'||run.kind==='leave'&&(run.airborne||a>=5));
    const squash=redirect?mix(run.initial.squash,1,smooth(a/4)):run?.kind==='hop'?curve(a,[[0,1],[4,.78],[6,1.08],[14,1],[16,.82],[21,1]]):run?.kind==='leave'?curve(a,[[0,1],[4,.74],[6,1.1],[12,1]]):1;
    const breath=redirect?mix(run.initial.breath,1,smooth(a/4)):flight?1:1+Math.sin(host.tick/17)*.008;
    return {point:position(),visible:mode!=='away',pose:pose(),facing,squash,pivot:facing===1?FEET[0]:1-FEET[0],breath,
      angle:!run&&mode==='watch'?Math.sin((host.tick-lookAt)/23)*.025:0,flight:!!flight};
  }
  const world=()=>host.p.atDepth(position(),DEPTH);
  function release(){if(notice){host.actor.cancel(SLOT,{id:notice,fade:8});notice=null;}}
  function answer(){
    if(host.action||notice)return;
    notice=`bird:${host.tick}`;
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','browL'],duration:54,sample(a,{pose}){
      const w=curve(a,[[0,0],[9,1],[26,1],[38,.7],[54,0]]);
      return {gaze:mix(pose.gaze,-.25,w),yaw:mix(pose.yaw,-.12,w),pitch:mix(pose.pitch,-.65,w),head:pose.head-3*w,browL:pose.browL-4*w};
    }},{id:notice,fade:4,release:8});
  }
  function leave(reason){
    if(mode==='away'||run?.kind==='leave')return;
    const a=age(),initial=sample(),from=position(),airborne=run?.kind==='return'&&a<42||run?.kind==='hop'&&a>5&&a<15;
    const velocity=from.map((v,i)=>v-position(Math.max(0,a-1))[i]);
    const direction=airborne?-facing:departures%2===0?-1:1;
    run={kind:'leave',start:host.tick,from,direction,reason,airborne:!!airborne,
      ...(airborne?{velocity,initial,phase:run.kind==='return'?a:0}:{})};mode='flight';facing=-direction;departures++;
    release();
  }
  function hop(){
    const target=perch===0?1:perch===2?1:(rng()<.5?0:2);
    run={kind:'hop',start:host.tick,from:position(),to:PERCHES[target],target};facing=target<perch?1:-1;mode='watch';
  }
  return {id:'bird',layers:[SLOT],
    targets:{bird:{control:'bird',priority:12,point:()=>position(),
      hit:(x,y)=>mode!=='away'&&Math.abs(x-position()[0])<35&&Math.abs(y-position()[1]+28)<34,
      interact:()=>({kind:'bird-watch'})}},
    intents:{'bird-watch'(){
      host.consequence('scenic-focus',{resident:'bird'});focus(true);visits++;
      pressure=clamp(pressure+(host.tick-lastTouch<65?1:0),0,5);lastTouch=host.tick;
      if(mode==='away'){host.consequence('bird-wait',{point:host.p.atDepth(PERCHES[perch],DEPTH)});return true;}
      if(run)return true; // Watching accepts scenic focus without restarting the animal.
      if(pressure>=3){leave('crowded');return true;}
      mode='peek';until=host.tick+48;lookAt=host.tick;answer();
      host.consequence('bird-noticed',{point:world(),visits});return true;
    },'bird-dismiss'(){focus(false);release();return true;}},
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','interrupt','notice','water','wind','feed-frog','knock-word'].includes(intent.kind)||intent.kind==='poke'))){release();focus(false);}
      if(notice&&!host.actor.layers.has(SLOT))notice=null;
    },
    onEvent(event){
      if(event.kind==='scenic-focus'&&event.resident!=='bird'){release();pan={from:0,to:0,start:host.tick};}
      // She hears loudness, not names; her own wings and feet are not news to her.
      const loud=event.kind.startsWith('bird-')?-Infinity:heard(event,world());
      if(loud>=SKITTISH&&host.tick-lastNoise>24){lastNoise=host.tick;leave(event.kind);}
      else if(loud>=CURIOUS&&!run&&mode!=='away'){
        const source=event.point??event.position;
        if(source)facing=source[0]<world()[0]?1:-1;
        mode='peek';until=host.tick+28;lookAt=host.tick;
      }
      // A producer can later expose real rice availability without this bird claiming grains.
      if(['sack-rice-taken','sack-rice-spilled'].includes(event.kind)&&!run&&mode!=='away'){
        mode='peek';until=host.tick+50;host.consequence('bird-rice-interest',{point:world(),source:event.kind,receipt:event.receipt});
      }
    },
    afterPhysics(tick){
      const currentPoint=world(),speed=Math.hypot(...currentPoint.map((v,i)=>v-previousPoint[i]))*24;
      previousPoint=currentPoint;
      pressure=Math.max(0,pressure-.008);
      if(focusUntil&&tick>=focusUntil&&pan.to)focus(false);
      if(run){const a=age();
        if(run.kind==='hop'&&a===6)host.consequence('bird-hop',{point:world(),speed});
        if(run.kind==='hop'&&a===15)host.consequence('bird-land',{point:world(),speed});
        if(run.kind==='hop'&&a>=21){perch=run.target;run=null;until=tick+70+Math.floor(rng()*100);}
        else if(run?.kind==='leave'&&a===(run.airborne?1:6))host.emit('bird-depart',world(),{reason:run.reason,speed});
        else if(run?.kind==='leave'&&a>=(run.airborne?38:43)){run=null;mode='away';returnAt=tick+180+Math.floor(rng()*150);}
        else if(run?.kind==='return'&&a>=42){run=null;mode='watch';until=tick+75;host.consequence('bird-return',{point:world(),speed});}
        return;
      }
      if(mode==='away'){
        if(tick>=returnAt&&tick-lastNoise>130){
          perch=(perch+1)%3;const base=PERCHES[perch],side=departures%2===1?1:-1;
          run={kind:'return',start:tick,from:[base[0]+side*600,base[1]-190]};facing=side;mode='flight';
        }return;
      }
      if(tick>=until){
        const choice=rng();
        if(choice<.3)hop();
        else{mode=choice<.62?'preen':choice<.82?'peek':'watch';lookAt=tick;until=tick+48+Math.floor(rng()*110);}
      }
    },
    frames:{bird:world},
    framing:()=>({bounds:[420,30,450,820],amount:panAmount(),open:pan.to===1,dismiss:{kind:'bird-dismiss'},returnControl:'bird'}),
    speech:{command({intent},tick,director){if(intent.kind==='bird-watch'&&'lastClick' in director)director.lastClick=tick;}},
    get state(){return {mode,perch,run:run&&structuredClone(run),visits,pressure,lastTouch,lastNoise,returnAt,departures,notice,pan:{...pan},...sample()};},
    async mount({THREE,geometry,basic,objects,pick,own}){
      const rig=new Rig(await (await fetch(new URL('../../../../characters/sparrow/baked.json',import.meta.url))).json());
      const view=rig.views.default,canvas=document.createElement('canvas');canvas.width=canvas.height=CANVAS;
      const ctx=canvas.getContext('2d'),map=own(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;
      const g=geometry(Array(4).fill([0,0,0]),[0,1,1,1,1,0,0,0],[0,1,2,0,2,3]);
      const mesh=new THREE.Mesh(g,basic(map,{alphaTest:.3,transparent:true}));mesh.name='bird';mesh.castShadow=true;
      mesh.customDepthMaterial=own(new THREE.MeshDepthMaterial({map,alphaTest:.3,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide}));
      objects.add(mesh);pick(mesh,'bird');
      let drawn='';
      return {update(){
        const q=sample();mesh.visible=q.visible;if(!q.visible)return;
        // Redraw the vector cutout only when its pose numbers change.
        const key=Object.values(q.pose).map(v=>v.toFixed(2)).join();
        if(key!==drawn){ctx.clearRect(0,0,CANVAS,CANVAS);drawCanvas(ctx,view,rig.neutral(q.pose));map.needsUpdate=true;drawn=key;}
        const [x,y]=q.point,w=SIZE,h=SIZE*q.squash*q.breath,pivot=q.pivot;
        const pts=[[-w*pivot,-h*FEET[1]],[w*(1-pivot),-h*FEET[1]],[w*(1-pivot),h*(1-FEET[1])],[-w*pivot,h*(1-FEET[1])]]
          .map(([a,b])=>[x+a*Math.cos(q.angle)-b*Math.sin(q.angle),y+a*Math.sin(q.angle)+b*Math.cos(q.angle)]);
        pts.forEach((v,i)=>g.attributes.position.setXYZ(i,...host.p.atDepth(v,DEPTH)));
        g.attributes.position.needsUpdate=true;g.computeBoundingSphere();
        const [left,right]=q.facing===1?[0,1]:[1,0];
        [[left,1],[right,1],[right,0],[left,0]].forEach((v,i)=>g.attributes.uv.setXY(i,...v));g.attributes.uv.needsUpdate=true;
      },dispose(){objects.remove(mesh);}};
    },
  };
}
