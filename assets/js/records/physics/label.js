// Original label for the site's physical pressings. Audio titles come from the cut.
export function drawLabel(titles=[]) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
  const x=canvas.getContext('2d');x.fillStyle='#65553b';x.fillRect(0,0,1024,1024);
  x.strokeStyle='#2b2117';x.lineWidth=3;for(const r of [465,435,160]){x.beginPath();x.arc(512,512,r,0,Math.PI*2);x.stroke();}
  x.fillStyle='#21180f';x.textAlign='center';x.font='58px Newsreader, Georgia, serif';x.fillText('Steak Knives',512,230);x.fillText('& Bagels',512,295);
  x.font='22px "JetBrains Mono", monospace';x.fillText('A PRIVATE PRESSING',512,350);x.fillText('STEREO',220,505);x.fillText('33⅓',810,505);
  titles.filter(Boolean).slice(0,4).forEach((title,i)=>{x.font='26px "JetBrains Mono", monospace';x.fillText(`${i+1}  ${title}`,512,710+i*42,570);});
  return canvas;
}
