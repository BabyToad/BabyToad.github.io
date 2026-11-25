import { loadPrecut } from './precut.js';
import { RecordPlacement } from './placement.js';
import { createListeningPanel } from './listening.js';
import { Renderer } from './physics/render.js';
import { AlbumFan } from './fan.js';
import { createPhysicalAudio } from './audio.js';
import { connectGestures } from './input.js';
import { TAU } from './physics/dsp.js';
import { ALPHA_REST, R_LEADIN, W33, alphaForRadius, grooveRadius, stylusXY } from './physics/geometry.js';

const $ = id => document.getElementById(id);
const root = document.querySelector('[data-records]');
const albums = JSON.parse($('records-data').textContent);
const canvas = $('record-stage');
const mediaBase = new URL(root.dataset.mediaBase || '/', location.href);
for (const album of albums) {
  for (const track of album.audioTracks || []) track.url = new URL(track.url, mediaBase).href;
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const phone = matchMedia('(max-width: 600px)');
const stacked = matchMedia('(max-width: 900px)');
const prepared = JSON.parse($('precut-data').textContent) || [];
const precutEntries = Array.isArray(prepared) ? prepared : prepared.tracks || [];
const defaultAlbum = albums.find(a => a.id === 'polygondwanaland') || albums[0];
const placement = new RecordPlacement();

let pressingAlbum = null;
let handlingRequest = 0;
let handlingCut = false;
let activeDrawer = null; // 'sleeve' | 'adjust' | 'press' | null
let currentView = 'room';

const state = {
  selected: 0,
  tel: null,
  received: 0,
  record: null,
  sequence: 0,
  cutting: false,
  ready: false,
  motor: false,
  cue: true,
  rpm: 100 / 3,
  pitch: 0,
  lookOnly: false,
  source: defaultAlbum.title,
  sourceDetail: ''
};

const camera = { az: -.28, el: .56, distance: 1.72, focus: [-.26, .02, .02], follow: false, target: null, micro: false };
let renderer, fan, worker, job = 0, renderFrame = 0, lastFrame = 0, alive = true, shown = true, gestureCleanup;
let unavailable = false, pendingPressing = null, pendingPressingTimer;
let downloadAbort = null, downloadJob = 0;
let sourceFiles = null, sourceKind = 'demo', condition = 'clean', audioPending = false;
let servicePhase = '';

const conditions = {
  clean: { noise: .2, dust: 0, scratches: 0, warp: .15, offCenter: .08, echo: .1 },
  played: { noise: .7, dust: .2, scratches: .2, warp: .15, offCenter: .08, echo: .5 },
  worn: { noise: 1, dust: .7, scratches: .6, warp: .3, offCenter: .15, echo: 1 }
};

const format = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const serviceRadius = f => R_LEADIN - .0012 - Math.max(0, Math.min(1, f)) * .08;
const serviceFraction = r => Math.max(0, Math.min(1, (R_LEADIN - .0012 - r) / .08));
function serviceAngle() {
  return state.serviceSeek ?? alphaForRadius(serviceRadius(listening.playback.position / (listening.playback.duration || 1)));
}

function status(message) {
  if ($('record-status').textContent !== message) $('record-status').textContent = message;
}
function setProgress(fraction) {
  const wrap = $('load-progress'), bar = $('load-progress-bar');
  if (fraction === null || fraction === undefined) {
    wrap.hidden = true;
    bar.style.width = '0%';
  } else {
    wrap.hidden = false;
    bar.style.width = `${Math.max(4, Math.min(100, Math.round(fraction * 100)))}%`;
  }
}
function failure(message) {
  setProgress(null);
  status(message);
  audioPending = false;
  update();
}

const audio = createPhysicalAudio(
  t => {
    if (t.recSeq !== state.sequence) return;
    const previous = state.tel;
    const changed = !previous
      || (Math.abs(t.wp) > .02 && Math.abs(t.wp - previous.wp) > .002)
      || Math.abs(t.al - previous.al) > 1e-5
      || Math.abs(t.zb - previous.zb) > 1e-5
      || Math.abs(t.plinth - previous.plinth) > 1e-7
      || t.motor !== previous.motor
      || t.cueUp !== previous.cueUp
      || !!t.auto;
    state.tel = t;
    state.received = performance.now();
    state.motor = t.motor;
    state.cue = t.cueUp;
    state.ready = true;
    if (pendingPressing && Math.abs(t.wp) < .01 && t.hc >= .001) {
      const install = pendingPressing;
      pendingPressing = null;
      install();
      return;
    }
    if (changed || Math.abs(t.wp) > .02) invalidate();
  },
  () => {
    if (pendingPressing && audio.context?.state !== 'running') {
      const install = pendingPressing;
      pendingPressing = null;
      install(true);
    }
    invalidate();
  },
  failure
);

const listening = createListeningPanel($('album-listening'), {
  maxCutSeconds: () => (phone.matches ? 180 : 600),
  beforePlay: async ({ provider }) => {
    cancelDownload();
    if (state.cutting) cancelCut();
    gestureCleanup?.();
    await audio.silence();
    state.tel = null; state.ready = false; state.motor = false; state.cue = true;
    $('rpm-value').textContent = '0.00 RPM';
    $('track-current').textContent = '';
    setView('deck');
    status('Connecting ' + provider + '…');
    update();
    invalidate();
  },
  onStop: () => {
    status(placement.placed ? 'Player closed. Physical record is on the platter.' : 'Player closed.');
    update();
    invalidate();
  },
  onPlayback: () => { update(); invalidate(); },
  onCut: cutOfficialTrack
});

function sleeveHome() {
  fan.frozen = true;
  return fan.recordHome(state.selected);
}

function openDrawer(kind) {
  if (kind !== 'sleeve' && listening.active) listening.stop();
  activeDrawer = kind;
  $('hover-info').hidden = true;
  $('sleeve-detail').hidden = kind !== 'sleeve';
  $('adjustments').hidden = kind !== 'adjust';
  $('press-panel').hidden = kind !== 'press';
  $('open-sleeve').setAttribute('aria-expanded', String(kind === 'sleeve'));
  $('adjust-toggle').setAttribute('aria-expanded', String(kind === 'adjust'));
  $('press-toggle').setAttribute('aria-expanded', String(kind === 'press'));
  root.classList.toggle('drawer-open', !!kind);

  // Reframe cleanly on desktop so the drawer never covers the active 3D subject.
  if (!stacked.matches && currentView !== 'stylus') setView(currentView, { keepDrawer: true });
  invalidate();
}

function viewPose(name) {
  const portrait = stacked.matches;
  const narrowPhone = phone.matches;
  const drawerShift = !portrait && activeDrawer ? 1 : 0;
  const views = {
    room: {
      focus: [-0.26, 0.02, narrowPhone ? 0.04 : 0.02],
      distance: narrowPhone ? 2.68 : portrait ? 2.18 : 1.72,
      az: narrowPhone ? -0.22 : -0.26,
      el: narrowPhone ? 0.52 : 0.56
    },
    deck: {
      focus: [0.04, -0.01, -0.02],
      distance: portrait ? 1.48 : 1.04,
      az: portrait ? -0.10 : -0.26,
      el: portrait ? 0.86 : 0.72
    },
    crate: {
      focus: [-0.60, 0.02, 0.08],
      distance: narrowPhone ? 1.42 : portrait ? 1.24 : 1.06,
      az: -0.05,
      el: 0.24
    },
    stylus: {
      focus: [...stylusXY(state.tel?.al ?? ALPHA_REST), 0.002],
      distance: 0.12,
      az: -0.45,
      el: 0.20
    }
  };
  const target = views[name] || views.room;
  const focus = target.focus.slice();
  if (drawerShift && name !== 'stylus') {
    // Shift camera target right along view-right axis so subject sits centered in the open left 68%.
    const shift = target.distance * 0.11;
    focus[0] += Math.cos(target.az) * shift;
    focus[1] += Math.sin(target.az) * shift;
  }
  return { ...target, focus };
}

function setView(name, { keepDrawer = false } = {}) {
  if (name === 'grooves') name = 'stylus';
  currentView = name;
  const target = viewPose(name);
  if (reduced.matches) Object.assign(camera, target, { target: null });
  else camera.target = target;
  camera.follow = name === 'stylus';
  $('needle-scope').hidden = name !== 'stylus';
  audio.send({ t: 'view', on: false, micro: false });
  if (!keepDrawer && name !== 'crate' && !listening.active && activeDrawer === 'sleeve') {
    activeDrawer = null;
    $('sleeve-detail').hidden = true;
    $('open-sleeve').setAttribute('aria-expanded', 'false');
    root.classList.remove('drawer-open');
    const recentered = viewPose(name);
    if (reduced.matches) Object.assign(camera, recentered, { target: null });
    else camera.target = recentered;
  }
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
  invalidate();
}

function selectAlbum(index, inspect = false) {
  if (placement.moving) return;
  handlingRequest++;
  if (handlingCut && index !== state.selected) cancelCut();
  cancelDownload();
  state.selected = Math.max(0, Math.min(albums.length - 1, index));
  const a = albums[state.selected];

  $('selected-title').textContent = a.title;
  $('selected-artist').textContent = a.artist;
  $('selected-meta').textContent = `${a.year} · ${a.tracks.length} tracks`;
  $('selected-cover').src = a.cover;
  $('selected-cover').alt = `${a.title} cover`;
  $('album-context').textContent = a.context;
  listening.selectAlbum(a);

  const atFirst = state.selected === 0, atLast = state.selected === albums.length - 1;
  $('previous-album').disabled = $('dock-prev').disabled = atFirst;
  $('next-album').disabled = $('dock-next').disabled = atLast;
  $('album-number').textContent = $('dock-index').textContent = `${state.selected + 1} / ${albums.length}`;
  $('album-tracks').replaceChildren(...a.tracks.map(t => Object.assign(document.createElement('li'), { textContent: t.title })));
  document.querySelectorAll('[data-record]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.record === a.id)));

  if (!placement.visible && !listening.active && !state.cutting) {
    status(a.audioTracks?.length
      ? 'Click front sleeve to take out · drag sleeves to browse'
      : `${a.artist} · click sleeve or Listen`);
  }

  if (inspect) {
    openDrawer('sleeve');
    setView('crate', { keepDrawer: true });
  }
  update();
  invalidate();
}

function sceneAlbum(index, tapped = true) {
  if (placement.moving) return;
  const wasSelected = index === state.selected;
  if (!tapped) {
    // Horizontal swipe in the crate: browse smoothly without opening drawers or starting network loads.
    selectAlbum(index, false);
    return;
  }
  if (!wasSelected) {
    // First tap on a background sleeve brings it cleanly to the front so artwork is readable.
    selectAlbum(index, activeDrawer === 'sleeve');
    return;
  }
  // Clicking the front-facing selected sleeve acts directly.
  const a = albums[index];
  if (a.audioTracks?.length && !placement.visible && !listening.active) {
    takeRecord();
  } else {
    selectAlbum(index, true);
  }
}

async function takeRecord() {
  if (unavailable || state.cutting || placement.moving) return;
  $('hover-info').hidden = true;
  if (placement.phase === 'held') return placeRecord();
  const a = albums[state.selected];
  if (!a.audioTracks?.length) return;
  listening.stop();
  openDrawer(null);
  setView('room');
  const request = ++handlingRequest;
  await audio.silence();
  if (request !== handlingRequest || !alive) return;
  state.tel = null; state.ready = false; state.motor = false; state.cue = true;
  $('rpm-value').textContent = '0.00 RPM';
  $('track-current').textContent = '';

  if (state.record && pressingAlbum === a.id) {
    if (placement.placed) placement.return(sleeveHome());
    else placement.extract(sleeveHome());
    status(placement.phase === 'returning' ? 'Returning record to its sleeve…' : 'Record in hand — click the platter to place it.');
    update();
    invalidate();
    return;
  }

  const track = a.audioTracks.find(t => t.title === 'The Castle In The Air')
    || a.audioTracks.find(t => t.durationSec <= (phone.matches ? 180 : 600));
  if (!track) return status('These tracks exceed this device’s browser-cutting limit. Use Play full recording.');
  try { await cutOfficialTrack({ album: a, track, handling: true }); }
  catch (error) { status(error.message); }
}

function returnRecord() {
  if (unavailable || state.cutting || placement.moving || !placement.visible) return;
  listening.stop();
  openDrawer(null);
  audio.silence().then(() => {
    if (!alive || !placement.visible || placement.moving) return;
    state.tel = null; state.ready = false; state.motor = false; state.cue = true;
    setView('room');
    if (pressingAlbum) {
      const idx = albums.findIndex(a => a.id === pressingAlbum);
      if (idx >= 0 && idx !== state.selected) selectAlbum(idx, false);
    }
    placement.return(sleeveHome());
    status('Returning record to its sleeve…');
    update();
    invalidate();
  });
}

function placeRecord() {
  if (placement.phase !== 'held' || state.cutting) return;
  $('hover-info').hidden = true;
  placement.place();
  setView('deck');
  status('Lowering onto the spindle…');
  update();
  invalidate();
}

function cancelDownload() {
  downloadJob++;
  if (downloadAbort) {
    downloadAbort.abort();
    downloadAbort = null;
    state.cutting = false;
    setProgress(null);
    status('Download cancelled.');
  }
}

async function cutOfficialTrack({ album, track, handling = false }) {
  if (unavailable) throw new Error('The 3D player is unavailable. You can still play the full recording.');
  cancelCut();
  const id = downloadJob;
  const controller = downloadAbort = new AbortController();
  await audio.silence();
  if (id !== downloadJob) return false;
  state.tel = null; state.ready = false; state.motor = false; state.cue = true;
  state.cutting = true;
  setProgress(0.08);
  update();
  const sizeMB = (track.sizeBytes / 1048576).toFixed(1);
  status(`Downloading ${track.title} (${sizeMB} MB)…`);
  try {
    const response = await fetch(track.url, { signal: controller.signal });
    if (!response.ok) throw new Error('The recording could not download. Try full playback or a service link.');
    const blob = await response.blob();
    if (id !== downloadJob || !alive) return false;
    if (blob.size !== track.sizeBytes) throw new Error('The download was incomplete. Try again or play the full recording.');
    const file = new File([blob], track.title + '.mp3', { type: 'audio/mpeg' });
    file.recordCredit = { title: album.title, artist: album.artist };
    downloadAbort = null;
    state.cutting = false;
    setProgress(0.5);
    openDrawer(null);
    setView(handling ? 'room' : 'deck');
    beginCut('official', [file], handling ? { albumId: album.id } : null);
    return true;
  } catch (error) {
    if (id !== downloadJob || error.name === 'AbortError') return false;
    downloadAbort = null;
    state.cutting = false;
    setProgress(null);
    const message = error.message === 'The download was incomplete. Try again or play the full recording.'
      ? error.message
      : 'The recording could not download. Try full playback or a service link.';
    status(message);
    update();
    throw new Error(message);
  }
}

function isPhysicalPlaying() {
  return placement.placed && !listening.active && state.motor && !state.cue;
}

function isArmOverGroove() {
  return state.tel && state.tel.al < ALPHA_REST - 0.04;
}

function update() {
  const a = albums[state.selected];
  const service = !!listening.active;
  const remote = listening.playback;
  const seated = !!state.record && placement.placed && !state.cutting && !unavailable && !service;
  const hasMultiTracks = seated && (state.record?.tracks?.length || 0) > 1;

  root.classList.toggle('service-listening', service);
  root.classList.toggle('service-volume', service && remote.capabilities.volume);

  // Sleeve physical section
  const hasOfficial = !!a.audioTracks?.length;
  $('sleeve-physical').hidden = !hasOfficial;
  $('take-record').disabled = state.cutting || placement.moving || unavailable;
  $('take-record').textContent = placement.placed && pressingAlbum === a.id
    ? 'Return record to sleeve'
    : placement.phase === 'held'
      ? 'Place on platter'
      : 'Take out demo record (6.9 MB)';

  // Mechanism drawer controls
  for (const id of ['motor', 'cue', 'press-again']) $(id).disabled = !seated || audioPending;
  if (sourceKind === 'precut') $('press-again').disabled = true;
  for (const id of ['speed33', 'speed45']) $(id).disabled = unavailable || service;
  $('motor').textContent = state.motor ? 'Stop motor' : 'Start motor';
  $('cue').textContent = state.cue ? 'Lower needle' : 'Lift needle';
  $('speed33').setAttribute('aria-pressed', String(state.rpm < 40));
  $('speed45').setAttribute('aria-pressed', String(state.rpm > 40));

  // Dock contextual visibility — show ONLY controls that apply right now.
  $('crate-stepper').hidden = service || placement.placed || placement.phase === 'held';
  $('cut-track').hidden = !hasMultiTracks;
  $('cut-track').disabled = !seated || !audio.ready || audioPending;
  $('return-record').hidden = !placement.visible || placement.moving || service;
  $('adjust-toggle').hidden = !seated;
  $('press-toggle').hidden = service;
  $('open-sleeve').hidden = service;
  $('volume-wrap').hidden = !(seated || (service && remote.capabilities.volume));
  $('volume').disabled = service ? !remote.capabilities.volume : false;
  $('cancel-cut').hidden = !state.cutting;

  // Primary contextual button
  const putOn = $('put-on');
  if (service) {
    putOn.disabled = !remote.capabilities.play;
    putOn.textContent = remote.phase === 'playing' ? `Pause ${listening.active}` : `Play ${listening.active}`;
  } else if (state.cutting) {
    putOn.disabled = true;
    putOn.textContent = 'Preparing…';
  } else if (placement.moving) {
    putOn.disabled = true;
    putOn.textContent = 'Moving…';
  } else if (placement.phase === 'held') {
    putOn.disabled = unavailable;
    putOn.textContent = 'Place on platter';
  } else if (placement.placed) {
    putOn.disabled = unavailable || audioPending;
    putOn.textContent = audioPending
      ? 'Starting…'
      : isPhysicalPlaying()
        ? 'Pause'
        : isArmOverGroove()
          ? 'Resume'
          : 'Put it on';
  } else {
    putOn.disabled = unavailable;
    putOn.textContent = hasOfficial ? 'Take out record' : 'Listen';
  }

  // Identity & state tag (single source of truth)
  if (service) {
    $('source-title').textContent = a.title;
    $('record-placement').textContent = listening.active;
    $('rpm-value').hidden = true;
    $('track-current').hidden = false;
    $('track-current').textContent = `${format(remote.position)} / ${format(remote.duration)}`;

    const phaseKey = listening.active + ':' + remote.phase;
    if (servicePhase !== phaseKey) {
      servicePhase = phaseKey;
      status(
        remote.phase === 'error'
          ? 'Player unavailable. Try another source or album link.'
          : remote.phase === 'ready'
            ? 'Ready — press Play if the browser paused autoplay.'
            : ({
              playing: `Playing via ${listening.active} · deck controls stream`,
              paused: 'Paused',
              buffering: 'Buffering…',
              connecting: 'Connecting…',
              ended: 'Finished'
            })[remote.phase] || remote.phase
      );
    }
  } else {
    servicePhase = '';
    $('source-title').textContent = placement.visible || state.cutting ? state.source : a.title;
    $('record-placement').textContent = state.cutting
      ? 'Cutting'
      : placement.phase === 'held'
        ? 'In hand'
        : placement.placed
          ? (isPhysicalPlaying() ? 'Spinning' : 'On platter')
          : 'In sleeve';
    $('rpm-value').hidden = !placement.placed;
    $('track-current').hidden = !placement.placed || !$('track-current').textContent;
  }

  updatePrecut();
  $('local-limit-note').textContent = phone.matches
    ? 'Cut WAV, MP3, FLAC, M4A or OGG locally (up to 3 min / 20 MB on phone).'
    : 'Cut WAV, MP3, FLAC, M4A or OGG locally (up to 10 min / 80 MB) — never uploaded.';
}

async function readyAction(fn) {
  if (!state.record || !placement.placed || state.cutting || unavailable || audioPending) return;
  listening.stop();
  const actionJob = job;
  audioPending = true;
  status('Warming the cartridge…');
  update();
  try {
    await audio.unlock();
    if (!alive) return;
    audioPending = false;
    if (state.cutting || actionJob !== job) { update(); return; }
    state.ready = true;
    applyParams();
    audio.send({ t: 'view', on: false, micro: false });
    status('Deck ready.');
    fn();
  } catch (error) {
    failure(error.message);
  }
  update();
  invalidate();
}

function command(action, data = {}) {
  if (listening.active) {
    if (action === 'hand') {
      if (data.on) {
        if (state.serviceSeek === undefined) state.serviceSeekStart = data.al;
        state.serviceSeek = data.al;
      } else {
        const al = state.serviceSeek, start = state.serviceSeekStart;
        delete state.serviceSeek;
        delete state.serviceSeekStart;
        if (!data.cancel && al !== undefined && Math.abs(al - start) > 1e-4) command('cueTo', { al });
      }
      invalidate();
      return;
    }
    if (action === 'cue' && data.up !== undefined) return;
    if (action === 'motor' || action === 'cue') return listening.transport('toggle');
    if (action === 'volume') {
      if (listening.transport('volume', data.value)) {
        $('volume').value = data.value;
        $('volume-value').textContent = data.value + '%';
        invalidate();
      } else {
        status('Use the volume control inside the ' + listening.active + ' player.');
      }
      return;
    }
    if (action === 'cueTo') {
      const r = Math.hypot(...stylusXY(data.al));
      const fraction = serviceFraction(r);
      return listening.transport('seek', fraction * listening.playback.duration);
    }
    return;
  }

  if (action === 'placeRecord') return placeRecord();
  if (!placement.placed && !['volume', 'speed33', 'speed45', 'pitch', 'skate'].includes(action)) return;
  if (unavailable) return;

  if (action === 'motor') {
    return readyAction(() => {
      state.motor = !state.motor;
      audio.send({ t: 'motor', on: state.motor });
      status(state.motor ? 'Motor running.' : 'Motor stopped.');
    });
  }
  if (action === 'speed33' || action === 'speed45') {
    state.rpm = action === 'speed33' ? 100 / 3 : 45;
    audio.send({ t: 'speed', rpm: state.rpm * (1 + state.pitch / 100) });
    update();
    return invalidate();
  }
  if (action === 'cue' && data.up === undefined) {
    return readyAction(() => {
      audio.send({ t: 'cue', up: !state.cue });
      status(state.cue ? 'Lowering needle…' : 'Needle raised.');
    });
  }
  if (action === 'volume') {
    $('volume').value = data.value;
    $('volume-value').textContent = data.value + '%';
    applyParams();
    return invalidate();
  }
  if (action === 'skate') {
    $('skate').value = data.value;
    $('skate-value').textContent = data.value.toFixed(2) + ' g';
    applyParams();
    return invalidate();
  }
  if (action === 'pitch') {
    state.pitch = data.value;
    $('pitch').value = state.pitch;
    $('pitch-value').textContent = state.pitch.toFixed(1) + '%';
    audio.send({ t: 'speed', rpm: state.rpm * (1 + state.pitch / 100) });
    return invalidate();
  }
  if (action === 'cueTo') return readyAction(() => audio.send({ t: 'cueTo', ...data }));
  audio.send({ t: action, ...data });
  invalidate();
}

function applyParams() {
  audio.send({
    t: 'set',
    volume: +$('volume').value / 100 * .78,
    vtf: +$('force').value,
    antiskate: +$('skate').value,
    stylus: $('stylus-type').value,
    hum: 0
  });
  audio.send({ t: 'speed', rpm: state.rpm * (1 + state.pitch / 100) });
}

function beginCut(kind, files = null, handling = null) {
  if (unavailable) return;
  handlingCut = !!handling;
  listening.stop();
  cancelDownload();
  pendingPressing = null;
  clearTimeout(pendingPressingTimer);
  const id = ++job;
  gestureCleanup?.();
  worker?.terminate();
  worker = null;
  state.cutting = true;
  setProgress(0.25);
  audio.send({ t: 'cue', up: true });
  audio.send({ t: 'motor', on: false });
  state.motor = false; state.cue = true;
  update();

  const w = worker = new Worker(new URL('./physics/master-worker.js', import.meta.url), { type: 'module' });
  w.onerror = () => {
    if (id === job) { state.cutting = false; failure('Could not cut this side. Try a shorter file.'); }
    w.terminate();
  };
  w.onmessage = ({ data: m }) => {
    if (id !== job || !alive) return;
    if (m.t === 'status') { setProgress(0.75); status(m.msg + '…'); }
    if (m.t === 'error') { state.cutting = false; failure('Could not cut this side. Try a shorter audio file.'); w.terminate(); }
    if (m.t === 'done') {
      const install = (park = false) => {
        clearTimeout(pendingPressingTimer);
        pendingPressing = null;
        if (id !== job || !alive) return;
        $('groove-stats').textContent = 'Needle raised · new pressing ready';
        state.cutting = false;
        setProgress(null);
        $('track-current').textContent = '';
        state.record = m.rec;
        state.record.sequence = ++state.sequence;
        if (park) state.tel = null;
        state.ready = false;
        pressingAlbum = kind === 'official' ? (handling?.albumId || defaultAlbum.id) : null;
        handlingCut = false;
        if (handling) placement.extract(sleeveHome());
        else placement.reset();
        renderer?.setRecord(m.rec, m.vis);
        audio.install(state.record, park);
        if (park) applyParams();
        sourceKind = kind;
        sourceFiles = files;
        state.source = kind === 'demo'
          ? 'Synthetic test record'
          : files.length === 1
            ? files[0].name.replace(/\.[^.]+$/, '')
            : 'Local pressing';
        $('cut-track').replaceChildren(...m.rec.tracks.map((track, i) =>
          Object.assign(document.createElement('option'), { value: i, textContent: `${i + 1}. ${track.title}` })
        ));
        status(handling
          ? 'Record in hand — click the platter to place it.'
          : m.rec.truncated
            ? 'Side trimmed to fit. Choose fewer tracks for full length.'
            : 'Ready on the platter. Press Put it on, or drag the tonearm.');
        update();
        invalidate();
        w.terminate();
        worker = null;
      };
      if (audio.ready && audio.context?.state === 'running' && state.tel && (Math.abs(state.tel.wp) > .01 || state.tel.hc < .001)) {
        pendingPressing = install;
        pendingPressingTimer = setTimeout(() => { if (id === job && pendingPressing) install(true); }, 12000);
        status('Waiting for platter to coast down…');
      } else {
        install(audio.ready && audio.context?.state !== 'running');
      }
    }
  };

  const cond = conditions[condition];
  if (kind === 'demo') {
    status('Cutting synthetic test record…');
    w.postMessage({ t: 'demo', id, fs: 48000, cond, seed: 17 });
    return;
  }

  (async () => {
    try {
      const tracks = [];
      let seconds = 0;
      const cap = phone.matches ? 180 : 600;
      for (const file of files) {
        if (id !== job) return;
        status(`Decoding ${file.name}…`);
        const duration = await fileDuration(file);
        if (seconds + duration > cap) throw new Error(`Choose a side under ${cap / 60} minutes on this device.`);
        if (id !== job) return;
        const decoded = await new OfflineAudioContext(2, 1, 48000).decodeAudioData(await file.arrayBuffer());
        seconds += decoded.duration;
        if (seconds > cap) throw new Error(`Choose a side under ${cap / 60} minutes on this device.`);
        const L = decoded.getChannelData(0).slice();
        const R = decoded.numberOfChannels > 1 ? decoded.getChannelData(1).slice() : L;
        tracks.push({ L, R, title: file.name.replace(/\.[^.]+$/, '') });
      }
      if (id !== job) return;
      setProgress(0.6);
      status('Cutting stereo groove…');
      w.postMessage(
        { t: 'tracks', id, fs: 48000, tracks, cond, seed: 17 },
        [...new Set(tracks.flatMap(t => [t.L.buffer, t.R.buffer]))]
      );
    } catch (error) {
      if (id === job) {
        state.cutting = false;
        setProgress(null);
        status(error.message || 'Could not decode file. Try WAV, MP3 or FLAC.');
        update();
      }
      w.terminate();
    }
  })();
}

async function fileDuration(file) {
  const url = URL.createObjectURL(file), probe = document.createElement('audio');
  try {
    return await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Could not read file duration. Try WAV or MP3.')), 8000);
      const finish = (fn, value) => { clearTimeout(timer); fn(value); };
      probe.onloadedmetadata = () => Number.isFinite(probe.duration)
        ? finish(resolve, probe.duration)
        : finish(reject, new Error('Choose an audio file with a known duration.'));
      probe.onerror = () => finish(reject, new Error('This browser cannot decode that file. Try WAV or MP3.'));
      probe.preload = 'metadata';
      probe.src = url;
    });
  } finally {
    probe.removeAttribute('src');
    probe.load();
    URL.revokeObjectURL(url);
  }
}

