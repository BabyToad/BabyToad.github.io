import {curve} from '../keys.js';
import {clamp, smooth} from '../../../../src/math.js';
import {mountSack,sackPixel} from './sack-paint.js';

const SLOT='sack.notice',CAPACITY=96,CENTER=[385,818];
/** Rice units are a small authored inventory, not a claim about physical grain counts. */
export function sack(host){
  const def=host.config.occluders.find(x=>x.id==='sack'),depth=host.p.depthAtFloor(def.foot);
  const origin=host.p.atDepth(CENTER,depth),rng=host.random('sack');
  let remaining=CAPACITY,taken=0,spilled=0,open=false,opening=0,compression=0,velocity=0;
  let pokes=0,lastPoke=-1000,response=null,transfer=null,sequence=0,drag=null,particles=[];
  const receipts=new Map();
  const drawing=()=>({fill:remaining/CAPACITY,opening,compression,taking:transfer?smooth((host.tick-transfer.start)/12):0,takeAmount:transfer?.amount??0,particles});
  function paintedPoint(x,y){const q=sackPixel(x,y,drawing());return [330+q[0],752+q[1]];}
  function mouth(){return host.p.atDepth(paintedPoint(56,17),depth);}
  // Input regions follow the same sag/compression as the painted neck. Capture
  // the region at pointer-down so cloth motion during a held press cannot turn
  // a neck gesture into a take (or vice versa).
  const neck=point=>point[1]<paintedPoint(56,48)[1];
  function leave(){if(response)host.actor.cancel(SLOT,{id:response.id,fade:8});response=null;}
  function notice(id,kind){
    if(host.action||host.request&&host.request!==response?.id&&host.request!==transfer?.id||host.bowl.held)return;
    leave();response={id,start:host.tick,kind};
    host.actor.drive(SLOT,{keys:['gaze','yaw','pitch','head','spine','browR','uarmL','farmL'],duration:66,
      sample(age,{pose}){const a=curve(age,[[0,0],[8,1],[24,1],[42,.45],[66,0]]),guard=kind==='take'?1:kind==='empty'?.45:.25;
        return {gaze:pose.gaze+( -.75-pose.gaze)*a,yaw:pose.yaw+(-.5-pose.yaw)*a,pitch:pose.pitch+(.38-pose.pitch)*a,
          head:pose.head-4*a,spine:pose.spine-2*a,browR:pose.browR-(kind==='empty'?7:3)*a,
          uarmL:pose.uarmL-guard*12*a,farmL:pose.farmL+guard*18*a};
      }},{id,fade:3,release:8});
  }
  function grain(amount,at,reason){
    // The rice resident adopts spilled units as persistent grains; the sack keeps no witness of its own.
    host.consequence('sack-rice-spilled',{amount,remaining,reason,point:host.p.atDepth(at,depth),receipt:`sack:spill:${++sequence}`});
  }
  function poke(intent){
    pokes++;velocity=Math.max(-.08,velocity-.024);lastPoke=host.tick;
    host.consequence('sack-compress',{point:origin,strength:.024,pokes});
    if(pokes%3===0&&remaining>0){remaining--;spilled++;grain(1,[424,850],'patch');}
    if(!response||host.tick-response.start>24)notice(intent.id,'poke');return true;
  }
  function take(intent){
    if(!open||opening<.85||transfer)return false;
    if(!remaining){notice(intent.id,'empty');host.consequence('sack-empty',{point:origin});return true;}
    const amount=intent.amount===undefined?6:intent.amount;
    if(!Number.isInteger(amount)||amount<1||amount>12)return false;
    transfer={id:intent.id,start:host.tick,amount:Math.min(amount,remaining)};
    notice(intent.id,'take');return true;
  }
  function toggle(intent){
    open=!open;velocity-=.012;
    if(!open&&transfer){host.consequence('sack-take-cancelled',{request:transfer.id});transfer=null;}
    host.consequence(open?'sack-untie':'sack-tie',{point:mouth()});notice(intent.id,'tie');return true;
  }
  function returned(intent){
    const receipt=receipts.get(intent.receipt),amount=intent.amount;
    if(!receipt||!Number.isInteger(amount)||amount<1||amount>receipt.available)return false;
    receipt.available-=amount;remaining+=amount;taken-=amount;velocity-=.016;
    if(receipt.available===0)receipts.delete(intent.receipt);
    host.consequence('sack-rice-returned',{receipt:intent.receipt,amount,remaining,point:origin});return true;
  }
  function cancel(intent){
    if(!response&&!transfer||intent.request&&intent.request!==(response?.id??transfer?.id))return false;
    leave();if(transfer){host.consequence('sack-take-cancelled',{request:transfer.id});transfer=null;}return true;
  }
  return {id:'sack',layers:[SLOT],art:[{...def,castShadow:true}],
    targets:{sack:{control:'sack',point:()=>paintedPoint(56,85),priority:2,
      interact:({point})=>({kind:neck(point)?'sack-toggle':open?'sack-take':'sack-poke'}),
      gesture:({phase,point})=>({kind:'sack-gesture',phase,point}),
      key:key=>key==='ArrowUp'?{kind:'sack-toggle'}:key==='ArrowDown'?{kind:'sack-poke'}:key==='ArrowRight'?{kind:'sack-take',amount:1}:false},
      'sack-tie':{control:'sack-tie',interact:()=>({kind:'sack-toggle'})}},
    intents:{'sack-poke':poke,'sack-toggle':toggle,'sack-take':take,'sack-return':returned,
      'sack-gesture'(intent){
        const {phase,point}=intent;if(!['start','move','end','cancel'].includes(phase)||!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))return false;
        if(phase==='start'){drag={from:[...point],point:[...point],at:host.tick,neck:neck(point)};velocity-=.012;return true;}
        if(!drag)return false;drag.point=[...point];
        if(phase==='end'){const delta=point[1]-drag.from[1],top=drag.neck;drag=null;
          return Math.abs(delta)>15||top?toggle(intent):open?take(intent):poke(intent);}
        if(phase==='cancel'){drag=null;return true;}return true;
      }},
    get request(){return response?.id??transfer?.id??null;},interrupt:cancel,
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','water','wind','feed-frog'].includes(intent.kind)||intent.kind==='poke'&&intent.target==='saint'&&(!intent.action||intent.action===response?.id))))cancel({});
      if(response&&tick-response.start>=66)response=null;
      if(drag&&tick-drag.at>240)drag=null;
    },
    onEvent(event){if(event.kind==='scenic-focus')cancel({});},
    afterPhysics(tick){
      const goal=drag?-.035:0;velocity+=(goal-compression)*.18-velocity*.22;compression=clamp(compression+velocity,-.16,.09);
      if(Math.abs(velocity)<.00001&&Math.abs(compression-goal)<.00001){velocity=0;compression=goal;}
      opening+=(Number(open)-opening)*.18;if(Math.abs(opening-Number(open))<.001)opening=Number(open);
      if(transfer&&tick-transfer.start>=12){
        const amount=Math.min(transfer.amount,remaining);
        if(amount){const receipt=`sack:take:${++sequence}`;
          remaining-=amount;taken+=amount;receipts.set(receipt,{available:amount});
          host.consequence('sack-rice-taken',{receipt,request:transfer.id,amount,remaining,point:mouth()});
        }else host.consequence('sack-empty',{request:transfer.id,point:origin});
        velocity-=.025;transfer=null;
      }
      for(const g of particles){g.age++;if(g.y<879)g.vy+=.22;g.x+=g.vx;g.y+=g.vy;if(g.y>=879){
        if(g.vy>0)host.consequence('sack-grain-land',{point:host.p.atDepth([g.x,879],depth),speed:g.vy*24});
        g.y=879;g.vy=0;g.vx*=.65;}}
      particles=particles.filter(g=>g.age<240);
    },
    frames:{sack:()=>origin,'sack.mouth':mouth},
    get state(){return {remaining,taken,spilled,capacity:CAPACITY,open,opening,compression,pokes,lastPoke,transfer:transfer&&{...transfer},response:response&&{...response},particles:particles.map(g=>({...g}))};},
    speech:{command({intent},tick,director){if(intent.kind.startsWith('sack-'))director.lastClick=tick;}},
    mount(kit){return mountSack(kit,{depth,pose:drawing});},
  };
}
