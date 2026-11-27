// A local, true-scale mesh of the actual pressed walls. Units here are micrometres
// to retain GPU precision; x is radial, y along the groove, z above the land.
import * as G from './physics/gl-util.js';

export function grooveMesh(view, radius, spr, rows=5, cols=121, span=60) {
  const out=[];
  const point=(row,col,part)=>{
    const i=(row*cols+col)*2,l=view[i]*1e6,r=view[i+1]*1e6;
    const y=(col/(cols-1)*2-1)*span*2*Math.PI*radius/spr*1e6;
    return part===0?[l,y,0]:part===1?[(l+r)/2,y,-(r-l)/2]:[r,y,0];
  };
  const tri=(a,b,c)=>{
    if(![...a,...b,...c].every(Number.isFinite))return;
    const u=b.map((v,i)=>v-a[i]),v=c.map((w,i)=>w-a[i]);
    const n=G.norm([u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]);
    if(!n.every(Number.isFinite))return;
    for(const p of [a,b,c])out.push(...p,...n);
  };
  const quad=(a,b,c,d)=>{tri(a,b,c);tri(a,c,d);};
  for(let row=0;row<rows;row++)for(let col=0;col<cols-1;col++){
    for(let wall=0;wall<2;wall++)quad(point(row,col,wall),point(row,col,wall+1),point(row,col+1,wall+1),point(row,col+1,wall));
    // Rows run from outer to inner radius. Join adjacent land without filling the V.
    if(row<rows-1)quad(point(row+1,col,2),point(row,col,0),point(row,col+1,0),point(row+1,col+1,2));
  }
  return new Float32Array(out);
}

const VS=`#version 300 es
layout(location=0) in vec3 aP; layout(location=1) in vec3 aN;
uniform mat4 uVP,uM; out vec3 normal; out vec3 pos;
void main(){vec4 p=uM*vec4(aP,1.);pos=p.xyz;normal=mat3(uM)*aN;gl_Position=uVP*p;}`;
const FS=`#version 300 es
precision highp float; in vec3 normal; in vec3 pos;
uniform vec3 uCol,uEye; uniform int uCut; out vec4 color;
void main(){if(uCut==1&&pos.y<0.)discard;vec3 n=normalize(normal);if(!gl_FrontFacing)n=-n;
vec3 l=normalize(vec3(-.4,-.6,1.)),v=normalize(uEye-pos);
float diffuse=max(0.,dot(n,l)),spec=pow(max(0.,dot(n,normalize(l+v))),48.);
color=vec4(pow(uCol*(.28+.72*diffuse)+vec3(.38)*spec,vec3(1./2.2)),1.);}`;

export class GrooveSurface {
  constructor(gl){
    this.gl=gl;this.program=G.program(gl,VS,FS);this.walls=G.mesh(gl,new Float32Array(0));
    const profile=[];for(let i=0;i<=16;i++){const a=-Math.PI/2+i*Math.PI/32;profile.push([18*Math.cos(a),18*Math.sin(a)]);}
    profile.push([26,55],[0,55]);
    this.section=G.mesh(gl,new Float32Array(0));this.scale=G.mesh(gl,new Float32Array([-50,-1,-75,0,-1,0,50,-1,-75,0,-1,0,-50,-1,-71,0,-1,0,-50,-1,-79,0,-1,0,50,-1,-71,0,-1,0,50,-1,-79,0,-1,0]));
    this.tip=G.mesh(gl,G.lathe(profile,48));
    this.shank=G.mesh(gl,G.cyl(18,32,55,170,32,false));
  }
  draw(sample,camera,width,height,light,inset={top:0,bottom:0}){
    const gl=this.gl,u=this.program.u;
    const canvas=gl.canvas,dpr=Math.min(2,window.devicePixelRatio||1);width=Math.round(canvas.clientWidth*dpr);height=Math.round(canvas.clientHeight*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    if(!sample){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.clearColor(.018,.016,.014,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);return;}
    if(this.sample!==sample){this.sample=sample;
      const data=grooveMesh(sample.surface,sample.r,sample.spr);
      gl.bindBuffer(gl.ARRAY_BUFFER,this.walls.buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);this.walls.count=data.length/6;
      const lines=[],add=(a,b)=>lines.push(...a,0,-1,0,...b,0,-1,0);
      for(let row=0;row<5;row++){const i=(row*121+60)*2,l=sample.surface[i]*1e6,r=sample.surface[i+1]*1e6;if(!Number.isFinite(l+r))continue;const bottom=[(l+r)/2,-.1,-(r-l)/2];add([l,-.1,0],bottom);add(bottom,[r,-.1,0]);}
      const x=sample.surface[1210]*1e6,z=sample.surface[1211]*1e6;if(Number.isFinite(x+z))for(let i=0;i<64;i++){const a=i*Math.PI*2/64,b=(i+1)*Math.PI*2/64;add([x+18*Math.cos(a),-.2,z+18*Math.sin(a)],[x+18*Math.cos(b),-.2,z+18*Math.sin(b)]);}
      gl.bindBuffer(gl.ARRAY_BUFFER,this.section.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.DYNAMIC_DRAW);this.section.count=lines.length/6;
    }
    const viewHeight=Math.max(100,height-(inset.top+inset.bottom)*dpr);
    const distance=Math.max(180,camera.distance*1e6),at=[0,0,0],ce=Math.cos(camera.el);
    const eye=[distance*ce*Math.sin(camera.az),-distance*ce*Math.cos(camera.az),distance*Math.sin(camera.el)];
    const vp=G.mul(G.perspective(Math.PI/6,width/viewHeight,1,30000),G.lookAt(eye,at).m);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...(light?[.35,.31,.24,1]:[.018,.016,.014,1]));gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,inset.bottom*dpr,width,viewHeight);
    gl.useProgram(this.program.p);gl.uniformMatrix4fv(u.uVP,false,vp);gl.uniform3fv(u.uEye,eye);
    const draw=(mesh,m,col)=>{gl.uniformMatrix4fv(u.uM,false,m);gl.uniform3fv(u.uCol,col);gl.bindVertexArray(mesh.vao);gl.drawArrays(gl.TRIANGLES,0,mesh.count);};
    gl.uniform1i(u.uCut,1);
    draw(this.walls,G.ident(),[.035,.036,.039]);
    // hc is the sphere CENTRE above the land, not its bottom; this is the same
    // 18 µm seating radius used by the engine's unilateral contact solver.
    const x=sample.surface[1210]*1e6,z=sample.surface[1211]*1e6;
    if(Number.isFinite(x)&&Number.isFinite(z)){
      draw(this.tip,G.T(x,0,z),[.56,.62,.66]);draw(this.shank,G.T(x,0,z),[.38,.29,.12]);
    }
    gl.uniform1i(u.uCut,0);gl.uniformMatrix4fv(u.uM,false,G.ident());gl.uniform3fv(u.uCol,light?[.5,.15,.04]:[1,.48,.08]);gl.bindVertexArray(this.section.vao);gl.drawArrays(gl.LINES,0,this.section.count);
    gl.uniform3fv(u.uCol,[.9,.9,.9]);gl.bindVertexArray(this.scale.vao);gl.drawArrays(gl.LINES,0,this.scale.count);
  }
}