function cutFiles(fileList) {
  const files = [...fileList];
  if (!files.length) return;
  const maxMB = phone.matches ? 20 : 80;
  if (files.some(f => !f.type.startsWith('audio/') && !/\.(mp3|wav|flac|m4a|ogg|aif|aiff)$/i.test(f.name))) {
    return status('Choose audio files such as WAV, MP3 or FLAC.');
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > maxMB * 1024 * 1024) {
    return status(`Choose files totaling under ${maxMB} MB on this device.`);
  }
  openDrawer(null);
  setView('deck');
  beginCut('files', files);
}

function cancelCut() {
  handlingCut = false;
  cancelDownload();
  pendingPressing = null;
  clearTimeout(pendingPressingTimer);
  job++;
  worker?.terminate();
  worker = null;
  state.cutting = false;
  setProgress(null);
  status(state.record ? 'Cancelled. Previous pressing remains on the deck.' : 'Cancelled.');
  update();
}

function contactText(t) {
  if (!Number.isFinite(t.xg)) return 'Needle outside groove';
  const contact = t.hc > .0001 ? 'raised' : t.loss > .01 ? 'mistracking' : 'contact';
  return `L ${(t.nIn * 1000).toFixed(1)} · R ${(t.nOut * 1000).toFixed(1)} mN · ${(t.loss * 100).toFixed(0)}% loss · ${contact} · ${((t.plinth || 0) * 1e6).toFixed(1)} µm`;
}

