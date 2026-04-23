(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function o(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=o(a);fetch(a.href,r)}})();function je(t){const e=t.getContext("2d");t.width=t.clientWidth*devicePixelRatio,t.height=t.clientHeight*devicePixelRatio,e.scale(devicePixelRatio,devicePixelRatio);const o=t.clientWidth,i=t.clientHeight;let a=o/2-20,r=i/2-20;const u=5,y={},k=_=>{"wasd".includes(_.key.toLowerCase())&&(y[_.key.toLowerCase()]=_.type==="keydown",_.preventDefault())};window.addEventListener("keydown",k),window.addEventListener("keyup",k);let C;function w(){y.a&&(a-=u),y.d&&(a+=u),y.w&&(r-=u),y.s&&(r+=u),a=Math.max(0,Math.min(a,o-40)),r=Math.max(0,Math.min(r,i-40)),e.fillStyle="#0b0d10",e.fillRect(0,0,o,i),e.fillStyle="#ff6b35",e.fillRect(a,r,40,40),C=requestAnimationFrame(w)}return w(),()=>{cancelAnimationFrame(C),window.removeEventListener("keydown",k),window.removeEventListener("keyup",k)}}const M=1200,B=540,de=140,Z=B+de,X=42,N=54,Ge=7,Me=8,He=.35,Fe=2.2,qe=.5,De=1.55,Ue=1.9,W=240,re=[[0,470,340,70],[420,470,200,70],[680,420,160,120],[880,350,100,190],[1040,470,160,70],[920,280,80,16]],Oe=`
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
  aspect-ratio: ${M} / ${Z};
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
`;function Ne(){if(document.getElementById("mario-jump-styles"))return;const t=document.createElement("style");t.id="mario-jump-styles",t.textContent=Oe,document.head.appendChild(t)}function We(t){Ne();const e=t.getContext("2d"),o=Math.max(1,Math.min(3,window.devicePixelRatio||1));let i=0,a=0;function r(){const s=t.getBoundingClientRect();s.width<1||s.height<1||(i=s.width,a=s.height,t.width=Math.round(i*o),t.height=Math.round(a*o))}const u=new ResizeObserver(r);u.observe(t),r();const y=new Image;y.src="/img/claude-sprite.png";let k=!1;y.onload=()=>{k=!0};const C=new Image;C.src="/img/playground-backdrop.png";let w=!1;C.onload=()=>{w=!0};const _={gravity:.65,jumpStrength:13.5,moveSpeed:5,airControl:1,realisticMode:!1,variableJump:!0,coyoteTime:!0,jumpBuffer:!0,apexHang:!0,asymmetricGravity:!0,fastFall:!0},$={..._},j=["variableJump","coyoteTime","jumpBuffer","apexHang","asymmetricGravity","fastFall"],n={x:80,y:470-N,vx:0,vy:0,facing:1,squash:1},l={onGround:!1,coyote:0,buffer:0,currentGravity:_.gravity,jumpPressedThisFrame:!1,releasedJumpInRise:!1},S={vy:new Float32Array(W),ay:new Float32Array(W),y:new Float32Array(W),head:0};function c(){S.vy[S.head]=n.vy,S.ay[S.head]=l.currentGravity,S.y[S.head]=n.y,S.head=(S.head+1)%W}function f(){n.x=80,n.y=470-N,n.vx=0,n.vy=0,n.facing=1,n.squash=1,l.onGround=!1,l.coyote=0,l.buffer=0,l.releasedJumpInRise=!1,S.vy.fill(0),S.ay.fill(0),S.y.fill(n.y),S.head=0}const h={left:!1,right:!1,jump:!1,down:!1},P={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"jump",w:"jump"," ":"jump",arrowdown:"down",s:"down"};let b=!1;function F(s){if(!b)return;const g=s.key.toLowerCase();if(g==="r"&&s.type==="keydown"){f(),s.preventDefault(),s.stopImmediatePropagation();return}const m=P[g];if(!m)return;const x=s.type==="keydown";m==="jump"&&(x&&!h.jump&&(l.jumpPressedThisFrame=!0),!x&&h.jump&&n.vy<0&&(l.releasedJumpInRise=!0)),h[m]=x,s.preventDefault(),s.stopImmediatePropagation()}window.addEventListener("keydown",F,!0),window.addEventListener("keyup",F,!0),t.setAttribute("tabindex","0"),t.style.outline="none";const K=()=>{b=!0,t.style.boxShadow="inset 0 0 0 2px rgba(255,107,53,0.6)"},D=()=>{b=!1,t.style.boxShadow="",h.left=h.right=h.jump=h.down=!1};t.addEventListener("focus",K),t.addEventListener("blur",D);const Q=()=>t.focus();t.addEventListener("pointerdown",Q);function U(s,g,m){return`<label class="pg-toggle">
      <input type="checkbox" data-cfg="${s}" ${_[s]?"checked":""} />
      <span class="pg-toggle__label">${g}</span>
      <span class="pg-toggle__desc">${m}</span>
    </label>`}function Y(s,g,m,x,E,I=T=>T.toFixed(2)){return`<label class="pg-slider">
      <span class="pg-slider__label">${E}</span>
      <span class="pg-slider__value" data-for="${s}">${I(_[s])}</span>
      <input type="range" data-cfg="${s}" min="${g}" max="${m}" step="${x}" value="${_[s]}" />
    </label>`}const R=document.createElement("div");R.className="playground-ui",R.innerHTML=`
    <div class="pg-section">
      <div class="pg-heading">Tricks</div>
      ${U("realisticMode","Realistic (no tricks)","Pure parabolic physics. Try this first — feel how committed it is.")}
      ${U("variableJump","Variable jump height","Release jump early → shorter jump.")}
      ${U("coyoteTime","Coyote time","Jump within ~7 frames of leaving a ledge.")}
      ${U("jumpBuffer","Jump buffer","Press jump ~8 frames before landing → still fires.")}
      ${U("apexHang","Apex hangtime","Near the peak, gravity halves. Floaty, controllable.")}
      ${U("asymmetricGravity","Asymmetric gravity","Falls faster than it rises. Snappy.")}
      ${U("fastFall","Fast fall","Hold ↓ or S in air → accelerates down.")}
    </div>
    <div class="pg-section">
      <div class="pg-heading">Tuning</div>
      ${Y("gravity",.1,2,.05,"Gravity")}
      ${Y("jumpStrength",5,22,.5,"Jump strength",s=>s.toFixed(1))}
      ${Y("moveSpeed",1,10,.5,"Move speed",s=>s.toFixed(1))}
      ${Y("airControl",0,1,.05,"Air control")}
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
  `;const O={vx:R.querySelector("[data-stat=vx]"),vy:R.querySelector("[data-stat=vy]"),ay:R.querySelector("[data-stat=ay]"),ground:R.querySelector("[data-stat=ground]"),coyote:R.querySelector("[data-stat=coyote]"),buffer:R.querySelector("[data-stat=buffer]")};R.querySelectorAll("input[data-cfg]").forEach(s=>{s.addEventListener("input",()=>{const g=s.dataset.cfg;if(s.type==="checkbox"){if($[g]=s.checked,g==="realisticMode"&&s.checked&&j.forEach(m=>{$[m]=!1;const x=R.querySelector(`input[data-cfg="${m}"]`);x&&(x.checked=!1)}),j.includes(g)&&s.checked&&$.realisticMode){$.realisticMode=!1;const m=R.querySelector('input[data-cfg="realisticMode"]');m&&(m.checked=!1)}}else{const m=parseFloat(s.value);$[g]=m;const x=R.querySelector(`.pg-slider__value[data-for="${g}"]`);x&&(x.textContent=Number.isInteger(m*2)?m.toFixed(1):m.toFixed(2))}})}),R.querySelector(".pg-reset").addEventListener("click",f);const ee=t.closest(".demo__split");ee.classList.add("playground-wrap"),ee.appendChild(R);function ue(s,g,m,x,E,I,T,v){return s<E+T&&s+m>E&&g<I+v&&g+x>I}function se(s,g,m){return s+(g-s)*m}function we(s){let g=0;h.left&&(g-=$.moveSpeed),h.right&&(g+=$.moveSpeed);const m=l.onGround?1:$.airControl;n.vx=se(n.vx,g,Math.min(1,.3*m*s)),Math.abs(g)>.2&&(n.facing=Math.sign(g)),l.jumpPressedThisFrame&&(l.buffer=$.jumpBuffer?Me:1),l.buffer=Math.max(0,l.buffer-s);const x=l.onGround||$.coyoteTime&&l.coyote>0;l.buffer>0&&x&&(n.vy=-$.jumpStrength,l.buffer=0,l.coyote=0,l.onGround=!1,l.releasedJumpInRise=!1,n.squash=1.2),$.variableJump&&l.releasedJumpInRise&&n.vy<0&&(n.vy*=He,l.releasedJumpInRise=!1),h.jump||(l.releasedJumpInRise=!1);let E=$.gravity;const I=!$.realisticMode;I&&$.apexHang&&Math.abs(n.vy)<Fe&&(E*=qe),I&&$.asymmetricGravity&&n.vy>0&&(E*=De),I&&$.fastFall&&h.down&&n.vy>0&&(E*=Ue),l.currentGravity=E,n.vy+=E*s,n.vy>18&&(n.vy=18),n.x+=n.vx*s;for(const[v,A,L,q]of re)ue(n.x,n.y,X,N,v,A,L,q)&&(n.vx>0?n.x=v-X:n.vx<0&&(n.x=v+L),n.vx=0);const T=l.onGround;l.onGround=!1,n.y+=n.vy*s;for(const[v,A,L,q]of re)if(ue(n.x,n.y,X,N,v,A,L,q)){if(n.vy>0){if(n.y=A-N,l.onGround=!0,!T){const J=Math.min(1,n.vy/16);n.squash=se(1,.7,J)}}else n.vy<0&&(n.y=A+q);n.vy=0}T&&!l.onGround&&n.vy>=0?l.coyote=Ge:l.coyote>0&&!l.onGround?l.coyote=Math.max(0,l.coyote-s):l.onGround&&(l.coyote=0),n.squash=se(n.squash,1,Math.min(1,.2*s)),(n.y>B+200||n.x<-300||n.x>M+300)&&f(),l.jumpPressedThisFrame=!1,c()}let $e=0;function ke(){if(++$e%4!==0)return;const s=g=>g>=0?"+":"";O.vx.textContent=`${s(n.vx)}${n.vx.toFixed(2)}`,O.vy.textContent=`${s(n.vy)}${n.vy.toFixed(2)}`,O.ay.textContent=`${s(l.currentGravity)}${l.currentGravity.toFixed(2)}`,O.ground.textContent=l.onGround?"yes":"no",O.ground.className=l.onGround?"good":"muted",O.coyote.textContent=l.coyote.toFixed(0),O.coyote.className=l.coyote>0?"accent":"muted",O.buffer.textContent=l.buffer.toFixed(0),O.buffer.className=l.buffer>0?"accent":"muted"}function xe(){if(w){const T=C.width/C.height,v=M/B;let A,L,q,J;T>v?(L=B,A=L*T,q=(M-A)/2,J=0):(A=M,L=A/T,q=0,J=(B-L)/2),e.drawImage(C,q,J,A,L)}else{const T=e.createLinearGradient(0,0,0,B);T.addColorStop(0,"#0b0d10"),T.addColorStop(1,"#2a1f1a"),e.fillStyle=T,e.fillRect(0,0,M,B)}for(const[T,v,A,L]of re)e.fillStyle="#b78363",e.fillRect(T,v,A,L),e.fillStyle="#f1c591",e.fillRect(T,v,A,5),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(T+A-3,v,3,L),e.fillStyle="#8a5a3a",e.fillRect(T,v+5,A,2);e.save();const s=n.x+X/2,g=n.y+N;e.translate(s,g);let m=n.squash,x=1/n.squash;if(!l.onGround){const T=Math.max(-.15,Math.min(.22,-n.vy/80));m*=1+T,x*=1-T*.6}e.scale(x*n.facing,m);const E=X*2,I=N*2;k?e.drawImage(y,-E/2,-I*.92,E,I):(e.fillStyle="#d97757",e.fillRect(-X/2,-N,X,N)),e.restore()}function Se(){const s=B,g=12,m=3,x=12,E=(M-g*2-x*(m-1))/m,I=de-g*2;e.fillStyle="rgba(11, 13, 16, 0.85)",e.fillRect(0,s,M,de),e.fillStyle="rgba(255,255,255,0.06)",e.fillRect(0,s,M,1),[{label:"y (position)",data:S.y,color:"#6fb3d2",min:0,max:B,invert:!0,zeroLine:!1},{label:"vy (velocity)",data:S.vy,color:"#ff6b35",min:-22,max:22,invert:!1,zeroLine:!0},{label:"ay (accel/grav)",data:S.ay,color:"#98c379",min:0,max:3,invert:!1,zeroLine:!1}].forEach((v,A)=>{const L=g+A*(E+x);if(e.fillStyle="rgba(255,255,255,0.04)",e.fillRect(L,s+g,E,I),e.font="12px ui-monospace, monospace",e.textBaseline="top",e.fillStyle="rgba(255,255,255,0.55)",e.fillText(v.label,L+8,s+g+6),v.zeroLine){const V=s+g+I*((0-v.min)/(v.max-v.min));e.fillStyle="rgba(255,255,255,0.15)",e.fillRect(L,V,E,1)}e.strokeStyle=v.color,e.lineWidth=1.5,e.beginPath();for(let V=0;V<W;V++){const Ce=(S.head+V)%W,Ie=v.data[Ce],Pe=V/(W-1),fe=Math.max(0,Math.min(1,(Ie-v.min)/(v.max-v.min))),Re=v.invert?fe:1-fe,me=L+Pe*E,be=s+g+Re*I;V===0?e.moveTo(me,be):e.lineTo(me,be)}e.stroke();const q=(S.head-1+W)%W,J=v.data[q],ge=Math.max(0,Math.min(1,(J-v.min)/(v.max-v.min))),Ee=v.invert?ge:1-ge,Le=L+E-1,Ae=s+g+Ee*I;e.fillStyle=v.color,e.beginPath(),e.arc(Le,Ae,3,0,Math.PI*2),e.fill()})}function Te(){if(i<1||a<1)return;e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,t.width,t.height);const s=Math.min(i/M,a/Z),g=(i-M*s)/2,m=(a-Z*s)/2,x=s*o;e.setTransform(x,0,0,x,g*o,m*o),e.imageSmoothingEnabled=!1,xe(),Se(),b||(e.fillStyle="rgba(0,0,0,0.45)",e.fillRect(0,0,M,Z),e.fillStyle="#ffe6d4",e.font="bold 28px ui-monospace, monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("click to play",M/2,Z/2),e.textAlign="start")}let ae,pe=performance.now();function he(s){const g=Math.min(40,s-pe);pe=s;const m=g/(1e3/60);we(m),ke(),Te(),ae=requestAnimationFrame(he)}return ae=requestAnimationFrame(he),()=>{cancelAnimationFrame(ae),window.removeEventListener("keydown",F,!0),window.removeEventListener("keyup",F,!0),t.removeEventListener("focus",K),t.removeEventListener("blur",D),t.removeEventListener("pointerdown",Q),u.disconnect(),R.remove(),ee&&ee.classList.remove("playground-wrap"),t.style.boxShadow=""}}const Be={"moving-square":je,"mario-jump":We};let te=null;function ze(t){if(te&&(te(),te=null),!t)return;const e=t.querySelector(".demo__canvas"),o=t.getAttribute("data-demo");if(!e||!o)return;const i=Be[o];if(!i){console.warn(`[demo] unknown demo: ${o}`);return}te=i(e)||null}let ie=null;function Ke(t){if(ie&&(ie(),ie=null),!(t!=null&&t.hasAttribute("data-interactive-code")))return;const e=t.querySelector(".icode");if(!e)return;const o=[...t.querySelectorAll(".icode__line[data-region]")],i=[...t.querySelectorAll(".icode__ann[data-region]")],a=[...t.querySelectorAll(".icode-tip")],r=[...new Set(o.map(c=>c.dataset.region).filter(Boolean))],u=new Set;let y=null,k=null,C=!1,w=null;function _(){const c=y!==null;e.classList.toggle("icode--has-active",c),e.classList.toggle("icode--has-revealed",u.size>0);for(const f of o){const h=f.dataset.region;h&&(f.classList.toggle("icode__line--active",h===y),f.classList.toggle("icode__line--revealed",u.has(h)))}for(const f of i){const h=f.dataset.region;f.classList.toggle("icode__ann--active",h===y),f.classList.toggle("icode__ann--revealed",u.has(h))}}function $(){C||u.size>=r.length&&(C=!0,e.classList.add("icode--complete"),setTimeout(()=>e.classList.remove("icode--complete"),900))}_();function j(c){var f,h;if(!((f=c.target)!=null&&f.isContentEditable||/input|textarea/i.test((h=c.target)==null?void 0:h.tagName))){if(c.key>="1"&&c.key<="9"){const P=parseInt(c.key)-1;if(P>=r.length)return;c.preventDefault();const b=r[P];y===b?(y=null,k=null):(u.add(b),y=b,k=b,$()),_();return}if(c.key==="0"||c.key==="Escape"){(y||k)&&(c.preventDefault(),y=null,k=null,_());return}}}addEventListener("keydown",j);const n=[];for(const c of o){const f=c.dataset.region;if(!f)continue;const h=()=>{!k&&u.has(f)&&(y=f,_())},P=()=>{k||(y=null,_())};c.addEventListener("mouseenter",h),c.addEventListener("mouseleave",P),n.push({el:c,events:{mouseenter:h,mouseleave:P}})}for(const c of i){const f=c.dataset.region,h=()=>{!k&&u.has(f)&&(y=f,_())},P=()=>{k||(y=null,_())},b=()=>{k===f?(k=null,y=null):(u.add(f),k=f,y=f,$()),_()};c.addEventListener("mouseenter",h),c.addEventListener("mouseleave",P),c.addEventListener("click",b),n.push({el:c,events:{mouseenter:h,mouseleave:P,click:b}})}function l(c){S();const f=c.dataset.tipSig||"",h=c.dataset.tipDesc||"",P=c.dataset.tipUrl||"";if(!f&&!h)return;const b=document.createElement("div");b.className="icode-tooltip",b.innerHTML=[f?`<code class="icode-tooltip__sig">${le(f)}</code>`:"",h?`<div class="icode-tooltip__desc">${le(h)}</div>`:"",P?`<a class="icode-tooltip__link" href="${le(P)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),e.appendChild(b),e.style.position="relative";let F=0,K=0,D=c;for(;D&&D!==e;)F+=D.offsetTop,K+=D.offsetLeft,D=D.offsetParent;b.style.left=Math.max(0,K)+"px",b.style.visibility="hidden";const Q=b.offsetHeight,U=b.offsetWidth;F-Q-10<0?(b.style.top=F+c.offsetHeight+8+"px",b.classList.add("icode-tooltip--below")):b.style.top=F-Q-8+"px";const Y=e.offsetWidth-U-8;parseInt(b.style.left)>Y&&(b.style.left=Math.max(0,Y)+"px"),b.style.visibility="",w=b}function S(){w&&(w.remove(),w=null)}for(const c of a){const f=()=>l(c),h=()=>S();c.addEventListener("mouseenter",f),c.addEventListener("mouseleave",h),n.push({el:c,events:{mouseenter:f,mouseleave:h}})}ie=()=>{removeEventListener("keydown",j);for(const c of n)for(const[f,h]of Object.entries(c.events))c.el.removeEventListener(f,h);S(),y=null,k=null,e.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const c of o)c.classList.remove("icode__line--active","icode__line--revealed");for(const c of i)c.classList.remove("icode__ann--active","icode__ann--revealed")}}function le(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ye=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",Ye);class Je extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const e=document.createElement("div");for(e.className="deck__stage";this.firstChild;)e.appendChild(this.firstChild);this.appendChild(e),this._stage=e,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",o=>this._onKey(o)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const o=new URLSearchParams(location.search).get("unit");let i=Array.from(this._stage.querySelectorAll(".slide"));o&&(i=i.filter(a=>a.getAttribute("data-unit")===o),this._stage.querySelectorAll(".slide").forEach(a=>{i.includes(a)||a.remove()})),this._slides=i}_buildFooter(){const e=document.createElement("div");e.className="deck__footer",e.innerHTML=`
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
    `,document.body.appendChild(e),this._help=e}_readHashIndex(){var i;const e=location.hash.match(/^#(\d+)/);if(!e)return 0;const o=parseInt(e[1],10)-1;return Math.max(0,Math.min(o,(((i=this._slides)==null?void 0:i.length)||1)-1))}_show(e){if(!this._slides.length||e<0||e>=this._slides.length)return;this._index=e;const o=this._slides.length;this._slides.forEach((C,w)=>{w===e?C.setAttribute("data-active",""):C.removeAttribute("data-active")});const i=this._slides[e],a=i.getAttribute("data-unit")||"",r=i.getAttribute("data-tag")||"",u=i.getAttribute("data-total")||"12",y=[];a&&y.push(`UNIT ${a} / ${u}`),r&&y.push(r);const k=y.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=k),this._fNum&&(this._fNum.textContent=`${String(e+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(e+1)/o*100}%`),location.hash!==`#${e+1}`&&history.replaceState(null,"",`#${e+1}`),ze(i),Ke(i),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:e,slide:i}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(e){if(!(e.target&&e.target.isContentEditable)&&!(e.target&&/input|textarea/i.test(e.target.tagName))){if(e.ctrlKey&&e.shiftKey&&(e.key==="E"||e.key==="e")){e.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(e.key){case"ArrowRight":case" ":case"PageDown":e.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":e.preventDefault(),this._prev();break;case"Home":e.preventDefault(),this._show(0);break;case"End":e.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":e.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const o=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("deck-theme",o)}_scale(){const e=innerWidth,o=innerHeight,i=Math.min(e/1920,o/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${i})`}}customElements.get("deck-root")||customElements.define("deck-root",Je);const Ve=["B","I","EM","STRONG","BR"],Xe=new Set(Ve),Qe=new Set(["BR"]);function d(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function z(t){if(t==null)return"";const e=document.createElement("template");return e.innerHTML=String(t),ce(e.content)}function ce(t){let e="";for(const o of t.childNodes)if(o.nodeType===Node.TEXT_NODE)e+=d(o.nodeValue);else if(o.nodeType===Node.ELEMENT_NODE){const i=o.tagName;if(Xe.has(i)){const a=i.toLowerCase();Qe.has(i)?e+=`<${a}>`:e+=`<${a}>${ce(o)}</${a}>`}else e+=ce(o)}return e}const Ze=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),et=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),ye=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function G(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function oe(t){if(t==null)return"";let e="",o=0,i=null,a;for(ye.lastIndex=0;(a=ye.exec(t))!==null;){if(a.index>o){const u=t.slice(o,a.index);e+=G(u),/\S/.test(u)&&(i=null)}const r=a.groups;if(r.comment)e+=`<span class="tok-comment">${G(r.comment)}</span>`,i=null;else if(r.tstring)e+=`<span class="tok-string">${G(r.tstring)}</span>`,i=null;else if(r.fstring)e+=`<span class="tok-string">${G(r.fstring)}</span>`,i=null;else if(r.string)e+=`<span class="tok-string">${G(r.string)}</span>`,i=null;else if(r.decorator)e+=`<span class="tok-decorator">${G(r.decorator)}</span>`,i=null;else if(r.number)e+=`<span class="tok-number">${G(r.number)}</span>`,i=null;else if(r.word){const u=r.word;i==="function"?(e+=`<span class="tok-function-def">${G(u)}</span>`,i=null):i==="class"?(e+=`<span class="tok-class-def">${G(u)}</span>`,i=null):Ze.has(u)?(e+=`<span class="tok-keyword">${G(u)}</span>`,u==="def"?i="function":u==="class"?i="class":i=null):et.has(u)?(e+=`<span class="tok-builtin">${G(u)}</span>`,i=null):(e+=G(u),i=null)}o=a.index+a[0].length}return o<t.length&&(e+=G(t.slice(o))),e}function ve(t){const e=(t||"").split(`
`).length;return e>=20?"xs":e>=14?"sm":e>=10?"md":"lg"}function tt(t,e){return e.map(o=>it(o,t)).join(`
`)}function it(t,e){const o=ot[t.type];return o?o(t,e):`<div class="slide"><div class="slide__body">Unknown slide type: ${d(t.type)}</div></div>`}function p(t,e,o){return`data-edit="${t}/${e}/${o}"`}function ne(t,e,o){return`data-edit-list="${t}/${e}/${o}"`}function H(t,e,o="",i=""){return`<div class="slide ${o}" data-slide-type="${d(t.type)}" data-edit-slide="${d(e.id)}/${d(t.id)}" data-unit="${d(e.id)}" data-tag="${d(e.tag||"")}" data-total="${d(e.total||"")}"${i?" "+i:""}>`}const ot={section(t,e){return`${H(t,e,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${p(e.id,t.id,"kicker")}>${d(t.kicker||"Unit")}</span>
            <span ${p(e.id,t.id,"number")}>${d(t.number||"")}</span>
          </div>
          <h2 class="section__title" ${p(e.id,t.id,"title")}>${d(t.title||"")}</h2>
        </div>
      </div>
    </div>`},title(t,e){return`${H(t,e,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${p(e.id,t.id,"title")}>${d(t.title||"")}</h1>
          <div class="title-slide__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(t,e){const o=(t.items||[]).map((i,a)=>`<li ${p(e.id,t.id,`items[${a}]`)}>${z(i)}</li>`).join("");return`${H(t,e,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          ${t.lead?`<p class="bullets__lead" ${p(e.id,t.id,"lead")}>${z(t.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${p(e.id,t.id,"lead")}></p>`}
          <ul class="bullets__list" ${ne(e.id,t.id,"items")}>${o}</ul>
        </div>
      </div>
    </div>`},question(t,e){return`${H(t,e,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${p(e.id,t.id,"question")}>${d(t.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(t,e){const o=i=>{const a=t[i]||{title:"",items:[]},r=(a.items||[]).map((u,y)=>`<li ${p(e.id,t.id,`${i}.items[${y}]`)}>${z(u)}</li>`).join("");return`<div class="split__col">
        <h3 ${p(e.id,t.id,`${i}.title`)}>${d(a.title||"")}</h3>
        <ul ${ne(e.id,t.id,`${i}.items`)}>${r}</ul>
      </div>`};return`${H(t,e,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <div class="split__cols">
            ${o("left")}
            ${o("right")}
          </div>
        </div>
      </div>
    </div>`},prose(t,e){return`${H(t,e,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${t.eyebrow?`<div class="prose__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="prose__eyebrow" ${p(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="prose__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <p class="prose__body" ${p(e.id,t.id,"body")}>${z(t.body||"")}</p>
        </div>
      </div>
    </div>`},image(t,e){const o=t.fit==="contain"?"contain":"cover",i=d(t.src||""),a=d(t.alt||"");return`${H(t,e,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${o}">
          <img src="${i}" alt="${a}" />
          ${t.caption?`<div class="image-slide__caption" ${p(e.id,t.id,"caption")}>${z(t.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${p(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(t,e){const o=d(t.demo||""),i=!!t.code,a=i?oe(t.code):"",r=i?t.code.split(`
`).length:0;return`${H(t,e,`slide--demo${i?" slide--demo-with-code":""}`,`data-demo="${o}"`)}
      <div class="slide__body">
        <div class="demo">
          ${t.eyebrow?`<div class="demo__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="demo__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${t.hint?`<div class="demo__hint" ${p(e.id,t.id,"hint")}>${d(t.hint)}</div>`:""}
            </div>
            ${i?`<div class="demo__code-side">
              <div class="demo__line-count">${r} lines</div>
              <pre class="demo__code"><code ${p(e.id,t.id,"code")}>${a}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(t,e){const o=(t.language||"python").toLowerCase(),i=o==="python"?oe(t.code||""):d(t.code||""),a=ve(t.code||"");return`${H(t,e,`slide--code slide--code-${a}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${t.eyebrow?`<div class="code-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="code-slide__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:`<h2 class="code-slide__heading" ${p(e.id,t.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${d(o)}"><code ${p(e.id,t.id,"code")}>${i}</code></pre>
          ${t.caption?`<div class="code-slide__caption" ${p(e.id,t.id,"caption")}>${z(t.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${p(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(t,e){const o=t.regions||[],i=t.tooltips||{},a=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,r={};for(const w of o)for(let _=w.lines[0];_<=w.lines[1];_++)r[_]=w;const u=Object.keys(i).sort((w,_)=>_.length-w.length),k=(t.code||"").split(`
`).map((w,_)=>{const $=_+1,j=r[$];let n=oe(w)||" ";for(const h of u){const P=h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=i[h],K=typeof b=="object"?`data-tip-sig="${d(b.sig||"")}" data-tip-desc="${d(b.desc||"")}" data-tip-url="${d(b.url||"")}"`:`data-tip-sig="" data-tip-desc="${d(b)}" data-tip-url=""`;n=n.replace(new RegExp(P),`<span class="icode-tip" ${K}>${h}</span>`)}const l=j?j.id:"",S=j?j.color:"transparent";return`<div class="${`icode__line${a.test(w)?" icode__line--divider":""}`}" data-region="${l}" data-line="${$}" style="--rc:${S}"><span class="icode__line-num">${$}</span>${n}</div>`}).join(""),C=o.map((w,_)=>{const $=(w.links||[]).map(j=>`<a href="${d(j.url)}" target="_blank" rel="noopener">→ ${d(j.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${d(w.id)}" style="--rc:${d(w.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${d(w.label)}</div>
            <div class="icode__ann-key">${_+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${d(w.description)}</div>
            <div class="icode__ann-detail">${d(w.detail||"")}${$?`<div class="icode__ann-links">${$}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${H(t,e,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${t.heading?`<h2 class="icode__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${o.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${k}</pre>
            <div class="icode__annotations">${C}</div>
          </div>
          ${t.subtitle?`<div class="icode__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(t,e){const o=oe(t.code||""),i=ve(t.code||""),a=(t.annotations||[]).map((r,u)=>`<li ${p(e.id,t.id,`annotations[${u}]`)}>${z(r)}</li>`).join("");return`${H(t,e,`slide--annotated-code slide--acode-${i}`)}
      <div class="slide__body">
        <div class="acode">
          ${t.eyebrow?`<div class="acode__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="acode__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${p(e.id,t.id,"code")}>${o}</code></pre>
            <ol class="acode__annotations" ${ne(e.id,t.id,"annotations")}>${a}</ol>
          </div>
          ${t.subtitle?`<div class="acode__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(t,e){const o=(t.items||[]).map((i,a)=>`<li ${p(e.id,t.id,`items[${a}]`)}>${z(i)}</li>`).join("");return`${H(t,e,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <ol class="live__list" ${ne(e.id,t.id,"items")}>${o}</ol>
        </div>
      </div>
    </div>`}},nt={id:"01",number:"01",tag:"WHAT ENGINES DO",total:"12"},st=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"What Engines Do"},{id:"welcome",type:"title",eyebrow:"Game Engines & Scripting  ·  SS26",title:"Welcome.",subtitle:"Let's make games."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your project</b> — laptop, Unity, your repo. Every session.","<b>Short input, long workshop</b> — 20 min teaching, 70 min building.","<b>Vertical slice</b> by Unit 6. ","<b>Final build</b> — Windows, two scenes, GUI, audio, docs.","<b>Ask early.</b>"]},{id:"what-is-engine",type:"question",eyebrow:"Question for the room",question:"What is a game engine"},{id:"engine-illustration",type:"image",src:"/img/engine-diagram.svg",alt:"Cutaway illustration of a game engine: a small game scene at the top, with the layers of engine subsystems beneath it.",caption:"A game engine, cut away.",fit:"contain"},{id:"what-engines-do",type:"split",heading:"What an engine actually does for you",left:{title:"Runtime",items:["The <b>game loop</b> — input, update, render, repeat","Rendering — meshes, shaders, lighting, cameras","Physics — rigidbodies, colliders, raycasts","Audio — mixing, spatialization, streaming","Input — keyboard, mouse, gamepad, touch"]},right:{title:"Tooling",items:["Editor — scenes, hierarchy, inspector","Asset pipeline — import, compress, package","Build system — Windows, Mac, Web, Mobile","Animation, particles, UI, terrain","An ecosystem — packages, tutorials, jobs"]}},{id:"why-unity",type:"split",heading:"Why Unity for this course",left:{title:"The pitch",items:["Mature C# scripting — a real, modern language","Huge community + asset store + jobs market","2D & 3D in one tool","Free for students; ships to almost any platform","What most studios you'll intern at actually use"]},right:{title:"The landscape",items:["<b>Unreal</b> — bigger guns, steeper hill, C++ / Blueprints","<b>Godot</b> — open source, lighter, GDScript","<b>Roll your own</b> — no engine, just code & a window. We'll do this in <i>Game Programmierung</i>."]}},{id:"live-unity-tour",type:"live",heading:"Unity tour",items:["Unity Hub → install LTS → new 3D (URP) project","Editor anatomy — Hierarchy, Scene, Game, Inspector, Project, Console","Drop a Plane, a few Cubes, a Directional Light. Save the scene.","Add a <b>First-Person Controller</b> from the Starter Assets package","Hit Play — walk around. Mouse-look, jump, gravity.","Open the controller script. Read it together. <b>Don't panic.</b>","Change one number. Hit Play. See it change. That's the loop."]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Think about the game you want to build. 2 Scenes. Simple Interactions.",items:["3 Minute Pitch: Simple. Simple. Simple.","Think: Walking Simulator.","Reference a vibe, look, game.","Scope check: small, finishable beats ambitious-and-abandoned","Install Unity LTS + create a GitHub account if you don&#39;t have one",""]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],at={meta:nt,slides:st},rt={id:"02",number:"02",tag:"PITCH & BLOCKOUT",total:"12"},lt=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"Pitch & Blockout"},{id:"today",type:"bullets",heading:"Today.",lead:"Two things. ",items:["<b>30 min — Pitches.</b> 3 minutes each.","<b>60 min — Blockout.</b> Greybox your Scene 1 in Unity. Leave with something playable."]},{id:"pitch-rules",type:"bullets",heading:"The Pitch",lead:"3 minutes.",items:["<b>What is it?</b> One sentence. Genre, perspective, core mechanic.","<b>What does it feel like?</b> Reference a vibe, a game, a film, a place.","<b>Two scenes.</b> What are they? How do they differ in mood?","<b>Scope check.</b> Can you finish this in 10 weeks?"]},{id:"pitch-warning",type:"prose",eyebrow:"The rule",body:"Small and finished beats ambitious and abandoned.<br><br>Think <b>walking simulator</b>, not open world.<br><br>If your pitch takes more than one sentence to explain, it's too big."},{id:"pitches",type:"question",eyebrow:"Let's go",question:"Pitches"},{id:"blockout-what",type:"bullets",heading:"What is a blockout?",lead:"The ugliest version of your game that still communicates the idea.",items:["<b>Greybox geometry</b> — cubes, planes, cylinders. No textures, no materials.","<b>Scale matters</b> — walk through it. Does the space feel right?","<b>Camera matters</b> — first-person? Third-person? Top-down? Set it now.","<b>One interaction</b> — a door that opens, a light that toggles, a trigger zone. Prove the loop works.","The rest is commentary."]},{id:"blockout-live",type:"live",heading:"Blockout demo",items:["New scene. Save it as <b>Scene_01</b>.","Plane for the ground. Scale it up. That's your floor.","Cubes for walls, doorways, cover, landmarks. <b>Hold V</b> to vertex-snap.","First-Person Controller from Starter Assets — drop it in, hit Play, walk around.","Does the space feel too big? Too small? Fix it <b>now</b>, while it's cheap.","Add one trigger zone: <b>Box Collider (Is Trigger)</b> + a script that prints to Console.","Save. This is your starting point for the next 10 weeks."]},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Build your Scene 1"},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Scene 1 checkpoint — you should have all of these.",items:["A Unity project with a saved Scene_01","Ground plane + at least 5 greybox objects defining the space","A character controller you can walk around with","The space <b>feels right</b> — not too big, not too small","One interaction (trigger, door, light — anything)"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Git. GitHub. Push.",items:["<b>Create a GitHub repo</b> for your project. Add a proper <b>.gitignore for Unity</b>.","<b>Push your project.</b> Post the repo link.","<b>Extend the blockout.</b> Add Scene 2 — different mood, same project. Even if it's just a different lighting color on cubes.","Next week we set up your dev environment properly and talk about project structure."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],dt={meta:rt,slides:lt},ct={id:"03",number:"03",tag:"SCRIPTING & INTERACTIVITY",total:"21"},ut=[{id:"section",type:"section",number:"03",kicker:"Unit",title:"Scripting & Interactivity"},{id:"today",type:"bullets",heading:"Today.",lead:"Two halves.",items:["<b>Part 1 — Git.</b> Mental models + live setup in GitHub Desktop.","<b>Part 2 — Scripting.</b> Input, triggers, Unity Events. Make something happen in your scene.","Leave with <b>one scripted interaction</b> in your blockout."]},{id:"showcase",type:"question",eyebrow:"Homework",question:"Show us your repos"},{id:"git-repo",type:"prose",eyebrow:"Mental model 01",heading:"A repo is a folder that remembers",body:"A git repo is a project folder with a <b>timeline</b>. Every time you commit, the state of the folder is frozen — forever.<br><br>You can walk that timeline. Jump to any snapshot. See exactly what the project looked like three weeks ago on a Tuesday at 2 PM.<br><br>Unlike Dropbox: nothing overwrites. Every snapshot is named, dated, and signed."},{id:"git-commit",type:"prose",eyebrow:"Mental model 02",heading:"A commit is a labeled save state",body:'Every commit has a <b>message</b>. That message is a note to your future self: <i>what were you doing, and why?</i><br><br>A bare <b>"update"</b> is not a message. <b>"fix door not opening on trigger"</b> is.<br><br>Small and frequent beats rare and huge. Commit every time you reach a working state — not at the end of the day with 600 changed files.'},{id:"git-remote",type:"prose",eyebrow:"Mental model 03",heading:"GitHub is a mirror",body:"Your local repo is the real one. GitHub is a copy that syncs on command.<br><br><b>Push</b> — send my new commits up.<br><b>Pull</b> — grab their new commits down.<br><br>Working alone: GitHub is your backup, your portfolio, and the place your code survives a laptop dying. Push often."},{id:"git-ignore",type:"bullets",heading:".gitignore for Unity",lead:"Some files do not belong in the timeline.",items:["<b>Library/</b> — regenerated from your assets. Gigabytes. Never commit.","<b>Temp/, Logs/, obj/, Build/, Builds/</b> — build artifacts. Throwaway.","<b>UserSettings/, .vs/, .idea/</b> — your local editor state. Nobody else's problem.","<b>*.csproj, *.sln</b> — generated by Unity. Ignore them.","<b>.meta files</b> — <i>always</i> commit them. They link your assets to references. Ignore them and your project breaks on another machine."]},{id:"git-live",type:"live",heading:"Live: GitHub Desktop setup",items:["Install <b>GitHub Desktop</b>. Sign in with your GitHub account.","<b>File → Add Local Repository</b> → point at your Unity project folder. If not yet a repo, it will offer to initialize one.","Drop a Unity <b>.gitignore</b> in the project root — copy from <b>github.com/github/gitignore</b> (Unity.gitignore).",'First commit: message <b>"initial commit — blockout scene"</b>. Commit to main. Push to origin.',"<b>Publish repository</b> — private or public. Post the URL in the chat.","Make a small change in Unity. Save. Watch GitHub Desktop see the diff. Commit with a real message. Push.","That is the whole loop: <b>change → commit → push</b>. Repeat forever."]},{id:"section-scripting",type:"section",number:"03",kicker:"Part 2",title:"Scripting"},{id:"script-what",type:"prose",eyebrow:"Concept 01",heading:"A script is a Component",body:"Everything in a scene is a <b>GameObject</b>. Every GameObject is a bag of <b>Components</b> — Transform, Renderer, Collider, AudioSource.<br><br>A script you write becomes a Component. Drop it on any GameObject; now that object has your behavior.<br><br>Same script on three cubes = three independent instances. Same code, different state."},{id:"script-lifecycle",type:"code",eyebrow:"Concept 02",heading:"Start runs once. Update runs every frame.",code:`using UnityEngine;

public class Spinner : MonoBehaviour {
    public float speed = 90f;  // shows up in the Inspector

    void Start() {
        // runs once, when the object wakes up
    }

    void Update() {
        // runs every frame — ~60 times per second
        transform.Rotate(0f, speed * Time.deltaTime, 0f);
    }
}`,caption:"<b>Time.deltaTime</b> = seconds since the last frame. Multiply your speed by it and your motion is frame-rate independent.",language:"csharp"},{id:"live-spin",type:"live",heading:"Live: your first script",items:["<b>Assets → Create → C# Script</b> → name it <b>Spinner</b>. Drag it onto a cube.","Open in your editor. Paste the Rotate line into Update.","Hit Play. Cube spins.","Select the cube. Look at the Inspector — your <b>public speed</b> is right there. Change it while the game runs. Watch it react.","<b>That is the magic.</b> The Inspector is not a UI — it is a window into your running code."]},{id:"input",type:"code",eyebrow:"Concept 03",heading:"Input — keys and axes",code:`void Update() {
    // held every frame
    if (Input.GetKey(KeyCode.Space)) {
        transform.Translate(Vector3.up * 5f * Time.deltaTime);
    }

    // fires once, on the frame the key goes down
    if (Input.GetKeyDown(KeyCode.E)) {
        Debug.Log("Pressed E");
    }

    // smooth -1 to 1, keyboard or gamepad
    float h = Input.GetAxis("Horizontal");
    float v = Input.GetAxis("Vertical");
    transform.Translate(new Vector3(h, 0f, v) * 5f * Time.deltaTime);
}`,caption:"<b>GetKey</b> — held. <b>GetKeyDown</b> — just pressed. <b>GetAxis</b> — smoothed -1…1 for WASD / arrows / gamepad stick.",language:"csharp"},{id:"live-move",type:"live",heading:"Live: walking a cube",items:["New script <b>Mover</b> on a cube. (Turn off the first-person controller for a moment.)","Read the input axes in Update. Translate the transform.","Play. Walk your cube around with WASD.","Add <b>public float moveSpeed = 5f;</b> and tune it live in the Inspector.","Sidebar: this is a <b>kinematic</b> mover — it ignores physics and clips through walls. Great for puzzles. For rigidbody-driven motion we'll use forces next week."]},{id:"trigger",type:"code",eyebrow:"Concept 04",heading:"Trigger zones",code:`public class DoorTrigger : MonoBehaviour {
    public GameObject door;

    void OnTriggerEnter(Collider other) {
        if (other.CompareTag("Player")) {
            door.SetActive(false); // crude: the door vanishes
        }
    }

    void OnTriggerExit(Collider other) {
        if (other.CompareTag("Player")) {
            door.SetActive(true);
        }
    }
}`,caption:"Box Collider with <b>Is Trigger</b> enabled — objects pass through instead of bouncing, and your script gets called. The other object needs a Rigidbody (or a CharacterController).",language:"csharp"},{id:"live-trigger",type:"live",heading:"Live: a door that opens",items:["Scale a cube into a wall with a door-shaped hole. Place a real door cube in the hole.","Empty GameObject with a Box Collider sized to the doorway. Check <b>Is Trigger</b>.","Attach <b>DoorTrigger</b>. Drag the door cube into the <b>door</b> field in the Inspector.","Tag your player as <b>Player</b>. Play. Walk toward the door. Watch it vanish.","Smells like a teleporter. Later: animate the door, add a sound, add a particle puff. This is the hook."]},{id:"unity-events",type:"prose",eyebrow:"Concept 05",heading:"Unity Events — wiring without code",body:"A <b>UnityEvent</b> is a hook you expose in the Inspector. Other objects subscribe <i>visually</i>, by dragging — and when the event fires, every subscriber runs.<br><br>One trigger can open a door, play a sound, shake the camera, and log a message — <b>without knowing</b> any of those things exist. You wire them together in the Inspector.<br><br>This is how Unity's UI Buttons work. Same pattern for your own triggers. Decoupled, messy-in-a-good-way, Inspector-first."},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Add one scripted interaction"},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Unit 3 checkpoint.",items:["Unity project on GitHub with a proper <b>.gitignore</b>","You can commit + push from GitHub Desktop without panicking","At least <b>one scripted interaction</b> in your scene — trigger, mover, toggle, anything","You know where the Inspector surfaces your public fields"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Two scripted interactions. Commit often.",items:["<b>Two interactions</b> in your scene. Different kinds — one trigger, one input, or one of each.",'Commit as you go. At least <b>five commits</b>. Real messages, not "update".',"Next week: <b>Game Objects, Prefabs, Physics.</b> Start thinking about what in your game needs to collide."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],pt={meta:ct,slides:ut},ht=[at,dt,pt],gt=ht.map(t=>tt(t.meta,t.slides)).join(`
`),_e=document.createElement("deck-root");_e.innerHTML=gt;document.body.appendChild(_e);
