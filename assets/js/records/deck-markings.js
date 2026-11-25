import * as G from './physics/gl-util.js';
// Printed scale markings sit on the actual deck plane, not on a screen overlay.
export class DeckMarkings {
 constructor(gl){
  this.gl=gl;this.program=G.program(gl,`#version 300 es
in vec3 aP;uniform mat4 uVP;out vec2 uv;void main(){uv=vec2((aP.x+.183)/.451,(aP.y+.188)/.376);gl_Position=uVP*vec4(aP,1.);}`,`#version 300 es
precision highp float;in vec2 uv;uniform sampler2D uMap;out vec4 color;void main(){color=texture(uMap,uv);if(color.a<.01)discard;}`);
  this.mesh=G.mesh(gl,new Float32Array([-.183,-.188,-.0218,0,0,1,.268,-.188,-.0218,0,0,1,.268,.188,-.0218,0,0,1,-.183,-.188,-.0218,0,0,1,.268,.188,-.0218,0,0,1,-.183,.188,-.0218,0,0,1]));
  const c=document.createElement('canvas');c.width=1200;c.height=1000;const ctx=c.getContext('2d'),point=(x,y)=>[(x+.183)/.451*c.width,(.188-y)/.376*c.height];
  ctx.fillStyle='#c1b9a7';ctx.strokeStyle='#a89f8c';ctx.textAlign='center';ctx.font='16px monospace';
  const text=(s,x,y)=>ctx.fillText(s,...point(x,y));text('START / STOP',-.118,-.151);text('33',-.077,-.169);text('45',-.049,-.169);text('PITCH',.239,-.042);text('CUE',.237,.034);text('ANTI-SKATE',.233,.128);
  ctx.textAlign='left';ctx.font='18px serif';text('Steak Knives & Bagels',.078,-.175);ctx.font='12px monospace';text('DIRECT DRIVE / GROOVE SIMULATION',.078,-.183);
  for(let i=-8;i<=8;i++){const y=-.11+i*.06/8,p=point(.231,y),q=point(i%4===0?.225:.228,y);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke();}
  this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 }
 draw(vp){const gl=this.gl,{p,u}=this.program;gl.useProgram(p);gl.uniformMatrix4fv(u.uVP,false,vp);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.uniform1i(u.uMap,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.bindVertexArray(this.mesh.vao);gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.BLEND);}
}
