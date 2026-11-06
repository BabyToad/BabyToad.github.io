import { curve } from '../keys.js';
import { smooth, mix } from '../../../../src/math.js';

// Registration in the untouched 1536 x 1024 painting. The far card is at 44,
// just in front of the backdrop (45); distance below is authored sound staging,
// not a claim that the projection reconstructs a metric landscape.
const TIERS = [
  {bounds:[84,106,57,84],mist:[103,163,38,29],point:[119,174],hold:6,phase:0,distance:145},
  {bounds:[160,189,88,116],mist:[204,269,44,34],point:[222,285],hold:4,phase:4,distance:125},
  {bounds:[63,300,141,155],mist:[64,403,112,51],point:[117,428],hold:3,phase:8,distance:105},
];
const DEPTH=44, SLOT='waterfall.listen', END=168;
const pulse=age=>smooth(age/9)*(1-smooth((age-12)/24));
const delay=(tier,chosen)=>18+(tier-chosen)*18;
const departure=chosen=>delay(2,chosen)+21;
const tierPitch=[-.48,-.34,-.16];
// Three small, uneven brush silhouettes: upstroke, downstroke, glide.
const WINGS=[
  [[-4,-3],[-2,-2.5],[0,0],[2,-2.8],[4.4,-3.5],[2.8,-.7],[0,1],[-2.7,-.7]],
  [[-3.8,2.2],[-2,.5],[0,0],[2.5,.7],[4,2.8],[2,.1],[0,-.9],[-2.6,-.4]],
  [[-5,-.6],[-2.2,-1],[0,0],[2.3,-1],[5,-.8],[2.5,.2],[0,1],[-2.5,.2]],
];

