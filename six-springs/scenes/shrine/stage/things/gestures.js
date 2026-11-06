/** Existing stage gestures. New residents declare their own targets beside their state. */
export function gestures(host) {
  const command=kind=>()=>({kind});
  const poke=(target,point,extra={})=>({kind:'poke',target,x:point[0],y:point[1],...extra});
  const water={point:()=>[1210,740],interact:({experience,point})=>experience
    ? [{kind:'water'},poke('water',point)]:{kind:'water'}};
  return {id:'gestures',targets:{
    bell:{control:'ring',interact:command('ring')},cord:{interact:command('ring')},
    bowl:{control:'offer',exactFirst:true,priority:10,
      hit:(x,y)=>host.bowl.moved&&!host.bowl.held&&Math.hypot(x-host.frame('bowl').screen[0],y-host.frame('bowl').screen[1])<64,
      interact:command('offer')},rice:{interact:command('offer')},
    ribbon:{interact:command('wind')},
    stream:{...water,control:'water'},basin:water,
    spout:{control:'spout',point:()=>[1300,605],interact:({experience,point})=>experience
      ? [{kind:'water'},poke('spout',point)]:{kind:'water'}},
    saint:{control:'saint',point:()=>[620,500],interact:({experience,point})=>experience
      ? poke('saint',point,{action:host.action?.id??host.request??null,
        speech:host.actor.layers.get('speech')?.source?host.actor.layers.get('speech').id:null})
      : (host.action?.id??host.request)?{kind:'interrupt',request:host.action?.id??host.request}:{kind:'notice'}},
    stool:{interact:({point})=>host.bowl.moved?{kind:'offer'}:poke('stool',point)},
    wall:{interact:({point})=>poke('wall',point)},
  },speech:{command({intent},tick,director){
    if(intent.kind==='wind'){
      director.speaker.notice(tick,host.frame('ribbon').screen);
      director.lastClick=tick;
      director.ask('ribbon',tick,10);
    }
  }}};
}
