// Browser lifecycle around the MIT-licensed groove simulation. No provider audio.
export function createPhysicalAudio(onTelemetry, onState, onError) {
  let context, node, initializing, disposed=false, ready=false, pendingRecord;
  const send=message=>{if(ready&&node&&!disposed)node.port.postMessage(message);};
  function detach(candidate){if(!candidate)return;candidate.port.onmessage=null;candidate.onprocessorerror=null;candidate.disconnect();candidate.port.close();}
  async function unlock(){
    if(disposed)throw new Error('The audio engine has closed. Reload to restart it.');
    context ||= new AudioContext({latencyHint:'interactive'});
    const resumed=context.resume(); // Directly inside click activation, before any await (iOS).
    initializing ||= (async()=>{
      await context.audioWorklet.addModule(new URL('./physics/worklet.js',import.meta.url));
      if(disposed)return;
      const candidate=node=new AudioWorkletNode(context,'turntable',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});
      try{
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(new Error('Audio took too long to start. Tap Put it on to retry.')),12000);
          candidate.port.onmessage=({data})=>{
            if(disposed||node!==candidate)return;
            if(data.t==='ready'){clearTimeout(timer);ready=true;resolve();}
            if(data.t==='tel')onTelemetry(data);
            if(data.t==='log')console.warn(data.msg);
          };
          candidate.onprocessorerror=()=>{clearTimeout(timer);ready=false;disposed=true;onError('The audio engine stopped. Reload to restart it.');reject(new Error('Audio engine failed.'));};
          candidate.connect(context.destination);
        });
        send({t:'set',volume:.35,hum:0});
        if(pendingRecord)install(pendingRecord);
      }catch(error){detach(candidate);if(node===candidate)node=null;ready=false;throw error;}
    })().catch(error=>{initializing=null;throw error;});
    let resumeTimer;
    try{await Promise.all([initializing,Promise.race([resumed,new Promise((_,reject)=>{resumeTimer=setTimeout(()=>reject(new Error('Tap Put it on again to allow audio.')),4000);})])]);}
    finally{clearTimeout(resumeTimer);}
    if(disposed||context.state!=='running')throw new Error('Tap Put it on again to allow audio.');
    onState('running');
  }
  function install(record){
    pendingRecord=record;if(!ready)return;
    // The renderer uses the small visualization and radius table, never the wall arrays.
    // Transfer each pressing once; re-pressing cuts a new record from the original files.
    const {wallIn,wallOut}=record;
    if(!wallIn.byteLength||!wallOut.byteLength)throw new Error('This pressing has already been installed.');
    send({t:'motor',on:false});send({t:'cue',up:true});send({t:'platter',on:false});
    node.port.postMessage({t:'record',rec:record,seq:record.sequence},[wallIn.buffer,wallOut.buffer]);
    pendingRecord=null;
  }
  return {unlock,send,install,get ready(){return ready;},get context(){return context;},
    async silence(){send({t:'motor',on:false});send({t:'cue',up:true});await context?.suspend();onState('suspended');},
    dispose(){disposed=true;ready=false;detach(node);node=null;context?.close();pendingRecord=null;}
  };
}
