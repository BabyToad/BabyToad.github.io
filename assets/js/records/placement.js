// Record handling is separate from the motor/stylus simulation. Metres, +z up.
import * as G from './physics/gl-util.js';
const rotateX=a=>{const m=G.ident(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export class RecordPlacement {
 constructor(){this.phase='empty';this.pose=[0,0,0,0];this.path=[];this.elapsed=0;this.home=[-.60,.002,.068,Math.PI/2];}
 get moving(){return this.path.length>0;}
 get placed(){return this.phase==='placed';}
 get visible(){return this.phase!=='empty';}
 get matrix(){return G.chain(G.T(...this.pose.slice(0,3)),rotateX(this.pose[3]));}
 start(phase,points,finish){this.phase=phase;this.path=points;this.from=this.pose.slice();this.elapsed=0;this.finish=finish;}
 extract(home){this.home=home;this.pose=home.slice();this.start('extracting',[[home[0],home[1]-.012,.43,Math.PI/2],[-.36,-.13,.43,.7]],'held');}
 place(){if(this.phase!=='held')return;this.start('placing',[[0,0,.35,0],[0,0,.015,0],[0,0,0,0]],'placed');}
 return(){if(!this.visible||this.moving)return;this.start('returning',[[0,0,.35,0],[-.36,-.13,.43,.7],[this.home[0],this.home[1]-.012,.43,Math.PI/2],this.home],'empty');}
 reset(){this.path=[];this.phase='placed';this.pose=[0,0,0,0];}
 tick(dt,reduced=false){if(!this.moving)return false;this.elapsed+=dt;const duration=.55,t=reduced?1:Math.min(1,this.elapsed/duration),smooth=t*t*(3-2*t);this.pose=mix(this.from,this.path[0],smooth);if(t===1){this.from=this.pose.slice();this.path.shift();this.elapsed=0;if(!this.path.length)this.phase=this.finish;}return true;}
}
