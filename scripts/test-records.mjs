// Optional Node regression checks. No packages; not part of the Jekyll build.
import assert from 'node:assert/strict';
import {Renderer} from '../assets/js/records/physics/render.js';
import {ALPHA_MIN,ALPHA_REST,stylusXY,alphaForRadius,grooveRadius} from '../assets/js/records/physics/geometry.js';
import {Engine} from '../assets/js/records/physics/engine.js';
import {cut} from '../assets/js/records/physics/cut.js';
import {press} from '../assets/js/records/physics/press.js';
import {readFileSync} from 'node:fs';

// Capture matrices submitted by the actual rendering method, including the visible diamond.
globalThis.window={devicePixelRatio:1};
let model,mesh;const submissions=[];
const gl=new Proxy({uniformMatrix4fv:(key,transpose,value)=>{if(key==='model')model=Array.from(value);},bindVertexArray:value=>{mesh=value;},drawArrays:()=>{if(mesh==='collar')submissions.push(model);}}, {get:(object,key)=>object[key]??(()=>{})});
const r=Object.create(Renderer.prototype);
Object.assign(r,{gl,canvas:{width:1200,height:800,clientWidth:1200,clientHeight:800},m:new Proxy({}, {get:(_,key)=>({vao:key,count:6})}),tex:{},info:null,markings:{draw(){}},dep:{p:0,u:{uM:'model'}},std:{p:1,u:{uM:'model'}},lvp:new Float32Array(16)});
let maxError=0;
for(let i=0;i<20;i++)for(const height of [0,.005]){
 const angle=ALPHA_MIN+(ALPHA_REST-ALPHA_MIN)*i/19;
 r.draw({al:angle,zt:height,thp:0,zoom:0,az:0,el:.7,rpm:100/3,motor:false});
 const m=submissions.at(-1),actual=[m[12]-.03*m[8],m[13]-.03*m[9],m[14]-.03*m[10]],expected=[...stylusXY(angle),height];
 const error=Math.hypot(...actual.map((v,k)=>v-expected[k]));maxError=Math.max(maxError,error);assert(error<.0005,`Visible stylus differs by ${error} m at angle ${angle}`);
}
console.log(`PASS rendered stylus vs engine: 40 poses, max ${(maxError*1000).toFixed(6)} mm`);

// Master a deterministic stereo tone and verify that the physical engine makes audio,
// changes speed and clears contact on cue lift. No provider or synthetic player events.
const fs=48000,L=Float32Array.from({length:fs*12},(_,i)=>.2*Math.sin(2*Math.PI*1000*i/fs));
const rec=cut([{L,R:L.slice(),title:'Regression tone'}],fs);press(rec,{noise:0,dust:0,scratches:0,warp:0,offCenter:0,echo:0},17);
const engine=new Engine(fs);engine.setRecord(rec);engine.set({volume:1,hum:0,rumble:0,flutter:0});engine.setMotor(true);
const a=new Float32Array(480),b=new Float32Array(480);
function run(seconds){let peak=0;for(let i=0;i<seconds*100;i++){engine.process(a,b,480);for(const value of a){assert(Number.isFinite(value));peak=Math.max(peak,Math.abs(value));}}return peak;}
run(2);engine.cueTo(alphaForRadius(grooveRadius(rec.rTab,rec.tracks[0].theta0+1)));for(let i=0;i<1200&&(engine.auto||engine.tel.theta<rec.tracks[0].theta0+2*Math.PI);i++)run(.01);assert(engine.tel.theta>rec.tracks[0].theta0);const level=run(1);assert(level>.05);
assert.equal(engine.blown||0,0);assert(Math.abs(engine.wp*60/(2*Math.PI)-100/3)<.5);
engine.setSpeed(45);run(2);assert(Math.abs(engine.wp*60/(2*Math.PI)-45)<.5);
engine.setCue(true);run(2);assert(engine.telemetry().hc>.001);assert.equal(engine.blown||0,0);
console.log('PASS physical tone output, motor, speed, cue and finite output');
const albums=JSON.parse(readFileSync(new URL('../_data/records.json',import.meta.url),'utf8'));
assert.equal(albums.length,10);assert.equal(new Set(albums.map(a=>a.id)).size,10);
for(const album of albums){assert(album.url.startsWith('https://'));assert(album.tracks.length>0);assert.equal(album.note,'');}
console.log('PASS ten unique public albums; no invented personal notes');
