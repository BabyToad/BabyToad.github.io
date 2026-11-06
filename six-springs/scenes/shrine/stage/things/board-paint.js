import { inverse } from '../../../../src/math.js';

/** The wood stays on the wall. Loose brass has its own following surface;
 * carried brass is painted between palm and fingers in the figure's ink. */
export function mountBoard({THREE,cards,own,cutGeometry,geometry,objects,basic,pick,figure},{sample,p}){
  const board=cards.get('board'),source=board.material.map.image;
  const canvas=document.createElement('canvas');canvas.width=175;canvas.height=140;
  const ctx=canvas.getContext('2d');
  const peg=document.createElement('canvas');peg.width=42;peg.height=35;
  const brass=peg.getContext('2d');
  brass.beginPath();brass.moveTo(1,17);brass.bezierCurveTo(0,3,14,-1,23,3);
  brass.bezierCurveTo(38,1,42,12,38,23);brass.bezierCurveTo(34,32,18,34,9,29);
  brass.bezierCurveTo(3,27,1,22,1,17);brass.clip();brass.drawImage(source,14,25,42,35,0,0,42,35);
  const wood=document.createElement('canvas');wood.width=175;wood.height=86;
  const w=wood.getContext('2d');w.drawImage(source,0,0);
  w.save();w.beginPath();w.ellipse(35,45,28,23,0,0,Math.PI*2);w.clip();
  w.drawImage(source,59,20,56,48,7,20,56,48);w.restore();
  const makeMap=canvas=>{
    const map=own(new THREE.CanvasTexture(canvas));map.colorSpace=THREE.SRGBColorSpace;
    map.minFilter=THREE.LinearFilter;map.magFilter=THREE.LinearFilter;map.generateMipmaps=false;return map;
  };
  const map=makeMap(canvas),pegMap=makeMap(peg);
  board.material.map=map;board.customDepthMaterial.map=map;
  board.geometry=cutGeometry([1073,458,175,140],10.3);
  const unit=10.2/p.f;
  const loose=new THREE.Mesh(geometry([[-17,17],[25,17],[25,-18],[-17,-18]].map(([x,y])=>[x*unit,y*unit,0]),
    [0,1,1,1,1,0,0,0],[0,2,1,0,3,2]),basic(pegMap,{alphaTest:.3,transparent:true,depthWrite:true}));
  loose.name='board.peg';objects.add(loose);pick(loose,'board');

  // Replace only the distal right hand during contact. Forearm/cuff are clipped
  // at the evaluated wrist by paintFigure; ordinary gestures keep their art.
  figure({layer:'b:front.farmR',bone:'handR',wrist:'b.wrR',elbow:'b.elR',active:()=>sample().grip>0,
    paint(ink,{performance,view,pose}){
      const q=sample(),wrist=p.project(performance.characterFrame.world(view.point(pose,'handR','b.wrR')));
      const palm=performance.frame('hand.R').screen;
      const angle=Math.atan2(palm[1]-wrist[1],palm[0]-wrist[0]),length=Math.hypot(palm[0]-wrist[0],palm[1]-wrist[1]);
      ink.transform(...inverse(performance.characterFrame.screen));
      ink.save();ink.translate(...wrist);ink.rotate(angle);
      ink.fillStyle='#d68f62';ink.strokeStyle='#111111';ink.lineWidth=2.4;ink.lineJoin='round';
      ink.beginPath();ink.moveTo(-2,-5.8);ink.bezierCurveTo(length*.45,-8,length+5,-11,length+10,-6);
      ink.quadraticCurveTo(length+13,3,length+5,10);ink.quadraticCurveTo(length*.55,13,-2,6.5);ink.closePath();ink.fill();ink.stroke();ink.restore();
      if(q.carried){ink.save();ink.translate(q.peg.x,q.peg.y);ink.rotate(q.peg.angle);ink.drawImage(peg,-17,-17);ink.restore();}
      // Two fingers cross the shank, leaving the broad brass face readable.
      ink.save();ink.translate(...palm);ink.rotate(angle);
      const curl=q.grip;ink.lineCap='round';
      const finger=(a,b,c,d,e,f)=>{ink.beginPath();ink.moveTo(a,b);ink.quadraticCurveTo(c,d,e,f);ink.strokeStyle='#111111';ink.lineWidth=7;ink.stroke();ink.strokeStyle='#d68f62';ink.lineWidth=4.3;ink.stroke();};
      finger(-9,10,-1,13,3+3*(1-curl),4);
      finger(-12,-8,-2,-12,4,-7+curl*3);
      ink.restore();
    }});
  let last=null;
  return {update(){
    const q=sample(),depth=q.seated!==null?10.2:8.55;
    loose.visible=!q.carried;loose.position.fromArray(p.atDepth([q.peg.x,q.peg.y-q.peg.lift],depth));
    loose.scale.setScalar(depth/10.2);loose.rotation.z=-q.peg.angle;
    const age=q.tick-q.lastSeat,knock=age>=0&&age<18?Math.exp(-age/3)*Math.sin(age*2)*.5:0;
    const shadow=!q.carried&&q.peg.x>1073&&q.peg.x<1248&&q.peg.y>450&&q.peg.y<542?[q.peg.x,q.peg.y,q.peg.lift]:null;
    const key=JSON.stringify([knock,q.open,q.reeds.map(r=>r.angle),shadow]);
    if(key===last)return;last=key;
    ctx.clearRect(0,0,175,140);ctx.drawImage(wood,0,knock);
    if(q.open>0){
      ctx.fillStyle='#302a1b';ctx.fillRect(22,79,123,5*q.open);
      ctx.drawImage(source,10,70,145,9,10,78+q.open*5,145,7);
      [31,83,127].forEach((x,i)=>{
        const length=31*q.open,angle=q.reeds[i].angle;
        ctx.save();ctx.translate(x,82);ctx.rotate(angle);
        ctx.strokeStyle='#443a22';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,length);ctx.stroke();
        ctx.strokeStyle='#b2924c';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-.6,0);ctx.lineTo(-.6,length);ctx.stroke();
        ctx.drawImage(peg,-7,length-3,15,13);ctx.restore();
      });
    }
    if(shadow){
      const [x,y,lift]=shadow;
      ctx.fillStyle=`rgba(35,27,14,${.16+Math.min(1,lift/13)*.12})`;
      ctx.beginPath();ctx.ellipse(x-1073+5+lift*.35,y-458+5,15+lift*.16,8,0,0,Math.PI*2);ctx.fill();
    }
    map.needsUpdate=true;
  },dispose(){objects.remove(loose);}};
}
