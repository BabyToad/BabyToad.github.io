import {TAU} from './physics/dsp.js';
import {PIVOT_X,PIVOT_Y,R_DISC,R_LABEL,ALPHA_REST,alphaForRadius} from './physics/geometry.js';
export function connectGestures({canvas,renderer,fan,camera,getState,command,select,hover,invalidate}) {
  const pointers=new Map();let drag=null,pendingTap=null;
  const angle=p=>{const a=Math.atan2(p[1]-PIVOT_Y,p[0]-PIVOT_X);return a<0?a+TAU:a;};
  const inBox=(p,x0,y0,x1,y1)=>p&&p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1;
  function pickSleeve(x,y){
    const cam=renderer.cam;if(!cam)return null;let depth=renderer.pickDisc(x,y,getState().recordMatrix)??Infinity;
    for(const z of [0,-.019,.018]){const p=renderer.pick(x,y,z);if(!p)continue;
      const blocked=z===0?Math.hypot(...p)<.1645:z===-.019?inBox(p,-.185,-.19,.27,.19):renderer.armDistance(p,getState().al)<.014;
      if(blocked)depth=Math.min(depth,(p[0]-cam.eye[0])*cam.fwd[0]+(p[1]-cam.eye[1])*cam.fwd[1]+(z-cam.eye[2])*cam.fwd[2]);
    }return fan.pick(x,y,depth);
  }
  function free(cancel=true){
    if(drag?.kind==='arm'){command('hand',{on:false});if(cancel)command('cue',{up:true});}
    if(drag?.kind==='platter')command('platter',{on:false});
    drag=null;canvas.style.cursor='grab';
  }
  canvas.addEventListener('pointerdown',e=>{
    if(e.button>2)return;pendingTap=null;camera.target=null;canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);
    if(pointers.size>=2){free(true);const [a,b]=[...pointers.values()];drag={kind:'pinch',distance:Math.hypot(a[0]-b[0],a[1]-b[1]),center:[(a[0]+b[0])/2,(a[1]+b[1])/2]};return;}
    const state=getState(),p=renderer.pick(e.clientX,e.clientY,0),deck=renderer.pick(e.clientX,e.clientY,-.019),knob=renderer.pick(e.clientX,e.clientY,-.004),arm=renderer.pick(e.clientX,e.clientY,.018),index=pickSleeve(e.clientX,e.clientY);
    const pan=e.button===2||e.shiftKey;
    let kind='orbit',extra={};
    if(pan)kind='pan';
    else if(!camera.micro&&!state.lookOnly&&state.recordMatrix&&renderer.pickDisc(e.clientX,e.clientY,state.recordMatrix)!==null){kind='control';extra.action=state.recordHeld?'placeRecord':'recordMoving';}
    else if(!camera.micro&&!state.lookOnly&&index!==null){kind='fan';extra={index,selection:state.selected};}
    else if(!camera.micro&&!state.lookOnly){
      if(state.recordHeld&&p&&Math.hypot(...p)<.175){kind='control';extra.action='placeRecord';}
      else if(inBox(deck,-.144,-.19,-.092,-.151)){kind='control';extra.action='motor';}
      else if(inBox(deck,-.094,-.193,-.063,-.168)){kind='control';extra.action='speed33';}
      else if(inBox(deck,-.063,-.193,-.032,-.168)){kind='control';extra.action='speed45';}
      else if(knob&&Math.hypot(knob[0]-.17,knob[1]+.15)<.020){kind='volume';extra.value=state.volume;}
      else if(inBox(deck,.231,-.17,.258,-.047)){kind='pitch';}
      else if(inBox(deck,PIVOT_X+.032,PIVOT_Y-.065,PIVOT_X+.066,PIVOT_Y-.03)){kind='control';extra.action='cue';}
      else if(deck&&Math.hypot(deck[0]-PIVOT_X-.047,deck[1]-PIVOT_Y-.012)<.014){kind='skate';extra.value=state.skate;}
      else if(state.ready&&!state.cutting&&arm&&renderer.armDistance(arm,state.al)<(e.pointerType==='touch'?.030:.011)){kind='arm';extra.offset=state.al-angle(arm);command('hand',{on:true,al:state.al});}
      else if(state.ready&&!state.cutting&&p&&Math.hypot(...p)<R_DISC){kind='platter';extra={angle:Math.atan2(p[1],p[0]),point:p};command('platter',{on:true});}
    }
    drag={kind,id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,moved:0,...extra};canvas.style.cursor='grabbing';
  });
  canvas.addEventListener('pointermove',e=>{
    if(pointers.has(e.pointerId))pointers.set(e.pointerId,[e.clientX,e.clientY]);
    if(!drag){hover(pickSleeve(e.clientX,e.clientY));return;}
    if(drag.kind==='pinch'){
      const [a,b]=[...pointers.values()];if(!b)return;const distance=Math.hypot(a[0]-b[0],a[1]-b[1]),center=[(a[0]+b[0])/2,(a[1]+b[1])/2];
      camera.distance*=drag.distance/Math.max(1,distance);pan(center[0]-drag.center[0],center[1]-drag.center[1]);drag.distance=distance;drag.center=center;
    }else{
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0));
      if(drag.kind==='orbit'){camera.az-=dx*.006;camera.el+=dy*.006;camera.follow=false;}
      if(drag.kind==='pan')pan(dx,dy);
      if(drag.kind==='fan'&&drag.moved>12)select(Math.max(0,Math.min(fan.albums.length-1,drag.selection-Math.round((e.clientX-drag.x0)/65))),false);
      if(drag.kind==='arm'){const p=renderer.pick(e.clientX,e.clientY,.018);if(p)command('hand',{on:true,al:angle(p)+drag.offset});}
      if(drag.kind==='platter'){const p=renderer.pick(e.clientX,e.clientY,0);if(p){const a=Math.atan2(p[1],p[0]);let d=a-drag.angle;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;command('platterMove',{d:-d});drag.angle=a;}}
      if(drag.kind==='volume')command('volume',{value:Math.round(Math.max(0,Math.min(100,drag.value+(e.clientX-drag.x0)/1.5-(e.clientY-drag.y0)/1.5)))});
      if(drag.kind==='skate')command('skate',{value:Math.max(0,Math.min(3,drag.value+(e.clientX-drag.x0)/60-(e.clientY-drag.y0)/60))});
      if(drag.kind==='pitch'){const p=renderer.pick(e.clientX,e.clientY,-.02);if(p)command('pitch',{value:Math.max(-8,Math.min(8,(p[1]+.11)/.06*8))});}
      drag.x=e.clientX;drag.y=e.clientY;
    }limit();invalidate();
  });
  function pan(dx,dy){
    if(camera.micro)return;
    const k=camera.distance*.0008;camera.focus[0]-=(Math.cos(camera.az)*dx+Math.sin(camera.az)*dy)*k;camera.focus[1]-=(Math.sin(camera.az)*dx-Math.cos(camera.az)*dy)*k;camera.follow=false;
  }
  function limit(){camera.el=Math.max(.14,Math.min(1.53,camera.el));camera.distance=Math.max(camera.micro?.00018:.10,Math.min(camera.micro?.006:3,camera.distance));camera.focus[0]=Math.max(-.8,Math.min(.35,camera.focus[0]));camera.focus[1]=Math.max(-.25,Math.min(.25,camera.focus[1]));}
  canvas.addEventListener('pointerup',e=>{
    pointers.delete(e.pointerId);if(!drag)return;
    if(drag.kind==='pinch'){free(true);return;}
    if(drag.id!==e.pointerId)return;
    if(drag.moved<8){
      if(drag.kind==='fan'){const index=drag.index;pendingTap=()=>select(index,true);}
      if(drag.kind==='control'){const action=drag.action;pendingTap=()=>command(action);}
      if(drag.kind==='platter'&&Math.hypot(...drag.point)>R_LABEL){const al=alphaForRadius(Math.hypot(...drag.point));pendingTap=()=>command('cueTo',{al});}
    }free(false);
  });
  canvas.addEventListener('click',()=>{const action=pendingTap;pendingTap=null;action?.();});
  canvas.addEventListener('pointercancel',()=>{pointers.clear();pendingTap=null;free(true);});
  canvas.addEventListener('lostpointercapture',e=>{if(pointers.has(e.pointerId)){pointers.delete(e.pointerId);pendingTap=null;free(true);}});
  canvas.addEventListener('pointerleave',()=>hover(null));
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey&&document.activeElement!==canvas)return;e.preventDefault();camera.target=null;camera.distance*=Math.exp(e.deltaY*.001);limit();invalidate();},{passive:false});
  canvas.addEventListener('keydown',e=>{camera.target=null;
    if(e.key==='ArrowLeft')camera.az+=.12;else if(e.key==='ArrowRight')camera.az-=.12;else if(e.key==='ArrowUp')camera.el+=.08;else if(e.key==='ArrowDown')camera.el-=.08;
    else if(e.key==='+'||e.key==='=')camera.distance*=.9;else if(e.key==='-')camera.distance*=1.1;else return;
    e.preventDefault();limit();invalidate();
  });
  return ()=>{pointers.clear();pendingTap=null;free(true);};
}