function invalidate() {
  if (renderer && !renderFrame && alive && shown && !document.hidden) {
    renderFrame = requestAnimationFrame(frame);
  }
}

let displayTime = 0;
function frame(now) {
  renderFrame = 0;
  if (!alive || !shown || document.hidden) return;
  const dt = Math.min(.05, (now - (lastFrame || now)) / 1000);
  lastFrame = now;

  const wasMoving = placement.moving;
  placement.tick(dt, reduced.matches);
  if (wasMoving && !placement.moving) {
    fan.frozen = false;
    status(
      placement.placed
        ? 'On the platter. Press Put it on, or drag the tonearm.'
        : placement.phase === 'held'
          ? 'Record in hand — click the platter to place it.'
          : 'Returned to its sleeve.'
    );
    update();
  }

  if (camera.target) {
    const target = camera.target, k = 1 - Math.exp(-dt * 8.5);
    let delta = 0;
    for (const key of ['az', 'el', 'distance']) {
      delta += Math.abs(target[key] - camera[key]);
      camera[key] += (target[key] - camera[key]) * k;
    }
    for (let i = 0; i < 3; i++) {
      delta += Math.abs(target.focus[i] - camera.focus[i]);
      camera.focus[i] += (target.focus[i] - camera.focus[i]) * k;
    }
    if (delta < .0002) {
      Object.assign(camera, target);
      camera.target = null;
    }
  }

  const remote = listening.playback;
  const service = !!listening.active;
  const playing = service && remote.phase === 'playing';
  const t = service
    ? { thp: remote.position * W33, wp: playing ? W33 : 0, al: serviceAngle(), zb: playing ? 0 : .005, ze: 0, xi: 0, plinth: 0 }
    : state.tel;
  const lag = t ? Math.min(.05, (now - state.received) / 1000) : 0;
  if (camera.follow && !camera.target && t) camera.focus = [...stylusXY(t.al), .002];

  const light = document.documentElement.dataset.theme === 'light';
  try {
    renderer.draw({
      service,
      recordVisible: service || placement.visible,
      recordMatrix: service || placement.placed ? null : placement.matrix,
      plinth: t?.plinth || 0,
      volume: +$('volume').value / 100,
      thp: t ? t.thp + t.wp * lag : 0,
      al: t?.al ?? ALPHA_REST,
      zb: t?.zb ?? .005,
      xi: t?.xi ?? 0,
      zt: t ? t.zb + t.ze : .005,
      zoom: 0,
      az: camera.az,
      el: camera.el,
      at: camera.focus,
      dist: camera.distance,
      motor: service ? playing : state.motor,
      rpm: state.rpm,
      pitch: state.pitch,
      cue: service ? !playing : state.cue,
      force: +$('force').value,
      skate: +$('skate').value,
      light
    });
    fan.draw(state.selected, dt, reduced.matches, light);

    if (t && !service && now - displayTime > 120) {
      displayTime = now;
      $('rpm-value').textContent = (t.wp * 60 / TAU).toFixed(2) + ' RPM';
      const track = state.record?.tracks.find(k => t.theta >= k.theta0 && t.theta < k.theta1);
      $('track-current').textContent = t.hc > .0001
        ? 'Needle raised'
        : track
          ? format((t.theta - track.theta0) / W33)
          : t.theta >= state.record?.thetaLock
            ? 'Run-out'
            : 'Lead-in';
      if (track && document.activeElement !== $('cut-track')) {
        $('cut-track').value = state.record.tracks.indexOf(track);
      }
      update();
      const contact = contactText(t);
      if (!$('needle-scope').hidden) $('groove-stats').textContent = contact;
      $('contact-forces').textContent = contact;
    }
  } catch (error) {
    failure('The 3D view could not draw. The catalogue links still work.');
    console.error(error);
    return;
  }

  const moving = playing
    || placement.moving
    || !!camera.target
    || state.cutting
    || fan.isAnimating(state.selected)
    || (state.ready && (Math.abs(t?.wp || 0) > .02 || t?.auto));
  if (moving) invalidate();
}

