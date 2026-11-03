// Indexed bitmap grid uses the SAME bone matrices and linear blend evaluator as
// vector paths. UVs stay at rest. This is a renderer-side asset, not a format-3 rig.
export function bitmapGrid(view,{bounds,bones,weight,columns=16,rows=32}) {
  const [x,y,width,height]=bounds;
  if(!bounds.every(Number.isFinite)||width<=0||height<=0 || ![columns,rows].every(n=>Number.isInteger(n)&&n>0&&n<=256)) throw Error("Invalid bitmap grid");
  if(!bones.length||bones.some(b=>!view.bones.some(v=>v.name===b))) throw Error("Unknown bitmap skin bone");
  const points=[],uv=[],weights=bones.map(()=>[]),indices=[];
  for(let j=0;j<=rows;j++) for(let i=0;i<=columns;i++) {
    const u=i/columns,v=j/rows,px=x+u*width,py=y+v*height,w=weight(px,py);
    if(w.length!==bones.length || w.some(n=>!Number.isFinite(n)||n<0||n>1)||Math.abs(w.reduce((a,b)=>a+b,0)-1)>1e-6) throw Error("Invalid bitmap skin weights");
    points.push(px,py); uv.push(u,1-v); w.forEach((n,k)=>weights[k].push(n));
    if(i<columns&&j<rows) {const a=j*(columns+1)+i,b=a+1,c=a+columns+1,d=c+1;indices.push(a,c,b,b,c,d);}
  }
  const drawing={points,bones,weights};
  return {drawing,uv,indices,evaluate(pose) {
    const q=view.resolve(pose);
    return view.deform({deform:[]},drawing,q,view.skeleton(q));
  }};
}
