import { clamp, mix, smooth } from '../../../../src/math.js';
import { curve, hops, hopAt } from '../keys.js';
import { mountBoard } from './board-paint.js';

// Hole zero is the painting's starting position, not an assertion about her
// campaign tally. Two new, distinct deeds reach the third physical hole.
export const BOARD_HOLES = [[1104,500],[1156,499],[1200,498]];
const DEPTH=10.3, SLOT='board.notice';
const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const holeAt=point=>BOARD_HOLES.reduce((best,p,i)=>near(p,point)<near(BOARD_HOLES[best],point)?i:best,0);
const validPoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);

/** An honest ledger and a movable piece of brass are different things. */
export function board(host){
  const deeds=new Set();
  let earned=0,seated=0,held=false,drag=null,flight=null,correction=null,retreat=null,homeDue=null;
  let listening=null,lastListen=-1000,heardFrog=-1000,keepView=false;
  let peg={x:1104,y:500,lift:0,angle:0},velocity={x:0,y:0,lift:0},aim={...peg};
  let touches=0,cheats=0,due=null,noticed=-1000,lastTouch=-1000,lastSeat=-1000;
  let unlocked=false,open=0,openedAt=-1,plays=0,pan={from:0,to:0,start:0};
  const reeds=[0,1,2].map(()=>({angle:0,velocity:0,lastSound:-1000}));
  const truth=()=>Math.min(2,earned);
  const point=()=>host.p.atDepth([peg.x,peg.y-peg.lift],DEPTH);
  const panAmount=()=>mix(pan.from,pan.to,smooth((host.tick-pan.start)/12));
  function frame(open){const to=open?1:0;if(to!==pan.to)pan={from:panAmount(),to,start:host.tick};}
  function cancelCorrection(takeover=false){
    if(!correction)return;
    const previous=correction;correction=null;
    host.cancelPerformance(previous.id);homeDue=host.tick+18;
    if(previous.grabbed&&!previous.placed&&!takeover){
      host.consequence('board-release',{point:point(),velocity:[velocity.x,velocity.y].map(v=>v*24),units:'painting-pixels/second'});
      travel(truth(),'released',26);
    }
  }
  function goHome(){
    const from=host.frame('root').position,home=host.p.onPlane(host.config.saint.feet,host.p.floor);
    if(near(host.p.project(from),host.p.project(home))<3&&from[1]<.001){homeDue=null;if(keepView){keepView=false;frame(false);}return;}
    if(host.action||from[1]>.001||held)return;
    const plan=hops(5,[...from],home,near(host.p.project(from),host.p.project(home))),id=`board.return:${host.tick}`;
    if(host.perform({id,owner:'board.return',plan:[plan],target:host.config.saint.feet,duration:plan.end+8,
      sample(age,{pose}){return {uarmR:pose.uarmR,farmR:pose.farmR,handR:pose.handR,uarmL:pose.uarmL,farmL:pose.farmL,handL:pose.handL,
        spine:pose.spine,head:pose.head,bob:pose.bob,pelvis:pose.pelvis,fRy:pose.fRy,pitch:pose.pitch,gaze:pose.gaze,yaw:pose.yaw,browL:pose.browL,browR:pose.browR,smile:pose.smile};}})){
      retreat={id,start:host.tick};homeDue=null;
    }
  }
  function listen(reed){
    if(host.action||host.tick-lastListen<120)return;
    lastListen=host.tick;heardFrog=-1000;listening={start:host.tick,reed};
    const start=host.tick;
    host.actor.drive(SLOT,{duration:86,keys:['gaze','yaw','pitch','head','spine','bob','farmL','browL','browR','smile'],
      sample(age,{pose}){
        const w=curve(age,[[0,0],[8,1],[66,1],[86,0]]);
        const reply=heardFrog>=start?curve(age,[[0,0],[22,0],[33,1],[47,1],[60,0]]):0;
        const look=curve(age,[[0,1],[48,1],[61,0],[72,0],[86,1]])-reply*1.65;
        const breath=curve(age,[[0,0],[16,-3],[34,1],[54,0]]);
        return {gaze:mix(pose.gaze,look,w),yaw:mix(pose.yaw,look*.58,w),pitch:mix(pose.pitch,.06+reply*.22,w),
          head:pose.head+w*(4-reply*6),spine:pose.spine+breath*.28,bob:pose.bob+breath,
          farmL:pose.farmL-breath*1.3,browL:pose.browL-w*2,browR:pose.browR+w,smile:mix(pose.smile,.08,w)};
      }},{id:`board.listen:${start}`,fade:3,release:6});
    host.consequence('board-listen',{reed,point:point()});
  }
  function pluck(index){
    const reed=reeds[index],previous=reed.velocity;
    reed.velocity=Math.min(.22,previous+.16);
    host.consequence('board-pluck',{reed:index,point:host.p.atDepth([BOARD_HOLES[index][0],572],DEPTH),
      speed:Math.abs(reed.velocity-previous)*24,units:'radians/second'});
  }
  function notice(credit=false){
    noticed=host.tick;
    host.actor.drive(SLOT,{duration:72,keys:['gaze','yaw','pitch','head','spine','browR','browL','farmR','smile'],
      sample(age,{pose}){
        const own=curve(age,[[0,0],[7,1],[53,1],[72,0]]);
        const look=curve(age,[[0,1],[18,1],[27,0],[43,0],[53,1],[72,1]]);
        return {gaze:mix(pose.gaze,look,own),yaw:mix(pose.yaw,look*.64,own),pitch:mix(pose.pitch,credit?curve(age,[[0,0],[16,0],[22,.12],[30,0]]):0,own),
          head:pose.head+own*(look*3-1),spine:pose.spine+own*1.5,
          browR:pose.browR-own*(credit?2:7+Math.min(cheats,3)*2),browL:pose.browL-own*2,
          farmR:pose.farmR-own*6,smile:mix(pose.smile,credit?.12:-.4,own)};
      }},{id:`board.look:${host.tick}`,fade:3,release:6});
  }
  function lift(){
    cancelCorrection(true);flight=null;held=true;seated=null;due=null;touches++;lastTouch=host.tick;frame(true);
    aim={...peg,lift:13};notice();
    host.consequence('board-pull',{point:point(),material:'brass-on-wood',hole:holeAt([peg.x,peg.y]),touches});
  }
  function travel(to,reason,duration=22){
    held=false;drag=null;seated=null;
    flight={from:{...peg},velocity:{...velocity},to,start:host.tick,duration,reason};
  }
  function seat(index,reason,speed){
    seated=index;flight=null;peg={x:BOARD_HOLES[index][0],y:BOARD_HOLES[index][1],lift:0,angle:0};
    aim={...peg};velocity={x:0,y:0,lift:0};lastSeat=host.tick;
    host.consequence('board-seat',{point:point(),hole:index,earned,reason,speed,units:'painting-pixels/second',material:'brass-on-wood'});
    if(index!==truth()){
      cheats++;due=host.tick+Math.max(26,62-cheats*9);notice();
      host.consequence('board-false-tally',{hole:index,earned,attempt:cheats,point:point()});
    }else{
      due=null;
      if(index===2&&earned>=2&&!unlocked){
        unlocked=true;openedAt=host.tick;notice(true);
        host.consequence('board-unlatched',{point:point(),earned});
      }
    }
  }
  function award(event){
    // A receipt identifies a completed world action, not the delivery attempt.
    // Both fields are required so independent lanes can use local receipt IDs.
    if(typeof event.source!=='string'||!event.source.trim()||typeof event.deed!=='string'||!event.deed.trim())return false;
    const receipt=JSON.stringify([event.source,event.deed]);
    if(deeds.has(receipt))return false;
    deeds.add(receipt);earned++;
    host.consequence('board-earned',{source:event.source,deed:event.deed,earned,hole:truth(),point:point()});
    cancelCorrection();due=null;
    // Never snatch it out of the visitor's hand. Its destination is recomputed
    // on release, and an already moving peg can be redirected without a jump.
    if(!held)travel(truth(),'earned',32);
    notice(true);return true;
  }
  function correct(){
    const from=[...host.frame('root').position];if(from[1]>.001)return;
    const grabbed=[peg.x,peg.y],index=truth(),end=BOARD_HOLES[index];
    const standAt=x=>{const p=host.p.atDepth([x-140,0],8.8);p[1]=0;return p;};
    const destination=standAt(grabbed[0]),placed=standAt(end[0]);
    const repeat=cheats>=2,waiting=cheats>=4;
    const go=hops(repeat?24:10,from,destination,near(host.p.project(from),host.p.project(destination)));
    const hesitate=waiting?32:repeat?20:0,take=go.end+20+hesitate;
    const carry=hops(take+12,destination,placed,Math.abs(end[0]-grabbed[0]));
    const put=carry.end+16,press=put+6,home=host.p.onPlane(host.config.saint.feet,host.p.floor);
    const back=hops(put+40,placed,home,near(host.p.project(placed),host.p.project(home)));
    const id=`board.correct:${host.tick}`,start=host.tick;
    const hand=age=>age<=take?grabbed:age<carry.start?[grabbed[0]-8*smooth((age-take)/9),grabbed[1]+8*smooth((age-take)/9)]:
      [host.p.project(hopAt(carry,age).position)[0]+140,end[1]+8*(1-smooth((age-carry.end)/(put-carry.end)))];
    const reachKeys=[[0,0],[go.end,0],...(repeat?[[go.end+8,.8],[go.end+14,.24],[take-9,.24]]:[]),
      [take-2,1],[take+9,1],[carry.start,0],[carry.end,0],[put,1],[press+4,1],[put+23,0]];
    const accepted=host.perform({id,owner:'board',plan:[go,carry,back],target:grabbed,duration:back.end+10,
      reach:age=>({point:hand(age),angle:225,weight:curve(age,reachKeys)}),
      sample(age,{pose}){
        const look=curve(age,[[0,0],[7,repeat?0:1],[go.start,1],...(repeat?[[go.end+9,1],[go.end+16,0],[take-9,0],[take-3,1]]:[]),[put+28,1],[back.start,0]]);
        const work=curve(age,[[0,0],[go.end,1],[put+25,1],[back.start,0]]),withdraw=smooth((age-put-12)/13);
        const arm=key=>mix(correction?.carryPose?.[key]??pose[key],pose[key],withdraw);
        const pressure=curve(age,[[put-3,0],[press,1],[press+4,1],[put+18,0]]);
        return {gaze:look,yaw:look*.55,pitch:pose.pitch,head:mix(pose.head,-10,work)+pressure,spine:mix(pose.spine,-5,work)+pressure*2,
          browR:pose.browR-look*10,browL:pose.browL-look*3,smile:-.35,
          uarmR:arm('uarmR'),farmR:arm('farmR'),handR:arm('handR'),uarmL:pose.uarmL+work*5,farmL:pose.farmL-work*8-pressure*3,handL:pose.handL,
          bob:pose.bob,pelvis:pose.pelvis,fRy:pose.fRy};
      }});
    if(accepted){correction={id,start,take,put,press,waitAt:repeat?go.end+14:null,index,hand,grabbed:false,placed:false};due=null;homeDue=null;}
  }
  return {id:'board',layers:[SLOT],art:[{id:'board',depth:DEPTH}],
    targets:{board:{control:'board',priority:12,point:()=>held?BOARD_HOLES[(holeAt([peg.x,peg.y])+1)%3]:[peg.x,peg.y],
      hit:(x,y)=>x>=1071&&x<=1249&&y>=456&&y<=544+open*49||near([x,y],[peg.x,peg.y-peg.lift])<24,
      interact:({point})=>({kind:'board-touch',point}),
      key:key=>key==='ArrowDown'?{kind:'board-under'}:key==='ArrowLeft'||key==='ArrowRight'?{kind:'board-shift',direction:key==='ArrowLeft'?-1:1}:false,
      gesture:({phase,point})=>phase==='start'
        ? (!held&&near(point,[peg.x,peg.y-peg.lift])<25?{kind:'board-grab',point}:false)
        : {kind:`board-drag-${phase}`,point},
    }},
    intents:{
      'board-under'(){
        frame(true);lastTouch=host.tick;
        if(unlocked)pluck(plays++%3);
        else host.consequence('board-knock',{point:point(),material:'wood'});
        return true;
      },
      'board-shift'({direction}){
        if(direction!==-1&&direction!==1)return false;
        const index=(holeAt([peg.x,peg.y])+direction+3)%3;
        if(!held)lift();travel(index,'visitor');return true;
      },
      'board-touch'({point}){
        if(!validPoint(point))return false;
        lastTouch=host.tick;frame(true);
        if(held){travel(holeAt(point),'visitor');return true;}
        if(unlocked&&point[1]>540){
          pluck(holeAt(point));return true;
        }
        if(near(point,[peg.x,peg.y])<28){lift();return true;}
        notice();host.consequence('board-knock',{point:host.p.atDepth(point,DEPTH),material:'wood'});return true;
      },
      'board-grab'({point}){if(!validPoint(point)||held)return false;lift();drag={start:point,moved:false};return true;},
      'board-drag-move'({point}){
        if(!drag||!validPoint(point))return false;
        drag.moved ||= near(drag.start,point)>6;
        if(drag.moved)aim={x:clamp(point[0],1068,1248),y:clamp(point[1]+13,464,565),lift:13};
        lastTouch=host.tick;return true;
      },
      'board-drag-end'({point}){
        if(!drag||!validPoint(point))return false;
        const moved=drag.moved||near(drag.start,point)>6;drag=null;
        if(moved){const index=holeAt(point);travel(near(point,BOARD_HOLES[index])<48?index:truth(),'visitor');}
        return true;
      },
      'board-drag-cancel'(){if(!held)return false;travel(truth(),'cancel');return true;},
      'board-dismiss'(){keepView=false;frame(false);if(held)travel(truth(),'cancel');return true;},
      // External adapters send a recorded intent. Residents should emit the
      // identically shaped consequence only after their own completed action.
      'deed-happened'(intent){
        if(typeof intent.source!=='string'||!intent.source.trim()||typeof intent.deed!=='string'||!intent.deed.trim())return false;
        host.consequence('deed-happened',{source:intent.source,deed:intent.deed});return true;
      },
    },
    onEvent(event){
      if(event.kind==='deed-happened')award(event);
      if(event.kind==='board-chime'&&event.speed>.4)listen(event.reed);
      if(event.kind==='frog-heard-chime')heardFrog=host.tick;
    },
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','interrupt','notice','water','wind','feed-frog','waterfall-touch'].includes(intent.kind)||intent.kind==='poke'))){
        const wasBoard=!!correction||!!retreat;
        cancelCorrection();
        if(retreat){host.cancelPerformance(retreat.id);retreat=null;homeDue=tick+18;}
        host.actor.cancel(SLOT,{fade:6});listening=null;
        keepView=wasBoard&&pan.to===1&&!commands.some(({intent})=>['ring','offer','waterfall-touch'].includes(intent.kind));
        if(!keepView)frame(false);
        if(held)travel(truth(),'cancel');
        if(seated!==truth())due=tick+96;
      }
      if(correction&&host.action?.id!==correction.id){
        if(correction.placed){correction=null;}else cancelCorrection();
        if(seated!==truth()&&!flight)due=tick+96;
      }
      if(retreat&&host.action?.id!==retreat.id){retreat=null;homeDue=tick;}
      if(homeDue!==null&&tick>=homeDue)goHome();
      if(due!==null&&tick>=due&&!held&&!flight&&!host.action)correct();
      if(held&&tick-lastTouch>240)travel(truth(),'abandoned');
      if(tick-lastTouch>300&&!correction&&!keepView)frame(false);
    },
    afterPhysics(tick){
      const old={...peg};
      if(correction){
        const age=tick-correction.start;
        if(age===correction.waitAt)host.consequence('board-waiting-palm',{attempt:cheats,request:correction.id,point:point()});
        if(age===correction.take){
          const error=near(host.frame('hand.R').screen,[peg.x,peg.y]);
          if(error<3){
            correction.grabbed=true;seated=null;
            host.consequence('board-hand-contact',{point:point(),error,request:correction.id});
            host.consequence('board-pull',{point:point(),material:'brass-on-wood',by:'saint'});
          }else{
            host.consequence('board-contact-missed',{error});cancelCorrection();travel(truth(),'missed-pickup',28);due=null;
          }
        }
        if(correction?.grabbed&&!correction.placed){
          const p=host.frame('hand.R').screen;peg={x:p[0],y:p[1],lift:0,angle:0};
          velocity={x:peg.x-old.x,y:peg.y-old.y,lift:0};
          if(age===correction.take+9)correction.carryPose=Object.fromEntries(['uarmR','farmR','handR'].map(key=>[key,host.actor.pose[key]]));
          if(age>=correction.press){
            const error=near(p,BOARD_HOLES[correction.index]);
            if(error<3){correction.placed=true;seat(correction.index,'corrected',near([old.x,old.y],p)*24);}
            else if(age>correction.press+3){
              host.consequence('board-contact-missed',{error});cancelCorrection();travel(truth(),'return');
            }
          }
        }
      }else if(flight){
        const age=tick-flight.start,u=clamp(age/flight.duration,0,1),v=smooth(u),to=BOARD_HOLES[flight.to];
        peg={x:mix(flight.from.x,to[0],v),y:mix(flight.from.y,to[1],v),
          lift:mix(flight.from.lift,0,v)+12*Math.sin(Math.PI*u),angle:Math.sin(Math.PI*u)*-.14};
        if(flight.reason==='released'){
          // Preserve the last palm's momentum, then let the loose brass drop
          // into the ledger's return. This transition always has a finite end.
          const tail=u*(1-u)**2*flight.duration;
          peg.x+=clamp(flight.velocity.x,-8,8)*tail;
          peg.y+=clamp(flight.velocity.y,-6,6)*tail+18*Math.sin(Math.PI*u);
          peg.lift=0;peg.angle=.35*Math.sin(Math.PI*u);
        }
        if(u===1)seat(flight.to,flight.reason,Math.hypot(peg.x-old.x,peg.y-old.y,peg.lift-old.lift)*24);
      }else if(held){
        for(const key of ['x','y','lift']){velocity[key]=(velocity[key]+(aim[key]-peg[key])*.28)*.62;peg[key]+=velocity[key];}
        peg.angle=clamp(-velocity.x*.02,-.24,.24);
        const pullSpeed=Math.abs(peg.lift-old.lift)*24;
        if(pullSpeed>7)host.consequence('board-scrape',{point:point(),speed:pullSpeed,units:'painting-pixels/second',material:'brass-on-wood'});
        const speed=Math.hypot(peg.x-old.x,peg.y-old.y)*24;
        if(speed>15&&tick%5===0)host.consequence('board-brass-move',{point:point(),speed,units:'painting-pixels/second'});
      }
      if(unlocked){
        open=smooth((tick-openedAt-12)/28);
        reeds.forEach((reed,i)=>{
          if(tick===openedAt+36+i*9)reed.velocity=.14;
          const previous=reed.angle;reed.velocity=(reed.velocity-reed.angle*.055)*.977;reed.angle+=reed.velocity;
          if(Math.abs(reed.angle)<.0001&&Math.abs(reed.velocity)<.0001)reed.angle=reed.velocity=0;
          if(previous*reed.angle<0&&Math.abs(reed.velocity)>.014&&tick-reed.lastSound>10){
            reed.lastSound=tick;
            host.consequence('board-chime',{reed:i,speed:Math.abs(reed.velocity)*24,units:'radians/second',point:host.p.atDepth([BOARD_HOLES[i][0],572],DEPTH)});
          }
        });
      }
    },
    frames:{board:point,'board.peg':point},
    framing:()=>({bounds:[425,315,850,545],amount:panAmount(),open:pan.to===1,dismiss:{kind:'board-dismiss'},returnControl:'board'}),
    speech:{command({intent},tick,director){
      if(!intent.kind.startsWith('board-'))return;
      director.lastClick=tick;
      if(['board-touch','board-grab'].includes(intent.kind)){
        director.lookAt([peg.x,peg.y],tick);
        // "Almost" is a comment on meddling, never a false award announcement.
        if(!earned&&!cheats)director.ask('board',tick,10);
      }
    },event(event,tick,director){
      if(event.kind==='board-false-tally'){director.lookAt([peg.x,peg.y],tick);director.disapprove(tick,42);}
      if(event.kind==='board-earned'||event.kind==='board-unlatched')director.lookAt([peg.x,peg.y],tick);
    }},
    get state(){return {earned,receipts:[...deeds],seated,held,peg:{...peg},flight:flight&&structuredClone(flight),
      correction:correction&&{id:correction.id,start:correction.start,take:correction.take,put:correction.put,press:correction.press,grabbed:correction.grabbed,placed:correction.placed,waitAt:correction.waitAt},
      retreat:retreat&&{...retreat},homeDue,listening:listening&&{...listening},heardFrog,
      touches,cheats,due,noticed,lastSeat,unlocked,open,plays,reeds:structuredClone(reeds)};},
    mount:kit=>mountBoard(kit,{sample:()=>({peg,seated,open,reeds,lastSeat,tick:host.tick,
      carried:!!correction?.grabbed&&!correction.placed,
      grip:correction?curve(host.tick-correction.start,[[correction.take-5,0],[correction.take,1],[correction.put+13,1],[correction.put+23,0]]):0}),p:host.p}),
  };
}
