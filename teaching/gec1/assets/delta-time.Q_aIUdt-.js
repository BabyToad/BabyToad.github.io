var e=.05,t=[15,30,60,144],n=.5,r=1/8;function i(t={}){let r=t.keepSeconds??8,i=()=>({i:0,t:0,dt:0,a:0,b:0,spike:!1}),a={fps:t.fps??60,t:0,frame:i(),history:[],nextFrameT:0,setFps(e){a.fps=e,o||l(Math.max(a.frame.t+1/e,a.t))},spike(){l(Math.max(a.nextFrameT,a.frame.t+n)),o=!0},advance(e){let t=[],n=a.t+Math.max(0,e);for(;a.nextFrameT<=n;)t.push(u(a.nextFrameT));return a.t=n,d(),t},stepFrame(){a.t=a.nextFrameT;let e=u(a.nextFrameT);return d(),e},reset(){a.t=0,a.frame=i(),a.history=[a.frame],o=!1,l(1/a.fps)},ideal(e=a.t){return 3*e}},o=!1,s=0,c=0;function l(e){s=e,c=0,a.nextFrameT=e}function u(t){let n=a.frame,r=t-n.t,i={i:n.i+1,t,dt:r,a:n.a+e,b:n.b+3*r,spike:o};return o=!1,a.frame=i,a.history.push(i),c++,a.nextFrameT=s+c/a.fps,i}function d(){let e=a.t-r,t=0;for(;t<a.history.length-1&&a.history[t].t<e;)t++;t&&a.history.splice(0,t)}return a.reset(),a}var a=(e,t=2)=>e.toLocaleString(`de-DE`,{minimumFractionDigits:t,maximumFractionDigits:t}),o=()=>typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion: reduce)`).matches;function s(e,t,n={}){let a=i({fps:n.fps??60}),s=n.runLength??1/0,c=n.hold??1.4,l={playing:!o(),slow:!1,holding:!1},u=!0,d=0,f=0,p=0,m=()=>y.onChange?.();function h(e){d=0;let n=f?Math.min((e-f)/1e3,.1):0;f=e;let i=[];if(l.playing){if(l.holding)p+=n,p>=c&&(l.holding=!1,a.reset(),i=[a.frame],m());else{let e=n*(l.slow?r:1),t=s-a.t;i=a.advance(Math.min(e,t)),a.t>=s-1e-9&&(l.holding=!0,p=0,m())}}t(i),g()}function g(){!d&&u&&l.playing&&!document.hidden&&(d=requestAnimationFrame(h)),l.playing||(f=0)}let _=typeof IntersectionObserver==`function`?new IntersectionObserver(e=>{u=e.some(e=>e.isIntersecting),f=0,g()}):null;_?.observe(e);let v=()=>{f=0,g()};document.addEventListener(`visibilitychange`,v);let y={sim:a,state:l,onChange:null,play(){l.holding&&y.restart(),l.playing=!0,f=0,g(),m()},pause(){l.playing=!1,m()},toggle(){l.playing?y.pause():y.play()},setSlow(e){l.slow=e,m()},setFps(e){a.setFps(e),m(),t([])},spike(){l.holding||(a.spike(),m())},step(){l.playing=!1,l.holding||a.nextFrameT>s+1e-9?(l.holding=!1,a.reset(),t([a.frame])):t([a.stepFrame()]),m()},restart(){l.holding=!1,a.reset(),t([a.frame]),m(),g()},destroy(){_?.disconnect(),document.removeEventListener(`visibilitychange`,v),d&&cancelAnimationFrame(d)}};return queueMicrotask(()=>{t([a.frame]),g()}),y}function c(e){let t=e.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,2.5),r=Math.max(1,Math.round(t.width*n)),i=Math.max(1,Math.round(t.height*n));(e.width!==r||e.height!==i)&&(e.width=r,e.height=i);let a=e.getContext(`2d`);return a.setTransform(n,0,0,n,0,0),{ctx:a,w:t.width,h:t.height}}function l(e,t={},...n){let r=document.createElement(e);for(let[e,n]of Object.entries(t))r.setAttribute(e,n);return r.append(...n),r}var u=[{fps:60},{fps:15},{fps:144},{fps:60,spike:!0},{fps:30,slow:!0}],d=1600,f=900,p=4,m=p*3,h=140,g=1110,_=780,v=262,y=e=>h+e/p*970,b=e=>_-e/m*518,x=1240,S=1392,C=846,w=884,T=`
:host{
  --dev: var(--device, #25292e); --scr: var(--device-screen, #111315); --grat: var(--device-grat, #33403a);
  --i: var(--chalk, #eeece4); --dim: var(--chalk-dim, #b7beb5); --plate: var(--schild, #f4f4ef); --plate-ink: var(--schild-ink, #161714);
  --ev-d: var(--ev, #f6a54e); --da-d: var(--da, #cfa9f7);
  --mit: var(--dt-mit-device, var(--i)); --ohne: var(--dt-ohne-device, var(--hi, #f7f09c));
  --p: var(--scr); --node: var(--scr); --soft: #1d2126; --g: var(--grat);
  --fd: var(--font-sans, "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", Verdana, sans-serif);
  --fm: var(--font-mono, "Atkinson Hyperlegible Mono", Consolas, monospace);
  display:block; color:var(--i);
}
.scroll{overflow-x:auto}
.stage{position:relative; aspect-ratio:16/9; min-width:600px; container-type:inline-size; overflow:hidden;
  background:var(--dev); border-radius:1.4cqw; font-family:var(--fd); user-select:none}
svg{position:absolute; inset:0; width:100%; height:100%; overflow:visible}
.node{position:absolute; box-sizing:border-box; background:var(--scr); border:.12cqw solid #3a3f45; border-radius:.3cqw}
.node .t{box-sizing:border-box; height:2.875cqw; display:flex; align-items:center; justify-content:space-between; gap:.6cqw;
  background:var(--plate); color:var(--plate-ink); font:700 1.7cqw/1 var(--fd); padding:0 .8cqw; white-space:nowrap}
.node .r{box-sizing:border-box; height:2.9375cqw; display:flex; align-items:center; justify-content:space-between; gap:.8cqw;
  padding:0 .8cqw; white-space:nowrap; font:1.5cqw/1 var(--fm); border-top:.08cqw solid var(--grat)}
.node .v{font-weight:700; font-variant-numeric:tabular-nums; font-size:1.65cqw}
.node .code{font-size:1.45cqw}
.node .sw{display:inline-block; width:1.2cqw; height:1.2cqw; flex:none; box-sizing:border-box; background:var(--plate-ink); border:.2cqw solid var(--plate-ink)}
.node .sw.hollow{background:transparent}
.port{display:inline-block; width:1.1cqw; height:1.1cqw; flex:none; box-sizing:border-box}
.port.ev{background:var(--ev-d); clip-path:polygon(0 0,100% 50%,0 100%)}
.port.da{background:var(--da-d); border-radius:50%}
.pl{margin-left:-1.4cqw} .pr{margin-right:-1.4cqw}
button{font:700 1.5cqw/1 var(--fd); color:var(--i); cursor:pointer; background:transparent; border:.14cqw solid var(--i);
  border-radius:.3cqw; padding:0 .9cqw; height:2.6cqw}
button:hover{background:var(--soft)}
button:focus-visible{outline:.3cqw solid var(--hi, #f7f09c); outline-offset:.2cqw}
button[aria-pressed="true"]{background:var(--i); color:var(--scr)}
.fps{display:grid; grid-template-columns:repeat(4,1fr); gap:.45cqw; padding:.5cqw .7cqw}
.fps button{font-size:1.7cqw; padding:0; height:2.9cqw}
.spike{display:block; width:calc(100% - 1.4cqw); margin:.1cqw .7cqw .7cqw; height:3cqw; font-size:1.7cqw}
.bar{position:absolute; display:flex; gap:.6cqw}
.ax{font:1.45cqw var(--fm); fill:var(--dim)}
.axt{font:700 1.6cqw var(--fd); fill:var(--i)}
.val{font:700 1.55cqw var(--fm); fill:var(--i); paint-order:stroke; stroke:var(--scr); stroke-width:8px; stroke-linejoin:round}
.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
`,E=(e,t,n)=>`left:${e/d*100}cqw; top:${t/d*100}cqw;${n?` width:${n/d*100}cqw;`:``}`,D=(e,t,n)=>`M${e-n} ${t-n}h${2*n}v${2*n}h${-2*n}Z`;function O(n,r){n.innerHTML=`<style>${T}</style>`;let i=l(`div`,{class:`stage`,role:`group`,"aria-label":`Erklärer: Frame, Update und deltaTime`});n.append(l(`div`,{class:`scroll`},i));let c=`<rect x="20" y="186" width="1560" height="700" rx="10" fill="var(--scr)"/>`;for(let e=70;e<1580;e+=50)c+=`<line x1="${e}" x2="${e}" y1="186" y2="886" stroke="var(--grat)" stroke-width="1"/>`;for(let e=236;e<886;e+=50)c+=`<line x1="20" x2="1580" y1="${e}" y2="${e}" stroke="var(--grat)" stroke-width="1"/>`;for(let e=0;e<=4;e++){let t=b(e*3);c+=`<line x1="${h}" x2="1432" y1="${t}" y2="${t}" stroke="var(--i)" stroke-opacity="${e?.14:0}" stroke-width="2"/>`,c+=`<text class="ax" x="122" y="${t+9}" text-anchor="end">${e*3}</text>`}for(let e=0;e<=p;e++)c+=`<line x1="${y(e)}" x2="${y(e)}" y1="${v}" y2="${_}" stroke="var(--i)" stroke-opacity="${e?.14:0}" stroke-width="2"/>`,c+=`<line x1="${y(e)}" x2="${y(e)}" y1="${_}" y2="792" stroke="var(--i)" stroke-width="2.5"/>`,c+=`<text class="ax" x="${y(e)}" y="814" text-anchor="middle">${e} s</text>`;c+=`<path d="M${h} 242V${_}H1134" stroke="var(--i)" stroke-width="3" fill="none"/>`,c+=`<text class="axt" x="${h}" y="230">Weg</text>`,c+=`<text class="axt" x="1140" y="788">Zeit</text>`,c+=`<path d="M${y(0)} ${b(0)}L${y(p)} ${b(m)}" stroke="var(--dim)" stroke-width="2.5" fill="none" opacity=".75"/>`,c+=`<text class="ax" x="${y(3.05)}" y="${b(9.15)-22}" text-anchor="end" style="fill:var(--dim)">Soll: 3 pro Sekunde</text>`;for(let[e,t]of[[x,`mit`],[S,`ohne`]])c+=`<line x1="${e}" x2="${e}" y1="242" y2="${_}" stroke="var(--i)" stroke-width="3"/>`,c+=t===`mit`?`<path d="${D(e-34,812,10)}" fill="var(--mit)"/>`:`<path d="${D(e-34,812,9)}" fill="none" stroke="var(--ohne)" stroke-width="4"/>`,c+=`<text class="axt" x="${e-16}" y="820">${t}</text>`;c+=`<line x1="${h}" x2="${g}" y1="${w}" y2="${w}" stroke="var(--i)" stroke-width="2"/>`,c+=`<text class="axt" x="30" y="836"><tspan style="fill:var(--ev-d)">▶</tspan> Frames</text>`,i.innerHTML=`
  <svg viewBox="0 0 ${d} ${f}" aria-hidden="true">
    <defs>
      <clipPath id="plot"><rect x="128" y="236" width="994" height="556"/></clipPath>
      <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="10" fill="var(--dim)" opacity=".45"/></pattern>
    </defs>
    <!-- Drähte -->
    <path d="M290 43 H330" stroke="var(--ev-d)" stroke-width="4" stroke-dasharray="9 6" fill="none"/>
    <path d="M590 43 H630" stroke="var(--ev-d)" stroke-width="4" stroke-dasharray="9 6" fill="none"/>
    <path d="M590 43 H606 Q612 43 612 37 V14 Q612 8 618 8 H1114 Q1120 8 1120 14 V37 Q1120 43 1126 43 H1140" stroke="var(--ev-d)" stroke-width="4" stroke-dasharray="9 6" fill="none"/>
    <path d="M590 136 H630" stroke="var(--da-d)" stroke-width="4" fill="none"/>
    ${c}
    <path id="hang" fill="url(#hatch)"/>
    <path id="pulses" stroke="var(--ev-d)" stroke-width="3"/>
    <g id="cursor"></g>
    <g clip-path="url(#plot)">
      <path id="trB" stroke="var(--mit)" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <path id="trA" stroke="var(--ohne)" stroke-width="4" fill="none" stroke-linejoin="round"/>
      <path id="mkB" fill="var(--mit)"/>
      <path id="mkA" fill="none" stroke="var(--ohne)" stroke-width="3"/>
    </g>
    <path id="tkB" stroke="var(--mit)" stroke-width="3"/>
    <path id="tkA" stroke="var(--ohne)" stroke-width="3"/>
    <path id="leadB" stroke="var(--mit)" stroke-width="2" stroke-dasharray="3 6"/>
    <path id="leadA" stroke="var(--ohne)" stroke-width="2" stroke-dasharray="3 6"/>
    <path id="cubeB" fill="var(--mit)"/>
    <path id="cubeA" fill="var(--scr)" stroke="var(--ohne)" stroke-width="5"/>
    <text id="valB" class="val"/>
    <text id="valA" class="val"/>
  </svg>`;let O=e=>i.querySelector(`#`+e),k=t.map(e=>l(`button`,{"aria-pressed":`false`,"aria-label":`${e} Frames pro Sekunde`},String(e))),A=l(`button`,{class:`spike`,title:`Ein Frame dauert eine halbe Sekunde`},`Ruckler!`),j=l(`div`,{class:`node`,style:E(20,20,270)},l(`div`,{class:`t`},l(`span`,{},`Takt · Frames/s`),l(`span`,{class:`port ev fill pr`})),l(`div`,{class:`fps`},...k),A),M=l(`span`,{class:`v`}),N=l(`span`,{class:`v`}),P=l(`div`,{class:`node`,style:E(330,20,260)},l(`div`,{class:`t`},l(`span`,{class:`port ev pl`}),l(`span`,{style:`flex:1`},`Update()`),l(`span`,{class:`port ev fill pr`})),l(`div`,{class:`r`},l(`span`,{},`Frame`),M),l(`div`,{class:`r`},l(`span`,{},`deltaTime`),N,l(`span`,{class:`port da fill pr`}))),F=l(`span`,{class:`v`,style:`color:var(--da-d)`}),I=l(`span`,{class:`v`}),L=l(`div`,{class:`node mit`,style:E(630,20,470)},l(`div`,{class:`t`},l(`span`,{class:`port ev pl`}),l(`span`,{class:`sw`,"aria-hidden":`true`}),l(`span`,{style:`flex:1`},`mit deltaTime`)),l(`div`,{class:`r`},l(`span`,{class:`code`},`Translate(0, 3f * deltaTime, 0)`)),l(`div`,{class:`r`},l(`span`,{class:`port da pl`}),l(`span`,{style:`flex:1`},`3 × `,F),I)),R=l(`span`,{class:`v`}),z=l(`div`,{class:`node ohne`,style:E(1140,20,440)},l(`div`,{class:`t`},l(`span`,{class:`port ev pl`}),l(`span`,{class:`sw hollow`,"aria-hidden":`true`}),l(`span`,{style:`flex:1`},`ohne deltaTime`)),l(`div`,{class:`r`},l(`span`,{class:`code`},`Translate(0, 0.05f, 0)`)),l(`div`,{class:`r`},l(`span`,{style:`flex:1`},`pro Frame`),R)),B=l(`button`,{}),V=l(`button`,{"aria-label":`Einen Frame weiter`},`Schritt`),H=l(`button`,{"aria-pressed":`false`},`Zeitlupe`),U=l(`button`,{"aria-label":`Neu starten`},`Neu`),W=l(`div`,{class:`bar`,style:`right:1.25cqw; top:${838/d*100}cqw;`},B,V,H,U),ee=l(`div`,{class:`sr`,"aria-live":`polite`});i.append(j,P,L,z,W,ee);let te=O(`trA`),ne=O(`trB`),G=O(`mkA`),K=O(`mkB`),q=O(`tkA`),re=O(`tkB`),ie=O(`leadA`),J=O(`leadB`),ae=O(`cubeA`),oe=O(`cubeB`),Y=O(`valA`),se=O(`valB`),X=O(`pulses`),ce=O(`cursor`),Z=O(`hang`);function Q(t){let n=$.sim,r=n.frame,i=Math.min(n.t,p),o=n.history.filter(e=>e.t<=4.000000001),s=970/(p*n.fps)<15,c=`M${y(0)} ${b(0)}`,l=c,u=``,d=``,f=``,h=``,g=``,_=0,v=0;for(let e of o){let t=y(e.t);c+=`H${t}V${b(e.a)}`,l+=`H${t}V${b(e.b)}`,_=e.a,v=e.b,!s&&e.i>0&&(u+=D(t,b(e.a),5),d+=D(t,b(e.b),5)),e.a<=m&&(f+=`M1394 ${b(e.a)}h16`),h+=`M1242 ${b(e.b)}h16`,e.i>0&&(g+=`M${t} ${C}V${w}`)}c+=`H${y(i)}`,l+=`H${y(i)}`,te.setAttribute(`d`,c),ne.setAttribute(`d`,l),G.setAttribute(`d`,u),K.setAttribute(`d`,d),q.setAttribute(`d`,f),re.setAttribute(`d`,h),X.setAttribute(`d`,g);let T=b(Math.min(_,m+.6)),E=b(v);oe.setAttribute(`d`,D(x,E,17)),ae.setAttribute(`d`,D(S,T,15)),J.setAttribute(`d`,`M${y(i)+8} ${E}H1218`),ie.setAttribute(`d`,_<=m?`M${y(i)+8} ${T}H1368`:``),se.setAttribute(`x`,`1266`),se.setAttribute(`y`,String(E+9)),se.textContent=a(v,2),Y.setAttribute(`x`,`1420`),Y.setAttribute(`y`,String(T+9)),Y.textContent=_>m?`↑ ${a(_,1)}`:a(_,2);let O=``;for(let e of o){if(!e.spike)continue;let t=y(e.t-e.dt),n=y(e.t);O+=`<rect x="${t}" y="${C}" width="${n-t}" height="38" fill="url(#hatch)"/>`,e!==r&&(O+=`<text class="val" x="${(t+n)/2}" y="876" text-anchor="middle" >Ruckler</text>`)}if(r.i>0&&r.t<=4.000000001){let e=y(r.t-r.dt),t=y(r.t);O+=`<path d="M${e} ${w}V840H${t}V${w}" stroke="var(--dim)" stroke-width="2" fill="none" "/>`;let n=r.spike?`Ruckler: Δt ${a(r.dt*1e3,0)} ms`:`Δt ${a(r.dt*1e3,1)} ms`,i=t>850;O+=`<text class="val" x="${i?e-12:t+12}" y="876" text-anchor="${i?`end`:`start`}">${n}</text>`}ce.innerHTML=O;let k=n.t-r.t;Z.setAttribute(`d`,k>1.5/n.fps&&n.t<=p?`M${y(r.t)} ${C}H${y(i)}V${w}H${y(r.t)}Z`:``),M.textContent=String(r.i),N.textContent=a(r.dt,4),F.textContent=a(r.dt,4),I.textContent=r.i?`= +${a(3*r.dt,3)}`:``,R.textContent=r.i?`+${a(e,3)}`:``}function le(){let e=$.state;k.forEach((e,n)=>e.setAttribute(`aria-pressed`,String(t[n]===$.sim.fps))),B.textContent=e.playing?`Pause`:`Start`,B.setAttribute(`aria-label`,e.playing?`Anhalten`:`Abspielen`),H.setAttribute(`aria-pressed`,String(e.slow))}let $=s(r,Q,{runLength:p});$.onChange=le,le(),o()&&$.sim.advance(2),k.forEach((n,r)=>n.addEventListener(`click`,()=>{$.setFps(t[r]),ee.textContent=`${t[r]} Frames pro Sekunde. Ohne deltaTime: ${a(t[r]*e/3,2)}-fache Geschwindigkeit. Mit deltaTime: unverändert 3 pro Sekunde.`})),A.addEventListener(`click`,()=>$.spike()),B.addEventListener(`click`,()=>$.toggle()),V.addEventListener(`click`,()=>$.step()),H.addEventListener(`click`,()=>$.setSlow(!$.state.slow)),U.addEventListener(`click`,()=>$.restart());let ue=new ResizeObserver(()=>Q([]));return ue.observe(i),{driver:$,applyStep(e){let t=u[Math.max(0,Math.min(u.length-1,e))];$.setSlow(!!t.slow),$.setFps(t.fps),t.spike&&$.spike(),$.play()},destroy(){ue.disconnect(),$.destroy()}}}var k=1600,A=900,j=4,M=150,N=1290/j,P=N/3,F=510,I=670,L=820,R={x0:268,x1:430,y:141},z=.25,B=`
:host{
  --p: var(--paper, #eceee7); --i: var(--ink, #1e2a28); --g: var(--grid, #d3d9cd);
  --ev: var(--draht-event, #d9480f); --da: var(--draht-daten, #1c6fb8);
  --mit: var(--dt-mit, #2b8a3e); --ohne: var(--dt-ohne, #b0359b);
  --node: var(--node-bg, #fbfbf8); --soft: var(--paper-soft, #e2e5dc);
  --fd: var(--font-titel, "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif);
  --fm: var(--font-mono, "Chivo Mono", "JetBrains Mono", Consolas, monospace);
  display:block; color:var(--i);
}
@media (prefers-color-scheme: dark){
  :host(:not([data-theme="light"])){ --p: var(--paper, #1b1f1e); --i: var(--ink, #e3e7e0); --g: var(--grid, #2b3230);
    --node: var(--node-bg, #252b2a); --soft: var(--paper-soft, #222826);
    --ev: var(--draht-event, #ff7b3d); --da: var(--draht-daten, #5aa9f0);
    --mit: var(--dt-mit, #5cc06f); --ohne: var(--dt-ohne, #e070cf); }
}
:host([data-theme="dark"]){ --p: var(--paper, #1b1f1e); --i: var(--ink, #e3e7e0); --g: var(--grid, #2b3230);
    --node: var(--node-bg, #252b2a); --soft: var(--paper-soft, #222826);
    --ev: var(--draht-event, #ff7b3d); --da: var(--draht-daten, #5aa9f0);
    --mit: var(--dt-mit, #5cc06f); --ohne: var(--dt-ohne, #e070cf); }
.scroll{overflow-x:auto}
.stage{position:relative; aspect-ratio:16/9; min-width:560px; container-type:inline-size; overflow:hidden;
  background-color:var(--p);
  background-image:linear-gradient(var(--g) 1px,transparent 1px),linear-gradient(90deg,var(--g) 1px,transparent 1px);
  background-size:2.5cqw 2.5cqw; font-family:var(--fm); user-select:none}
svg{position:absolute; inset:0; width:100%; height:100%; overflow:visible}
.node{position:absolute; background:var(--node); border:.16cqw solid var(--i); font:1.75cqw/1.25 var(--fm)}
.node .t{background:var(--i); color:var(--node); font:600 1.75cqw/1 var(--fd); letter-spacing:.06em;
  text-transform:uppercase; padding:.5cqw .8cqw .45cqw; white-space:nowrap}
.node .r{display:flex; align-items:center; justify-content:space-between; gap:1cqw; padding:.35cqw .8cqw; white-space:nowrap}
.node .r + .r{border-top:.08cqw solid var(--g)}
.node .v{font-variant-numeric:tabular-nums; font-weight:600}
.node.ohne .t{background:var(--ohne)} .node.mit .t{background:var(--mit)}
.node.ohne .t,.node.mit .t{color:#fff}
.port{display:inline-block; width:1.1cqw; height:1.1cqw; border-radius:50%; border:.18cqw solid currentColor; flex:none; background:var(--node)}
.port.ev{color:var(--ev)} .port.da{color:var(--da)} .port.fill{background:currentColor}
button{font:inherit; color:inherit; cursor:pointer; background:var(--node); border:.16cqw solid var(--i);
  border-radius:2cqw; padding:.25cqw .9cqw; line-height:1.2}
button:hover{background:var(--soft)}
button:focus-visible{outline:.3cqw solid var(--da); outline-offset:.2cqw}
button[aria-pressed="true"]{background:var(--i); color:var(--node)}
.fps{display:grid; grid-template-columns:1fr 1fr; gap:.5cqw; padding:.6cqw .8cqw}
.fps button{font-weight:600; font-size:1.9cqw; border-radius:.5cqw; padding:.25cqw 0}
.spike{position:absolute; border:.16cqw solid var(--ev); background:var(--node); color:var(--ev);
  font:600 1.75cqw/1 var(--fd); letter-spacing:.06em; text-transform:uppercase; border-radius:0; padding:.7cqw 1cqw}
.spike:hover{background:var(--ev); color:#fff}
.ctl{display:flex; flex-wrap:wrap; gap:.6cqw; padding:.7cqw .8cqw}
.lbl{font:600 1.6cqw/1 var(--fd); letter-spacing:.05em; text-transform:uppercase; fill:var(--i)}
.num{font:1.5cqw var(--fm); fill:var(--i); opacity:.75}
.small{font:1.35cqw var(--fm); fill:var(--i)}
.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
@media (prefers-reduced-motion: reduce){ .pulse{display:none} }
`,V=(e,t,n)=>`left:${e/k*100}cqw; top:${t/k*100}cqw;${n?` width:${n/k*100}cqw;`:``}`;function H(n,r){n.innerHTML=`<style>${B}</style>`;let i=l(`div`,{class:`stage`,role:`group`,"aria-label":`Erklärer: Frame, Update und deltaTime`}),o=l(`div`,{class:`scroll`},i);n.append(o),i.innerHTML=`
  <svg viewBox="0 0 ${k} ${A}" aria-hidden="true">
    <defs>
      <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="10" fill="var(--ev)" opacity=".35"/></pattern>
    </defs>
    <!-- Takt -> Update (Event) -->
    <path d="M${R.x0} ${R.y} H${R.x1}" stroke="var(--ev)" stroke-width="3" fill="none"/>
    <!-- Ruckler -> Takt -->
    <path d="M150 312 V280" stroke="var(--ev)" stroke-width="3" fill="none" stroke-dasharray="8 6"/>
    <!-- Update -> Ohne / Mit (Event) -->
    <path d="M720 141 C 745 141 745 99 770 99" stroke="var(--ev)" stroke-width="3" fill="none"/>
    <path d="M720 141 C 748 141 748 305 770 305" stroke="var(--ev)" stroke-width="3" fill="none"/>
    <!-- deltaTime (Daten) -> Mit -->
    <path d="M720 188 C 752 188 740 352 770 352" stroke="var(--da)" stroke-width="3" fill="none"/>
    <path class="pulse" id="pulse" fill="var(--ev)"/>
    <text class="small" x="${(R.x0+R.x1)/2}" y="${R.y+38}" text-anchor="middle" style="fill:var(--ev)">Frames</text>

    <!-- Lineale -->
    <g id="rulers"></g>
    <path id="hang" fill="url(#hatch)"/>
    <path id="tickT" stroke="var(--ev)" stroke-width="3"/>
    <path id="tickB" stroke="var(--mit)" stroke-width="3"/>
    <path id="tickA" stroke="var(--ohne)" stroke-width="3"/>
    <g id="spikes"></g>
    <line id="now" y1="458" y2="860" stroke="var(--i)" stroke-width="2" stroke-dasharray="4 5"/>
    <text id="nowL" class="small" y="450" text-anchor="middle">jetzt</text>
    <g id="chipB"><rect x="-22" y="-44" width="44" height="44" rx="4" fill="var(--mit)" stroke="var(--i)" stroke-width="3"/></g>
    <g id="chipA"><rect x="-22" y="-44" width="44" height="44" rx="4" fill="var(--ohne)" stroke="var(--i)" stroke-width="3"/>
      <text id="overA" class="small" x="34" y="-12" style="fill:var(--ohne); font-weight:600"></text></g>
  </svg>`;let c=e=>i.querySelector(`#`+e),d=c(`rulers`),f=``,p=(e,t,n,r,i,a)=>{f+=`<line x1="${M}" x2="1480" y1="${e}" y2="${e}" stroke="var(--i)" stroke-width="2.5"/>`,f+=`<text class="lbl" x="20" y="${e-8}" style="fill:${r}">${t}</text>`,n&&(f+=`<text class="small" x="20" y="${e+24}">${n}</text>`);for(let t=0;t<=a;t++){let n=M+1290*t/a;f+=`<line x1="${n}" x2="${n}" y1="${e}" y2="${e+16}" stroke="var(--i)" stroke-width="2.5"/>`,f+=`<text class="num" x="${n}" y="${e+42}" text-anchor="middle">${i(t)}</text>`}};p(F,`Zeit`,``,`var(--ev)`,e=>`${e} s`,j),p(I,`mit`,`deltaTime`,`var(--mit)`,e=>`${e*3}`,j),p(L,`ohne`,`deltaTime`,`var(--ohne)`,e=>`${e*3}`,j),d.innerHTML=f;let m=t.map(e=>l(`button`,{"aria-pressed":`false`,"aria-label":`${e} Frames pro Sekunde`},String(e))),h=l(`div`,{class:`node`,style:V(30,72,238)},l(`div`,{class:`t`},`Takt`),l(`div`,{class:`r`},l(`span`,{},`Frames/s`),l(`span`,{class:`port ev fill`,style:`margin-right:-1.45cqw`})),l(`div`,{class:`fps`},...m)),g=l(`button`,{class:`spike`,style:V(30,312,238),title:`Ein Frame dauert eine halbe Sekunde`},`Ruckler!`),_=l(`span`,{class:`v`}),v=l(`span`,{class:`v`}),y=l(`div`,{class:`node`,style:V(430,72,290)},l(`div`,{class:`t`},`Update()`),l(`div`,{class:`r`},l(`span`,{class:`port ev`,style:`margin-left:-1.45cqw`}),l(`span`,{},`Frame`),_,l(`span`,{class:`port ev fill`,style:`margin-right:-1.45cqw`})),l(`div`,{class:`r`},l(`span`,{},`deltaTime`),v,l(`span`,{class:`port da fill`,style:`margin-right:-1.45cqw`}))),b=`margin-left:-1.45cqw`,x=l(`span`,{class:`v`}),S=l(`span`,{class:`v`}),C=l(`div`,{class:`node ohne`,style:V(770,30,500)},l(`div`,{class:`t`},`ohne deltaTime`),l(`div`,{class:`r`},l(`span`,{class:`port ev`,style:b}),l(`span`,{style:`flex:1`},`Translate(0.05f)`)),l(`div`,{class:`r`},l(`span`,{},`pro Frame`),x),l(`div`,{class:`r`},l(`span`,{},`position.x`),S)),w=l(`span`,{class:`v`}),T=l(`span`,{class:`v`}),E=l(`span`,{class:`v`,style:`color:var(--da)`}),D=l(`div`,{class:`node mit`,style:V(770,236,500)},l(`div`,{class:`t`},`mit deltaTime`),l(`div`,{class:`r`},l(`span`,{class:`port ev`,style:b}),l(`span`,{style:`flex:1`},`Translate(3f * deltaTime)`)),l(`div`,{class:`r`},l(`span`,{class:`port da`,style:b}),l(`span`,{style:`flex:1`},`3 × `,E),w),l(`div`,{class:`r`},l(`span`,{},`position.x`),T)),O=l(`button`,{"aria-label":`Abspielen`}),H=l(`button`,{"aria-label":`Einen Frame weiter`},`Schritt`),U=l(`button`,{"aria-pressed":`false`},`Zeitlupe`),W=l(`button`,{"aria-label":`Neu starten`},`↺`),ee=l(`div`,{class:`node`,style:V(1300,30,270)},l(`div`,{class:`t`},`Steuern`),l(`div`,{class:`ctl`},O,H,U,W)),te=l(`div`,{class:`sr`,"aria-live":`polite`});i.append(h,g,y,C,D,ee,te);let ne=c(`pulse`),G=c(`tickT`),K=c(`tickA`),q=c(`tickB`),re=c(`hang`),ie=c(`spikes`),J=c(`now`),ae=c(`nowL`),oe=c(`chipA`),Y=c(`chipB`),se=c(`overA`),X=1470;function ce(t){let n=Q.sim,r=n.frame,i=n.history.filter(e=>e.t<=4.000000001),o=``,s=``,c=``,l=``,u=``;for(let e of i){let t=M+e.t*N;o+=`M${t} 484V${F}`,c+=`M${M+e.b*P} 648V${I}`;let r=M+e.a*P;r<=X&&(s+=`M${r} 798V${L}`);let i=n.t-e.t;if(i>=0&&i<=z){let e=R.x0+i/z*(R.x1-R.x0);l+=`M${e-5} ${R.y}a5 5 0 1 0 10 0a5 5 0 1 0 -10 0`}if(e.spike){let n=M+(e.t-e.dt)*N;u+=`<path d="M${n} 470V462H${t}V470" stroke="var(--ev)" stroke-width="2.5" fill="none"/>`,u+=`<text class="small" x="${(n+t)/2}" y="454" text-anchor="middle" style="fill:var(--ev)">Ruckler ${a(e.dt,1)} s</text>`}}G.setAttribute(`d`,o),K.setAttribute(`d`,s),q.setAttribute(`d`,c),ne.setAttribute(`d`,l),ie.innerHTML=u;let d=n.t-r.t;re.setAttribute(`d`,d>1.5/n.fps?`M${M+r.t*N} 484H${M+n.t*N}V${F}H${M+r.t*N}Z`:``);let f=M+Math.min(n.t,j)*N;J.setAttribute(`x1`,String(f)),J.setAttribute(`x2`,String(f)),ae.setAttribute(`x`,String(f));let p=M+r.b*P,m=M+r.a*P,h=Math.min(m,X);Y.setAttribute(`transform`,`translate(${p} 644)`),oe.setAttribute(`transform`,`translate(${h} 794)`),se.textContent=m>X?`→ ${a(r.a,1)}`:``,_.textContent=String(r.i),v.textContent=a(r.dt,4),E.textContent=a(r.dt,4),x.textContent=r.i?`+${a(e,3)}`:``,w.textContent=r.i?`= +${a(3*r.dt,3)}`:``,S.textContent=a(r.a,2),T.textContent=a(r.b,2)}function Z(){let e=Q.state;m.forEach((e,n)=>e.setAttribute(`aria-pressed`,String(t[n]===Q.sim.fps))),O.textContent=e.playing?`Pause`:`Start`,O.setAttribute(`aria-label`,e.playing?`Anhalten`:`Abspielen`),U.setAttribute(`aria-pressed`,String(e.slow))}let Q=s(r,ce,{runLength:j});Q.onChange=Z,Z(),m.forEach((n,r)=>n.addEventListener(`click`,()=>{Q.setFps(t[r]),te.textContent=`${t[r]} Frames pro Sekunde. Ohne deltaTime: ${a(t[r]*e/3,2)}-fache Geschwindigkeit.`})),g.addEventListener(`click`,()=>Q.spike()),O.addEventListener(`click`,()=>Q.toggle()),H.addEventListener(`click`,()=>Q.step()),U.addEventListener(`click`,()=>Q.setSlow(!Q.state.slow)),W.addEventListener(`click`,()=>Q.restart());let le=new ResizeObserver(()=>ce([]));return le.observe(i),{driver:Q,applyStep(e){let t=u[Math.max(0,Math.min(u.length-1,e))];Q.setSlow(!!t.slow),Q.setFps(t.fps),t.spike&&Q.spike(),Q.play()},destroy(){le.disconnect(),Q.destroy()}}}var U=4,W=U*3,ee=`
:host{
  --bg: var(--dt-scope-bg, #0a0f0d); --bez: var(--dt-scope-bezel, #1a1f1d); --grid: #1d3329; --txt: #cfe9dc; --dim: #6f8f80;
  --a: var(--dt-scope-ohne, #ffb347); --b: var(--dt-scope-mit, #4fe3c1); --pulse: #e8fff4; --warn: #ff5a3c;
  --fm: var(--font-mono, "Chivo Mono", "JetBrains Mono", Consolas, monospace);
  --fd: var(--font-titel, "Barlow Condensed", "Arial Narrow", sans-serif);
  display:block;
}
.scroll{overflow-x:auto}
.stage{position:relative; aspect-ratio:16/9; min-width:560px; container-type:inline-size; background:var(--bez);
  border-radius:1.2cqw; padding:1.4cqw; box-sizing:border-box; display:grid; gap:1.4cqw;
  grid-template-columns:minmax(0,1fr) 27cqw; grid-template-rows:minmax(0,1fr) auto; color:var(--txt); font-family:var(--fm);
  box-shadow: inset 0 0 0 .15cqw #2a312e, inset 0 .4cqw 1.2cqw #0008; user-select:none}
.screen{position:relative; grid-row:1; background:radial-gradient(ellipse at 50% 45%, #0f1c17 0%, var(--bg) 75%);
  border-radius:.8cqw; box-shadow: inset 0 0 2cqw #000, 0 0 0 .2cqw #000; overflow:hidden}
canvas{position:absolute; inset:0; width:100%; height:100%; display:block}
.code{grid-column:1; grid-row:2; background:#070a09; border-radius:.6cqw; padding:1cqw 1.3cqw; font:1.5cqw/1.75 var(--fm);
  box-shadow: inset 0 0 0 .12cqw #23302a; white-space:pre; overflow:hidden; color:#9fb8ac}
.code .k{color:#7fa7ff} .code .n{color:#e6d27a} .code .c{color:var(--dim)}
.code .la{color:var(--a)} .code .lb{color:var(--b)}
.code .live{float:right; font-variant-numeric:tabular-nums}
.code .dt{position:relative; color:#fff; background:#1c3a30; border-radius:.3cqw; padding:0 .3cqw}
.panel{grid-column:2; grid-row:1 / span 2; display:flex; flex-direction:column; gap:1.1cqw; min-height:0}
.read{background:#070a09; border-radius:.6cqw; padding:.9cqw 1.1cqw; box-shadow: inset 0 0 0 .12cqw #23302a}
.read small{display:block; font:600 1.15cqw var(--fd); letter-spacing:.08em; text-transform:uppercase; color:var(--dim)}
.read .big{font:600 3.6cqw/1.05 var(--fm); color:var(--b); font-variant-numeric:tabular-nums; text-shadow:0 0 1cqw #4fe3c155}
.read .row{display:flex; justify-content:space-between; font:1.45cqw/1.5 var(--fm); font-variant-numeric:tabular-nums}
.lab{font:600 1.15cqw var(--fd); letter-spacing:.08em; text-transform:uppercase; color:var(--dim); margin-bottom:.4cqw}
.seg{display:grid; grid-template-columns:repeat(4,1fr); gap:.4cqw}
button{font:600 1.6cqw/1 var(--fm); color:var(--txt); background:linear-gradient(#2b3330,#1d2321); border:0; border-radius:.4cqw;
  padding:.8cqw .3cqw .7cqw; cursor:pointer; box-shadow:0 .25cqw 0 #0b0e0d, inset 0 .1cqw 0 #ffffff14; position:relative}
button:active{transform:translateY(.2cqw); box-shadow:0 .05cqw 0 #0b0e0d}
button:focus-visible{outline:.25cqw solid var(--b); outline-offset:.15cqw}
button .led{display:block; width:.7cqw; height:.7cqw; border-radius:50%; margin:0 auto .5cqw; background:#26312c}
button[aria-pressed="true"] .led{background:var(--b); box-shadow:0 0 .8cqw var(--b)}
.row2{display:grid; grid-template-columns:1fr 1fr; gap:.5cqw}
.row3{display:grid; grid-template-columns:repeat(3,1fr); gap:.5cqw}
.spike{background:linear-gradient(#6b2216,#4a160d); color:#ffd9cf; font-family:var(--fd); letter-spacing:.08em; text-transform:uppercase; font-size:1.8cqw}
.spike.on{background:var(--warn); color:#fff}
.spike.on .led{background:#fff; box-shadow:0 0 .8cqw #fff}
.tempo{margin-top:auto}
.tempo .row{align-items:baseline}
.tempo .big{font-size:3cqw}
.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
`;function te(n,r){n.innerHTML=`<style>${ee}</style>`;let i=l(`canvas`,{"aria-hidden":`true`}),o=l(`div`,{class:`screen`},i),d=l(`span`,{class:`live la`}),f=l(`span`,{class:`live lb`}),p=l(`span`,{class:`dt`},`Time.deltaTime`),m=l(`div`,{class:`code`,"aria-label":`C#-Code`});m.append(l(`span`,{class:`k`},`void`),` Update() {
`,`  `,l(`span`,{class:`la`},`transform.Translate(`),l(`span`,{class:`n`},`0.05f`),`, 0, 0);`,d,`
`,`  `,l(`span`,{class:`lb`},`transform.Translate(`),l(`span`,{class:`n`},`3f`),` * `,p,`, 0, 0);`,f,`
`,`}`);let h=l(`div`,{class:`big`}),g=l(`span`,{}),_=l(`span`,{}),v=l(`div`,{class:`read`},l(`small`,{},`Time.deltaTime · s`),h,l(`div`,{class:`row`},l(`span`,{},`Frame`),g),l(`div`,{class:`row`},l(`span`,{},`Zeit`),_)),y=t.map(e=>l(`button`,{"aria-pressed":`false`,"aria-label":`${e} Frames pro Sekunde`},l(`span`,{class:`led`}),String(e))),b=l(`button`,{class:`spike`,title:`Ein Frame dauert eine halbe Sekunde`},l(`span`,{class:`led`}),`Ruckler`),x=l(`div`,{class:`big`,style:`color:var(--a); text-shadow:0 0 1cqw #ffb34755`}),S=l(`div`,{class:`big`}),C=l(`button`,{"aria-pressed":`false`},l(`span`,{class:`led`}),`Zeitlupe`),w=l(`button`,{}),T=l(`button`,{"aria-label":`Einen Frame weiter`},`Schritt`),E=l(`button`,{"aria-label":`Neu starten`},`↺`),D=l(`div`,{class:`sr`,"aria-live":`polite`}),O=l(`div`,{class:`stage`,role:`group`,"aria-label":`Erklärer: Frame, Update und deltaTime (Messgerät)`},o,m,l(`div`,{class:`panel`},v,l(`div`,{},l(`div`,{class:`lab`},`Frames / s`),l(`div`,{class:`seg`},...y)),l(`div`,{class:`row2`},b,C),l(`div`,{class:`row3`},w,T,E),l(`div`,{class:`read tempo`},l(`small`,{},`Tempo · Einheiten pro s`),l(`div`,{class:`row`},l(`span`,{style:`color:var(--a)`},`ohne`),x),l(`div`,{class:`row`},l(`span`,{style:`color:var(--b)`},`mit`),S)),D));n.append(l(`div`,{class:`scroll`},O));let k=0;function A(t){let{ctx:n,w:o,h:s}=c(i),l=M.sim,u=l.frame,m=l.history.filter(e=>e.t<=4.000000001),v=o/100,y=7*v,C=3*v,w=o-y-C,T=e=>y+e/U*w,E=3*v,D=3.2*v,O=1.6*v,A=E+2*D+O+4.5*v,j=s-13*v,N=e=>j-Math.min(e,W*1.04)/W*(j-A),P=s-8.5*v,F=s-3*v;n.clearRect(0,0,o,s),n.lineCap=`round`,n.font=`${1.75*v}px ${getComputedStyle(r).getPropertyValue(`--fm`)||`monospace`}`,n.strokeStyle=`#1d3329`,n.lineWidth=1,n.beginPath();for(let e=0;e<=8;e++){let t=T(e/2);n.moveTo(t,A),n.lineTo(t,j),n.moveTo(t,P),n.lineTo(t,F)}for(let e=0;e<=4;e++){let t=N(W*e/4);n.moveTo(y,t),n.lineTo(y+w,t)}n.stroke(),n.fillStyle=`#6f8f80`,n.textAlign=`center`;for(let e=0;e<=U;e++)n.fillText(`${e} s`,T(e),j+2.6*v);n.textAlign=`right`;for(let e=0;e<=4;e++)n.fillText(String(W*e/4),y-1.2*v,N(W*e/4)+.6*v);n.textAlign=`left`,n.fillText(`Weg`,.8*v,A-1.6*v),n.fillText(`Frames`,.8*v,F-.4*v),n.setLineDash([.6*v,.8*v]),n.strokeStyle=`#e8fff455`,n.beginPath(),n.moveTo(T(0),N(0)),n.lineTo(T(U),N(W)),n.stroke(),n.setLineDash([]);let I=(e,t)=>{n.strokeStyle=t,n.lineWidth=.32*v,n.lineJoin=`round`,n.beginPath(),n.moveTo(T(0),N(0));let r=0;for(let t of m)n.lineTo(T(t.t),N(r)),n.lineTo(T(t.t),N(t[e])),r=t[e];if(n.lineTo(T(Math.min(l.t,U)),N(r)),n.stroke(),w/(U*l.fps)>.9*v){n.fillStyle=t;for(let t of m)n.beginPath(),n.arc(T(t.t),N(t[e]),.45*v,0,7),n.fill()}let i=T(Math.min(l.t,U)),s=N(r);n.save(),n.shadowColor=t,n.shadowBlur=2.2*v,n.fillStyle=`#fff`,n.beginPath(),n.arc(i,s,.6*v,0,7),n.fill(),n.restore(),r>W*1.04&&(n.fillStyle=t,n.fillText(`↑ ${a(r,1)}`,Math.min(i+1*v,o-9*v),A+1.5*v))};I(`b`,`#4fe3c1`),I(`a`,`#ffb347`);let L=(e,t,r,i)=>{n.strokeStyle=`#2c463a`,n.lineWidth=.2*v,n.beginPath(),n.moveTo(y,e+D/2),n.lineTo(y+w,e+D/2);for(let t=0;t<=4;t++){let r=y+t/4*w;n.moveTo(r,e+D*.2),n.lineTo(r,e+D*.8)}n.stroke(),n.fillStyle=r,n.fillText(i,.8*v,e+D*.68);let o=t>W,s=y+Math.min(t,W)/W*w;n.save(),n.shadowColor=r,n.shadowBlur=1.5*v,n.fillRect(s-D*.4,e+D*.1,D*.8,D*.8),n.restore(),o&&(n.textAlign=`right`,n.fillText(`→ ${a(t,1)}`,s-D*.7,e+D*.68),n.textAlign=`left`)};L(E,u.a,`#ffb347`,`ohne`),L(E+D+O,u.b,`#4fe3c1`,`mit`),n.strokeStyle=`#e8fff4`,n.lineWidth=Math.max(1,.2*v),n.beginPath();for(let e of m)e.i!==0&&(n.moveTo(T(e.t),F),n.lineTo(T(e.t),P+1.2*v));n.stroke(),n.beginPath(),n.strokeStyle=`#2c463a`,n.moveTo(y,F),n.lineTo(y+w,F),n.stroke();let R=l.t-u.t>1.5/l.fps&&l.t<U;u.i>0&&z(T(u.t-u.dt),T(u.t),`Δt ${a(u.dt*1e3,1)} ms`,u.spike?`#ff5a3c`:`#4fe3c1`),R&&(n.fillStyle=`#ff5a3c33`,n.fillRect(T(u.t),P+1.2*v,T(l.t)-T(u.t),F-P-1.2*v));function z(e,t,r,i){let a=P+.2*v;n.strokeStyle=i,n.fillStyle=i,n.lineWidth=.18*v,n.setLineDash([.4*v,.4*v]),n.beginPath(),n.moveTo(e,a),n.lineTo(e,F),n.moveTo(t,a),n.lineTo(t,F),n.stroke(),n.setLineDash([]),n.beginPath(),n.moveTo(e,a),n.lineTo(t,a),n.stroke(),n.textAlign=t>y+w*.75?`right`:`left`,n.fillText(r,n.textAlign===`right`?e-.8*v:t+.8*v,a+.6*v),n.textAlign=`left`}h.textContent=a(u.dt,4),x.textContent=a(l.fps*e,1),S.textContent=a(3,1),g.textContent=String(u.i),_.textContent=`${a(Math.min(l.t,U),2)} s`,d.textContent=`  // x = ${a(u.a,2)}`,f.textContent=`  // x = ${a(u.b,2)}`,p.title=a(u.dt,4),u.spike&&(k=6),b.classList.toggle(`on`,R||k-->0)}function j(){let e=M.state;y.forEach((e,n)=>e.setAttribute(`aria-pressed`,String(t[n]===M.sim.fps))),w.textContent=e.playing?`Pause`:`Start`,w.setAttribute(`aria-label`,e.playing?`Anhalten`:`Abspielen`),C.setAttribute(`aria-pressed`,String(e.slow))}let M=s(r,A,{runLength:U});M.onChange=j,j(),y.forEach((n,r)=>n.addEventListener(`click`,()=>{M.setFps(t[r]),D.textContent=`${t[r]} Frames pro Sekunde. Ohne deltaTime: ${a(t[r]*e/3,2)}-fache Geschwindigkeit.`})),b.addEventListener(`click`,()=>M.spike()),w.addEventListener(`click`,()=>M.toggle()),T.addEventListener(`click`,()=>M.step()),C.addEventListener(`click`,()=>M.setSlow(!M.state.slow)),E.addEventListener(`click`,()=>M.restart());let N=new ResizeObserver(()=>A([]));return N.observe(i),{driver:M,applyStep(e){let t=u[Math.max(0,Math.min(u.length-1,e))];M.setSlow(!!t.slow),M.setFps(t.fps),t.spike&&M.spike(),M.play()},destroy(){N.disconnect(),M.destroy()}}}var ne=4,G=ne*3,K=440,q=462,re=350,ie=280,J=198,ae=104,oe=1.2,Y=[-135,-45,45,135],se=`
:host{
  --tray: var(--dt-toy-tray, #ffd166); --tray2: #f7b801; --face: #fffaf0; --line: #2a2238; --soft: #f1e6d0;
  --mit: var(--dt-mit-toy, #12a39a); --ohne: var(--dt-ohne-toy, #ff5c7a); --red: #e63946; --hand: #2a2238;
  --fr: var(--font-rund, ui-rounded, "Nunito", "Varela Round", "Arial Rounded MT Bold", "Segoe UI", system-ui, sans-serif);
  display:block;
}
@media (prefers-color-scheme: dark){
  :host(:not([data-theme="light"])){ --tray: var(--dt-toy-tray, #3b2f63); --tray2:#2a2148; --face:#1f1a33; --line:#f3ecff; --soft:#2c2547; --hand:#f3ecff;
    --mit: var(--dt-mit-toy, #2ed3c6); --ohne: var(--dt-ohne-toy, #ff7d95); }
}
:host([data-theme="dark"]){ --tray: var(--dt-toy-tray, #3b2f63); --tray2:#2a2148; --face:#1f1a33; --line:#f3ecff; --soft:#2c2547; --hand:#f3ecff;
    --mit: var(--dt-mit-toy, #2ed3c6); --ohne: var(--dt-ohne-toy, #ff7d95); }
.scroll{overflow-x:auto}
.stage{position:relative; aspect-ratio:16/9; min-width:560px; container-type:inline-size; overflow:hidden; border-radius:2.4cqw;
  background:radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--tray) 80%, #fff) 0%, var(--tray) 45%, var(--tray2) 100%);
  font-family:var(--fr); color:var(--line); user-select:none; touch-action:manipulation}
svg{position:absolute; inset:0; width:100%; height:100%}
.dial.shake{animation:shake .45s cubic-bezier(.36,.07,.19,.97)}
@keyframes shake{10%,90%{transform:translate(-4px,0)}20%,80%{transform:translate(8px,2px)}30%,50%,70%{transform:translate(-12px,-2px)}40%,60%{transform:translate(12px,1px)}}
.lbl{font:800 30px var(--fr); fill:var(--line)}
.pop{font:900 34px var(--fr)}
.console{position:absolute; left:59cqw; top:3cqw; right:3cqw; bottom:3cqw; background:var(--face); border:.35cqw solid var(--line);
  border-radius:2.4cqw; box-shadow:.6cqw .7cqw 0 var(--line); display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto 1fr auto auto;
  padding:2cqw; gap:1.2cqw 2cqw; align-items:center; justify-items:center}
.cap{font:800 1.9cqw/1 var(--fr); text-align:center}
.knobwrap{position:relative; width:17cqw; height:17cqw; grid-row:2}
.knob{position:absolute; inset:2.6cqw; border-radius:50%; background:radial-gradient(circle at 35% 30%, #fff8 0, transparent 45%), var(--mit);
  border:.35cqw solid var(--line); box-shadow:.4cqw .5cqw 0 var(--line); cursor:grab; transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.knob:focus-visible,.big:focus-visible,.small:focus-visible{outline:.4cqw solid var(--line); outline-offset:.4cqw}
.knob::after{content:""; position:absolute; left:50%; top:.8cqw; width:1.1cqw; height:3.4cqw; margin-left:-.55cqw; border-radius:1cqw; background:var(--line)}
.knob.drag{transition:none; cursor:grabbing}
.det{position:absolute; font:900 1.9cqw/1 var(--fr); transform:translate(-50%,-50%); cursor:pointer; padding:.3cqw; background:none; border:0; color:var(--line); opacity:.55}
.det.on{opacity:1}
.big{grid-row:2; width:13cqw; height:13cqw; border-radius:50%; border:.35cqw solid var(--line); background:radial-gradient(circle at 35% 30%, #fff6 0, transparent 40%), var(--red);
  box-shadow:0 .9cqw 0 var(--line); color:#fff; font:900 2.2cqw/1 var(--fr); cursor:pointer; transition:transform .08s, box-shadow .08s}
.big:active,.big.down{transform:translateY(.8cqw); box-shadow:0 .1cqw 0 var(--line)}
.row{grid-column:1 / span 2; display:flex; gap:1cqw; align-items:center; justify-content:center; width:100%}
.small{height:4.6cqw; min-width:4.6cqw; padding:0 1.2cqw; white-space:nowrap; justify-content:center; border-radius:3cqw; border:.3cqw solid var(--line); background:var(--soft); color:var(--line);
  font:900 1.7cqw/1 var(--fr); cursor:pointer; box-shadow:0 .45cqw 0 var(--line); display:flex; align-items:center; gap:.8cqw}
.small:active{transform:translateY(.4cqw); box-shadow:0 .05cqw 0 var(--line)}
.switch{width:4.6cqw; height:2.6cqw; border-radius:2cqw; background:var(--line); position:relative; flex:none}
.switch::after{content:""; position:absolute; top:.35cqw; left:.35cqw; width:1.9cqw; height:1.9cqw; border-radius:50%; background:var(--face); transition:left .2s}
[aria-pressed="true"] .switch{background:var(--mit)} [aria-pressed="true"] .switch::after{left:2.35cqw}
.lcd{grid-column:1 / span 2; font:800 2.4cqw/1 var(--font-mono, "Chivo Mono", Consolas, monospace); background:var(--line); color:var(--face); border-radius:1cqw; padding:.8cqw 1.6cqw; font-variant-numeric:tabular-nums}
.lcd b{color:var(--mit)}
.sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
@media (prefers-reduced-motion: reduce){ .dial.shake{animation:none} .knob{transition:none} .pop{display:none} }
`,X=(e,t)=>{let n=t%G/G*Math.PI*2;return[K+e*Math.sin(n),q-e*Math.cos(n)]};function ce(n,r){n.innerHTML=`<style>${se}</style>`;let i=l(`div`,{class:`stage`,role:`group`,"aria-label":`Erklärer: Frame, Update und deltaTime (Spielzeug)`});n.append(l(`div`,{class:`scroll`},i));let c=``;for(let e=0;e<ne;e++){let[t,n]=X(348,e*3),[r,i]=X(374,e*3),[a,o]=X(402,e*3);c+=`<line x1="${t}" y1="${n}" x2="${r}" y2="${i}" stroke="var(--line)" stroke-width="8" stroke-linecap="round"/>`,e>0&&(c+=`<text class="lbl" x="${a}" y="${o+10}" text-anchor="middle">${e} s</text>`)}i.innerHTML=`
  <svg viewBox="0 0 1600 900" aria-hidden="true">
    <g class="dial">
      <circle cx="${K}" cy="${q}" r="358" fill="var(--line)"/>
      <circle cx="446" cy="476" r="358" fill="var(--line)"/>
      <circle cx="${K}" cy="${q}" r="${re}" fill="var(--face)"/>
      <circle cx="${K}" cy="${q}" r="${ie}" fill="none" stroke="var(--soft)" stroke-width="58"/>
      <circle cx="${K}" cy="${q}" r="${J}" fill="none" stroke="var(--soft)" stroke-width="58"/>
      ${c}
      <text class="lbl" x="${K}" y="94" text-anchor="middle">0</text>
      <path id="rim" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>
      <g id="prints"></g>
      <line id="hand" x1="${K}" y1="${q}" stroke="var(--hand)" stroke-width="7" stroke-linecap="round"/>
      <circle cx="${K}" cy="${q}" r="${ae}" fill="var(--face)" stroke="var(--line)" stroke-width="7"/>
      <text id="lapB" x="${K}" y="454" text-anchor="middle" style="font:900 64px var(--fr); fill:var(--mit)"></text>
      <text id="lapA" x="${K}" y="524" text-anchor="middle" style="font:900 64px var(--fr); fill:var(--ohne)"></text>
      <text x="${K}" y="396" text-anchor="middle" style="font:800 22px var(--fr); fill:var(--line); opacity:.7">Runden</text>
      <g id="runB">${Z(`var(--mit)`,.85)}</g>
      <g id="runA">${Z(`var(--ohne)`,.85)}</g>
      <g id="pops"></g>
    </g>
    <g transform="translate(44 52)">
      <g transform="translate(0 0)">${Z(`var(--mit)`,.55)}</g><text class="lbl" x="34" y="10">mit deltaTime</text>
      <g transform="translate(0 50)">${Z(`var(--ohne)`,.55)}</g><text class="lbl" x="34" y="60">ohne</text>
    </g>
  </svg>`;let d=e=>i.querySelector(`#`+e),f=i.querySelector(`.dial`),p=d(`rim`),m=d(`prints`),h=d(`hand`),g=d(`runA`),_=d(`runB`),v=d(`lapA`),y=d(`lapB`),b=d(`pops`),x=l(`div`,{class:`knob`,role:`slider`,tabindex:`0`,"aria-label":`Frames pro Sekunde`,"aria-valuemin":`15`,"aria-valuemax":`144`}),S=t.map((e,t)=>{let n=Y[t]*Math.PI/180;return l(`button`,{class:`det`,style:`left:${50+47*Math.sin(n)}%; top:${50-47*Math.cos(n)}%`,"aria-label":`${e} Frames pro Sekunde`,tabindex:`-1`},String(e))}),C=l(`div`,{class:`knobwrap`},x,...S),w=l(`button`,{class:`big`,title:`Ein Frame dauert eine halbe Sekunde`},`Ruckler!`),T=l(`button`,{class:`small`,"aria-pressed":`false`},l(`span`,{class:`switch`}),`Zeitlupe`),E=l(`button`,{class:`small`}),D=l(`button`,{class:`small`,"aria-label":`Einen Frame weiter`},`+1`),O=l(`button`,{class:`small`,"aria-label":`Neu starten`},`↺`),k=l(`b`,{}),A=l(`div`,{class:`lcd`,"aria-label":`Time.deltaTime`},`deltaTime = `,k,` s`),j=l(`div`,{class:`sr`,"aria-live":`polite`}),M=l(`div`,{class:`console`},l(`div`,{class:`cap`},`Frames/s`),l(`div`,{class:`cap`},`Nicht drücken`),C,w,A,l(`div`,{class:`row`},T,E,D,O),j);i.append(M);let N=0,P=0,F=[];function I(e){let t=z.sim,n=t.frame,r=``,i=``;for(let e of t.history){let n=t.t-e.t;if(n>ne*.5)continue;let a=e.t*3,[o,s]=X(346,a),[c,l]=X(324,a);if(r+=`M${o.toFixed(1)} ${s.toFixed(1)}L${c.toFixed(1)} ${l.toFixed(1)}`,n<=oe&&e.i>0){let t=(1-n/oe)*.85,[r,a]=X(J,e.a),[o,s]=X(ie,e.b);i+=`<circle cx="${r.toFixed(1)}" cy="${a.toFixed(1)}" r="9" fill="var(--ohne)" opacity="${t.toFixed(2)}"/>`,i+=`<circle cx="${o.toFixed(1)}" cy="${s.toFixed(1)}" r="9" fill="var(--mit)" opacity="${t.toFixed(2)}"/>`}}p.setAttribute(`d`,r),m.innerHTML=i;let[s,c]=X(320,t.t*3);h.setAttribute(`x2`,s.toFixed(1)),h.setAttribute(`y2`,c.toFixed(1)),k.textContent=a(n.dt,4),L(g,J,n.a),L(_,ie,n.b);let l=Math.floor(n.a/G+1e-9),u=Math.floor(n.b/G+1e-9);for(v.textContent=String(l),y.textContent=String(u),e.length&&!o()&&(l>N&&F.push({x:K,y:214,t:t.t,c:`var(--ohne)`}),u>P&&F.push({x:K,y:132,t:t.t,c:`var(--mit)`})),N=l,P=u;F.length&&t.t-F[0].t>.8;)F.shift();b.innerHTML=F.map(e=>{let n=(t.t-e.t)/.8;return`<text class="pop" x="${e.x+70}" y="${e.y-n*40}" style="fill:${e.c}" opacity="${(1-n).toFixed(2)}" text-anchor="middle">+1</text>`}).join(``),e.some(e=>e.spike)&&!o()&&(f.classList.remove(`shake`),f.getBoundingClientRect(),f.classList.add(`shake`))}function L(e,t,n){let[r,i]=X(t,n),a=n%G/G*360;e.setAttribute(`transform`,`translate(${r.toFixed(1)} ${i.toFixed(1)}) rotate(${a.toFixed(1)})`)}function R(){let e=z.state,n=t.indexOf(z.sim.fps);x.style.transform=`rotate(${Y[Math.max(0,n)]}deg)`,x.setAttribute(`aria-valuenow`,String(z.sim.fps)),x.setAttribute(`aria-valuetext`,`${z.sim.fps} Frames pro Sekunde`),S.forEach((e,t)=>e.classList.toggle(`on`,t===n)),E.textContent=e.playing?`Pause`:`Start`,E.setAttribute(`aria-label`,e.playing?`Anhalten`:`Abspielen`),T.setAttribute(`aria-pressed`,String(e.slow))}let z=s(r,I,{});z.onChange=R,R();let B=t=>{if(t===z.sim.fps)return R();z.setFps(t),j.textContent=`${t} Frames pro Sekunde. Ohne deltaTime: ${a(t*e/3,2)}-fache Geschwindigkeit.`};return S.forEach((e,n)=>e.addEventListener(`click`,()=>B(t[n]))),x.addEventListener(`keydown`,e=>{let n=t.indexOf(z.sim.fps),r=e.key===`ArrowRight`||e.key===`ArrowUp`?1:e.key===`ArrowLeft`||e.key===`ArrowDown`?-1:0;r&&(e.preventDefault(),B(t[Math.max(0,Math.min(3,n+r))]))}),x.addEventListener(`pointerdown`,e=>{x.setPointerCapture(e.pointerId),x.classList.add(`drag`);let n=C.getBoundingClientRect(),r=e=>{let t=Math.atan2(e.clientX-(n.left+n.width/2),-(e.clientY-(n.top+n.height/2)))*180/Math.PI;return Math.max(-150,Math.min(150,t))},i=e=>x.style.transform=`rotate(${r(e)}deg)`,a=e=>{x.classList.remove(`drag`),x.removeEventListener(`pointermove`,i),x.removeEventListener(`pointerup`,a),x.removeEventListener(`pointercancel`,a);let n=r(e),o=0;Y.forEach((e,t)=>Math.abs(e-n)<Math.abs(Y[o]-n)&&(o=t)),B(t[o])};x.addEventListener(`pointermove`,i),x.addEventListener(`pointerup`,a),x.addEventListener(`pointercancel`,a)}),w.addEventListener(`click`,()=>z.spike()),E.addEventListener(`click`,()=>z.toggle()),D.addEventListener(`click`,()=>z.step()),T.addEventListener(`click`,()=>z.setSlow(!z.state.slow)),O.addEventListener(`click`,()=>{N=P=0,F.length=0,z.restart()}),{driver:z,applyStep(e){let t=u[Math.max(0,Math.min(u.length-1,e))];z.setSlow(!!t.slow),B(t.fps),t.spike&&z.spike(),z.play()},destroy(){z.destroy()}}}function Z(e,t=1){return`<g transform="scale(${t})">
    <circle r="40" fill="${e}" stroke="var(--line)" stroke-width="7"/>
    <circle cx="14" cy="-12" r="11" fill="#fff" stroke="var(--line)" stroke-width="3"/>
    <circle cx="14" cy="12" r="11" fill="#fff" stroke="var(--line)" stroke-width="3"/>
    <circle cx="19" cy="-12" r="5" fill="#2a2238"/>
    <circle cx="19" cy="12" r="5" fill="#2a2238"/>
  </g>`}var Q={id:`delta-time`,titel:`Frame, Update und deltaTime`,beschreibung:`Ein Spiel läuft in Frames: In jedem Frame ruft die Engine Update() auf. Zwei Würfel steigen nach oben, beide im selben Spiel. Der eine rechnet „pro Frame 0,05 weiter“ (transform.Translate(0, 0.05f, 0); ohne deltaTime), der andere „3 pro Sekunde mal deltaTime“ (transform.Translate(0, 3f * Time.deltaTime, 0); mit deltaTime). deltaTime ist die Zeit seit dem letzten Frame in Sekunden: bei 60 Frames pro Sekunde etwa 0,0167, bei 15 etwa 0,0667. Das Diagramm zeigt den Weg über der Zeit. Jeder Frame ist eine Stufe der Treppe und ein Strich auf der Frame-Leiste unter der Zeitachse; der Abstand zweier Striche ist deltaTime. Eine gestrichelte Linie zeigt das Soll: 3 Einheiten pro Sekunde. Bei 60 Frames pro Sekunde liegen beide Treppen auf dieser Linie. Bei 15 Frames pro Sekunde schafft der Würfel ohne deltaTime nur ein Viertel des Wegs (seine Treppe ist flacher), bei 144 Frames das 2,4-Fache (steiler). Der Würfel mit deltaTime bleibt bei jeder Bildrate auf der Linie: wenige Frames heißt große Stufen, viele Frames kleine. Ein Ruckler (ein Frame dauert eine halbe Sekunde) lässt den Würfel ohne deltaTime zurückfallen; der mit deltaTime springt in einer Stufe 1,5 Einheiten hoch und ist wieder auf der Linie. Merksatz: Ohne deltaTime gilt die Bewegung pro Frame, mit deltaTime pro Sekunde.`,begriffe:[`frame`,`update`,`deltatime`],hoehe:`56.25%`},le={wegzeit:O,schaltplan:H,messgeraet:te,spielzeug:ce},$=class extends HTMLElement{static observedAttributes=[`variante`,`data-step`];view=null;connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`figure`),this.hasAttribute(`aria-label`)||this.setAttribute(`aria-label`,`${Q.titel}. ${Q.beschreibung}`),this.mount()}disconnectedCallback(){this.view?.destroy(),this.view=null}attributeChangedCallback(e,t,n){this.isConnected&&t!==n&&(e===`variante`&&this.mount(),e===`data-step`&&n!=null&&this.view?.applyStep(Number(n)||0))}mount(){this.view?.destroy();let e=this.shadowRoot??this.attachShadow({mode:`open`}),t=le[this.getAttribute(`variante`)??``]??O;this.view=t(e,this);let n=Number(this.getAttribute(`fps`));[15,30,60,144].includes(n)&&this.view.driver.setFps(n);let r=this.getAttribute(`data-step`);r!=null&&this.view.applyStep(Number(r)||0)}};typeof customElements<`u`&&!customElements.get(`gec-delta-time`)&&customElements.define(`gec-delta-time`,$);export{$ as GecDeltaTime,Q as meta};