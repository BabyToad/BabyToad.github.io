import {smooth} from '../../../../src/math.js';

// A cutout in the saint's ink: flat cel fills, one darker cel tone, a single
// highlight, and one pure-black outline around every piece. At about thirty
// painting pixels a parts sheet would be overkill, so the rig is drawn here:
// legs, wing cases, wings and antennae are posed from the resident's numbers
// on the scene's tick, the same pose-to-drawing idea at insect scale.
const INK='#000',LINE=2.6,FINE=1.3;
const SHELL='#78993f',SHADE='#4e6b2a',GLINT='#d6dc86',HEAD='#3d5528',MEMBRANE='rgba(232,226,170,.72)';

function piece(ctx,draw,fill,width=LINE){
  ctx.beginPath();draw();ctx.fillStyle=fill;ctx.fill();
  ctx.lineWidth=width;ctx.strokeStyle=INK;ctx.stroke();
}

export function paintBeetle(ctx,q){
  ctx.clearRect(0,0,128,128);ctx.save();ctx.translate(64,64);
  const flight=q.mode==='return'||q.mode==='fly'&&q.age>=10;
  const open=q.mode==='fly'?Math.min(1,q.age/10):flight?1:q.mode==='settle'?Math.max(0,1-q.age/7):0;
  const walk=q.mode==='walk',groom=q.mode==='groom';
  // The first peek retains the frightened stance; release the actual drawn
  // knees and feet over seven ticks rather than doubling their reach at once.
  const tuck=q.mode==='freeze'?1-.48*Math.min(1,q.age/5):q.mode==='peek'?.52+.48*smooth(q.age/7):1;
  ctx.rotate(q.heading);
  if(!flight){ctx.fillStyle='rgba(8,26,20,.36)';ctx.beginPath();ctx.ellipse(2,3,12,19,0,0,Math.PI*2);ctx.fill();}
  const lift=q.mode==='settle'?Math.sin(q.age*.6)*Math.exp(-q.age/5):0;ctx.translate(0,lift);
  ctx.lineCap='round';ctx.lineJoin='round';

  // Legs: thin appendages are drawn as ink, as her drawings do for fine detail.
  for(const side of [-1,1])for(let n=0;n<3;n++){
    const phase=q.tick*.36+n*Math.PI*.7+(side>0?Math.PI:0);
    const step=walk?Math.sin(phase)*3:0;
    const cleaning=groom&&n===0?Math.sin(q.age*.43+side*.7)*4:0;
    ctx.beginPath();ctx.moveTo(side*5,-8+n*8);
    ctx.lineTo(side*(12*tuck),-12+n*12+step);
    ctx.lineTo(side*(17*tuck-cleaning),-16+n*15+step+cleaning);
    ctx.strokeStyle=INK;ctx.lineWidth=2.2;ctx.stroke();
  }

  // Flight wings sit behind the cases: translucent membrane, inked edge and vein.
  if(open){for(const side of [-1,1]){
    ctx.save();ctx.rotate(side*open*(.8+(flight?Math.sin(q.tick*2.3)*.3:0)));
    piece(ctx,()=>ctx.ellipse(side*8,6,7,22,side*.5,0,Math.PI*2),MEMBRANE,FINE);
    ctx.beginPath();ctx.moveTo(side*4,-12);ctx.quadraticCurveTo(side*9,4,side*10,24);
    ctx.lineWidth=.8;ctx.strokeStyle=INK;ctx.stroke();ctx.restore();
  }}

  // Abdomen shows between parted cases.
  piece(ctx,()=>ctx.ellipse(0,3,8.5,15,0,0,Math.PI*2),SHADE);

  // Wing cases: flat shell colour, a cel shadow on the outer edge, one glint.
  for(const side of [-1,1]){
    ctx.save();ctx.translate(side*2,-6);ctx.rotate(side*open*.6);
    const outline=()=>{ctx.moveTo(0,0);ctx.bezierCurveTo(side*12,-3,side*12,22,0,23);ctx.closePath();};
    ctx.beginPath();outline();ctx.fillStyle=SHELL;ctx.fill();
    ctx.save();ctx.clip();
    ctx.beginPath();ctx.moveTo(side*13,-4);ctx.bezierCurveTo(side*6,6,side*7,16,side*13,26);
    ctx.bezierCurveTo(side*15,26,side*16,10,side*13,-4);
    ctx.fillStyle=SHADE;ctx.fill();ctx.restore();
    ctx.beginPath();outline();ctx.lineWidth=LINE;ctx.strokeStyle=INK;ctx.stroke();
    ctx.fillStyle=GLINT;ctx.beginPath();ctx.ellipse(side*3.6,4.5,1.3,3.4,side*.3,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  // Pronotum and head.
  piece(ctx,()=>ctx.ellipse(0,-10,7,5.5,0,0,Math.PI*2),HEAD);
  ctx.fillStyle=GLINT;ctx.beginPath();ctx.ellipse(-2.4,-11.6,1.6,.9,-.3,0,Math.PI*2);ctx.fill();
  piece(ctx,()=>ctx.ellipse(0,-17,5,4,0,0,Math.PI*2),'#2c3d20');

  // Antennae: ink lines with a small club, alive except when frozen.
  for(const side of [-1,1]){
    const f=q.mode==='freeze'?0:Math.sin(q.tick*.12+side)*2;
    const tip=[side*(11+f),-24-f];
    ctx.beginPath();ctx.moveTo(side*3,-19);ctx.quadraticCurveTo(side*8,-23,...tip);
    ctx.lineWidth=1.5;ctx.strokeStyle=INK;ctx.stroke();
    ctx.fillStyle=INK;ctx.beginPath();ctx.ellipse(tip[0],tip[1],1.5,1.5,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
