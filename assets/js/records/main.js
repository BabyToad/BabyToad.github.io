import {createPlayback} from './playback.js';
import {createVinylTexture} from './texture.js';
const root=document.querySelector('[data-records]');
const records=JSON.parse(document.getElementById('records-data').textContent);
const byId=id=>document.getElementById(id);
const stage=byId('turntable-stage'),consent=byId('stream-consent'),stream=byId('record-stream');
const place=byId('place-record'),cue=byId('cue-record'),back=byId('return-record');
const texture=createVinylTexture();
let selected=records[0],placed=false,state='idle',scene,sceneLoading=false,trackIndex=0,position=0,duration=0;
const time=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
function status(text){byId('record-status').textContent=text;}
function update() {
  place.disabled=placed;back.disabled=!placed;
  cue.disabled=!placed||!consent.checked||['connecting','external'].includes(state);
  cue.textContent={playing:'Lift needle',buffering:'Lift needle',connecting:'Connecting…',ready:'Play preview',error:'Retry preview',external:'Use Bandcamp controls',ended:'Replay preview'}[state]||'Lower needle';
  byId('track-current').textContent=`${String(trackIndex+1).padStart(2,'0')} / ${String(selected.tracks.length).padStart(2,'0')} · ${selected.tracks[trackIndex].title}`;
  byId('preview-time').textContent=`${time(position)} / ${duration?time(duration):'0:30'} preview`;
  byId('preview-progress').value=duration?position/duration:0;
  root.querySelectorAll('[data-track]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.track)===trackIndex)));
  const albumLength=selected.tracks.reduce((sum,t)=>sum+t.durationMs,0);
  const groove=(selected.tracks.slice(0,trackIndex).reduce((sum,t)=>sum+t.durationMs,0)+Math.min(position,selected.tracks[trackIndex].durationMs))/albumLength;
  scene?.setState({album:selected,placed,cued:['connecting','playing','buffering'].includes(state),playing:state==='playing',trackIndex,progress:groove});
  texture.setPlaying(state==='playing');
}
const playback=createPlayback(root.querySelector('.stream-frame'),(next,message,detail={})=>{
  state=next;const index=selected.tracks.findIndex(track=>track.uri===detail.uri);if(index>=0)trackIndex=index;
  if(detail.position!==undefined)position=detail.position;if(detail.duration!==undefined)duration=detail.duration;
  if(byId('record-status').textContent!==message)status(message);update();
});
function select(album) {
  playback.stop();stream.hidden=true;selected=album;placed=false;state='idle';trackIndex=0;position=duration=0;
  root.querySelectorAll('[data-record]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.record===album.id)));
  byId('album-picker').value=album.id;byId('selected-title').textContent=album.title;
  byId('selected-artist').textContent=`${album.artist} · ${album.year}`;
  byId('record-number').textContent=`${String(records.indexOf(album)+1).padStart(2,'0')} / ${String(records.length).padStart(2,'0')}`;
  byId('selected-cover').src=album.cover;byId('selected-cover').alt=`${album.title} cover`;
  byId('album-context').textContent=album.context;byId('edition-note').textContent=`${album.tracks.length} tracks · ${time(album.tracks.reduce((sum,t)=>sum+t.durationMs,0))} · streaming edition`;
  byId('album-link').href=album.url;byId('spotify-link').href=`https://open.spotify.com/album/${album.spotifyId}`;
  byId('bandcamp-option').hidden=!album.bandcampId;
  byId('track-list').replaceChildren(...album.tracks.map((track,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.dataset.track=index;
    for(const [cls,text]of [['track-number',String(index+1).padStart(2,'0')],['track-title',track.title],['track-length',time(track.durationMs)]]){const span=document.createElement('span');span.className=cls;span.textContent=text;button.append(span);}
    button.addEventListener('click',()=>chooseTrack(index));li.append(button);return li;
  }));
  status('Choose a track, place the record, then lower the needle.');update();
}
function placeRecord(){if(placed)return;placed=true;status(consent.checked?'On the platter. Lower the needle to hear a preview.':'On the platter. Enable Spotify previews to listen.');update();}
function cueRecord(){
  if(['external','connecting'].includes(state))return;
  if(!placed){placeRecord();return;}
  if(!consent.checked){status('Enable Spotify previews to listen.');consent.focus();return;}
  if(['playing','buffering'].includes(state)){playback.pause();return;}
  if(['paused','ready'].includes(state)){status('Starting preview…');playback.resume();return;}
  stream.hidden=false;byId('stream-caption').textContent='Spotify previews · roughly 30 seconds when signed out. Full listening is available through the album links.';
  playback.play(selected,trackIndex);
}
function chooseTrack(index){
  trackIndex=(index+selected.tracks.length)%selected.tracks.length;position=duration=0;update();
  if(!placed)placeRecord();
  if(!consent.checked||state==='external'){status('Track selected. Enable Spotify previews, then lower the needle.');return;}
  if(state==='connecting'){playback.play(selected,trackIndex);return;}
  if(['playing','paused','ready','buffering','ended'].includes(state))playback.track(selected.tracks[trackIndex].uri);
  else cueRecord();
}
function reset(returnToSleeve=false){playback.stop();stream.hidden=true;state='idle';position=duration=0;if(returnToSleeve)placed=false;status(returnToSleeve?'Back in its sleeve. Choose another record.':'Player disconnected.');update();}
function loadBandcamp(){
  if(!selected.bandcampId)return;playback.stop();consent.checked=false;state='external';placed=true;position=duration=0;stream.hidden=false;
  const frame=document.createElement('iframe'),css=getComputedStyle(document.documentElement),color=t=>css.getPropertyValue(t).trim().replace('#','');
  frame.title=`${selected.title} — artist’s Bandcamp player`;frame.src=`https://bandcamp.com/EmbeddedPlayer/album=${selected.bandcampId}/size=large/bgcol=${color('--bg')}/linkcol=${color('--accent')}/artwork=small/transparent=true/`;
  frame.allow='autoplay';root.querySelector('.stream-frame').append(frame);
  byId('stream-caption').textContent='Full album on Bandcamp. Use its controls; the turntable and surface-noise effect do not follow this external player.';
  status('Press Play in the Bandcamp player below.');update();stream.scrollIntoView({block:'center',behavior:'instant'});
}
root.querySelectorAll('[data-record]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>{if(button.dataset.record!==selected.id)select(records.find(a=>a.id===button.dataset.record));});});
byId('album-picker').addEventListener('change',event=>select(records.find(a=>a.id===event.target.value)));
for(const [id,step]of [['previous-record',-1],['next-record',1]])byId(id).addEventListener('click',()=>select(records[(records.indexOf(selected)+step+records.length)%records.length]));
byId('previous-track').addEventListener('click',()=>chooseTrack(trackIndex-1));byId('next-track').addEventListener('click',()=>chooseTrack(trackIndex+1));
place.addEventListener('click',placeRecord);cue.addEventListener('click',cueRecord);back.addEventListener('click',()=>reset(true));
consent.addEventListener('change',()=>{
  if(!consent.checked)reset();
  else if(state==='external'){reset();status('Bandcamp closed. Lower the needle for a Spotify preview.');}
  else status(placed?'Ready. Lower the needle for a preview.':'Previews enabled. Place a record first.');update();
});
byId('disconnect-stream').addEventListener('click',()=>{consent.checked=false;reset();consent.focus();});byId('load-bandcamp').addEventListener('click',loadBandcamp);
byId('vinyl-texture').addEventListener('change',async event=>{try{await texture.enable(event.target.checked);byId('texture-status').textContent=event.target.checked?'Surface noise on during Spotify playback.':'Surface noise off.';}catch(error){event.target.checked=false;byId('texture-status').textContent=error.message;}});
root.classList.add('is-enhanced');byId('album-catalogue').open=false;root.querySelectorAll('[data-enhanced]').forEach(element=>element.hidden=false);select(selected);
async function loadScene(){
  if(sceneLoading)return;sceneLoading=true;
  try{const {createTurntable}=await import('./scene.js');scene=createTurntable(stage,(action,id)=>{if(action==='select'){if(id!==selected.id)select(records.find(a=>a.id===id));}else if(action==='record')placeRecord();else cueRecord();},()=>{byId('scene-message').textContent='3D unavailable. Use the album selector and buttons.';stage.querySelector('.deck-fallback').hidden=false;},records);stage.querySelector('.deck-fallback').hidden=true;update();}
  catch(error){byId('scene-message').textContent='3D unavailable. Use the album selector and buttons.';console.warn('Records 3D unavailable',error);}
}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();loadScene();}},{rootMargin:'150px'});observer.observe(stage);
window.addEventListener('pagehide',event=>{reset();if(!event.persisted){scene?.dispose();texture.dispose();}});
