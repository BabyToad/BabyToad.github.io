import { Scene, TICK_RATE } from "../../src/scene.js";
import { Actor, random } from "../../src/actor.js";
import { Rig } from "../../src/rig.js";
import { Secondary } from "../../src/motion/secondary.js";
import { Follow } from "../../src/motion/follow.js";
import { solveHand } from "../../src/motion/reach.js";
import { sampleClip } from "../../src/motion/clip.js";
import { transform, apply, inverse, IDENTITY, mix, smooth, clamp } from "../../src/math.js";
import { placeholders } from "./placeholders.js";
import { flats, addFlats, driftFlats } from "./flats.js";

const envelope=(duration,tracks,markers=[])=>({format:1,tickRate:TICK_RATE,duration,tracks,markers});
const matrixMix=(a,b,u)=>a.map((v,i)=>mix(v,b[i],u));
const pointMix=(a,b,u)=>a.map((v,i)=>mix(v,b[i],u));
export const OFFERING_HOME=transform(568,457,0,.72);
export const HANDS={
  L:{upper:"uarmL",lower:"farmL",hand:"handL",wrist:"b.wrL",palm:"b.palmL",bend:-1,channels:["uarmL","farmL","handL"]},
  R:{upper:"uarmR",lower:"farmR",hand:"handR",wrist:"b.wrR",palm:"b.palmR",bend:1,channels:["uarmR","farmR","handR"]},
};
export const MINUTE=[
  {tick:12,intent:{id:"visitor",kind:"visitor"}},
  {tick:96,intent:{id:"bell-1",kind:"select",target:"bell"}},
  {tick:180,intent:{id:"offer-1",kind:"offer"}},
  {tick:200,intent:{id:"interrupt-before",kind:"interrupt"}},
  {tick:264,intent:{id:"offer-2",kind:"offer"}},
  {tick:312,intent:{id:"interrupt-held",kind:"interrupt"}},
  {tick:408,intent:{id:"offer-3",kind:"offer"}},
  {tick:540,intent:{id:"visitor-again",kind:"visitor"}},
];

/** Provisional shrine policy: gaze precedes reach; contact owns effects; interrupted offerings
 * return gently to the stand. Geometry, attention calibration and performance timing are authored here.
 */
