import { Bitmap } from "../../src/bitmap.js";
import { transform } from "../../src/math.js";

// Measured placement belongs here when round-two paintings land. These are disposable diagrams.
export const flats=[
  ["far",-50,.12,1,"source-over"],
  ["mid",-40,.35,1,"source-over"],
  // Ground/contact shade and interactive feet must move as one plane.
  ["structure",-30,1,1,"source-over"],
  ["shadow",8,1,.2,"multiply"],
  ["light",9,.5,.12,"screen"],
  ["near",10,1.6,1,"source-over"],
].map(([name,order,parallax,opacity,blend])=>({name,order,parallax,
  asset:new Bitmap({href:new URL(`./placeholder-flats/${name}.png`,import.meta.url).href,width:1360,height:880,opacity,blend})}));

export function addFlats(scene) {
  for(const flat of flats) scene.add(flat.name,flat.asset,{order:flat.order,parallax:flat.parallax,interactive:false,transform:transform(-80,-60)});
}

export function driftFlats(scene,tick) {
  scene.node("mid").transform=transform(-80+2*Math.sin(tick/97),-60);
  scene.node("near").transform=transform(-80+3*Math.sin(tick/80),-60);
  scene.node("light").transform=transform(-80+10*Math.sin(tick/160),-60+2*Math.sin(tick/121));
  scene.node("shadow").transform=transform(-80+5*Math.sin(tick/160),-60);
}
