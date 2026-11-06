import {curve} from '../keys.js';
import {smooth,mix} from '../../../../src/math.js';

// A visitor can always turn it again. The three worn stops retain their position.
// Angles, light and responses belong to the fixed scene clock, never the renderer.
const STOPS=[0,.98,-.66], SLOT='wall-symbol.notice', CENTER=[1351,345];
export function wallSymbol(host){
  // A reference-camera card must clear the nearest edge of this oblique wall,
  // not only its centre; otherwise the wall slices off half the painted oval.
  const depth=Math.min(...[1100,1440].map(x=>-host.p.onPlane([x,345],host.p.wall)[2]))-.12;
  const origin=host.p.atDepth(CENTER,depth);
  let angle=0,velocity=0,detent=0,turns=0,lastTouch=-1000;
  let response=null,settled=true,seated=true,held=0,found=false,catching=false;
  let discoveries=0,focus=false;
  let pan={from:0,to:0,start:0};
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start)/12));
  function frame(open){const to=open?1:0;if(to!==pan.to)pan={from:panAmount(),to,start:host.tick};}
  const light=()=>Math.exp(-(((angle+.66)/.23)**2));
  function leave(){if(response)host.actor.cancel(SLOT,{id:response.id,fade:8});response=null;}
  function acknowledge(kind,id){
    if(host.action||host.bowl.held||!focus)return;
    const duration=kind==='impatient'?44:100;
    response={id,start:host.tick,kind,duration};
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','spine','browL','browR','uarmR','farmR','handR'],duration,
      sample(age,{pose}){
        const impatient=kind==='impatient',familiar=kind==='familiar';
        const owned=curve(age,impatient?[[0,0],[5,1],[30,1],[44,0]]:[[0,0],[7,1],[84,1],[100,0]]);
        // First discovery: track the patch, lift a hand, share the discovery.
        // Familiar return: meet the visitor first, then offer the same gesture.
        const look=curve(age,impatient?[[0,.8],[8,0],[24,0],[36,.8],[44,.8]]:
          familiar?[[0,0],[16,0],[30,1],[58,1],[72,0],[100,0]]:
          [[0,1],[32,1],[48,0],[70,0],[85,.5],[100,0]]);
        const palm=impatient?0:curve(age,[[0,0],[8,0],[24,1],[48,1],[68,.35],[88,0],[100,0]]);
        const nod=curve(age,impatient?[[0,0],[8,-3],[18,2],[32,0]]:[[0,0],[14,4],[28,6],[46,3],[62,-2],[82,0]]);
        return {gaze:mix(pose.gaze,.92*look,owned),yaw:mix(pose.yaw,.63*look,owned),
          pitch:mix(pose.pitch,-.12*look,owned),head:pose.head+nod,spine:pose.spine+nod*.35,
          browL:pose.browL-(impatient?0:5*owned),browR:pose.browR-(impatient?8:3)*owned,
          uarmR:pose.uarmR-28*palm,farmR:pose.farmR-55*palm,handR:pose.handR-16*palm};
      }},{id,fade:5,release:8});
  }
  function notice(intent){
    if(host.action||host.bowl.held||response?.kind==='notice'&&host.tick-response.start<18)return;
    const familiar=Math.min(1,(turns-1)/8);
    response={id:intent.id,start:host.tick,kind:'notice',duration:132};
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','spine','browL','browR','farmL','uarmL'],duration:132,
      sample(age,{pose}){
        const own=curve(age,[[0,0],[8,1],[112,1],[132,0]]);
        const look=curve(age,[[0,0],[9,1],[48,1],[66,0],[82,0],[96,.65],[112,.65],[132,0]]);
        const catchLight=light(),body=curve(age,[[0,0],[6,-2],[17,4],[40,4],[67,-1],[88,0],[132,0]]);
        return {gaze:mix(pose.gaze,.94*look,own),yaw:mix(pose.yaw,.7*look,own),
          pitch:mix(pose.pitch,(-.34+catchLight*.18)*look,own),
          head:pose.head+body*(1-familiar*.35),spine:pose.spine+body*.6,
          browL:pose.browL-look*(3+catchLight*4),browR:pose.browR-look*(2+familiar*3),
          uarmL:pose.uarmL+look*catchLight*5,
          farmL:pose.farmL-look*(5+catchLight*12)};
      }},{id:intent.id,fade:3,release:8});
  }
  return {id:'wall-symbol',layers:[SLOT],
    targets:{'wall-symbol':{control:'wall-symbol',point:()=>CENTER,
      hit:(x,y)=>((x-1351)/72)**2+((y-345)/78)**2<1,
      interact:()=>({kind:'wall-symbol-turn'})}},
    intents:{'wall-symbol-turn'(intent){
      host.consequence('scenic-focus',{resident:'wall-symbol'});focus=true;
      const impatient=host.tick-lastTouch<24;
      turns++;lastTouch=host.tick;detent=(detent+1)%STOPS.length;
      settled=false;seated=false;held=0;found=false;frame(true);
      if(impatient){
        if(response?.kind!=='impatient'||host.tick-response.start>=24)acknowledge('impatient',intent.id);
      }else notice(intent);
      host.consequence('wall-symbol-touch',{point:origin,turns,detent});return true;
    },'wall-symbol-dismiss'(){focus=false;frame(false);leave();return true;}},
    onEvent(event){if(event.kind==='scenic-focus'&&event.resident!=='wall-symbol'){
      focus=false;leave();pan={from:0,to:0,start:host.tick};
    }},
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&
        !intent.kind.startsWith('wall-symbol-')&&
        (['ring','offer','interrupt','notice','water','wind','feed-frog','knock-word','poke'].includes(intent.kind)))){
        focus=false;leave();frame(false);
      }
      if(response&&tick-response.start>=response.duration)response=null;
      if(tick-lastTouch>208){focus=false;frame(false);}
    },
    afterPhysics(){
      const oldVelocity=velocity,oldAngle=angle;
      velocity+=(STOPS[detent]-angle)*.095-velocity*.24;
      angle+=velocity;
      if(!seated&&(oldAngle-STOPS[detent])*(angle-STOPS[detent])<=0){
        seated=true;host.consequence('wall-symbol-seat',{point:origin,detent,speed:Math.abs(velocity)*24,turns});
      }
      if(!settled&&Math.abs(velocity)<.0015&&Math.abs(angle-STOPS[detent])<.004){
        angle=STOPS[detent];velocity=0;settled=true;
        host.consequence('wall-symbol-stop',{point:origin,detent,speed:Math.abs(oldVelocity)*24,turns});
      }
      const now=light()>.82;
      if(now&&!catching)host.consequence('wall-symbol-light',{point:origin,speed:Math.abs(velocity)*24,strength:light(),turns});
      catching=now;
      held=now&&Math.abs(velocity)<.006?held+1:0;
      if(held===28&&!found){
        found=true;if(focus)discoveries++;
        acknowledge(discoveries>=3?'familiar':'discovery',`wall-symbol-held-${turns}`);
        host.consequence('wall-symbol-held',{point:origin,turns,strength:light(),discoveries});
      }
    },
    frames:{'wall-symbol':()=>[...origin]},
    framing:()=>({bounds:[480,255,955,605],amount:panAmount(),open:pan.to===1,
      dismiss:{kind:'wall-symbol-dismiss'},returnControl:'wall-symbol'}),
    speech:{command({intent},tick,director){if(intent.kind==='wall-symbol-turn'&&'lastClick' in director)director.lastClick=tick;}},
    get state(){return {angle,velocity,detent,turns,lastTouch,settled,seated,held,found,catching,discoveries,focus,
      light:light(),response:response&&{...response},pan:{...pan}};},
    async mount({THREE,texture,cutGeometry,basic,objects,pick}){
      const faceMap=await texture('wall-symbol/face.png');
      const face=new THREE.Mesh(cutGeometry([1303,287,98,114],depth),basic(faceMap,{transparent:true,alphaTest:.12,forceSinglePass:true}));
      face.geometry.translate(...origin.map(v=>-v));face.position.fromArray(origin);
      face.name='wall-symbol.mirror';objects.add(face);pick(face,'wall-symbol');
      const glowMap=await texture('wall-symbol/light.png');
      const glow=new THREE.Mesh(cutGeometry([1190,387,100,69],depth-.02),basic(glowMap,{transparent:true,depthWrite:false,forceSinglePass:true,blending:THREE.AdditiveBlending}));
      glow.name='wall-symbol.reflection';objects.add(glow);
      return {update(){
        // Projected hinge tilt keeps the two painted side pins fixed. A slight
        // shear follows the slant of the original oval; no simulation is advanced.
        face.scale.y=Math.cos(angle);face.rotation.z=Math.sin(angle)*.035;
        const brightness=.47+.53*light();face.material.color.setRGB(brightness,brightness,brightness);
        // Waiting at the bright stop lets the broken patch resolve. A fast pass
        // makes a brief streak; it never starts a timer outside the scene clock.
        glow.material.opacity=light()*(.20+.23*smooth(held/28));
        glow.visible=glow.material.opacity>.002;
        glow.position.set((angle+.66)*-90*depth/host.p.f,(angle+.66)*-100*depth/host.p.f,0);
      },dispose(){objects.remove(face,glow);}};
    },
  };
}
