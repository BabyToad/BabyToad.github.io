import { Rig } from '../../../src/rig.js';
import { Scene } from '../../../src/scene.js';
import { Actor,random } from '../../../src/actor.js';
import { Secondary } from '../../../src/motion/secondary.js';
import { Follow } from '../../../src/motion/follow.js';
import { solveHandWithWristLimit } from '../../../src/motion/reach.js';
import { smooth,mix,clamp } from '../../../src/math.js';
import { HANDS } from '../study.js';
import { figureSpace,cupPreset,CUP_ANGLE,fallStep } from './spatial.js';
import { Perception } from './perception.js';
import { stageLife } from './life.js';
import { curve,hops,hopAt } from './keys.js';
import { createThings } from './things/registry.js';
import { shrineThings } from './things/index.js';
import { ANSWERS } from '../speech/answers.js';

const lerp=(a,b,u)=>a.map((v,i)=>mix(v,b[i],u));
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const armKeys=['uarmL','farmL','handL','uarmR','farmR','handR','spine','bob','pelvis','head','pitch','browL','browR','smile','fRy'];

/** Authored planar performance with measured projected grips. The painted prop
 * and hand may have different depths: this is not a volumetric contact solver. */
export function stagePerformance(baked,config,{seed=7,beforePose,afterPhysics,onTick,things:factories=shrineThings}={}) {
  const scene=new Scene(),rig=new Rig(baked),view=rig.views.front,motion=new Secondary(24),rng=random(seed);
  const space=figureSpace(rig,config),p=space.p,perception=new Perception();
  const life=stageLife(config,p);
  view.pivots={...view.pivots,'stage.cup':cupPreset(view).support};
  const cupChain={...HANDS.L,palm:'stage.cup'};
  const eyes=new Follow(6,1),head=new Follow(2.8,1),body=new Follow(1.2,1),pitch=new Follow(2.5,1);
  const bowlHome=p.atDepth(config.offering.anchor,config.offering.depth),cordHome=p.atDepth(config.cord.bottom,config.bell.depth);
  const cordFollow=cordHome.map(x=>new Follow(1.7,.7,0,x)),cordLength=(config.cord.bottom[1]-390)*config.bell.depth/p.f;
  let cordBottom=[...cordHome];
  const bowl={position:[...bowlHome],velocity:[0,0,0],held:false,settled:true,moved:false,basis:[1,0,0,1],owner:'stand',layer:'world'};
  let root=[...space.home],action=null,goal=null,release=null,handCup=false,cupUntil=0,kick=0,bellPose;
  let reactionStart=-1000,position=0,probe=null,previousPalm=null,previousTransport=null,things;
  let walkPose={fLx:0,fRx:0,fLy:0,fRy:0},falling=0;
  const stretch=new Follow(6,.6,0,1),tilt=new Follow(5,.5);let squash={sx:1,sy:1,lean:0},characterFrame=space.frame(root,squash);
  const grains=[],dropPolicy=config.offering.drop||{depth:8.9,x:[210,930],maxSpeed:1.8};
  let consequences=[];
  const immutable=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(immutable);Object.freeze(value);}return value;};
  function consequence(kind,detail={}) {
    const event={tick:scene.tick,kind,...structuredClone(detail)};
    scene.record(kind,detail);consequences.push(event);
    things?.event(immutable(structuredClone(event)));
  }
  // Fresh snapshots; querying a target never advances simulation.
  function frame(name){
    const points={root, giver:p.atDepth([620,400],-root[2]), bowl:bowl.position,
      bell:p.atDepth(bell.views.default.point(bellPose,'bell',[875,350]),config.bell.depth),
      cord:cordBottom, ribbon:life.origin, 'hand.L':palm('L'), 'hand.R':palm('R')};
    const point=things?.hasFrame(name)?things.frame(name):Object.hasOwn(points,name)?points[name]:undefined;
    if(!point)throw Error(`Unknown stage frame ${name}`);
    return immutable({name,tick:scene.tick,position:[...point],screen:p.project(point)});
  }
  const bell=new Rig({format:2,name:'Painted bell',stage:config.image,
    controls:{drive:[-30,30],swing:[-30,30],flex:[-30,30]},parts:{},views:{default:{
      pivots:{},layers:[],bones:[{name:'root'},
        {name:'rope',parent:'root',pivot:config.bell.top,rot:[{c:'swing',k:1}]},
        {name:'bell',parent:'rope',pivot:config.bell.joint,rot:[{c:'flex',k:1}]}],
      anchors:{top:{bone:'root',pivot:config.bell.top},center:{bone:'bell',pivot:[875,350]}},
      secondary:[{into:['swing'],f:[1.4],z:.18,input:[{control:'drive',gain:1}]},
        {into:['flex'],f:[2.2],z:.25,input:[{control:'swing',gain:-.45}]}]}}});
  bellPose=bell.neutral();
  function palm(side,pose=actor.pose){return characterFrame.world(view.point(pose,side==='L'?'handL':'handR',side==='L'?'stage.cup':'b.palmR'));}
  function emit(kind,world,extra={}){consequence(kind,{point:world,...extra});perception.observe({kind,point:p.project(world)},scene.tick);}
  const actor=new Actor(rig,{base(tick){
    const interest=perception.step(tick),foot=p.project(root);
    let point=interest?.point;
    if(interest?.kind==='drop'||interest?.kind==='land')point=p.project(bowl.position);
    if(action&&!(interest?.score>=.9)&&!action.responsive)point=action.lookAtYou?frame('giver').screen:p.project(bowl.held?bowl.position:action.target);
    const x=point?clamp((point[0]-foot[0])/420,-1,1):0;
    const y=point?clamp((point[1]-(foot[1]-350))/500,-.6,.6):0;
    const blink=tick%111,react=smooth((tick-reactionStart)/6)*(1-smooth((tick-reactionStart-36)/36));
    return {...walkPose,bob:0,gaze:eyes.step(x),yaw:head.step(x*.75),pitch:pitch.step(y)+.2*react,
      head:3*head.y+1.6*Math.sin(tick/47)+3*react,spine:body.step(x)*2+1.1*Math.sin(tick/63)+4*react,
      ponyBase:.6*Math.sin(tick/31),farmR:2*Math.sin(tick/24)-8*react,
      browL:-7*react,browR:-10*react,eyeOpen:blink<4?[1,.4,0,.5][blink]:1,smile:-.12-.3*react};
  },constrain(pose){
    if(goal){
      const solved=solveHandWithWristLimit(view,pose,goal.chain,{position:p.project(goal.position),angle:goal.angle},characterFrame.screen);
      for(const key of goal.chain.channels)pose[key]=mix(pose[key],solved.pose[key],goal.weight);
      goal.clamped=solved.clamped||!solved.withinLimits;goal.wrist=solved.pose[goal.chain.channels[2]];
    }
    if(release){const u=1-smooth((scene.tick-release.tick)/12);
      for(const [key,value] of Object.entries(release.delta))pose[key]+=value*u;
      if(u===0)release=null;}
    if(!action)pose=things?.constrain(pose)??pose;
    for(const key of ['handL','handR'])pose[key]=clamp(pose[key],...rig.controls[key]);
    return pose;
  }});
  things=createThings(factories,{
    config,p,frame,actor,bowl,emit,consequence,space,
    get characterFrame(){return characterFrame;},
    perform, cancelPerformance,
    get tick(){return scene.tick;},get action(){return action;},
    get request(){return things?.request??null;},
    send:(intent,tick)=>scene.enqueue(intent,tick),record:(kind,detail)=>scene.record(kind,detail),
    random(label){let value=seed;for(const char of label)value=Math.imul(value^char.charCodeAt(0),16777619);return random(value);},
  },{
    intents:['pointer','ring','offer','speech-hop','test-impulse','interrupt','notice','water','wind','placement'],
    frames:['root','giver','bowl','bell','cord','ribbon','hand.L','hand.R'],
    answers:Object.keys(ANSWERS),
  });
  function releaseConstraint(){
    // Preserve the drawn correction while primary channels and springs fade.
    if(!goal&&release)return;
    const delta={};if(goal)for(const key of goal.chain.channels)delta[key]=actor.constraintDelta?.[key]||0;
    release={tick:scene.tick,delta};goal=null;
  }
  // Resident-authored travel uses the same grounded hops, hand solver and
  // interruptible action ownership as the original bell/bowl performances.
  function cancelPerformance(id){
    if(!action?.resident||id&&action.id!==id)return false;
    const previous=action;
    releaseConstraint();actor.cancel('action',{id:previous.id,fade:8});action=null;
    consequence('resident-action-cancel',{owner:previous.resident,request:previous.id});return true;
  }
  function perform({id,owner,plan,target,duration,sample,reach}){
    if(action||things.request||probe||!owner||!id)return false;
    action={id,kind:owner,resident:owner,start:scene.tick,plan,target:p.atDepth(target,-root[2]),offering:false};
    releaseConstraint();
    actor.drive('action',{duration,keys:armKeys.concat(['gaze','yaw']),sample(age,context){
      const aim=reach?.(age);
      if(aim)goal={chain:HANDS.R,position:p.atDepth(aim.point,-root[2]),angle:aim.angle??-70,weight:aim.weight};
      else goal=null;
      return sample(age,context);
    }},{id,fade:3,release:8});
    consequence('resident-action-start',{owner,request:id});return true;
  }
  function drop(){
    const wasHeld=bowl.held;
    if(!wasHeld&&bowl.owner!=='flight')return;
    bowl.held=false;bowl.settled=false;bowl.moved=true;bowl.owner='free';
    // Move to a foreground depth at identical projected size/position. This
    // explicit presentation handoff prevents the independent bowl hiding in hair.
    const sourcePosition=[...bowl.position],sourceVelocity=[...bowl.velocity],transport=wasHeld?(bowl.transportVelocity||sourceVelocity):sourceVelocity;
    const oldDepth=-bowl.position[2],depth=dropPolicy.depth,ratio=depth/oldDepth;
    const before=[...bowl.position];bowl.position=p.atDepth(p.project(before),depth);
    // Release into the fixed, visible landing lane. Transport omits the outer
    // squash/lean derivative and is speed-limited after projection. This is an
    // intentional public-stage throw policy, not conserved physical momentum.
    bowl.velocity=[(transport[0]-before[0]/before[2]*transport[2])*ratio,
      (transport[1]-(before[1]-p.h)/before[2]*transport[2])*ratio,0];
    const speed=Math.hypot(...bowl.velocity);if(speed>dropPolicy.maxSpeed)bowl.velocity=bowl.velocity.map(v=>v*dropPolicy.maxSpeed/speed);
    bowl.restScale=dropPolicy.depth/config.offering.depth;bowl.layer='foreground';
    bowl.basis=bowl.basis.map(v=>v*ratio);bowl.releaseBasis=[...bowl.basis];bowl.releasedTick=scene.tick;
    consequence('bowl-depth-handoff',{from:before,to:[...bowl.position],basis:[...bowl.basis]});
    consequence('bowl-release',{sourcePosition,sourceVelocity,transportVelocity:[...transport],position:[...bowl.position],velocity:[...bowl.velocity]});
    reactionStart=scene.tick;emit('drop',bowl.position);
    if(wasHeld)for(let i=0;i<18;i++)grains.push({position:[bowl.position[0],bowl.position[1]+.35,bowl.position[2]],velocity:[bowl.velocity[0]+(rng()-.5)*1.3,1+rng(),bowl.velocity[2]+(rng()-.5)*.9],settled:false,born:scene.tick});
  }
  function begin(kind,id){
    if(action?.kind==='speech-hop'){actor.cancel('action',{id:action.id,fade:0});action=null;}
    if(action || probe){scene.record('rejected',{id,reason:'busy'});return false;}
    if(kind==='offer' && bowl.moved){if(!bowl.settled){scene.record('rejected',{id,reason:'offering still falling'});return false;}kind='recover';}
    const offering=kind!=='ring';
    const pixel=p.project(offering?bowl.position:cordBottom);
    const stand=p.atDepth([config.offering.standFeetX,0],config.offering.standDepth);stand[1]=0;
    const floorAt=(x,z)=>{const q=p.atDepth([x,0],-z);q[1]=0;return q;};
    const near=kind==='offer'?stand:kind==='recover'?floorAt(pixel[0]+config.offering.floorReach,bowl.position[2]-.12):floorAt(pixel[0]-104,cordBottom[2]);
    // Contact means the hand is on those pixels at her own depth: a thin card a hand's width from the prop.
    const target=p.atDepth(pixel,-near[2]);
    const homeAtStand=p.atDepth(p.project(bowlHome),-stand[2]);
    const gap=(a,b)=>Math.hypot(...p.project(a).map((v,i)=>v-p.project(b)[i]));
    // Beat sheet, in ticks at 24 per second. Everything else hangs off these.
    let landingTicks=0,height=root[1],speed=falling;
    while(height>1e-6&&landingTicks<24){speed+=.045;height-=speed;landingTicks++;}
    const grounded=[...root];grounded[1]=0;
    const replacing=actor.layers.has('action');
    const go=hops(Math.max(4,landingTicks),grounded,near,gap(root,near)),T=go.end,S=T+10,C=kind==='recover'?S+9:T+(kind==='ring'?12:14);
    const plan=[go];let setA=0,home=0,hold=0,back,A0=0,A1=0;
    if(kind==='ring'){hold=C+14;back=hops(C+52,near,space.home,gap(near,space.home));}
    else{
      if(kind==='offer'){
        const out=hops(C+16,stand,space.home,gap(stand,space.home));A0=out.end;A1=A0+58;
        const ret=hops(A1,space.home,stand,gap(stand,space.home));plan.push(out,ret);setA=ret.end+4;
      }else{const carry=hops(C+22,near,stand,gap(near,stand));plan.push(carry);A0=A1=carry.end;setA=carry.end+4;}
      home=setA+12;back=hops(home+12,stand,space.home,gap(stand,space.home));
    }
    plan.push(back);
    const duration=back.end+10,dip=kind==='recover'?config.offering.floorDip:kind==='offer'?config.offering.dip:0;
    action={id,kind,offering,start:scene.tick,target,contact:false,age:0,fromPose:{...actor.primary},plan,C,S,hold,homeAtStand,floorPos:[...bowl.position],lookAtYou:false};
    releaseConstraint();
    actor.drive('action',{keys:armKeys,sample(age,{pose}){
      action.age=age;
      const q={...pose},from=action.fromPose,restore=back.start,end=back.start+2;
      if(offering){
        handCup=age>=T&&age<home+8;cupUntil=handCup?scene.tick+2:cupUntil;
        const look=kind==='offer'?[[A0,0],[A0+8,.42],[A1-14,.42],[A1-8,-.08,'f'],[A1,.1],[setA,.3],[home+8,0]]:[[C,.3],[C+10,0]];
        action.lookAtYou=kind==='offer'&&age>=A0+16&&age<A0+26;
        action.responsive=kind==='offer'&&age>=A0+26&&age<A1;
        q.pitch=pose.pitch+curve(age,look);
        q.head=pose.head+curve(age,[[T,0],[T+5,3],[C,-5,'f'],[C+10,3,'f'],[C+24,-1],[A0,0],[A0+10,5],[A1-14,5],[A1-8,-2,'f'],[setA,0]]);
        q.spine=pose.spine+curve(age,[[T-3,0],[T+5,4],[C,-8,'f'],[C+11,3,'f'],[C+17,0],[setA,0],[home,-8],[home+8,2,'f'],[home+13,0]]);
        q.pelvis=mix(from.pelvis,curve(age,[[T,0],[C,-3,'f'],[C+12,1],[home,-3],[home+10,0]]),smooth(age/6));
        q.bob=mix(from.bob,kind==='recover'?curve(age,[[T,0],[S-3,-10],[S,26,'i'],[S+7,-8,'f'],[C+6,10,'f'],[C+12,0],[setA,0],[home,config.offering.dip,'f'],[home+9,-8,'f'],[home+14,0]])
          :curve(age,[[T,0],[T+5,14],[C,dip,'f'],[C+1,dip],[C+11,-14,'f'],[C+17,4],[C+22,0],[setA,0],[home,dip,'f'],[home+9,-8,'f'],[home+14,0]]),smooth(age/6));
        q.uarmL=curve(age,[[T,from.uarmL],[T+5,-20],[C,-25,'f'],[home+2,-25],[home+13,0]]);
        q.farmL=curve(age,[[T,from.farmL],[T+5,36],[C,64,'f'],[home+2,64],[home+13,0]]);
        q.handL=curve(age,[[T,from.handL],[T+5,-16],[C,42,'f'],[home+2,42],[home+13,0]]);
        // the other arm counterbalances, half a beat late
        q.uarmR=curve(age,[[T,from.uarmR],[T+7,8],[C+2,-16,'f'],[C+13,6,'f'],[C+20,0],[home+1,-12],[home+12,0]]);
        q.farmR=curve(age,[[T,from.farmR],[C+3,-26,'f'],[C+14,-6],[home+3,-22],[home+14,from.farmR]]);
        q.handR=mix(from.handR,pose.handR,smooth(age/12));
        q.browR=pose.browR+curve(age,kind==='offer'?[[A0,0],[A0+8,4],[A1-16,4],[A1-11,-18,'f'],[A1,-10],[home+4,0]]:[[0,0]]);
        q.browL=pose.browL+curve(age,kind==='offer'?[[A0,0],[A0+8,6],[A1-16,6],[A1-11,-3,'f'],[home+4,0]]:[[0,0]]);
        q.smile=pose.smile+curve(age,kind==='offer'?[[A0+22,0],[A0+34,.75],[A1-13,.75],[A1-9,.1,'f'],[home,0]]:[[0,0]]);
        const carry=kind==='recover'&&age<setA?1:curve(age,[[C,0],[C+12,1.06,'f'],[C+18,1],[setA,1],[home,0]]);
        if(kind==='recover')q.fRy=pose.fRy+curve(age,[[T+1,0],[S-3,34],[S,0,'i']]);
        const heldPose=rig.neutral({spine:0,uarmL:22,farmL:74,handL:CUP_ANGLE-89});
        const heldAt=characterFrame.world(view.point(heldPose,'handL','stage.cup'));
        let aim=[...(age>=setA?action.homeAtStand:action.target)];
        if(kind==='recover'&&age<C)action.target=[...aim];
        aim=lerp(aim,heldAt,carry);
        if(carry>.5)aim[2]=root[2];
        if(kind==='offer')aim[1]+=.09*curve(age,[[A0+2,0],[A0+7,-1,'f'],[A0+13,.7,'f'],[A0+20,0]]);
        if(bowl.owner==='flight'&&age<=C)aim=[...bowl.flight.target];
        goal={chain:cupChain,position:aim,angle:CUP_ANGLE,weight:curve(age,[[T+5,0],[C-1,1,'f'],[home+1,1],[home+8,0]])};
      }else{
        const pull=curve(age,[[C+1,0],[C+5,1,'f'],[C+12,1],[C+17,0,'f']]);
        action.lookAtYou=false;
        q.pitch=pose.pitch+curve(age,[[T,0],[C,-.25],[C+6,.15,'f'],[hold+4,.1],[hold+12,-.6,'f'],[back.start-6,-.6],[back.start,0]]);
        q.head=pose.head+curve(age,[[T,0],[C,4,'f'],[C+6,-3,'f'],[hold+12,6],[back.start,0]]);
        q.spine=pose.spine+curve(age,[[T-3,0],[T+5,-4],[C,6,'f'],[C+6,-6,'f'],[hold,-2],[hold+8,2,'f'],[hold+16,0]]);
        q.pelvis=mix(from.pelvis,curve(age,[[T,0],[C,2],[C+6,-2,'f'],[hold+10,0]]),smooth(age/6));
        q.bob=mix(from.bob,curve(age,[[T,0],[T+5,16],[C,-16,'f'],[C+6,58,'f'],[hold,40],[hold+7,-6,'f'],[hold+13,0]]),smooth(age/6));
        q.uarmR=curve(age,[[T,from.uarmR],[T+5,14],[C,-30,'f'],[hold,-30],[hold+10,0,'f']]);
        q.farmR=curve(age,[[T,from.farmR],[T+5,-40],[C,-60,'f'],[hold,-60],[hold+12,from.farmR,'f']]);
        q.handR=curve(age,[[0,from.handR],[T,0],[hold,0],[hold+6,-22,'f'],[hold+16,0]]);
        q.uarmL=curve(age,[[T,from.uarmL],[C,10],[C+6,24,'f'],[hold+12,0]]);
        q.farmL=curve(age,[[T,from.farmL],[C+6,30,'f'],[hold+12,from.farmL]]);q.handL=mix(from.handL,pose.handL,smooth(age/12));
        q.browR=pose.browR+curve(age,[[hold+6,0],[hold+12,-16,'f'],[back.start,0]]);q.browL=pose.browL+curve(age,[[hold+6,0],[hold+12,-6],[back.start,0]]);q.smile=pose.smile;
        // Track the free cord until grasp. Once held, the performer owns its path.
        if(!action.contact)action.target=p.atDepth(p.project(cordBottom),-root[2]);
        const aim=[...action.target];aim[1]-=.3*pull;
        goal={chain:HANDS.R,position:aim,angle:-70,weight:curve(age,[[T+5,0],[C-1,1,'f'],[hold,1],[hold+6,0,'f']])};
      }
      return Object.fromEntries(armKeys.map(k=>[k,replacing?mix(from[k],q[k],smooth(age/6)):q[k]]));
    },duration,markers:[{tick:C,name:kind==='recover'?'catch':'projected-grip'},...(offering?[{tick:home,name:'home'}]:[{tick:C+5,name:'pull'}])]},
    {id,fade:0,release:8});
    scene.record('interaction-start',{id,interaction:kind});return true;
  }
  function handle(intent,tick){
    const handled=things.handle(intent,tick);if(handled!==undefined)return handled;
    if(intent.kind==='pointer'){
      if(intent.active!==false&&![intent.x,intent.y].every(Number.isFinite)){scene.record('rejected',{id:intent.id,reason:'invalid pointer'});return false;}
      perception.observe(intent,tick);
    }else if(intent.kind==='ring'||intent.kind==='offer'){cancelPerformance();return begin(intent.kind,intent.id);}
    else if(intent.kind==='speech-hop'){
      // The score requests a real grounded hop. A later visitor action always wins.
      const speech=actor.layers.get('speech');
      if(action||things.request||root[1]>1e-6||!speech?.source||speech.id!==intent.request)return false;
      const plan={...hops(0,root,root,0),n:1,end:9,dir:0};
      action={id:intent.id,kind:'speech-hop',start:tick,plan:[plan],responsive:true};
      actor.drive('action',{keys:[],duration:15,sample:()=>({})},{id:intent.id,fade:0,release:0});
    }
    else if(intent.kind==='test-impulse'){kick=3;scene.record('test-impulse',{id:intent.id});}
    else if(intent.kind==='interrupt'){
      if(intent.request&&intent.request!==action?.id){if(things.interrupt(intent))return true;scene.record('rejected',{id:intent.id,reason:'stale cancellation'});return false;}
      if(action){drop();releaseConstraint();actor.cancel('action',{id:action.id,fade:12});action=null;emit('visitor',frame('giver').position);}
    }else if(intent.kind==='notice'){emit('visitor',p.atDepth([620,400],-root[2]));}
    else if(intent.kind==='water'){emit('water',p.atDepth([1210,740],8));}
    else if(intent.kind==='wind'){emit('wind',life.origin);}
    else if(intent.kind==='placement'){if(action){scene.record('rejected',{id:intent.id,reason:'busy'});return false;}probe={from:[...root],to:intent.behind?p.onPlane([400,838],p.floor):space.home,start:tick};position=intent.behind?1:0;}
    else return undefined;
    return true;
  }
  function step(){scene.step((tick,intents)=>{
    consequences=[];
    const commands=intents.map(intent=>{const accepted=handle(intent,tick);return {intent,handled:accepted!==undefined,accepted:accepted??null};});
    const previousRoot=[...root];
    if(probe){const u=smooth((tick-probe.start)/72);root=lerp(probe.from,probe.to,u);if(u===1)probe=null;}
    let hop=null;
    if(root[1]>1e-6&&(!action||tick-action.start<action.plan[0].start)){
      falling+=.045;root[1]=Math.max(0,root[1]-falling);if(root[1]===0){falling=0;stretch.kick(-2);}
    }
    if(action){
      const age=tick-action.start;
      for(const plan of action.plan){const at=hopAt(plan,age);if(age>=plan.start&&(at.active||age>=plan.end||!hop)){root=at.position;hop=at.active?{...at,dir:plan.dir}:null;}}
    }
    const residentMotion=!action&&things.motion(tick);
    if(residentMotion){root=[...residentMotion.position];hop=residentMotion.active?residentMotion:null;}
    if(previousRoot[1]>1e-6&&root[1]<=1e-6)consequence('saint-land',{
      interaction:action?.kind??'interrupted',speed:previousRoot[1]*24,point:[...root]});
    const air=hop?.air||0,side=hop&&hop.index%2?-1:1,dir=hop?.dir||0;
    walkPose={fLx:dir*side*9*air,fRx:-dir*side*9*air,fLy:(side>0?26:14)*air,fRy:(side>0?14:26)*air};
    const sy=stretch.step(hop?.active?hop.stretch:1),rootSpeed=(root[0]-previousRoot[0])/space.unit;
    squash={sx:1/Math.max(.6,sy),sy,lean:tilt.step(dir*-9*air)};
    characterFrame=space.frame(root,squash);
    actor.world={vx:rootSpeed,vy:-(root[1]-previousRoot[1])/space.unit};
    bellPose=motion.step(bell.views.default,bell.neutral({drive:kick>0?-22:0}));if(kick>0)kick--;
    const context=immutable({commands:structuredClone(commands)});
    things.beforePose(tick,{...context,frame});
    // Legacy hook remains until speech migrates; never invoke both input hooks.
    if(beforePose)beforePose(tick,{...context,frame});else onTick?.(tick,intents);
    const events=actor.step(tick);
    // Flight owns its own integration; free gravity never runs on this arc.
    if(action?.kind==='recover'&&!action.contact&&action.age>=action.S&&action.age<=action.C){
      if(bowl.owner!=='flight'){
        bowl.owner='flight';bowl.settled=false;
        bowl.flight={from:[...bowl.position],target:[...goal.position],basis:[...bowl.basis],start:tick,end:action.start+action.C};
        stretch.kick(-3);consequence('stamp',{point:[...bowl.position]});
      }
      const flight=bowl.flight,u=(tick-flight.start)/(flight.end-flight.start),old=[...bowl.position];
      bowl.position=lerp(flight.from,flight.target,u);bowl.position[1]+=.35*Math.sin(Math.PI*u);
      bowl.velocity=bowl.position.map((x,i)=>(x-old[i])*24);
      bowl.basis=lerp(flight.basis,characterFrame.basis,smooth(u));
    }
    for(const event of events){scene.record(event.kind,event);if(event.id!==action?.id)continue;
      if(event.kind==='marker'&&['projected-grip','catch'].includes(event.name)){
        const actual=palm(action.offering?'L':'R'),target=action.kind==='recover'?bowl.position:action.target,error=distance(actual,target);
        if(error>.005||goal.clamped||Math.abs(goal.wrist)>45){consequence('grip-missed',{id:action.id,grip:event.name,error,wrist:goal.wrist});if(bowl.owner==='flight')drop();releaseConstraint();actor.cancel('action',{fade:12});action=null;continue;}
        action.contact=true;consequence(event.name,{id:action.id,interaction:action.kind,error,actual,target:[...target]});
        if(action.offering){bowl.held=true;bowl.moved=true;bowl.settled=false;bowl.owner='hand';bowl.layer='hand';}
      }
      if(event.kind==='marker'&&event.name==='pull'&&action.contact){
        const error=distance(palm('R'),goal.position);
        if(error<.005&&!goal.clamped){kick=3;emit('bell',frame('bell').position,{id:action.id,error});}
        else scene.record('pull-missed',{id:action.id,error});
      }
      if(event.kind==='marker'&&event.name==='home'&&bowl.held){
        const error=distance(palm('L'),action.homeAtStand);if(error<.005){bowl.held=false;bowl.position=[...bowlHome];bowl.velocity=[0,0,0];bowl.settled=true;bowl.moved=false;bowl.owner='stand';bowl.layer='world';bowl.basis=[1,0,0,1];consequence('offering-home',{error});}else drop();
      }
      if(event.kind==='completed'){releaseConstraint();action=null;}
    }
    const transport=space.world(view.point(actor.pose,'handL','stage.cup'),root);
    if(bowl.held){bowl.transportVelocity=previousTransport?transport.map((x,i)=>(x-previousTransport[i])*24):[0,0,0];const point=palm('L');bowl.velocity=previousPalm?point.map((x,i)=>(x-previousPalm[i])*24):[0,0,0];bowl.position=point;bowl.basis=[...characterFrame.basis];}
    else if(bowl.owner==='free'&&!bowl.settled){
      const landed=fallStep(bowl),pixel=p.project(bowl.position),bounded=clamp(pixel[0],...dropPolicy.x);
      if(pixel[0]!==bounded){bowl.position[0]=p.atDepth([bounded,pixel[1]],-bowl.position[2])[0];bowl.velocity[0]*=-.35;}
      if(landed){
      if(bowl.settled)bowl.owner='floor';
      emit('land',bowl.position);if(tick-reactionStart>40)reactionStart=tick;
      }
    }
    if(bowl.owner==='free')bowl.basis=lerp(bowl.releaseBasis||[1,0,0,1],[bowl.restScale||1,0,0,bowl.restScale||1],smooth((tick-bowl.releasedTick)/12));
    previousPalm=palm('L');previousTransport=transport;
    for(const grain of grains)fallStep(grain);
    for(let i=grains.length-1;i>=0;i--)if(tick-grains[i].born>=240)grains.splice(i,1);
    const top=p.atDepth(bell.views.default.point(bellPose,'bell',[875,390]),config.bell.depth);
    if(action?.kind==='ring'&&action.contact&&action.age<=action.hold){cordBottom=palm('R');cordFollow.forEach((f,i)=>f.set(cordBottom[i]));}
    else cordBottom=cordFollow.map((f,i)=>f.step(top[i]-(i===1?cordLength:0)));
    things.afterPhysics(tick);
    life.step(tick,consequences);
    afterPhysics?.(tick,{events:immutable(structuredClone(consequences)),frame});
  });}
  return {scene,rig,actor,bell,space,bowl,grains,perception,life,things,step,frame,offering:{...config.offering,home:bowlHome},
    send:(intent,tick)=>scene.enqueue(intent,tick),
    interact:(target,options)=>things.interact(target,options),
    recording:()=>({format:3,seed,ticks:scene.tick,inputs:structuredClone(scene.inputs)}),
    get characterFrame(){return characterFrame;},get root(){return root;},get squash(){return squash;},get bellPose(){return bellPose;},get placement(){return position;},
    get cup(){return handCup&&scene.tick<cupUntil;},get action(){return action;},get goal(){return goal;},
    get cord(){return {top:p.atDepth(bell.views.default.point(bellPose,'bell',[875,390]),config.bell.depth),bottom:[...cordBottom]};},
    get frogOffset(){return things.get('frog')?.offset??[0,0,0];},
  };
}
