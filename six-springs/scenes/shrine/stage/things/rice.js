import { clamp, mix, smooth } from '../../../../src/math.js';
import { fallStep } from '../spatial.js';
import { curve, hops } from '../keys.js';
import { FIELD } from '../assets/rice/field.js';

/**
 * Rice is one conserved quantity: every unit is always somewhere (the heap on
 * the stool, the offering bowl, a grain in the air or on the paving, her hand,
 * or eaten). Moving units between places is the only operation, so a long
 * session cannot leak grains and the cap is the total itself.
 *
 * Loose grains fall with the stage's gravity, then roll down a field baked from
 * the painting's own dark joints (bake/rice_field.py) and come to rest in the
 * painted cracks. She gleans them, one at a time, back into the offering bowl.
 * The sack's take and patch leak arrive here as receipts.
 */
const HEAP=[436,728], HEAP_DEPTH=11.2, START={heap:40,bowl:18}, BOWL_FULL=24;
const SLOT='rice.notice', PATCH=[424,850];
const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const V=decode(FIELD.data);

/** Height of the painted ground at a painting pixel, 0 (crack) to 1 (stone face). */
export function ground(x,y){
  const gx=(x-FIELD.x0)/FIELD.cell-.5,gy=(y-FIELD.y0)/FIELD.cell-.5;
  const i=clamp(Math.floor(gx),0,FIELD.w-2),j=clamp(Math.floor(gy),0,FIELD.h-2),u=clamp(gx-i,0,1),v=clamp(gy-j,0,1);
  const at=(a,b)=>V[b*FIELD.w+a]/255;
  return mix(mix(at(i,j),at(i+1,j),u),mix(at(i,j+1),at(i+1,j+1),u),v);
}
function slope(x,y){const e=2;return [(ground(x+e,y)-ground(x-e,y))/(2*e),(ground(x,y+e)-ground(x,y-e))/(2*e)];}
const inField=([x,y])=>[clamp(x,FIELD.x0+4,FIELD.x0+FIELD.w*FIELD.cell-4),clamp(y,FIELD.y0+4,FIELD.y0+FIELD.h*FIELD.cell-4)];