// ---- Boot WebGL2 scene ----
try {
  renderer = new Renderer(canvas);
  fan = new AlbumFan(renderer, albums, invalidate);
  canvas.hidden = false;
  $('scene-fallback').hidden = true;

  gestureCleanup = connectGestures({
    canvas,
    renderer,
    fan,
    camera,
    getState: () => ({
      ...state,
      ready: (state.ready && placement.placed) || !!listening.active,
      recordHeld: placement.phase === 'held',
      recordMatrix: placement.visible && !placement.placed ? placement.matrix : null,
      skate: +$('skate').value,
      volume: +$('volume').value,
      al: listening.active ? serviceAngle() : state.tel?.al ?? ALPHA_REST
    }),
    command,
    select: sceneAlbum,
    hover: ({ sleeve, label }) => {
      const hoverChanged = fan.hover !== sleeve;
      fan.hover = sleeve;
      const tip = $('hover-info');
      if (sleeve !== null) {
        const a = albums[sleeve];
        tip.textContent = sleeve === state.selected && a.audioTracks?.length && !placement.visible
          ? `${a.title} · click to take out record`
          : `${a.title} · ${a.artist} (${a.year})`;
        tip.hidden = false;
      } else if (label) {
        tip.textContent = label;
        tip.hidden = false;
      } else {
        tip.hidden = true;
      }
      if (hoverChanged) invalidate();
    },
    invalidate
  });

  new ResizeObserver(invalidate).observe(canvas);
  new MutationObserver(invalidate).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new IntersectionObserver(entries => { shown = entries[0].isIntersecting; if (shown) invalidate(); }).observe(canvas);

  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    unavailable = true;
    gestureCleanup?.();
    audio.silence();
    update();
    shown = false;
    canvas.hidden = true;
    $('scene-fallback').hidden = false;
    $('scene-fallback').textContent = 'The 3D view lost its graphics context. Reload to restore it; the collection links still work.';
    status('3D view stopped. Reload to restore.');
  });

  setView('room');
  selectAlbum(0, false);
  update();
} catch (error) {
  unavailable = true;
  console.error(error);
  $('scene-fallback').textContent = 'The 3D player is unavailable in this browser. The collection and listening links are below.';
  status('3D player unavailable.');
  for (const b of root.querySelectorAll('.view-strip button')) b.disabled = true;
  selectAlbum(0, false);
  update();
}