export function createShrine(baked,{seed=7,depth=false}={}) {
  const scene=new Scene(), assets=placeholders(), rig=new Rig(baked), rng=random(seed);
  if(depth) addFlats(scene); else scene.add("room",assets.room,{order:-10,interactive:false});
  scene.add("tray",assets.tray,{transform:transform(568,485),order:1,interactive:false});
  const offering=scene.add("offering",assets.offering,{transform:OFFERING_HOME,order:4});
  offering.paintBefore={node:"saint",layer:"b:front.farmL"};
  const bell=scene.add("bell",assets.bell,{transform:transform(862,355),order:2});
  const bellMotion=new Secondary(TICK_RATE);
  const visitor=[693,300], calibration={center:[360,470],span:[420,600]};
  let attention={target:null,point:visitor,until:0}, nextBlink=55, blink=-1, bellKick=0, action=null, returning=null, lastReach=null;
  const yaw=new Follow(2.8,.9), pitch=new Follow(2.5,.9);
  const cameraX=new Follow(1.5,1),cameraY=new Follow(1.5,1); let cameraTarget=[0,0];
  const actorTransform=transform(470,-40,0,.62);
  const actor=new Actor(rig,{constrain(pose){
    if(!action || !lastReach) return pose;
    // Wrist overlap is secondary motion in this rig. Contact goals must win after those springs.
    const solved=solveHand(rig.views[actor.view],pose,HANDS[action.side],lastReach,figure.transform);
    lastReach={...lastReach,error:solved.error,clamped:solved.clamped,actual:solved.actual};
    return solved.pose;
  },base(tick){
    if(attention.target && tick>=attention.until && !action) attend(null,visitor,"attention-expired");
    let world=attention.point;
    if(attention.target) { const anchor=nodeFrame(attention.target).anchor(attention.target==="bell" ? "attention" : "origin"); world=anchor.slice(4); }
    const local=apply(inverse(figure.transform),world);
    const y=yaw.step(clamp((local[0]-calibration.center[0])/calibration.span[0],-.85,.85));
    const p=pitch.step(clamp((local[1]-calibration.center[1])/calibration.span[1],-.6,.6));
    if(tick>=nextBlink && blink<0) { blink=0; nextBlink=tick+72+Math.floor(rng()*72); }
    const eyeOpen=blink<0 ? 1 : [.5,0,0,.5][blink++]; if(blink>3) blink=-1;
    // Slow listening adjustments; no uniform whole-body float. Feet stay on the floor.
    const breath=Math.sin(tick*2*Math.PI/120), shift=Math.sin(tick*2*Math.PI/312);
    return {yaw:y,pitch:p,gaze:clamp((local[0]-calibration.center[0])/600,-1,1),
      head:y*3+1.6*shift,spine:1.15*shift,pelvis:0,uarmR:.8*breath,
      farmR:1.8*breath,ponyBase:.7*Math.sin(tick*2*Math.PI/170),smile:-.18,eyeOpen};
  }});
  const figure=scene.add("saint",rig,{view:actor.view,pose:actor.pose,transform:actorTransform,order:3});
  const appraisal=envelope(60,{browL:[[0,0],[12,5],[50,0]],browR:[[0,0],[12,-8],[50,0]],smile:[[0,-.18],[12,-.5],[60,-.18]]});
  function nodeFrame(id) {
    const n=scene.node(id);
    if(n.attachment) return scene.evaluate().frames.get(id);
    return n.rig.views[n.view].evaluate(n.pose,n.transform);
  }
  function attend(target,point,id,hold=72) {
    attention={target,point:point || visitor,until:scene.tick+hold}; scene.record("attention",{request:id,target:target || "visitor"});
  }
  function startReturn(reason) {
    scene.detach("offering"); returning={from:[...offering.transform],start:scene.tick};
    scene.record("offering-return",{reason});
  }
  function begin(kind,id) {
    if(action || returning) { scene.record("rejected",{id,reason:"interaction busy"}); return; }
    const side=kind==="offer" ? "L" : "R", chain=HANDS[side], start=nodeFrame("saint").anchor(`hand.${side}`);
    const startAngle=Math.atan2(start[1],start[0])*180/Math.PI, pickup=nodeFrame("offering").anchor("origin").slice(4);
    const bellContact=nodeFrame("bell").anchor("touch").slice(4);
    const duration=kind==="offer" ? 106 : 70, angle=kind==="offer" ? 80 : -70;
    const body=envelope(duration,{spine:[[0,actor.primary.spine],[8,kind==="offer"?1:-1],[28,kind==="offer"?-2.5:3],[duration-12,0],[duration,0]],
      browR:[[0,actor.primary.browR],[20,-6],[duration,0]],smile:[[0,-.18],[58,kind==="offer"?.35:-.18],[duration,-.18]]});
    const keys=[...Object.keys(body.tracks),...chain.channels];
    action={id,kind,side,contact:false}; lastReach=null; actor.cancel("expression");
    actor.drive("action",{keys,duration,markers:[{tick:36,name:"contact"},...(kind==="offer"?[{tick:88,name:"put-down"}]:[])],
      sample(age,{pose}) {
        const patch=sampleClip(body,age), q={...pose,...patch};
        let target=kind==="offer" ? pickup : bellContact;
        if(kind==="offer" && age>36) {
          const lift=smooth((age-36)/22)*(1-smooth((age-68)/20));
          target=pointMix(pickup,[568,430],lift);
        }
        const arrival=smooth((age-8)/28), withdraw=smooth((age-(kind==="offer"?88:42))/(kind==="offer"?18:28));
        const amount=arrival*(1-withdraw);
        const rest=apply(figure.transform,rig.views[actor.view].point(q,chain.hand,chain.palm));
        const end=withdraw ? rest : start.slice(4);
        const position=pointMix(end,target,amount);
        position[0]+=(side==="L"?-10:10)*Math.sin(Math.PI*arrival)*(1-withdraw);
        position[1]-=12*Math.sin(Math.PI*arrival)*(1-withdraw);
        const solved=solveHand(rig.views[actor.view],q,chain,{position,angle:mix(startAngle,angle,amount)},figure.transform);
        lastReach={error:solved.error,clamped:solved.clamped,position,angle:mix(startAngle,angle,amount),actual:solved.actual};
        for(const key of chain.channels) patch[key]=solved.pose[key];
        return patch;
      }},{id,fade:0,release:8});
    attend(kind==="offer"?"offering":"bell",null,id,duration+48); scene.record("interaction-start",{id,interaction:kind});
  }
  function handle(intent) {
    const {kind,id}=intent;
    if(kind==="camera") {
      if(![intent.x,intent.y].every(Number.isFinite)) {scene.record("rejected",{id,reason:"invalid camera"});return;}
      cameraTarget=[clamp(intent.x,-30,30),clamp(intent.y,-12,12)];
    } else if(kind==="visitor") { attend(null,visitor,id); actor.play("expression",appraisal,{id}); }
    else if(kind==="select") {
      if(intent.target==="offering") begin("offer",id);
      else if(intent.target==="bell") begin("bell",id);
      else if(intent.target==="saint") handle({...intent,kind:"visitor"});
      else scene.record("rejected",{id,reason:"unknown target"});
    } else if(kind==="offer") begin("offer",id);
    else if(kind==="interrupt") {
      if(intent.request && intent.request!==action?.id) { scene.record("rejected",{id,reason:"stale cancellation"}); return; }
      actor.cancel("action",{id:action?.id,fade:12});
      if(action?.kind==="offer") startReturn("interrupted");
      action=null; attend(null,visitor,id);
    } else scene.record("rejected",{id,reason:"unknown intent"});
  }
  function step() {
    scene.step((tick,intents)=>{
      for(const intent of intents) handle(intent);
      if(depth) {
        scene.camera={x:cameraX.step(cameraTarget[0]),y:cameraY.step(cameraTarget[1])};
        driftFlats(scene,tick);
      }
      bell.pose=bellMotion.step(assets.bell.views.default,assets.bell.neutral({drive:bellKick>0 ? -26 : 0}));
      if(bellKick>0) bellKick--;
      const events=actor.step(tick); figure.pose=actor.pose; figure.view=actor.view;
      for(const event of events) {
        scene.record(event.kind,event);
        if(event.id!==action?.id) continue;
        if(event.kind==="marker" && event.name==="contact") {
          const target=nodeFrame(action.kind==="offer"?"offering":"bell").anchor(action.kind==="offer"?"origin":"touch").slice(4);
          const palm=nodeFrame("saint").anchor(`hand.${action.side}`).slice(4), error=Math.hypot(...palm.map((v,i)=>v-target[i]));
          if(error>.5 || lastReach?.clamped) { scene.record("contact-missed",{id:action.id,error}); actor.cancel("action",{fade:12}); action=null; attend(null,visitor,"unreachable"); continue; }
          scene.record("contact",{id:action.id,interaction:action.kind,error});
          if(action.kind==="offer") scene.attach("offering","saint","hand.L",{offset:IDENTITY,inherit:"position"});
          else { bellKick=3; scene.record("bell-impulse",{id:action.id}); }
          action.contact=true;
        }
        if(event.kind==="marker" && event.name==="put-down") { scene.detach("offering"); scene.record("offering-home"); attend(null,visitor,event.id); }
        if(event.kind==="completed") { action=null; attend(null,visitor,event.id); }
      }
      if(returning) {
        const u=smooth((tick-returning.start)/24); offering.transform=matrixMix(returning.from,OFFERING_HOME,u);
        if(u===1) { returning=null; scene.record("offering-home"); }
      }
    });
  }
  return {scene,actor,step,bitmaps:depth ? flats.map(f=>f.asset) : [],frame:()=>scene.evaluate(),send:(intent,tick)=>scene.enqueue(intent,tick),
    recording:()=>({format:2,tickRate:TICK_RATE,seed,depth,ticks:scene.tick,inputs:structuredClone(scene.inputs)}),
    minute(){for(const entry of MINUTE) scene.enqueue(entry.intent,entry.tick);},
    get status(){return {attention:structuredClone(attention),action:action?.id || null,interaction:action?.kind || null,reach:lastReach,held:!!offering.attachment,returning:!!returning};}};
}
