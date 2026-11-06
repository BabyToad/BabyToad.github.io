/** Per-performance residents. No clock, DOM, global state or renderer dependency. */
export function createThings(factories, host, core={}) {
  const residents=[],ids=new Set(),targets=new Map(),intents=new Map(),frames=new Map(),art=new Map(),answers=new Map();
  const claim=(map,key,value,label)=>{
    if(map.has(key))throw Error(`Duplicate stage ${label}: ${key}`);
    map.set(key,value);
  };
  for(const factory of factories){
    const thing=factory(host);
    if(!thing.id||ids.has(thing.id))throw Error(`Duplicate or missing stage thing: ${thing.id}`);
    ids.add(thing.id);residents.push(thing);
    // Core migration is explicit. Resident-to-resident conflicts still require
    // removing the old declaration from the composition.
    for(const category of ['intents','frames','answers']){
      const reserved=new Set(core[category]||[]),adopted=new Set(thing.adopts?.[category]||[]);
      for(const key of adopted)if(!reserved.has(key)||!Object.hasOwn(thing[category]||{},key))
        throw Error(`Resident ${thing.id}: stale core adoption ${category}.${key}`);
      for(const key of Object.keys(thing[category]||{}))if(reserved.has(key)&&!adopted.has(key))
        throw Error(`Resident ${thing.id} claims core ${category}.${key}; declare adopts.${category}: ['${key}'] for an intentional migration`);
    }
    for(const slot of thing.layers||[]){
      if(!slot.startsWith(`${thing.id}.`)||host.actor.slots.includes(slot))
        throw Error(`Resident ${thing.id}: actor layer must be unique and start with ${thing.id}. (${slot})`);
      // Residents yield to the shared speech/expression and action layers.
      host.actor.slots.splice(host.actor.slots.indexOf('expression'),0,slot);
    }
    for(const [key,value] of Object.entries(thing.targets||{}))claim(targets,key,value,'target');
    for(const [key,value] of Object.entries(thing.intents||{}))claim(intents,key,value,'intent');
    for(const [key,value] of Object.entries(thing.frames||{}))claim(frames,key,value,'frame');
    for(const value of thing.art||[])claim(art,value.id,value,'art');
    for(const [key,value] of Object.entries(thing.answers||{}))claim(answers,key,Object.freeze([...value]),'answer pool');
  }
  const events=[];let delivering=false;
  return {
    art: [...art.values()],
    answerPools: Object.freeze(Object.fromEntries(answers)),
    get(id){return residents.find(thing=>thing.id===id);},
    get request(){return residents.find(r=>r.request)?.request??null;},
    interrupt(intent){return residents.some(r=>r.interrupt?.(intent)===true);},
    frame(name){return frames.get(name)?.();},
    hasFrame(name){return frames.has(name);},
    // Presentation only. The last registered active request wins. Sampling
    // cannot record viewport changes or advance any resident's clock.
    framing(){
      for(let i=residents.length-1;i>=0;i--){
        const frame=residents[i].framing?.();
        if(!frame||frame.amount<=0)continue;
        if(!Array.isArray(frame.bounds)||frame.bounds.length!==4||!frame.bounds.every(Number.isFinite)||
          frame.bounds[2]<=0||frame.bounds[3]<=0||!Number.isFinite(frame.amount)||frame.amount>1)
          throw Error(`Invalid framing for ${residents[i].id}`);
        return structuredClone(frame);
      }
      return null;
    },
    handle(intent,tick){return intents.get(intent.kind)?.(intent,tick);},
    // A resident may supply a sampled route and final hand constraint. Core
    // actions take precedence in the host; two simultaneous routes are an error.
    motion(tick){
      const active=residents.map(r=>({id:r.id,value:r.motion?.(tick)})).filter(r=>r.value);
      if(active.length>1)throw Error(`Conflicting resident routes: ${active.map(r=>r.id).join(', ')}`);
      if(active[0]&&!active[0].value.position?.every(Number.isFinite))throw Error('Invalid resident route');
      return active[0]?.value;
    },
    constrain(pose){for(const r of residents)pose=r.constrain?.(pose)??pose;return pose;},
    beforePose(tick,context){for(const thing of residents)thing.beforePose?.(tick,context);},
    afterPhysics(tick){for(const thing of residents)thing.afterPhysics?.(tick);},
    // FIFO delivery also permits a resident to emit a consequence in response.
    event(event){
      events.push(event);if(delivering)return;
      delivering=true;
      try {let count=0;while(events.length){
        if(++count>1024)throw Error('Stage consequence cycle');
        const next=events.shift();for(const thing of residents)thing.onEvent?.(next);
      }} finally {delivering=false;events.length=0;}
    },
    interact(target,options={}){
      const spec=targets.get(target);
      if(!spec)return false;
      const point=options.point||spec.point?.()||[0,0];
      const result=spec.interact?.({...options,point});
      if(!result)return false;
      let accepted=false;
      for(const intent of Array.isArray(result)?result:[result])accepted=host.send(intent)||accepted;
      return accepted;
    },
    control(name){for(const [target,spec] of targets)if(spec.control===name)return target;return null;},
    key(target,key){
      const intent=targets.get(target)?.key?.(key);return intent?host.send(intent):false;
    },
    // A captured pointer belongs to the target that began it, even off canvas.
    gesture(target,phase,point){
      const result=targets.get(target)?.gesture?.({phase,point});
      if(!result)return false;
      for(const intent of Array.isArray(result)?result:[result])host.send(intent);
      return true;
    },
    // Painting coordinates; direct bowl hits keep their historical precedence.
    pick(x,y,direct){
      if(targets.get(direct)?.exactFirst)return direct;
      const candidates=[...targets].filter(([,spec])=>spec.hit).sort((a,b)=>(b[1].priority||0)-(a[1].priority||0));
      for(const [target,spec] of candidates)if(spec.hit(x,y))return target;
      return direct;
    },
    answers(pool){return answers.get(pool);},
    speechCommand(command,tick,director){
      for(const thing of residents)thing.speech?.command?.(command,tick,director);
    },
    speechEvent(event,tick,director){for(const thing of residents)thing.speech?.event?.(event,tick,director);},
    async mount(kit){
      const views=[];
      try {for(const thing of residents){const view=await thing.mount?.(kit);if(view)views.push(view);}}
      catch(error){for(const view of views)view.dispose?.();throw error;}
      return {update(tick){for(const view of views)view.update?.(tick);},dispose(){for(const view of views)view.dispose?.();}};
    },
  };
}