export function rice(host){
  const p=host.p,rng=host.random('rice');
  const heapWorld=p.atDepth(HEAP,HEAP_DEPTH);
  let heap=START.heap,bowl=START.bowl,held=null,sequence=0;
  const eaten={frog:0,bird:0},grains=[],receipts=new Map();
  let glean=null,quietSince=0,lastKnock=-1000,knocks=0,response=null,gleaned=0,missed=0;

  function body(position,velocity,source){
    const g={id:++sequence,position:[...position],velocity:[...velocity],settled:false,born:host.tick,source,
      place:'air',px:null,v:null,rest:false,turn:rng()*Math.PI};
    grains.push(g);return g;
  }
  function toss(from,to,source,delay=0){
    // A grain thrown to the heap or bowl follows an authored arc and lands as a unit.
    const g=body(from,[0,0,0],source);g.place='toss';g.from=[...from];g.to=[...to];g.start=host.tick+delay;g.length=12+Math.floor(rng()*4);
    return g;
  }
  function scatter(at,velocity,amount,source){
    for(let i=0;i<amount;i++)body([at[0],at[1]+.3,at[2]],[velocity[0]+(rng()-.5)*1.3,.8+rng(),velocity[2]+(rng()-.5)*.9],source);
  }
  const loose=()=>grains.filter(g=>g.place==='floor'&&g.rest);

  function notice(id,kind){
    if(host.action||host.request||host.bowl.held||glean)return;
    if(response)host.actor.cancel(SLOT,{id:response,fade:6});
    response=id;const at=p.project(heapWorld);
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','browL','browR','smile'],duration:60,
      sample(age,{pose}){const a=curve(age,[[0,0],[7,1],[30,1],[60,0]]),cross=kind==='again'?1:.4;
        const toward=clamp((at[0]-p.project(host.frame('root').position)[0])/140,-1,1);
        return {gaze:mix(pose.gaze,toward,a),yaw:mix(pose.yaw,toward*.6,a),pitch:mix(pose.pitch,.45,a),
          head:pose.head-3*a,browL:pose.browL-6*cross*a,browR:pose.browR-9*cross*a,smile:mix(pose.smile,-.4*cross,a)};}},
      {id,fade:4,release:8});
  }

  // Gleaning: she walks to one grain, dips, pinches it, looks at it, and puts it back.
  // Stand at the grain's own depth, so her floor line is the grain's floor line;
  // the board's 140 px reach offset was measured at 8.8 m and scales with depth.
  function standFor(g){const depth=clamp(-g.position[2],8.2,11.3),s=p.atDepth([g.px[0]-140*8.8/depth,0],depth);s[1]=0;return s;}
  function startGlean(target,reason){
    if(glean||held||host.action||host.request||host.bowl.held||host.bowl.owner!=='stand')return false;
    const from=[...host.frame('root').position];if(from[1]>.001)return false;
    const home=p.onPlane(host.config.saint.feet,p.floor),near=standFor(target);
    const dist=(a,b)=>Math.hypot(...p.project(a).map((v,i)=>v-p.project(b)[i]));
    const look=12,go=hops(look,from,near,dist(from,near)),T=go.end,pinch=T+12,lift=pinch+18;
    const back=hops(lift+6,near,home,dist(near,home)),H=back.end,put=H+12,end=put+14;
    const id=`rice.glean:${host.tick}`,grain=target,start=host.tick,first=gleaned===0;
    const bowlPx=p.project(host.bowl.position);
    // Fingertips meet the grain; after the pinch the hand lifts it to her eyes, then to the bowl.
    const aim=age=>{
      if(age<=pinch+1)return [grain.px[0],grain.px[1]-4];
      const root=p.project(host.frame('root').position);
      const eyes=[root[0]+70,root[1]-300];
      if(age<lift)return [mix(grain.px[0],eyes[0],smooth((age-pinch)/12)),mix(grain.px[1],eyes[1],smooth((age-pinch)/12))];
      if(age<H)return [root[0]+60,root[1]-230];
      return [mix(root[0]+60,bowlPx[0]+6,smooth((age-H)/10)),mix(root[1]-230,bowlPx[1]-10,smooth((age-H)/10))];
    };
    const ok=host.perform({id,owner:'rice',plan:[go,back],target:grain.px,duration:end+8,
      reach:age=>({point:aim(age),angle:age<pinch+2?-95:-60,weight:curve(age,[[0,0],[T-2,0],[T+8,1],[pinch+2,1],[lift,.9],[H,.6],[put-2,1],[put+4,1],[end,0]])}),
      sample(age,{pose}){
        // Ticks below are hers, and proposed acting: a weary first look, a dip
        // she has done a hundred times, a close inspection, a small tsk.
        const look=curve(age,[[0,0],[6,1],[T,1],[pinch,1],[lift,.2],[H,0]]);
        const dip=curve(age,[[T-2,0],[T+7,first?236:226,'f'],[pinch+2,240],[pinch+13,0]]);
        const inspect=curve(age,[[pinch+6,0],[lift-2,1],[lift+6,1],[back.start+4,0]]);
        const sigh=curve(age,[[0,0],[5,1],[11,0]]);
        return {gaze:mix(pose.gaze,.9*look,look)-inspect*.2,yaw:mix(pose.yaw,.4*look,look),pitch:mix(pose.pitch,.8,look)-inspect*.3,
          head:pose.head-4*look+5*inspect,spine:pose.spine-4*smooth(dip/240),bob:pose.bob+dip+sigh*-3,
          browL:pose.browL-5*look-4*inspect,browR:pose.browR-7*look+6*inspect,smile:mix(pose.smile,-.3,look)+inspect*.15,
          uarmL:pose.uarmL+8*smooth(dip/240),farmL:pose.farmL,handL:pose.handL,
          uarmR:pose.uarmR,farmR:pose.farmR,handR:pose.handR,pelvis:pose.pelvis,fRy:pose.fRy};
      }});
    if(!ok)return false;
    glean={id,start,grain,pinch,lift,put,end,reason,taken:false};host.consequence('rice-glean-start',{request:id,point:grain.position,reason});
    return true;
  }
  function stopGlean(reason){
    if(!glean)return;
    if(held){
      // A startled hand lets go. The grain falls from where the hand really is.
      const g=body(host.frame('hand.R').position,[(rng()-.5)*.4,.2,0],'dropped');held=null;
      host.consequence('rice-dropped',{point:g.position,reason});
    }
    if(glean.grain.claimed===glean.id)glean.grain.claimed=null;
    host.cancelPerformance(glean.id);glean=null;quietSince=host.tick;
  }

  return {id:'rice',layers:[SLOT],
    get grains(){return grains;},
    spill({position,velocity,amount}){
      const n=Math.min(amount,bowl);bowl-=n;scatter(position,velocity,n,'bowl');
      host.consequence('rice-spill',{amount:n,source:'bowl',point:[...position],bowl});quietSince=host.tick;return true;
    },
    targets:{
      'rice-heap':{control:'rice',priority:14,point:()=>HEAP,
        hit:(x,y)=>heap>0&&x>=402&&x<=470&&y>=706&&y<=742,interact:({point})=>({kind:'rice-knock',point})},
      'rice-floor':{priority:9,point:()=>loose()[0]?.px??[600,900],
        hit:(x,y)=>loose().some(g=>Math.hypot(g.px[0]-x,g.px[1]-y)<14),interact:({point})=>({kind:'rice-glean',point})},
    },
    intents:{
      'rice-knock'(intent){
        if(heap<=0)return false;
        knocks=host.tick-lastKnock<90?knocks+1:1;lastKnock=host.tick;
        const n=Math.min(heap,knocks>=3?3:knocks===2?2:1);heap-=n;
        const edge=p.atDepth([458,736],HEAP_DEPTH-.3);
        scatter(edge,[.5,.4,.35],n,'heap');
        host.consequence('rice-knock',{amount:n,heap,knocks,point:edge});
        notice(intent.id,knocks>=2?'again':'first');return true;
      },
      'rice-glean'(intent){
        const [x,y]=intent.point??[];if(!Number.isFinite(x)||!Number.isFinite(y))return false;
        const g=loose().filter(g=>!g.claimed).sort((a,b)=>Math.hypot(a.px[0]-x,a.px[1]-y)-Math.hypot(b.px[0]-x,b.px[1]-y))[0];
        if(!g||Math.hypot(g.px[0]-x,g.px[1]-y)>40)return false;
        if(glean)return false;
        return startGlean(g,'visitor');
      },
    },
    get request(){return glean?.id??null;},
    interrupt(intent){if(!glean||intent.request&&intent.request!==glean.id)return false;stopGlean('interrupted');return true;},
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','interrupt','water','wind','feed-frog'].includes(intent.kind)||intent.kind==='poke'&&intent.target==='saint'))){
        if(glean)stopGlean('called away');
        if(response){host.actor.cancel(SLOT,{id:response,fade:6});response=null;}
      }
      if(commands.some(({intent,accepted})=>accepted!==false&&intent.kind!=='pointer'))quietSince=tick;
    },
    onEvent(event){
      if(event.kind==='sack-rice-taken'&&!receipts.has(event.receipt)){
        // A taken handful is tipped onto the heap above, grain by grain.
        receipts.set(event.receipt,event.amount);
        const mouth=event.point??p.atDepth([386,770],9.2);
        for(let i=0;i<event.amount;i++)toss(mouth,[heapWorld[0]+(rng()-.5)*.25,heapWorld[1]+.02,heapWorld[2]],'sack',i*2);
      }
      if(event.kind==='sack-rice-returned'&&receipts.has(event.receipt)){
        const n=Math.min(event.amount,heap,receipts.get(event.receipt));heap-=n;receipts.set(event.receipt,receipts.get(event.receipt)-n);
      }
      if(event.kind==='sack-rice-spilled'){
        for(let i=0;i<event.amount;i++)body(p.atDepth(PATCH,p.depthAtFloor?.([PATCH[0],880])??9.2),[(rng()-.2)*.5,.3,.2],'sack');
      }
      if(event.kind==='resident-action-cancel'&&glean&&event.request===glean.id){
        if(held){const g=body(host.frame('hand.R').position,[0,.1,0],'dropped');held=null;host.consequence('rice-dropped',{point:g.position,reason:'cancelled'});}
        glean=null;quietSince=host.tick;
      }
    },
    afterPhysics(tick){
      for(let i=grains.length-1;i>=0;i--){
        const g=grains[i];
        if(g.place==='toss'){
          const u=clamp((tick-g.start)/g.length,0,1);
          g.position=g.from.map((v,k)=>mix(v,g.to[k],u)+(k===1?Math.sin(Math.PI*u)*.35:0));
          if(u>=1){grains.splice(i,1);heap++;host.consequence('rice-heap-land',{point:[...g.to],heap});}
          continue;
        }
        if(g.place==='air'){
          const wasMoving=!g.settled,vy=-g.velocity[1];
          if(fallStep(g))host.consequence('rice-grain-land',{point:[...g.position],speed:vy});
          if(wasMoving&&g.settled){
            g.place='floor';g.px=inField(p.project(g.position));g.v=[0,0];
            const px=p.project(g.position.map((v,k)=>v+(k===1?0:g.velocity[k]*.04)));
            g.v=[(px[0]-g.px[0])*.6,(px[1]-g.px[1])*.6];
          }
          continue;
        }
        if(g.place==='floor'&&!g.rest&&!(glean&&g.claimed===glean.id)){
          // Roll down the painted ground; friction holds it once the slope is shallow.
          const [sx,sy]=slope(...g.px);g.v=[g.v[0]*.82-sx*14,g.v[1]*.82-sy*14];
          g.px=inField([g.px[0]+g.v[0],g.px[1]+g.v[1]]);
          g.position=p.onPlane(g.px,p.floor);
          if(Math.hypot(...g.v)<.04&&Math.hypot(sx,sy)<.012||tick-g.born>480)g.rest=true;
        }
      }
      if(held)held.position=[...host.frame('hand.R').position];
      if(glean){
        const age=tick-glean.start,g=glean.grain;
        if(age===glean.pinch){
          const hand=host.frame('hand.R').screen,error=Math.hypot(hand[0]-g.px[0],hand[1]-g.px[1]);
          if(error<16&&grains.includes(g)){
            grains.splice(grains.indexOf(g),1);held=g;g.place='hand';glean.taken=true;
            host.consequence('rice-pinch',{request:glean.id,point:[...g.position],error});
          }else{missed++;g.unreachable=true;host.consequence('rice-glean-missed',{request:glean.id,error});stopGlean('missed');}
        }
        if(glean&&age===glean.put&&held){
          // Back into the offering; a full bowl overflows onto the heap.
          const into=bowl<BOWL_FULL?'bowl':'heap',from=[...held.position];held=null;gleaned++;
          if(into==='bowl')bowl++;else{const t=toss(from,[heapWorld[0],heapWorld[1]+.02,heapWorld[2]],'glean');t.length=6;}
          host.consequence('rice-gleaned',{request:glean.id,into,bowl,heap,gleaned,point:from});
        }
        // Once she has started she keeps at it: the next grain follows after a breath.
        if(glean&&age>=glean.end){glean=null;quietSince=tick-68;}
      }
      // She will not leave rice on the ground for long when nothing else asks for her.
      if(!glean&&tick-quietSince>=96&&!host.action&&!host.request){
        const root=p.project(host.frame('root').position);
        // Her right hand works from a stand 140 px to the left; keep that stand on the public stage.
        const reachable=loose().filter(g=>!g.claimed&&!g.unreachable&&g.px[0]>=410&&g.px[0]<1000&&g.px[1]>800);
        const next=reachable.sort((a,b)=>Math.abs(a.px[0]-root[0])-Math.abs(b.px[0]-root[0]))[0];
        if(next&&startGlean(next,'habit'))next.claimed=glean.id;else quietSince=tick-60;
      }
    },
    frames:{'rice.heap':()=>heapWorld},
    get state(){
      const floor=grains.filter(g=>g.place==='floor'||g.place==='air').length,tossing=grains.filter(g=>g.place==='toss').length;
      return {heap,bowl,floor,tossing,held:held?1:0,eaten:{...eaten},gleaned,missed,knocks,
        total:heap+bowl+floor+tossing+(held?1:0)+eaten.frog+eaten.bird,glean:glean&&{id:glean.id,age:host.tick-glean.start,taken:glean.taken},
        grains:grains.map(g=>({id:g.id,place:g.place,rest:g.rest,px:g.px&&[...g.px],position:[...g.position]}))};
    },
    speech:{command({intent},tick,director){if(intent.kind.startsWith('rice-')&&'lastClick' in director)director.lastClick=tick;}},
    mount({THREE,objects,own,cards}){
      // The heap is its own painted card (the plate under it is clean wood), so
      // its volume can follow the count: linear size goes as the cube root.
      const card=cards?.get('rice'),base=p.atDepth([436,740],HEAP_DEPTH);
      // One instanced draw for every grain, however long the session runs.
      const geometry=own(new THREE.SphereGeometry(.016,6,4));geometry.scale(1.8,.8,.9);
      const material=own(new THREE.MeshBasicMaterial({color:0xf4ecd6}));
      const mesh=new THREE.InstancedMesh(geometry,material,256);mesh.castShadow=true;mesh.frustumCulled=false;mesh.name='rice';objects.add(mesh);
      const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),one=new THREE.Vector3(1,1,1),at=new THREE.Vector3();
      return {update(){
        const list=held?[...grains,held]:grains;let n=0;
        for(const g of list){if(n>=256)break;e.set(0,g.turn,g.place==='air'?host.tick*.4:0);q.setFromEuler(e);at.fromArray(g.position);m.compose(at,q,one);mesh.setMatrixAt(n++,m);}
        mesh.count=n;mesh.instanceMatrix.needsUpdate=true;
        if(card){const k=heap>0?clamp(Math.cbrt(heap/START.heap),.35,1.35):0;card.visible=k>0;
          card.scale.setScalar(k||1);card.position.set(base[0]*(1-k),base[1]*(1-k),base[2]*(1-k));}
      },dispose(){objects.remove(mesh);}};
    },
  };
}
