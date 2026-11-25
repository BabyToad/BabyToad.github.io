import {RecordPlacement} from './placement.js';
import {createListeningPanel} from './listening.js';
import {GrooveSurface} from './micro-surface.js';
import {Renderer} from './physics/render.js';
import {AlbumFan} from './fan.js';
import {createPhysicalAudio} from './audio.js';
import {connectGestures} from './input.js';
import {TAU} from './physics/dsp.js';
import {ALPHA_REST,R_LEADIN,W33,alphaForRadius,grooveRadius,stylusXY} from './physics/geometry.js';

const $=id=>document.getElementById(id),root=document.querySelector('[data-records]');
const albums=JSON.parse($('records-data').textContent),canvas=$('record-stage');
const mediaBase=new URL(root.dataset.mediaBase||'/',location.href);
for(const album of albums)for(const track of album.audioTracks||[])track.url=new URL(track.url,mediaBase).href;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:600px)');
const defaultAlbum=albums.find(a=>a.id==='polygondwanaland'),placement=new RecordPlacement();
let pressingAlbum=null,handlingRequest=0,handlingCut=false;
const state={selected:0,tel:null,received:0,record:null,sequence:0,cutting:false,ready:false,motor:false,cue:true,rpm:100/3,pitch:0,lookOnly:false,source:'Polygondwanaland',sourceDetail:'Demo pressing · The Castle In The Air · 2:47'};
const camera={az:-.38,el:.72,distance:1.50,focus:[-.22,.03,-.07],follow:false,target:null};
let renderer,fan,worker,job=0,renderFrame=0,lastFrame=0,alive=true,shown=true,gestureCleanup;
let microscope,microSample=null;
let unavailable=false,pendingPressing=null,pendingPressingTimer;
let downloadAbort=null,downloadJob=0;
const coarse=matchMedia('(pointer:coarse)');
const gestureHint=()=>coarse.matches?'Drag empty space to look · pinch to zoom · use two fingers to pan':'Drag empty space to look · click the scene for wheel zoom';
$('gesture-hint').textContent=gestureHint();
let sourceFiles=null,sourceKind='demo',condition='clean',audioPending=false;
const conditions={clean:{noise:.2,dust:0,scratches:0,warp:0,offCenter:0,echo:.1},played:{noise:.7,dust:.2,scratches:.2,warp:.15,offCenter:.08,echo:.5},worn:{noise:1,dust:.7,scratches:.6,warp:.3,offCenter:.15,echo:1}};
function status(message){$('record-status').textContent=message;}
function failure(message){status(message);audioPending=false;update();}
const audio=createPhysicalAudio(t=>{if(t.recSeq!==state.sequence)return;const firstSurface=!!t.surface&&!microSample;if(t.surface)microSample=t;const previous=state.tel,changed=!previous||(Math.abs(t.wp)>.02&&Math.abs(t.wp-previous.wp)>.002)||Math.abs(t.al-previous.al)>1e-5||Math.abs(t.zb-previous.zb)>1e-5||Math.abs(t.plinth-previous.plinth)>1e-7||firstSurface||(camera.micro&&(Math.abs(t.xi-previous.xi)>1e-7||Math.abs(t.ze-previous.ze)>1e-7))||t.motor!==previous.motor||t.cueUp!==previous.cueUp||!!t.auto;state.tel=t;state.received=performance.now();state.motor=t.motor;state.cue=t.cueUp;state.ready=true;if(pendingPressing&&Math.abs(t.wp)<.01&&t.hc>=.001){const install=pendingPressing;pendingPressing=null;install();return;}if(changed||Math.abs(t.wp)>.02)invalidate();},()=>{if(pendingPressing&&audio.context?.state!=='running'){const install=pendingPressing;pendingPressing=null;install(true);}invalidate();},failure);

