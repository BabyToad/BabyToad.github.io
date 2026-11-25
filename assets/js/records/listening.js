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

/**
 * beforePlay({album, provider}) must stop/suspend physical audio before resolving.
 * onStatus(message, {album, provider, phase}) reports UI state, never guessed iframe playback.
 * Call stop() before resuming the physical deck, and dispose() during page teardown.
 */
export function createListeningPanel(container, {beforePlay = () => {}, onStatus = () => {}, onStop = () => {}, onCut, maxCutSeconds = 600} = {}) {
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
    status.textContent = message;
    onStatus(message, {album, provider, phase});
  };
  function stop() {
    generation++; clearTimeout(timer);
    if (media) {
      media.onplaying = media.onpause = media.onended = media.onerror = media.onwaiting = null;
      media.pause(); media.removeAttribute('src'); media.load(); media = null;
    }
    nativeStart = null;
    host.replaceChildren(); host.hidden = true; close.hidden = true;
    for (const button of buttons.values()) button.setAttribute('aria-pressed', 'false');
    const wasActive = provider !== null; provider = null;
    if (wasActive) onStop();
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
    audio.controls = true; audio.preload = 'none';
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
      audio.src = tracks[index].url;
      report(`Loading ${tracks[index].title}…`, 'loading');
      try { await audio.play(); }
      catch (error) {
        if (!valid() || request !== attempt) return;
        report(error.name === 'NotAllowedError' ? 'Press Play in the audio controls to start this track.' : 'This recording could not start. Try Play again, open the audio file, or choose a music service.', error.name === 'NotAllowedError' ? 'ready' : 'error');
      }
    }
    audio.onplaying = () => { if (valid()) report(`Playing ${tracks[index].title}.`, 'playing'); };
    audio.onwaiting = () => { if (valid()) report(`Buffering ${tracks[index].title}…`, 'waiting'); };
    audio.onpause = () => { if (valid() && !audio.ended && audio.paused) report(`Paused: ${tracks[index].title}.`, 'paused'); };
    audio.onerror = () => { if (valid()) report('This recording is unavailable here. Open the audio file or use one of the music services below.', 'error'); };
    audio.onended = () => {
      if (!valid()) return;
      if (index + 1 < tracks.length) start(index + 1);
      else report('Album finished. Choose a track to listen again.', 'ended');
    };
    nativeStart = start;
    start(selectedTrack);
  }

  async function activate(source, current, render) {
    if (disposed || current !== album) return;
    stop(); const own = generation; provider = source;
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
    if (spotify) addChoice('Spotify', 'Open Spotify player', current, own => framePlayer('Spotify', current, own, `https://open.spotify.com/embed/album/${spotify}`, 352));
    if (video || playlist) {
      const url = new URL(`https://www.youtube-nocookie.com/embed/${video || 'videoseries'}`);
      url.searchParams.set('playsinline', '1');
      if (playlist) { url.searchParams.set('listType', 'playlist'); url.searchParams.set('list', playlist); }
      addChoice('YouTube', 'Open YouTube player', current, own => framePlayer('YouTube', current, own, url.href, 270));
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
    get active() { return provider; },
    dispose() { if (disposed) return; stop(); disposed = true; panel.remove(); }
  };
}
