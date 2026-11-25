import { createPlayback } from './playback.js';

const root = document.querySelector('[data-records]');
const records = JSON.parse(document.getElementById('records-data').textContent);
const byId = id => document.getElementById(id);
const buttons = [...root.querySelectorAll('[data-record]')];
const stage = byId('turntable-stage');
const place = byId('place-record'), cue = byId('cue-record'), back = byId('return-record');
const consent = byId('youtube-consent'), stream = byId('record-stream');
let selected = records[0], placed = false, playbackState = 'idle', scene;
let sceneLoading = false;
function status(message) { byId('record-status').textContent = message; }
function update() {
  place.disabled = placed;
  back.disabled = !placed;
  cue.disabled = !placed || !consent.checked || playbackState === 'external';
  cue.textContent = playbackState === 'playing' ? 'Lift needle' : playbackState === 'error' ? 'Retry playback' : 'Lower needle';
  if(playbackState==='external') cue.textContent='Use Bandcamp controls';
  scene?.setState({ album: selected, placed, cued: ['playing','buffering','connecting','ready'].includes(playbackState), playing: playbackState === 'playing' });
}
const playback = createPlayback(root.querySelector('.stream-frame'), (state, message) => {
  playbackState = state;
  status(message);
  update();
});
function select(album) {
  playback.stop();
  stream.hidden = true;
  selected = album; placed = false; playbackState = 'idle';
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.record === album.id)));
  byId('selected-title').textContent = album.title;
  byId('selected-artist').textContent = `${album.artist} · ${album.year}`;
  byId('record-number').textContent = `${String(records.indexOf(album)+1).padStart(2,'0')} / ${String(records.length).padStart(2,'0')}`;
  byId('album-link').href = album.url;
  byId('bandcamp-option').hidden = !album.bandcampId;
  byId('liner-note').textContent = album.note || 'Take it out of the sleeve. Give it a side.';
  byId('stream-caption').textContent = `${album.title} — official album playlist on YouTube. Use its controls to choose tracks or adjust volume.`;
  status('In its sleeve. Place the record to begin.');
  update();
}
function placeRecord() {
  if (placed) return;
  placed = true;
  status(consent.checked ? 'On the platter. Lower the needle when you’re ready.' : 'On the platter. Enable YouTube playback, then lower the needle.');
  update();
}
function cueRecord() {
  if (!placed) { placeRecord(); return; }
  if (!consent.checked) { status('Enable YouTube playback to listen.'); consent.focus(); return; }
  if (playbackState === 'playing') {
    playback.pause(); playbackState = 'paused'; status('Needle lifted.'); update();
  } else if (['paused','ready'].includes(playbackState)) {
    status('Starting playback…'); playback.resume();
  } else if (!['connecting','buffering'].includes(playbackState)) {
    stream.hidden = false;
    playback.play(selected);
  }
}
function returnRecord() {
  playback.stop(); stream.hidden = true; playbackState = 'idle'; placed = false;
  status('Back in its sleeve. Choose another record, or place this one again.'); update();
}
function disconnect() {
  playback.stop(); consent.checked = false; stream.hidden = true; playbackState = 'idle';
  status('Player disconnected.'); update();
}
function loadBandcamp() {
  if(!selected.bandcampId) return;
  playback.stop(); consent.checked=false; placed=true; playbackState='external'; stream.hidden=false;
  const frame=document.createElement('iframe');
  frame.title=`${selected.title} by ${selected.artist} on Bandcamp`;
  frame.src=`https://bandcamp.com/EmbeddedPlayer/album=${selected.bandcampId}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/`;
  frame.setAttribute('allow','autoplay');
  root.querySelector('.stream-frame').append(frame);
  byId('stream-caption').textContent=`${selected.title} — the artist’s Bandcamp player. Playback is controlled here; the turntable cannot follow its play/pause state.`;
  status('Bandcamp loaded. Press Play in the player below.'); update();
  stream.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
}
buttons.forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => select(records.find(record => record.id === button.dataset.record)));
});
place.addEventListener('click', placeRecord);
cue.addEventListener('click', cueRecord);
back.addEventListener('click', returnRecord);
consent.addEventListener('change', () => {
  if (!consent.checked) disconnect();
  else { status(placed ? 'Ready. Lower the needle to connect and listen.' : 'Playback enabled. Place a record first.'); update(); }
});
byId('disconnect-stream').addEventListener('click', () => { disconnect(); consent.focus(); });
byId('load-bandcamp').addEventListener('click', loadBandcamp);
root.querySelector('.listening-desk').hidden = false;
select(selected);

// Lazy enhancement: the HTML selection and playback remain usable if WebGL fails.
async function loadScene() {
  if (sceneLoading) return;
  sceneLoading = true;
  try {
    const { createTurntable } = await import('./scene.js');
    scene = createTurntable(stage, action => action === 'record' ? placeRecord() : cueRecord(), () => {
      byId('scene-message').textContent = 'The 3D view is unavailable. Use the controls below.';
      stage.querySelector('.deck-fallback').hidden = false;
    });
    stage.querySelector('.deck-fallback').hidden = true;
    update();
  } catch (error) {
    byId('scene-message').textContent = 'The 3D view is unavailable. Use the controls below.';
    console.warn('Record player visual enhancement unavailable:', error);
  }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadScene(); }
  }, { rootMargin: '100px' });
  observer.observe(stage);
} else loadScene();
window.addEventListener('pagehide', event => {
  playback.stop(); stream.hidden = true; playbackState = 'idle'; update();
  if (!event.persisted) scene?.dispose();
});