const listening=createListeningPanel($('album-listening'),{
  maxCutSeconds:()=>phone.matches?180:600,
  beforePlay:async({provider})=>{
    cancelDownload();if(state.cutting)cancelCut();gestureCleanup?.();await audio.silence();
    state.tel=null;state.ready=false;state.motor=false;state.cue=true;$('rpm-value').textContent='0.00 RPM';$('track-current').textContent='Needle raised';status('Deck paused. Use the '+provider+' player in the sleeve.');update();invalidate();
  },
  onStop:()=>{status('Album player closed. Put it on resumes the physical pressing.');update();invalidate();},
  onCut:cutOfficialTrack
});
function sleeveHome(){fan.frozen=true;return fan.recordHome(state.selected,state.selected);}
function recordControls(){
 const a=albums[state.selected],available=!!a.audioTracks?.length;
 $('take-record').hidden=!available;$('take-record').disabled=state.cutting||placement.moving||unavailable;
 $('take-record').textContent=placement.placed&&pressingAlbum===a.id?'Return record to sleeve':placement.phase==='held'?'Place record on platter':'Take out record';
 $('record-placement').textContent=placement.phase==='held'?'Record in hand · click the platter to place it':placement.placed?'On the platter':state.cutting?'Preparing the pressing…':'In the sleeve';
}
async function takeRecord(){
 if(unavailable||state.cutting||placement.moving)return;
 if(placement.phase==='held')return placeRecord();
 const a=albums[state.selected];if(!a.audioTracks?.length)return;
 listening.stop();$('sleeve-detail').hidden=true;setView('room');
 const request=++handlingRequest;await audio.silence();if(request!==handlingRequest||!alive)return;
 state.tel=null;state.ready=false;state.motor=false;state.cue=true;$('rpm-value').textContent='0.00 RPM';$('track-current').textContent='Needle raised';
 if(state.record&&pressingAlbum===a.id){
  if(placement.placed)placement.return(sleeveHome());else placement.extract(sleeveHome());
  status(placement.phase==='returning'?'Returning the record to its sleeve.':'Click the platter to place the record.');update();invalidate();return;
 }
 const track=a.audioTracks.find(t=>t.title==='The Castle In The Air')||a.audioTracks.find(t=>t.durationSec<=(phone.matches?180:600));
 if(!track)return status('Use the full recording player; these tracks exceed this device’s cutting limit.');
 try{await cutOfficialTrack({album:a,track,handling:true});}catch(error){status(error.message);}
}
function placeRecord(){if(placement.phase!=='held'||state.cutting)return;placement.place();setView('deck');status('Lowering the record onto the spindle…');update();invalidate();}
function sceneAlbum(index,inspect=true){if(placement.moving)return;selectAlbum(index,false);if(inspect){if(albums[index].audioTracks?.length&&!placement.visible)takeRecord();else selectAlbum(index,true);}}
function cancelDownload(){downloadJob++;if(downloadAbort){downloadAbort.abort();downloadAbort=null;state.cutting=false;status('Download cancelled. Choose a record or listening source.');}}
async function cutOfficialTrack({album,track,handling=false}){
  if(unavailable)throw new Error('The vinyl simulation is unavailable. You can still play the full recording here.');
  cancelCut();const id=downloadJob,controller=downloadAbort=new AbortController();
  await audio.silence();if(id!==downloadJob)return false;
  state.tel=null;state.ready=false;state.motor=false;state.cue=true;$('rpm-value').textContent='0.00 RPM';$('track-current').textContent='Needle raised';state.cutting=true;update();
  status('Downloading '+track.title+' ('+(track.sizeBytes/1048576).toFixed(1)+' MB)…');
  try{
    const response=await fetch(track.url,{signal:controller.signal});if(!response.ok)throw new Error('The recording could not download. Try full playback or a service link.');
    const blob=await response.blob();if(id!==downloadJob||!alive)return false;
    if(blob.size!==track.sizeBytes)throw new Error('The download was incomplete. Try again or play the full recording.');
    const file=new File([blob],track.title+'.mp3',{type:'audio/mpeg'});file.recordCredit={title:album.title,artist:album.artist};
    downloadAbort=null;state.cutting=false;$('sleeve-detail').hidden=true;setView(handling?'room':'deck');beginCut('official',[file],handling?{albumId:album.id}:null);return true;
  }catch(error){if(id!==downloadJob||error.name==='AbortError')return false;downloadAbort=null;state.cutting=false;const message=error.message==='The download was incomplete. Try again or play the full recording.'?error.message:'The recording could not download. Try full playback or a service link.';status(message);update();throw new Error(message);}
}

