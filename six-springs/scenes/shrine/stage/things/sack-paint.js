/** Existing brushwork on a soft grid. The floor seam stays planted. */
export function sackPixel(x,y,q){
  const upper=Math.max(0,(130-y)/130),body=Math.exp(-(((y-89)/44)**2)),sag=(1-q.fill)*.27;
  return [58+(x-58)*(1+body*(q.compression*-.6-sag*.25))+q.taking*upper*2,
    132+(y-132)*(1-sag+q.compression)+q.opening*upper*4];
}
export async function mountSack({THREE,cards,geometry,own,p,objects,basic,cutGeometry,texture},{depth,pose}){
  // The original stage plate still contains the sack. A tightly cropped repair
  // is necessary before its silhouette can sag or its outer bow can disappear.
  const clean=await texture('sack/clean-plate.png'),repairCanvas=document.createElement('canvas');
  repairCanvas.width=116;repairCanvas.height=134;
  repairCanvas.getContext('2d').drawImage(clean.image,330*clean.image.width/1536,752*clean.image.height/1024,116*clean.image.width/1536,134*clean.image.height/1024,0,0,116,134);
  const repairMap=own(new THREE.CanvasTexture(repairCanvas));repairMap.colorSpace=THREE.SRGBColorSpace;
  const repair=new THREE.Mesh(cutGeometry([330,752,116,134],depth+.005),basic(repairMap));objects.add(repair);
  const mesh=cards.get('sack'),source=mesh.material.map.image,nx=18,ny=22,pixels=[],points=[],uv=[],indices=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    pixels.push([i*116/nx,j*134/ny]);points.push(p.atDepth([330+i*116/nx,752+j*134/ny],depth));uv.push(i/nx,1-j/ny);
    if(i<nx&&j<ny){const k=j*(nx+1)+i;indices.push(k,k+1,k+nx+1,k+1,k+nx+2,k+nx+1);}
  }
  mesh.geometry=geometry(points,uv,indices);
  const canvas=document.createElement('canvas');canvas.width=348;canvas.height=402;const ctx=canvas.getContext('2d');
  const map=own(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;map.minFilter=map.magFilter=THREE.LinearFilter;map.generateMipmaps=false;
  mesh.material.map=map;mesh.customDepthMaterial.map=map;let prior=-1,shape='';
  const grainCanvas=document.createElement('canvas');grainCanvas.width=180;grainCanvas.height=150;
  const gc=grainCanvas.getContext('2d'),gm=own(new THREE.CanvasTexture(grainCanvas));gm.colorSpace=THREE.SRGBColorSpace;
  const grains=new THREE.Mesh(cutGeometry([310,740,180,150],depth-.01),basic(gm,{transparent:true,depthWrite:false}));objects.add(grains);
  return {update(){const q=pose(),opening=Math.round(q.opening*24)/24;
    if(opening!==prior){prior=opening;ctx.setTransform(3,0,0,3,0,0);ctx.clearRect(0,0,116,134);ctx.drawImage(source,0,0);
      if(opening>0){
        // The bow gives up its loops and leaves two loose ends. Borrow cloth
        // pixels from the same sack instead of laying a clean new colour on it.
        ctx.save();ctx.globalAlpha=opening;
        // The outer loop was in front of the stool, not in front of fabric:
        // reveal the existing clean plate there rather than painting a cloth box.
        ctx.globalCompositeOperation='destination-out';ctx.beginPath();
        ctx.moveTo(75,28);ctx.lineTo(100,28);ctx.lineTo(103,49);ctx.lineTo(84,55);ctx.lineTo(75,42);ctx.closePath();ctx.fill();
        ctx.globalCompositeOperation='source-over';ctx.beginPath();
        ctx.moveTo(69,44);ctx.lineTo(80,44);ctx.lineTo(98,77);ctx.lineTo(87,84);ctx.lineTo(69,60);ctx.closePath();ctx.clip();
        ctx.drawImage(source,48,70,18,20,67,43,33,42);ctx.restore();
        // The loose mouth opens above the existing cord, retaining the worn fabric rim.
        ctx.fillStyle='#584029';ctx.beginPath();ctx.ellipse(56,17,18*opening,6*opening,-.10,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#c18b43';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(56,17,18*opening,6*opening,-.10,0,Math.PI);ctx.stroke();
        ctx.strokeStyle='#4a301a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(39,37);ctx.quadraticCurveTo(58,45+opening*3,74,38);
        ctx.quadraticCurveTo(87,47+opening*8,92,69+opening*10);ctx.moveTo(66,39);ctx.quadraticCurveTo(62,54,72,72+opening*4);ctx.stroke();
        ctx.strokeStyle='#dcab5a';ctx.lineWidth=1.4;ctx.stroke();
      }map.needsUpdate=true;
    }
    const nextShape=[q.fill,q.opening,q.compression,q.taking].join(':');
    if(nextShape!==shape){shape=nextShape;const attr=mesh.geometry.getAttribute('position');pixels.forEach(([x,y],i)=>{const v=sackPixel(x,y,q);attr.setXYZ(i,...p.atDepth([330+v[0],752+v[1]],depth));});attr.needsUpdate=true;mesh.geometry.computeBoundingSphere();}
    grains.visible=q.particles.length>0||q.taking>0;if(grains.visible){gc.clearRect(0,0,180,150);for(const g of q.particles){gc.fillStyle='#e4d5a4';gc.beginPath();gc.ellipse(g.x-310,g.y-740,2.1,.85,g.y<879?g.age*.3:.5,0,Math.PI*2);gc.fill();}
      if(q.taking>0){const mouth=sackPixel(56,17,q);for(let i=0;i<q.takeAmount;i++){gc.fillStyle='#eee0b5';gc.beginPath();gc.ellipse(mouth[0]+20+(i-(q.takeAmount-1)/2)*2.4,mouth[1]+12-q.taking*25+(i%2)*2,2,.85,-.4+i*.2,0,Math.PI*2);gc.fill();}}
      gm.needsUpdate=true;}
  },dispose(){objects.remove(grains,repair);}};
}

