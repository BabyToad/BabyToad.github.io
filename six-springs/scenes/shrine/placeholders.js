// Hand-authored placeholder geometry, deliberately unrelated to the private shrine art lane.
// All parts use the same format-2 evaluator as the character. Replace these assets, not scene code.
import { Rig } from "../../src/rig.js";

function polygon(vertices,fill,bone="root") {
  const pts=[...vertices[0]];
  for(let i=1;i<=vertices.length;i++) {
    const a=vertices[i-1],b=vertices[i%vertices.length];
    pts.push(a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3,a[0]+2*(b[0]-a[0])/3,a[1]+2*(b[1]-a[1])/3,...b);
  }
  return {default:{points:pts,bones:[bone],paths:[[fill,[[0,pts.length/2]]]]}};
}

export function prop(name,shapes,{controls={},bones=[{name:"root"}],anchors={origin:{bone:"root",pivot:[0,0]}},secondary=[]}={}) {
  const parts=Object.fromEntries(shapes.map(([id,vertices,fill,bone])=>[id,polygon(vertices,fill,bone)]));
  return new Rig({format:2,name,stage:{width:1200,height:760},controls,parts,views:{default:{bones,pivots:{},anchors,secondary,layers:Object.keys(parts)}}});
}

export function placeholders() {
  return {
    room:prop("Shrine study",[
      ["wall",[[0,0],[1200,0],[1200,760],[0,760]],"#e5ddc9"],
      ["recess",[[340,100],[840,100],[840,660],[340,660]],"#d1c4aa"],
      ["floor",[[0,650],[1200,650],[1200,760],[0,760]],"#bfa681"],
      ["beam",[[0,80],[1200,80],[1200,115],[0,115]],"#51443e"],
      ["pillarL",[[58,80],[97,80],[97,700],[58,700]],"#6b5140"],
      ["pillarR",[[1100,80],[1139,80],[1139,700],[1100,700]],"#6b5140"],
    ]),
    tray:prop("Offering stand",[
      ["leg",[[-70,0],[70,0],[58,125],[-58,125]],"#79614a"],
      ["top",[[-110,-10],[110,-10],[110,14],[-110,14]],"#403932"],
    ]),
    offering:prop("Offering",[
      ["bowl",[[-35,-4],[35,-4],[26,25],[-26,25]],"#256777"],
      ["rice",[[-29,-6],[-18,-20],[0,-26],[18,-20],[29,-6]],"#fff1cf"],
      ["rim",[[-36,-6],[36,-6],[36,1],[-36,1]],"#d6b86c"],
    ],{anchors:{origin:{bone:"root",pivot:[0,25]}}}),
    bell:prop("Bell",[
      ["cord",[[-2,0],[2,0],[2,72],[-2,72]],"#544336","swing"],
      ["bell",[[-27,64],[27,64],[39,119],[-39,119]],"#ab773e","swing"],
      ["lip",[[-42,116],[42,116],[42,127],[-42,127]],"#493f32","swing"],
      ["clapper",[[-5,125],[5,125],[5,140],[-5,140]],"#493f32","swing"],
    ],{controls:{swing:{range:[-40,40],unit:"degrees",group:"secondary"},drive:{range:[-40,40],unit:"degrees"}},bones:[{name:"root"},{name:"swing",parent:"root",pivot:[0,0],rot:[{c:"swing",k:1}]}],anchors:{origin:{bone:"root",pivot:[0,0]},attention:{bone:"swing",pivot:[0,95]},touch:{bone:"swing",pivot:[-32,100]}},secondary:[{into:["swing"],f:[1.5],z:.18,input:[{control:"drive",gain:1}]}]}),
  };
}