function invalidate(){if(renderer&&!renderFrame&&alive&&shown&&!document.hidden)renderFrame=requestAnimationFrame(frame);}
function setView(name){
  const portrait=phone.matches;
  const views={room:{focus:[-.25,.06,.02],distance:portrait?2.6:1.95,az:-.38,el:.72},deck:{focus:[.04,-.02,portrait?-.20:-.065],distance:portrait?2.35:1.20,az:portrait?-.12:-.35,el:portrait?.92:.80},crate:{focus:[-.62,.10,-.04],distance:portrait?1.35:1.10,az:0,el:.40},stylus:{focus:[...stylusXY(state.tel?.al??ALPHA_REST),.002],distance:.12,az:-.45,el:.20}};
  const wasMicro=camera.micro;camera.micro=name==='grooves';
  if(camera.micro){microSample=null;views.grooves={focus:[0,0,0],distance:portrait?.0004:.0005,az:.25,el:.40};camera.target=null;Object.assign(camera,views.grooves);}
  const target=views[name]||views.room;if(reduced.matches||camera.micro||wasMicro)Object.assign(camera,target,{target:null});else camera.target=target;camera.follow=name==='stylus';
  $('needle-scope').hidden=!['stylus','grooves'].includes(name);$('scope-title').textContent=camera.micro?'Raw groove cut · unfiltered':'Stylus contact';$('groove-scope').hidden=true;audio.send({t:'view',on:camera.micro,micro:camera.micro});
  root.classList.toggle('micro-view',camera.micro);$('gesture-hint').textContent=camera.micro?'Cutaway · 18 µm seating radius for every stylus · white bar = 100 µm':gestureHint();
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
  invalidate();
}
function selectAlbum(index,inspect=true){
  if(placement.moving)return;handlingRequest++;if(handlingCut&&index!==state.selected)cancelCut();
  cancelDownload();state.selected=Math.max(0,Math.min(albums.length-1,index));const a=albums[state.selected];
  $('selected-title').textContent=a.title;$('selected-artist').textContent=a.artist;$('selected-meta').textContent=`${a.year} · ${a.tracks.length} tracks`;
  $('selected-cover').src=a.cover;$('selected-cover').alt=a.title+' cover';$('album-context').textContent=a.context;
  listening.selectAlbum(a);
  $('previous-album').disabled=state.selected===0;$('next-album').disabled=state.selected===albums.length-1;
  $('album-number').textContent=`${state.selected+1} / ${albums.length}`;
  $('album-tracks').replaceChildren(...a.tracks.map(t=>Object.assign(document.createElement('li'),{textContent:t.title})));
  document.querySelectorAll('[data-record]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.record===a.id)));
  if(inspect){$('sleeve-detail').hidden=false;$('adjustments').hidden=true;$('adjust-toggle').setAttribute('aria-expanded','false');$('needle-scope').hidden=true;setView('crate');}
  update();invalidate();
}
function update(){
  const enabled=!!state.record&&placement.placed&&!state.cutting&&!unavailable;
  document.querySelector('[data-view=grooves]').disabled=!state.ready||state.cutting||unavailable;
  for(const id of ['put-on','motor','cue','cut-track','press-again'])$(id).disabled=!enabled||audioPending;
  $('cut-track').disabled=!enabled||!audio.ready||audioPending;
  $('put-on').disabled=state.cutting||placement.moving||unavailable||audioPending;
  $('put-on').textContent=!placement.visible?'Take out demo record':placement.phase==='held'?'Place on platter':placement.moving?'Moving record…':listening.active?'Restart physical record':audioPending?'Starting…':'Put it on';
  for(const id of ['speed33','speed45','adjust-toggle'])$(id).disabled=unavailable;
  for(const id of ['motor','cue','cut-track','press-again','speed33','speed45','adjust-toggle'])if(listening.active)$(id).disabled=true;
  root.classList.toggle('service-listening',!!listening.active);
  $('motor').textContent=state.motor?'Stop motor':'Start motor';$('cue').textContent=state.cue?'Lower needle':'Lift needle';
  $('speed33').setAttribute('aria-pressed',String(state.rpm<40));$('speed45').setAttribute('aria-pressed',String(state.rpm>40));
  $('cancel-cut').hidden=!state.cutting;
  recordControls();$('source-title').textContent=state.source;$('source-detail').textContent=state.sourceDetail;
}
async function readyAction(fn){
  if(!state.record||!placement.placed||state.cutting||unavailable||audioPending)return;
  listening.stop();const actionJob=job;audioPending=true;status('Warming the cartridge…');update();
  try{await audio.unlock();if(!alive)return;audioPending=false;if(state.cutting||actionJob!==job){update();return;}state.ready=true;applyParams();audio.send({t:'view',on:camera.micro,micro:camera.micro});fn();status('The deck is yours.');}
  catch(error){failure(error.message);}update();invalidate();
}
function command(action,data={}){
  if(action==='placeRecord')return placeRecord();
  if(!placement.placed&&!['volume','speed33','speed45','pitch','skate'].includes(action))return;
  if(listening.active)return status('Use the album player, or choose Return to physical deck.');
  if(action==='motor')return readyAction(()=>{state.motor=!state.motor;audio.send({t:'motor',on:state.motor});});
  if(unavailable)return;
  if(action==='speed33'||action==='speed45'){state.rpm=action==='speed33'?100/3:45;audio.send({t:'speed',rpm:state.rpm*(1+state.pitch/100)});update();return invalidate();}
  if(action==='cue'&&data.up===undefined)return readyAction(()=>audio.send({t:'cue',up:!state.cue}));
  if(action==='volume'){$('volume').value=data.value;$('volume-value').textContent=data.value+'%';applyParams();return invalidate();}
  if(action==='skate'){$('skate').value=data.value;$('skate-value').textContent=data.value.toFixed(2)+' g';applyParams();return invalidate();}
  if(action==='pitch'){state.pitch=data.value;$('pitch').value=state.pitch;$('pitch-value').textContent=state.pitch.toFixed(1)+'%';audio.send({t:'speed',rpm:state.rpm*(1+state.pitch/100)});return invalidate();}
  if(action==='cueTo')return readyAction(()=>audio.send({t:'cueTo',...data}));
  audio.send({t:action,...data});invalidate();
}
function applyParams(){
  audio.send({t:'set',volume:+$('volume').value/100*.78,vtf:+$('force').value,antiskate:+$('skate').value,stylus:$('stylus-type').value,hum:0});
  audio.send({t:'speed',rpm:state.rpm*(1+state.pitch/100)});
}
function beginCut(kind,files=null,handling=null){
  if(unavailable)return;handlingCut=!!handling;
  listening.stop();cancelDownload();pendingPressing=null;clearTimeout(pendingPressingTimer);const id=++job;gestureCleanup?.();worker?.terminate();worker=null;state.cutting=true;audio.send({t:'cue',up:true});audio.send({t:'motor',on:false});state.motor=false;state.cue=true;update();
  const w=worker=new Worker(new URL('./physics/master-worker.js',import.meta.url),{type:'module'});
  w.onerror=e=>{if(id===job){state.cutting=false;failure('Could not cut this side. Try a shorter file.');}w.terminate();};
  w.onmessage=({data:m})=>{
    if(id!==job||!alive)return;
    if(m.t==='status')status(m.msg+'…');
    if(m.t==='error'){state.cutting=false;failure('Could not cut this side. Try a shorter audio file.');w.terminate();}
    if(m.t==='done'){
      const install=(park=false)=>{clearTimeout(pendingPressingTimer);pendingPressing=null;if(id!==job||!alive)return;
      microSample=null;if(camera.micro)setView('stylus');$('groove-stats').textContent='Needle raised · new pressing ready.';state.cutting=false;$('track-current').textContent='Needle raised';state.record=m.rec;state.record.sequence=++state.sequence;if(park)state.tel=null;state.ready=false;
      pressingAlbum=kind==='official'?(handling?.albumId||defaultAlbum.id):null;
      handlingCut=false;if(handling)placement.extract(sleeveHome());else placement.reset();
      renderer?.setRecord(m.rec,m.vis);audio.install(state.record,park);if(park)applyParams();
      sourceKind=kind;sourceFiles=files;state.source=kind==='demo'?'House pressing':files.length===1?files[0].name.replace(/\.[^.]+$/,''):'Your local side';
      state.sourceDetail=kind==='demo'?'Synthesised Demo EP · Guillermo Rauch':kind==='official'?files[0].recordCredit.artist+' · artist-authorized master, cut here':`${files.length} local ${files.length===1?'file':'files'} · cut here, never uploaded`;
      $('cut-track').replaceChildren(...m.rec.tracks.map((track,i)=>Object.assign(document.createElement('option'),{value:i,textContent:`${i+1}. ${track.title}`})));
      status(handling?'Record ready. Click the platter to place it.':m.rec.truncated?'This side was cut short to fit. Choose fewer tracks to hear the full files.':'Ready. Put it on, or start the motor and cue by hand.');
      update();invalidate();w.terminate();worker=null;};
      if(audio.ready&&audio.context?.state==='running'&&state.tel&&(Math.abs(state.tel.wp)>.01||state.tel.hc<.001)){pendingPressing=install;pendingPressingTimer=setTimeout(()=>{if(id===job&&pendingPressing)install(true);},12000);status('Waiting for the platter to stop and the needle to clear…');}else install(audio.ready&&audio.context?.state!=='running');
    }
  };
  const cond=conditions[condition];
  if(kind==='demo'){status('Cutting the house pressing…');w.postMessage({t:'demo',id,fs:48000,cond,seed:17});return;}
  (async()=>{
    try{
      const tracks=[];let seconds=0;const cap=phone.matches?180:600;
      for(const file of files){
        if(id!==job)return;
        status(`Reading ${file.name}…`);
        const duration=await fileDuration(file);
        if(seconds+duration>cap)throw new Error(`Choose a side under ${cap/60} minutes on this device.`);
        if(id!==job)return;
        const decoded=await new OfflineAudioContext(2,1,48000).decodeAudioData(await file.arrayBuffer());
        seconds+=decoded.duration;if(seconds>cap)throw new Error(`Choose a side under ${cap/60} minutes on this device.`);
        const L=decoded.getChannelData(0).slice(),R=decoded.numberOfChannels>1?decoded.getChannelData(1).slice():L;
        tracks.push({L,R,title:file.name.replace(/\.[^.]+$/,'')});
      }
      if(id!==job)return;
      w.postMessage({t:'tracks',id,fs:48000,tracks,cond,seed:17},[...new Set(tracks.flatMap(t=>[t.L.buffer,t.R.buffer]))]);
    }catch(error){if(id===job){state.cutting=false;status(error.message||'That file could not be decoded. Try WAV, MP3 or FLAC.');update();}w.terminate();}
  })();
}
async function fileDuration(file){
  const url=URL.createObjectURL(file),probe=document.createElement('audio');
  try{return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Could not read this file’s duration. Try WAV or MP3.')),8000);const finish=(fn,value)=>{clearTimeout(timer);fn(value);};probe.onloadedmetadata=()=>Number.isFinite(probe.duration)?finish(resolve,probe.duration):finish(reject,new Error('Choose an audio file with a known duration.'));probe.onerror=()=>finish(reject,new Error('This browser cannot decode that file. Try WAV or MP3.'));probe.preload='metadata';probe.src=url;});}
  finally{probe.removeAttribute('src');probe.load();URL.revokeObjectURL(url);}
}
function cutFiles(fileList){
  const files=[...fileList];if(!files.length)return;
  const maxMB=phone.matches?20:80;
  if(files.some(f=>!f.type.startsWith('audio/')&&!/\.(mp3|wav|flac|m4a|ogg|aif|aiff)$/i.test(f.name)))return status('Choose audio files such as WAV, MP3 or FLAC.');
  if(files.reduce((sum,f)=>sum+f.size,0)>maxMB*1024*1024)return status(`Choose files totaling under ${maxMB} MB on this device.`);
  $('sleeve-detail').hidden=true;setView('deck');beginCut('files',files);
}
function cancelCut(){handlingCut=false;cancelDownload();pendingPressing=null;clearTimeout(pendingPressingTimer);job++;worker?.terminate();worker=null;state.cutting=false;status(state.record?'Cut cancelled. The previous pressing is still on the deck.':'Cut cancelled. Choose House pressing or a local file.');update();}
function drawScope(t){
  const scope=$('groove-scope'),ctx=scope.getContext('2d'),v=t.view;if(!v)return;
  const styles=getComputedStyle(root),w=scope.width,h=scope.height;ctx.fillStyle=styles.getPropertyValue('--bg-dip');ctx.fillRect(0,0,w,h);ctx.strokeStyle=styles.getPropertyValue('--ink-soft');ctx.lineWidth=1.5;
  const Y=value=>h/2-value*h/190e-6;
  for(let row=0;row<5;row++)for(let wall=0;wall<2;wall++){ctx.beginPath();let start=true;for(let col=0;col<160;col++){const v0=v[(row*160+col)*2+wall];if(!Number.isFinite(v0)){start=true;continue;}const x=col/159*w,y=Y(v0);if(start)ctx.moveTo(x,y);else ctx.lineTo(x,y);start=false;}ctx.stroke();}
  ctx.fillStyle=styles.getPropertyValue('--accent');ctx.beginPath();ctx.arc(w/2,Y(v[1600]||0),7,0,TAU);ctx.fill();
  $('groove-stats').textContent=`${(t.r*1000).toFixed(1)} mm radius · ${(t.loss*100).toFixed(0)}% contact loss · ${t.hc>.0001?'needle raised '+(t.hc*1000).toFixed(2)+' mm':'groove contact'}`;
}
function contactText(t){if(!Number.isFinite(t.xg))return 'Needle outside the cut. Put it on to inspect groove contact.';return 'Inner '+(t.nIn*1000).toFixed(1)+' / outer '+(t.nOut*1000).toFixed(1)+' mN · '+(t.loss*100).toFixed(0)+'% contact loss · '+(t.hc>.0001?'needle raised':t.loss>.01?'mistracking':'groove contact')+' · vibration '+((t.plinth||0)*1e6).toFixed(1)+' µm';}
const format=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
let displayTime=0;
function frame(now){
  renderFrame=0;if(!alive||!shown||document.hidden)return;
  const dt=Math.min(.05,(now-(lastFrame||now))/1000);lastFrame=now;
  const wasMoving=placement.moving;placement.tick(dt,reduced.matches);if(wasMoving&&!placement.moving){fan.frozen=false;status(placement.placed?'Record placed. Put it on to start the motor and lower the needle.':placement.phase==='held'?'Click the platter to place the record.':'Record returned to its sleeve.');update();}
  if(camera.target){const target=camera.target,k=1-Math.exp(-dt*8);let delta=0;for(const key of ['az','el','distance']){delta+=Math.abs(target[key]-camera[key]);camera[key]+=(target[key]-camera[key])*k;}for(let i=0;i<3;i++){delta+=Math.abs(target.focus[i]-camera.focus[i]);camera.focus[i]+=(target.focus[i]-camera.focus[i])*k;}if(delta<.0001){Object.assign(camera,target);camera.target=null;}}
  const t=state.tel,lag=t?Math.min(.05,(now-state.received)/1000):0;
  if(camera.follow&&!camera.target&&t)camera.focus=[...stylusXY(t.al),.002];
  try{
    if(camera.micro){const box=canvas.getBoundingClientRect(),top=Math.max(0,$('needle-scope').getBoundingClientRect().bottom-box.top+12),bottom=Math.max(0,box.bottom-document.querySelector('.deck-strip').getBoundingClientRect().top+12);microscope.draw(microSample,camera,canvas.width,canvas.height,document.documentElement.dataset.theme==='light',{top,bottom});}
    else renderer.draw({recordVisible:placement.visible,recordMatrix:placement.placed?null:placement.matrix,plinth:t?.plinth||0,volume:+$('volume').value/100,thp:t?t.thp+t.wp*lag:0,al:t?.al??ALPHA_REST,zt:t?t.zb+t.ze:.005,zoom:0,az:camera.az,el:camera.el,at:camera.focus,dist:camera.distance,motor:state.motor,rpm:state.rpm,pitch:state.pitch,cue:state.cue,force:+$('force').value,skate:+$('skate').value,light:document.documentElement.dataset.theme==='light'});
    if(!camera.micro)fan.draw(state.selected,dt,reduced.matches);
    if(t&&now-displayTime>120){displayTime=now;$('rpm-value').textContent=(t.wp*60/TAU).toFixed(2)+' RPM';
      const track=state.record?.tracks.find(k=>t.theta>=k.theta0&&t.theta<k.theta1);
      $('track-current').textContent=t.hc>.0001?'Needle raised':track?`${track.title} · ${format((t.theta-track.theta0)/W33)}`:t.theta>=state.record?.thetaLock?'Run-out groove':'Lead-in / between tracks';
      if(track&&document.activeElement!==$('cut-track'))$('cut-track').value=state.record.tracks.indexOf(track);
      update();if(!$('needle-scope').hidden){$('groove-stats').textContent=contactText(t)+(camera.micro?' · drag to orbit / pinch to zoom':'');}
      $('contact-forces').textContent=contactText(t);
    }
  }catch(error){failure('The 3D view could not draw. The catalogue links still work.');console.error(error);return;}
  const moving=placement.moving||!!camera.target||state.cutting||Math.abs(fan.amount-state.selected)>.001||state.ready&&(Math.abs(t?.wp||0)>.02||t?.auto);
  if(moving)invalidate();
}

try{
  renderer=new Renderer(canvas);microscope=new GrooveSurface(renderer.gl);fan=new AlbumFan(renderer,albums,invalidate);canvas.hidden=false;$('scene-fallback').hidden=true;
  gestureCleanup=connectGestures({canvas,renderer,fan,camera,getState:()=>({...state,ready:state.ready&&placement.placed,recordHeld:placement.phase==='held',recordMatrix:placement.visible&&!placement.placed?placement.matrix:null,skate:+$('skate').value,volume:+$('volume').value,al:state.tel?.al??ALPHA_REST}),command,select:sceneAlbum,hover:index=>{if(fan.hover===index)return;fan.hover=index;$('hover-info').hidden=index===null;if(index!==null){const a=albums[index];$('hover-info').textContent=a.title+' · '+a.artist+' · '+a.year+' · '+a.tracks.length+' tracks';}invalidate();},invalidate});

  new ResizeObserver(invalidate).observe(canvas);new MutationObserver(invalidate).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  new IntersectionObserver(entries=>{shown=entries[0].isIntersecting;if(shown)invalidate();}).observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();unavailable=true;gestureCleanup?.();audio.silence();update();shown=false;canvas.hidden=true;$('scene-fallback').hidden=false;$('scene-fallback').textContent='The 3D view lost its graphics context. Reload to restart the player; the catalogue links still work.';status('Player stopped. Reload to restore the 3D view.');});
  setView(phone.matches?'deck':'room');selectAlbum(0,false);status('Polygondwanaland is first. Take out the demo record to begin.');update();
}catch(error){unavailable=true;console.error(error);$('scene-fallback').textContent='The 3D player is unavailable in this browser. The complete collection and listening links are below.';status('The 3D player is unavailable.');for(const b of root.querySelectorAll('.deck-strip button,.view-strip button'))b.disabled=true;}
  document.querySelectorAll('[data-record]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>{selectAlbum(albums.findIndex(a=>a.id===button.dataset.record));document.querySelector('.listening-desk').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});});});
if(unavailable)selectAlbum(0,false);
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{setView(button.dataset.view);if(button.dataset.view!=='crate'&&!listening.active)$('sleeve-detail').hidden=true;}));
$('reset-view').onclick=()=>setView(phone.matches?'deck':'room');
$('look-only').onclick=()=>{state.lookOnly=!state.lookOnly;$('look-only').setAttribute('aria-pressed',String(state.lookOnly));$('gesture-hint').textContent=state.lookOnly?'Drag anywhere to look · pinch or scroll to zoom':gestureHint();};
$('take-record').onclick=takeRecord;
$('put-on').onclick=()=>!placement.visible?(selectAlbum(albums.indexOf(defaultAlbum),false),takeRecord()):placement.phase==='held'?placeRecord():readyAction(()=>{state.motor=true;audio.send({t:'motor',on:true});audio.send({t:'cueTo',al:alphaForRadius(R_LEADIN-.0012)});});
$('motor').onclick=()=>command('motor');$('cue').onclick=()=>command('cue');$('speed33').onclick=()=>command('speed33');$('speed45').onclick=()=>command('speed45');
$('adjust-toggle').onclick=()=>{listening.stop();const open=$('adjustments').hidden;$('adjustments').hidden=!open;$('sleeve-detail').hidden=true;$('adjust-toggle').setAttribute('aria-expanded',String(open));};
$('close-adjustments').onclick=()=>{$('adjustments').hidden=true;$('adjust-toggle').setAttribute('aria-expanded','false');};$('close-sleeve').onclick=()=>{listening.stop();$('sleeve-detail').hidden=true;};
$('previous-album').onclick=()=>selectAlbum(state.selected-1);$('next-album').onclick=()=>selectAlbum(state.selected+1);
for(const id of ['choose-files','sleeve-files'])$(id).onclick=()=>{$('audio-files').value='';$('audio-files').click();};
$('audio-files').onchange=e=>cutFiles(e.target.files);$('house-record').onclick=()=>{selectAlbum(albums.indexOf(defaultAlbum),false);takeRecord();};$('synth-record').onclick=()=>beginCut('demo');$('cancel-cut').onclick=cancelCut;
$('press-again').onclick=()=>{condition=$('condition').value;beginCut(sourceKind,sourceFiles);};
$('bump').onclick=()=>readyAction(()=>audio.send({t:'bump',s:+$('knock-strength').value}));
$('pitch').oninput=e=>command('pitch',{value:+e.target.value});
for(const [id,label,suffix]of [['force','force-value',' g'],['skate','skate-value',' g'],['volume','volume-value','%']])$(id).oninput=()=>{$(label).textContent=(id==='volume'?$(id).value:(+$(id).value).toFixed(2))+suffix;applyParams();invalidate();};
$('stylus-type').onchange=applyParams;
$('cut-track').onchange=()=>{const k=state.record?.tracks[+$('cut-track').value];if(k)command('cueTo',{al:alphaForRadius(grooveRadius(state.record.rTab,k.theta0+.2))});};
canvas.addEventListener('dragover',e=>e.preventDefault());canvas.addEventListener('drop',e=>{e.preventDefault();cutFiles(e.dataTransfer.files);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){listening.stop();$('sleeve-detail').hidden=true;$('adjustments').hidden=true;$('adjust-toggle').setAttribute('aria-expanded','false');}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){gestureCleanup?.();}else invalidate();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
window.addEventListener('pagehide',()=>{cancelDownload();listening.dispose();clearTimeout(pendingPressingTimer);alive=false;job++;worker?.terminate();audio.dispose();fan?.dispose();cancelAnimationFrame(renderFrame);});