// ---- Wire DOM controls ----
document.querySelectorAll('[data-record]').forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => {
    selectAlbum(albums.findIndex(a => a.id === button.dataset.record), true);
    document.querySelector('.listening-desk').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => setView(button.dataset.view));
});
$('reset-view').onclick = () => setView('room');
$('look-only').onclick = () => {
  state.lookOnly = !state.lookOnly;
  $('look-only').setAttribute('aria-pressed', String(state.lookOnly));
  status(state.lookOnly ? 'Look mode: drag anywhere to move the camera.' : 'Interactive mode restored.');
};

$('dock-prev').onclick = () => selectAlbum(state.selected - 1, false);
$('dock-next').onclick = () => selectAlbum(state.selected + 1, false);
$('previous-album').onclick = () => selectAlbum(state.selected - 1, true);
$('next-album').onclick = () => selectAlbum(state.selected + 1, true);

$('open-sleeve').onclick = () => openDrawer(activeDrawer === 'sleeve' ? null : 'sleeve');
$('press-toggle').onclick = () => openDrawer(activeDrawer === 'press' ? null : 'press');
$('adjust-toggle').onclick = () => openDrawer(activeDrawer === 'adjust' ? null : 'adjust');
$('open-precuts').onclick = () => openDrawer('press');
$('close-sleeve').onclick = () => openDrawer(null);
$('close-adjustments').onclick = () => openDrawer(null);
$('close-press').onclick = () => openDrawer(null);

