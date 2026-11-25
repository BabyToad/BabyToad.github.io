import assert from 'node:assert/strict';import{decodePrecut}from'../assets/js/records/precut.js';
const A=new Float32Array([.00001,-.00002]),B=new Float32Array([-.00003,.00004]),r=new Float64Array([.146,.145]),v=new Uint8Array([1,255]);
const base={format:'AKNB-GROOVE-1',decodedBytes:34,arrays:{wallIn:2,wallOut:2,rTab:2,visual:2},record:{n:2,truncated:false,fs:48000},visual:{cols:2,rows:1}};
function payload(header=base,extra=0){const json=new TextEncoder().encode(JSON.stringify(header)),bytes=new Uint8Array(4+json.length+34+extra);new DataView(bytes.buffer).setUint32(0,json.length,true);bytes.set(json,4);let o=4+json.length;for(const a of[A,B,r,v]){bytes.set(new Uint8Array(a.buffer),o);o+=a.byteLength;}return bytes;}
const stream=bytes=>new ReadableStream({start(c){for(let i=0;i<bytes.length;i+=7)c.enqueue(bytes.slice(i,i+7));c.close();}});
const decoded=await decodePrecut(stream(payload()));assert.deepEqual(decoded.rec.wallIn,A);assert.deepEqual(decoded.rec.wallOut,B);assert.deepEqual(decoded.rec.rTab,r);assert.deepEqual(decoded.vis.data,v);
await assert.rejects(decodePrecut(stream(payload()),{maxDecodedBytes:16}),/too large/);
await assert.rejects(decodePrecut(stream(payload({...base,arrays:{...base.arrays,wallIn:2147483647}}))),/Invalid pressing size/);
await assert.rejects(decodePrecut(stream(payload().slice(0,-1))),/incomplete/);
await assert.rejects(decodePrecut(stream(payload(base,1))),/Unexpected data/);
await assert.rejects(decodePrecut(stream(payload({...base,format:'unknown'}))),/too large/);
const abort=new AbortController();abort.abort();await assert.rejects(decodePrecut(stream(payload()),{signal:abort.signal}),{name:'AbortError'});
console.log('PASS precut exact roundtrip, preallocation limit, malicious counts, truncation, trailing data, version and abort');
