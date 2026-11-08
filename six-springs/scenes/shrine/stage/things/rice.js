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
 * painted cracks. Her stomp throws them up and she catches them out of the air.
 * The sack's take and patch leak arrive here as receipts.
 */
const HEAP=[436,728], HEAP_DEPTH=11.2, START={heap:40,bowl:18}, BOWL_FULL=24;
const SLOT='rice.notice', PATCH=[424,850], RADIUS=190, POP_MAX=8, CATCH_MAX=6;
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
  let heap=START.heap,bowl=START.bowl,held=0,sequence=0;
  const eaten={frog:0,bird:0},grains=[],receipts=new Map();
  let gather=null,stomped=null,quietSince=0,lastKnock=-1000,knocks=0,response=null,gathered=0;

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
    if(host.action||host.request||host.bowl.held||gather)return;
    if(response)host.actor.cancel(SLOT,{id:response,fade:6});
    response=id;const at=p.project(heapWorld);
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','browL','browR','smile'],duration:60,
      sample(age,{pose}){const a=curve(age,[[0,0],[7,1],[30,1],[60,0]]),cross=kind==='again'?1:.4;
        const toward=clamp((at[0]-p.project(host.frame('root').position)[0])/140,-1,1);
        return {gaze:mix(pose.gaze,toward,a),yaw:mix(pose.yaw,toward*.6,a),pitch:mix(pose.pitch,.45,a),
          head:pose.head-3*a,browL:pose.browL-6*cross*a,browR:pose.browR-9*cross*a,smile:mix(pose.smile,-.4*cross,a)};}},
      {id,fade:4,release:8});
  }

  // Gathering, in her own vocabulary: the bowl's foot stamp throws nearby grains
  // up, they hang for a breath, and they fly to wherever her keyed palm really is.
  // The arm is never solved to the rice; the rice comes to the arm.
  const palm=()=>host.frame('hand.L').position;
  function standFor(seed){
    const depth=clamp(-seed.position[2],8.2,11.3),s=p.atDepth([clamp(seed.px[0]+70,290,1080),0],depth);s[1]=0;return s;
  }
  function startGather(seed,reason){
    if(gather||host.action||host.request||host.bowl.held||host.bowl.owner!=='stand')return false;
    const from=[...host.frame('root').position];if(from[1]>.001)return false;
    const near=standFor(seed),dist=(a,b)=>Math.hypot(...p.project(a).map((v,i)=>v-p.project(b)[i]));
    const chosen=loose().filter(g=>Math.hypot(g.px[0]-seed.px[0],g.px[1]-seed.px[1])<RADIUS)
      .sort((a,b)=>Math.hypot(a.px[0]-seed.px[0],a.px[1]-seed.px[1])-Math.hypot(b.px[0]-seed.px[0],b.px[1]-seed.px[1])).slice(0,POP_MAX);
    const caught=Math.min(chosen.length,CATCH_MAX);
    const go=hops(10,from,near,dist(from,near)),T=go.end,S=T+18,C0=S+14,Cend=C0+caught*3+5,F=Cend+10,end=F+22;
    const id=`rice.gather:${host.tick}`,initial={...host.actor.pose};
    const ok=host.perform({id,owner:'rice',plan:[go],target:seed.px,duration:end,
      sample(age){
        const look=curve(age,[[0,0],[6,1],[S,1],[C0-2,.5],[F,.9],[F+8,.9],[end,0]]);
        const out=(key,keys)=>mix(initial[key],curve(age,keys),smooth(age/6));
        return {
          // Knee up and hold, then all of it into the stone in two ticks.
          fRy:curve(age,[[T+2,0],[S-5,130,'f'],[S-2,140],[S,0,'i']]),
          bob:out('bob',[[T+1,0],[T+5,12],[S-5,-26,'f'],[S-2,-30],[S,44,'i'],[S+8,-10,'f'],[S+14,0],[F-3,10],[F+2,-8,'f'],[F+9,0]]),
          spine:curve(age,[[T+2,0],[S-5,5],[S-2,6],[S,-9,'i'],[S+9,3,'f'],[Cend,0],[F-3,4],[F+2,-5,'f'],[F+12,0]]),
          pelvis:curve(age,[[T+2,0],[S-5,4],[S-2,4],[S,-5,'i'],[S+10,0]]),
          head:curve(age,[[0,0],[6,-3],[S-2,-5],[S,4,'i'],[S+8,-2,'f'],[Cend,0],[F+2,-4,'f'],[end,0]]),
          pitch:mix(.65,-.3,curve(age,[[S,0],[S+7,1,'f'],[Cend,.7],[F,0]]))*look,
          gaze:-.8*look,yaw:-.5*look,
          // Positive raises her left arm outward; negative would pass behind her torso.
          uarmL:out('uarmL',[[T+2,0],[S-5,18],[S,4,'i'],[S+5,20],[C0-2,78,'f'],[Cend,40,'f'],[F-3,34],[F+2,72,'f'],[F+8,60],[end,0]]),
          farmL:out('farmL',[[T+2,0],[S-5,20],[S,6,'i'],[S+5,20],[C0-2,28,'f'],[Cend,62,'f'],[F-3,76],[F+2,-14,'f'],[F+8,-4],[end,0]]),
          handL:out('handL',[[S,0],[C0-2,-20],[Cend,30,'f'],[F-3,40],[F+2,-30,'f'],[F+8,-12],[end,0]]),
          // The other arm balances, half a beat late, as in her bowl work.
          uarmR:out('uarmR',[[T+2,0],[S-5,-22],[S,-4,'i'],[S+6,-26,'f'],[C0+4,-10],[F,-6],[F+4,-24,'f'],[end,0]]),
          farmR:out('farmR',[[T+2,0],[S-5,-24],[S,-6,'i'],[S+7,-28,'f'],[C0+6,-10],[F+1,-8],[F+5,-22,'f'],[end,0]]),
          handR:initial.handR,
          browL:curve(age,[[0,-3],[S,-6],[S+6,2,'f'],[Cend,0],[F+3,-2],[end,0]]),
          browR:curve(age,[[0,-7],[S,-10],[S+6,3,'f'],[Cend,0],[F+3,4],[end,0]]),
          smile:curve(age,[[0,-.25],[S+6,-.1],[F+4,.25],[end,0]]),
        };
      }});
    if(!ok)return false;
    for(const g of chosen)g.claimed=id;
    gather={id,start:host.tick,S,C0,Cend,F,end,chosen,caught,reason};
    host.consequence('rice-gather-start',{request:id,point:[...seed.position],amount:chosen.length,reason});
    return true;
  }
  function fallFrom(g){g.place='air';g.settled=false;g.rest=false;g.claimed=null;g.velocity=[(rng()-.5)*.5,.1,(rng()-.5)*.3];}
  function letGo(reason){
    if(!gather)return;
    for(const g of gather.chosen)if(g.place==='rise'||g.place==='home')fallFrom(g);else if(g.claimed===gather.id)g.claimed=null;
    if(held){const at=palm();for(let i=0;i<held;i++)body(at,[(rng()-.5)*.8,.3,(rng()-.5)*.3],'dropped');host.consequence('rice-dropped',{point:[...at],amount:held,reason});held=0;}
  }
  function stopGather(reason){
    if(!gather)return;
    letGo(reason);host.cancelPerformance(gather.id);gather=null;quietSince=host.tick;
  }
  const tossed=into=>grains.filter(g=>g.place==='toss'&&g.into===into).length;
  function stepGather(tick){
    const r=gather,age=tick-r.start;
    if(age===r.S){
      const root=p.project(host.frame('root').position),depth=-host.frame('root').position[2],stomp=[...host.frame('root').position];
      host.consequence('rice-stomp',{request:r.id,point:stomp,amount:r.chosen.length});
      stomped={tick,point:stomp};
      r.chosen.forEach(g=>{
        // The shock travels: nearer grains leave the stone first.
        const away=Math.hypot(g.px[0]-root[0],g.px[1]-root[1]);
        const hang=p.atDepth([mix(g.px[0],root[0]-100,.45)+(rng()-.5)*60,root[1]-175-rng()*135],mix(-g.position[2],depth,.6));
        g.place='rise';g.settled=false;g.rest=false;g.from=[...g.position];g.hang=hang;g.popAt=tick+Math.min(3,Math.floor(away/70));g.phase=rng()*6.3;
      });
    }
    r.chosen.forEach((g,i)=>{
      if(g.place==='rise'){
        const u=clamp((tick-g.popAt)/9,0,1),e=1-(1-u)**3;
        g.position=g.from.map((v,k)=>mix(v,g.hang[k],e));
        if(u>=1)g.position[1]+=Math.sin((tick+g.phase*10)/5)*.012;
        if(i<r.caught&&age===r.C0+i*3){g.place='home';g.homeFrom=[...g.position];g.homeStart=tick;}
        else if(i>=r.caught&&age===r.Cend)fallFrom(g);
      }else if(g.place==='home'){
        const at=palm(),u=clamp((tick-g.homeStart)/5,0,1),e=u*u;
        g.position=g.homeFrom.map((v,k)=>mix(v,at[k],e));
        if(u>=1){grains.splice(grains.indexOf(g),1);g.place='hand';held++;host.consequence('rice-catch',{request:r.id,point:[...at],held});}
      }
    });
    if(age>=r.F+2&&(age-r.F-2)%2===0&&held>0){
      const into=bowl+tossed('bowl')<BOWL_FULL?'bowl':'heap',to=into==='bowl'?host.bowl.position:heapWorld,at=palm();
      held--;gathered++;
      const t=toss(at,[to[0]+(rng()-.5)*.14,to[1]+.1,to[2]],'gather');t.into=into;t.length=13+Math.floor(rng()*4);
      if(!held)host.consequence('rice-flick',{request:r.id,point:[...at],bowl,heap});
    }
    if(age>=r.end){gather=null;quietSince=tick-68;}
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
        hit:(x,y)=>loose().some(g=>Math.hypot(g.px[0]-x,g.px[1]-y)<14),interact:({point})=>({kind:'rice-gather',point})},
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
      'rice-gather'(intent){
        const [x,y]=intent.point??[];if(!Number.isFinite(x)||!Number.isFinite(y))return false;
        const g=loose().filter(g=>!g.claimed).sort((a,b)=>Math.hypot(a.px[0]-x,a.px[1]-y)-Math.hypot(b.px[0]-x,b.px[1]-y))[0];
        if(!g||Math.hypot(g.px[0]-x,g.px[1]-y)>40)return false;
        if(gather)return false;
        return startGather(g,'visitor');
      },
    },
    get request(){return gather?.id??null;},
    interrupt(intent){if(!gather||intent.request&&intent.request!==gather.id)return false;stopGather('interrupted');return true;},
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','interrupt','water','wind','feed-frog'].includes(intent.kind)||intent.kind==='poke'&&intent.target==='saint'))){
        if(gather)stopGather('called away');
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
      if(event.kind==='resident-action-cancel'&&gather&&event.request===gather.id){letGo('cancelled');gather=null;quietSince=host.tick;}
    },
    afterPhysics(tick){
      for(let i=grains.length-1;i>=0;i--){
        const g=grains[i];
        if(g.place==='toss'){
          const u=clamp((tick-g.start)/g.length,0,1);
          g.position=g.from.map((v,k)=>mix(v,g.to[k],u)+(k===1?Math.sin(Math.PI*u)*.35:0));
          if(u>=1){grains.splice(i,1);if(g.into==='bowl')bowl++;else heap++;host.consequence(g.into==='bowl'?'rice-bowl-land':'rice-heap-land',{point:[...g.to],heap,bowl});}
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
        if(g.place==='floor'&&!g.rest){
          // Roll down the painted ground; friction holds it once the slope is shallow.
          const [sx,sy]=slope(...g.px);g.v=[g.v[0]*.82-sx*14,g.v[1]*.82-sy*14];
          g.px=inField([g.px[0]+g.v[0],g.px[1]+g.v[1]]);
          g.position=p.onPlane(g.px,p.floor);
          if(Math.hypot(...g.v)<.04&&Math.hypot(sx,sy)<.012||tick-g.born>480)g.rest=true;
        }
      }
      if(gather)stepGather(tick);
      // She will not leave rice on the ground for long when nothing else asks for her.
      if(!gather&&tick-quietSince>=96&&!host.action&&!host.request&&host.bowl.owner==='stand'){
        const root=p.project(host.frame('root').position);
        const next=loose().filter(g=>g.px[0]>=240&&g.px[0]<1010&&g.px[1]>800).sort((a,b)=>Math.abs(a.px[0]-root[0])-Math.abs(b.px[0]-root[0]))[0];
        if(next){if(!startGather(next,'habit'))quietSince=tick-60;}
        else{
          const from=[...host.frame('root').position],home=p.onPlane(host.config.saint.feet,p.floor);
          if(Math.hypot(from[0]-home[0],from[2]-home[2])>.05&&from[1]<=.001){
            const plan=hops(4,from,home,Math.hypot(...p.project(from).map((v,i)=>v-p.project(home)[i])));
            host.perform({id:`rice.home:${tick}`,owner:'rice.home',plan:[plan],target:host.config.saint.feet,duration:plan.end+6,sample:()=>({})});
          }
          quietSince=tick;
        }
      }
    },
    frames:{'rice.heap':()=>heapWorld},
    get state(){
      const floor=grains.filter(g=>['floor','air','rise','home'].includes(g.place)).length,tossing=grains.filter(g=>g.place==='toss').length;
      return {heap,bowl,floor,tossing,held,eaten:{...eaten},gathered,knocks,
        total:heap+bowl+floor+tossing+held+eaten.frog+eaten.bird,gather:gather&&{id:gather.id,age:host.tick-gather.start,S:gather.S,C0:gather.C0,F:gather.F,end:gather.end,amount:gather.chosen.length},
        grains:grains.map(g=>({id:g.id,place:g.place,rest:g.rest,px:g.px&&[...g.px],position:[...g.position]}))};
    },
    speech:{command({intent},tick,director){if(intent.kind.startsWith('rice-')&&'lastClick' in director)director.lastClick=tick;}},
    mount({THREE,objects,own,cards,cutGeometry,basic}){
      // The heap is its own painted card (the plate under it is clean wood), so
      // its volume can follow the count: linear size goes as the cube root.
      const card=cards?.get('rice'),base=p.atDepth([436,740],HEAP_DEPTH);
      // Two instanced draws however long the session runs: an ink hull behind each
      // cream grain, so rice shares her outline and reads against any ground.
      const geometry=own(new THREE.SphereGeometry(.016,6,4));geometry.scale(1.8,.8,.9);
      const inkGeometry=own(new THREE.SphereGeometry(.016,6,4));inkGeometry.scale(2.5,1.4,.9);
      const mesh=new THREE.InstancedMesh(geometry,own(new THREE.MeshBasicMaterial({color:0xf8f1dc})),256);
      const ink=new THREE.InstancedMesh(inkGeometry,own(new THREE.MeshBasicMaterial({color:0x000000})),256);
      mesh.castShadow=true;mesh.frustumCulled=ink.frustumCulled=false;mesh.name='rice';ink.name='rice-ink';objects.add(ink,mesh);
      const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),size=new THREE.Vector3(),at=new THREE.Vector3();
      // Her stomp: inked dust puffs on a little card at her feet, drawn only while they last.
      const dustCanvas=document.createElement('canvas');dustCanvas.width=dustCanvas.height=512;
      const dc=dustCanvas.getContext('2d'),dustMap=own(new THREE.CanvasTexture(dustCanvas));dustMap.colorSpace=THREE.SRGBColorSpace;
      const DUST=256,dust=new THREE.Mesh(cutGeometry([-DUST/2,-DUST/2,DUST,DUST],10),basic(dustMap,{transparent:true,alphaTest:.02,depthWrite:false}));
      const zero=p.atDepth([0,0],10);dust.geometry.translate(...zero.map(v=>-v));dust.visible=false;dust.name='rice-dust';objects.add(dust);
      const PUFFS=[[-1,.2,1],[-.55,.5,.8],[.55,.5,.8],[1,.2,1],[-.2,.75,.6],[.25,.72,.55]];
      return {update(tick){
        let n=0;
        for(const g of grains){
          if(n>=256)break;
          const air=g.place!=='floor',big=air?2.1:1,rising=g.place==='rise'?clamp(1-(tick-g.popAt)/5,0,1):0;
          e.set(0,g.turn,air?(rising?Math.PI/2:tick*.4+g.turn):0);q.setFromEuler(e);at.fromArray(g.position);
          size.set(big*(1+rising*1.4),big,big);m.compose(at,q,size);mesh.setMatrixAt(n,m);
          at.z-=.03;m.compose(at,q,size);ink.setMatrixAt(n,m);n++;
        }
        mesh.count=ink.count=n;mesh.instanceMatrix.needsUpdate=ink.instanceMatrix.needsUpdate=true;
        if(card){const k=heap>0?clamp(Math.cbrt(heap/START.heap),.35,1.35):0;card.visible=k>0;
          card.scale.setScalar(k||1);card.position.set(base[0]*(1-k),base[1]*(1-k),base[2]*(1-k));}
        const age=stomped?tick-stomped.tick:99,live=age>=0&&age<13;
        dust.visible=live;
        if(live){
          const u=age/13,S=512/DUST,feet=p.project(stomped.point),scale=(-stomped.point[2])/10;
          dust.position.fromArray(p.atDepth(feet,-stomped.point[2]-.15));dust.scale.setScalar(scale);
          dc.setTransform(1,0,0,1,0,0);dc.clearRect(0,0,512,512);dc.setTransform(S,0,0,S,256,256);
          for(const [x,y,r] of PUFFS){
            const reach=1-(1-u)**2,cx=x*(34+74*reach),cy=-y*(6+34*reach)+6,rad=r*(16+4*Math.sin(u*3))*(1-u*u);
            if(rad<1.5)continue;
            dc.beginPath();dc.arc(cx,cy,rad,0,Math.PI*2);dc.arc(cx+rad*.8,cy-rad*.2,rad*.7,0,Math.PI*2);
            dc.lineWidth=4;dc.strokeStyle='#000';dc.stroke();dc.fillStyle='#e6d6b4';dc.fill();
          }
          dustMap.needsUpdate=true;
        }
      },dispose(){objects.remove(mesh,ink,dust);}};
    },
  };
}
