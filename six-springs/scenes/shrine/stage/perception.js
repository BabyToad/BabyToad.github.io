/** Shrine policy, not a universal actor API. Salient events can interrupt attention,
 * never physical ownership. Repetition attenuates; time restores sensitivity. */
export class Perception {
  constructor(){this.pending=[];this.history=new Map();this.current=null;this.pointer=null;}
  observe(event,tick){
    if(event.kind==='pointer'){this.pointer=event.active===false?null:{point:[event.x,event.y],until:tick+120};return;}
    const profile={visitor:[.7,2,72],bell:[.8,2,60],drop:[.9,1,36],land:[1,1,90],frog:[.45,4,48],water:[.35,3,48],wind:[.35,3,48]}[event.kind];
    if(!profile)return;
    const old=this.history.get(event.kind),count=old&&tick-old.tick<120?old.count+1:0;
    this.history.set(event.kind,{count,tick});
    this.pending.push({...event,score:profile[0]/(1+count*.45),at:tick+profile[1],duration:profile[2]});
  }
  step(tick){
    if(this.current&&tick>=this.current.until)this.current=null;
    const due=this.pending.filter(x=>x.at<=tick);this.pending=this.pending.filter(x=>x.at>tick);
    for(const e of due)if(e.score>.18&&(!this.current||e.score>=this.current.score))this.current={...e,until:tick+e.duration};
    return this.current || (this.pointer&&tick<=this.pointer.until?this.pointer:null);
  }
}
