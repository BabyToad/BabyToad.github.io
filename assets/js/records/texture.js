// Optional surface noise, generated locally. It never processes the provider's audio.
export function createVinylTexture() {
  let context,source,gain,enabled=false,playing=false,level=.35;
  const silent=new URLSearchParams(location.search).get('mute')==='1';
  function sync() {
    if(!context)return;
    const audible=enabled&&playing&&!document.hidden&&!silent;
    gain.gain.setTargetAtTime(audible ? level*.07 : 0,context.currentTime,.08);
  }
  async function enable(value) {
    enabled=value;
    if(value&&!context) {
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio)throw new Error('This browser does not support the surface-noise effect.');
      context=new Audio();gain=context.createGain();gain.gain.value=0;
      const buffer=context.createBuffer(1,context.sampleRate*6,context.sampleRate),samples=buffer.getChannelData(0);
      let smooth=0;
      for(let i=0;i<samples.length;i++){
        smooth=.97*smooth+.03*(Math.random()*2-1);
        samples[i]=smooth+(Math.random()<.00012?(Math.random()*2-1)*.6:0);
      }
      const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=3200;
      source=context.createBufferSource();source.buffer=buffer;source.loop=true;
      source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start();
    }
    if(value&&context?.state==='suspended')await context.resume();sync();
    if(!value&&context?.state==='running')await context.suspend();
  }
  document.addEventListener('visibilitychange',sync);
  return {enable,setLevel(value){level=Math.max(0,Math.min(1,value));sync();},setPlaying(value){playing=value;sync();},dispose(){document.removeEventListener('visibilitychange',sync);source?.stop();context?.close();}};
}