/** A faraway answer. One bounded swell, three ledges, a listener who can leave. */
export function waterfall(host) {
  let run=null,visits=0,repeats=0,repeatTick=-1000,listening=false,lastTouch=-1000;
  let pan={start:0,from:0,to:0};
  const point=i=>host.p.atDepth(TIERS[i].point,DEPTH);
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start)/12));
  function frameValley(open){
    const to=open?1:0;
    if(pan.to!==to)pan={start:host.tick,from:panAmount(),to};
  }
  function leave(){
    if(!listening)return;
    host.actor.cancel(SLOT,{id:run.id,fade:8});listening=false;
  }
  function listen(intent){
    if(host.action)return;
    listening=true;
    const familiar=Math.min(1,(visits-1)/5),chosen=run.tier;
    const pitches=[[0,tierPitch[chosen]]];
    for(let i=chosen+1;i<3;i++)pitches.push([delay(i,chosen)-6,tierPitch[i-1]],[delay(i,chosen)+6,tierPitch[i]]);
    host.actor.drive(SLOT,{
      keys:['gaze','yaw','pitch','head','spine','browL','browR','farmL'],duration:124,
      sample(age,{pose,tick}){
        // Ownership and destination are separate. Returning to the lower pose
        // would keep looking at a pointer left parked on the falls.
        const owned=curve(age,[[0,0],[8,1],[104,1],[124,0]]);
        const look=curve(age,[[0,1],[63,1],[76,0],[86,0],[98,.65],[106,.65],[124,0]]);
        const lean=curve(age,[[0,0],[10,-2],[25,-5],[63,-5],[75,2],[90,0],[116,0]]);
        const again=pulse(tick-repeatTick)*Math.min(repeats,3);
        return {gaze:mix(pose.gaze,(-.9+again*.15)*look,owned),
          yaw:mix(pose.yaw,-.68*look,owned),pitch:mix(pose.pitch,curve(age,pitches)*look,owned),
          head:pose.head+lean*(1-familiar*.2),spine:pose.spine+lean*.42,
          browL:pose.browL-look*(4+familiar*3),browR:pose.browR-again*3,
          farmL:pose.farmL+curve(age,[[0,0],[18,-8],[55,-8],[74,0],[116,0]])};
      },
    },{id:intent.id,fade:3,release:8});
  }
  function sample(tick=host.tick){
    const age=run?tick-run.start:-1000;
    // Drawings change on held ticks. No renderer clock or mutable phase.
    return TIERS.map((t,i)=>{
      const held=Math.floor(tick/4)*4;
      const breath=(1+Math.sin(held/(43+i*13)+i*2))/2;
      // Only the touched ledge and those downstream answer. One clearer ledge
      // accent leads the eye; the entire waterfall never gets brighter at once.
      const amplitude=run?run.strength*(i===run.tier?1.3:.8):0;
      const surge=run&&i>=run.tier?pulse(Math.floor(age/3)*3-delay(i,run.tier))*amplitude:0;
      return {frame:(Math.floor(tick/t.hold)+t.phase)%12,
        mistX:Math.sin(held/(57+i*11)+i)*(.7+i*.35)+surge*(1.5+i),
        mistY:-breath*(.7+i*.45)-surge*(2+i),
        opacity:Math.min(.96,.12+breath*.12+surge*.6),surge};
    });
  }
  function birds(tick=host.tick){
    return [0,1].map(i=>{
      const age=run?Math.floor((tick-run.start-departure(run.tier)-i*12)/3)*3:-1000;
      const u=age/60,visible=!!run&&i<run.launched&&age>=0&&age<60;
      return {visible,x:166+121*u+i*5,y:398-158*u-22*Math.sin(Math.PI*u)+i*9,
        cel:[0,2,1,2,0,2,1,2,2,2][Math.max(0,Math.floor(age/3))%10],
        opacity:visible?.82*smooth(age/6)*(1-smooth((age-45)/15)):0};
    });
  }
  return {id:'waterfall',layers:[SLOT],
    targets:{waterfall:{control:'waterfall',point:()=>TIERS[0].point,
      // Forgiveness stays within the distant water, away from the path/tree.
      hit:(x,y)=>TIERS.some(t=>{const [a,b,w,h]=t.bounds;return ((x-a-w/2)/(w*.57))**2+((y-b-h/2)/(h*.55))**2<1;}),
      interact:({point:[x,y]})=>({kind:'waterfall-touch',tier:TIERS.map(t=>Math.hypot(x-t.point[0],y-t.point[1])).reduce((best,d,i,distances)=>d<distances[best]?i:best,0)})}},
    intents:{'waterfall-touch'(intent){
      const tier=intent.tier??0;
      if(!Number.isInteger(tier)||tier<0||tier>2)return false;
      // Choosing a view is accepted even when its existing physical run cannot
      // restart. Deliver in input order, independently of command rejection.
      host.consequence('scenic-focus',{resident:'waterfall'});
      const quiet=host.tick-lastTouch;lastTouch=host.tick;
      frameValley(true);
      if(run){
        repeats=Math.min(3,repeats+1);repeatTick=host.tick;
        run.patient=false; // Already flying birds finish; pending departures wait.
        host.consequence('waterfall-wait',{request:run.id,repeats});return false;
      }
      visits++;repeats=0;
      run={id:intent.id,start:host.tick,tier,strength:1-.3*Math.min(1,(visits-1)/6),birds:quiet>288?2:quiet>168?1:0,launched:0,patient:true};
      listen(intent);
      host.consequence('waterfall-noticed',{request:run.id,point:point(tier),tier,visits});return true;
    },'waterfall-dismiss'(){frameValley(false);leave();return true;}},
    onEvent(event){if(event.kind==='scenic-focus'&&event.resident!=='waterfall'){
      leave();pan={from:0,to:0,start:host.tick};
    }},
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&
        (['ring','offer','interrupt','notice','water','wind','feed-frog','knock-word'].includes(intent.kind)||intent.kind==='poke'))){leave();frameValley(false);}
      if(run&&tick-run.start>=124)listening=false;
      if(run&&tick-run.start>=END){leave();run=null;frameValley(false);}
    },
    afterPhysics(tick){
      if(!run)return;
      for(const [i,t] of TIERS.entries()){
        if(i<run.tier)continue;
        // The visible plume peaks, then its sound reaches the near side.
        const peak=delay(i,run.tier)+9, travel=Math.round(t.distance/343*24);
        const strength=run.strength*(i===run.tier?1.3:.8);
        const detail={request:run.id,tier:i,point:point(i),distance:t.distance,
          strength,risePixels:(2+i)*strength,travelTicks:travel};
        if(tick-run.start===peak)host.consequence('waterfall-plume',detail);
        if(tick-run.start===peak+travel)host.consequence('waterfall-arrival',detail);
      }
      for(let i=0;i<run.birds;i++)if(run.patient&&tick-run.start===departure(run.tier)+i*12){
        run.launched++;
        host.consequence('waterfall-bird',{request:run.id,bird:i,point:host.p.atDepth([166+i*5,398+i*9],DEPTH),distance:105});
      }
    },
    frames:{waterfall:()=>point(1)},
    framing:()=>({bounds:[55,95,685,760],amount:panAmount(),open:pan.to===1,
      dismiss:{kind:'waterfall-dismiss'},returnControl:'waterfall'}),
    speech:{command({intent},tick,director){
      // A silent interaction still counts as company for the Director's idle
      // musings. Do not request a line or interrupt an existing utterance.
      if(intent.kind==='waterfall-touch'&&'lastClick' in director)director.lastClick=tick;
    }},
    get state(){return {run:run&&{...run},visits,repeats,listening,lastTouch,pan:{...pan},drawings:sample(),birds:birds()};},
    async mount({THREE,texture,cutGeometry,basic,geometry,objects,pick}){
      const views=[];
      for(const [i,t] of TIERS.entries()){
        const map=await texture(`waterfall/flow-${i}.png`),mistMap=await texture(`waterfall/mist-${i}.png`);
        for(const tex of [map,mistMap]){tex.generateMipmaps=false;tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;}
        const material=tex=>basic(tex,{transparent:true,depthWrite:false,forceSinglePass:true});
        const flow=new THREE.Mesh(cutGeometry(t.bounds,DEPTH),material(map));
        const mist=new THREE.Mesh(cutGeometry(t.mist,DEPTH-.01),material(mistMap));
        flow.name=`waterfall.flow.${i}`;mist.name=`waterfall.mist.${i}`;
        // Depth testing keeps all near scenery in front. No shadows/particles.
        objects.add(flow,mist);pick(flow,'waterfall');views.push({flow,mist,frame:-1});
      }
      const wingGeometry=WINGS.map(points=>geometry(points.map(([x,y])=>[x*1.15*DEPTH/host.p.f,-y*1.15*DEPTH/host.p.f,0]),
        points.flatMap(()=>[0,0]),[0,1,6,1,2,6,2,3,6,3,4,6,4,5,6,6,7,0]));
      const birdMeshes=[0,1].map(i=>{
        const mesh=new THREE.Mesh(wingGeometry[0],basic(null,{color:0x29434d,transparent:true,depthWrite:false,forceSinglePass:true}));
        mesh.name=`waterfall.bird.${i}`;objects.add(mesh);return mesh;
      });
      return {update(tick){
        const drawings=sample(tick);
        for(const [i,view] of views.entries()){
          const {flow,mist}=view;
          const d=drawings[i],[,,w,h]=TIERS[i].bounds;
          // Put the atlas cell in geometry UVs, so the renderer's alpha picker
          // sees precisely the same pixels (also in the bare stage demo).
          if(view.frame!==d.frame){
            const u=((d.frame%4)*(w+4)+2)/((w+4)*4),v=1-(Math.floor(d.frame/4)*(h+4)+2+h)/((h+4)*3);
            const du=w/((w+4)*4),dv=h/((h+4)*3),uv=flow.geometry.attributes.uv;
            [[u,v+dv],[u+du,v+dv],[u+du,v],[u,v]].forEach(([x,y],j)=>uv.setXY(j,x,y));
            uv.needsUpdate=true;view.frame=d.frame;
          }
          mist.position.set(d.mistX*DEPTH/host.p.f,-d.mistY*DEPTH/host.p.f,0);
          mist.material.opacity=d.opacity;
        }
        for(const [i,bird] of birds(tick).entries()){
          const mesh=birdMeshes[i];mesh.visible=bird.visible;
          if(!bird.visible)continue;
          mesh.geometry=wingGeometry[bird.cel];mesh.position.fromArray(host.p.atDepth([bird.x,bird.y],DEPTH-.02));
          mesh.material.opacity=bird.opacity;
        }
      },dispose(){for(const {flow,mist} of views)objects.remove(flow,mist);objects.remove(...birdMeshes);}};
    },
  };
}
