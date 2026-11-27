// Optional album listening. Provider audio is deliberately separate from the physical deck.
// No frame, media source or external script is requested until a visitor chooses a player.
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const webURL = value => {
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const id = (value, pattern) => typeof value === 'string' && pattern.test(value) ? value : null;
const link = (label, href) => {
  const a = element('a', '', label);
  a.href = href; a.target = '_blank'; a.rel = 'noopener';
  return a;
};


// Official APIs are loaded only after a listening choice. Failed loads may be retried.
const apiLoads = new Map();
function loadPlayerAPI(key, url, callback, read) {
  const existing=read();if(existing)return Promise.resolve(existing);
  if(apiLoads.has(key))return apiLoads.get(key);
  const promise=new Promise((resolve,reject)=>{
    const script=document.createElement('script'),previous=window[callback];let settled=false;
    const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timeout);if(window[callback]===ready)window[callback]=previous;if(error){script.remove();reject(error);}else resolve(value);};
    const ready=value=>{previous?.(value);finish(null,value||read());};window[callback]=ready;
    const timeout=setTimeout(()=>finish(new Error('Player API timed out')),12000);
    script.async=true;script.onerror=()=>finish(new Error('Player API unavailable'));script.src=url;document.head.append(script);
  });
  apiLoads.set(key,promise);promise.catch(()=>apiLoads.delete(key));return promise;
}

/**
 * beforePlay({album, provider}) must stop/suspend physical audio before resolving.
 * onStatus(message, {album, provider, phase}) reports UI state, never guessed iframe playback.
 * Call stop() before resuming the physical deck, and dispose() during page teardown.
 */
