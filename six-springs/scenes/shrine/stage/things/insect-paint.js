import {smooth} from '../../../../src/math.js';

// Small hand-authored brush-colour cutout. Six articulated legs, antennae,
// split wing cases and a restrained dappled shell share the scene's tick.
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
  for(const side of [-1,1])for(let n=0;n<3;n++){
    const phase=q.tick*.36+n*Math.PI*.7+(side>0?Math.PI:0);
    const step=walk?Math.sin(phase)*3:0;
    const cleaning=groom&&n===0?Math.sin(q.age*.43+side*.7)*4:0;
    ctx.strokeStyle='#25392b';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(side*5,-8+n*8);
    ctx.lineTo(side*(12*tuck),-12+n*12+step);
    ctx.lineTo(side*(17*tuck-cleaning),-16+n*15+step+cleaning);ctx.stroke();
    ctx.strokeStyle='#9b9560';ctx.lineWidth=.65;ctx.stroke();
  }
  if(open){for(const side of [-1,1]){
    ctx.save();ctx.rotate(side*open*(.8+(flight?Math.sin(q.tick*2.3)*.3:0)));
    ctx.fillStyle='rgba(205,201,143,.65)';ctx.beginPath();ctx.ellipse(side*8,6,7,22,side*.5,0,Math.PI*2);ctx.fill();ctx.restore();
  }}
  ctx.fillStyle='#25362b';ctx.beginPath();ctx.ellipse(0,2,9,16,0,0,Math.PI*2);ctx.fill();
  for(const side of [-1,1]){
    ctx.save();ctx.translate(side*2,-6);ctx.rotate(side*open*.6);
    ctx.fillStyle=side<0?'#8d995c':'#657b49';ctx.strokeStyle='#273e30';ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(side*12,-3,side*12,22,0,23);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#aeb474';ctx.lineWidth=.65;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(side*(3+i),3);ctx.quadraticCurveTo(side*(6+i),10,side*(2+i),18);ctx.stroke();}
    ctx.fillStyle='#d0ba78';ctx.beginPath();ctx.ellipse(side*4,4,1.2,3,.3,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  ctx.fillStyle='#425c3e';ctx.strokeStyle='#25392b';ctx.lineWidth=1.3;
  ctx.beginPath();ctx.ellipse(0,-10,7,5.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#303d2d';ctx.beginPath();ctx.ellipse(0,-17,5,4,0,0,Math.PI*2);ctx.fill();
  for(const side of [-1,1]){
    const f=q.mode==='freeze'?0:Math.sin(q.tick*.12+side)*2;
    ctx.strokeStyle='#9e9c68';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(side*3,-19);
    ctx.quadraticCurveTo(side*8,-23,side*(11+f),-24-f);ctx.stroke();
  }
  ctx.restore();
}
