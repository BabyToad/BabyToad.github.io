// Record handling is separate from the motor/stylus simulation. Metres, +z up.
import * as G from './physics/gl-util.js';
const rotateX=a=>{const m=G.ident(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export class RecordPlacement {
 constructor(){this.phase='empty';this.pose=[0,0,0,0,0];this.path=[];this.elapsed=0;this.home=[-.60,.005,.0855,Math.PI/2,0];}
 get moving(){return this.path.length>0;}
 get placed(){return this.phase==='placed';}
 get visible(){return this.phase!=='empty';}
 get matrix(){return G.chain(G.T(...this.pose.slice(0,3)),G.Ry(this.pose[4]||0),rotateX(this.pose[3]));}
 start(phase,points,finish){this.phase=phase;this.path=points;this.from=this.pose.slice();this.elapsed=0;this.finish=finish;}
 extract(home){this.home=home;this.pose=home.slice();const a=home[4];this.clear=[home[0]+.36*Math.sin(a),home[1],home[2]+.36*Math.cos(a),Math.PI/2,a];this.start('extracting',[this.clear,[-.36,-.13,.43,.7,0]],'held');}
 place(){if(this.phase!=='held')return;this.start('placing',[[0,0,.35,0,0],[0,0,.015,0,0],[0,0,0,0,0]],'placed');}
 return(home=this.home){if(!this.visible||this.moving)return;this.home=home;const a=home[4],clear=[home[0]+.36*Math.sin(a),home[1],home[2]+.36*Math.cos(a),Math.PI/2,a];this.start('returning',[[0,0,.35,0,0],[-.36,-.13,.43,.7,0],clear,home],'empty');}
 reset(){this.path=[];this.phase='placed';this.pose=[0,0,0,0,0];}
 tick(dt,reduced=false){if(!this.moving)return false;this.elapsed+=dt;const duration=.55,t=reduced?1:Math.min(1,this.elapsed/duration),smooth=t*t*(3-2*t);this.pose=mix(this.from,this.path[0],smooth);if(t===1){this.from=this.pose.slice();this.path.shift();this.elapsed=0;if(!this.path.length)this.phase=this.finish;}return true;}
}
