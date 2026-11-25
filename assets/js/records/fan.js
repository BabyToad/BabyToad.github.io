// Sleeves share the deck's camera, depth buffer and metre scale.
import * as G from './physics/gl-util.js';
const VS=`#version 300 es
in vec3 aP;in vec3 aN;uniform mat4 uVP,uM;out vec2 uv;out vec3 normal;
void main(){uv=vec2(aP.x/.28+.5,aP.z/.28);normal=mat3(uM)*aN;gl_Position=uVP*uM*vec4(aP,1.);}`;
const FS=`#version 300 es
precision highp float;in vec2 uv;in vec3 normal;uniform sampler2D uCover,uBack;uniform float uSelected;uniform int uMode;out vec4 color;
void main(){float light=.66+.34*abs(dot(normalize(normal),normalize(vec3(-.3,-.8,1.))));
if(uMode==1){color=vec4(vec3(.19,.17,.14)*light,1.);return;}
if(uMode==2){color=vec4(vec3(.68,.63,.54)*light,.10);return;}
vec3 c=uMode==3?texture(uBack,vec2(1.-uv.x,uv.y)).rgb:texture(uCover,uv).rgb;float edge=min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y));c=mix(c,vec3(.85,.7,.4),step(edge,.006)*uSelected);color=vec4(c*light,1.);}`;
export class AlbumFan{
 constructor(renderer,albums,invalidate){
  this.renderer=renderer;this.gl=renderer.gl;this.albums=albums;this.amount=0;this.cards=[];this.hover=null;
  const gl=this.gl;this.program=G.program(gl,VS,FS);
  this.face=G.mesh(gl,new Float32Array([-.14,-.0011,0,0,-1,0,.14,-.0011,0,0,-1,0,.14,-.0011,.28,0,-1,0,-.14,-.0011,0,0,-1,0,.14,-.0011,.28,0,-1,0,-.14,-.0011,.28,0,-1,0]));
  const back=[];const verts=[[-.14,.0011,0],[-.14,.0011,.28],[.14,.0011,.28],[-.14,.0011,0],[.14,.0011,.28],[.14,.0011,0]];for(const v of verts)back.push(...v,0,1,0);this.backFace=G.mesh(gl,new Float32Array(back));
  this.edge=G.mesh(gl,G.box(-.14,-.001,0,.14,.001,.28));
  this.tray=G.mesh(gl,G.merge(G.box(-.90,-.13,-.079,-.29,.30,-.073),G.box(-.90,.29,-.073,-.29,.30,.055),G.box(-.90,-.13,-.073,-.89,.30,.02),G.box(-.30,-.13,-.073,-.29,.30,.02)));
  const texture=image=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);if(image){gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);}else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([90,75,55,255]));for(const p of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,p,gl.LINEAR);for(const p of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE);return t;};
  this.textures=albums.map(a=>{const t=texture(),img=new Image();img.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);invalidate();};img.src=a.cover;return t;});
  this.backs=albums.map(a=>{const c=document.createElement('canvas');c.width=c.height=768;const ctx=c.getContext('2d');ctx.fillStyle='#ded3bb';ctx.fillRect(0,0,768,768);ctx.fillStyle='#221c14';ctx.font='26px serif';ctx.fillText(a.artist,38,65);ctx.font='20px monospace';ctx.fillText(a.year+' / '+a.tracks.length+' TRACKS',38,105);ctx.font='22px serif';a.tracks.slice(0,18).forEach((t,i)=>ctx.fillText(String(i+1).padStart(2,'0')+'  '+t.title,38,165+i*29,690));ctx.font='18px monospace';ctx.fillText('COLLECTION / NO AUDIO ATTACHED',38,725);return texture(c);});
 }
 draw(selected,dt,reduced=false){
  this.amount=reduced?selected:this.amount+(selected-this.amount)*(1-Math.exp(-dt*10));
  const gl=this.gl,{p,u}=this.program;gl.useProgram(p);gl.uniformMatrix4fv(u.uVP,false,this.renderer.cam.vp);gl.uniform1i(u.uCover,0);gl.uniform1i(u.uBack,1);this.cards=[];
  const draw=(mesh,M,mode)=>{gl.uniformMatrix4fv(u.uM,false,M);gl.uniform1i(u.uMode,mode);gl.bindVertexArray(mesh.vao);gl.drawArrays(gl.TRIANGLES,0,mesh.count);};
  // Separate depth slots keep the sleeve faces apart. The lower corner rests on the tray.
  for(let i=this.albums.length-1;i>=0;i--){
   const d=i-this.amount,spread=Math.max(-4.5,Math.min(4.5,d)),a=spread*.12;
   const M=G.chain(G.T(-.60+spread*.035,.08+i*.014-(i===selected?.075:0),-.072+.14*Math.abs(Math.sin(a))),G.Ry(a));
   gl.uniform1f(u.uSelected,i===selected||i===this.hover?1:0);draw(this.edge,M,1);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.textures[i]);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.backs[i]);draw(this.face,M,0);draw(this.backFace,M,3);
   const vp=G.mul(this.renderer.cam.vp,M),pts=[[-.14,-.0011,0],[.14,-.0011,0],[.14,-.0011,.28],[-.14,-.0011,.28]].map(v=>{const q=[0,1,2,3].map(r=>vp[r]*v[0]+vp[4+r]*v[1]+vp[8+r]*v[2]+vp[12+r]);return[(q[0]/q[3]+1)/2,(1-q[1]/q[3])/2,q[3]];});this.cards.push({i,pts});
  }
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);draw(this.tray,G.ident(),2);gl.depthMask(true);gl.disable(gl.BLEND);
 }
 pick(x,y){
  const b=this.renderer.canvas.getBoundingClientRect(),p=[(x-b.left)/b.width,(y-b.top)/b.height];let hit=null,depth=Infinity;
  for(const card of this.cards){if(card.pts.some(v=>v[2]<=0))continue;let inside=false;for(let i=0,j=3;i<4;j=i++){const a=card.pts[i],b=card.pts[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}
   const z=card.pts.reduce((s,v)=>s+v[2],0)/4;if(inside&&z<depth){hit=card.i;depth=z;}
  }return hit;
 }
 dispose(){for(const t of [...this.textures,...this.backs])this.gl.deleteTexture(t);this.gl.deleteProgram(this.program.p);}
}
