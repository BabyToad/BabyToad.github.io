// Lossless precut format. Decompression streams into final typed arrays, not a giant copy.
const MAGIC='AKNB-GROOVE-1';
export async function decodePrecut(stream,{maxDecodedBytes=300*1048576,signal,onProgress=()=>{}}={}){
 const reader=stream.getReader();let chunk=new Uint8Array(),offset=0,total=0;
 async function fill(target){let at=0;while(at<target.byteLength){if(signal?.aborted)throw new DOMException('Cancelled','AbortError');if(offset===chunk.length){const result=await reader.read();if(result.done)throw new Error('The pressing download was incomplete.');chunk=result.value;offset=0;}const n=Math.min(target.byteLength-at,chunk.length-offset);target.set(chunk.subarray(offset,offset+n),at);offset+=n;at+=n;total+=n;onProgress(total);}}
 try{
  const prefix=new Uint8Array(4);await fill(prefix);const length=new DataView(prefix.buffer).getUint32(0,true);if(length<2||length>1048576)throw new Error('Invalid pressing header.');const bytes=new Uint8Array(length);await fill(bytes);const header=JSON.parse(new TextDecoder().decode(bytes));
  if(header.format!==MAGIC||!Number.isSafeInteger(header.decodedBytes)||header.decodedBytes>maxDecodedBytes)throw new Error('This pressing is too large for this device. Use the full recording player.');
  const types={wallIn:Float32Array,wallOut:Float32Array,rTab:Float64Array,visual:Uint8Array},arrays={};let expected=0;
  for(const [name,Type]of Object.entries(types)){const count=header.arrays[name];if(!Number.isSafeInteger(count)||count<1)throw new Error('Invalid pressing array.');expected+=count*Type.BYTES_PER_ELEMENT;}
  if(expected!==header.decodedBytes)throw new Error('Invalid pressing size.');
  for(const [name,Type]of Object.entries(types)){const a=arrays[name]=new Type(header.arrays[name]);await fill(new Uint8Array(a.buffer));}
  if(offset!==chunk.length||!(await reader.read()).done)throw new Error('Unexpected data after pressing.');
  const rec={...header.record,wallIn:arrays.wallIn,wallOut:arrays.wallOut,rTab:arrays.rTab};if(rec.truncated||rec.n!==rec.wallIn.length||rec.n!==rec.wallOut.length)throw new Error('Incomplete pressing.');
  return {rec,vis:{...header.visual,data:arrays.visual},header};
 }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
export async function loadPrecut(entry,{baseURL=location.href,maxDecodedBytes=300*1048576,signal,onProgress}={}){
 if(!entry||entry.decodedBytes>maxDecodedBytes)throw new Error('This pressing is too large for this device. Use the full recording player.');
 if(typeof DecompressionStream==='undefined')throw new Error('This browser cannot open precut records. Use the full recording player.');
 const response=await fetch(new URL(entry.path,baseURL),{signal});if(!response.ok||!response.body)throw new Error('The pressing could not download. Try again or use the full recording player.');
 const result=await decodePrecut(response.body.pipeThrough(new DecompressionStream('gzip')),{maxDecodedBytes,signal,onProgress});
 if(result.header.decodedBytes!==entry.decodedBytes||result.header.sourceSha256!==entry.sourceSha256)throw new Error('This pressing does not match its catalogue entry.');return result;
}