$('take-record').onclick = takeRecord;
$('return-record').onclick = returnRecord;

$('put-on').onclick = () => {
  if (listening.active) return listening.transport('toggle');
  const a = albums[state.selected];
  if (!placement.visible) {
    if (a.audioTracks?.length) return takeRecord();
    openDrawer('sleeve');
    listening.startPreferred();
    return;
  }
  if (placement.phase === 'held') return placeRecord();
  if (isPhysicalPlaying()) {
    return readyAction(() => {
      audio.send({ t: 'cue', up: true });
      state.motor = false;
      audio.send({ t: 'motor', on: false });
      status('Paused.');
    });
  }
  if (isArmOverGroove()) {
    return readyAction(() => {
      state.motor = true;
      audio.send({ t: 'motor', on: true });
      audio.send({ t: 'cue', up: false });
      status('Resumed.');
    });
  }
  return readyAction(() => {
    state.motor = true;
    audio.send({ t: 'motor', on: true });
    audio.send({ t: 'cueTo', al: alphaForRadius(R_LEADIN - .0012) });
    status('Starting motor and lowering needle…');
  });
};

$('motor').onclick = () => command('motor');
$('cue').onclick = () => command('cue');
$('speed33').onclick = () => command('speed33');
$('speed45').onclick = () => command('speed45');
$('pitch').oninput = e => command('pitch', { value: +e.target.value });
$('pitch-reset').onclick = () => command('pitch', { value: 0 });
$('press-again').onclick = () => { condition = $('condition').value; beginCut(sourceKind, sourceFiles); };
$('bump').onclick = () => readyAction(() => audio.send({ t: 'bump', s: +$('knock-strength').value }));
$('stylus-type').onchange = applyParams;
$('cut-track').onchange = () => {
  const k = state.record?.tracks[+$('cut-track').value];
  if (k) command('cueTo', { al: alphaForRadius(grooveRadius(state.record.rTab, k.theta0 + .2)) });
};

