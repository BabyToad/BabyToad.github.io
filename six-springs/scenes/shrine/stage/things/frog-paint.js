import { clamp, smooth } from '../../../../src/math.js';

/** Paint-space skin: toes stay planted; head, throat, haunches have separate weights.
 * The same mapping positions the real mouth frame and every painted vertex. */
export function frogPixel(x,y,q){
  const head=1-smooth((y-25)/22),body=smooth((79-y)/22);
  const throat=Math.exp(-(((x-29)/17)**2+((y-43)/17)**2));
  let a=37+(x-37)*(1+(1-q.squash)*.43*body);
  let b=79+(y-79)*q.squash;
  // Turn around the neck, foreshorten the muzzle, and tilt the eye line. The
  // pupils also move inside the painted rims: a look is more than translation.
  const turn=q.look*.11,c=Math.cos(turn),s=Math.sin(turn),hx=x-30,hy=y-33;
  a+=head*(q.look*5+(hx*c-hy*s-hx)-hx*Math.abs(q.look)*.10)+q.lean*body;
  b+=head*(q.headY+hx*s+hy*c-hy);
  a+=(x-29)*throat*q.throat*.035;
  b+=throat*q.throat*.65;
  // Separate load-bearing haunch and lifting front foot. The other toes stay put.
  const haunch=Math.exp(-(((x-(q.weight>0?58:13))/14)**2+((y-57)/14)**2));
  const front=Math.exp(-(((x-(q.foreSide>0?43:12))/6)**2+((y-70)/10)**2));
  a+=haunch*q.weight*2.2+front*q.fore*q.foreSide*1.8;
  b+=haunch*Math.abs(q.weight)*2.4-front*q.fore*4;
  b-=q.toes*4*smooth((y-59)/17);
  return [a,b];
}

/** Reuse the cut's brush marks, with a small live eyelid/mouth mask.
 * No generated frames, new asset, random draw, or clock in the renderer. */
export function mountFrog({THREE,cards,geometry,own},{pose,foot,p}){
  const mesh=cards.get('frog'),source=mesh.material.map.image;
  const canvas=document.createElement('canvas');canvas.width=228;canvas.height=246;
  const ctx=canvas.getContext('2d');ctx.scale(3,3);
  const map=own(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;
  map.minFilter=THREE.LinearFilter;map.magFilter=THREE.LinearFilter;map.generateMipmaps=false;
  mesh.material.map=map;mesh.customDepthMaterial.map=map;
  const points=[],uv=[],indices=[],pixels=[],nx=19,ny=21;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const a=i*76/nx,b=j*82/ny;pixels.push([a,b]);
    points.push(p.atDepth([438+a,797+b],-foot[2]));uv.push(i/nx,1-j/ny);
    if(i<nx&&j<ny){const k=j*(nx+1)+i;indices.push(k,k+nx+1,k+1,k+1,k+nx+1,k+nx+2);}
  }
  mesh.geometry=geometry(points,uv,indices);
  function eye(x,y,rx,ry,q){
    // Preserve each original eye's rough gold rim and borrow its dark pupil.
    ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx*.68,ry*.72,0,0,Math.PI*2);ctx.clip();
    ctx.fillStyle='#aa9439';ctx.fillRect(x-rx,y-ry,rx*2,ry*2);
    ctx.fillStyle='#c3ad50';ctx.fillRect(x-rx*.6,y-ry*.55,rx*1.2,1.2);
    const dx=q.look*rx*.32,dy=-q.lookUp*ry*.22;
    ctx.drawImage(source,x-rx*.45,y-ry*.57,rx*.9,ry*1.14,x-rx*.45+dx,y-ry*.57+dy,rx*.9,ry*1.14);
    ctx.restore();
  }
  function lid(x,y,rx,ry,amount){
    if(amount<.02)return;
    ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.clip();
    const edge=y-ry+(ry+1)*amount;
    ctx.drawImage(source,20,16,9,6,x-rx,y-ry,rx*2,ry*2*amount);
    ctx.strokeStyle='#353611';ctx.lineWidth=.85;ctx.beginPath();
    ctx.moveTo(x-rx,edge-.5);ctx.quadraticCurveTo(x,edge+1.1,x+rx,edge-.3);ctx.stroke();ctx.restore();
  }
  return {update(){
    const q=pose();ctx.clearRect(0,0,76,82);ctx.drawImage(source,0,0,76,82);
    eye(14.3,10.2,3.3,4.7,q);eye(40,14.1,4.7,6.4,q);
    lid(14.3,10.2,3.3,4.7,q.blink);lid(40,14.1,4.7,6.4,clamp(q.blink*1.12,0,1));
    if(q.mouth>.02){
      ctx.fillStyle='#252617';ctx.beginPath();ctx.moveTo(14,28);
      ctx.quadraticCurveTo(29,30+q.mouth*8,44,30);ctx.quadraticCurveTo(30,29,14,28);ctx.fill();
      ctx.strokeStyle='#958d39';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(17,29+q.mouth*2);
      ctx.quadraticCurveTo(29,31+q.mouth*5,40,31);ctx.stroke();
    }
    map.needsUpdate=true;
    const attr=mesh.geometry.getAttribute('position');
    pixels.forEach(([a,b],i)=>{const v=frogPixel(a,b,q),world=p.atDepth([438+v[0],797+v[1]],-foot[2]);attr.setXYZ(i,...world);});
    attr.needsUpdate=true;mesh.geometry.computeBoundingSphere();mesh.position.fromArray(q.offset);
  }};
}
