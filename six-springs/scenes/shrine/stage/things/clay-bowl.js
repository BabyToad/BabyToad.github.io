import { curve, hops, hopAt } from '../keys.js';
import { solveHand } from '../../../../src/motion/reach.js';
import { HANDS } from '../../study.js';
import { smooth, mix, clamp } from '../../../../src/math.js';
import { drawCanvas } from '../../../../src/render.js';

const HOME=[997,640], DEPTH=10.8, SLOT='clay-bowl.handle';
const ARM=HANDS.R, GRIP=[-25,-17];
const lerp=(a,b,u)=>a.map((v,i)=>mix(v,b[i],u));
const arc=(a,b,via,u)=>a.map((v,i)=>(1-u)**2*v+2*(1-u)*u*via[i]+u*u*b[i]);
const bodyKeys=['gaze','yaw','pitch','head','spine','bob','uarmL','farmL','handL','uarmR','farmR','handR','browL','browR','smile','eyeOpen','fRy'];

/** A separate, interruptible drink; the offering bowl never changes owner here.
 * Coordinates of the vessel describe its foot in the original painting. The
 * hand is solved after all pose layers, and contact is measured before pickup.
 */
export function clayBowl(host){
  const p=host.p,view=host.actor.rig.views.front;
  // Keep her whole silhouette in front of the slanted wall, including the
  // reaching arm to her right. A constant-depth route would enter the wall.
  const floor=x=>p.onPlane([x,Math.max(850,p.wallY(x+150)+18)],p.floor);
  const screen=()=>p.project(cup.position);
  let cup={position:p.atDepth(HOME,DEPTH),velocity:[0,0,0],owner:'ledge',angle:0,water:0,slosh:0,sloshV:0,settled:true};
  let run=null,returning=null,goal=null,contact=null,release=null,gripHint=null,visits=0,bumps=0,lastBump=-1000;
  let embarrassed=-1000,wet=0,drops=[],wetPoints=[],basinWave=-1000,viewUntil=0,pan={start:0,from:0,to:0},lastScreen=HOME;
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start+(pan.to?1:0))/12));
  function frameCup(open){const to=open?1:0;if(pan.to!==to)pan={start:host.tick,from:panAmount(),to};}
  const event=(kind,extra={})=>host.consequence(`clay-bowl-${kind}`,{point:[...cup.position],request:run?.id??null,...extra});
  function route(start,from,to){return hops(start,from,to,Math.hypot(...p.project(from).map((v,i)=>v-p.project(to)[i])));}
  function mouth(pose){
    const path=view.evaluate(pose).paths.find(x=>x.layer.endsWith('.mouth'));
    const local=[(Math.min(...path.X)+Math.max(...path.X))/2,(Math.min(...path.Y)+Math.max(...path.Y))/2];
    return p.project(host.characterFrame.world(local));
  }
  function splash(amount,speed){
    if(amount<=0)return;
    const at=screen();wet=Math.min(1,wet+amount);
    // Fixed fan, not renderer randomness. Each droplet has actual velocity.
    for(let i=0;i<9;i++)drops.push({x:at[0]+(i-4)*2,y:at[1]-36,vx:(i-4)*(1+speed*.3),vy:-4-Math.sin(i*2.4)*1.6,life:48});
    event('spill',{amount,speed});
  }
  function fall(reason){
    if(cup.owner==='falling'||cup.owner==='floor')return;
    const held=cup.owner==='hand'||cup.owner==='loft',at=screen();
    cup.position=p.atDepth(at,7.7);cup.owner='falling';cup.settled=false;
    cup.velocity=held?cup.velocity.map(v=>clamp(v,-1.4,1.4)):[-.65,.18,0];cup.velocity[2]=0;
    // A filling mishap sends it left of the basin, without a lateral teleport.
    if(at[0]>1110)cup.velocity[0]=-1.9;
    cup.angle=-.13;embarrassed=host.tick;viewUntil=host.tick+240;
    splash(cup.water,Math.hypot(...cup.velocity));cup.water=0;
    event('drop',{reason,velocity:[...cup.velocity]});
  }
  function homeward(){
    const from=host.frame('root').position;
    returning={start:host.tick,plan:route(host.tick===embarrassed?58:5,from,host.space.home)};
  }
  function cancel(reason,{returnHome=true}={}){
    if(!run)return;
    if(cup.owner==='hand'||cup.owner==='loft')fall(reason);
    release={tick:host.tick,pose:{...host.actor.pose}};
    host.actor.cancel(SLOT,{id:run.id,fade:10});run=null;goal=null;contact=null;
    if(returnHome&&!host.action)homeward();else returning=null;
  }
  function start(intent){
    frameCup(true);viewUntil=host.tick+96;
    if(host.action||cup.owner==='falling'){event('wait',{reason:host.action?'occupied':'falling'});return false;}
    if(run){
      bumps++;lastBump=host.tick;cup.sloshV+=.09;
      // First impatient tap earns a look and wobble. The second can knock it.
      event('nudge',{bumps,water:cup.water});
      if(bumps>=2){fall('nudged');cancel('nudged');}
      return true;
    }
    returning=null;release=null;gripHint=null;visits++;bumps=0;
    const recovering=cup.owner==='floor',at=screen();
    const near=recovering?p.atDepth([at[0]-90,0],8.2):floor(880),fillAt=floor(1110);
    near[1]=0;
    // Familiar visits skip the first appraisal. After sabotage she waits for
    // eye contact before committing her hand, even when the cup is back home.
    const guarded=embarrassed>-1000, familiar=visits>=3&&!guarded;
    const go=route(guarded?30:familiar?5:12,host.frame('root').position,near),C=go.end+(familiar?16:24);
    const fill=route(C+18,near,fillAt),F=fill.end+22,filled=F+(recovering?64:41),S=filled+13;
    const ret=route(S+58,fillAt,floor(880)),H=ret.end+26;
    const back=route(H+16,floor(880),host.space.home);
    run={id:intent.id,start:host.tick,recovering,guarded,familiar,filled,plans:[go,fill,ret,back],T:go.end,C,F,S,H,end:back.end+12,origin:at,pickup:[at[0],at[1]-(recovering?135:0)],drank:false};
    const r=run,initial={...host.actor.pose};
    host.actor.drive(SLOT,{keys:bodyKeys,duration:r.end,sample(age,{pose,tick}){
      const atSip=curve(age,[[r.S-10,0],[r.S+8,1],[r.S+27,1],[r.S+42,0]]);
      const bow=curve(age,[[r.T,0],[r.C-12,r.recovering?-8:4],[r.C-10,r.recovering?18:4],[r.C-4,4],[r.C+4,4],[r.C+18,0],[r.H-15,0],[r.H,4],[r.H+12,0]]);
      const you=curve(age,[[0,0],[5,1],[r.guarded?24: r.familiar?6:11,0],[r.S+31,0],[r.S+38,1],[r.S+48,1],[r.S+58,0]]);
      const repeat=smooth((tick-lastBump)/3)*(1-smooth((tick-lastBump-9)/15));
      return {gaze:mix(.65,0,you),yaw:mix(.3,0,you),pitch:atSip*-.18+bow*.002,
        head:pose.head+curve(age,[[0,0],[7,-3],[r.T,3],[r.C,-4],[r.C+12,0]])-atSip*5,
        spine:pose.spine+bow*.045-atSip*3,bob:pose.bob+bow+curve(age,[[r.S+22,0],[r.S+25,2],[r.S+29,0]]),
        uarmL:pose.uarmL+curve(age,[[0,0],[r.C,10],[r.F,16],[r.S+10,-12],[r.S+35,-12],[r.H,6],[r.H+14,0]]),
        farmL:pose.farmL+atSip*20,handL:pose.handL-atSip*8,
        uarmR:mix(initial.uarmR,pose.uarmR,smooth(age/10)),farmR:mix(initial.farmR,pose.farmR,smooth(age/10)),handR:mix(initial.handR,pose.handR,smooth(age/10)),
        fRy:pose.fRy+(r.recovering?curve(age,[[r.T,0],[r.C-13,32],[r.C-10,0,'i']]):0),
        browL:pose.browL-3-atSip*5+repeat*8,browR:pose.browR-3-repeat*15+Math.min(visits-1,5)*you,
        smile:mix(pose.smile,.25,atSip),eyeOpen:mix(pose.eyeOpen,.65,atSip)};
    }},{id:intent.id,fade:5,release:10});
    event('notice',{visits,recovering});return true;
  }
  function cupAim(age,pose){
    const r=run,foot=p.project(host.frame('root').position);
    const carryPalm=p.project(host.characterFrame.world(view.point({...pose,uarmR:-10,farmR:-85,handR:0},'handR',ARM.palm)));
    const carry=[carryPalm[0]-GRIP[0],carryPalm[1]-GRIP[1]],fill=[1229,708];
    if(age<=r.C)return [...r.pickup];
    if(age<r.C+16)return lerp(r.pickup,carry,smooth((age-r.C)/16));
    if(age<r.F-18)return carry;
    if(age<r.F)return lerp(carry,fill,smooth((age-r.F+18)/18));
    if(age<r.S){
      // Pull clear of the spout to pour the dirty first water into the basin,
      // then deliberately return for a fresh fill.
      const rinse=r.recovering?curve(age,[[r.F+8,0],[r.F+16,1],[r.F+26,1],[r.F+32,0]]):0;
      return [fill[0]-rinse*24,fill[1]+rinse*4];
    }
    const m=age<r.S+48?mouth(pose):[0,0],sip=[m[0]+24,m[1]+39];
    if(age<r.S+18)return arc(fill,sip,[foot[0]-35,foot[1]-120],smooth((age-r.S)/18));
    if(age<r.S+29)return sip;
    if(age<r.S+48)return arc(sip,carry,[foot[0]-40,foot[1]-120],smooth((age-r.S-29)/19));
    if(age<r.H-20)return carry;
    if(age<r.H)return lerp(carry,HOME,smooth((age-r.H+20)/20));
    return HOME;
  }
  function gripAt(at,angle){const c=Math.cos(angle),s=Math.sin(angle);return [at[0]+GRIP[0]*c-GRIP[1]*s,at[1]+GRIP[0]*s+GRIP[1]*c];}
  function solveGrip(pose,position){
    // The same planar reach solver, with a cup-specific orientation search.
    // Equivalent rotations are normalized before testing *all* joint ranges.
    // Prefer a relaxed legal arm, but start near the previous solved hand
    // orientation and reject large local jumps before the full fallback.
    const candidates=[],wrap=v=>((v+180)%360+360)%360-180;
    const attempt=(bend,angle)=>{
      angle=wrap(angle);
      const s=solveHand(view,pose,{...ARM,bend},{position,angle},host.characterFrame.screen);
      for(const k of ARM.channels)s.pose[k]=wrap(s.pose[k]);
      const legal=!s.clamped&&ARM.channels.every(k=>s.pose[k]>=view.controls[k][0]&&s.pose[k]<=view.controls[k][1]);
      if(legal)candidates.push({...s,bend,angle,
        cost:ARM.channels.reduce((n,k)=>n+(s.pose[k]-pose[k])**2,0),
        change:ARM.channels.reduce((n,k)=>n+(s.pose[k]-(gripHint?.pose[k]??pose[k]))**2,0)});
    };
    if(gripHint){
      for(const delta of [0,-6,6])attempt(gripHint.bend,gripHint.angle+delta);
      candidates.sort((a,b)=>a.cost-b.cost);
      if(candidates[0]?.change<900){gripHint={bend:candidates[0].bend,angle:candidates[0].angle,pose:candidates[0].pose};return candidates[0];}
    }
    for(const bend of [ARM.bend,-ARM.bend])for(let angle=-180;angle<180;angle+=6)attempt(bend,angle);
    candidates.sort((a,b)=>(a.change>=900)-(b.change>=900)||a.cost-b.cost);
    if(candidates[0])gripHint={bend:candidates[0].bend,angle:candidates[0].angle,pose:candidates[0].pose};
    return candidates[0]??null;
  }
  function reaction(){
    const id=`clay-bowl.embarrassed.${host.tick}`,initial={...host.actor.pose};
    host.actor.drive(SLOT,{keys:bodyKeys,duration:70,sample(age,{pose}){
      const flinch=curve(age,[[0,0],[3,1],[10,.4],[20,0]]),look=curve(age,[[0,0],[12,1],[29,1],[40,0],[58,0],[70,0]]);
      return {...Object.fromEntries(bodyKeys.map(k=>[k,pose[k]])),gaze:look*clamp((screen()[0]-p.project(host.frame('root').position)[0])/130,-.8,.8),pitch:look*.55,
        head:pose.head+flinch*9-look*4,spine:pose.spine-flinch*5,
        uarmL:pose.uarmL-flinch*23,farmL:pose.farmL+flinch*38,
        uarmR:mix(initial.uarmR,pose.uarmR-10*flinch,smooth(age/20)),farmR:mix(initial.farmR,pose.farmR-25*flinch,smooth(age/24)),handR:mix(initial.handR,pose.handR,smooth(age/15)),
        browL:pose.browL-flinch*15+look*6,browR:pose.browR-flinch*20-look*12,
        smile:pose.smile-look*.45,eyeOpen:mix(pose.eyeOpen,.65,smooth((age-30)/8)*(1-smooth((age-56)/12)))};
    }},{id,fade:0,release:10});
  }
  return {id:'clay-bowl',layers:[SLOT],
    art:[{id:'clay-bowl-repair',path:'clay-bowl/repair.png',bounds:[946,583,104,67],depth:11.4,pickable:false}],
    targets:{'clay-bowl':{control:'clay-bowl',point:()=>screen(),priority:12,
      hit:(x,y)=>{const at=screen();return Math.abs(x-at[0])<44&&y>at[1]-58&&y<at[1]+10;},
      interact:()=>({kind:'clay-bowl-touch'})}},
    intents:{'clay-bowl-touch':start,'clay-bowl-dismiss'(){frameCup(false);return true;}},
    get request(){return run?.id??null;},
    interrupt(intent){if(intent.request!==run?.id)return false;cancel('interrupted');return true;},
    motion(tick){
      const r=run??returning;if(!r)return null;
      const age=tick-r.start,plans=r.plans??[r.plan];let result=null;
      for(const plan of plans){if(age>=plan.start)result={...hopAt(plan,age),dir:plan.dir};}
      if(!result){
        const position=[...plans[0].from];
        // Interruption may arrive in a hop. Waiting for the embarrassed look
        // must not freeze her in midair before the route home starts.
        position[1]=Math.max(0,position[1]-4.905*(age/24)**2);
        result={position,active:false};
      }
      return result;
    },
    constrain(pose){
      if(!run){
        if(release){const u=1-smooth((host.tick-release.tick)/12);for(const k of ARM.channels)pose[k]=mix(pose[k],release.pose[k],u);if(!u)release=null;}
        return pose;
      }
      const age=host.tick-run.start;
      if(age<run.T-3||age>run.H+10){goal=null;return pose;}
      const angle=curve(age,[[0,0],[run.F+8,0],[run.F+16,run.recovering?-1.05:0],[run.F+24,run.recovering?-1.05:0],[run.F+32,0],[run.S+15,0],[run.S+23,-.26],[run.S+29,-.26],[run.S+43,0]]);
      const aim=cupAim(age,pose),grip=gripAt(aim,angle);
      const solved=solveGrip(pose,grip);
      const weight=curve(age,[[run.T-3,0],[run.C-3,1],[run.H+1,1],[run.H+10,0]]);
      goal={aim,grip,angle,error:solved?.error??999,clamped:!solved,weight};
      if(solved)for(const key of ARM.channels)pose[key]=mix(pose[key],solved.pose[key],weight);
      return pose;
    },
    beforePose(tick,{commands}){
      const other=commands.find(({intent,accepted})=>accepted!==false&&
        (['ring','offer','water','wind','feed-frog','waterfall-touch','knock-word'].includes(intent.kind)||intent.kind==='poke'&&intent.action===run?.id||
         intent.kind==='interrupt'&&(!intent.request||intent.request===run?.id)));
      if(other){cancel(other.intent.kind,{returnHome:!host.action});if(tick!==embarrassed)frameCup(false);}
      if(host.action)returning=null;
      if(returning&&tick-returning.start>returning.plan.end+1){returning=null;if(tick>=viewUntil)frameCup(false);}
      if(run&&tick-run.start>run.end){run=null;goal=null;frameCup(false);}
      if(!run&&!returning&&tick>=viewUntil)frameCup(false);
      if(tick===embarrassed&&!host.action)reaction();
    },
    afterPhysics(tick){
      if(run){
        const age=tick-run.start;
        if(run.recovering&&age===run.C-10&&cup.owner==='floor'){
          cup.owner='loft';cup.settled=false;event('heel',{risePixels:135,durationTicks:10});
        }
        if(cup.owner==='loft'){
          const t=age-run.C+10,g=9.81*p.f/7.7/24**2,vy=-135/10-g*10/2;
          const old=cup.position,at=[run.origin[0],run.origin[1]+vy*t+g*t*t/2];
          cup.position=p.atDepth(at,7.7);cup.velocity=cup.position.map((v,i)=>(v-old[i])*24);cup.angle=mix(-1.15,0,smooth(t/10));
        }
        if(age===run.C){
          const actual=host.frame('hand.R').screen,error=Math.hypot(...actual.map((v,i)=>v-goal.grip[i]));
          contact={tick,error,clamped:goal.clamped};
          if(error<2&&!goal.clamped){cup.owner='hand';cup.settled=false;event('grip',{error,recovering:run.recovering});}
          else {event('missed',{error,clamped:goal.clamped});cancel('unreachable');}
        }
        if(run&&cup.owner==='hand'&&goal){
          // Actual solved palm carries the cup. A missed reach never teleports it.
          const palm=host.frame('hand.R').screen,offset=gripAt([0,0],goal.angle);
          const at=[palm[0]-offset[0],palm[1]-offset[1]],old=cup.position;
          // Like the offering's foreground handoff, this is an explicit planar
          // contact: a constant foreground depth keeps the cup in front of water.
          cup.position=p.atDepth(at,7.9);
          cup.velocity=cup.position.map((v,i)=>(v-old[i])*24);cup.angle=goal.angle;
          if(age>=run.F&&age<=run.filled){
            const rinsing=run.recovering&&age>=run.F+9&&age<run.F+32;
            const amount=rinsing?0:Math.min(1-cup.water,run.recovering?1/28:1/36);cup.water+=amount;
            cup.sloshV+=Math.sin(age*2)*.018;
            if(age===run.F){basinWave=tick;event('fill-start',{flow:24/(run.recovering?28:36)});}
            if(run.recovering&&age===run.F+16){basinWave=tick;run.rinseVolume=cup.water;event('rinse',{volume:cup.water,durationTicks:9});}
            if(run.recovering&&age>=run.F+16&&age<=run.F+24)cup.water=Math.max(0,cup.water-run.rinseVolume/9);
            if(run.recovering&&age===run.F+32){basinWave=tick;event('refill',{flow:24/28});}
            if(age===run.filled)event('filled',{volume:cup.water});
          }
          if(age===run.S+24){const volume=Math.min(cup.water,.64);cup.water-=volume;run.drank=true;event('sip',{volume});}
          if(age===run.H){
            const error=Math.hypot(...at.map((v,i)=>v-HOME[i]));
            if(error<2){cup.position=p.atDepth(HOME,DEPTH);cup.owner='ledge';cup.settled=true;cup.velocity=[0,0,0];cup.angle=0;event('set-down',{error,water:cup.water});}
            else {fall('missed-ledge');cancel('missed-ledge');}
          }
        }
      }
      if(cup.owner==='falling'){
        cup.velocity[1]-=9.81/24;
        for(let i=0;i<3;i++)cup.position[i]+=cup.velocity[i]/24;
        cup.angle-=.12;
        const xy=screen();if(xy[0]<710||xy[0]>1330){cup.position[0]=p.atDepth([clamp(xy[0],710,1330),xy[1]],7.7)[0];cup.velocity[0]*=-.4;}
        if(cup.position[1]<=.08){
          const speed=Math.abs(cup.velocity[1]);cup.position[1]=.08;cup.velocity[1]=speed*.23;cup.velocity[0]*=.5;
          event('land',{speed,energy:speed*speed*.5});
          if(speed<.65){cup.velocity=[0,0,0];cup.settled=true;cup.owner='floor';event('settled');}
        }
      }
      if(cup.owner==='floor')cup.angle=mix(cup.angle,-1.15,.25);
      const at=screen(),dx=at[0]-lastScreen[0];
      cup.sloshV+=(-cup.slosh*.16-dx*.002);cup.sloshV*=.86;cup.slosh=clamp(cup.slosh+cup.sloshV,-.65,.65);lastScreen=at;
      if(cup.water>0&&Math.abs(cup.slosh)>.52){const amount=Math.min(cup.water,.025);cup.water-=amount;splash(amount,Math.abs(dx)*24/100);}
      wet=Math.max(0,wet-.0007);
      for(const d of drops){d.x+=d.vx;d.y+=d.vy;d.vy+=9.81*p.f/7.7/24**2;d.life--;if(d.y>=916){d.life=0;wetPoints.push({x:d.x,y:916,born:tick});}}
      drops=drops.filter(d=>d.life>0);
      wetPoints=wetPoints.filter(d=>tick-d.born<480).slice(-36);
    },
    frames:{'clay-bowl':()=>cup.position},
    framing:()=>{const left=Math.min(450,p.project(host.frame('root').position)[0]-180);
      return {bounds:[left,210,1350-left,735],amount:panAmount(),open:pan.to===1,dismiss:{kind:'clay-bowl-dismiss'},returnControl:'clay-bowl'};},
    speech:{command({intent},tick,director){if(intent.kind==='clay-bowl-touch'){
      if('lastClick' in director)director.lastClick=tick;
      // The opening refers to her offering bowl. Let it wait until this drink
      // has ended, rather than introducing the wrong vessel at the first reach.
      if(run&&director.pending?.line==='bowl')director.pending.at=Math.max(director.pending.at,run.start+run.end+24);
    }},
      event(e,tick,director){if(e.kind==='clay-bowl-drop'){director.speaker.hush(tick);director.pending=null;}if(e.kind==='clay-bowl-fill-start'&&director.pending)director.pending.at=Math.max(director.pending.at,tick+105);}},
    get state(){return structuredClone({cup,run,returning,goal,contact,gripHint,visits,bumps,wet,drops,wetPoints,basinWave,embarrassed,pan,viewUntil});},
    async mount({THREE,texture,cutGeometry,basic,objects,pick,own}){
      const art=await texture('clay-bowl/cup.png');
      const canvas=document.createElement('canvas');canvas.width=80;canvas.height=54;
      const ctx=canvas.getContext('2d'),map=own(new THREE.CanvasTexture(canvas));
      map.colorSpace=THREE.SRGBColorSpace;map.minFilter=THREE.LinearFilter;map.generateMipmaps=false;
      const mesh=new THREE.Mesh(cutGeometry([957,591,80,54],DEPTH),basic(map,{transparent:true,depthWrite:true,alphaTest:.05}));
      mesh.renderOrder=4;
      objects.add(mesh);pick(mesh,'clay-bowl');
      const streamRepair=await texture('clay-bowl/stream-repair.png');
      streamRepair.generateMipmaps=false;streamRepair.minFilter=THREE.LinearFilter;
      const intercepted=new THREE.Mesh(cutGeometry([1187,650,72,96],7.95),basic(streamRepair,{transparent:true,depthWrite:false}));
      intercepted.name='clay-bowl.intercepted-stream';intercepted.renderOrder=3.5;intercepted.visible=false;objects.add(intercepted);
      // Only the occupied water region is drawn. An empty overlay is invisible
      // and never uploaded; even a broad spill uses one bounded 256px texture.
      const waterCanvas=document.createElement('canvas');waterCanvas.width=256;waterCanvas.height=256;
      const wc=waterCanvas.getContext('2d'),waterMap=own(new THREE.CanvasTexture(waterCanvas));waterMap.colorSpace=THREE.SRGBColorSpace;
      waterMap.generateMipmaps=false;waterMap.minFilter=THREE.LinearFilter;
      const waterMesh=new THREE.Mesh(cutGeometry([0,0,256,256],7.7),basic(waterMap,{transparent:true,depthWrite:false}));objects.add(waterMesh);
      waterMesh.name='clay-bowl.water';waterMesh.visible=false;mesh.name='clay-bowl.cup';
      const fingerCanvas=document.createElement('canvas');fingerCanvas.width=64;fingerCanvas.height=64;
      const fc=fingerCanvas.getContext('2d'),fingerMap=own(new THREE.CanvasTexture(fingerCanvas));fingerMap.colorSpace=THREE.SRGBColorSpace;
      fingerMap.generateMipmaps=false;fingerMap.minFilter=THREE.LinearFilter;
      const fingers=new THREE.Mesh(cutGeometry([0,0,64,64],DEPTH),basic(fingerMap,{transparent:true,depthWrite:false}));objects.add(fingers);
      fingers.renderOrder=5;waterMesh.renderOrder=6;
      function quad(m,bounds,depth){const pos=m.geometry.attributes.position,[x,y,w,h]=bounds;[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].forEach((v,i)=>pos.setXYZ(i,...p.atDepth(v,depth)));pos.needsUpdate=true;m.geometry.computeBoundingSphere();}
      let paintedWater=null,placedCup=null;
      return {update(){
        const waterKey=cup.water>.02?`${cup.water.toFixed(3)}:${cup.slosh.toFixed(3)}`:'empty';
        if(waterKey!==paintedWater){
        ctx.clearRect(0,0,80,54);ctx.drawImage(art.image,0,0);
        if(cup.water>.02){
          ctx.save();ctx.beginPath();ctx.ellipse(40,7,31,3.6,0,0,Math.PI*2);ctx.clip();
          ctx.fillStyle='#285a5e';ctx.fillRect(8,4+(1-cup.water)*3,65,7);
          ctx.strokeStyle='#b4d6c0';ctx.lineWidth=1;ctx.beginPath();
          for(let x=10;x<72;x++){const y=7+Math.sin(x*.13+cup.slosh*8)*.7+cup.slosh*(x-40)*.1;x===10?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
        }
        map.needsUpdate=true;paintedWater=waterKey;
        }
        const at=screen(),c=Math.cos(cup.angle),s=Math.sin(cup.angle),pos=mesh.geometry.attributes.position;
        const placement=[...cup.position,cup.angle].join(':');
        if(placement!==placedCup){
        [[-40,-49],[40,-49],[40,5],[-40,5]].forEach(([x,y],i)=>pos.setXYZ(i,...p.atDepth([at[0]+x*c-y*s,at[1]+x*s+y*c],-cup.position[2]-.02)));pos.needsUpdate=true;mesh.geometry.computeBoundingSphere();
        placedCup=placement;
        }
        const age=run?host.tick-run.start:-1,waveAge=host.tick-basinWave;
        const interception=run&&cup.owner==='hand'?curve(age,[[run.F-6,0],[run.F,1],
          ...(run.recovering?[[run.F+8,1],[run.F+13,0],[run.F+26,0],[run.F+32,1]]:[]),[run.S,1],[run.S+7,0]]):0;
        intercepted.visible=interception>0;intercepted.material.opacity=interception;
        if(intercepted.visible){
          // Crop above the vessel's rim: the original upper stream still flows
          // into the cup. The lower tail clears as she intercepts it.
          const top=clamp(at[1]-40,650,745),v=(746-top)/96;
          quad(intercepted,[1187,top,72,746-top],7.95);
          const uv=intercepted.geometry.attributes.uv;uv.setXY(0,0,v);uv.setXY(1,1,v);uv.needsUpdate=true;
        }
        const wave=waveAge>=0&&waveAge<42;
        const filling=run&&age>=run.F&&age<=run.filled&&(!run.recovering||age<run.F+9||age>=run.F+32);
        const pouring=run?.recovering&&age>=run.F+16&&age<=run.F+25;
        const drip=run&&age>run.filled&&age<run.filled+9;
        const lip=[at[0]-29*c+42*s,at[1]-29*s-42*c];
        const marks=wetPoints.map(d=>[d.x,d.y,14,5]);
        marks.push(...drops.map(d=>[d.x,d.y,8,Math.abs(d.vy)+3]));
        if(wave)marks.push([1210,740,48,9]);
        if(filling||drip)marks.push([at[0],at[1]-40,38,18]);
        if(pouring)marks.push([lip[0],(lip[1]+740)/2,18,Math.abs(740-lip[1])/2+10]);
        waterMesh.visible=marks.length>0;
        if(waterMesh.visible){
        const left=Math.floor(Math.min(...marks.map(m=>m[0]-m[2]))),top=Math.floor(Math.min(...marks.map(m=>m[1]-m[3])));
        const w=Math.max(1,Math.ceil(Math.max(...marks.map(m=>m[0]+m[2])))-left),h=Math.max(1,Math.ceil(Math.max(...marks.map(m=>m[1]+m[3])))-top);
        wc.clearRect(0,0,256,256);wc.save();wc.scale(256/w,256/h);wc.translate(-left,-top);
        for(const d of wetPoints){wc.fillStyle=`rgba(36,69,65,${wet*.1*(1-(host.tick-d.born)/480)})`;wc.beginPath();wc.ellipse(d.x,d.y,12,3,-.08,0,Math.PI*2);wc.fill();}
        wc.strokeStyle='#b3cdbb';wc.lineWidth=1.6;for(const d of drops){wc.globalAlpha=Math.min(1,d.life/8);wc.beginPath();wc.moveTo(d.x,d.y);wc.lineTo(d.x-d.vx*.5,d.y-d.vy*.6);wc.stroke();}wc.globalAlpha=1;
        if(wave){wc.strokeStyle=`rgba(188,217,205,${.6*(1-waveAge/42)})`;wc.lineWidth=1.2;wc.beginPath();wc.ellipse(1210,740,12+waveAge*.8,2+waveAge*.09,0,0,Math.PI*2);wc.stroke();}
        wc.strokeStyle='#bad9cd';wc.lineWidth=1.5;
        if(filling){
          // Short broken marks where the painted stream meets the rim; no
          // second bright line laid over the original painted spout.
          for(let i=0;i<3;i++){const t=(age+i*3)%8,x=at[0]+8+(i-1)*t*.9,y=at[1]-43-t*.6+t*t*.12;wc.beginPath();wc.moveTo(x,y);wc.lineTo(x-1,y-2);wc.stroke();}
        }
        if(pouring){
          const u=(age-run.F-16)/9;
          wc.globalAlpha=1-u*.6;wc.lineWidth=2.8-u*2;
          wc.beginPath();wc.moveTo(...lip);wc.quadraticCurveTo(lip[0]+7,lip[1]+12,lip[0]+8,740);wc.stroke();
          wc.lineWidth=1;wc.beginPath();wc.ellipse(lip[0]+8,740,4+u*13,1+u*2,0,0,Math.PI*2);wc.stroke();wc.globalAlpha=1;
        }
        if(drip){const t=age-run.filled;wc.beginPath();wc.moveTo(at[0]+30,at[1]-43+t*t*.25);wc.lineTo(at[0]+30,at[1]-41+t*t*.25);wc.stroke();}
        wc.restore();quad(waterMesh,[left,top,w,h],7.7);waterMap.needsUpdate=true;
        }
        fingers.visible=cup.owner==='hand';
        if(fingers.visible){
          const palm=host.frame('hand.R').screen;fc.clearRect(0,0,64,64);fc.save();fc.translate(32-palm[0],32-palm[1]);
          fc.beginPath();fc.ellipse(palm[0],palm[1],13,17,0,0,Math.PI*2);fc.clip();fc.transform(...host.characterFrame.screen);
          const paths=view.evaluate(host.actor.pose).paths.filter(path=>path.layer==='b:front.farmR');
          drawCanvas(fc,{paint(sink){for(const path of paths)sink({kind:'path',...path});}});fc.restore();fingerMap.needsUpdate=true;
          quad(fingers,[palm[0]-32,palm[1]-32,64,64],-cup.position[2]-.04);
        }
      },dispose(){objects.remove(mesh,waterMesh,fingers,intercepted);}};
    },
  };
}