for (const [id, label, suffix] of [['force', 'force-value', ' g'], ['skate', 'skate-value', ' g'], ['volume', 'volume-value', '%']]) {
  $(id).oninput = () => {
    $(label).textContent = (id === 'volume' ? $(id).value : (+$(id).value).toFixed(2)) + suffix;
    if (id === 'volume' && listening.active) command('volume', { value: +$(id).value });
    else applyParams();
    invalidate();
  };
}

$('choose-files').onclick = () => { $('audio-files').value = ''; $('audio-files').click(); };
$('audio-files').onchange = e => cutFiles(e.target.files);
$('house-record').onclick = () => { selectAlbum(albums.indexOf(defaultAlbum), false); takeRecord(); };
$('synth-record').onclick = () => { openDrawer(null); setView('deck'); beginCut('demo'); };
$('cancel-cut').onclick = cancelCut;

canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => { e.preventDefault(); cutFiles(e.dataTransfer.files); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activeDrawer) openDrawer(null);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) gestureCleanup?.();
  else invalidate();
});
window.addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
window.addEventListener('pagehide', () => {
  cancelDownload();
  listening.dispose();
  clearTimeout(pendingPressingTimer);
  alive = false;
  job++;
  worker?.terminate();
  audio.dispose();
  fan?.dispose();
  cancelAnimationFrame(renderFrame);
});

