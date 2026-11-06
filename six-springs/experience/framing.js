// A temporary view of the same registered painting, not a moving 3D camera.
// Pure presentation math: no DOM, simulation clock, inputs or lettering changes.
import { clamp, mix } from '../src/math.js';

const place=(size,room,middle)=>size<=room?(room-size)/2:clamp(room/2-middle,room-size,0);

export function framePainting(base,frame,calm=false){
  const {width,height,scale,x,y}=base;
  if(!frame||1536*scale<=width+1&&1024*scale<=height+1)return {...base,active:false};
  const [left,top,w,h]=frame.bounds;
  const targetScale=Math.min(scale,(width-16)/w,(height-16)/h);
  const targetX=place(1536*targetScale,width,(left+w/2)*targetScale);
  const targetY=place(1024*targetScale,height,(top+h/2)*targetScale);
  const amount=calm?(frame.open?1:0):frame.amount;
  return {...base,scale:mix(scale,targetScale,amount),x:mix(x,targetX,amount),y:mix(y,targetY,amount),
    active:amount>0&&(Math.abs(x-targetX)>1||Math.abs(y-targetY)>1||Math.abs(scale-targetScale)>.001)};
}
