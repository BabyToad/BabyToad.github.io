(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}})();function je(t){const e=t.getContext("2d");t.width=t.clientWidth*devicePixelRatio,t.height=t.clientHeight*devicePixelRatio,e.scale(devicePixelRatio,devicePixelRatio);const i=t.clientWidth,n=t.clientHeight;let s=i/2-20,r=n/2-20;const p=5,f={},x=v=>{"wasd".includes(v.key.toLowerCase())&&(f[v.key.toLowerCase()]=v.type==="keydown",v.preventDefault())};window.addEventListener("keydown",x),window.addEventListener("keyup",x);let $;function k(){f.a&&(s-=p),f.d&&(s+=p),f.w&&(r-=p),f.s&&(r+=p),s=Math.max(0,Math.min(s,i-40)),r=Math.max(0,Math.min(r,n-40)),e.fillStyle="#0b0d10",e.fillRect(0,0,i,n),e.fillStyle="#ff6b35",e.fillRect(s,r,40,40),$=requestAnimationFrame(k)}return k(),()=>{cancelAnimationFrame($),window.removeEventListener("keydown",x),window.removeEventListener("keyup",x)}}const O=1200,B=540,de=140,Z=B+de,Q=42,Y=54,Me=7,Fe=8,Oe=.35,We=2.2,Ne=.5,Ue=1.55,qe=1.9,G=240,re=[[0,470,340,70],[420,470,200,70],[680,420,160,120],[880,350,100,190],[1040,470,160,70],[920,280,80,16]],De=`
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
  aspect-ratio: ${O} / ${Z};
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
`;function He(){if(document.getElementById("mario-jump-styles"))return;const t=document.createElement("style");t.id="mario-jump-styles",t.textContent=De,document.head.appendChild(t)}function Ye(t){He();const e=t.getContext("2d"),i=Math.max(1,Math.min(3,window.devicePixelRatio||1));let n=0,s=0;function r(){const a=t.getBoundingClientRect();a.width<1||a.height<1||(n=a.width,s=a.height,t.width=Math.round(n*i),t.height=Math.round(s*i))}const p=new ResizeObserver(r);p.observe(t),r();const f=new Image;f.src="img/claude-sprite.png";let x=!1;f.onload=()=>{x=!0};const $=new Image;$.src="img/playground-backdrop.png";let k=!1;$.onload=()=>{k=!0};const v={gravity:.65,jumpStrength:13.5,moveSpeed:5,airControl:1,realisticMode:!1,variableJump:!0,coyoteTime:!0,jumpBuffer:!0,apexHang:!0,asymmetricGravity:!0,fastFall:!0},_={...v},j=["variableJump","coyoteTime","jumpBuffer","apexHang","asymmetricGravity","fastFall"],o={x:80,y:470-Y,vx:0,vy:0,facing:1,squash:1},d={onGround:!1,coyote:0,buffer:0,currentGravity:v.gravity,jumpPressedThisFrame:!1,releasedJumpInRise:!1},S={vy:new Float32Array(G),ay:new Float32Array(G),y:new Float32Array(G),head:0};function c(){S.vy[S.head]=o.vy,S.ay[S.head]=d.currentGravity,S.y[S.head]=o.y,S.head=(S.head+1)%G}function m(){o.x=80,o.y=470-Y,o.vx=0,o.vy=0,o.facing=1,o.squash=1,d.onGround=!1,d.coyote=0,d.buffer=0,d.releasedJumpInRise=!1,S.vy.fill(0),S.ay.fill(0),S.y.fill(o.y),S.head=0}const u={left:!1,right:!1,jump:!1,down:!1},C={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"jump",w:"jump"," ":"jump",arrowdown:"down",s:"down"};let b=!1;function W(a){if(!b)return;const y=a.key.toLowerCase();if(y==="r"&&a.type==="keydown"){m(),a.preventDefault(),a.stopImmediatePropagation();return}const g=C[y];if(!g)return;const T=a.type==="keydown";g==="jump"&&(T&&!u.jump&&(d.jumpPressedThisFrame=!0),!T&&u.jump&&o.vy<0&&(d.releasedJumpInRise=!0)),u[g]=T,a.preventDefault(),a.stopImmediatePropagation()}window.addEventListener("keydown",W,!0),window.addEventListener("keyup",W,!0),t.setAttribute("tabindex","0"),t.style.outline="none";const J=()=>{b=!0,t.style.boxShadow="inset 0 0 0 2px rgba(255,107,53,0.6)"},q=()=>{b=!1,t.style.boxShadow="",u.left=u.right=u.jump=u.down=!1};t.addEventListener("focus",J),t.addEventListener("blur",q);const X=()=>t.focus();t.addEventListener("pointerdown",X);function D(a,y,g){return`<label class="pg-toggle">
      <input type="checkbox" data-cfg="${a}" ${v[a]?"checked":""} />
      <span class="pg-toggle__label">${y}</span>
      <span class="pg-toggle__desc">${g}</span>
    </label>`}function z(a,y,g,T,E,R=A=>A.toFixed(2)){return`<label class="pg-slider">
      <span class="pg-slider__label">${E}</span>
      <span class="pg-slider__value" data-for="${a}">${R(v[a])}</span>
      <input type="range" data-cfg="${a}" min="${y}" max="${g}" step="${T}" value="${v[a]}" />
    </label>`}const L=document.createElement("div");L.className="playground-ui",L.innerHTML=`
    <div class="pg-section">
      <div class="pg-heading">Tricks</div>
      ${D("realisticMode","Realistic (no tricks)","Pure parabolic physics. Try this first — feel how committed it is.")}
      ${D("variableJump","Variable jump height","Release jump early → shorter jump.")}
      ${D("coyoteTime","Coyote time","Jump within ~7 frames of leaving a ledge.")}
      ${D("jumpBuffer","Jump buffer","Press jump ~8 frames before landing → still fires.")}
      ${D("apexHang","Apex hangtime","Near the peak, gravity halves. Floaty, controllable.")}
      ${D("asymmetricGravity","Asymmetric gravity","Falls faster than it rises. Snappy.")}
      ${D("fastFall","Fast fall","Hold ↓ or S in air → accelerates down.")}
    </div>
    <div class="pg-section">
      <div class="pg-heading">Tuning</div>
      ${z("gravity",.1,2,.05,"Gravity")}
      ${z("jumpStrength",5,22,.5,"Jump strength",a=>a.toFixed(1))}
      ${z("moveSpeed",1,10,.5,"Move speed",a=>a.toFixed(1))}
      ${z("airControl",0,1,.05,"Air control")}
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
  `;const H={vx:L.querySelector("[data-stat=vx]"),vy:L.querySelector("[data-stat=vy]"),ay:L.querySelector("[data-stat=ay]"),ground:L.querySelector("[data-stat=ground]"),coyote:L.querySelector("[data-stat=coyote]"),buffer:L.querySelector("[data-stat=buffer]")};L.querySelectorAll("input[data-cfg]").forEach(a=>{a.addEventListener("input",()=>{const y=a.dataset.cfg;if(a.type==="checkbox"){if(_[y]=a.checked,y==="realisticMode"&&a.checked&&j.forEach(g=>{_[g]=!1;const T=L.querySelector(`input[data-cfg="${g}"]`);T&&(T.checked=!1)}),j.includes(y)&&a.checked&&_.realisticMode){_.realisticMode=!1;const g=L.querySelector('input[data-cfg="realisticMode"]');g&&(g.checked=!1)}}else{const g=parseFloat(a.value);_[y]=g;const T=L.querySelector(`.pg-slider__value[data-for="${y}"]`);T&&(T.textContent=Number.isInteger(g*2)?g.toFixed(1):g.toFixed(2))}})}),L.querySelector(".pg-reset").addEventListener("click",m);const ee=t.closest(".demo__split");ee.classList.add("playground-wrap"),ee.appendChild(L);function he(a,y,g,T,E,R,A,w){return a<E+A&&a+g>E&&y<R+w&&y+T>R}function ae(a,y,g){return a+(y-a)*g}function ke(a){let y=0;u.left&&(y-=_.moveSpeed),u.right&&(y+=_.moveSpeed);const g=d.onGround?1:_.airControl;o.vx=ae(o.vx,y,Math.min(1,.3*g*a)),Math.abs(y)>.2&&(o.facing=Math.sign(y)),d.jumpPressedThisFrame&&(d.buffer=_.jumpBuffer?Fe:1),d.buffer=Math.max(0,d.buffer-a);const T=d.onGround||_.coyoteTime&&d.coyote>0;d.buffer>0&&T&&(o.vy=-_.jumpStrength,d.buffer=0,d.coyote=0,d.onGround=!1,d.releasedJumpInRise=!1,o.squash=1.2),_.variableJump&&d.releasedJumpInRise&&o.vy<0&&(o.vy*=Oe,d.releasedJumpInRise=!1),u.jump||(d.releasedJumpInRise=!1);let E=_.gravity;const R=!_.realisticMode;R&&_.apexHang&&Math.abs(o.vy)<We&&(E*=Ne),R&&_.asymmetricGravity&&o.vy>0&&(E*=Ue),R&&_.fastFall&&u.down&&o.vy>0&&(E*=qe),d.currentGravity=E,o.vy+=E*a,o.vy>18&&(o.vy=18),o.x+=o.vx*a;for(const[w,I,P,N]of re)he(o.x,o.y,Q,Y,w,I,P,N)&&(o.vx>0?o.x=w-Q:o.vx<0&&(o.x=w+P),o.vx=0);const A=d.onGround;d.onGround=!1,o.y+=o.vy*a;for(const[w,I,P,N]of re)if(he(o.x,o.y,Q,Y,w,I,P,N)){if(o.vy>0){if(o.y=I-Y,d.onGround=!0,!A){const K=Math.min(1,o.vy/16);o.squash=ae(1,.7,K)}}else o.vy<0&&(o.y=I+N);o.vy=0}A&&!d.onGround&&o.vy>=0?d.coyote=Me:d.coyote>0&&!d.onGround?d.coyote=Math.max(0,d.coyote-a):d.onGround&&(d.coyote=0),o.squash=ae(o.squash,1,Math.min(1,.2*a)),(o.y>B+200||o.x<-300||o.x>O+300)&&m(),d.jumpPressedThisFrame=!1,c()}let _e=0;function xe(){if(++_e%4!==0)return;const a=y=>y>=0?"+":"";H.vx.textContent=`${a(o.vx)}${o.vx.toFixed(2)}`,H.vy.textContent=`${a(o.vy)}${o.vy.toFixed(2)}`,H.ay.textContent=`${a(d.currentGravity)}${d.currentGravity.toFixed(2)}`,H.ground.textContent=d.onGround?"yes":"no",H.ground.className=d.onGround?"good":"muted",H.coyote.textContent=d.coyote.toFixed(0),H.coyote.className=d.coyote>0?"accent":"muted",H.buffer.textContent=d.buffer.toFixed(0),H.buffer.className=d.buffer>0?"accent":"muted"}function Te(){if(k){const A=$.width/$.height,w=O/B;let I,P,N,K;A>w?(P=B,I=P*A,N=(O-I)/2,K=0):(I=O,P=I/A,N=0,K=(B-P)/2),e.drawImage($,N,K,I,P)}else{const A=e.createLinearGradient(0,0,0,B);A.addColorStop(0,"#0b0d10"),A.addColorStop(1,"#2a1f1a"),e.fillStyle=A,e.fillRect(0,0,O,B)}for(const[A,w,I,P]of re)e.fillStyle="#b78363",e.fillRect(A,w,I,P),e.fillStyle="#f1c591",e.fillRect(A,w,I,5),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(A+I-3,w,3,P),e.fillStyle="#8a5a3a",e.fillRect(A,w+5,I,2);e.save();const a=o.x+Q/2,y=o.y+Y;e.translate(a,y);let g=o.squash,T=1/o.squash;if(!d.onGround){const A=Math.max(-.15,Math.min(.22,-o.vy/80));g*=1+A,T*=1-A*.6}e.scale(T*o.facing,g);const E=Q*2,R=Y*2;x?e.drawImage(f,-E/2,-R*.92,E,R):(e.fillStyle="#d97757",e.fillRect(-Q/2,-Y,Q,Y)),e.restore()}function Se(){const a=B,y=12,g=3,T=12,E=(O-y*2-T*(g-1))/g,R=de-y*2;e.fillStyle="rgba(11, 13, 16, 0.85)",e.fillRect(0,a,O,de),e.fillStyle="rgba(255,255,255,0.06)",e.fillRect(0,a,O,1),[{label:"y (position)",data:S.y,color:"#6fb3d2",min:0,max:B,invert:!0,zeroLine:!1},{label:"vy (velocity)",data:S.vy,color:"#ff6b35",min:-22,max:22,invert:!1,zeroLine:!0},{label:"ay (accel/grav)",data:S.ay,color:"#98c379",min:0,max:3,invert:!1,zeroLine:!1}].forEach((w,I)=>{const P=y+I*(E+T);if(e.fillStyle="rgba(255,255,255,0.04)",e.fillRect(P,a+y,E,R),e.font="12px ui-monospace, monospace",e.textBaseline="top",e.fillStyle="rgba(255,255,255,0.55)",e.fillText(w.label,P+8,a+y+6),w.zeroLine){const V=a+y+R*((0-w.min)/(w.max-w.min));e.fillStyle="rgba(255,255,255,0.15)",e.fillRect(P,V,E,1)}e.strokeStyle=w.color,e.lineWidth=1.5,e.beginPath();for(let V=0;V<G;V++){const $e=(S.head+V)%G,Re=w.data[$e],Ce=V/(G-1),me=Math.max(0,Math.min(1,(Re-w.min)/(w.max-w.min))),Le=w.invert?me:1-me,ge=P+Ce*E,be=a+y+Le*R;V===0?e.moveTo(ge,be):e.lineTo(ge,be)}e.stroke();const N=(S.head-1+G)%G,K=w.data[N],ye=Math.max(0,Math.min(1,(K-w.min)/(w.max-w.min))),Ee=w.invert?ye:1-ye,Pe=P+E-1,Ie=a+y+Ee*R;e.fillStyle=w.color,e.beginPath(),e.arc(Pe,Ie,3,0,Math.PI*2),e.fill()})}function Ae(){if(n<1||s<1)return;e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,t.width,t.height);const a=Math.min(n/O,s/Z),y=(n-O*a)/2,g=(s-Z*a)/2,T=a*i;e.setTransform(T,0,0,T,y*i,g*i),e.imageSmoothingEnabled=!1,Te(),Se(),b||(e.fillStyle="rgba(0,0,0,0.45)",e.fillRect(0,0,O,Z),e.fillStyle="#ffe6d4",e.font="bold 28px ui-monospace, monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("click to play",O/2,Z/2),e.textAlign="start")}let se,pe=performance.now();function ue(a){const y=Math.min(40,a-pe);pe=a;const g=y/(1e3/60);ke(g),xe(),Ae(),se=requestAnimationFrame(ue)}return se=requestAnimationFrame(ue),()=>{cancelAnimationFrame(se),window.removeEventListener("keydown",W,!0),window.removeEventListener("keyup",W,!0),t.removeEventListener("focus",J),t.removeEventListener("blur",q),t.removeEventListener("pointerdown",X),p.disconnect(),L.remove(),ee&&ee.classList.remove("playground-wrap"),t.style.boxShadow=""}}const Ge={"moving-square":je,"mario-jump":Ye};let te=null;function Be(t){if(te&&(te(),te=null),!t)return;const e=t.querySelector(".demo__canvas"),i=t.getAttribute("data-demo");if(!e||!i)return;const n=Ge[i];if(!n){console.warn(`[demo] unknown demo: ${i}`);return}te=n(e)||null}let ne=null;function Je(t){if(ne&&(ne(),ne=null),!(t!=null&&t.hasAttribute("data-interactive-code")))return;const e=t.querySelector(".icode");if(!e)return;const i=[...t.querySelectorAll(".icode__line[data-region]")],n=[...t.querySelectorAll(".icode__ann[data-region]")],s=[...t.querySelectorAll(".icode-tip")],r=[...new Set(i.map(c=>c.dataset.region).filter(Boolean))],p=new Set;let f=null,x=null,$=!1,k=null;function v(){const c=f!==null;e.classList.toggle("icode--has-active",c),e.classList.toggle("icode--has-revealed",p.size>0);for(const m of i){const u=m.dataset.region;u&&(m.classList.toggle("icode__line--active",u===f),m.classList.toggle("icode__line--revealed",p.has(u)))}for(const m of n){const u=m.dataset.region;m.classList.toggle("icode__ann--active",u===f),m.classList.toggle("icode__ann--revealed",p.has(u))}}function _(){$||p.size>=r.length&&($=!0,e.classList.add("icode--complete"),setTimeout(()=>e.classList.remove("icode--complete"),900))}v();function j(c){var m,u;if(!((m=c.target)!=null&&m.isContentEditable||/input|textarea/i.test((u=c.target)==null?void 0:u.tagName))){if(c.key>="1"&&c.key<="9"){const C=parseInt(c.key)-1;if(C>=r.length)return;c.preventDefault();const b=r[C];f===b?(f=null,x=null):(p.add(b),f=b,x=b,_()),v();return}if(c.key==="0"||c.key==="Escape"){(f||x)&&(c.preventDefault(),f=null,x=null,v());return}}}addEventListener("keydown",j);const o=[];for(const c of i){const m=c.dataset.region;if(!m)continue;const u=()=>{!x&&p.has(m)&&(f=m,v())},C=()=>{x||(f=null,v())};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),o.push({el:c,events:{mouseenter:u,mouseleave:C}})}for(const c of n){const m=c.dataset.region,u=()=>{!x&&p.has(m)&&(f=m,v())},C=()=>{x||(f=null,v())},b=()=>{x===m?(x=null,f=null):(p.add(m),x=m,f=m,_()),v()};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),c.addEventListener("click",b),o.push({el:c,events:{mouseenter:u,mouseleave:C,click:b}})}function d(c){S();const m=c.dataset.tipSig||"",u=c.dataset.tipDesc||"",C=c.dataset.tipUrl||"";if(!m&&!u)return;const b=document.createElement("div");b.className="icode-tooltip",b.innerHTML=[m?`<code class="icode-tooltip__sig">${le(m)}</code>`:"",u?`<div class="icode-tooltip__desc">${le(u)}</div>`:"",C?`<a class="icode-tooltip__link" href="${le(C)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),e.appendChild(b),e.style.position="relative";let W=0,J=0,q=c;for(;q&&q!==e;)W+=q.offsetTop,J+=q.offsetLeft,q=q.offsetParent;b.style.left=Math.max(0,J)+"px",b.style.visibility="hidden";const X=b.offsetHeight,D=b.offsetWidth;W-X-10<0?(b.style.top=W+c.offsetHeight+8+"px",b.classList.add("icode-tooltip--below")):b.style.top=W-X-8+"px";const z=e.offsetWidth-D-8;parseInt(b.style.left)>z&&(b.style.left=Math.max(0,z)+"px"),b.style.visibility="",k=b}function S(){k&&(k.remove(),k=null)}for(const c of s){const m=()=>d(c),u=()=>S();c.addEventListener("mouseenter",m),c.addEventListener("mouseleave",u),o.push({el:c,events:{mouseenter:m,mouseleave:u}})}ne=()=>{removeEventListener("keydown",j);for(const c of o)for(const[m,u]of Object.entries(c.events))c.el.removeEventListener(m,u);S(),f=null,x=null,e.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const c of i)c.classList.remove("icode__line--active","icode__line--revealed");for(const c of n)c.classList.remove("icode__ann--active","icode__ann--revealed")}}function le(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const ze=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",ze);class Ke extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const e=document.createElement("div");for(e.className="deck__stage";this.firstChild;)e.appendChild(this.firstChild);this.appendChild(e),this._stage=e,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",i=>this._onKey(i)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const i=new URLSearchParams(location.search).get("unit");let n=Array.from(this._stage.querySelectorAll(".slide"));i&&(n=n.filter(s=>s.getAttribute("data-unit")===i),this._stage.querySelectorAll(".slide").forEach(s=>{n.includes(s)||s.remove()})),this._slides=n}_buildFooter(){const e=document.createElement("div");e.className="deck__footer",e.innerHTML=`
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
    `,document.body.appendChild(e),this._help=e}_readHashIndex(){var n;const e=location.hash.match(/^#(\d+)/);if(!e)return 0;const i=parseInt(e[1],10)-1;return Math.max(0,Math.min(i,(((n=this._slides)==null?void 0:n.length)||1)-1))}_show(e){if(!this._slides.length||e<0||e>=this._slides.length)return;this._index=e;const i=this._slides.length;this._slides.forEach(($,k)=>{k===e?$.setAttribute("data-active",""):$.removeAttribute("data-active")});const n=this._slides[e],s=n.getAttribute("data-unit")||"",r=n.getAttribute("data-tag")||"",p=n.getAttribute("data-total")||"12",f=[];s&&f.push(`UNIT ${s} / ${p}`),r&&f.push(r);const x=f.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=x),this._fNum&&(this._fNum.textContent=`${String(e+1).padStart(2,"0")} / ${String(i).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(e+1)/i*100}%`),location.hash!==`#${e+1}`&&history.replaceState(null,"",`#${e+1}`),Be(n),Je(n),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:e,slide:n}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(e){if(!(e.target&&e.target.isContentEditable)&&!(e.target&&/input|textarea/i.test(e.target.tagName))){if(e.ctrlKey&&e.shiftKey&&(e.key==="E"||e.key==="e")){e.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(e.key){case"ArrowRight":case" ":case"PageDown":e.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":e.preventDefault(),this._prev();break;case"Home":e.preventDefault(),this._show(0);break;case"End":e.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":e.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const i=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("deck-theme",i)}_scale(){const e=innerWidth,i=innerHeight,n=Math.min(e/1920,i/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${n})`}}customElements.get("deck-root")||customElements.define("deck-root",Ke);const Ve=["B","I","EM","STRONG","BR"],Qe=new Set(Ve),Xe=new Set(["BR"]);function l(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function U(t){if(t==null)return"";const e=document.createElement("template");return e.innerHTML=String(t),ce(e.content)}function ce(t){let e="";for(const i of t.childNodes)if(i.nodeType===Node.TEXT_NODE)e+=l(i.nodeValue);else if(i.nodeType===Node.ELEMENT_NODE){const n=i.tagName;if(Qe.has(n)){const s=n.toLowerCase();Xe.has(n)?e+=`<${s}>`:e+=`<${s}>${ce(i)}</${s}>`}else e+=ce(i)}return e}const Ze=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),et=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),fe=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function M(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ie(t){if(t==null)return"";let e="",i=0,n=null,s;for(fe.lastIndex=0;(s=fe.exec(t))!==null;){if(s.index>i){const p=t.slice(i,s.index);e+=M(p),/\S/.test(p)&&(n=null)}const r=s.groups;if(r.comment)e+=`<span class="tok-comment">${M(r.comment)}</span>`,n=null;else if(r.tstring)e+=`<span class="tok-string">${M(r.tstring)}</span>`,n=null;else if(r.fstring)e+=`<span class="tok-string">${M(r.fstring)}</span>`,n=null;else if(r.string)e+=`<span class="tok-string">${M(r.string)}</span>`,n=null;else if(r.decorator)e+=`<span class="tok-decorator">${M(r.decorator)}</span>`,n=null;else if(r.number)e+=`<span class="tok-number">${M(r.number)}</span>`,n=null;else if(r.word){const p=r.word;n==="function"?(e+=`<span class="tok-function-def">${M(p)}</span>`,n=null):n==="class"?(e+=`<span class="tok-class-def">${M(p)}</span>`,n=null):Ze.has(p)?(e+=`<span class="tok-keyword">${M(p)}</span>`,p==="def"?n="function":p==="class"?n="class":n=null):et.has(p)?(e+=`<span class="tok-builtin">${M(p)}</span>`,n=null):(e+=M(p),n=null)}i=s.index+s[0].length}return i<t.length&&(e+=M(t.slice(i))),e}function we(t){const e=(t||"").split(`
`).length;return e>=20?"xs":e>=14?"sm":e>=10?"md":"lg"}function tt(t,e){return e.map(i=>nt(i,t)).join(`
`)}function nt(t,e){const i=it[t.type];return i?i(t,e):`<div class="slide"><div class="slide__body">Unknown slide type: ${l(t.type)}</div></div>`}function h(t,e,i){return`data-edit="${t}/${e}/${i}"`}function oe(t,e,i){return`data-edit-list="${t}/${e}/${i}"`}function F(t,e,i="",n=""){return`<div class="slide ${i}" data-slide-type="${l(t.type)}" data-edit-slide="${l(e.id)}/${l(t.id)}" data-unit="${l(e.id)}" data-tag="${l(e.tag||"")}" data-total="${l(e.total||"")}"${n?" "+n:""}>`}const it={section(t,e){return`${F(t,e,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${h(e.id,t.id,"kicker")}>${l(t.kicker||"Unit")}</span>
            <span ${h(e.id,t.id,"number")}>${l(t.number||"")}</span>
          </div>
          <h2 class="section__title" ${h(e.id,t.id,"title")}>${l(t.title||"")}</h2>
        </div>
      </div>
    </div>`},title(t,e){return`${F(t,e,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${h(e.id,t.id,"title")}>${l(t.title||"")}</h1>
          <div class="title-slide__subtitle" ${h(e.id,t.id,"subtitle")}>${l(t.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(t,e){const i=(t.items||[]).map((n,s)=>`<li ${h(e.id,t.id,`items[${s}]`)}>${U(n)}</li>`).join("");return`${F(t,e,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${h(e.id,t.id,"heading")}>${l(t.heading||"")}</h2>
          ${t.lead?`<p class="bullets__lead" ${h(e.id,t.id,"lead")}>${U(t.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${h(e.id,t.id,"lead")}></p>`}
          <ul class="bullets__list" ${oe(e.id,t.id,"items")}>${i}</ul>
        </div>
      </div>
    </div>`},question(t,e){return`${F(t,e,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${h(e.id,t.id,"question")}>${l(t.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(t,e){const i=n=>{const s=t[n]||{title:"",items:[]},r=(s.items||[]).map((p,f)=>`<li ${h(e.id,t.id,`${n}.items[${f}]`)}>${U(p)}</li>`).join("");return`<div class="split__col">
        <h3 ${h(e.id,t.id,`${n}.title`)}>${l(s.title||"")}</h3>
        <ul ${oe(e.id,t.id,`${n}.items`)}>${r}</ul>
      </div>`};return`${F(t,e,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${h(e.id,t.id,"heading")}>${l(t.heading||"")}</h2>
          <div class="split__cols">
            ${i("left")}
            ${i("right")}
          </div>
        </div>
      </div>
    </div>`},prose(t,e){return`${F(t,e,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${t.eyebrow?`<div class="prose__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow)}</div>`:`<div class="prose__eyebrow" ${h(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="prose__heading" ${h(e.id,t.id,"heading")}>${l(t.heading)}</h2>`:""}
          <p class="prose__body" ${h(e.id,t.id,"body")}>${U(t.body||"")}</p>
        </div>
      </div>
    </div>`},concept(t,e){const i=t.diagram||"";return`${F(t,e,"slide--concept")}
      <div class="slide__body">
        <div class="concept">
          ${t.eyebrow?`<div class="concept__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow)}</div>`:""}
          <h2 class="concept__statement" ${h(e.id,t.id,"statement")}>${U(t.statement||"")}</h2>
          <div class="concept__diagram">${i}</div>
          ${t.caption?`<div class="concept__caption" ${h(e.id,t.id,"caption")}>${U(t.caption)}</div>`:""}
        </div>
      </div>
    </div>`},image(t,e){const i=t.fit==="contain"?"contain":"cover",n=l(t.src||""),s=l(t.alt||"");return`${F(t,e,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${i}">
          <img src="${n}" alt="${s}" />
          ${t.caption?`<div class="image-slide__caption" ${h(e.id,t.id,"caption")}>${U(t.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${h(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(t,e){const i=l(t.demo||""),n=!!t.code,s=n?ie(t.code):"",r=n?t.code.split(`
`).length:0;return`${F(t,e,`slide--demo${n?" slide--demo-with-code":""}`,`data-demo="${i}"`)}
      <div class="slide__body">
        <div class="demo">
          ${t.eyebrow?`<div class="demo__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="demo__heading" ${h(e.id,t.id,"heading")}>${l(t.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${t.hint?`<div class="demo__hint" ${h(e.id,t.id,"hint")}>${l(t.hint)}</div>`:""}
            </div>
            ${n?`<div class="demo__code-side">
              <div class="demo__line-count">${r} lines</div>
              <pre class="demo__code"><code ${h(e.id,t.id,"code")}>${s}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(t,e){const i=(t.language||"python").toLowerCase(),n=i==="python"?ie(t.code||""):l(t.code||""),s=we(t.code||"");return`${F(t,e,`slide--code slide--code-${s}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${t.eyebrow?`<div class="code-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${h(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="code-slide__heading" ${h(e.id,t.id,"heading")}>${l(t.heading)}</h2>`:`<h2 class="code-slide__heading" ${h(e.id,t.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${l(i)}"><code ${h(e.id,t.id,"code")}>${n}</code></pre>
          ${t.caption?`<div class="code-slide__caption" ${h(e.id,t.id,"caption")}>${U(t.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${h(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(t,e){const i=t.regions||[],n=t.tooltips||{},s=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,r={};for(const k of i)for(let v=k.lines[0];v<=k.lines[1];v++)r[v]=k;const p=Object.keys(n).sort((k,v)=>v.length-k.length),x=(t.code||"").split(`
`).map((k,v)=>{const _=v+1,j=r[_];let o=ie(k)||" ";for(const u of p){const C=u.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=n[u],J=typeof b=="object"?`data-tip-sig="${l(b.sig||"")}" data-tip-desc="${l(b.desc||"")}" data-tip-url="${l(b.url||"")}"`:`data-tip-sig="" data-tip-desc="${l(b)}" data-tip-url=""`;o=o.replace(new RegExp(C),`<span class="icode-tip" ${J}>${u}</span>`)}const d=j?j.id:"",S=j?j.color:"transparent";return`<div class="${`icode__line${s.test(k)?" icode__line--divider":""}`}" data-region="${d}" data-line="${_}" style="--rc:${S}"><span class="icode__line-num">${_}</span>${o}</div>`}).join(""),$=i.map((k,v)=>{const _=(k.links||[]).map(j=>`<a href="${l(j.url)}" target="_blank" rel="noopener">→ ${l(j.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${l(k.id)}" style="--rc:${l(k.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${l(k.label)}</div>
            <div class="icode__ann-key">${v+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${l(k.description)}</div>
            <div class="icode__ann-detail">${l(k.detail||"")}${_?`<div class="icode__ann-links">${_}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${F(t,e,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${t.heading?`<h2 class="icode__heading" ${h(e.id,t.id,"heading")}>${l(t.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${i.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${x}</pre>
            <div class="icode__annotations">${$}</div>
          </div>
          ${t.subtitle?`<div class="icode__subtitle" ${h(e.id,t.id,"subtitle")}>${l(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(t,e){const i=ie(t.code||""),n=we(t.code||""),s=(t.annotations||[]).map((r,p)=>`<li ${h(e.id,t.id,`annotations[${p}]`)}>${U(r)}</li>`).join("");return`${F(t,e,`slide--annotated-code slide--acode-${n}`)}
      <div class="slide__body">
        <div class="acode">
          ${t.eyebrow?`<div class="acode__eyebrow" ${h(e.id,t.id,"eyebrow")}>${l(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="acode__heading" ${h(e.id,t.id,"heading")}>${l(t.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${h(e.id,t.id,"code")}>${i}</code></pre>
            <ol class="acode__annotations" ${oe(e.id,t.id,"annotations")}>${s}</ol>
          </div>
          ${t.subtitle?`<div class="acode__subtitle" ${h(e.id,t.id,"subtitle")}>${l(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(t,e){const i=(t.items||[]).map((n,s)=>`<li ${h(e.id,t.id,`items[${s}]`)}>${U(n)}</li>`).join("");return`${F(t,e,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${h(e.id,t.id,"heading")}>${l(t.heading||"")}</h2>
          <ol class="live__list" ${oe(e.id,t.id,"items")}>${i}</ol>
        </div>
      </div>
    </div>`}},ot={id:"01",number:"01",tag:"OPENING THE BOX",total:"12"},at=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"Opening the Box"},{id:"welcome",type:"title",eyebrow:"Game Programmierung  ·  SS26",title:"Welcome.",subtitle:"Twelve weeks to build a real game without an engine. Let's take a look under the hood."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your laptop</b> — Python, Git, and your codebase. Every session.","<b>Short input, long workshop.</b>","<b>Find a partner / rubberduck.</b>","<b>Four exercises.</b> Mandatory part of your grade.","<b>Ask early.</b>"]},{id:"why-question",type:"question",eyebrow:"Question for the room",question:"Why would anyone write a game without an engine"},{id:"why-answer",type:"image",src:"/img/shoggoth.avif",alt:"The Shoggoth — a lovecraftian mass of eyes and tentacles",caption:"To understand the Shoggoth.",fit:"contain"},{id:"today",type:"demo",eyebrow:"TODAY",heading:"A program where you move a shape when you press a button.",demo:"moving-square",hint:"WASD to move",code:`import pygame
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
git push`,regions:[{id:"snapshot",label:"snapshot",lines:[1,4],color:"#c390d4",description:"Take a snapshot of your project right now.",detail:"git init creates a hidden .git/ folder that tracks every change. git add . stages all files — tells git 'include these in the next snapshot'. git commit saves the snapshot with a message. These three commands create your first checkpoint. You can always return to this exact state.",links:[{label:"git basics",url:"https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F"}]},{id:"connect",label:"connect to github",lines:[6,9],color:"#7fd1c8",description:"Link your local project to GitHub so we can see it.",detail:"Create a new repository on github.com (the green '+' button, top right). Don't add a README — you already have files. Copy the URL it gives you. git remote add origin tells your local repo where to push. git push -u origin main uploads everything and sets up tracking. After this, your code is online and we can grade it."},{id:"daily",label:"the daily loop",lines:[11,14],color:"#98c379",description:"Add, commit, push. Every session, every feature.",detail:"After each coding session: add stages your changes, commit saves them with a message, push uploads to GitHub. Write messages that say what changed — 'add enemy spawning' not 'update' or 'stuff'. If you prefer clicking to typing: GitHub Desktop, Fork, or the Git panel built into VS Code all do the same thing with buttons.",links:[{label:"GitHub Desktop",url:"https://desktop.github.com/"}]}],tooltips:{"git init":{sig:"git init",desc:"Creates a new git repository in the current folder. Adds a hidden .git/ directory that tracks all changes. Run once per project.",url:"https://git-scm.com/docs/git-init"},"git add":{sig:"git add <files>",desc:"Stages files for the next commit. 'git add .' stages everything in the current directory. Staging is like putting items in a box before sealing it.",url:"https://git-scm.com/docs/git-add"},"git commit":{sig:'git commit -m "message"',desc:"Saves a snapshot of all staged changes with a descriptive message. Each commit is a checkpoint you can return to. Commits are local until you push.",url:"https://git-scm.com/docs/git-commit"},"git push":{sig:"git push",desc:"Uploads local commits to the remote repository (GitHub). After pushing, your code is online and visible to others. The -u flag sets up tracking so future pushes don't need extra arguments.",url:"https://git-scm.com/docs/git-push"},"git remote":{sig:"git remote add origin <url>",desc:"Connects your local repository to a remote one. 'origin' is the conventional name for your primary remote. The URL points to your GitHub repo.",url:"https://git-scm.com/docs/git-remote"}}},{id:"homework",type:"bullets",heading:"For next Friday",lead:"You built hello-square in class. Now make it yours.",items:["<b>Set up git. Make a public repo. Post the link.</b>","<b>Extend hello-square.</b> Pick one: wrap around the edges, change color on Space, add a second shape — or surprise us. We show them off next Friday. Coolest thing wins a prize.","Sleep."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],st={meta:ot,slides:at},rt={id:"02",number:"02",tag:"HOW COMPUTERS THINK",total:"31"},lt=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"How Computers Think"},{id:"showcase",type:"question",eyebrow:"Homework",question:"Show us your squares"},{id:"today",type:"bullets",heading:"Today.",lead:"How does a computer think?",items:["Seven basic concepts.","Then we play a game where <b>you are the computer</b>."]},{id:"concept-variable",type:"prose",eyebrow:"Concept 01",heading:"Variable",body:"A <b>name</b> attached to a <b>value</b>.<br><br>A labeled slot that holds something. The label stays. The value can change.<br><br>Last week: <b>x = 400</b> was a variable. Your square's position."},{id:"concept-type",type:"bullets",heading:"Concept 02 — Type",lead:"What kind of thing is in the slot.",items:["<b>int</b> — whole numbers. <b>42</b>, <b>-7</b>, <b>0</b>","<b>float</b> — decimal numbers. <b>3.14</b>, <b>0.5</b>, <b>-2.0</b>",'<b>str</b> — text. <b>"hello"</b>, <b>"Game Over"</b>',"<b>bool</b> — true or false. <b>True</b>, <b>False</b>. That's it.",'The computer cares. <b>"3"</b> is not the same as <b>3</b>.']},{id:"concept-expression",type:"prose",eyebrow:"Concept 03",heading:"Expression",body:'Anything that <b>produces a value</b>.<br><br><b>3 + 4</b> is an expression. <b>x > 10</b> is an expression. <b>"hello" + " world"</b> is an expression.<br><br>Every time the computer needs an answer, it <i>evaluates</i> an expression.'},{id:"concept-conditional",type:"code",eyebrow:"Concept 04 — Conditional",heading:"Making decisions.",code:`if something_is_true:
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
print(result)`,caption:"Team B's cards were theirs. Team A never saw them. That's <b>scope</b> — local variables exist only inside the function. The <b>def</b> block is read but not run until called.",language:"python"},{id:"game-debrief",type:"bullets",heading:"What just happened",lead:"You were a computer. Each role maps to a real part.",items:["<b>Interpreter</b> → Control Unit. Reads instructions, directs everything — including jumps.","<b>Memory</b> → RAM. Named slots that hold values.","<b>ALU</b> → Arithmetic Logic Unit. Math and decisions. One chip, two jobs.","<b>Screen</b> → Standard output (<b>print()</b>). The only thing the outside world sees.","There was no Counter. A loop is just <b>a variable, a comparison, and a jump</b> — built from parts you already had. Python's <b>for i in range()</b> wraps that pattern into one line.","What was annoying? What was slow? What was boring? <b>Those are the things computers are good at.</b>"]},{id:"uebung",type:"bullets",heading:"Uebung 001",lead:"Due next Friday. 10 Punkte.",items:["<b>Schleifen (5P):</b> Zaehle alle Ganzzahlen zwischen 437 und 32482 zusammen. Print das Ergebnis.","<b>Funktionen (5P):</b> Schreibe eine Funktion mit zwei float-Parametern. Teile den kleineren durch den groesseren. Wenn gleich: gib 1 zurueck.","Repo: <b>github.com/BabyToad/macromedia-game-programming-ss26</b>"]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],dt={meta:rt,slides:lt},ct={id:"03",number:"03",tag:"PHYSICS & COLLISION",total:"35"},ht=[{id:"section",type:"section",number:"03",kicker:"Unit",title:"Physics & Collision"},{id:"today",type:"bullets",heading:"Today.",lead:"Two halves.",items:["<b>Part 1 — Human Computer.</b> We play the game we set up last week. Two teams. Four roles. You are the machine.","<b>Part 2 — Physics & Collision.</b> How a square falls, and how it stops when it hits a wall.","<b>Ü001 is due.</b> Show us your code."]},{id:"ue001-showcase",type:"question",eyebrow:"Homework",question:"Show us your Ü001"},{id:"hc-intro",type:"bullets",heading:"The Human Computer",lead:"You are the machine. Two teams. Four roles each.",items:["Each team is a complete computer.","Four roles: <b>Interpreter</b>, <b>Memory</b>, <b>ALU</b>, <b>Screen</b>.","You follow scripts written in plain language.","After each round, we reveal the Python equivalent.","What was annoying for you is what computers are <b>good</b> at."]},{id:"hc-role-interpreter",type:"prose",eyebrow:"Role",heading:"The Interpreter",body:'You read the script, line by line, top to bottom. You direct the other roles — they only act when you tell them.<br><br>You may say: <b>"Memory, create/read/update/destroy..."</b> · <b>"ALU, what is...?"</b> · <b>"ALU, is...?"</b> · <b>"Screen, write..."</b> · <b>"Jump to line N"</b> · <b>"Call [recipe name]"</b> · <b>"Return"</b><br><br>You may NOT: do math, hold values, write output, or skip lines without reason.'},{id:"hc-role-memory",type:"prose",eyebrow:"Role",heading:"Memory",body:'You hold the index cards. Each card has a <b>name</b> and a <b>value</b>. You are the only one who touches cards.<br><br>When told, you may:<br>• <b>CREATE</b> a card — write name + value, say "Created [name], value [value]"<br>• <b>READ</b> a card — hold it up, say "[name] is [value]"<br>• <b>UPDATE</b> a card — cross out old value, write new, say "Updated [name] to [value]"<br>• <b>DESTROY</b> a card — tear it up, say "Destroyed [name]"<br><br>You may NOT: do math, make decisions, or act without being told.'},{id:"hc-role-alu",type:"prose",eyebrow:"Role",heading:"ALU (Arithmetic Logic Unit)",body:'You are the calculator <b>AND</b> the decision-maker. ALU = Arithmetic Logic Unit — in a real CPU, this is <b>one chip</b> that handles both math and yes/no decisions.<br><br>When asked a math question (<b>"what is x plus y?"</b>), ask Memory to READ the cards you need, compute the answer, say it out loud.<br>When asked a yes/no question (<b>"is x greater than 10?"</b>), ask Memory to READ the cards you need, answer: <b>"Yes"</b> or <b>"No"</b>. Nothing else.<br><br>You may NOT: hold values, remember previous answers, or volunteer information.'},{id:"hc-role-screen",type:"prose",eyebrow:"Role",heading:"The Screen",body:`You stand at the whiteboard (or hold up a notebook). You are the <b>only part of the computer that the outside world can see</b>.<br><br>When the Interpreter says <b>"Screen, write [value]"</b>, you write it. That's it. You write things in order, top to bottom. Each new write goes on a new line.<br><br>You may NOT: decide what to write, erase, or write without being told.`},{id:"hc-protocol",type:"bullets",heading:"The Protocol",lead:"Strict chain of command. No shortcuts.",items:["The <b>Interpreter</b> reads a line and gives an order. Nobody else initiates.","If the Interpreter needs a value → asks <b>Memory</b> to READ it.","If the Interpreter needs math → asks <b>ALU</b>. ALU asks Memory to READ the cards it needs, computes, says the answer.","If the Interpreter needs a decision → asks <b>ALU</b> a yes/no question. ALU asks Memory to READ, then answers yes or no. The Interpreter picks the path.","If the Interpreter needs output → tells <b>Screen</b> to write.","If something is unclear: <b>stop. Ask the teacher.</b> That's a bug."]},{id:"hc-setup",type:"bullets",heading:"Setup",lead:"Get into position.",items:["Split into <b>two teams of 4</b>. Extra people: you're the <b>Debugger</b> — watch for mistakes.","Each team grabs a stack of <b>index cards</b> and a pen.","Assign roles: Interpreter, Memory, ALU, Screen.","Screen: go to the whiteboard.","Everyone else: sit together. Memory keeps the cards."]},{id:"hc-round0",type:"code",eyebrow:"Round 0 — Dry Run",heading:"Three moves. Get the handshake right.",code:`Interpreter: "Memory, create a card 'name' with value 'Python'"
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

vy += g`,caption:"Real gravity is one number. Game gravity is <i>whatever feels good</i>. These multipliers stack: falling + holding down with apex hang off = <b>0.65 × 1.55 × 1.9 ≈ 1.9</b> per frame. Tune to taste.",language:"python"},{id:"next-week",type:"bullets",heading:"For next Friday",lead:"No new exercise today. Ü002 comes next week.",items:["<b>Try it.</b> Start from your hello-square. Give it velocity and gravity. Make it fall. Add a floor rect. See what breaks.","Next week: <b>Assets & Game Objects.</b> Images, sounds, managing lists of enemies. Ü002 (Jump & Run) gets assigned.","Keep committing. Real messages."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],pt={meta:ct,slides:ht},ut={id:"04",number:"04",tag:"ASSETS & GAME OBJECTS",total:"29"},yt=[{id:"section",type:"section",number:"04",kicker:"Unit",title:"Assets & Game Objects"},{id:"today",type:"bullets",heading:"Today.",lead:"Four kinds of things.",items:["<b>Things you see.</b> Pictures from disk. The end of the green circle.","<b>Things you hear.</b> Sounds from disk. Jumps, pickups, hits.","<b>Many things.</b> A list of pickups. Spawning. Removing. The bug everyone hits.","<b>Things end.</b> A timer, a final score. Game over without closing the window.","<b>Ü002 today.</b> Jump & Run — ten tasks, one point each. Due next Friday."]},{id:"section-see",type:"section",number:"1",kicker:"Chapter",title:"Things You See"},{id:"see-concept",type:"prose",eyebrow:"Concept",heading:"Your code reaches outside itself",body:"For three weeks your game has been math. Numbers go in, rectangles come out, the screen redraws.<br><br>Today the game asks for help. It opens a file on the disk. It reads the bytes. It puts those bytes on the screen.<br><br>Same loop. Same coordinates. But now your character can have a face you drew."},{id:"see-api-load",type:"code",eyebrow:"API",heading:"Load it once. Draw it every frame.",code:`# Once, before the loop:
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
        screen.blit(text, text.get_rect(center=screen.get_rect().center))`,caption:"One flag splits the loop in two. <b>Update</b> respects it. <b>Draw</b> ignores it — the window stays alive either way.",language:"python"},{id:"recap",type:"bullets",heading:"Five new tools",lead:"All from the standard pygame toolbox.",items:["<b>pygame.image.load + convert_alpha + blit</b> — pictures from disk to screen.","<b>pygame.mixer.Sound + play + set_volume</b> — sounds from disk to speakers.","<b>List of dicts + iterate-backwards-and-remove</b> — populations of game objects.","<b>pygame.time.get_ticks()</b> — the wall clock.","<b>game_over flag</b> — one variable splits the loop into two states."]},{id:"ue002",type:"question",eyebrow:"Now you build it",question:"Ü002 — Jump & Run"},{id:"for-next-week",type:"bullets",heading:"For next Friday",lead:"Ü002 due. Ten tasks, one point each. Submit only your src/ folder.",items:["Sprites and sound: one tiny PNG, one short WAV. Make them yours — pixel art is fine, ugly is fine, generic is the only failure.","Pickups: lists are the new pattern. Backwards-iterate when removing. The trap is real.","Time limit + final score: the loop survives, the gameplay doesn't.","<b>Next week — Dictionaries & Data.</b> We name what you've already started doing.","<b>In two weeks — Classes.</b> We finally name the things."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],mt={meta:ut,slides:yt},gt={id:"05",number:"05",tag:"DATA",total:"34"},bt=[{id:"section",type:"section",number:"05",kicker:"Unit",title:"Data"},{id:"showcase",type:"question",eyebrow:"Last week",question:"Show me your Jump & Run"},{id:"today",type:"bullets",heading:"Today.",lead:"Four weeks of pushing numbers through a game loop. We never asked: <i>what</i> are we pushing? Today we step back.",items:["<b>Data</b> — bits, variables, types. Why Python forgives, why C# doesn't, what gets shipped to production.","<b>Functions</b> — re-grounded. The single most useful idea in programming, used badly by everyone for thirty years.","<b>Dictionaries</b> — your messy globals, organised. The data structure underneath half of every game ever made.","<b>Bridge</b> — your player is a dict pretending to be an object. Next week we drop the pretence."]},{id:"section-data",type:"section",number:"05",kicker:"I",title:"Data"},{id:"what-is-a-variable",type:"code",eyebrow:"Mental model",heading:"A variable is a name pointing at bits in RAM",code:`RAM  =  one very long array of bytes

   address     bytes              what we call it
   ─────────   ────────────────   ────────────────────
   0x7ff100    90 01 00 00         x       (the int 400)
   0x7ff104    00 00 96 43         y       (the float 300.0)
   0x7ff108    01                  alive   (the bool True)
   0x7ff109    50 6c 61 79 65 72   name    (the str "Player")

   ──────────────────────────────────────────────────
   The bits are just bits.
   What turns them into "an int" or "a string" is the
   set of operations we agree to apply to them.`,caption:'When you write <code>x = 400</code>, Python finds free memory, writes the bits, and remembers the name <code>x</code> points there. The CPU has no idea what an "integer" is — it just executes instructions over bytes. The <b>type</b> is the agreement between you and the language about what those bytes mean.',language:"text"},{id:"what-is-a-type",type:"prose",eyebrow:"Definition",heading:"A type is a contract",body:"A <b>type</b> says two things:<br><br><b>1.</b>  These are the allowed <i>values</i>. An <code>int</code> can hold ..., -2, -1, 0, 1, 2, .... A <code>bool</code> can hold exactly <code>True</code> or <code>False</code>. A <code>str</code> can hold any sequence of characters.<br><br><b>2.</b>  These are the allowed <i>operations</i>. You can add two ints. You can concatenate two strings. You cannot meaningfully add an int to a string — it's not in the contract.<br><br>Every typed language is fundamentally a system for catching contract violations <i>before</i> they crash your game in front of a player."},{id:"type-2x2",type:"split",heading:"Two axes, four worlds",left:{title:"When are types checked?",items:["<b>Static</b> — checked at compile time, before your program runs. The compiler refuses bad code. C, C#, C++, Rust, Haskell, Go, Java.","<b>Dynamic</b> — checked at runtime, while your program is executing. Errors show up the moment a contract is violated. Python, JavaScript, Ruby."]},right:{title:"How strict is the contract?",items:['<b>Strong</b> — no silent conversions. <code>"3" + 3</code> is an error. Python, Haskell, Rust.','<b>Weak</b> — the language quietly coerces. <code>"3" + 3</code> becomes <code>"33"</code> in JS, <code>6</code> in PHP, undefined behaviour in C. JS, C, PHP.']}},{id:"where-python-lives",type:"code",eyebrow:"The map",heading:"Where each language sits",code:`                    STATIC                    DYNAMIC
                ┌──────────────────────┬──────────────────┐
                │                      │                  │
         STRONG │  C#  ← Unity, last   │  Python  ← you   │
                │       semester       │                  │
                │  Java   Kotlin       │  Ruby            │
                │  Rust   Swift        │                  │
                │  Haskell  TypeScript │                  │
                ├──────────────────────┼──────────────────┤
                │                      │                  │
           WEAK │  C       C++         │  JavaScript      │
                │                      │  PHP             │
                │                      │                  │
                └──────────────────────┴──────────────────┘

The game industry's two shipping languages — C# (Unity) and C++ (Unreal,
custom engines) — both sit on the static side, for the same reason:
shipping bugs to millions of players is expensive.`,caption:`<b>You already know what the strong/static quadrant feels like</b> — it's last semester's C#. The compiler refused to build until your types lined up. Python is one quadrant over: same strictness about <i>operations</i> (no <code>"3" + 3</code> nonsense), but checked at runtime instead of compile time. The price of the move: bugs that C# would have caught at build time now show up when the player gets to level 7.`,language:"text"},{id:"section-bugs",type:"section",number:"05",kicker:"I",title:"Three bugs types prevent"},{id:"bug-overflow",type:"code",eyebrow:"Bug 1",heading:"Integer overflow",code:`# A signed 16-bit int holds values from -32,768 to 32,767.
# Add 1 to the max:
   32767 + 1   →   -32768       (it wraps around)

# 1996 — Ariane 5, maiden flight.
# The flight software converted a 64-bit float (velocity)
# into a signed 16-bit int. The float was too big.
# The conversion overflowed. The rocket veered, self-destructed.
# $370 million, 37 seconds after launch.

# 1981 — Pac-Man, level 256.
# The level counter is a single byte (0–255). On level 256
# it overflows to 0, and the right half of the screen fills with
# garbage. The arcade's most famous kill screen.

# Python: ints are arbitrary precision. 2**1000 just works.
# C / C#: ints are fixed width. Overflow is silent unless you check.`,caption:"Python sidesteps overflow by allocating more memory as numbers grow. <code>2 ** 1000</code> is fine. Every other systems language makes you face the limit. In a game engine you can't dodge this — a <code>float</code> position drifting toward infinity is the same family of bug.",language:"python"},{id:"bug-float",type:"code",eyebrow:"Bug 2",heading:"Floats are not the numbers you learned in school",code:`>>> 0.1 + 0.2
0.30000000000000004

>>> 0.1 + 0.2 == 0.3
False

# Why?
# Floats are stored in binary, not decimal.
# 1/10 in binary is an infinite repeating fraction —
# same as 1/3 in decimal: 0.333333... never terminates.
# The CPU stores the closest 64-bit approximation.
# That tiny error accumulates.

# Game implication:
# NEVER compare floats with ==.
# Use a tolerance:
   if abs(player_y - ground_y) < 0.5:
       grounded = True`,caption:'Every position, velocity, time delta in your game is a float. Floats lie. "<code>player_y == ground_y</code>" can be false even when the player is visually standing on the ground. Always use a tolerance window. This is the most common floating-point bug in physics code.',language:"python"},{id:"bug-none",type:"code",eyebrow:"Bug 3",heading:"The Billion-Dollar Mistake",code:`target: dict | None = find_enemy_at(x, y)

# Crash:
target["hp"] -= 10
# → TypeError: 'NoneType' object does not support item assignment

# Fix:
if target is not None:
    target["hp"] -= 10`,caption:"<code>None</code> is a real value meaning 'no result here.' Treat it as the thing you expected, and you crash. Writing <code>| None</code> in the signature lets the type checker force the guard.",language:"python"},{id:"duck-typing",type:"code",eyebrow:"So why Python?",heading:"Identity by what it can DO, not what it IS",code:`def render(thing):
    thing.draw()

class Player:
    def draw(self): ...

class UFO:
    def draw(self): ...

render(Player())   # ✓ has .draw
render(UFO())      # ✓ has .draw — share no class
render(42)         # ✗ AttributeError, only when the line runs`,caption:`In C# you'd need a shared interface like <code>IDrawable</code>. Python only requires the method to exist on the thing in front of it. The price: bugs surface when the line runs — no compiler to catch them earlier. <i>(Folklore name: <b>duck typing</b> — "if it quacks like a duck...")</i>`,language:"python"},{id:"type-hints",type:"code",eyebrow:"Type hints",heading:"Documentation that the linter checks",code:`# Without hints — runs fine, but the contract is invisible.
def move(player, dx, dy):
    player["x"] += dx
    player["y"] += dy


# With hints — same code, contract visible.
def move(player: dict, dx: float, dy: float) -> None:
    player["x"] += dx
    player["y"] += dy`,caption:`Python ignores hints at runtime — they're decoration. But your editor reads them: <b>Pyright</b> in VS Code underlines wrong calls like <code>move(player, "left", 5)</code> in red before you ever run the program. A compiler's second opinion, without losing Python's flexibility.`,language:"python"},{id:"type-hints-opinion",type:"code",eyebrow:"My recommendation",heading:"Hint what you can't hold in your head",code:`# Always — every call site reads the signature.
def move(player: dict, dx: float, dy: float) -> None:
    player["x"] += dx
    player["y"] += dy

# When the dict matters — write its shape.
SETTINGS: dict[str, int] = {
    "width": 800, "height": 600, "fps": 60,
}

# Almost never — the literal already tells you.
score = 0          # obviously int
name  = "Hero"     # obviously str`,caption:"<b>The 80/20:</b> hint function signatures (params + return), hint load-bearing dict shapes, skip locals. Future-you at 2am can't hold them in their head either. Push back if you disagree — it's a defensible position, not a law.",language:"python"},{id:"section-functions",type:"section",number:"05",kicker:"II",title:"Functions"},{id:"functions-history",type:"prose",eyebrow:"Why we keep coming back to this",heading:"The universal abstraction",body:"In 1936, Alonzo Church wrote down the <b>lambda calculus</b> — a formal system where the only thing that exists is functions. He proved that anything any computer can compute, a sufficient pile of functions can compute. Thirty years later, every programming language since FORTRAN (1957) has the function as its core abstraction.<br><br>You already know how to write one. We're not learning syntax today. We're re-grounding why this idea is the single most important tool in your programming toolbox, so that for the rest of the semester you use it deliberately."},{id:"function-contract",type:"code",eyebrow:"What a function is",heading:"Pure or impure?",code:`# PURE — same input, same output. No effects.
def add(a: int, b: int) -> int:
    return a + b

assert add(2, 3) == 5    # one-line test


# IMPURE — mutates the player. Side effect.
def move(player: dict, dx: float, dy: float) -> None:
    player["x"] += dx
    player["y"] += dy`,caption:"Pure functions are testable in one line. Impure ones need setup, fixtures, mocks. <b>With AI in the loop this matters more</b> — purity is the difference between <i>verified</i> and <i>hoped-for</i>. Game code is mostly impure; that's fine. Just know which kind you're writing, and prefer pure when you can.",language:"python"},{id:"factor-the-loop",type:"code",eyebrow:"Why this matters now",heading:"Factor the loop — the architecture appears",code:`# ❌  BEFORE — everything inline.
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT: running = False
    keys = pygame.key.get_pressed()
    if keys[K_LEFT]:  x -= 5
    if keys[K_RIGHT]: x += 5
    screen.fill(BG)
    pygame.draw.rect(screen, FG, (x, y, 40, 40))
    pygame.display.flip()
    clock.tick(60)


# ✅  AFTER — three named steps. One readable timeline.
while running:
    running = handle_events()
    update(state, dt)
    draw(screen, state)
    pygame.display.flip()
    clock.tick(60)`,caption:"Same program. The factored version reads top-to-bottom like an outline of what your game does each frame. <b>Every engine has this shape</b> — Unity's <code>Update()</code> / <code>Draw()</code>, Godot's <code>_process</code> / <code>_draw</code>. Not accident — what happens when you take functions seriously.",language:"python"},{id:"section-dicts",type:"section",number:"05",kicker:"III",title:"Dictionaries"},{id:"dict-question",type:"question",eyebrow:"Honest question",question:"Player, enemies, settings, score — how are you keeping track?"},{id:"list-to-dict",type:"code",eyebrow:"The leap",heading:"List vs dict",code:`# LIST — many of the same role. Index = sequence.
enemies = [enemy_a, enemy_b, enemy_c]
enemies[0]   # → enemy_a (the first one)


# DICT — one thing, many parts. Key = name.
player = {
    "x": 400,
    "y": 300,
    "hp": 100,
    "ammo": 50,
}
player["hp"]   # → 100 (the hp aspect)`,caption:"<b>List = many of the same role. Dict = one thing with many roles.</b> The test: <i>could I iterate over these and treat each one the same way?</i> All enemies — yes, list. Player x, hp, name — no, dict.",language:"python"},{id:"list-of-dicts",type:"code",eyebrow:"The combination",heading:"List of dicts — many things, each with parts",code:`# Many enemies. Each enemy is its own little bundle.
enemies = [
    {"x": 100, "y": 200, "hp": 50, "kind": "grunt"},
    {"x": 300, "y": 150, "hp": 80, "kind": "tank"},
    {"x": 500, "y": 100, "hp": 30, "kind": "fast"},
]

# Outer list — iterate through the many.
for enemy in enemies:
    # Inner dict — read one's parts.
    enemy["x"] += 1

enemies[0]["kind"]   # → "grunt"`,caption:`You've used this since Ü002 — list of dicts is the standard shape for a roster of game entities. <b>Outer list</b> for the many. <b>Inner dict</b> for what each one is made of. Two levels of indexing: <code>enemies[0]</code> picks one enemy; <code>enemies[0]["kind"]</code> picks one of its parts.`,language:"python"},{id:"dict-basics",type:"code",eyebrow:"The vocabulary",heading:"Six operations cover most of it",code:`settings = {"width": 800, "height": 600, "fps": 60}

# 1. Read — crashes if the key is missing.
settings["width"]              # → 800

# 2. Read safely — return a default if missing.
settings.get("music_volume", 0.8)   # → 0.8 (key didn't exist)

# 3. Write — creates the key if it doesn't exist.
settings["music_volume"] = 0.5

# 4. Test membership.
if "fps" in settings:
    ...

# 5. Iterate over (key, value) pairs.
for key, value in settings.items():
    print(f"{key} = {value}")

# 6. Remove a key.
del settings["width"]`,caption:"<code>dict[key]</code> raises <code>KeyError</code> if the key isn't there. <code>dict.get(key, default)</code> never raises — it returns the default. <b>Prefer <code>.get()</code></b> whenever you're not certain the key exists. The number of bugs this single habit prevents is alarming.",language:"python"},{id:"how-dicts-are-fast",type:"code",eyebrow:"Hash tables, 90 seconds",heading:"Why a dict lookup is O(1)",code:`A dict is implemented as a hash table:

   1.  You hand it a key, say  "hp".
   2.  Python runs hash("hp")  →  some big number like  3947128347.
   3.  That number mod-N picks a slot in an array of buckets.
   4.  The value sits in that bucket. One lookup. Done.

   Inserting:    same path. Pick the bucket. Write the value.
   Reading:      same path. Pick the bucket. Read the value.

   No matter if the dict has 10 items or 10,000,000, the math
   doing the lookup is the same. That's what O(1) means.

──────────────────────────────────────────────────────────────

Why keys must be IMMUTABLE:

   imagine you use a list as a key.
   you store it →  Python hashes [1, 2, 3]  →  bucket 47.
   you mutate it to [1, 2, 4]  →  hash would be different now.
   you ask for it back → Python checks bucket 91. Empty.
   YOUR DATA IS LOST.

   This is why dict keys must be strings, numbers, tuples, frozensets —
   anything whose hash can never change. Lists and dicts cannot be keys.`,caption:"You don't need to remember <i>how</i> hash tables work to use dicts. You need to remember the consequences: lookups are fast, and keys must never mutate. The same data structure (called <i>HashMap</i> in C# / Rust / Java, <i>unordered_map</i> in C++, <i>Object</i> in JS) is everywhere — because nothing else gives you named, O(1) access.",language:"text"},{id:"dict-use-config",type:"code",eyebrow:"Use case 1",heading:"Settings as one dict, not seven globals",code:`# Before — constants soup, scattered across the file.
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
FPS = 60
PLAYER_SPEED = 5
ENEMY_SPAWN_RATE = 0.02
GRAVITY = 0.5
JUMP_VELOCITY = -12


# After — one dict, one place to look.
SETTINGS = {
    "window_width":      800,
    "window_height":     600,
    "fps":               60,
    "player_speed":      5,
    "enemy_spawn_rate":  0.02,
    "gravity":           0.5,
    "jump_velocity":     -12,
}

# Use it.
screen = pygame.display.set_mode(
    (SETTINGS["window_width"], SETTINGS["window_height"])
)`,caption:'Same data, organised. Now you can save it to a file, pass it as one argument, load different presets ("easy" / "hard" settings), or let the player override individual values without touching code. <b>One dict, one source of truth.</b>',language:"python"},{id:"dict-use-entity",type:"code",eyebrow:"Use case 2",heading:"An entity is a dict",code:`# Before — seven loose variables. Try moving the player to a function.
player_x, player_y = 400, 300
player_hp, player_ammo = 100, 50
player_facing = "right"
player_invincible_until = 0
player_score = 0


# After — one dict.
player = {
    "x":                 400,
    "y":                 300,
    "hp":                100,
    "ammo":              50,
    "facing":            "right",
    "invincible_until":  0,
    "score":             0,
}

# Functions take the dict as one argument.
def move(p: dict, dx: float, dy: float) -> None:
    p["x"] += dx
    p["y"] += dy

def take_damage(p: dict, amount: int) -> None:
    p["hp"] -= amount`,caption:"Look at the second block. <i>This is already a class, written in dict syntax</i>. Data bundled together. Functions that operate on it. Passed around as one thing. Hold that thought — we come back to it in twenty minutes.",language:"python"},{id:"dict-use-asset",type:"code",eyebrow:"Use case 3",heading:"Load once, look up by name",code:`# Load every sprite into a single dict, keyed by name.
IMAGES: dict[str, pygame.Surface] = {
    "player":    pygame.image.load("data/player.png").convert_alpha(),
    "enemy":     pygame.image.load("data/enemy.png").convert_alpha(),
    "bullet":    pygame.image.load("data/bullet.png").convert_alpha(),
    "explosion": pygame.image.load("data/explosion.png").convert_alpha(),
}

SOUNDS: dict[str, pygame.mixer.Sound] = {
    "shoot": pygame.mixer.Sound("data/shoot.wav"),
    "hit":   pygame.mixer.Sound("data/hit.wav"),
    "jump":  pygame.mixer.Sound("data/jump.wav"),
}

# Anywhere in the game:
screen.blit(IMAGES["player"], (player["x"], player["y"]))
SOUNDS["shoot"].play()`,caption:'<b>Load assets once at startup; look them up by name during play.</b> Disk I/O is slow; loading a PNG in the middle of your game loop will stutter the frame. Loading at startup, then doing <code>IMAGES["player"]</code> in <code>draw()</code>, is the standard pattern in every engine.',language:"python"},{id:"dict-use-json",type:"code",eyebrow:"Use case 4",heading:"Dicts on disk",code:`import json

# JSON is dict syntax that lives in a text file.
# Save:  Python dict  →  JSON text  →  file on disk
# Load:  file on disk →  JSON text  →  Python dict

def save_highscore(score: int) -> None:
    with open("highscore.json", "w") as f:
        json.dump({"highscore": score}, f)

def load_highscore() -> int:
    try:
        with open("highscore.json", "r") as f:
            data = json.load(f)
        return data.get("highscore", 0)
    except FileNotFoundError:
        return 0

# The file on disk looks like this — readable, editable, portable:
#    {"highscore": 1450}`,caption:"<code>json.dump</code> writes a dict to a file. <code>json.load</code> reads it back. That's the whole API. Level layouts, save games, settings, dialogue trees — anything you want to persist between runs lives in a JSON file. The format is identical to Python dict syntax with two exceptions: strings need double quotes, and there's no trailing comma.",language:"python"},{id:"section-bridge",type:"section",number:"05",kicker:"IV",title:"Bridge to next week"},{id:"bridge-the-tell",type:"code",eyebrow:"Look closely",heading:"Dict + functions IS a class",code:`# TODAY — dict + free functions.
player = {"x": 400, "y": 300, "hp": 100}

def move(p, dx, dy):
    p["x"] += dx
    p["y"] += dy

move(player, 5, 0)


# NEXT WEEK — class. Same data, same operation.
class Player:
    def __init__(self):
        self.x, self.y, self.hp = 400, 300, 100

    def move(self, dx, dy):
        self.x += dx
        self.y += dy

p = Player()
p.move(5, 0)`,caption:"Every dict field becomes an attribute. Every function-of-dict becomes a method. <b>The pattern is the same;</b> Unit 6 just gives it nicer syntax and stronger checks.",language:"python"},{id:"workshop",type:"bullets",heading:"Workshop — twenty minutes",lead:"Take your Ü002. Right now it's globals soup. Refactor:",items:["<b>State dict.</b> Pull every loose variable into one <code>state</code> dict.","<b>Pass it around.</b> Functions take <code>state</code> as a parameter — no globals.","<b>Save / load.</b> Persist the highscore via <code>json.dump</code> / <code>json.load</code>.","<b>Type the signatures.</b> Every new function gets param + return hints."]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Unit 6 is Classes & Objects. We pick up exactly where we left off — the dict-and-functions pattern gets the class makeover.",items:["<b>Workshop pushed to GitHub.</b> Your refactored Ü002 with a state dict and persistent highscore.","<b>Reading (optional, ~20 min).</b> Python docs on <code>dict</code> and <code>json</code>. Skim, don't memorise.","<b>One question.</b> Bring a question about types, functions, or dicts that today's lecture didn't answer."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],ft={meta:gt,slides:bt},wt={id:"06",number:"06",tag:"CLASSES",total:"26"},vt=[{id:"section",type:"section",number:"06",kicker:"Unit",title:"Classes & Objects"},{id:"showcase",type:"question",eyebrow:"Last week",question:"Show me your state-dict refactor"},{id:"today",type:"bullets",heading:"Today.",lead:"Last week's bridge said <i>dict + functions IS a class</i>. Today we put the keyword on it.",items:["<b>Why bother?</b> — dicts already work. Five reasons class syntax earns its place.","<b>Syntax</b> — class, <code>__init__</code>, self. Sweeter spelling for what you already write.","<b>Modeling entities</b> — Player and Enemy as classes. The duplication is on purpose.","<b>Multi-file</b> — one class per file. Workshop promotes your Ü002 to classes."]},{id:"section-why",type:"section",number:"06",kicker:"I",title:"Why bother?"},{id:"recap-bridge",type:"code",eyebrow:"Where we left off",heading:"The pattern was already a class",code:`# What you wrote last week.
player = {"x": 400, "y": 300, "hp": 100}

def move(p, dx, dy):
    p["x"] += dx
    p["y"] += dy

move(player, 5, 0)

# Data plus functions that operate on it. Bundled by convention.
# Today we use the language's word for this pattern: class.`,caption:"Unit 5 closed with this slide. The pattern was already a class waiting for the syntax. The work today is naming what you've been doing — and discovering what the formal version gives you that the hand-rolled one doesn't.",language:"python"},{id:"five-reasons",type:"bullets",heading:"Five payoffs",items:["<b>Encapsulation</b> — data and behaviour travel together.","<b>Identity</b> — <code>isinstance</code> tells you what kind. Type checker enforces it.","<b>Invariants</b> — <code>__init__</code> guarantees a well-formed instance from the start.","<b>Self-documenting</b> — the class definition IS the description.","<b>Vocabulary</b> — <code>enemy.take_damage(10)</code> reads what it does."]},{id:"history",type:"prose",eyebrow:"Quick history",heading:"OOP isn't one thing",body:`<b>1972.</b> Alan Kay at Xerox PARC creates <b>Smalltalk</b> — the first language built around "objects sending messages to each other." Java, C#, Ruby, Python all descend from it.<br><br>Kay later said OOP wasn't really about classes — it was about <i>late binding</i> and <i>messaging</i>. The class-based version we use is one particular way to implement his idea. JavaScript and Lua, for example, do OOP without classes at all — they use <i>prototypes</i>, where objects delegate to other objects directly.<br><br>You don't need this trivia to write a Player class. But knowing OOP is a family of related ideas — not one single doctrine — protects you from the people who think their flavour is the only true one.`},{id:"csharp-bridge",type:"prose",eyebrow:"Reframe",heading:"Every script you've written was a class",body:"Every script you've attached to a GameObject (Unity) or a Node (Godot) was a class. <code>public class Player : MonoBehaviour</code> — or <code>class_name Player extends Node2D</code>. Constructors. <code>this</code> or <code>self</code>. Methods like <code>Update()</code>, <code>_process(delta)</code>.<br><br>Today is the Python translation, not the concept introduction. Python's spelling is simpler — fewer keywords, less ceremony, no type declarations forced on you — but the ideas are the same ones you already use without thinking. <b>Trust your intuition.</b>"},{id:"section-syntax",type:"section",number:"06",kicker:"II",title:"Syntax"},{id:"anatomy",type:"code",eyebrow:"The parts named",heading:"Anatomy of a class",code:`class Player:                          # the class — a blueprint
    def __init__(self, x, y):          # the setup method
        self.x = x                     # an attribute
        self.y = y
        self.hp = 100

    def move(self, dx, dy):            # a method
        self.x += dx
        self.y += dy

p = Player(400, 300)                   # an instance — one concrete Player
p.move(5, 0)                           # method call
print(p.x)                             # → 405`,caption:"Five pieces. <b>Class</b> declares a new kind of thing. <b>__init__</b> is the setup method, run automatically the moment you instantiate. <b>self</b> is the instance being acted on. <b>Attributes</b> (<code>self.x</code>) are the data. <b>Methods</b> are the behaviour. Calling <code>Player(...)</code> creates one concrete instance.",language:"python"},{id:"csharp-vs-python",type:"code",eyebrow:"Side-by-side",heading:"C# and Python — same skeleton",code:`# Python                              // C#
class Player:                          public class Player {
    def __init__(self, x, y):              public Player(int x, int y) {
        self.x = x                             this.x = x;
        self.y = y                             this.y = y;
                                           }
    def move(self, dx, dy):                public void Move(int dx, int dy) {
        self.x += dx                           this.x += dx;
        self.y += dy                           this.y += dy;
                                           }
                                       }

p = Player(400, 300)                   Player p = new Player(400, 300);
p.move(5, 0)                           p.Move(5, 0);`,caption:'Same idea, different spelling. <code>self</code> ≈ <code>this</code>. <code>__init__</code> ≈ the constructor. No <code>public</code> / <code>private</code> (Python uses convention — leading underscore means "please treat as private"). No type declarations forced on you (Python uses hints). No <code>new</code> keyword — calling the class as a function-like is how you instantiate.',language:"text"},{id:"self-is-dict",type:"code",eyebrow:"Mechanical reveal",heading:"self IS a dict",code:`class Player:
    def __init__(self):
        self.x = 400
        self.y = 300
        self.hp = 100

p = Player()

p.__dict__         # → {"x": 400, "y": 300, "hp": 100}
p.x                # → 400
                   # Python looks this up as p.__dict__["x"]
                   # with the class adding method-resolution on top.`,caption:"Your sidebar from Unit 5, made formal: <b>every Python instance is, mechanically, a dict</b>. The class adds methods and identity on top. Once you see this, classes stop feeling like magic — they're dicts with extras, written with sweeter syntax.",language:"python"},{id:"dunder-init",type:"code",eyebrow:"When __init__ runs",heading:"Setup happens automatically",code:`class Player:
    def __init__(self, x, y):
        print("__init__ ran")
        self.x = x
        self.y = y

p = Player(400, 300)
# → prints "__init__ ran"
#   p now has x=400, y=300

# You never call __init__ yourself. Writing Player(...) calls it for you.
# The double-underscore ("dunder") names — __init__, __dict__, __str__ —
# are Python's "the language hooks into this" convention. Don't invent yours.`,caption:"<code>__init__</code> is short for <i>initialize</i>. It runs once, the moment a new instance is created, and its job is to set up the instance's attributes. After it returns, the instance is ready to use.",language:"python"},{id:"instantiation",type:"code",eyebrow:"Blueprint vs instance",heading:"The class is the recipe; instances are the dishes",code:`class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y

Player                  # → <class 'Player'>   the blueprint

p1 = Player(400, 300)   # one instance
p2 = Player(100, 200)   # another instance

p1.x                    # → 400
p2.x                    # → 100
                        # same blueprint, different state.`,caption:"Calling a class makes one instance. The class definition is the recipe; each call produces one concrete object with its own attributes. Make as many as you want — they share the blueprint but not the state.",language:"python"},{id:"section-modeling",type:"section",number:"06",kicker:"III",title:"Modeling entities"},{id:"player-class",type:"code",eyebrow:"The upgrade",heading:"Player, fully rebuilt as a class",code:`class Player:
    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y
        self.vx = 0.0
        self.vy = 0.0
        self.hp = 100
        self.facing = "right"

    def move(self, dx: float, dy: float) -> None:
        self.x += dx
        self.y += dy
        self.facing = "left" if dx < 0 else "right"

    def take_damage(self, amount: int) -> None:
        self.hp = max(0, self.hp - amount)

    def is_alive(self) -> bool:
        return self.hp > 0`,caption:"Every field of last week's player dict is now an attribute. Every function-of-dict is now a method. Type hints on signatures, as decided. One class, one place, one source of truth for what a Player is and what it can do.",language:"python"},{id:"enemy-class",type:"code",eyebrow:"Compare",heading:"Enemy — structurally the same shape",code:`class Enemy:
    def __init__(self, x: float, y: float, kind: str) -> None:
        self.x = x
        self.y = y
        self.kind = kind
        self.hp = 50 if kind == "grunt" else 100

    def move(self, dx: float, dy: float) -> None:
        self.x += dx
        self.y += dy

    def take_damage(self, amount: int) -> None:
        self.hp = max(0, self.hp - amount)

    def is_alive(self) -> bool:
        return self.hp > 0`,caption:"Notice how much overlaps with Player — both have <code>x</code>, <code>y</code>, <code>hp</code>, <code>move</code>, <code>take_damage</code>, <code>is_alive</code>. Today we accept the duplication. <b>Unit 7 fixes it</b> with inheritance — the repetition isn't an accident, it's the setup.",language:"python"},{id:"has-a-vs-is-a",type:"prose",eyebrow:"Designing a class",heading:"What does it have?",body:"When you're deciding what to make a class, ask: <b>what does this thing have?</b><br><br>A Player <i>has</i> a position. A Player <i>has</i> HP. A Player <i>has</i> ammo. Each <i>has</i> becomes an attribute on the class — <code>self.x</code>, <code>self.hp</code>, <code>self.ammo</code>.<br><br>The deeper design call: is each attribute a simple value, or itself a class? <code>self.hp = 100</code> is fine as an int — HP doesn't have its own behaviour. <code>self.inventory</code> probably wants to be its own <code>Inventory</code> class, because it has methods of its own (<code>add</code>, <code>remove</code>, <code>is_full</code>).<br><br><b>Rule of thumb:</b> if it has its own behaviour, it's a class. If it's just a value, it's an attribute."},{id:"section-files",type:"section",number:"06",kicker:"IV",title:"Multi-file"},{id:"modules",type:"code",eyebrow:"One class per file",heading:"Files are modules",code:`# player.py
class Player:
    ...


# enemy.py
class Enemy:
    ...


# main.py — pulls them together.
from player import Player
from enemy import Enemy

player = Player(400, 300)
enemy = Enemy(100, 100, "grunt")`,caption:"Each <code>.py</code> file is a <i>module</i> — a unit of code you can import from. Up until now your whole game has lived in one file; as you add classes, that file gets long. One class per file is the standard move. <code>from filename import ClassName</code> brings it in elsewhere.",language:"python"},{id:"project-layout",type:"code",eyebrow:"Standard layout",heading:"Project structure",code:`your-game/
├── main.py          ← entry point: game loop, init, draw
├── player.py        ← class Player
├── enemy.py         ← class Enemy
├── bullet.py        ← class Bullet
├── settings.py      ← SETTINGS dict, constants
└── data/
    ├── player.png
    └── ...

# When entities pile up, group them in a folder:
└── entities/
    ├── __init__.py  ← empty file, marks the folder as a package
    ├── player.py
    ├── enemy.py
    └── bullet.py`,caption:'One file per class, plus a <code>main.py</code> that wires them together. The empty <code>__init__.py</code> tells Python "treat this folder as a package." <b>Why split?</b> Discoverability — when you want Player code, you open <code>player.py</code>. Single responsibility — each file does one thing, which makes refactoring safe.',language:"text"},{id:"section-workshop",type:"section",number:"06",kicker:"V",title:"Workshop"},{id:"workshop",type:"bullets",heading:"Workshop — twenty minutes",lead:"Take your Ü002 state dict from last week. Promote it to classes.",items:["<b>Player class.</b> Constructor takes starting <code>x</code>, <code>y</code>. Attributes: x, y, vx, vy, hp. Methods: <code>move</code>, <code>take_damage</code>, <code>is_alive</code>.","<b>Enemy class.</b> Same shape. Constructor takes x, y, kind.","<b>One file per class.</b> <code>player.py</code>, <code>enemy.py</code>. <code>main.py</code> imports both.","<b>Type the signatures.</b> Hints on params + return, as before."]},{id:"unit-7-preview",type:"code",eyebrow:"Where Unit 7 picks up",heading:"The duplication you just wrote IS the setup",code:`# Notice — Player and Enemy both have:
def move(self, dx, dy):
    self.x += dx
    self.y += dy

def take_damage(self, amount):
    self.hp = max(0, self.hp - amount)

def is_alive(self):
    return self.hp > 0

# Same code, twice. Next week — pull the shared shape up:
#
#     class Entity:           ← the parent
#         move, take_damage, is_alive
#
#     class Player(Entity):   ← inherits Entity, adds Player-specific
#     class Enemy(Entity):    ← inherits Entity, adds Enemy-specific`,caption:"Today you feel the seams. Next week we sew them. Inheritance pulls shared shape up into a parent class; subclasses keep what's unique. Ü003 (RealFakeGame pt.1) lands on this — you'll extend an existing Entity hierarchy, not build one from scratch.",language:"python"},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Unit 7 is Inheritance & Polymorphism. Ü003 (RealFakeGame pt.1) is assigned.",items:["<b>Workshop pushed.</b> Your Ü002 refactored into Player + Enemy classes, multi-file.","<b>Read the RealFakeGame skeleton.</b> Look at how the class hierarchy is laid out. Don't write code yet — understand the shape.","<b>One question.</b> Bring something today's lecture didn't answer."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],kt={meta:wt,slides:vt},_t={id:"07",number:"07",tag:"INHERITANCE",total:"24"},xt=[{id:"section",type:"section",number:"07",kicker:"Unit",title:"Inheritance & Polymorphism"},{id:"showcase",type:"question",eyebrow:"Last week",question:"Show me your Player + Enemy classes"},{id:"today",type:"bullets",heading:"Today.",lead:"Last week ended on duplicated code. Today we factor it out — and discover what that gets you.",items:["<b>Why inherit?</b> — the duplication you wrote, pulled up into a parent.","<b>Syntax</b> — <code>class Foo(Bar)</code>, override, <code>super()</code>.","<b>Polymorphism</b> — one loop, many entities. The whole point.","<b>When to inherit</b> — IS-A vs HAS-A. Composition where it fits.","<b>Workshop</b> — Entity base for your Player + Enemy. Ü003 lands."]},{id:"section-why",type:"section",number:"07",kicker:"I",title:"Why inherit?"},{id:"recap-duplication",type:"code",eyebrow:"Last week's pain",heading:"You wrote this twice",code:`class Player:                        class Enemy:
    def move(self, dx, dy):              def move(self, dx, dy):
        self.x += dx                         self.x += dx
        self.y += dy                         self.y += dy

    def take_damage(self, n):            def take_damage(self, n):
        self.hp = max(0, self.hp - n)        self.hp = max(0, self.hp - n)

    def is_alive(self):                  def is_alive(self):
        return self.hp > 0                   return self.hp > 0`,caption:"Three methods. Same code. In both classes. You felt this in the workshop — adding a fourth shared method means writing it twice; fixing a bug means fixing it twice. Today: the cure.",language:"text"},{id:"pulling-up",type:"code",eyebrow:"The move",heading:"Pull the shared shape up",code:`class Entity:                       # the new parent
    def move(self, dx, dy):
        self.x += dx
        self.y += dy

    def take_damage(self, n):
        self.hp = max(0, self.hp - n)

    def is_alive(self):
        return self.hp > 0


class Player(Entity):              # inherits everything from Entity
    pass

class Enemy(Entity):               # ditto
    pass`,caption:"Shared methods now live on <code>Entity</code>. <code>Player(Entity)</code> means 'Player is a kind of Entity' — and Player gets all of Entity's methods for free. <code>pass</code> means the child adds nothing yet. Same code paths, half the lines.",language:"python"},{id:"engines-do-this",type:"code",eyebrow:"You already use this",heading:"Every engine you've touched is built on it",code:`Unity                              Godot
─────                              ─────
Object                             Object
 └── Component                      └── Node
      └── Behaviour                      ├── Node2D
           └── MonoBehaviour                  ├── Sprite2D
                └── YOUR SCRIPT               └── YOUR SCRIPT`,caption:"Both engines' core architectures are inheritance trees. Every script you've attached was a class inheriting from the engine's base. Lifecycle methods like <code>Update()</code> or <code>_process()</code> are methods on the parent that you override. <b>You've been using inheritance for years.</b> Today you learn how to spell it.",language:"text"},{id:"section-syntax",type:"section",number:"07",kicker:"II",title:"Syntax"},{id:"inherit-syntax",type:"code",eyebrow:"The keyword",heading:"class Player(Entity):",code:`class Entity:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.hp = 100

    def take_damage(self, n):
        self.hp = max(0, self.hp - n)


class Player(Entity):          # ← parens = parent class
    pass

p = Player(400, 300)           # uses Entity's __init__
p.x                            # → 400
p.take_damage(10)              # method inherited from Entity
p.hp                           # → 90`,caption:"Parens after the class name declare the parent. <code>Player(Entity)</code> reads 'Player is a kind of Entity.' Player gets every attribute and method Entity has — even with an empty body.",language:"python"},{id:"override",type:"code",eyebrow:"Customizing inherited behaviour",heading:"Override — redefine in the child",code:`class Entity:
    def take_damage(self, n):
        self.hp = max(0, self.hp - n)


class Player(Entity):
    def take_damage(self, n):              # override
        if self.invincible:
            return                         # ignore damage
        self.hp = max(0, self.hp - n)`,caption:"A child replaces any inherited method by defining one with the same name. Python uses the child's version; the parent's is ignored. This is <b>overriding</b> — the child class customizes inherited behaviour.",language:"python"},{id:"super-call",type:"code",eyebrow:"Reaching the parent",heading:"super() — call the parent's version",code:`class Entity:
    def take_damage(self, n):
        self.hp = max(0, self.hp - n)
        play_sound("hit")              # generic hit sound


class Player(Entity):
    def take_damage(self, n):
        if self.invincible:
            return
        super().take_damage(n)         # do what Entity does
        screen_shake()                 # plus Player extras`,caption:"<code>super()</code> is 'the parent class.' Call <code>super().method()</code> inside an override to run the parent's version first, then add the child's behaviour. Standard pattern: parent logic + child extras.",language:"python"},{id:"super-init",type:"code",eyebrow:"The most-forgotten line",heading:"super().__init__() — set up the parent",code:`class Entity:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.hp = 100


class Player(Entity):
    def __init__(self, x, y):
        super().__init__(x, y)         # set up Entity's attributes
        self.ammo = 50                 # then Player-specific
        self.score = 0`,caption:"The most common <code>super()</code> call is in <code>__init__</code>: run the parent's setup, then add the child's. <b>Forget <code>super().__init__()</code> and the parent's attributes never get set</b> — your Player has no <code>x</code>, no <code>hp</code>, no anything from Entity. This is the most common beginner bug. Don't be the beginner.",language:"python"},{id:"section-poly",type:"section",number:"07",kicker:"III",title:"Polymorphism"},{id:"polymorphism-defined",type:"code",eyebrow:"One name, many behaviours",heading:"Same method, different implementations",code:`class Entity:
    def update(self, dt):
        pass                  # base does nothing; children fill in


class Player(Entity):
    def update(self, dt):
        # handle input, move, fire
        ...

class Enemy(Entity):
    def update(self, dt):
        # AI: chase the player
        ...

class Bullet(Entity):
    def update(self, dt):
        # travel in a straight line
        ...`,caption:"Same method name. Three different implementations. The parent declares the <i>shape</i> of the interface; each child fills it in for itself. This is <b>polymorphism</b> — many shapes, one interface.",language:"python"},{id:"game-loop-payoff",type:"code",eyebrow:"The payoff",heading:"One loop. All entities.",code:`# Your main game loop, after inheritance.
entities = [player, enemy1, enemy2, bullet1, bullet2]

for e in entities:
    e.update(dt)
    e.draw(screen)

# The loop doesn't know — or care — what KIND each entity is.
# Each one's update() and draw() do the right thing for itself.`,caption:"<b>This is why inheritance exists in games.</b> Before: separate loops or a chain of <code>isinstance</code> branches. After: one loop, all entities. Add a new entity type tomorrow — the loop doesn't change. Every game engine ever shipped is built on this pattern.",language:"python"},{id:"section-when",type:"section",number:"07",kicker:"IV",title:"When to inherit"},{id:"is-a-test",type:"code",eyebrow:"The substitution test",heading:"IS-A means you can substitute",code:`def damage_all(things: list[Entity], n: int) -> None:
    for thing in things:
        thing.take_damage(n)

# Works because Player, Enemy, Bullet all ARE Entities.
damage_all([player, enemy, bullet], 10)


# Liskov, 1987 — formally:
#   A subclass should behave such that you can substitute it
#   where the parent is expected, without breaking anything.
#
# Plain English: subclasses must honour the parent's contract.
# If your Boss.take_damage() crashes, the hierarchy is broken.`,caption:"Inheritance only makes sense when the child can <b>actually be used in place of the parent</b>. If your subclass would crash or misbehave where the parent works, the IS-A claim is false — and the hierarchy will betray you in production.",language:"python"},{id:"composition-vs-inheritance",type:"code",eyebrow:"Two relationships",heading:"IS-A vs HAS-A",code:`# INHERITANCE — IS-A (a kind of thing)
class Boss(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.hp = 1000


# COMPOSITION — HAS-A (a part of something)
class Inventory:
    def add(self, item): ...

class Player(Entity):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.inventory = Inventory()    # composition`,caption:"<b>Inheritance</b> for IS-A: Boss is a kind of Enemy. <b>Composition</b> for HAS-A: Player has an Inventory. Use inheritance for real type hierarchies. Use composition for parts, capabilities, or just sharing code.",language:"python"},{id:"restraint",type:"bullets",heading:"Reach for it carefully",lead:'The Gang of Four (1994) put the rule plainly: <b>"Prefer composition over inheritance."</b> Thirty years later, still the working guideline. Three common traps:',items:["<b>Five levels deep</b> — the great-grandparent's API change breaks everything downstream.","<b>Inheriting to share two methods</b> — that's what composition or a helper function is for.","<b>Wrong IS-A</b> — Square IS-A Rectangle mathematically, but <code>set_width(5)</code> breaks the square invariant."]},{id:"section-workshop",type:"section",number:"07",kicker:"V",title:"Workshop"},{id:"realfakegame-hierarchy",type:"code",eyebrow:"What Ü003 hands you",heading:"The RealFakeGame class tree",code:`Entity                  ← shared interface, base methods
├── Player              
├── Enemy
│   ├── FastEnemy        ← moves faster
│   ├── TankEnemy        ← more HP, slower
│   ├── SineEnemy        ← oscillates while advancing
│   ├── ShooterEnemy     ← fires shots back
│   └── Boss             ← scaled HP, special phases
└── Shot
    └── EnemyShot        ← bullets the enemies fire`,caption:"The hierarchy in the skeleton. Each branch is one kind of game thing. For <b>Ü003</b>, you read this code, understand the shape, and add features to existing classes — you don't invent the structure. The skeleton's design is the lesson.",language:"text"},{id:"workshop",type:"bullets",heading:"Workshop — twenty minutes",lead:"Take your Player + Enemy classes from last week. Apply the cure.",items:["<b>Entity base.</b> New class with shared methods: <code>move</code>, <code>take_damage</code>, <code>is_alive</code>.","<b>Inherit.</b> <code>class Player(Entity)</code>, <code>class Enemy(Entity)</code>. Drop the duplicated methods.","<b>super().__init__().</b> Pass parent args up; add child-specific attributes after.","<b>Verify.</b> Game should run identically. If something breaks, the hierarchy is telling you something."]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Unit 8 is the RealFakeGame workshop. Ü003 (RealFakeGame pt.1) is live.",items:["<b>Workshop pushed.</b> Your refactored Player + Enemy with Entity base.","<b>Read the skeleton.</b> Understand the existing hierarchy before you write code.","<b>Bring your hierarchy questions.</b> Designing class trees is hard. We'll workshop yours in Unit 8."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],Tt={meta:_t,slides:xt},St=[st,dt,pt,mt,ft,kt,Tt],At=St.map(t=>tt(t.meta,t.slides)).join(`
`),ve=document.createElement("deck-root");ve.innerHTML=At;document.body.appendChild(ve);
