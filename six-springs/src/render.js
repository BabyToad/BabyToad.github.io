// Renderers are sinks for View.draw. Canvas for live use, SVG strings for video, tests and export.

function paint(view,pose,sink) {
  if(view.paint) view.paint(sink);
  else view.draw(pose,(fill,X,Y,rows)=>sink({kind:"path",fill,X,Y,rows}));
}
const xml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));

export function drawCanvas(ctx, view, pose, {images=new Map()}={}) {
  paint(view,pose,command=>{
    if(command.kind==="bitmap") {
      const {href,world,width,height,opacity,blend}=command, image=images.get(href);
      if(!image) throw new Error(`Bitmap not decoded: ${href}`);
      ctx.save();
      try { ctx.transform(...world); ctx.globalAlpha=opacity; ctx.globalCompositeOperation=blend; ctx.drawImage(image,0,0,width,height); }
      finally { ctx.restore(); }
      return;
    }
    const {fill,X,Y,rows}=command;
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (const [st, len] of rows) {
      ctx.moveTo(X[st], Y[st]);
      for (let i = st + 1; i < st + len; i += 3) ctx.bezierCurveTo(X[i], Y[i], X[i + 1], Y[i + 1], X[i + 2], Y[i + 2]);
      ctx.closePath();
    }
    ctx.fill();
  });
}

export function toSVG(view, pose, { width = 720, height = 1280, background = "#fff" } = {}) {
  const out = [];
  paint(view,pose,command=>{
    if(command.kind==="bitmap") {
      const {href,world,width,height,opacity,blend}=command;
      out.push(`<image href="${xml(href)}" width="${width}" height="${height}" transform="matrix(${world.join(" ")})" opacity="${opacity}" style="mix-blend-mode:${blend==="source-over" ? "normal" : blend}"/>`); return;
    }
    const {fill,X,Y,rows}=command;
    let d = "";
    for (const [st, len] of rows) {
      d += `M${X[st].toFixed(2)} ${Y[st].toFixed(2)}`;
      for (let i = st + 1; i < st + len; i += 3) d += `C${X[i].toFixed(2)} ${Y[i].toFixed(2)} ${X[i + 1].toFixed(2)} ${Y[i + 1].toFixed(2)} ${X[i + 2].toFixed(2)} ${Y[i + 2].toFixed(2)}`;
      d += "Z";
    }
    out.push(`<path d="${d}" fill="${xml(fill)}"/>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/>${out.join("")}</svg>`;
}
