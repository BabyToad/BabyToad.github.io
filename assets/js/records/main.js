import {createPlayback} from './playback.js';
import {createVinylTexture} from './texture.js';
const root=document.querySelector('[data-records]');
const records=JSON.parse(document.getElementById('records-data').textContent);
const byId=id=>document.getElementById(id);
const stage=byId('turntable-stage'),consent=byId('stream-consent'),stream=byId('record-stream');
const place=byId('place-record'),cue=byId('cue-record'),back=byId('return-record');
function textureStatus(text){byId('texture-status').textContent=text;byId('quick-texture-status').textContent=text;}
const texture=createVinylTexture(textureStatus);
const browseHint=matchMedia('(pointer: coarse)').matches?'Swipe sideways through the sleeves · tap to choose or place · use Deck controls for precise adjustments':'Hover for a closer look · flick or Shift-scroll through the sleeves · tap to choose';
byId('scene-hint').textContent=browseHint;
let selected=records[0],placed=false,state='idle',scene,sceneLoading=false;
let trackIndex=0,position=0,duration=0,browserOpen=true,rpm=33.333,surface=.35;
let cueId=0;
let pendingPlayback=null,pendingAlbum=null,armParked=true,recordHome=true,sceneFailed=false;
const time=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
function status(text){byId('record-status').textContent=text;}
function update(){
  place.disabled=placed||Boolean(pendingAlbum)||(!recordHome&&!sceneFailed);back.disabled=!placed;
  cue.disabled=!placed||!consent.checked||state==='external';
  cue.textContent={playing:'Lift needle',buffering:'Lift needle',cueing:'Cancel cue',lifting:'Cancel cue',connecting:'Cancel connection',ready:'Play',error:'Retry playback',external:'Bandcamp controls',ended:'Replay'}[state]||'Lower needle';
  byId('track-current').textContent=`${String(trackIndex+1).padStart(2,'0')} / ${String(selected.tracks.length).padStart(2,'0')} · ${selected.tracks[trackIndex].title}`;
  const isPreview=duration>0&&duration<selected.tracks[trackIndex].durationMs-5000;
  byId('preview-time').textContent=state==='external'?'Use Bandcamp controls':duration?`${time(position)} / ${time(duration)}${isPreview?' · preview':''}`:'Waiting for Spotify';
  byId('desk-play').textContent=['playing','buffering'].includes(state)?'Pause':state==='cueing'||state==='connecting'?'Cancel':state==='external'?'Bandcamp':!consent.checked?'Enable & play':'Play';
  byId('desk-play').disabled=state==='external'||Boolean(pendingAlbum);
  byId('quick-noise').disabled=byId('vinyl-texture').disabled=state==='external';
  byId('quick-surface').value=Math.round(surface*100);byId('quick-surface-value').textContent=`${Math.round(surface*100)}%`;byId('quick-noise').checked=byId('vinyl-texture').checked;
  byId('preview-progress').value=duration?position/duration:0;
  root.querySelectorAll('[data-track]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.track)===trackIndex)));
  const albumLength=selected.tracks.reduce((sum,t)=>sum+t.durationMs,0);
  const groove=(selected.tracks.slice(0,trackIndex).reduce((sum,t)=>sum+t.durationMs,0)+Math.min(position,selected.tracks[trackIndex].durationMs))/albumLength;
  const cued=['cueing','connecting','ready','playing','buffering'].includes(state);
  if(cued)armParked=false;
  if(placed)recordHome=false;
  scene?.setState({album:selected,placed,cued,playing:state==='playing',motor:cued,cueId,held:['paused','ended'].includes(state),trackIndex,progress:groove,browserOpen,rpm,surface});
  texture.setPlaying(state==='playing');
}
const playback=createPlayback(root.querySelector('.stream-frame'),(next,message,detail={})=>{
  if(state==='cueing'&&pendingPlayback)return;
  state=next;const index=selected.tracks.findIndex(track=>track.uri===detail.uri);if(index>=0)trackIndex=index;
  if(detail.position!==undefined)position=detail.position;if(detail.duration!==undefined)duration=detail.duration;
  if(byId('record-status').textContent!==message)status(message);update();
});
function showHover(id){
  const album=records.find(item=>item.id===id);byId('hover-card').hidden=!album;if(!album)return;
  byId('hover-cover').src=album.cover;byId('hover-title').textContent=album.title;byId('hover-artist').textContent=album.artist;
  byId('hover-meta').textContent=`${album.year} · ${album.tracks.length} tracks · ${time(album.tracks.reduce((sum,t)=>sum+t.durationMs,0))}`;
  byId('hover-context').textContent=album.context;
}
function select(album){
  if(!album)return;
  if(album.id===selected.id&&byId('selected-title').textContent){pendingAlbum=null;byId('album-picker').value=selected.id;update();return;}
  if((placed||!recordHome||pendingAlbum)&&scene&&!sceneFailed){pendingAlbum=album;reset(true);status('Returning this record before changing the sleeve…');return;}
  pendingPlayback=null;playback.stop();stream.hidden=true;selected=album;placed=false;state='idle';trackIndex=0;position=duration=0;showHover(null);
  root.querySelectorAll('[data-record]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.record===album.id)));
  byId('album-picker').value=album.id;byId('selected-title').textContent=album.title;
  byId('selected-artist').textContent=`${album.artist} · ${album.year}`;byId('desk-album').textContent=`${album.artist} / ${album.title}`;
  byId('record-number').textContent=`${String(records.indexOf(album)+1).padStart(2,'0')} / ${String(records.length).padStart(2,'0')}`;
  byId('selected-cover').src=album.cover;byId('selected-cover').alt=`${album.title} cover`;
  byId('album-context').textContent=album.context;byId('edition-note').textContent=`${album.tracks.length} tracks · ${time(album.tracks.reduce((sum,t)=>sum+t.durationMs,0))} · streaming edition`;
  byId('album-link').href=album.url;byId('spotify-link').href=`https://open.spotify.com/album/${album.spotifyId}`;byId('bandcamp-option').hidden=!album.bandcampId;
  byId('track-list').replaceChildren(...album.tracks.map((track,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.dataset.track=index;
    for(const [cls,text]of [['track-number',String(index+1).padStart(2,'0')],['track-title',track.title],['track-length',time(track.durationMs)]]){const span=document.createElement('span');span.className=cls;span.textContent=text;button.append(span);}
    button.addEventListener('click',()=>chooseTrack(index));li.append(button);return li;
  }));
  status('Choose a sleeve, place the record, then lower the needle.');update();
}
function browse(step){select(records[(records.indexOf(pendingAlbum||selected)+step+records.length)%records.length]);}
function placeRecord(){if(placed||pendingAlbum)return;placed=true;status(consent.checked?'On the platter. Lower the needle for playback.':'On the platter. Enable Spotify to listen.');update();}
function beginCue(mode='start'){
  cueId++;pendingPlayback=mode;state='cueing';status('Motor starting. Moving the arm into the groove…');update();
  if(!scene||sceneFailed)queueMicrotask(startAfterNeedle);
}
function startAfterNeedle(){
  if(state!=='cueing'||!pendingPlayback||!consent.checked||!placed)return;
  const mode=pendingPlayback;pendingPlayback=null;state='connecting';stream.hidden=false;stream.classList.remove('is-bandcamp');
  byId('stream-caption').textContent='Spotify controls availability: full tracks when supported, otherwise previews.';
  status('Needle down. Connecting Spotify…');update();
  if(mode==='resume')playback.resume();else if(mode==='track')playback.track(selected.tracks[trackIndex].uri,selected.tracks[trackIndex].durationMs);else playback.play(selected,trackIndex);
}
function cueRecord(){
  if(state==='external')return;
  if(['cueing','lifting','connecting'].includes(state)){reset();return;}
  if(!placed){placeRecord();return;}
  if(!consent.checked){status('Enable Spotify to listen.');consent.focus();return;}
  if(['playing','buffering'].includes(state)){playback.pause();return;}
  if(state==='ready'){state='connecting';status('Starting playback…');update();playback.resume();return;}
  if(state==='ended'){position=duration=0;beginCue(playback.connected()?'track':'start');return;}
  beginCue(state==='paused'?'resume':'start');
}
function chooseTrack(index){
  const next=(index+selected.tracks.length)%selected.tracks.length;
  if(next===trackIndex)return;
  pendingAlbum=null;
  const reuse=playback.connected();
  if(state==='external'){trackIndex=next;position=duration=0;status('Track selected for Spotify. Bandcamp keeps its own controls.');update();return;}
  pendingPlayback=null;if(reuse)playback.pause();else playback.stop();
  trackIndex=next;position=duration=0;
  if(!placed){state='idle';status('Track selected. Place the record when ready.');update();return;}
  if(!consent.checked){state='idle';status('Track selected. Enable Spotify, then press Play.');update();return;}
  beginCue(reuse?'track':'start');
}

function reset(returnToSleeve=false){pendingPlayback=null;playback.stop();stream.hidden=true;state='idle';position=duration=0;if(returnToSleeve)placed=false;status(returnToSleeve?'Returning the record to its sleeve.':'Player disconnected.');update();}
function loadBandcamp(){
  if(!selected.bandcampId)return;
  pendingPlayback=null;playback.stop();consent.checked=false;state='external';byId('vinyl-texture').checked=false;texture.enable(false);textureStatus('Crackle test only with Bandcamp.');placed=true;position=duration=0;stream.hidden=false;stream.classList.add('is-bandcamp');setPanel('album-info',false);
  const frame=document.createElement('iframe'),css=getComputedStyle(document.documentElement),color=t=>css.getPropertyValue(t).trim().replace('#','');
  frame.title=`${selected.title} — artist’s Bandcamp player`;frame.src=`https://bandcamp.com/EmbeddedPlayer/album=${selected.bandcampId}/size=large/bgcol=${color('--bg')}/linkcol=${color('--accent')}/artwork=small/transparent=true/`;
  frame.allow='autoplay';root.querySelector('.stream-frame').append(frame);
  byId('stream-caption').textContent='Full album · Bandcamp controls playback. The deck and surface noise remain independent.';status('Press Play in the Bandcamp dock.');update();
}
function setPanel(id,open){
  byId(id).hidden=!open;byId(id==='album-info'?'info-toggle':'settings-toggle').setAttribute('aria-expanded',String(open));
  if(open){setPanel(id==='album-info'?'deck-settings':'album-info',false);showHover(null);}
}
function setSpeed(value){rpm=value===45?45:33.333;byId('platter-speed').value=String(rpm);byId('rpm-readout').textContent=rpm===45?'45 RPM':'33⅓ RPM';status(`${rpm===45?'45':'33⅓'} RPM platter. Music speed stays unchanged.`);update();}
async function setSurface(value,enable=false){
  surface=Math.max(0,Math.min(1,value));byId('surface-level').value=Math.round(surface*100);byId('surface-readout').textContent=`${Math.round(surface*100)}%`;texture.setLevel(surface);
  if(enable&&state!=='external')byId('vinyl-texture').checked=surface>0;
  if(enable&&navigator.userActivation&&!navigator.userActivation.hasBeenActive){byId('vinyl-texture').checked=false;status('Click the surface knob or enable surface noise in Deck controls.');update();return;}
  try{await texture.enable(byId('vinyl-texture').checked);textureStatus(state==='external'?'Crackle test only with Bandcamp.':byId('vinyl-texture').checked?'Crackle follows Spotify playback.':'Crackle off.');}
  catch(error){byId('vinyl-texture').checked=false;textureStatus(error.message);}
  update();
}
function sceneAction(action,value){
  if(action==='select')select(records.find(a=>a.id===value));
  else if(action==='hover'){if(byId('album-info').hidden&&byId('deck-settings').hidden)showHover(value);}
  else if(action==='control')byId('scene-hint').textContent={surface:'Crackle · click for the level slider, or drag sideways',track:'Tracks · click to choose from the list',speed:'33⅓ / 45 RPM · changes the platter, not the music speed',arm:'Cue lever · tap to lower or lift the needle',record:'Pull this record out and drop it onto the platter'}[value]||browseHint;
  else if(action==='browse')browse(value);
  else if(action==='record')placeRecord();
  else if(action==='arm')cueRecord();
  else if(action==='park')reset();
  else if(action==='surface')setSurface(value,true);
  else if(action==='surface-control'){setPanel('deck-settings',true);byId('surface-level').focus();}
  else if(action==='track-control'){setPanel('album-info',true);byId('track-list').querySelector('[aria-pressed=true]')?.focus();}
  else if(action==='speed')setSpeed(value);
  else if(action==='track'){if(placed)chooseTrack(trackIndex+value);else status('Place a record before using the track knob.');}
  else if(action==='settled'&&value==='needle')startAfterNeedle();
  else if(action==='settled'&&value==='arm'&&!['cueing','connecting','ready','playing','buffering'].includes(state)){armParked=true;if(state==='lifting'&&pendingPlayback)beginCue(pendingPlayback);}
  else if(action==='settled'&&value==='record'){recordHome=true;if(pendingAlbum){const album=pendingAlbum;pendingAlbum=null;select(album);}else update();}
}
root.querySelectorAll('[data-record]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>select(records.find(a=>a.id===button.dataset.record)));});
byId('album-picker').addEventListener('change',event=>select(records.find(a=>a.id===event.target.value)));
for(const [id,step]of [['previous-record',-1],['next-record',1]])byId(id).addEventListener('click',()=>browse(step));
byId('fan-toggle').addEventListener('click',()=>{browserOpen=!browserOpen;byId('fan-toggle').setAttribute('aria-pressed',String(browserOpen));byId('fan-toggle').textContent=browserOpen?'Fold sleeves':'Open sleeves';showHover(null);update();});
byId('info-toggle').addEventListener('click',()=>setPanel('album-info',byId('album-info').hidden));byId('settings-toggle').addEventListener('click',()=>setPanel('deck-settings',byId('deck-settings').hidden));
root.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>{setPanel(button.dataset.close,false);byId(button.dataset.close==='album-info'?'info-toggle':'settings-toggle').focus();}));
root.addEventListener('keydown',event=>{if(event.key==='Escape'){const open=!byId('album-info').hidden?'info-toggle':!byId('deck-settings').hidden?'settings-toggle':null;setPanel('album-info',false);setPanel('deck-settings',false);showHover(null);if(open)byId(open).focus();}});
byId('previous-track').addEventListener('click',()=>chooseTrack(trackIndex-1));byId('next-track').addEventListener('click',()=>chooseTrack(trackIndex+1));
place.addEventListener('click',placeRecord);cue.addEventListener('click',cueRecord);back.addEventListener('click',()=>reset(true));
consent.addEventListener('change',()=>{if(!consent.checked)reset();else if(state==='external'){reset();status('Bandcamp closed. Lower the needle for Spotify playback.');}else status(placed?'Ready. Lower the needle for playback.':'Spotify enabled. Place a record first.');update();});
byId('disconnect-stream').addEventListener('click',()=>{consent.checked=false;reset();consent.focus();});byId('load-bandcamp').addEventListener('click',loadBandcamp);
byId('desk-play').addEventListener('click',()=>{if(!consent.checked)consent.checked=true;if(!placed)placeRecord();cueRecord();});
byId('desk-previous').addEventListener('click',()=>chooseTrack(trackIndex-1));byId('desk-next').addEventListener('click',()=>chooseTrack(trackIndex+1));
byId('quick-noise').addEventListener('change',e=>{byId('vinyl-texture').checked=e.target.checked;setSurface(surface);});
byId('quick-surface').addEventListener('input',e=>setSurface(Number(e.target.value)/100,true));
for(const id of ['test-texture','quick-test'])byId(id).addEventListener('click',async()=>{try{await texture.audition();}catch(error){textureStatus(error.message);}});
byId('platter-speed').addEventListener('change',event=>setSpeed(Number(event.target.value)));byId('surface-level').addEventListener('input',event=>setSurface(Number(event.target.value)/100,true));byId('vinyl-texture').addEventListener('change',()=>setSurface(surface));
root.classList.add('is-enhanced');byId('album-catalogue').open=false;root.querySelectorAll('[data-enhanced]').forEach(element=>element.hidden=false);select(selected);
function sceneUnavailable(){sceneFailed=true;byId('scene-message').textContent='3D unavailable. Use the album selector and controls.';stage.querySelector('.deck-fallback').hidden=false;if(pendingAlbum){const album=pendingAlbum;pendingAlbum=null;select(album);}else if(state==='lifting')beginCue(pendingPlayback);else if(state==='cueing')startAfterNeedle();}
async function loadScene(){
  if(sceneLoading)return;sceneLoading=true;
  try{const {createTurntable}=await import('./scene.js');scene=createTurntable(stage,sceneAction,sceneUnavailable,records);stage.querySelector('.deck-fallback').hidden=true;update();}
  catch(error){sceneUnavailable();console.warn('Records 3D unavailable',error);}
}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();loadScene();}},{rootMargin:'150px'});observer.observe(stage);
window.addEventListener('pagehide',event=>{reset();if(!event.persisted){scene?.dispose();texture.dispose();}});
