// Local crackle layer only: provider audio is never intercepted or processed.
export function createVinylTexture(onAudition=()=>{}) {
  let disposed=false;
  let context,source,gain,enabled=false,playing=false,level=.35,auditioning=false,testTimer,suspendTimer;
  function ensure(){
    if(disposed)throw new Error('Crackle player is closed.');
    if(context)return;
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)throw new Error('This browser does not support vinyl crackle.');
    context=new Audio();gain=context.createGain();gain.gain.value=0;
    const buffer=context.createBuffer(1,context.sampleRate*11,context.sampleRate),samples=buffer.getChannelData(0);
    let smooth=0,click=0,sum=0;
    for(let i=0;i<samples.length;i++){
      smooth=.93*smooth+.07*(Math.random()*2-1);
      if(Math.random()<.00016)click=(Math.random()*2-1)*.9;
      click*=.78;samples[i]=smooth+click;sum+=samples[i]*samples[i];
    }
    const scale=.22/Math.sqrt(sum/samples.length);
    for(let i=0;i<samples.length;i++)samples[i]=Math.max(-1,Math.min(1,samples[i]*scale));
    const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=4200;
    source=context.createBufferSource();source.buffer=buffer;source.loop=true;
    source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start();
  }
  function sync(){
    if(disposed||!context)return;clearTimeout(suspendTimer);
    const audible=(auditioning||enabled&&playing)&&!document.hidden;
    gain.gain.setTargetAtTime(audible?level*.16:0,context.currentTime,.045);
    if(audible&&context.state==='suspended')context.resume().catch(()=>{});
    if(!audible&&context.state==='running')suspendTimer=setTimeout(()=>context?.suspend(),180);
  }
  async function enable(value){enabled=value;if(value){ensure();await context.resume();}sync();}
  async function audition(){if(level===0)throw new Error('Raise the crackle level to hear the test.');ensure();clearTimeout(testTimer);auditioning=true;await context.resume();if(disposed)return;sync();onAudition('Testing crackle · 3 seconds');testTimer=setTimeout(()=>{auditioning=false;sync();onAudition('Crackle test finished.');},3000);}
  document.addEventListener('visibilitychange',sync);
  return {enable,audition,setLevel(value){level=Math.max(0,Math.min(1,value));sync();},setPlaying(value){playing=value;sync();},dispose(){disposed=true;clearTimeout(testTimer);clearTimeout(suspendTimer);document.removeEventListener('visibilitychange',sync);source?.stop();context?.close();}};
}