export function createListeningPanel(container, {beforePlay = () => {}, onStatus = () => {}, onStop = () => {}, onPlayback = () => {}, onCut, maxCutSeconds = 600} = {}) {
  const panel = element('section', 'album-listening');
  panel.setAttribute('aria-label', 'Listen to the selected album');
  const choices = element('div', 'listening-choices');
  choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', 'Choose a listening source');
  const notice = element('p', 'listening-notice small', 'Choose a player to connect to that service. Its availability, previews and sign-in requirements apply.');
  const status = element('p', 'listening-status small');
  status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const host = element('div', 'listening-player');
  const trackArea = element('div', 'listening-recording'); trackArea.hidden = true;
  const trackLabel = element('label', 'listening-track', 'Track '), trackSelect = element('select');
  trackSelect.setAttribute('aria-label', 'Track to play or cut'); trackLabel.append(trackSelect);
  const trackInfo = element('p', 'small'), cutHelp = element('p', 'small');
  const cutButton = element('button', 'listening-cut', 'Cut this track onto vinyl'); cutButton.type = 'button';
  const download = link('Open this audio file ↗', '#');
  const cutDetails=element('details','listening-cut-details'),cutSummary=element('summary','','Make a vinyl pressing');
  cutDetails.append(cutSummary,trackInfo,cutButton,cutHelp,download);trackArea.append(cutDetails);
  const close = element('button', 'listening-close', 'Close player'); close.type = 'button'; close.hidden = true;
  const links = element('div', 'listening-links sleeve-actions');
  links.setAttribute('aria-label', 'Open the album in a music service');
  panel.append(choices, links, notice, status, trackLabel, host, close, trackArea); container.append(panel);

  let album = null, provider = null, generation = 0, timer, media, disposed = false;
  let tracks = [], selectedTrack = 0, nativeStart = null;
  let remote=null,remoteCleanup=null,progressTimer=null,desiredVolume=45;
  const noControls=()=>({play:false,pause:false,seek:false,volume:false});
  let playback={provider:null,phase:'idle',position:0,duration:0,volume:desiredVolume,capabilities:noControls()};
  const emit=patch=>{playback={...playback,...patch,provider};onPlayback({...playback,capabilities:{...playback.capabilities}});};
  function transport(action,value){
    if(!provider)return false;
    if(action==='toggle')action=playback.phase==='playing'||playback.phase==='buffering'?'pause':'play';
    if(!playback.capabilities[action]){report(action==='volume'?'Use the volume control in the service player.':'Use the visible player controls while this source connects.','ready');return false;}
    try{
      if(action==='volume'){if(!Number.isFinite(+value))return false;value=desiredVolume=Math.max(0,Math.min(100,+value));}
      if(action==='seek'){if(!Number.isFinite(+value))return false;value=Math.max(0,Math.min(playback.duration||Infinity,+value));}
      const result=remote?.[action]?.(value);if(result?.catch){const own=generation;result.catch(error=>{if(own!==generation)return;emit({phase:'ready'});report(error.name==='NotAllowedError'?'Press Play again to allow audio.':'Playback could not start. Try the visible player.','ready');});}
      return true;
    }catch{report('That control is unavailable. Use the visible player or album links.','error');return false;}
  }
  const durationText = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const cutLimit = () => typeof maxCutSeconds === 'function' ? maxCutSeconds() : maxCutSeconds;
  function updateTrack() {
    const track = tracks[selectedTrack]; if (!track) return;
    trackSelect.value = String(selectedTrack); download.href = track.url;
    const duration = Number(track.durationSec), size = Number(track.sizeBytes), limit = cutLimit();
    const known = Number.isFinite(duration) && duration > 0;
    trackInfo.textContent = `${known ? durationText(duration) : 'Duration unavailable'}${size > 0 ? ` · ${(size / 1048576).toFixed(1)} MB` : ''}`;
    cutButton.hidden = !onCut;
    cutButton.disabled = !known || duration > limit;
    cutHelp.hidden = !onCut;
    cutHelp.textContent = !known ? 'The duration must be verified before this track can be cut. You can still play the recording.' : duration > limit ? `This track is ${durationText(duration)}. Vinyl cutting is limited to ${durationText(limit)} on this device. Play the full recording instead.` : 'Cut this complete track into a simulated groove. The full recording also plays directly below.';
  }
  const buttons = new Map();
  const report = (message, phase = 'ready') => {
    if(status.textContent !== message) status.textContent = message;
    onStatus(message, {album, provider, phase});
  };
  function stop() {
    generation++; clearTimeout(timer);clearInterval(progressTimer);progressTimer=null;try{remoteCleanup?.();}catch{}remoteCleanup=null;remote=null;
    if (media) {
      media.onplaying = media.onpause = media.onended = media.onerror = media.onwaiting = media.ontimeupdate = media.onloadedmetadata = media.onvolumechange = null;
      media.pause(); media.removeAttribute('src'); media.load(); media = null;
    }
    nativeStart = null;
    host.replaceChildren(); host.hidden = true; close.hidden = true;
    for (const button of buttons.values()) button.setAttribute('aria-pressed', 'false');
    const wasActive = provider !== null; provider = null;
    emit({phase:'idle',position:0,duration:0,capabilities:noControls()});if (wasActive) onStop();
  }
  close.onclick = () => {
    const chosen = buttons.get(provider);
    stop(); chosen?.focus();
    report('Player closed. Choose another source, or return to the physical deck.', 'idle');
  };
  trackSelect.onchange = () => {
    selectedTrack = Number(trackSelect.value); updateTrack();
    nativeStart?.(selectedTrack);
  };
  cutButton.onclick = async () => {
    updateTrack(); if (disposed || !onCut || cutButton.disabled) return;
    const current = album, index = selectedTrack, track = tracks[index];
    stop(); const own = generation;
    report(`Preparing ${track.title} for the physical deck…`, 'cutting');
    try { const started=await onCut({album: current, track, index});if(own===generation)report(started===false?'Cut cancelled. The previous pressing is still available.':'The deck is preparing this pressing. Use Put it on when ready.',started===false?'idle':'cutting'); }
    catch (error) { if (own === generation) report(error.message || 'This track could not be cut. You can still play the full recording.', 'error'); }
  };


  async function spotifyPlayer(current,own){
    const valid=()=>!disposed&&own===generation;
    try{
      const api=await loadPlayerAPI('spotify','https://open.spotify.com/embed/iframe-api/v1','onSpotifyIframeApiReady',()=>null);
      if(!valid())return;const slot=element('div');host.append(slot);
      api.createController(slot,{uri:'spotify:album:'+current.spotifyId,width:'100%',height:352},controller=>{
        if(!valid()){controller.destroy();return;}
        remoteCleanup=()=>controller.destroy();remote={play:()=>controller.resume(),pause:()=>controller.pause(),seek:seconds=>controller.seek(seconds)};
        controller.addListener('ready',()=>{if(!valid())return;emit({phase:'ready',capabilities:{play:true,pause:true,seek:true,volume:false}});report('Spotify ready. Starting playback; if blocked, use Play. Full tracks or previews depend on Spotify.','ready');controller.resume();});
        controller.addListener('playback_update',event=>{if(!valid())return;clearTimeout(timer);const d=event.data,phase=d.isBuffering?'buffering':d.isPaused?'paused':'playing';emit({phase,position:Math.max(0,(d.position||0)/1000),duration:Math.max(0,(d.duration||0)/1000),playingURI:d.playingURI,capabilities:{play:true,pause:true,seek:true,volume:false}});report(phase==='playing'?'Playing through Spotify. The deck controls operate this stream.':phase==='buffering'?'Spotify is buffering.':'Spotify paused. Use the deck or player to resume.',phase);});
      });
      timer=setTimeout(()=>{if(valid())report('Spotify is taking a while. Try its Play control or an album link.','waiting');},12000);
    }catch{if(valid()){emit({phase:'error',capabilities:noControls()});report('Spotify controls could not connect. Use the visible player or album links.','error');framePlayer('Spotify',current,own,'https://open.spotify.com/embed/album/'+current.spotifyId,352);}}
  }
  async function youtubePlayer(current,own,url){
    const valid=()=>!disposed&&own===generation;
    try{
      const api=await loadPlayerAPI('youtube','https://www.youtube.com/iframe_api','onYouTubeIframeAPIReady',()=>window.YT?.Player?window.YT:null);if(!valid())return;
      const frame=element('iframe');frame.title=current.title+' — YouTube player';frame.width='100%';frame.height='270';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
      const source=new URL(url);source.searchParams.set('enablejsapi','1');source.searchParams.set('origin',location.origin);frame.src=source.href;host.append(frame);
      const player=new api.Player(frame,{events:{
        onReady:()=>{if(!valid())return;emit({phase:'ready',capabilities:{play:true,pause:true,seek:true,volume:true}});player.setVolume(desiredVolume);player.playVideo();},
        onStateChange:event=>{if(!valid())return;const phase=({0:'ended',1:'playing',2:'paused',3:'buffering',5:'ready'})[event.data]||'ready';emit({phase,position:player.getCurrentTime()||0,duration:player.getDuration()||0});report(phase==='playing'?'Playing through YouTube. The deck controls operate this stream.':phase==='buffering'?'YouTube is buffering.':phase==='ended'?'Recording finished. Press Play to restart.':'YouTube ready. Use the deck or player to play.',phase);},
        onAutoplayBlocked:()=>{if(valid()){emit({phase:'ready'});report('Press Play on the deck or YouTube player to allow audio.','ready');}},
        onError:()=>{if(valid()){emit({phase:'error'});report('This YouTube recording cannot play here. Choose another source or an album link.','error');}}
      }});
      remoteCleanup=()=>player.destroy();remote={play:()=>player.playVideo(),pause:()=>player.pauseVideo(),seek:seconds=>player.seekTo(seconds,true),volume:value=>player.setVolume(value)};
      progressTimer=setInterval(()=>{if(valid()&&playback.capabilities.play&&player.getCurrentTime)emit({position:player.getCurrentTime()||0,duration:player.getDuration()||0,volume:player.getVolume()});},300);
    }catch{if(valid()){emit({phase:'error',capabilities:noControls()});report('YouTube controls could not connect. Use the visible player or album links.','error');framePlayer('YouTube',current,own,url,270);}}
  }

  function framePlayer(source, current, own, url, height) {
    const frame = element('iframe');
    frame.title = `${current.title} — ${source} player`;
    frame.width = '100%'; frame.height = String(height);
    frame.style.border = '0'; frame.style.display = 'block';
    frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.onload = () => {
      if (own !== generation) return;
      clearTimeout(timer);
      emit({phase:'ready',capabilities:noControls()});
      report(`${source} player opened. Use its Play control. If it is unavailable or only offers a preview, open the album using the album links.`, 'loaded');
    };
    frame.onerror = () => {
      if (own === generation) { clearTimeout(timer); report(`${source} could not load. Try another source or open the album below.`, 'error'); }
    };
    timer = setTimeout(() => {
      if (own === generation) report(`${source} is taking a while. You can try its controls, another source, or the album links below.`, 'waiting');
    }, 12000);
    frame.src = url; host.append(frame);
  }

  function nativePlayer(current, own) {
    const audio = media = element('audio', 'listening-audio');
    audio.controls = true; audio.preload = 'none';audio.volume=desiredVolume/100;
    remote={play:()=>audio.play(),pause:()=>audio.pause(),seek:seconds=>{audio.currentTime=seconds;},volume:value=>{audio.volume=value/100;}};emit({phase:'ready',capabilities:{play:true,pause:true,seek:true,volume:true}});
    audio.setAttribute('aria-label', `${current.title} — full tracks`);
    const source = element('p', 'small', 'Full recording. This player plays the digital master; it does not simulate a groove. ');
    const provenance = current.audioProvenanceUrl && webURL(current.audioProvenanceUrl);
    if(current.audioCredit)source.append(document.createTextNode(current.audioCredit+'. '));
    if (provenance) source.append(link('Artist’s release and permission ↗', provenance));
    host.append(audio, source);
    let index = selectedTrack, attempt = 0;
    const valid = () => own === generation && media === audio;
    async function start(next) {
      if (!valid()) return;
      const request = ++attempt;
      audio.pause(); index = selectedTrack = next; updateTrack();
      emit({phase:'buffering',position:0,duration:0});audio.src = tracks[index].url;
      report(`Loading ${tracks[index].title}…`, 'loading');
      try { await audio.play(); }
      catch (error) {
        if (!valid() || request !== attempt) return;
        report(error.name === 'NotAllowedError' ? 'Press Play in the audio controls to start this track.' : 'This recording could not start. Try Play again, open the audio file, or choose a music service.', error.name === 'NotAllowedError' ? 'ready' : 'error');
      }
    }
    audio.onplaying = () => { if (valid()){emit({phase:'playing'});report(`Playing ${tracks[index].title}.`, 'playing');} };
    audio.ontimeupdate=audio.onloadedmetadata=audio.onvolumechange=()=>{if(valid())emit({position:audio.currentTime||0,duration:Number.isFinite(audio.duration)?audio.duration:0,volume:audio.volume*100});};
    audio.onwaiting = () => { if (valid()){emit({phase:'buffering'});report(`Buffering ${tracks[index].title}…`, 'waiting');} };
    audio.onpause = () => { if (valid() && !audio.ended && audio.paused){emit({phase:'paused'});report(`Paused: ${tracks[index].title}.`, 'paused');} };
    audio.onerror = () => { if (valid()){emit({phase:'error'});report('This recording is unavailable here. Open the audio file or use one of the music services below.', 'error');} };
    audio.onended = () => {
      if (!valid()) return;
      if (index + 1 < tracks.length) start(index + 1);
      else {emit({phase:'ended'});report('Album finished. Choose a track to listen again.', 'ended');}
    };
    nativeStart = start;
    start(selectedTrack);
  }

  async function activate(source, current, render) {
    if (disposed || current !== album) return;
    stop(); const own = generation; provider = source;emit({phase:'connecting',position:0,duration:0,capabilities:noControls()});
    buttons.get(source)?.setAttribute('aria-pressed', 'true');
    close.hidden = false;
    report(`Opening ${source}… The physical deck will be silent.`, 'connecting');
    try {
      await beforePlay({album: current, provider: source});
      if (disposed || own !== generation || current !== album) return;
      host.hidden = false; render(own);
      host.scrollIntoView({block:'nearest',behavior:'instant'});
    } catch {
      if (own === generation) report('Could not pause the physical deck. Close this player and try again, or use an album link.', 'error');
    }
  }
  function addChoice(source, label, current, render) {
    const button = element('button', '', label); button.type = 'button'; button.dataset.provider = source;
    button.setAttribute('aria-pressed', 'false');
    button.onclick = () => activate(source, current, render);
    buttons.set(source, button); choices.append(button);
  }
  function selectAlbum(current) {
    if (disposed) return;
    stop(); album = current; buttons.clear(); choices.replaceChildren(); links.replaceChildren();
    if (!current) { panel.hidden = true; return; }
    panel.hidden = false;
    const spotify = id(current.spotifyId, /^[A-Za-z0-9]{22}$/);
    const video = id(current.youtubeVideoId, /^[A-Za-z0-9_-]{11}$/);
    const playlist = id(current.youtubePlaylistId, /^(?:PL|OLAK5uy_|RD|UU)[A-Za-z0-9_-]+$/);
    const bandcamp = /^\d+$/.test(String(current.bandcampId || '')) ? String(current.bandcampId) : null;
    tracks = Array.isArray(current.audioTracks) ? current.audioTracks.map(t => ({...t, title: String(t.title || 'Untitled'), url: t.url && webURL(t.url)})).filter(t => t.url) : [];
    selectedTrack = 0; trackSelect.replaceChildren(); trackArea.hidden = !tracks.length;trackLabel.hidden = !tracks.length;cutDetails.open=false;
    tracks.forEach((track, index) => {
      const option = element('option', '', `${index + 1}. ${track.title}`); option.value = String(index); trackSelect.append(option);
    });
    if (tracks.length) { updateTrack(); addChoice('Recording', 'Play full recording', current, own => nativePlayer(current, own)); }
    if (spotify) addChoice('Spotify', 'Open Spotify player', current, own => spotifyPlayer(current, own));
    if (video || playlist) {
      const url = new URL(`https://www.youtube-nocookie.com/embed/${video || 'videoseries'}`);
      url.searchParams.set('playsinline', '1');
      if (playlist) { url.searchParams.set('listType', 'playlist'); url.searchParams.set('list', playlist); }
      addChoice('YouTube', 'Open YouTube player', current, own => youtubePlayer(current, own, url.href));
    }
    if (bandcamp) addChoice('Bandcamp', 'Open Bandcamp player', current, own => {
      const styles = getComputedStyle(document.documentElement);
      const color = (name, fallback) => {
        const value = styles.getPropertyValue(name).trim().replace(/^#/, '');
        return /^[a-f\d]{6}$/i.test(value) ? value : fallback;
      };
      framePlayer('Bandcamp', current, own, `https://bandcamp.com/EmbeddedPlayer/album=${bandcamp}/size=large/bgcol=${color('--bg', '333333')}/linkcol=${color('--accent', 'ffffff')}/artwork=none/transparent=true/`, 350);
    });
    const youtubeURL = current.url && webURL(current.url);
    const bandcampURL = current.bandcampUrl && webURL(current.bandcampUrl);
    if (youtubeURL) links.append(link('Open YouTube Music ↗', youtubeURL));
    links.append(link('Open Spotify ↗', spotify ? `https://open.spotify.com/album/${spotify}` : `https://open.spotify.com/search/${encodeURIComponent(current.artist + ' ' + current.title)}`));
    if (bandcampURL) links.append(link('Open Bandcamp ↗', bandcampURL));
    notice.hidden = !choices.children.length || (tracks.length && choices.children.length === 1);
    status.textContent = choices.children.length ? 'Players connect only after you choose one. The album links always remain available.' : 'Open this album in a music service below. An in-page player is not available for this edition yet.';
  }
  return {
    selectAlbum,
    stop,
    transport,
    startRecording(index=0){if(!buttons.has('Recording'))return Promise.resolve(false);selectedTrack=Math.max(0,Math.min(tracks.length-1,Number.isInteger(index)?index:0));updateTrack();return buttons.get('Recording').onclick();},
    startPreferred(){const source=['Recording','YouTube','Spotify','Bandcamp'].find(name=>buttons.has(name));return source?buttons.get(source).onclick():Promise.resolve(false);},
    get playback(){return {...playback,capabilities:{...playback.capabilities}};},
    get active() { return provider; },
    dispose() { if (disposed) return; stop(); disposed = true; panel.remove(); }
  };
}
