// Official Spotify iframe API. No provider request before an explicit listening choice.
let apiPromise;
function spotifyAPI() {
  if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const timeout=setTimeout(()=>{script.remove();reject(new Error('Spotify did not connect. Retry, or use the album link.'));},15000);
    window.onSpotifyIframeApiReady=api=>{clearTimeout(timeout);resolve(api);};
    script.src='https://open.spotify.com/embed/iframe-api/v1';
    script.onerror=()=>{clearTimeout(timeout);script.remove();reject(new Error('Spotify could not load. Retry, or use the album link.'));};
    document.head.append(script);
  }).catch(error=>{apiPromise=null;throw error;});
  return apiPromise;
}

export function createPlayback(host,report) {
  let controller,generation=0,timer,lastState='idle',expectedDuration=0,requestedURI=null,lastPosition=0,lastDuration=0,hasPlayed=false;
  function emit(state,message,detail={}) {lastState=state;report(state,message,detail);}
  function stop() {
    generation++;clearTimeout(timer);controller?.destroy();controller=null;
    host.replaceChildren();lastState='idle';requestedURI=null;lastPosition=lastDuration=0;hasPlayed=false;
  }
  function startingTimeout(own) {
    clearTimeout(timer);
    timer=setTimeout(()=>{
      if(own===generation&&!['playing','paused'].includes(lastState))
        emit(controller?'ready':'error',controller?'Press Play in the Spotify player below if playback has not started.':'Spotify did not finish connecting. Retry, or use the album link.');
    },9000);
  }
  async function play(album,index=0) {
    stop();const own=generation;requestedURI=album.tracks[index].uri;expectedDuration=album.tracks[index].durationMs;
    emit('connecting','Connecting to Spotify…');
    try {
      const api=await spotifyAPI();if(own!==generation)return;
      const mount=document.createElement('div');host.append(mount);
      startingTimeout(own);
      api.createController(mount,{uri:requestedURI,width:'100%',height:152},created=>{
        if(own!==generation){created.destroy();return;}controller=created;
        const frame=host.querySelector('iframe');if(frame)frame.title=`${album.title} — Spotify player`;
        created.addListener('ready',()=>{
          if(own!==generation)return;
          emit('ready','Spotify ready. Press Play below if your browser asks.');
          startingTimeout(own);created.play();
        });
        created.addListener('playback_update',event=>{
          if(own!==generation)return;
          const data=event.data;
          expectedDuration=album.tracks.find(track=>track.uri===data.playingURI)?.durationMs||expectedDuration;
          const preview=data.duration>0&&data.duration<expectedDuration-5000;
          const finish=preview?'Preview finished. Choose another track, or open the full album.':'Track finished. Choose another track or replay.';
          // Ignore queued updates from the old track until the requested one arrives.
          if(requestedURI&&data.playingURI!==requestedURI)return;
          if(requestedURI)requestedURI=null;
          const detail={uri:data.playingURI,position:data.position||0,duration:data.duration||0};
          if(data.isBuffering){emit('buffering','Buffering…',detail);return;}
          // Spotify can report its final preview position with isPaused still false.
          if(data.duration>0&&data.position>=data.duration){clearTimeout(timer);emit('ended',finish,detail);}
          else if(!data.isPaused&&data.duration>0){clearTimeout(timer);hasPlayed=true;emit('playing',preview?'Playing a Spotify preview.':'Playing on Spotify.',detail);}
          else if(data.isPaused){
            clearTimeout(timer);
            const ended=hasPlayed&&((data.duration>0&&data.position>=data.duration-350)||(data.position===0&&lastDuration>0&&lastPosition>=lastDuration-1500));
            emit(ended?'ended':hasPlayed?'paused':'ready',ended?finish:hasPlayed?'Paused. Lower the needle to continue.':'Spotify ready. Press Play below if your browser asks.',detail);
          }
          lastPosition=detail.position;lastDuration=detail.duration;
        });
      });
    } catch(error){if(own===generation)emit('error',error.message);}
  }
  return {play,stop,connected:()=>Boolean(controller),pause:()=>controller?.pause(),resume:()=>{if(controller){startingTimeout(generation);controller.resume();}},
    track:(uri,trackDuration)=>{if(!controller)return;requestedURI=uri;expectedDuration=trackDuration||expectedDuration;lastPosition=lastDuration=0;hasPlayed=false;emit('connecting','Loading track…');startingTimeout(generation);controller.loadUri(uri);controller.play();}};
}
