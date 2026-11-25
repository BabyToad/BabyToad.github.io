// One YouTube session at a time. No provider request before explicit consent/play.
let apiPromise;
function youtubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('YouTube did not connect. Try again or open the album directly.')), 15000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); resolve(window.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('YouTube could not load. Check your connection or open the album directly.')); };
    document.head.append(script);
  }).catch(error => { apiPromise = null; throw error; });
  return apiPromise;
}

export function createPlayback(host, report) {
  let player, generation = 0, timer;
  const testingMuted = new URLSearchParams(location.search).get('mute') === '1';
  function stop() {
    generation++;
    clearTimeout(timer);
    if (player) { player.destroy(); player = null; }
    host.replaceChildren();
  }
  async function play(album) {
    stop();
    const ownGeneration = generation;
    let failed = false;
    report('connecting', 'Connecting to YouTube…');
    try {
      const YT = await youtubeAPI();
      if (generation !== ownGeneration) return;
      const mount = document.createElement('div');
      host.append(mount);
      timer=setTimeout(()=>{
        if(generation!==ownGeneration)return;
        report('error','YouTube did not respond. Retry, or open the album directly.');
      },20000);
      player = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        width: '100%', height: '100%',
        playerVars: { listType: 'playlist', list: album.playlist, controls: 1, playsinline: 1, origin: location.origin, rel: 0 },
        events: {
          onReady(event) {
            if (generation !== ownGeneration || failed) return;
            clearTimeout(timer);
            event.target.getIframe().title = `${album.artist} — ${album.title} on YouTube`;
            if (testingMuted) event.target.mute();
            event.target.playVideo();
            timer = setTimeout(() => {
              if (generation === ownGeneration && !failed && [-1,5].includes(event.target.getPlayerState()))
                report('ready', 'Ready. Press Play in the YouTube player below if playback has not started.');
            }, 9000);
          },
          onStateChange(event) {
            if (generation !== ownGeneration) return;
            const state = event.data;
            if (state === 1) { failed = false; clearTimeout(timer); report('playing', 'Playing on YouTube.'); }
            if (failed) return;
            if (state === 2) report('paused', 'Paused. Lower the needle to continue.');
            if (state === 3) report('buffering', 'Buffering…');
            if (state === 0) report('ended', 'This track has finished. Use the player to choose another.');
            if (state === 5) report('ready', 'Ready to play.');
          },
          onAutoplayBlocked() { if (generation === ownGeneration && !failed) report('ready', 'Press Play in the YouTube player below to start listening.'); },
          onError(event) {
            if (generation !== ownGeneration) return;
            failed = true;
            clearTimeout(timer);
            report('error', `This album cannot play here right now (YouTube ${event.data}). Retry, or open it in YouTube Music.`);
          }
        }
      });
    } catch (error) { if (generation === ownGeneration) report('error', error.message); }
  }
  return { play, stop, pause: () => player?.pauseVideo(), resume: () => player?.playVideo() };
}
