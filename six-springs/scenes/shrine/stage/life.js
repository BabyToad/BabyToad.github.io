import { Rig } from '../../../src/rig.js';
import { Secondary } from '../../../src/motion/secondary.js';
import { clamp } from '../../../src/math.js';

/** Small deterministic environment performance. Renderers only sample it. */
export function stageLife(config,p) {
  const ribbon=new Rig({format:2,name:'Painted shrine ribbon',stage:config.image,
    controls:{wind:[-10,10],bend:[-6,6],tip:[-8,8]},parts:{},views:{default:{
      pivots:{},layers:[],bones:[{name:'root'},
        {name:'ribbon',parent:'root',pivot:[1186,111],rot:[{c:'bend',k:1}]},
        {name:'tip',parent:'ribbon',pivot:[1184,208],rot:[{c:'tip',k:1}]}],
      secondary:[{into:['bend'],f:[1.1],z:.65,input:[{control:'wind',gain:1}]},
        {into:['tip'],f:[1.8],z:.45,input:[{control:'bend',gain:.65}]}]}}});
  const depth=config.occluders.find(x=>x.id==='ribbon').depth;
  const anchor=[1186,180],motion=new Secondary(24),origin=p.atDepth(anchor,depth);
  let pose=ribbon.neutral(),gust=0;
  return {ribbon,depth,
    step(tick,events){
      for(const e of events)if(['bell','land','stamp','water','wind'].includes(e.kind)){
        const distance=e.point?Math.hypot(...e.point.map((v,i)=>v-origin[i])):0;
        gust=Math.min(9,gust+(e.kind==='wind'?9:1.6/(1+distance)));
      }
      gust*=.94;
      pose=motion.step(ribbon.views.default,ribbon.neutral({wind:1.15*Math.sin(tick/43)+.55*Math.sin(tick/17)+gust}));
      pose.bend=clamp(pose.bend,-6,6);pose.tip=clamp(pose.tip,-8,8);
    },
    get pose(){return {...pose};},
    get origin(){return p.atDepth(ribbon.views.default.point(pose,'ribbon',anchor),depth);},
  };
}
