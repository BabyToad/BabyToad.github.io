import assert from 'node:assert/strict';
import {Engine} from '../assets/js/records/physics/engine.js';
import {cut} from '../assets/js/records/physics/cut.js';
import {press} from '../assets/js/records/physics/press.js';
import {alphaForRadius,grooveRadius,stylusXY} from '../assets/js/records/physics/geometry.js';
import {grooveMesh} from '../assets/js/records/micro-surface.js';

const fs=48000,L=Float32Array.from({length:fs*8},(_,i)=>.2*Math.sin(2*Math.PI*1000*i/fs));
const rec=cut([{L,R:L,title:'Control measurement'}],fs);press(rec,{noise:0,dust:0,scratches:0,warp:0,offCenter:0,echo:0},17);
function run(e,seconds){let inner=0,outer=0,peak=0,vibration=0;const a=new Float32Array(480),b=new Float32Array(480);for(let i=0;i<seconds*100;i++){e.process(a,b,480);const t=e.telemetry();inner+=t.nIn;outer+=t.nOut;peak=Math.max(peak,t.peak);vibration=Math.max(vibration,Math.abs(t.plinth));}assert.equal(e.blown||0,0);return {inner:inner/(seconds*100),outer:outer/(seconds*100),peak,vibration};}
function start(force,skate){const e=new Engine(fs);e.setRecord(rec);e.set({vtf:force,antiskate:skate,volume:.35,rumble:0,flutter:0});e.p.preNoise=0;e.setMotor(true);e.wp=e.wSet;e.al=alphaForRadius(grooveRadius(rec.rTab,rec.tracks[0].theta0+1));const [x,y]=stylusXY(e.al);e.thp=rec.tracks[0].theta0+1-Math.atan2(y,x);e.zb=.0003;e.zcue=-.002;e.cueUp=false;run(e,2);return e;}
const low=run(start(.5,1.8),.5),high=run(start(3,1.8),.5),sk0=run(start(1.8,0),.5),sk3=run(start(1.8,3),.5);
assert(high.inner+high.outer>3*(low.inner+low.outer),'tracking force must load the walls');
assert(Math.abs((sk0.inner-sk0.outer)-(sk3.inner-sk3.outer))>.001,'anti-skate must alter wall balance');
const e=start(1.8,1.8);e.bump(4);const knock=run(e,.5);assert(knock.vibration>.0001);e.set({volume:0});assert.equal(run(e,.1).peak,0);
// A silent V is 60 µm wide and 30 µm deep; an 18 µm contact sphere seats against both walls.
const flat=new Float32Array(1212);for(let row=0;row<5;row++)for(let i=0;i<121;i++){const o=(row*121+i)*2;flat[o]=(2-row)*.00015-.00003;flat[o+1]=(2-row)*.00015+.00003;}
const mesh=grooveMesh(flat,.145,86400);assert(mesh.length>1000);assert(mesh.every(Number.isFinite));
let minZ=Infinity;for(let i=2;i<mesh.length;i+=6)minZ=Math.min(minZ,mesh[i]);assert(Math.abs(minZ+30)<1e-4);
e.set({volume:.35});e.bump(8);assert(run(e,.5).vibration>.0002);
console.log('PASS wall-load response, anti-skate balance, knock displacement, mute and true-scale V mesh',JSON.stringify({low,high,sk0,sk3,knock}));
