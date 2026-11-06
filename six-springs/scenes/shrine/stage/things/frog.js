import { clamp, mix, smooth } from '../../../../src/math.js';
import { EATING } from '../../../../src/speech/eating.js';
import { curve } from '../keys.js';
import { frogPixel, mountFrog } from './frog-paint.js';

const TASTE=9,SWALLOW=TASTE+EATING.gone;
/** One clock, planted feet, private patience. Drawing only samples this animal. */
export function frog(host) {
  const {config,p}=host,def=config.occluders.find(x=>x.id==='frog');
  const foot=p.onPlane(def.foot,p.floor),rng=host.random('frog');
  let run=null,x=0,patience=0,lastTouch=-1000,touchAt=-1000,touchSide=1;
  let flinch=-1000,flinchStrength=0,flinchKind='bell',flinchDirection=1,lastEscape=-1000,lastBowlVY=0,previousHeight=0;
  let blinkAt=63,nextBlink=63,look=0,lookGoal=0,lookUntil=0,nextLook=130,lookUp=0,upGoal=0;
  let sulkUntil=0,sulkStart=-1000,warningAt=-1000,sulkCount=0,noticeAt=0,caught=false,swallow=-1000;
  let exchange=null,shiftAt=155,nextShift=155,shiftSide=1,chime=null,lastChime=-1000;
  const age=()=>run?host.tick-run.start:1000;
  const busy=()=>!!run&&age()<run.duration;
  function offset(){
    if(!run||run.kind!=='hop')return [x,0,0];
    const u=clamp((age()-6)/13,0,1);
    return [mix(run.from,run.to,smooth(u)),.21*4*u*(1-u),0];
  }
  function pose(){
    const tick=host.tick,a=age(),sulk=smooth((tick-sulkStart)/7)*smooth((sulkUntil-tick)/25);
    // A sulking animal checks without giving its whole face back. More pokes close that eye.
    const quiet=tick-lastTouch,peek=sulk&&quiet>30?curve(quiet,[[31,0],[40,1],[49,1],[58,0]]):0;
    const warning=curve(tick-warningAt,[[0,0],[3,1],[16,1],[27,0]]);
    const touch=curve(tick-touchAt,[[0,1],[4,0]]),hard=clamp((patience-3.5)/4.5,0,1);
    const bell=flinchKind==='bell',f=curve(tick-flinch,[[0,0],[2,1],[5,.85],[bell?22:12,0]])*flinchStrength;
    const blink=tick<blinkAt?0:curve(tick-blinkAt,[[0,0],[1,1],[3,1],[5,0]]);
    const chew=curve(tick-swallow,[[0,0],[3,1],[7,1],[11,.15],[15,.35],[20,0]]);
    const hop=run?.kind==='hop',meal=run?.kind==='eat',recoil=run?.kind==='recoil'?curve(a,[[0,0],[4,1],[12,1],[24,0]]):0;
    const focus=meal?curve(a,[[0,0],[4,1],[8,1],[11,.7],[SWALLOW,.4],[SWALLOW+8,0]]):0;
    const shiftAge=tick-shiftAt,weight=!run&&!sulk?curve(shiftAge,[[0,0],[8,1],[22,1],[36,0]])*shiftSide:0;
    const fore=!run&&!sulk?curve(shiftAge,[[0,0],[5,1],[12,0]]):0;
    return {
      offset:offset(),look,lookUp,peek,warning,weight,fore,foreSide:shiftSide,
      blink:Math.max(blink,f*(bell?.8:.55),warning*.45,sulk*(.65+hard*.22))*(1-peek*.8),
      squash:hop?curve(a,[[0,1],[5,.79],[7,1.17],[11,1.05],[17,.98],[19,.76],[22,1.06],[29,1]]):1-.11*sulk-(bell?.035:.10)*f-.04*chew,
      lean:weight*1.7+touch*touchSide*.9-warning*1.4+(hop?curve(a,[[0,0],[5,-2],[8,3],[18,1],[25,0]])*run.direction:0)-f*flinchDirection*(bell?2.4:1.2)+focus*look*1.6,
      throat:(1-sulk*.7)*(1-warning*.8)*(Math.max(0,Math.sin(tick/9))**4)*2.7+chew*5,
      headY:f*(bell?-2:4)+sulk*(4+hard*2)-lookUp*3+warning*2+focus*1.2-chew*1.2+recoil*3,
      mouth:meal?curve(a,[[0,0],[TASTE-2,0],[TASTE,1],[SWALLOW-2,1],[SWALLOW,0]]):0,
      toes:hop?curve(a,[[0,0],[6,0],[8,1],[15,1],[18,0]]):0,
      sulk,flinch:f,chew,touch,
    };
  }
  function mouth(){
    const q=frogPixel(28,29,pose()),o=offset();
    return p.atDepth([438+q[0],797+q[1]],-foot[2]).map((v,i)=>v+o[i]);
  }
  function notice(kind='notice'){
    if(host.action||kind!=='sulk'&&kind!=='exchange'&&noticeAt&&host.tick-noticeAt<80)return;
    noticeAt=host.tick;
    host.actor.drive('frog.notice',{keys:['head','pitch','spine','browL'],duration:38,
      sample(a,{pose:q}){const w=curve(a,[[0,0],[8,1],[22,.8],[38,0]]);
        return {head:q.head-3*w,pitch:q.pitch+.13*w,spine:q.spine-1.4*w,browL:q.browL+(kind==='sulk'?-5:2)*w};}
    },{id:`frog:${host.tick}`,fade:3,release:6});
  }
  function hop(reason='touch',delay=0,point=host.bowl.position){
    if(busy())return false;
    const from=offset()[0],away=foot[0]+from>=point[0]?1:-1;
    // A boundary shortens an escape; it can never reverse it toward the hazard.
    // Left is a narrow gap between sack and dropped bowl: a short 12 cm retreat
    // leaves the mouth visible there instead of burying it farther into the sack.
    let to=clamp(from+away*.24,-.12,.55);
    // Empty-handed play may return within the patch when the bowl is on its stand.
    if(reason==='touch'&&host.bowl.owner==='stand'&&Math.abs(to-from)<.025)to=clamp(from-away*.24,-.12,.55);
    x=from;run={kind:Math.abs(to-from)<.025?'recoil':'hop',duration:30,start:host.tick+delay,from,to,direction:Math.sign(to-from)||away,reason};
    host.record('frog-start',{from:[from,0,0],to:[to,0,0],reason});return true;
  }
  function startle(event){
    if(host.tick-flinch<4)return;
    const point=event.point??host.bowl.position,o=offset(),distance=Math.hypot(foot[0]+o[0]-point[0],foot[2]-point[2]);
    // land has no speed field in the shared contract: use the last sampled falling
    // velocity. A quiet later bounce is a smaller check, not another full escape.
    const speed=event.speed??Math.abs(lastBowlVY),bell=event.kind==='bell';
    flinchStrength=bell?clamp(1.3/(1+distance*.3),.2,.95):clamp((event.kind==='stamp'?.8:.15+speed*.30)/(1+distance*.7),.12,1);
    flinch=host.tick;flinchKind=event.kind;flinchDirection=Math.sign(point[0]-foot[0]-o[0])||1;
    lookGoal=flinchDirection;lookUntil=host.tick+(bell?52:26);upGoal=bell?1:0;exchange=null;
    host.consequence('frog-flinch',{source:event.kind,strength:flinchStrength,distance,speed:bell?null:speed,point:mouth()});
    if(!bell&&flinchStrength>.3&&host.tick-lastEscape>65&&!busy()){
      hop(event.kind,4,point);lastEscape=host.tick;
    }
  }
  function wordPoint(w){
    const length=Math.hypot(...p.wall.normal),sign=p.wall.normal[2]<0?-1:1,n=p.wall.normal.map(v=>v/length*sign),along=[n[2],0,-n[0]];
    const origin=p.onPlane([430,p.wallY(430)],p.wall);
    return origin.map((v,i)=>v+along[i]*((w.s??0)+(w.width??0)/2)+n[i]*(w.lift??0)+(i===1?(w.t??0):0));
  }
  return {
    id:'frog',layers:['frog.notice'],art:[{...def,cut:'frog',castShadow:true}],
    targets:{frog:{control:'frog',point:()=>p.project(mouth()),priority:30,
      hit:(a,b)=>{const m=p.project(mouth());return ((a-m[0])/39)**2+((b-m[1]-18)/45)**2<1;},interact:()=>({kind:'feed-frog'})}},
    intents:{
      'feed-frog'(intent){
        patience=clamp(patience+(host.tick-lastTouch<50?1.25:.65),0,8);lastTouch=host.tick;touchAt=host.tick;touchSide*=-1;exchange=null;
        lookGoal=-.6;lookUntil=host.tick+45;upGoal=0;
        const warning=patience>=1.4&&patience<3.5;
        if(warning){warningAt=host.tick;host.consequence('frog-warning',{point:mouth()});}
        else blinkAt=host.tick;
        if(patience>=3.5){
          const fresh=host.tick>=sulkUntil;sulkUntil=host.tick+100;
          if(fresh){sulkStart=host.tick;sulkCount++;host.consequence('frog-sulk',{point:mouth(),patience,count:sulkCount});notice('sulk');}
        }
        if(busy()||host.tick<sulkUntil){host.record('rejected',{id:intent.id,reason:host.tick<sulkUntil?'frog sulking':'frog occupied'});return false;}
        if(warning)run={kind:'warning',start:host.tick,duration:27,from:x,to:x};else hop();
        run.request=intent.id;notice();return true;
      },
      'frog-meal'(intent){
        if(!run||run.request!==intent.request||age()>4)return false;
        run.kind='eat';run.duration=SWALLOW+22;run.food=intent.word;run.target=intent.point;
        caught=false;lookGoal=clamp(((intent.point?.[0]??foot[0]+1)-foot[0]-x)*1.7,-1,1);lookUntil=host.tick+run.duration;upGoal=-.4;return true;
      },
      'frog-caught'(intent){
        if(!run||run.request!==intent.request||run.kind!=='eat')return false;
        caught=!!intent.caught;return true;
      },
    },
    beforePose(tick,{commands}){
      if(commands.some(({intent,accepted})=>accepted!==false&&(['ring','offer','interrupt'].includes(intent.kind)||intent.kind==='poke'&&intent.target==='saint'))){
        host.actor.cancel('frog.notice',{fade:6});exchange=null;
      }
      for(const {intent} of commands)if(intent.kind==='pointer'&&intent.active!==false&&tick>=sulkUntil&&!busy()&&!exchange){
        const m=p.project(mouth());
        if(Math.hypot(intent.x-m[0],intent.y-m[1])<180){lookGoal=clamp((intent.x-m[0])/45,-1,1);lookUntil=tick+40;upGoal=clamp((m[1]-intent.y)/80,-.5,1);}
      }
    },
    frames:{frog:mouth,'frog.mouth':mouth,'frog.foot':()=>foot.map((v,i)=>v+offset()[i])},
    onEvent(event){
      if(['bell','land','stamp'].includes(event.kind))startle(event);
      if(event.kind==='board-chime'&&event.speed>.4&&host.tick-lastChime>120&&!busy()&&host.tick>=sulkUntil){
        lastChime=host.tick;chime={at:host.tick+12,point:event.point,speed:event.speed};
      }
    },
    afterPhysics(tick){
      if(chime&&tick>=chime.at){
        if(!busy()&&tick>=sulkUntil){
          lookGoal=1;upGoal=.8;lookUntil=tick+40;blinkAt=tick+9;exchange=null;
          host.consequence('frog-heard-chime',{point:mouth(),source:chime.point,speed:chime.speed});
        }
        chime=null;
      }
      patience=Math.max(0,patience-.012);lastBowlVY=host.bowl.velocity[1];
      if(tick===sulkUntil){patience=Math.min(patience,.5);lookGoal=.35;lookUntil=tick+28;upGoal=.3;blinkAt=tick+8;}
      if(tick>=nextBlink){blinkAt=tick;nextBlink=tick+77+Math.floor(rng()*92);}
      if(tick>=nextShift){shiftAt=tick;shiftSide*=-1;nextShift=tick+130+Math.floor(rng()*130);}
      if(tick>=nextLook){nextLook=tick+140+Math.floor(rng()*130);
        if(tick>lookUntil&&tick>sulkUntil&&!busy()){
          const towardHer=rng()<.7;
          lookGoal=towardHer?clamp((host.frame('root').position[0]-foot[0]-x)*.9,-1,1):-.8;upGoal=towardHer?1:0;lookUntil=tick+42;
          if(towardHer&&!host.action&&tick-noticeAt>240){exchange={start:tick};host.consequence('frog-look',{point:mouth()});}
        }}
      if(exchange){
        const t=tick-exchange.start;
        if(host.action||busy()||tick<sulkUntil)exchange=null;
        else if(t===12){notice('exchange');host.consequence('frog-acknowledge',{point:mouth()});}
        else if(t===34){blinkAt=tick;lookGoal=0;upGoal=0;}
        else if(t>49)exchange=null;
      }
      if(tick<sulkUntil){
        const quiet=tick-lastTouch,peek=curve(quiet,[[0,0],[31,0],[40,1],[49,1],[58,0]]);
        lookGoal=-1+peek*.85;upGoal=peek*.4;
      }else if(tick>lookUntil&&!exchange){lookGoal=0;upGoal=0;}
      look+=(lookGoal-look)*.22;lookUp+=(upGoal-lookUp)*.22;
      const height=offset()[1],speed=Math.abs(height-previousHeight)*24;previousHeight=height;
      if(run){
        const a=age();
        if(run.kind==='hop'){
          if(a===7)host.emit('frog',mouth(),{reason:run.reason,speed});
          if(a===19)host.consequence('frog-land',{point:foot.map((v,i)=>v+offset()[i]),speed});
        }else if(run.kind==='eat'){
          if(a===TASTE)host.consequence('frog-taste',{point:mouth(),request:run.request,word:run.food});
          if(a===SWALLOW&&caught){swallow=tick;blinkAt=tick;host.consequence('frog-swallow',{point:mouth()});patience=Math.max(0,patience-1);}
        }
        if(a>=run.duration){if(run.kind==='hop')x=run.to;run=null;}
      }
    },
    answers:{frog:['frog']},
    speech:{
      command({intent},tick,director){
        if(intent.kind!=='feed-frog')return;
        const at=mouth(),food=director.speaker.lettering.words.filter(w=>w.phase==='floor').sort((a,b)=>Math.hypot(...wordPoint(a).map((v,i)=>v-at[i]))-Math.hypot(...wordPoint(b).map((v,i)=>v-at[i])))[0];
        if(food)host.send({kind:'frog-meal',request:intent.id,word:food.id,point:wordPoint(food)});
        else director.fedFrog(null,tick);
      },
      event(event,tick,director){
        if(event.kind==='frog-taste'){
          const eaten=director.speaker.lettering.eat(tick,director.places.frogMouth(),event.word);
          host.send({kind:'frog-caught',request:event.request,caught:!!eaten});director.fedFrog(eaten,tick);
        }
        if((event.kind==='frog-sulk'||event.kind==='frog-acknowledge'&&!director.speaker.current)&&!host.action)director.lookAt?.(p.project(mouth()),tick);
      },
    },
    mount:kit=>mountFrog(kit,{pose,foot,p}),get offset(){return offset();},
    get state(){return {tick:host.tick,run:run&&structuredClone(run),patience,sulkUntil,sulkCount,look,caught,exchange:exchange&&{...exchange},...pose()};},
  };
}
