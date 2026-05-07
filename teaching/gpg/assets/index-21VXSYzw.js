(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();function je(t){const e=t.getContext("2d");t.width=t.clientWidth*devicePixelRatio,t.height=t.clientHeight*devicePixelRatio,e.scale(devicePixelRatio,devicePixelRatio);const o=t.clientWidth,n=t.clientHeight;let s=o/2-20,r=n/2-20;const p=5,f={},x=w=>{"wasd".includes(w.key.toLowerCase())&&(f[w.key.toLowerCase()]=w.type==="keydown",w.preventDefault())};window.addEventListener("keydown",x),window.addEventListener("keyup",x);let L;function _(){f.a&&(s-=p),f.d&&(s+=p),f.w&&(r-=p),f.s&&(r+=p),s=Math.max(0,Math.min(s,o-40)),r=Math.max(0,Math.min(r,n-40)),e.fillStyle="#0b0d10",e.fillRect(0,0,o,n),e.fillStyle="#ff6b35",e.fillRect(s,r,40,40),L=requestAnimationFrame(_)}return _(),()=>{cancelAnimationFrame(L),window.removeEventListener("keydown",x),window.removeEventListener("keyup",x)}}const F=1200,G=540,de=140,Z=G+de,Q=42,Y=54,Pe=7,Fe=8,Oe=.35,We=2.2,Ue=.5,qe=1.55,Ne=1.9,H=240,re=[[0,470,340,70],[420,470,200,70],[680,420,160,120],[880,350,100,190],[1040,470,160,70],[920,280,80,16]],De=`
.playground-wrap {
  width: min(100%, 1420px);
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: var(--s-4, 24px);
  align-items: stretch;
}
.playground-wrap .demo__canvas-wrap {
  width: 100%;
  height: auto;
  aspect-ratio: ${F} / ${Z};
  max-height: 640px;
}
.playground-ui {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
  background: var(--surface, #13161c);
  border: 2px solid var(--rule, #2a2f3a);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: 640px;
}
.pg-section { display: flex; flex-direction: column; gap: 8px; }
.pg-heading {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent, #ff6b35);
  border-bottom: 1px solid var(--rule, #2a2f3a);
  padding-bottom: 4px;
  margin-bottom: 2px;
}
.pg-toggle {
  display: grid;
  grid-template-columns: 16px 1fr;
  column-gap: 9px;
  row-gap: 1px;
  cursor: pointer;
  padding: 3px 2px;
  border-radius: 4px;
  transition: background 0.1s;
}
.pg-toggle:hover { background: rgba(255, 107, 53, 0.06); }
.pg-toggle input {
  margin: 3px 0 0 0;
  grid-row: 1 / span 2;
  align-self: start;
  accent-color: var(--accent, #ff6b35);
}
.pg-toggle__label {
  grid-column: 2;
  color: var(--ink);
  font-weight: 500;
  font-size: 12.5px;
}
.pg-toggle__desc {
  grid-column: 2;
  color: var(--muted, #8892a3);
  font-size: 10.5px;
  line-height: 1.3;
}
.pg-slider {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 8px;
  align-items: center;
  padding: 1px 0;
}
.pg-slider__label { font-size: 12px; color: var(--ink); }
.pg-slider__value {
  font-size: 11.5px;
  color: var(--accent, #ff6b35);
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 40px;
}
.pg-slider input[type=range] {
  grid-column: 1 / -1;
  width: 100%;
  accent-color: var(--accent, #ff6b35);
  margin: 2px 0 0 0;
}
.pg-stats {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-variant-numeric: tabular-nums;
  font-size: 12.5px;
}
.pg-stats dt {
  color: var(--muted, #8892a3);
  letter-spacing: 0.05em;
}
.pg-stats dd {
  margin: 0;
  color: var(--ink);
  text-align: right;
  font-weight: 600;
}
.pg-stats dd.accent { color: var(--accent, #ff6b35); }
.pg-stats dd.good   { color: #7fd1c8; }
.pg-stats dd.muted  { color: var(--muted, #8892a3); }

.pg-footer {
  margin-top: auto;
  border-top: 1px solid var(--rule, #2a2f3a);
  padding-top: 10px;
  gap: 8px;
}
.pg-reset {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--accent, #ff6b35);
  color: #0b0d10;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
}
.pg-reset:hover  { filter: brightness(1.1); }
.pg-reset:active { transform: translateY(1px); }
.pg-keys {
  font-size: 10px;
  color: var(--muted, #8892a3);
  letter-spacing: 0.03em;
  line-height: 1.55;
}
`;function Ye(){if(document.getElementById("mario-jump-styles"))return;const t=document.createElement("style");t.id="mario-jump-styles",t.textContent=De,document.head.appendChild(t)}function He(t){Ye();const e=t.getContext("2d"),o=Math.max(1,Math.min(3,window.devicePixelRatio||1));let n=0,s=0;function r(){const a=t.getBoundingClientRect();a.width<1||a.height<1||(n=a.width,s=a.height,t.width=Math.round(n*o),t.height=Math.round(s*o))}const p=new ResizeObserver(r);p.observe(t),r();const f=new Image;f.src="img/claude-sprite.png";let x=!1;f.onload=()=>{x=!0};const L=new Image;L.src="img/playground-backdrop.png";let _=!1;L.onload=()=>{_=!0};const w={gravity:.65,jumpStrength:13.5,moveSpeed:5,airControl:1,realisticMode:!1,variableJump:!0,coyoteTime:!0,jumpBuffer:!0,apexHang:!0,asymmetricGravity:!0,fastFall:!0},k={...w},j=["variableJump","coyoteTime","jumpBuffer","apexHang","asymmetricGravity","fastFall"],i={x:80,y:470-Y,vx:0,vy:0,facing:1,squash:1},l={onGround:!1,coyote:0,buffer:0,currentGravity:w.gravity,jumpPressedThisFrame:!1,releasedJumpInRise:!1},A={vy:new Float32Array(H),ay:new Float32Array(H),y:new Float32Array(H),head:0};function c(){A.vy[A.head]=i.vy,A.ay[A.head]=l.currentGravity,A.y[A.head]=i.y,A.head=(A.head+1)%H}function m(){i.x=80,i.y=470-Y,i.vx=0,i.vy=0,i.facing=1,i.squash=1,l.onGround=!1,l.coyote=0,l.buffer=0,l.releasedJumpInRise=!1,A.vy.fill(0),A.ay.fill(0),A.y.fill(i.y),A.head=0}const u={left:!1,right:!1,jump:!1,down:!1},C={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"jump",w:"jump"," ":"jump",arrowdown:"down",s:"down"};let b=!1;function W(a){if(!b)return;const y=a.key.toLowerCase();if(y==="r"&&a.type==="keydown"){m(),a.preventDefault(),a.stopImmediatePropagation();return}const g=C[y];if(!g)return;const T=a.type==="keydown";g==="jump"&&(T&&!u.jump&&(l.jumpPressedThisFrame=!0),!T&&u.jump&&i.vy<0&&(l.releasedJumpInRise=!0)),u[g]=T,a.preventDefault(),a.stopImmediatePropagation()}window.addEventListener("keydown",W,!0),window.addEventListener("keyup",W,!0),t.setAttribute("tabindex","0"),t.style.outline="none";const z=()=>{b=!0,t.style.boxShadow="inset 0 0 0 2px rgba(255,107,53,0.6)"},q=()=>{b=!1,t.style.boxShadow="",u.left=u.right=u.jump=u.down=!1};t.addEventListener("focus",z),t.addEventListener("blur",q);const X=()=>t.focus();t.addEventListener("pointerdown",X);function N(a,y,g){return`<label class="pg-toggle">
      <input type="checkbox" data-cfg="${a}" ${w[a]?"checked":""} />
      <span class="pg-toggle__label">${y}</span>
      <span class="pg-toggle__desc">${g}</span>
    </label>`}function K(a,y,g,T,$,I=S=>S.toFixed(2)){return`<label class="pg-slider">
      <span class="pg-slider__label">${$}</span>
      <span class="pg-slider__value" data-for="${a}">${I(w[a])}</span>
      <input type="range" data-cfg="${a}" min="${y}" max="${g}" step="${T}" value="${w[a]}" />
    </label>`}const M=document.createElement("div");M.className="playground-ui",M.innerHTML=`
    <div class="pg-section">
      <div class="pg-heading">Tricks</div>
      ${N("realisticMode","Realistic (no tricks)","Pure parabolic physics. Try this first — feel how committed it is.")}
      ${N("variableJump","Variable jump height","Release jump early → shorter jump.")}
      ${N("coyoteTime","Coyote time","Jump within ~7 frames of leaving a ledge.")}
      ${N("jumpBuffer","Jump buffer","Press jump ~8 frames before landing → still fires.")}
      ${N("apexHang","Apex hangtime","Near the peak, gravity halves. Floaty, controllable.")}
      ${N("asymmetricGravity","Asymmetric gravity","Falls faster than it rises. Snappy.")}
      ${N("fastFall","Fast fall","Hold ↓ or S in air → accelerates down.")}
    </div>
    <div class="pg-section">
      <div class="pg-heading">Tuning</div>
      ${K("gravity",.1,2,.05,"Gravity")}
      ${K("jumpStrength",5,22,.5,"Jump strength",a=>a.toFixed(1))}
      ${K("moveSpeed",1,10,.5,"Move speed",a=>a.toFixed(1))}
      ${K("airControl",0,1,.05,"Air control")}
    </div>
    <div class="pg-section">
      <div class="pg-heading">Live state</div>
      <dl class="pg-stats">
        <dt>vx</dt>     <dd class="accent" data-stat="vx">+0.00</dd>
        <dt>vy</dt>     <dd class="accent" data-stat="vy">+0.00</dd>
        <dt>ay</dt>     <dd class="accent" data-stat="ay">+0.65</dd>
        <dt>on ground</dt> <dd class="muted" data-stat="ground">no</dd>
        <dt>coyote</dt> <dd class="muted" data-stat="coyote">0</dd>
        <dt>buffer</dt> <dd class="muted" data-stat="buffer">0</dd>
      </dl>
    </div>
    <div class="pg-section pg-footer">
      <button class="pg-reset" type="button">Reset (R)</button>
      <div class="pg-keys">A/D or ←/→ · Space to jump · ↓ fast-fall · click canvas to focus</div>
    </div>
  `;const D={vx:M.querySelector("[data-stat=vx]"),vy:M.querySelector("[data-stat=vy]"),ay:M.querySelector("[data-stat=ay]"),ground:M.querySelector("[data-stat=ground]"),coyote:M.querySelector("[data-stat=coyote]"),buffer:M.querySelector("[data-stat=buffer]")};M.querySelectorAll("input[data-cfg]").forEach(a=>{a.addEventListener("input",()=>{const y=a.dataset.cfg;if(a.type==="checkbox"){if(k[y]=a.checked,y==="realisticMode"&&a.checked&&j.forEach(g=>{k[g]=!1;const T=M.querySelector(`input[data-cfg="${g}"]`);T&&(T.checked=!1)}),j.includes(y)&&a.checked&&k.realisticMode){k.realisticMode=!1;const g=M.querySelector('input[data-cfg="realisticMode"]');g&&(g.checked=!1)}}else{const g=parseFloat(a.value);k[y]=g;const T=M.querySelector(`.pg-slider__value[data-for="${y}"]`);T&&(T.textContent=Number.isInteger(g*2)?g.toFixed(1):g.toFixed(2))}})}),M.querySelector(".pg-reset").addEventListener("click",m);const ee=t.closest(".demo__split");ee.classList.add("playground-wrap"),ee.appendChild(M);function pe(a,y,g,T,$,I,S,v){return a<$+S&&a+g>$&&y<I+v&&y+T>I}function ae(a,y,g){return a+(y-a)*g}function _e(a){let y=0;u.left&&(y-=k.moveSpeed),u.right&&(y+=k.moveSpeed);const g=l.onGround?1:k.airControl;i.vx=ae(i.vx,y,Math.min(1,.3*g*a)),Math.abs(y)>.2&&(i.facing=Math.sign(y)),l.jumpPressedThisFrame&&(l.buffer=k.jumpBuffer?Fe:1),l.buffer=Math.max(0,l.buffer-a);const T=l.onGround||k.coyoteTime&&l.coyote>0;l.buffer>0&&T&&(i.vy=-k.jumpStrength,l.buffer=0,l.coyote=0,l.onGround=!1,l.releasedJumpInRise=!1,i.squash=1.2),k.variableJump&&l.releasedJumpInRise&&i.vy<0&&(i.vy*=Oe,l.releasedJumpInRise=!1),u.jump||(l.releasedJumpInRise=!1);let $=k.gravity;const I=!k.realisticMode;I&&k.apexHang&&Math.abs(i.vy)<We&&($*=Ue),I&&k.asymmetricGravity&&i.vy>0&&($*=qe),I&&k.fastFall&&u.down&&i.vy>0&&($*=Ne),l.currentGravity=$,i.vy+=$*a,i.vy>18&&(i.vy=18),i.x+=i.vx*a;for(const[v,R,E,U]of re)pe(i.x,i.y,Q,Y,v,R,E,U)&&(i.vx>0?i.x=v-Q:i.vx<0&&(i.x=v+E),i.vx=0);const S=l.onGround;l.onGround=!1,i.y+=i.vy*a;for(const[v,R,E,U]of re)if(pe(i.x,i.y,Q,Y,v,R,E,U)){if(i.vy>0){if(i.y=R-Y,l.onGround=!0,!S){const J=Math.min(1,i.vy/16);i.squash=ae(1,.7,J)}}else i.vy<0&&(i.y=R+U);i.vy=0}S&&!l.onGround&&i.vy>=0?l.coyote=Pe:l.coyote>0&&!l.onGround?l.coyote=Math.max(0,l.coyote-a):l.onGround&&(l.coyote=0),i.squash=ae(i.squash,1,Math.min(1,.2*a)),(i.y>G+200||i.x<-300||i.x>F+300)&&m(),l.jumpPressedThisFrame=!1,c()}let ke=0;function xe(){if(++ke%4!==0)return;const a=y=>y>=0?"+":"";D.vx.textContent=`${a(i.vx)}${i.vx.toFixed(2)}`,D.vy.textContent=`${a(i.vy)}${i.vy.toFixed(2)}`,D.ay.textContent=`${a(l.currentGravity)}${l.currentGravity.toFixed(2)}`,D.ground.textContent=l.onGround?"yes":"no",D.ground.className=l.onGround?"good":"muted",D.coyote.textContent=l.coyote.toFixed(0),D.coyote.className=l.coyote>0?"accent":"muted",D.buffer.textContent=l.buffer.toFixed(0),D.buffer.className=l.buffer>0?"accent":"muted"}function Te(){if(_){const S=L.width/L.height,v=F/G;let R,E,U,J;S>v?(E=G,R=E*S,U=(F-R)/2,J=0):(R=F,E=R/S,U=0,J=(G-E)/2),e.drawImage(L,U,J,R,E)}else{const S=e.createLinearGradient(0,0,0,G);S.addColorStop(0,"#0b0d10"),S.addColorStop(1,"#2a1f1a"),e.fillStyle=S,e.fillRect(0,0,F,G)}for(const[S,v,R,E]of re)e.fillStyle="#b78363",e.fillRect(S,v,R,E),e.fillStyle="#f1c591",e.fillRect(S,v,R,5),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(S+R-3,v,3,E),e.fillStyle="#8a5a3a",e.fillRect(S,v+5,R,2);e.save();const a=i.x+Q/2,y=i.y+Y;e.translate(a,y);let g=i.squash,T=1/i.squash;if(!l.onGround){const S=Math.max(-.15,Math.min(.22,-i.vy/80));g*=1+S,T*=1-S*.6}e.scale(T*i.facing,g);const $=Q*2,I=Y*2;x?e.drawImage(f,-$/2,-I*.92,$,I):(e.fillStyle="#d97757",e.fillRect(-Q/2,-Y,Q,Y)),e.restore()}function Ae(){const a=G,y=12,g=3,T=12,$=(F-y*2-T*(g-1))/g,I=de-y*2;e.fillStyle="rgba(11, 13, 16, 0.85)",e.fillRect(0,a,F,de),e.fillStyle="rgba(255,255,255,0.06)",e.fillRect(0,a,F,1),[{label:"y (position)",data:A.y,color:"#6fb3d2",min:0,max:G,invert:!0,zeroLine:!1},{label:"vy (velocity)",data:A.vy,color:"#ff6b35",min:-22,max:22,invert:!1,zeroLine:!0},{label:"ay (accel/grav)",data:A.ay,color:"#98c379",min:0,max:3,invert:!1,zeroLine:!1}].forEach((v,R)=>{const E=y+R*($+T);if(e.fillStyle="rgba(255,255,255,0.04)",e.fillRect(E,a+y,$,I),e.font="12px ui-monospace, monospace",e.textBaseline="top",e.fillStyle="rgba(255,255,255,0.55)",e.fillText(v.label,E+8,a+y+6),v.zeroLine){const V=a+y+I*((0-v.min)/(v.max-v.min));e.fillStyle="rgba(255,255,255,0.15)",e.fillRect(E,V,$,1)}e.strokeStyle=v.color,e.lineWidth=1.5,e.beginPath();for(let V=0;V<H;V++){const Le=(A.head+V)%H,Ie=v.data[Le],Ce=V/(H-1),me=Math.max(0,Math.min(1,(Ie-v.min)/(v.max-v.min))),Me=v.invert?me:1-me,ge=E+Ce*$,be=a+y+Me*I;V===0?e.moveTo(ge,be):e.lineTo(ge,be)}e.stroke();const U=(A.head-1+H)%H,J=v.data[U],ye=Math.max(0,Math.min(1,(J-v.min)/(v.max-v.min))),$e=v.invert?ye:1-ye,Ee=E+$-1,Re=a+y+$e*I;e.fillStyle=v.color,e.beginPath(),e.arc(Ee,Re,3,0,Math.PI*2),e.fill()})}function Se(){if(n<1||s<1)return;e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,t.width,t.height);const a=Math.min(n/F,s/Z),y=(n-F*a)/2,g=(s-Z*a)/2,T=a*o;e.setTransform(T,0,0,T,y*o,g*o),e.imageSmoothingEnabled=!1,Te(),Ae(),b||(e.fillStyle="rgba(0,0,0,0.45)",e.fillRect(0,0,F,Z),e.fillStyle="#ffe6d4",e.font="bold 28px ui-monospace, monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("click to play",F/2,Z/2),e.textAlign="start")}let se,he=performance.now();function ue(a){const y=Math.min(40,a-he);he=a;const g=y/(1e3/60);_e(g),xe(),Se(),se=requestAnimationFrame(ue)}return se=requestAnimationFrame(ue),()=>{cancelAnimationFrame(se),window.removeEventListener("keydown",W,!0),window.removeEventListener("keyup",W,!0),t.removeEventListener("focus",z),t.removeEventListener("blur",q),t.removeEventListener("pointerdown",X),p.disconnect(),M.remove(),ee&&ee.classList.remove("playground-wrap"),t.style.boxShadow=""}}const Ge={"moving-square":je,"mario-jump":He};let te=null;function Be(t){if(te&&(te(),te=null),!t)return;const e=t.querySelector(".demo__canvas"),o=t.getAttribute("data-demo");if(!e||!o)return;const n=Ge[o];if(!n){console.warn(`[demo] unknown demo: ${o}`);return}te=n(e)||null}let ne=null;function ze(t){if(ne&&(ne(),ne=null),!(t!=null&&t.hasAttribute("data-interactive-code")))return;const e=t.querySelector(".icode");if(!e)return;const o=[...t.querySelectorAll(".icode__line[data-region]")],n=[...t.querySelectorAll(".icode__ann[data-region]")],s=[...t.querySelectorAll(".icode-tip")],r=[...new Set(o.map(c=>c.dataset.region).filter(Boolean))],p=new Set;let f=null,x=null,L=!1,_=null;function w(){const c=f!==null;e.classList.toggle("icode--has-active",c),e.classList.toggle("icode--has-revealed",p.size>0);for(const m of o){const u=m.dataset.region;u&&(m.classList.toggle("icode__line--active",u===f),m.classList.toggle("icode__line--revealed",p.has(u)))}for(const m of n){const u=m.dataset.region;m.classList.toggle("icode__ann--active",u===f),m.classList.toggle("icode__ann--revealed",p.has(u))}}function k(){L||p.size>=r.length&&(L=!0,e.classList.add("icode--complete"),setTimeout(()=>e.classList.remove("icode--complete"),900))}w();function j(c){var m,u;if(!((m=c.target)!=null&&m.isContentEditable||/input|textarea/i.test((u=c.target)==null?void 0:u.tagName))){if(c.key>="1"&&c.key<="9"){const C=parseInt(c.key)-1;if(C>=r.length)return;c.preventDefault();const b=r[C];f===b?(f=null,x=null):(p.add(b),f=b,x=b,k()),w();return}if(c.key==="0"||c.key==="Escape"){(f||x)&&(c.preventDefault(),f=null,x=null,w());return}}}addEventListener("keydown",j);const i=[];for(const c of o){const m=c.dataset.region;if(!m)continue;const u=()=>{!x&&p.has(m)&&(f=m,w())},C=()=>{x||(f=null,w())};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),i.push({el:c,events:{mouseenter:u,mouseleave:C}})}for(const c of n){const m=c.dataset.region,u=()=>{!x&&p.has(m)&&(f=m,w())},C=()=>{x||(f=null,w())},b=()=>{x===m?(x=null,f=null):(p.add(m),x=m,f=m,k()),w()};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),c.addEventListener("click",b),i.push({el:c,events:{mouseenter:u,mouseleave:C,click:b}})}function l(c){A();const m=c.dataset.tipSig||"",u=c.dataset.tipDesc||"",C=c.dataset.tipUrl||"";if(!m&&!u)return;const b=document.createElement("div");b.className="icode-tooltip",b.innerHTML=[m?`<code class="icode-tooltip__sig">${le(m)}</code>`:"",u?`<div class="icode-tooltip__desc">${le(u)}</div>`:"",C?`<a class="icode-tooltip__link" href="${le(C)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),e.appendChild(b),e.style.position="relative";let W=0,z=0,q=c;for(;q&&q!==e;)W+=q.offsetTop,z+=q.offsetLeft,q=q.offsetParent;b.style.left=Math.max(0,z)+"px",b.style.visibility="hidden";const X=b.offsetHeight,N=b.offsetWidth;W-X-10<0?(b.style.top=W+c.offsetHeight+8+"px",b.classList.add("icode-tooltip--below")):b.style.top=W-X-8+"px";const K=e.offsetWidth-N-8;parseInt(b.style.left)>K&&(b.style.left=Math.max(0,K)+"px"),b.style.visibility="",_=b}function A(){_&&(_.remove(),_=null)}for(const c of s){const m=()=>l(c),u=()=>A();c.addEventListener("mouseenter",m),c.addEventListener("mouseleave",u),i.push({el:c,events:{mouseenter:m,mouseleave:u}})}ne=()=>{removeEventListener("keydown",j);for(const c of i)for(const[m,u]of Object.entries(c.events))c.el.removeEventListener(m,u);A(),f=null,x=null,e.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const c of o)c.classList.remove("icode__line--active","icode__line--revealed");for(const c of n)c.classList.remove("icode__ann--active","icode__ann--revealed")}}function le(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ke=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",Ke);class Je extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const e=document.createElement("div");for(e.className="deck__stage";this.firstChild;)e.appendChild(this.firstChild);this.appendChild(e),this._stage=e,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",o=>this._onKey(o)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const o=new URLSearchParams(location.search).get("unit");let n=Array.from(this._stage.querySelectorAll(".slide"));o&&(n=n.filter(s=>s.getAttribute("data-unit")===o),this._stage.querySelectorAll(".slide").forEach(s=>{n.includes(s)||s.remove()})),this._slides=n}_buildFooter(){const e=document.createElement("div");e.className="deck__footer",e.innerHTML=`
      <div class="deck__footer__tag"></div>
      <div class="deck__footer__progress"><div class="deck__footer__progress__bar"></div></div>
      <div class="deck__footer__num"></div>
    `,document.body.appendChild(e),this._footer=e,this._fTag=e.querySelector(".deck__footer__tag"),this._fNum=e.querySelector(".deck__footer__num"),this._progress=e.querySelector(".deck__footer__progress__bar")}_buildHelp(){const e=document.createElement("div");e.className="deck__help",e.innerHTML=`
      <table>
        <tr><td><kbd>→</kbd> <kbd>Space</kbd></td><td>Next slide</td></tr>
        <tr><td><kbd>←</kbd></td><td>Previous slide</td></tr>
        <tr><td><kbd>Home</kbd></td><td>First slide</td></tr>
        <tr><td><kbd>End</kbd></td><td>Last slide</td></tr>
        <tr><td><kbd>F</kbd></td><td>Fullscreen</td></tr>
        <tr><td><kbd>T</kbd></td><td>Toggle light / dark</td></tr>
        <tr><td><kbd>Ctrl+Shift+E</kbd></td><td>Toggle edit mode (dev only)</td></tr>
        <tr><td><kbd>?</kbd></td><td>Toggle this help</td></tr>
      </table>
    `,document.body.appendChild(e),this._help=e}_readHashIndex(){var n;const e=location.hash.match(/^#(\d+)/);if(!e)return 0;const o=parseInt(e[1],10)-1;return Math.max(0,Math.min(o,(((n=this._slides)==null?void 0:n.length)||1)-1))}_show(e){if(!this._slides.length||e<0||e>=this._slides.length)return;this._index=e;const o=this._slides.length;this._slides.forEach((L,_)=>{_===e?L.setAttribute("data-active",""):L.removeAttribute("data-active")});const n=this._slides[e],s=n.getAttribute("data-unit")||"",r=n.getAttribute("data-tag")||"",p=n.getAttribute("data-total")||"12",f=[];s&&f.push(`UNIT ${s} / ${p}`),r&&f.push(r);const x=f.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=x),this._fNum&&(this._fNum.textContent=`${String(e+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(e+1)/o*100}%`),location.hash!==`#${e+1}`&&history.replaceState(null,"",`#${e+1}`),Be(n),ze(n),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:e,slide:n}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(e){if(!(e.target&&e.target.isContentEditable)&&!(e.target&&/input|textarea/i.test(e.target.tagName))){if(e.ctrlKey&&e.shiftKey&&(e.key==="E"||e.key==="e")){e.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(e.key){case"ArrowRight":case" ":case"PageDown":e.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":e.preventDefault(),this._prev();break;case"Home":e.preventDefault(),this._show(0);break;case"End":e.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":e.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const o=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("deck-theme",o)}_scale(){const e=innerWidth,o=innerHeight,n=Math.min(e/1920,o/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${n})`}}customElements.get("deck-root")||customElements.define("deck-root",Je);const Ve=["B","I","EM","STRONG","BR"],Qe=new Set(Ve),Xe=new Set(["BR"]);function d(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function B(t){if(t==null)return"";const e=document.createElement("template");return e.innerHTML=String(t),ce(e.content)}function ce(t){let e="";for(const o of t.childNodes)if(o.nodeType===Node.TEXT_NODE)e+=d(o.nodeValue);else if(o.nodeType===Node.ELEMENT_NODE){const n=o.tagName;if(Qe.has(n)){const s=n.toLowerCase();Xe.has(n)?e+=`<${s}>`:e+=`<${s}>${ce(o)}</${s}>`}else e+=ce(o)}return e}const Ze=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),et=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),fe=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function P(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function oe(t){if(t==null)return"";let e="",o=0,n=null,s;for(fe.lastIndex=0;(s=fe.exec(t))!==null;){if(s.index>o){const p=t.slice(o,s.index);e+=P(p),/\S/.test(p)&&(n=null)}const r=s.groups;if(r.comment)e+=`<span class="tok-comment">${P(r.comment)}</span>`,n=null;else if(r.tstring)e+=`<span class="tok-string">${P(r.tstring)}</span>`,n=null;else if(r.fstring)e+=`<span class="tok-string">${P(r.fstring)}</span>`,n=null;else if(r.string)e+=`<span class="tok-string">${P(r.string)}</span>`,n=null;else if(r.decorator)e+=`<span class="tok-decorator">${P(r.decorator)}</span>`,n=null;else if(r.number)e+=`<span class="tok-number">${P(r.number)}</span>`,n=null;else if(r.word){const p=r.word;n==="function"?(e+=`<span class="tok-function-def">${P(p)}</span>`,n=null):n==="class"?(e+=`<span class="tok-class-def">${P(p)}</span>`,n=null):Ze.has(p)?(e+=`<span class="tok-keyword">${P(p)}</span>`,p==="def"?n="function":p==="class"?n="class":n=null):et.has(p)?(e+=`<span class="tok-builtin">${P(p)}</span>`,n=null):(e+=P(p),n=null)}o=s.index+s[0].length}return o<t.length&&(e+=P(t.slice(o))),e}function ve(t){const e=(t||"").split(`
`).length;return e>=20?"xs":e>=14?"sm":e>=10?"md":"lg"}function tt(t,e){return e.map(o=>nt(o,t)).join(`
`)}function nt(t,e){const o=ot[t.type];return o?o(t,e):`<div class="slide"><div class="slide__body">Unknown slide type: ${d(t.type)}</div></div>`}function h(t,e,o){return`data-edit="${t}/${e}/${o}"`}function ie(t,e,o){return`data-edit-list="${t}/${e}/${o}"`}function O(t,e,o="",n=""){return`<div class="slide ${o}" data-slide-type="${d(t.type)}" data-edit-slide="${d(e.id)}/${d(t.id)}" data-unit="${d(e.id)}" data-tag="${d(e.tag||"")}" data-total="${d(e.total||"")}"${n?" "+n:""}>`}const ot={section(t,e){return`${O(t,e,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${h(e.id,t.id,"kicker")}>${d(t.kicker||"Unit")}</span>
            <span ${h(e.id,t.id,"number")}>${d(t.number||"")}</span>
          </div>
          <h2 class="section__title" ${h(e.id,t.id,"title")}>${d(t.title||"")}</h2>
        </div>
      </div>
    </div>`},title(t,e){return`${O(t,e,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${h(e.id,t.id,"title")}>${d(t.title||"")}</h1>
          <div class="title-slide__subtitle" ${h(e.id,t.id,"subtitle")}>${d(t.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(t,e){const o=(t.items||[]).map((n,s)=>`<li ${h(e.id,t.id,`items[${s}]`)}>${B(n)}</li>`).join("");return`${O(t,e,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${h(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          ${t.lead?`<p class="bullets__lead" ${h(e.id,t.id,"lead")}>${B(t.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${h(e.id,t.id,"lead")}></p>`}
          <ul class="bullets__list" ${ie(e.id,t.id,"items")}>${o}</ul>
        </div>
      </div>
    </div>`},question(t,e){return`${O(t,e,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${h(e.id,t.id,"question")}>${d(t.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(t,e){const o=n=>{const s=t[n]||{title:"",items:[]},r=(s.items||[]).map((p,f)=>`<li ${h(e.id,t.id,`${n}.items[${f}]`)}>${B(p)}</li>`).join("");return`<div class="split__col">
        <h3 ${h(e.id,t.id,`${n}.title`)}>${d(s.title||"")}</h3>
        <ul ${ie(e.id,t.id,`${n}.items`)}>${r}</ul>
      </div>`};return`${O(t,e,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${h(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <div class="split__cols">
            ${o("left")}
            ${o("right")}
          </div>
        </div>
      </div>
    </div>`},prose(t,e){return`${O(t,e,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${t.eyebrow?`<div class="prose__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="prose__eyebrow" ${h(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="prose__heading" ${h(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <p class="prose__body" ${h(e.id,t.id,"body")}>${B(t.body||"")}</p>
        </div>
      </div>
    </div>`},image(t,e){const o=t.fit==="contain"?"contain":"cover",n=d(t.src||""),s=d(t.alt||"");return`${O(t,e,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${o}">
          <img src="${n}" alt="${s}" />
          ${t.caption?`<div class="image-slide__caption" ${h(e.id,t.id,"caption")}>${B(t.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${h(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(t,e){const o=d(t.demo||""),n=!!t.code,s=n?oe(t.code):"",r=n?t.code.split(`
`).length:0;return`${O(t,e,`slide--demo${n?" slide--demo-with-code":""}`,`data-demo="${o}"`)}
      <div class="slide__body">
        <div class="demo">
          ${t.eyebrow?`<div class="demo__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="demo__heading" ${h(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${t.hint?`<div class="demo__hint" ${h(e.id,t.id,"hint")}>${d(t.hint)}</div>`:""}
            </div>
            ${n?`<div class="demo__code-side">
              <div class="demo__line-count">${r} lines</div>
              <pre class="demo__code"><code ${h(e.id,t.id,"code")}>${s}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(t,e){const o=(t.language||"python").toLowerCase(),n=o==="python"?oe(t.code||""):d(t.code||""),s=ve(t.code||"");return`${O(t,e,`slide--code slide--code-${s}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${t.eyebrow?`<div class="code-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="code-slide__heading" ${h(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:`<h2 class="code-slide__heading" ${h(e.id,t.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${d(o)}"><code ${h(e.id,t.id,"code")}>${n}</code></pre>
          ${t.caption?`<div class="code-slide__caption" ${h(e.id,t.id,"caption")}>${B(t.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${h(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(t,e){const o=t.regions||[],n=t.tooltips||{},s=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,r={};for(const _ of o)for(let w=_.lines[0];w<=_.lines[1];w++)r[w]=_;const p=Object.keys(n).sort((_,w)=>w.length-_.length),x=(t.code||"").split(`
`).map((_,w)=>{const k=w+1,j=r[k];let i=oe(_)||" ";for(const u of p){const C=u.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=n[u],z=typeof b=="object"?`data-tip-sig="${d(b.sig||"")}" data-tip-desc="${d(b.desc||"")}" data-tip-url="${d(b.url||"")}"`:`data-tip-sig="" data-tip-desc="${d(b)}" data-tip-url=""`;i=i.replace(new RegExp(C),`<span class="icode-tip" ${z}>${u}</span>`)}const l=j?j.id:"",A=j?j.color:"transparent";return`<div class="${`icode__line${s.test(_)?" icode__line--divider":""}`}" data-region="${l}" data-line="${k}" style="--rc:${A}"><span class="icode__line-num">${k}</span>${i}</div>`}).join(""),L=o.map((_,w)=>{const k=(_.links||[]).map(j=>`<a href="${d(j.url)}" target="_blank" rel="noopener">→ ${d(j.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${d(_.id)}" style="--rc:${d(_.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${d(_.label)}</div>
            <div class="icode__ann-key">${w+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${d(_.description)}</div>
            <div class="icode__ann-detail">${d(_.detail||"")}${k?`<div class="icode__ann-links">${k}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${O(t,e,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${t.heading?`<h2 class="icode__heading" ${h(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${o.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${x}</pre>
            <div class="icode__annotations">${L}</div>
          </div>
          ${t.subtitle?`<div class="icode__subtitle" ${h(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(t,e){const o=oe(t.code||""),n=ve(t.code||""),s=(t.annotations||[]).map((r,p)=>`<li ${h(e.id,t.id,`annotations[${p}]`)}>${B(r)}</li>`).join("");return`${O(t,e,`slide--annotated-code slide--acode-${n}`)}
      <div class="slide__body">
        <div class="acode">
          ${t.eyebrow?`<div class="acode__eyebrow" ${h(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="acode__heading" ${h(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${h(e.id,t.id,"code")}>${o}</code></pre>
            <ol class="acode__annotations" ${ie(e.id,t.id,"annotations")}>${s}</ol>
          </div>
          ${t.subtitle?`<div class="acode__subtitle" ${h(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(t,e){const o=(t.items||[]).map((n,s)=>`<li ${h(e.id,t.id,`items[${s}]`)}>${B(n)}</li>`).join("");return`${O(t,e,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${h(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <ol class="live__list" ${ie(e.id,t.id,"items")}>${o}</ol>
        </div>
      </div>
    </div>`}},it={id:"01",number:"01",tag:"OPENING THE BOX",total:"12"},at=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"Opening the Box"},{id:"welcome",type:"title",eyebrow:"Game Programmierung  ·  SS26",title:"Welcome.",subtitle:"Twelve weeks to build a real game without an engine. Let's take a look under the hood."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your laptop</b> — Python, Git, and your codebase. Every session.","<b>Short input, long workshop.</b>","<b>Find a partner / rubberduck.</b>","<b>Four exercises.</b> Mandatory part of your grade.","<b>Ask early.</b>"]},{id:"why-question",type:"question",eyebrow:"Question for the room",question:"Why would anyone write a game without an engine"},{id:"why-answer",type:"image",src:"/img/shoggoth.avif",alt:"The Shoggoth — a lovecraftian mass of eyes and tentacles",caption:"To understand the Shoggoth.",fit:"contain"},{id:"today",type:"demo",eyebrow:"TODAY",heading:"A program where you move a shape when you press a button.",demo:"moving-square",hint:"WASD to move",code:`import pygame
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
x, y = 400, 300

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:  x -= 5
    if keys[pygame.K_RIGHT]: x += 5
    if keys[pygame.K_UP]:    y -= 5
    if keys[pygame.K_DOWN]:  y += 5

    screen.fill((11, 13, 16))
    pygame.draw.rect(screen, (255, 107, 53), (x, y, 40, 40))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`},{id:"ide-choice",type:"split",heading:"Pick an editor — VS Code or Cursor",left:{title:"VS Code",items:["Free, ubiquitous, Microsoft-backed","GitHub Copilot included free with GitHub Education (.edu email)","What most studios use","Today's live demo runs in this"]},right:{title:"Cursor",items:["VS Code plus an AI front-and-center","Slightly slicker, free tier exists","What I use day-to-day","If you have it open instead, you're fine"]}},{id:"llm-policy",type:"prose",eyebrow:"A Young Lady's Illustrated Primer",body:"<b>1.</b>  AI is the best tool ever invented for learning.<br><br><b>2.</b>  AI is the best tool ever invented for <i>not</i> learning.<br><br><b>3.</b>  Which way, modern man?<br><br><i>— Zvi Mowshowitz</i>"},{id:"your-tools",type:"interactive-code",heading:"Two tools. That's the whole stack.",subtitle:"Python runs your code. uv manages everything else.",code:`# ---- the language ----
python --version
# → Python 3.13.x

# ---- the package manager ----
# Windows (PowerShell):
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
# Mac / Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# ---- verify ----
# Close your terminal. Open a new one.
python --version        # → 3.13.x
uv --version            # → 0.x.x`,regions:[{id:"language",label:"the language",lines:[1,3],color:"#ff6b35",description:"Python runs your code. Install 3.13 or newer.",detail:"Python is an interpreter — it reads your .py files line by line and executes them. Download from python.org/downloads. On Windows, tick 'Add Python to PATH' during installation; without this, your terminal can't find the python command. On Mac and Linux, the installer handles PATH automatically.",links:[{label:"python.org/downloads",url:"https://www.python.org/downloads/"}]},{id:"packager",label:"the package manager",lines:[5,9],color:"#7fd1c8",description:"uv creates isolated project environments and installs libraries.",detail:"Before uv, Python packaging was fragmented across pip, virtualenv, pyenv, poetry, and conda — five tools doing overlapping jobs. uv replaces all of them. It creates a .venv folder per project so libraries are isolated, downloads the right Python version automatically, and resolves dependencies in seconds. Written in Rust by the team behind ruff.",links:[{label:"astral.sh/uv",url:"https://docs.astral.sh/uv/"}]},{id:"verify",label:"verify",lines:[11,14],color:"#98c379",description:"Close your terminal, open a fresh one, check both tools.",detail:"Installers modify your system PATH — the list of folders your terminal searches for commands. But a terminal session only reads PATH once, when it opens. So after installing uv, your current terminal still doesn't know it exists. Close it, open a new one, and both commands should work. If python --version fails on Windows, you missed the PATH checkbox during installation."}],tooltips:{python:{sig:"python --version",desc:"The Python interpreter. Reads .py files and executes them. The --version flag prints which version is installed without running any code.",url:"https://www.python.org/"},uv:{sig:"uv <command>",desc:"A Python package manager and project tool. Handles virtual environments, dependency resolution, and Python version management in one command.",url:"https://docs.astral.sh/uv/"}}},{id:"your-project",type:"interactive-code",heading:"You just built a dev environment.",subtitle:"Three commands created an isolated project with pygame-ce installed and ready to run.",code:`# ---- create ----
uv init hello-pygame
cd hello-pygame
uv add pygame-ce

# ---- what's inside ----
# hello-pygame/
# ├── .venv/            ← private Python + libraries
# ├── .python-version   ← pins Python 3.13
# ├── main.py           ← your code goes here
# ├── pyproject.toml    ← project manifest
# └── uv.lock           ← locked dependency versions

# ---- open and run ----
code .
uv run main.py
# → Hello, world!`,regions:[{id:"create",label:"create",lines:[1,4],color:"#ff6b35",description:"Three commands. You now have a project with pygame-ce.",detail:"uv init scaffolds a new Python project in its own folder: a pyproject.toml, a .python-version, a main.py, and a README. cd moves your terminal into it. uv add pygame-ce downloads the pygame Community Edition library, creates a .venv folder, installs pygame-ce inside it, and records the dependency in pyproject.toml. From now on, anyone who clones this folder can run uv sync to get the exact same setup.",links:[{label:"pygame-ce docs",url:"https://pyga.me/docs/"}]},{id:"anatomy",label:"what's inside",lines:[6,12],color:"#f0c674",description:"Six items. Each has one job.",detail:".venv/ is a private copy of Python and every library you install — invisible to other projects, never commit it, never edit it. .python-version contains just '3.13' — it tells uv which Python to use. main.py is your entry point. pyproject.toml is the project manifest: name, dependencies, settings. uv.lock pins every dependency to an exact version so builds are reproducible. This entire structure is created by uv init and uv add — you never have to set it up by hand.",links:[{label:"uv project guide",url:"https://docs.astral.sh/uv/guides/projects/"}]},{id:"run",label:"open and run",lines:[14,17],color:"#6fb3d2",description:"Open in your editor, run through uv. If this prints, everything works.",detail:"code . opens VS Code with the current folder loaded (Cursor users: cursor . instead). uv run main.py activates the project's .venv, finds the pinned Python version, and executes your script — all automatically. Always use uv run, never bare python. Bare python might use the wrong version or miss your installed libraries."}],tooltips:{"uv init":{sig:"uv init <name>",desc:"Creates a new Python project folder with pyproject.toml, .python-version, main.py, and README.md. The foundation of every project in this course.",url:"https://docs.astral.sh/uv/reference/cli/#uv-init"},"uv add":{sig:"uv add <package>",desc:"Installs a library into the project's .venv and records it in pyproject.toml. Creates the .venv if it doesn't exist yet. Safe to run multiple times.",url:"https://docs.astral.sh/uv/reference/cli/#uv-add"},"pygame-ce":{sig:"pygame-ce (Community Edition)",desc:"A library for making games in Python. Gives you a window, drawing, input, audio, and a game loop. Fork of the original pygame, actively maintained. Same import: import pygame.",url:"https://pyga.me/docs/"},".venv":{sig:".venv/",desc:"A project-local Python environment. Contains a private copy of the interpreter and all installed libraries. Never commit this folder — it's regenerated by uv sync."},"pyproject.toml":{sig:"pyproject.toml",desc:"The project manifest. Lists the project name, Python version requirement, and all dependencies. This is what uv reads to know what your project needs.",url:"https://packaging.python.org/en/latest/guides/writing-pyproject-toml/"},"uv.lock":{sig:"uv.lock",desc:"Locks every dependency to an exact version. Ensures that uv sync on another machine installs the same thing, byte for byte. Commit this file."},"uv run":{sig:"uv run <file.py>",desc:"Runs a Python script using the project's .venv and pinned Python version. Handles environment activation automatically. Always use this instead of bare python.",url:"https://docs.astral.sh/uv/reference/cli/#uv-run"}}},{id:"the-loop",type:"interactive-code",heading:"You just wrote a complete game loop.",subtitle:"Every game ever made has this shape. The next eleven sessions are about what goes inside it.",code:`import pygame
pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()
x, y = 400, 300  # the whole world in two numbers

running = True
while running:  # 60 times per second
    # ---- events ----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # ---- update ----
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:  x -= 5
    if keys[pygame.K_RIGHT]: x += 5
    if keys[pygame.K_UP]:    y -= 5
    if keys[pygame.K_DOWN]:  y += 5

    # ---- draw ----
    screen.fill((11, 13, 16))
    pygame.draw.rect(screen, (255, 107, 53), (x, y, 40, 40))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`,regions:[{id:"init",label:"init",lines:[1,4],color:"#ff6b35",description:"Start pygame. Get a window. Create a clock.",detail:"pygame.init() starts all subsystems (display, audio, input). set_mode() asks the OS for a window of the given pixel dimensions. Clock will cap frame rate later. These run once, before the loop.",links:[{label:"pygame.init()",url:"https://pyga.me/docs/ref/pygame.html#pygame.init"},{label:"display.set_mode()",url:"https://pyga.me/docs/ref/display.html#pygame.display.set_mode"}]},{id:"state",label:"state",lines:[5,5],color:"#f0c674",description:"The world is just variables.",detail:"x and y are the square's position. Every frame reads them to know where to draw. Every keypress changes them. Right now the entire game state is two integers — by Unit 12 it will be hundreds of variables across dozens of objects, but the principle is the same."},{id:"loop",label:"the loop",lines:[7,8],color:"#7fd1c8",description:"Sixty times a second, until you quit.",detail:"while running: repeats its body once per frame. At 60 FPS each iteration has about 16.7 milliseconds to finish. When running becomes False (via the QUIT event), the loop exits and the program falls through to pygame.quit().",links:[{label:"game loop pattern",url:"https://pyga.me/docs/tut/newbieguide.html"}]},{id:"events",label:"events",lines:[9,12],color:"#c390d4",description:"What did the user just do?",detail:"pygame.event.get() returns every input event since the last frame — key presses, mouse moves, window close. We check each one. QUIT fires when the user clicks the X button or presses Alt+F4. If you skip this check, the window becomes unresponsive.",links:[{label:"event handling",url:"https://pyga.me/docs/ref/event.html"}]},{id:"update",label:"update",lines:[14,19],color:"#98c379",description:"Change the world based on input.",detail:"get_pressed() returns a snapshot of all keyboard keys right now: True if held, False if not. This is continuous input — it fires every frame the key is held, not once on key-down. We change x and y; the screen hasn't been redrawn yet. The world model updates before the picture does.",links:[{label:"key.get_pressed()",url:"https://pyga.me/docs/ref/key.html#pygame.key.get_pressed"}]},{id:"draw",label:"draw + flip",lines:[21,25],color:"#6fb3d2",description:"Paint the new world, then present it.",detail:"fill() clears every pixel to one color (erasing the old frame). draw.rect() paints the square at its current position. These write to a back buffer — an invisible copy of the screen. flip() swaps the back buffer to the front, making the new frame visible. clock.tick(60) then sleeps until 16.7ms have passed, keeping the loop at 60 FPS.",links:[{label:"display.flip()",url:"https://pyga.me/docs/ref/display.html#pygame.display.flip"},{label:"draw.rect()",url:"https://pyga.me/docs/ref/draw.html#pygame.draw.rect"}]}],tooltips:{"pygame.init":{sig:"pygame.init() → (numpass, numfail)",desc:"Starts all pygame subsystems (display, audio, input, fonts). Call once at program start. Returns how many subsystems succeeded/failed.",url:"https://pyga.me/docs/ref/pygame.html#pygame.init"},set_mode:{sig:"pygame.display.set_mode(size) → Surface",desc:"Creates the game window. size is (width, height) in pixels. Returns the Surface you draw on — this is the back buffer.",url:"https://pyga.me/docs/ref/display.html#pygame.display.set_mode"},"pygame.time.Clock":{sig:"pygame.time.Clock() → Clock",desc:"Creates a clock for frame rate control. Use clock.tick(fps) each frame to cap speed and measure delta time.",url:"https://pyga.me/docs/ref/time.html#pygame.time.Clock"},"pygame.event.get":{sig:"pygame.event.get() → [Event, ...]",desc:"Returns and removes all events from the queue since last call. Must be called every frame — without it, the OS considers your window unresponsive.",url:"https://pyga.me/docs/ref/event.html#pygame.event.get"},"pygame.QUIT":{sig:"event.type == pygame.QUIT",desc:"Event fired when the user clicks the window's X button or presses Alt+F4. Your code must handle this or the window can't be closed.",url:"https://pyga.me/docs/ref/event.html"},get_pressed:{sig:"pygame.key.get_pressed() → ScancodeWrapper",desc:"Snapshot of every key right now: True if held, False if not. Continuous — fires every frame, not just on key-down. For one-shot actions (jump, shoot), use KEYDOWN events instead.",url:"https://pyga.me/docs/ref/key.html#pygame.key.get_pressed"},K_LEFT:{sig:"pygame.K_LEFT, K_RIGHT, K_UP, K_DOWN",desc:"Integer constants for arrow keys. Index into the get_pressed() array. Full list in pygame.locals.",url:"https://pyga.me/docs/ref/key.html#key-constants-label"},"screen.fill":{sig:"surface.fill(color) → Rect",desc:"Fills every pixel with one color. color is (R, G, B), each 0–255. Use to erase the previous frame before drawing the new one.",url:"https://pyga.me/docs/ref/surface.html#pygame.Surface.fill"},"draw.rect":{sig:"pygame.draw.rect(surface, color, rect, width=0) → Rect",desc:"Draws a rectangle. rect is (x, y, width, height). width=0 = filled; width>0 = border only at that thickness.",url:"https://pyga.me/docs/ref/draw.html#pygame.draw.rect"},"display.flip":{sig:"pygame.display.flip() → None",desc:"Presents the back buffer to the screen. Pygame double-buffers: you draw to an invisible copy, then flip() swaps it to the visible display. Without this, nothing you drew shows up.",url:"https://pyga.me/docs/ref/display.html#pygame.display.flip"},"clock.tick":{sig:"clock.tick(framerate=0) → milliseconds",desc:"Sleeps until enough time has passed for the target FPS. tick(60) = wait until 16.7ms since last tick. Returns actual elapsed ms (useful for frame-rate-independent movement). Without this, the loop runs as fast as hardware allows.",url:"https://pyga.me/docs/ref/time.html#pygame.time.Clock.tick"},"pygame.quit":{sig:"pygame.quit() → None",desc:"Uninitializes all pygame modules. Closes the window, releases audio devices, frees resources. Counterpart to pygame.init(). Runs after the loop exits.",url:"https://pyga.me/docs/ref/pygame.html#pygame.quit"}}},{id:"project",type:"bullets",heading:"Fake Game",lead:"Across the next twelve weeks you'll build a real version of a Hero Wars-style fake game. The minimum is one functional game. The maximum is whatever you can ship by Unit 12.",items:["A player you control","Enemies that try to kill you","Bullets, levels, a title screen, a score","A reason to keep playing","Juice"]},{id:"git-setup",type:"interactive-code",heading:"Git in three moves.",subtitle:"Snapshot, connect, push. This is the workflow for the rest of the semester.",code:`# ---- snapshot ----
git init
git add .
git commit -m "first commit"

# ---- connect to github ----
# Create a repo on github.com, then:
git remote add origin https://github.com/YOU/hello-pygame.git
git push -u origin main

# ---- the daily loop ----
git add .
git commit -m "describe what changed"
git push`,regions:[{id:"snapshot",label:"snapshot",lines:[1,4],color:"#c390d4",description:"Take a snapshot of your project right now.",detail:"git init creates a hidden .git/ folder that tracks every change. git add . stages all files — tells git 'include these in the next snapshot'. git commit saves the snapshot with a message. These three commands create your first checkpoint. You can always return to this exact state.",links:[{label:"git basics",url:"https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F"}]},{id:"connect",label:"connect to github",lines:[6,9],color:"#7fd1c8",description:"Link your local project to GitHub so we can see it.",detail:"Create a new repository on github.com (the green '+' button, top right). Don't add a README — you already have files. Copy the URL it gives you. git remote add origin tells your local repo where to push. git push -u origin main uploads everything and sets up tracking. After this, your code is online and we can grade it."},{id:"daily",label:"the daily loop",lines:[11,14],color:"#98c379",description:"Add, commit, push. Every session, every feature.",detail:"After each coding session: add stages your changes, commit saves them with a message, push uploads to GitHub. Write messages that say what changed — 'add enemy spawning' not 'update' or 'stuff'. If you prefer clicking to typing: GitHub Desktop, Fork, or the Git panel built into VS Code all do the same thing with buttons.",links:[{label:"GitHub Desktop",url:"https://desktop.github.com/"}]}],tooltips:{"git init":{sig:"git init",desc:"Creates a new git repository in the current folder. Adds a hidden .git/ directory that tracks all changes. Run once per project.",url:"https://git-scm.com/docs/git-init"},"git add":{sig:"git add <files>",desc:"Stages files for the next commit. 'git add .' stages everything in the current directory. Staging is like putting items in a box before sealing it.",url:"https://git-scm.com/docs/git-add"},"git commit":{sig:'git commit -m "message"',desc:"Saves a snapshot of all staged changes with a descriptive message. Each commit is a checkpoint you can return to. Commits are local until you push.",url:"https://git-scm.com/docs/git-commit"},"git push":{sig:"git push",desc:"Uploads local commits to the remote repository (GitHub). After pushing, your code is online and visible to others. The -u flag sets up tracking so future pushes don't need extra arguments.",url:"https://git-scm.com/docs/git-push"},"git remote":{sig:"git remote add origin <url>",desc:"Connects your local repository to a remote one. 'origin' is the conventional name for your primary remote. The URL points to your GitHub repo.",url:"https://git-scm.com/docs/git-remote"}}},{id:"homework",type:"bullets",heading:"For next Friday",lead:"You built hello-square in class. Now make it yours.",items:["<b>Set up git. Make a public repo. Post the link.</b>","<b>Extend hello-square.</b> Pick one: wrap around the edges, change color on Space, add a second shape — or surprise us. We show them off next Friday. Coolest thing wins a prize.","Sleep."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],st={meta:it,slides:at},rt={id:"02",number:"02",tag:"HOW COMPUTERS THINK",total:"31"},lt=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"How Computers Think"},{id:"showcase",type:"question",eyebrow:"Homework",question:"Show us your squares"},{id:"today",type:"bullets",heading:"Today.",lead:"How does a computer think?",items:["Seven basic concepts.","Then we play a game where <b>you are the computer</b>."]},{id:"concept-variable",type:"prose",eyebrow:"Concept 01",heading:"Variable",body:"A <b>name</b> attached to a <b>value</b>.<br><br>A labeled slot that holds something. The label stays. The value can change.<br><br>Last week: <b>x = 400</b> was a variable. Your square's position."},{id:"concept-type",type:"bullets",heading:"Concept 02 — Type",lead:"What kind of thing is in the slot.",items:["<b>int</b> — whole numbers. <b>42</b>, <b>-7</b>, <b>0</b>","<b>float</b> — decimal numbers. <b>3.14</b>, <b>0.5</b>, <b>-2.0</b>",'<b>str</b> — text. <b>"hello"</b>, <b>"Game Over"</b>',"<b>bool</b> — true or false. <b>True</b>, <b>False</b>. That's it.",'The computer cares. <b>"3"</b> is not the same as <b>3</b>.']},{id:"concept-expression",type:"prose",eyebrow:"Concept 03",heading:"Expression",body:'Anything that <b>produces a value</b>.<br><br><b>3 + 4</b> is an expression. <b>x > 10</b> is an expression. <b>"hello" + " world"</b> is an expression.<br><br>Every time the computer needs an answer, it <i>evaluates</i> an expression.'},{id:"concept-conditional",type:"code",eyebrow:"Concept 04 — Conditional",heading:"Making decisions.",code:`if something_is_true:
    do_this()
elif something_else:
    do_that()
else:
    do_the_other_thing()`,caption:"A fork in the road. The computer evaluates the condition, picks one path, skips the rest. <b>Last week: if event.type == pygame.QUIT</b> was a conditional."},{id:"concept-loop",type:"code",eyebrow:"Concept 05 — Loop",heading:"Doing things more than once.",code:`# "do this 5 times"
for i in range(5):
    print(i)

# "keep going until I say stop"
while running:
    check_events()
    update()
    draw()`,caption:"Your game loop is a while loop. It runs the same code 60 times per second until <b>running</b> becomes <b>False</b>."},{id:"concept-function",type:"code",eyebrow:"Concept 06 — Function",heading:"Naming a recipe.",code:`def add(a, b):
    result = a + b
    return result

x = add(3, 4)
print(x)  # 7`,caption:"Define once, call whenever. Takes <b>parameters</b> in, gives a <b>return value</b> back. A black box with inputs and outputs."},{id:"concept-list",type:"code",eyebrow:"Concept 07 — List",heading:"A box that holds other boxes.",code:`enemies = ["goblin", "skeleton", "dragon"]

print(enemies[0])  # "goblin"

enemies.append("troll")

for enemy in enemies:
    print(enemy)`,caption:"Ordered. Indexed from 0. You can add, remove, and loop through them. <b>Your obstacles list next week will be a list.</b>"},{id:"game-intro",type:"bullets",heading:"The Human Computer",lead:"You are the machine. Two teams. Four roles each.",items:["Each team is a complete computer.","Four roles: <b>Interpreter</b>, <b>Memory</b>, <b>ALU</b>, <b>Screen</b>.","You follow scripts written in plain language.","After each round, we reveal the Python equivalent.","What was annoying for you is what computers are <b>good</b> at."]},{id:"role-interpreter",type:"prose",eyebrow:"Role",heading:"The Interpreter",body:'You read the script, line by line, top to bottom. You direct the other roles — they only act when you tell them.<br><br>You may say: <b>"Memory, create/read/update/destroy..."</b> · <b>"ALU, what is...?"</b> · <b>"ALU, is...?"</b> · <b>"Counter, count from... to..."</b> · <b>"Screen, write..."</b> · <b>"Jump to line N"</b> · <b>"Call [recipe name]"</b> · <b>"Return"</b><br><br>You may NOT: do math, hold values, write output, or skip lines without reason.'},{id:"role-memory",type:"prose",eyebrow:"Role",heading:"Memory",body:'You hold the index cards. Each card has a <b>name</b> and a <b>value</b>. You are the only one who touches cards.<br><br>When told, you may:<br>• <b>CREATE</b> a card — write name + value, say "Created [name], value [value]"<br>• <b>READ</b> a card — hold it up, say "[name] is [value]"<br>• <b>UPDATE</b> a card — cross out old value, write new, say "Updated [name] to [value]"<br>• <b>DESTROY</b> a card — tear it up, say "Destroyed [name]"<br><br>You may NOT: do math, make decisions, or act without being told.'},{id:"role-alu",type:"prose",eyebrow:"Role",heading:"ALU (Arithmetic Logic Unit)",body:'You are the calculator <b>AND</b> the decision-maker. ALU = Arithmetic Logic Unit — in a real CPU, this is <b>one chip</b> that handles both math and yes/no decisions.<br><br>When asked a math question (<b>"what is x plus y?"</b>), ask Memory to READ the cards you need, compute the answer, say it out loud.<br>When asked a yes/no question (<b>"is x greater than 10?"</b>), ask Memory to READ the cards you need, answer: <b>"Yes"</b> or <b>"No"</b>. Nothing else.<br><br>You may NOT: hold values, remember previous answers, or volunteer information.'},{id:"role-screen",type:"prose",eyebrow:"Role",heading:"The Screen",body:`You stand at the whiteboard (or hold up a notebook). You are the <b>only part of the computer that the outside world can see</b>.<br><br>When the Interpreter says <b>"Screen, write [value]"</b>, you write it. That's it. You write things in order, top to bottom. Each new write goes on a new line.<br><br>You may NOT: decide what to write, erase, or write without being told.`},{id:"game-protocol",type:"bullets",heading:"The Protocol",lead:"Strict chain of command. No shortcuts.",items:["The <b>Interpreter</b> reads a line and gives an order. Nobody else initiates.","If the Interpreter needs a value → asks <b>Memory</b> to READ it.","If the Interpreter needs math → asks <b>ALU</b>. ALU asks Memory to READ the cards it needs, computes, says the answer.","If the Interpreter needs a decision → asks <b>ALU</b> a yes/no question. ALU asks Memory to READ, then answers yes or no. The Interpreter picks the path.","If the Interpreter needs output → tells <b>Screen</b> to write.","If something is unclear: <b>stop. Ask the teacher.</b> That's a bug."]},{id:"game-setup",type:"bullets",heading:"Setup",lead:"Get into position.",items:["Split into <b>two teams of 4</b>. Extra people: you're the <b>Debugger</b> — watch for mistakes.","Each team grabs a stack of <b>index cards</b> and a pen.","Assign roles: Interpreter, Memory, ALU, Screen.","Screen: go to the whiteboard.","Everyone else: sit together. Memory keeps the cards."]},{id:"round0-script",type:"code",eyebrow:"Round 0 — Dry Run",heading:"Three moves. Get the handshake right.",code:`Interpreter: "Memory, create a card 'name' with value 'Python'"
Interpreter: "Memory, read 'name'"
Interpreter: "Screen, write the value of 'name'"`,caption:"Three moves. Get the handshake right.",language:"text"},{id:"round1-script",type:"code",eyebrow:"Round 1 — Variables & Print",heading:"Run this. As a team.",code:`Memory: create "hp" with value 20
Memory: create "damage" with value 7
ALU: what is hp minus damage?
Memory: create "remaining" with the answer
Screen: write the value of remaining
Screen: write "ouch"`,caption:"",language:"text"},{id:"round1-reveal",type:"code",eyebrow:"Round 1 — in Python",heading:"What you just did.",code:`hp = 20
damage = 7
remaining = hp - damage
print(remaining)
print("ouch")`,caption:"Memory create → variable assignment. ALU → the minus operator. Screen write → <b>print()</b>.",language:"python"},{id:"round2-script",type:"code",eyebrow:"Round 2 — Decisions",heading:"New script. Same team.",code:`Memory: create "score" with value 85

ALU: is score greater than or equal to 90?
  If yes → Screen: write "A". Stop here.
ALU: is score greater than or equal to 80?
  If yes → Screen: write "B". Stop here.
Otherwise → Screen: write "C"`,caption:"",language:"text"},{id:"round2-reveal",type:"code",eyebrow:"Round 2 — in Python",heading:"What you just did.",code:`score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`,caption:"ALU yes/no → <b>if/elif/else</b>. The Interpreter picks ONE path and skips the rest.",language:"python"},{id:"round3-script",type:"code",eyebrow:"Round 3 — Loops",heading:"New script. Same team.",code:` 1  Memory: create "total" with value 0
 2  Memory: create "i" with value 1
 3  ALU: is i greater than 5?
 4    If yes → jump to line 10
 5  ALU: what is total plus i?
 6  Memory: update "total" with the answer
 7  ALU: what is i plus 1?
 8  Memory: update "i" with the answer
 9  Jump to line 3
10  Screen: write the value of total`,caption:"Yes, you have to do this by hand. Lines 3–9 repeat until i hits 6. That's the loop.",language:"text"},{id:"round3-reveal",type:"code",eyebrow:"Round 3 — in Python",heading:"What you just did.",code:`total = 0

for i in range(1, 6):
    total = total + i

print(total)`,caption:"The answer is 15. <b>for i in range()</b> does your lines 2–9 in one line — the variable, the check, the increment, and the jump. Now imagine counting to 32,482.",language:"python"},{id:"round4-setup",type:"bullets",heading:"Round 4 — The Function Call",lead:"Teams recombine. One team is the program. The other is the function.",items:["<b>Team A:</b> you are the program. You have a script with a function CALL.","<b>Team B:</b> you have NO script yet. You wait.",`Team A's Interpreter reads the <b>define</b> block. They don't run it — they walk the recipe to Team B's Interpreter: "Here's a recipe called [name]. Don't do anything until I call you."`,"Team B reads the recipe, assigns roles, prepares. But does <b>NOT</b> act.",'When Team A hits the <b>call</b> line: write argument values on index cards, hand them to Team B. <b>"Calling [name] with these values."</b>',"Team A <b>sits on their hands</b>. Team B runs.",'When Team B finishes: walk a card back to Team A. <b>"Returning [value]."</b>',"Team A resumes."]},{id:"round4-script-a",type:"code",eyebrow:"Round 4 — Team A (The Program)",heading:"Team A's script.",code:`Define a recipe called "clamp".
It takes three values: value, low, high.
[Hand this recipe to Team B now.]

Memory: create "x" with value 150
Memory: create "result" by calling "clamp" with x, 0, and 100.
  [Hand cards with 150, 0, and 100 to Team B. Wait.]
  [When Team B returns a card, that is "result".]
Screen: write the value of result`,caption:"",language:"text"},{id:"round4-script-b",type:"code",eyebrow:"Round 4 — Team B (The Function)",heading:"Team B's script.",code:`Recipe: "clamp" — takes value, low, high.
[Wait until Team A calls you.]

When called:
  Memory: create cards for value, low, high from Team A's cards
  ALU: is value less than low?
    If yes → return low
  ALU: is value greater than high?
    If yes → return high
  Otherwise → return value

[Write your answer on a card. Walk it back to Team A.]
[Destroy your cards. They're yours, not theirs.]`,caption:"",language:"text"},{id:"round4-reveal",type:"code",eyebrow:"Round 4 — in Python",heading:"What you just did.",code:`def clamp(value, low, high):
    if value < low:
        return low
    elif value > high:
        return high
    else:
        return value

x = 150
result = clamp(x, 0, 100)
print(result)`,caption:"Team B's cards were theirs. Team A never saw them. That's <b>scope</b> — local variables exist only inside the function. The <b>def</b> block is read but not run until called.",language:"python"},{id:"game-debrief",type:"bullets",heading:"What just happened",lead:"You were a computer. Each role maps to a real part.",items:["<b>Interpreter</b> → Control Unit. Reads instructions, directs everything — including jumps.","<b>Memory</b> → RAM. Named slots that hold values.","<b>ALU</b> → Arithmetic Logic Unit. Math and decisions. One chip, two jobs.","<b>Screen</b> → Standard output (<b>print()</b>). The only thing the outside world sees.","There was no Counter. A loop is just <b>a variable, a comparison, and a jump</b> — built from parts you already had. Python's <b>for i in range()</b> wraps that pattern into one line.","What was annoying? What was slow? What was boring? <b>Those are the things computers are good at.</b>"]},{id:"uebung",type:"bullets",heading:"Uebung 001",lead:"Due next Friday. 10 Punkte.",items:["<b>Schleifen (5P):</b> Zaehle alle Ganzzahlen zwischen 437 und 32482 zusammen. Print das Ergebnis.","<b>Funktionen (5P):</b> Schreibe eine Funktion mit zwei float-Parametern. Teile den kleineren durch den groesseren. Wenn gleich: gib 1 zurueck.","Repo: <b>github.com/BabyToad/macromedia-game-programming-ss26</b>"]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],dt={meta:rt,slides:lt},ct={id:"03",number:"03",tag:"PHYSICS & COLLISION",total:"35"},pt=[{id:"section",type:"section",number:"03",kicker:"Unit",title:"Physics & Collision"},{id:"today",type:"bullets",heading:"Today.",lead:"Two halves.",items:["<b>Part 1 — Human Computer.</b> We play the game we set up last week. Two teams. Four roles. You are the machine.","<b>Part 2 — Physics & Collision.</b> How a square falls, and how it stops when it hits a wall.","<b>Ü001 is due.</b> Show us your code."]},{id:"ue001-showcase",type:"question",eyebrow:"Homework",question:"Show us your Ü001"},{id:"hc-intro",type:"bullets",heading:"The Human Computer",lead:"You are the machine. Two teams. Four roles each.",items:["Each team is a complete computer.","Four roles: <b>Interpreter</b>, <b>Memory</b>, <b>ALU</b>, <b>Screen</b>.","You follow scripts written in plain language.","After each round, we reveal the Python equivalent.","What was annoying for you is what computers are <b>good</b> at."]},{id:"hc-role-interpreter",type:"prose",eyebrow:"Role",heading:"The Interpreter",body:'You read the script, line by line, top to bottom. You direct the other roles — they only act when you tell them.<br><br>You may say: <b>"Memory, create/read/update/destroy..."</b> · <b>"ALU, what is...?"</b> · <b>"ALU, is...?"</b> · <b>"Screen, write..."</b> · <b>"Jump to line N"</b> · <b>"Call [recipe name]"</b> · <b>"Return"</b><br><br>You may NOT: do math, hold values, write output, or skip lines without reason.'},{id:"hc-role-memory",type:"prose",eyebrow:"Role",heading:"Memory",body:'You hold the index cards. Each card has a <b>name</b> and a <b>value</b>. You are the only one who touches cards.<br><br>When told, you may:<br>• <b>CREATE</b> a card — write name + value, say "Created [name], value [value]"<br>• <b>READ</b> a card — hold it up, say "[name] is [value]"<br>• <b>UPDATE</b> a card — cross out old value, write new, say "Updated [name] to [value]"<br>• <b>DESTROY</b> a card — tear it up, say "Destroyed [name]"<br><br>You may NOT: do math, make decisions, or act without being told.'},{id:"hc-role-alu",type:"prose",eyebrow:"Role",heading:"ALU (Arithmetic Logic Unit)",body:'You are the calculator <b>AND</b> the decision-maker. ALU = Arithmetic Logic Unit — in a real CPU, this is <b>one chip</b> that handles both math and yes/no decisions.<br><br>When asked a math question (<b>"what is x plus y?"</b>), ask Memory to READ the cards you need, compute the answer, say it out loud.<br>When asked a yes/no question (<b>"is x greater than 10?"</b>), ask Memory to READ the cards you need, answer: <b>"Yes"</b> or <b>"No"</b>. Nothing else.<br><br>You may NOT: hold values, remember previous answers, or volunteer information.'},{id:"hc-role-screen",type:"prose",eyebrow:"Role",heading:"The Screen",body:`You stand at the whiteboard (or hold up a notebook). You are the <b>only part of the computer that the outside world can see</b>.<br><br>When the Interpreter says <b>"Screen, write [value]"</b>, you write it. That's it. You write things in order, top to bottom. Each new write goes on a new line.<br><br>You may NOT: decide what to write, erase, or write without being told.`},{id:"hc-protocol",type:"bullets",heading:"The Protocol",lead:"Strict chain of command. No shortcuts.",items:["The <b>Interpreter</b> reads a line and gives an order. Nobody else initiates.","If the Interpreter needs a value → asks <b>Memory</b> to READ it.","If the Interpreter needs math → asks <b>ALU</b>. ALU asks Memory to READ the cards it needs, computes, says the answer.","If the Interpreter needs a decision → asks <b>ALU</b> a yes/no question. ALU asks Memory to READ, then answers yes or no. The Interpreter picks the path.","If the Interpreter needs output → tells <b>Screen</b> to write.","If something is unclear: <b>stop. Ask the teacher.</b> That's a bug."]},{id:"hc-setup",type:"bullets",heading:"Setup",lead:"Get into position.",items:["Split into <b>two teams of 4</b>. Extra people: you're the <b>Debugger</b> — watch for mistakes.","Each team grabs a stack of <b>index cards</b> and a pen.","Assign roles: Interpreter, Memory, ALU, Screen.","Screen: go to the whiteboard.","Everyone else: sit together. Memory keeps the cards."]},{id:"hc-round0",type:"code",eyebrow:"Round 0 — Dry Run",heading:"Three moves. Get the handshake right.",code:`Interpreter: "Memory, create a card 'name' with value 'Python'"
Interpreter: "Memory, read 'name'"
Interpreter: "Screen, write the value of 'name'"`,caption:"Three moves. Get the handshake right.",language:"text"},{id:"hc-round1-script",type:"code",eyebrow:"Round 1 — Variables & Print",heading:"Run this. As a team.",code:`Memory: create "hp" with value 20
Memory: create "damage" with value 7
ALU: what is hp minus damage?
Memory: create "remaining" with the answer
Screen: write the value of remaining
Screen: write "ouch"`,caption:"",language:"text"},{id:"hc-round1-reveal",type:"code",eyebrow:"Round 1 — in Python",heading:"What you just did.",code:`hp = 20
damage = 7
remaining = hp - damage
print(remaining)
print("ouch")`,caption:"Memory create → variable assignment. ALU → the minus operator. Screen write → <b>print()</b>.",language:"python"},{id:"hc-round2-script",type:"code",eyebrow:"Round 2 — Decisions",heading:"New script. Same team.",code:`Memory: create "score" with value 85

ALU: is score greater than or equal to 90?
  If yes → Screen: write "A". Stop here.
ALU: is score greater than or equal to 80?
  If yes → Screen: write "B". Stop here.
Otherwise → Screen: write "C"`,caption:"",language:"text"},{id:"hc-round2-reveal",type:"code",eyebrow:"Round 2 — in Python",heading:"What you just did.",code:`score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`,caption:"ALU yes/no → <b>if/elif/else</b>. The Interpreter picks ONE path and skips the rest.",language:"python"},{id:"hc-round3-script",type:"code",eyebrow:"Round 3 — Loops",heading:"New script. Same team.",code:` 1  Memory: create "total" with value 0
 2  Memory: create "i" with value 1
 3  ALU: is i greater than 5?
 4    If yes → jump to line 10
 5  ALU: what is total plus i?
 6  Memory: update "total" with the answer
 7  ALU: what is i plus 1?
 8  Memory: update "i" with the answer
 9  Jump to line 3
10  Screen: write the value of total`,caption:"Yes, you have to do this by hand. Lines 3–9 repeat until i hits 6. That's the loop.",language:"text"},{id:"hc-round3-reveal",type:"code",eyebrow:"Round 3 — in Python",heading:"What you just did.",code:`total = 0

for i in range(1, 6):
    total = total + i

print(total)`,caption:"The answer is 15. <b>for i in range()</b> does your lines 2–9 in one line — the variable, the check, the increment, and the jump. Now imagine counting to 32,482.",language:"python"},{id:"hc-round4-setup",type:"bullets",heading:"Round 4 — The Function Call (stretch)",lead:"Teams recombine. One team is the program. The other is the function.",items:["<b>Team A:</b> you are the program. You have a script with a function CALL.","<b>Team B:</b> you have NO script yet. You wait.",`Team A's Interpreter reads the <b>define</b> block. They don't run it — they walk the recipe to Team B's Interpreter: "Here's a recipe called [name]. Don't do anything until I call you."`,"Team B reads the recipe, assigns roles, prepares. But does <b>NOT</b> act.",'When Team A hits the <b>call</b> line: write argument values on index cards, hand them to Team B. <b>"Calling [name] with these values."</b>',"Team A <b>sits on their hands</b>. Team B runs.",'When Team B finishes: walk a card back to Team A. <b>"Returning [value]."</b>',"Team A resumes."]},{id:"hc-round4-script-a",type:"code",eyebrow:"Round 4 — Team A (The Program)",heading:"Team A's script.",code:`Define a recipe called "clamp".
It takes three values: value, low, high.
[Hand this recipe to Team B now.]

Memory: create "x" with value 150
Memory: create "result" by calling "clamp" with x, 0, and 100.
  [Hand cards with 150, 0, and 100 to Team B. Wait.]
  [When Team B returns a card, that is "result".]
Screen: write the value of result`,caption:"",language:"text"},{id:"hc-round4-script-b",type:"code",eyebrow:"Round 4 — Team B (The Function)",heading:"Team B's script.",code:`Recipe: "clamp" — takes value, low, high.
[Wait until Team A calls you.]

When called:
  Memory: create cards for value, low, high from Team A's cards
  ALU: is value less than low?
    If yes → return low
  ALU: is value greater than high?
    If yes → return high
  Otherwise → return value

[Write your answer on a card. Walk it back to Team A.]
[Destroy your cards. They're yours, not theirs.]`,caption:"",language:"text"},{id:"hc-round4-reveal",type:"code",eyebrow:"Round 4 — in Python",heading:"What you just did.",code:`def clamp(value, low, high):
    if value < low:
        return low
    elif value > high:
        return high
    else:
        return value

x = 150
result = clamp(x, 0, 100)
print(result)`,caption:"Team B's cards were theirs. Team A never saw them. That's <b>scope</b> — local variables exist only inside the function. The <b>def</b> block is read but not run until called.",language:"python"},{id:"hc-debrief",type:"bullets",heading:"What just happened",lead:"You were a computer. Each role maps to a real part.",items:["<b>Interpreter</b> → Control Unit. Reads instructions, directs everything — including jumps.","<b>Memory</b> → RAM. Named slots that hold values.","<b>ALU</b> → Arithmetic Logic Unit. Math and decisions. One chip, two jobs.","<b>Screen</b> → Standard output (<b>print()</b>). The only thing the outside world sees.","A loop is just <b>a variable, a comparison, and a jump</b>. Python's <b>for i in range()</b> wraps that pattern into one line.","What was annoying? What was slow? What was boring? <b>Those are the things computers are good at.</b>"]},{id:"section-physics",type:"section",number:"03",kicker:"Part 2",title:"Physics & Collision"},{id:"phys-why",type:"prose",eyebrow:"Framing",heading:"Giving things weight",body:"Last week your square moved because you pressed a key.<br><br>Today we add <b>velocity</b> — the square keeps moving after you let go. Then <b>gravity</b> — it falls. Then <b>collision</b> — it stops when it hits something.<br><br>Three ideas. Everything from platformers to pinball machines is built on top of them."},{id:"phys-position-velocity",type:"code",eyebrow:"Concept 01",heading:"Position + velocity",code:`# State
player_x = 100
player_y = 200
player_vx = 0
player_vy = 0

# Inside the game loop, every frame:
player_x = player_x + player_vx
player_y = player_y + player_vy`,caption:"Position is where you are. Velocity is how much you move <b>per frame</b>. Every frame: add velocity to position. That's motion. Change the velocity and the object moves differently — without touching the motion code.",language:"python"},{id:"phys-gravity",type:"code",eyebrow:"Concept 02",heading:"Gravity is acceleration",code:`GRAVITY = 0.5  # tune until it feels right

# Every frame, before moving:
player_vy = player_vy + GRAVITY

# Then motion, same as before:
player_x = player_x + player_vx
player_y = player_y + player_vy`,caption:"Acceleration changes velocity over time. Gravity is constant acceleration in the y direction. Add it every frame, velocity grows, position follows. In pygame the origin is top-left, so <b>positive y is down</b>. Things fall by adding to vy.",language:"python"},{id:"phys-rect",type:"code",eyebrow:"Concept 03",heading:"pygame.Rect + AABB",code:`# A Rect tracks position AND size
player_rect = pygame.Rect(100, 200, 32, 48)
#                         x    y    w   h

# Move it
player_rect.x = player_rect.x + player_vx
player_rect.y = player_rect.y + player_vy

# Handy edges and corners — read OR write
player_rect.left, player_rect.right
player_rect.top, player_rect.bottom
player_rect.centerx, player_rect.centery

# Overlap check
if player_rect.colliderect(wall_rect):
    # collision!`,caption:`<b>AABB</b> = Axis-Aligned Bounding Box. A fancy name for "a rectangle that isn't rotated". Two AABBs overlap if they overlap on both X and Y. pygame does the check: <b>a.colliderect(b)</b>. Fast. Simple. Good enough for 99% of 2D games.`,language:"python"},{id:"phys-resolution",type:"code",eyebrow:"Concept 04",heading:"Resolution — one axis at a time",code:`# --- move X, check, push out ---
player_rect.x = player_rect.x + player_vx
for wall in walls:
    if player_rect.colliderect(wall):
        if player_vx > 0:
            player_rect.right = wall.left   # moving right, hit left side of wall
        else:
            player_rect.left = wall.right   # moving left, hit right side of wall
        player_vx = 0

# --- then Y ---
player_rect.y = player_rect.y + player_vy
for wall in walls:
    if player_rect.colliderect(wall):
        if player_vy > 0:
            player_rect.bottom = wall.top   # landed on top of wall
            on_ground = True
        else:
            player_rect.top = wall.bottom   # hit head on underside
        player_vy = 0`,caption:"Move one axis. Check overlap. Push the player to the edge of the wall. Zero velocity on that axis. Then the other axis. <b>One at a time</b> is what gives you clean corner behavior instead of weird sliding.",language:"python"},{id:"phys-jump",type:"code",eyebrow:"Concept 05",heading:"Grounded + jump",code:`JUMP_STRENGTH = 10

# Each frame, reset before Y-collision runs:
on_ground = False
# (Y-resolution above sets on_ground = True when landing on a wall)

# In input handling:
keys = pygame.key.get_pressed()
if keys[pygame.K_SPACE] and on_ground:
    player_vy = -JUMP_STRENGTH   # negative y = up`,caption:"A jump is just a sudden upward velocity. Only allowed when <b>on_ground</b> is True. And on_ground was set by the Y-axis resolution above — which means you have to do collision detection BEFORE the next input handling, or you get double-jumps in mid-air.",language:"python"},{id:"phys-playground",type:"demo",eyebrow:"Playground",heading:"Mario's jump is six cheats in a trenchcoat",demo:"mario-jump",hint:'Start with "Realistic (no tricks)" — feel how committed it is. Then flip each trick and notice what changes. Watch the vy and ay graphs.'},{id:"phys-trick-timing",type:"code",eyebrow:"Trick — timing forgiveness",heading:"Coyote time + jump buffer",code:`COYOTE_FRAMES = 7   # ~120 ms
BUFFER_FRAMES = 8   # ~130 ms

# ---- per frame ----

# 1) Press jump -> arm the buffer
if jump_pressed:
    buffer = BUFFER_FRAMES
buffer = max(0, buffer - 1)

# 2) Jump if buffered AND (on ground OR in the coyote window)
can_jump = on_ground or coyote > 0
if buffer > 0 and can_jump:
    vy, buffer, coyote = -JUMP_STRENGTH, 0, 0

# 3) Start coyote the frame you walk off a ledge
if was_on_ground and not on_ground and vy >= 0:
    coyote = COYOTE_FRAMES
else:
    coyote = max(0, coyote - 1)`,caption:"<b>Coyote time</b> lets you jump a few frames after leaving a ledge — rescues off-by-one ledge fails. <b>Jump buffer</b> lets a press wait in the air until you land — rescues impatient jumps. Two short windows, measured in frames.",language:"python"},{id:"phys-trick-variable",type:"code",eyebrow:"Trick — variable jump height",heading:"Tap = short hop. Hold = full jump.",code:`# If the jump key is released while still rising,
# cut the upward velocity. That is the entire trick.

if jump_released and vy < 0:
    vy *= 0.35

# The multiplier tunes the feel:
#   0.0   tap becomes an instant stop (too sharp)
#   0.35  Celeste-ish, very responsive
#   0.5   mild, forgiving
#   1.0   no effect, fully committed jump`,caption:"One of the oldest tricks in 2D platforming — Mario, Celeste, Hollow Knight all do this. <b>jump_released</b> is true on the frame the key goes up.",language:"python"},{id:"phys-trick-gravity",type:"code",eyebrow:"Trick — the gravity family",heading:"Apex hang · asymmetric gravity · fast fall",code:`# Three modifiers. Each is a multiplier on your base gravity.
# Stack them or not, depending on the feel you want.

g = GRAVITY  # your base, e.g. 0.65

# Apex hangtime — softer near the peak of the jump
if abs(vy) < 2.2:
    g *= 0.5

# Asymmetric gravity — falls faster than it rises
if vy > 0:
    g *= 1.55

# Fast fall — hold down to drop harder
if down_held and vy > 0:
    g *= 1.9

vy += g`,caption:"Real gravity is one number. Game gravity is <i>whatever feels good</i>. These multipliers stack: falling + holding down with apex hang off = <b>0.65 × 1.55 × 1.9 ≈ 1.9</b> per frame. Tune to taste.",language:"python"},{id:"next-week",type:"bullets",heading:"For next Friday",lead:"No new exercise today. Ü002 comes next week.",items:["<b>Try it.</b> Start from your hello-square. Give it velocity and gravity. Make it fall. Add a floor rect. See what breaks.","Next week: <b>Assets & Game Objects.</b> Images, sounds, managing lists of enemies. Ü002 (Jump & Run) gets assigned.","Keep committing. Real messages."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],ht={meta:ct,slides:pt},ut={id:"04",number:"04",tag:"ASSETS & GAME OBJECTS",total:"29"},yt=[{id:"section",type:"section",number:"04",kicker:"Unit",title:"Assets & Game Objects"},{id:"today",type:"bullets",heading:"Today.",lead:"Four kinds of things.",items:["<b>Things you see.</b> Pictures from disk. The end of the green circle.","<b>Things you hear.</b> Sounds from disk. Jumps, pickups, hits.","<b>Many things.</b> A list of pickups. Spawning. Removing. The bug everyone hits.","<b>Things end.</b> A timer, a final score. Game over without closing the window.","<b>Ü002 today.</b> Jump & Run — ten tasks, one point each. Due next Friday."]},{id:"section-see",type:"section",number:"1",kicker:"Chapter",title:"Things You See"},{id:"see-concept",type:"prose",eyebrow:"Concept",heading:"Your code reaches outside itself",body:"For three weeks your game has been math. Numbers go in, rectangles come out, the screen redraws.<br><br>Today the game asks for help. It opens a file on the disk. It reads the bytes. It puts those bytes on the screen.<br><br>Same loop. Same coordinates. But now your character can have a face you drew."},{id:"see-api-load",type:"code",eyebrow:"API",heading:"Load it once. Draw it every frame.",code:`# Once, before the loop:
player_image = pygame.image.load("player.png").convert_alpha()

# Every frame, in your draw section:
screen.blit(player_image, (player_x, player_y))`,caption:"<b>load</b> reads bytes from disk. Slow. Do it <b>once</b>, before the loop. <b>blit</b> stamps the image onto the screen. Fast. Do it every frame.",language:"python"},{id:"see-pitfall-anchor",type:"code",eyebrow:"Pitfall",heading:"blit anchors top-left. circles anchor center.",code:`# Old code drew from the center:
pygame.draw.circle(screen, GREEN, (player_x, player_y), 20)

# New code stamps from the top-left:
screen.blit(player_image, (player_x, player_y))

# To keep your old (x, y) meaning the center:
rect = player_image.get_rect(center=(player_x, player_y))
screen.blit(player_image, rect)`,caption:"Switch the anchor to keep your existing coordinates meaning the same thing. Or change the variables to mean top-left. Pick one and commit. The bug is silent — your player just looks slightly off.",language:"python"},{id:"see-ttta-convert",type:"code",eyebrow:"Things to think about",heading:".convert_alpha() vs .convert()",code:`# Transparent PNG — most player and enemy sprites:
player_image = pygame.image.load("player.png").convert_alpha()

# Opaque image — backgrounds, full-rectangle tiles:
ground_image = pygame.image.load("ground.png").convert()

# Without either: it works, but every blit is a slow conversion.
# You won't see it on a small game. You will see it on a big one.`,caption:"<b>convert</b> matches the image to the screen's pixel format. Blit becomes a memcpy — fast. <b>convert_alpha</b> does the same and keeps transparency. Always one or the other. Skip them and your framerate quietly drops.",language:"python"},{id:"section-hear",type:"section",number:"2",kicker:"Chapter",title:"Things You Hear"},{id:"hear-concept",type:"prose",eyebrow:"Concept",heading:"A sound is a sprite for the ears",body:"Same shape as before. A file on disk. You load it once. You play it when the game wants you to.<br><br>The mental model is identical. <b>Open file → hold bytes in memory → use bytes when needed.</b><br><br>Sprites use eyes. Sounds use ears. Same pattern."},{id:"hear-api",type:"code",eyebrow:"API",heading:"Load once, play whenever.",code:`# Once, before the loop:
jump_sound = pygame.mixer.Sound("jump.wav")

# In your KEYDOWN handler, when the player jumps:
jump_sound.play()

# That's the whole story.`,caption:"<b>Sound</b> is the class for short effects — jumps, hits, pickups. <b>play()</b> queues it on a free channel. Multiple plays overlap automatically. No bookkeeping required.",language:"python"},{id:"hear-ttta-volume",type:"code",eyebrow:"Things to think about",heading:"Volume, format, and not blowing your ears out",code:`# Tame the volume. Default is 1.0 (full).
jump_sound.set_volume(0.4)

# Format guidance:
#   .wav   reliable everywhere. use this.
#   .ogg   smaller files, also good.
#   .mp3   sometimes flaky depending on your install.

# Don't load inside the loop:
# Bad — opens the file 60 times per second:
while running:
    pygame.mixer.Sound("jump.wav").play()  # don't.`,caption:"A 60 fps spam-jump at full volume is genuinely painful. Always set a volume. Always load before the loop. Stick to WAV until you have a reason not to.",language:"python"},{id:"section-many",type:"section",number:"3",kicker:"Chapter",title:"Many Things"},{id:"many-concept-one-vs-many",type:"prose",eyebrow:"Concept",heading:"The bouncing circle exists once.",body:"That's why it was easy. One circle. One x. One y. One velocity.<br><br>What if you wanted ten circles? A hundred? One that appears every two seconds and disappears when caught?<br><br>You stop holding the values directly. You hold a <b>list</b> of values, each one a tiny bag of state. The game becomes a population, not a stage with one actor."},{id:"many-api-list",type:"code",eyebrow:"API",heading:"A list of dicts",code:`# Each pickup is a tiny bag of state:
pickups = []

# To make a new one:
pickups.append({
    "x": 300,
    "y": 0,
    "vy": 1.5,
})

# Every frame, update them all:
for p in pickups:
    p["y"] += p["vy"]

# Every frame, draw them all:
for p in pickups:
    pygame.draw.circle(screen, RED, (int(p["x"]), int(p["y"])), 8)`,caption:"One dict per object. Same fields for every one of them. The list is the population. The dict is the individual. In Unit 06 we replace the dict with a class — for now, dicts are honest, and they work.",language:"python"},{id:"many-concept-spawning",type:"prose",eyebrow:"Concept",heading:"The world grows over time",body:"Until now, every shape was placed before the loop started. The level was complete on frame zero.<br><br>Spawning means the world keeps producing things while the game runs. A pickup falls. Then another. Then another. The longer you play, the more there is.<br><br>Two ways to decide when: a <b>random chance every frame</b>, or a <b>cooldown timer</b>. Both work. Random is shorter to write."},{id:"many-api-spawn",type:"code",eyebrow:"API",heading:"Roll the dice every frame",code:`import random

# In your update section, every frame:
if random.random() < 0.02:  # ~2% chance per frame
    pickups.append({
        "x": random.randint(20, SCREEN_WIDTH - 20),
        "y": 0,
        "vy": 1.5,
    })

# Tune 0.02 — at 60 fps that's roughly one spawn per second.`,caption:"<b>random.random()</b> returns a float between 0 and 1. Compare it to a small number to get a small probability. Lower = rarer. Higher = chaos. Tune by feel.",language:"python"},{id:"many-concept-trap",type:"prose",eyebrow:"Concept",heading:"Removing things — the trap",body:"A pickup gets caught. You want it gone.<br><br>Your instinct is to <b>iterate forward through the list</b> and delete the one you don't want. That instinct is wrong, and the bug it produces is famous enough to have a name.<br><br>When you remove an item from a list while iterating forward, every item after it slides one slot to the left — and the loop counter doesn't know. You skip items. Sometimes you crash. Always, something is wrong."},{id:"many-bug",type:"code",eyebrow:"The bug everyone hits",heading:"Wrong — iterate forward, remove on collision",code:`# Don't do this:
for i in range(len(pickups)):
    p = pickups[i]
    if collides_with_player(p):
        pickups.pop(i)  # the next pickup gets skipped

# What happens:
# - frame 1: pickup at index 3 caught. pop(3). pickup[4] is now at index 3.
# - same frame, next iteration: i = 4. you read pickup[4] — which is the
#   one that used to be pickup[5]. you skipped one.
# - sometimes IndexError. sometimes silent skipping. always wrong.`,caption:"This is the most predictable bug in your Ü002. The list shifts under your feet. The fix is small, but you need to <i>see</i> it break first to remember it.",language:"python"},{id:"many-fix",type:"code",eyebrow:"The fix",heading:"Right — iterate backwards",code:`# Walk the list from the end to the start:
for i in range(len(pickups) - 1, -1, -1):
    p = pickups[i]
    if collides_with_player(p):
        pickups.pop(i)
        score += 1

# Why backwards: removing index 7 doesn't affect what's at index 6.
# You're walking away from the change, not into it.`,caption:`<b>range(len-1, -1, -1)</b> reads "from the last index, down to zero, step by minus one". Memorize that shape. You'll write it a hundred times in your career.`,language:"python"},{id:"many-ttta-comprehension",type:"code",eyebrow:"Things to think about",heading:"The other way — rebuild the list",code:`# Instead of removing in place, build a new list of survivors:
survivors = []
for p in pickups:
    if collides_with_player(p):
        score += 1
    else:
        survivors.append(p)
pickups = survivors

# Or, the same idea as a list comprehension:
caught = sum(1 for p in pickups if collides_with_player(p))
pickups = [p for p in pickups if not collides_with_player(p)]
score += caught`,caption:"Backwards-iterate is the shortest. Survivors-list is the most readable. Comprehension is the most Pythonic. All three work. Pick the one you find easiest to debug — that's the one you should write.",language:"python"},{id:"section-end",type:"section",number:"4",kicker:"Chapter",title:"Things End"},{id:"end-concept-clocks",type:"prose",eyebrow:"Concept",heading:"You already have two clocks",body:"<b>clock.tick(60)</b> has been at the bottom of your loop since week one. It paces frames — pygame waits so the loop runs sixty times per second.<br><br>That's the <b>frame clock</b>. It doesn't care what time it is, only that frames stay even.<br><br>The other clock is the <b>wall clock</b>. How many milliseconds since the program started. <b>pygame.time.get_ticks()</b>. Use this one whenever you want to ask <i>how long?</i> — countdowns, cooldowns, animations, time limits."},{id:"end-api-ticks",type:"code",eyebrow:"API",heading:"Stamp the start. Compare the now.",code:`# Once, before the loop:
start_time = pygame.time.get_ticks()
TIME_LIMIT = 30  # seconds

# Every frame:
elapsed = (pygame.time.get_ticks() - start_time) / 1000
remaining = TIME_LIMIT - elapsed

if remaining <= 0:
    game_over = True

# Draw the countdown:
text = font.render(f"Time: {int(remaining)}", True, WHITE)
screen.blit(text, (10, 10))`,caption:'<b>get_ticks()</b> returns milliseconds since pygame started. Divide by 1000 for seconds. The pattern: stamp once, subtract the now. Works for time limits, cooldowns, fade-ins — anything that asks "how long has it been?"',language:"python"},{id:"end-concept-flag",type:"prose",eyebrow:"Concept",heading:"Game over is a flag, not an exit",body:"When time runs out, do not <b>running = False</b>. Do not close the window.<br><br>The game-over screen is a state. The loop keeps running. The window stays open. You just stop updating, stop spawning, and draw a different screen.<br><br>Why: the player wants to see their score. The window slamming shut feels like a crash, not an ending. And next month, this same flag becomes the seed of a proper state machine."},{id:"end-api-flag",type:"code",eyebrow:"API",heading:"One flag. Two paths.",code:`game_over = False

while running:
    # ... events stay the same ...

    if not game_over:
        update_player()
        update_pickups()
        if elapsed >= TIME_LIMIT:
            game_over = True

    # drawing happens either way
    screen.fill(BACKGROUND_COL)
    draw_player()
    draw_pickups()
    if game_over:
        text = big_font.render(f"Final Score: {score}", True, WHITE)
        screen.blit(text, text.get_rect(center=screen.get_rect().center))`,caption:"One flag splits the loop in two. <b>Update</b> respects it. <b>Draw</b> ignores it — the window stays alive either way.",language:"python"},{id:"recap",type:"bullets",heading:"Five new tools",lead:"All from the standard pygame toolbox.",items:["<b>pygame.image.load + convert_alpha + blit</b> — pictures from disk to screen.","<b>pygame.mixer.Sound + play + set_volume</b> — sounds from disk to speakers.","<b>List of dicts + iterate-backwards-and-remove</b> — populations of game objects.","<b>pygame.time.get_ticks()</b> — the wall clock.","<b>game_over flag</b> — one variable splits the loop into two states."]},{id:"ue002",type:"question",eyebrow:"Now you build it",question:"Ü002 — Jump & Run"},{id:"for-next-week",type:"bullets",heading:"For next Friday",lead:"Ü002 due. Ten tasks, one point each. Submit only your src/ folder.",items:["Sprites and sound: one tiny PNG, one short WAV. Make them yours — pixel art is fine, ugly is fine, generic is the only failure.","Pickups: lists are the new pattern. Backwards-iterate when removing. The trap is real.","Time limit + final score: the loop survives, the gameplay doesn't.","<b>Next week — Dictionaries & Data.</b> We name what you've already started doing.","<b>In two weeks — Classes.</b> We finally name the things."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],mt={meta:ut,slides:yt},gt=[st,dt,ht,mt],bt=gt.map(t=>tt(t.meta,t.slides)).join(`
`),we=document.createElement("deck-root");we.innerHTML=bt;document.body.appendChild(we);