// ---- Prepared lossless Polygondwanaland tracks ----
function precutLimit() { return (phone.matches ? 96 : 384) * 1048576; }
precutEntries.forEach((t, i) => {
  const mib = (t.bytes / 1048576).toFixed(0);
  $('precut-track').append(Object.assign(document.createElement('option'), {
    value: i,
    textContent: `${String(i + 1).padStart(2, '0')}. ${t.title} · ${mib} MiB`
  }));
});

function updatePrecut() {
  const entry = precutEntries[+$('precut-track').value];
  const overBudget = !!entry && entry.decodedBytes > precutLimit();
  $('load-precut').disabled = !entry || overBudget || state.cutting || placement.moving || unavailable;
  $('precut-native-fallback').hidden = !overBudget;
  $('precut-native-fallback').classList.toggle('primary', overBudget);
  $('precut-native-fallback').classList.toggle('ghost-btn', !overBudget);
  let info;
  if (!entry) {
    info = 'Prepared tracks are not available in this build.';
  } else if (overBudget) {
    info = `${(entry.decodedBytes / 1048576).toFixed(0)} MiB decoded — exceeds this device’s memory budget. Play the full recording instead.`;
  } else {
    info = `${(entry.bytes / 1048576).toFixed(0)} MiB download · ${(entry.decodedBytes / 1048576).toFixed(0)} MiB decoded · complete track.`;
  }
  if ($('precut-info').textContent !== info) $('precut-info').textContent = info;
}
$('precut-track').onchange = updatePrecut;
phone.addEventListener('change', () => { updatePrecut(); update(); });
stacked.addEventListener('change', () => setView(currentView, { keepDrawer: true }));
updatePrecut();

$('precut-native-fallback').onclick = () => {
  const entry = precutEntries[+$('precut-track').value];
  selectAlbum(albums.indexOf(defaultAlbum), true);
  listening.startRecording(defaultAlbum.audioTracks.findIndex(t => t.title === entry?.title));
};

$('load-precut').onclick = async () => {
  const entry = precutEntries[+$('precut-track').value];
  if (!entry || entry.decodedBytes > precutLimit() || placement.moving || unavailable) return;
  listening.stop();
  cancelCut();
  selectAlbum(albums.indexOf(defaultAlbum), false);
  openDrawer(null);
  setView('room');
  const id = downloadJob;
  const controller = downloadAbort = new AbortController();
  await audio.silence();
  if (id !== downloadJob) return;
  state.tel = null; state.ready = false; state.motor = false; state.cue = true;
  state.cutting = true;
  state.source = entry.title;
  const totalMiB = (entry.bytes / 1048576).toFixed(0);
  setProgress(0.05);
  status(`Downloading ${entry.title} (${totalMiB} MiB)…`);
  update();
  updatePrecut();

  let lastReport = 0;
  try {
    const { rec, vis } = await loadPrecut(entry, {
      baseURL: mediaBase,
      maxDecodedBytes: precutLimit(),
      signal: controller.signal,
      onProgress: bytes => {
        const now = performance.now();
        if (now - lastReport > 180) {
          lastReport = now;
          const pct = Math.min(100, Math.round(bytes / entry.decodedBytes * 100));
          setProgress(pct / 100);
          status(`Loading ${entry.title} · ${pct}% (${totalMiB} MiB)`);
        }
      }
    });
    if (id !== downloadJob || !alive) return;
    downloadAbort = null;
    state.cutting = false;
    setProgress(null);
    state.record = rec;
    rec.sequence = ++state.sequence;
    sourceKind = 'precut';
    sourceFiles = null;
    pressingAlbum = defaultAlbum.id;
    renderer.setRecord(rec, vis);
    audio.install(rec, true);
    applyParams();
    state.source = entry.title;
    placement.extract(sleeveHome());
    $('cut-track').replaceChildren(...rec.tracks.map((t, i) =>
      Object.assign(document.createElement('option'), { value: i, textContent: t.title })
    ));
    status('Record in hand — click the platter to place it.');
  } catch (error) {
    if (id === downloadJob && error.name !== 'AbortError') {
      state.cutting = false;
      downloadAbort = null;
      setProgress(null);
      status('Prepared track could not load. Try the demo pressing or full recording.');
    }
  }
  update();
  updatePrecut();
  invalidate();
};
