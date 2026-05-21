(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const h of r.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();function Me(t){const e=t.getContext("2d");t.width=t.clientWidth*devicePixelRatio,t.height=t.clientHeight*devicePixelRatio,e.scale(devicePixelRatio,devicePixelRatio);const o=t.clientWidth,i=t.clientHeight;let s=o/2-20,r=i/2-20;const h=5,f={},x=w=>{"wasd".includes(w.key.toLowerCase())&&(f[w.key.toLowerCase()]=w.type==="keydown",w.preventDefault())};window.addEventListener("keydown",x),window.addEventListener("keyup",x);let A;function _(){f.a&&(s-=h),f.d&&(s+=h),f.w&&(r-=h),f.s&&(r+=h),s=Math.max(0,Math.min(s,o-40)),r=Math.max(0,Math.min(r,i-40)),e.fillStyle="#0b0d10",e.fillRect(0,0,o,i),e.fillStyle="#ff6b35",e.fillRect(s,r,40,40),A=requestAnimationFrame(_)}return _(),()=>{cancelAnimationFrame(A),window.removeEventListener("keydown",x),window.removeEventListener("keyup",x)}}const G=1200,z=540,le=140,Q=z+le,V=42,W=54,Ie=7,Re=8,Ge=.35,je=2.2,He=.5,qe=1.55,De=1.9,N=240,re=[[0,470,340,70],[420,470,200,70],[680,420,160,120],[880,350,100,190],[1040,470,160,70],[920,280,80,16]],Ue=`
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
  aspect-ratio: ${G} / ${Q};
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
`;function Be(){if(document.getElementById("mario-jump-styles"))return;const t=document.createElement("style");t.id="mario-jump-styles",t.textContent=Ue,document.head.appendChild(t)}function We(t){Be();const e=t.getContext("2d"),o=Math.max(1,Math.min(3,window.devicePixelRatio||1));let i=0,s=0;function r(){const a=t.getBoundingClientRect();a.width<1||a.height<1||(i=a.width,s=a.height,t.width=Math.round(i*o),t.height=Math.round(s*o))}const h=new ResizeObserver(r);h.observe(t),r();const f=new Image;f.src="img/claude-sprite.png";let x=!1;f.onload=()=>{x=!0};const A=new Image;A.src="img/playground-backdrop.png";let _=!1;A.onload=()=>{_=!0};const w={gravity:.65,jumpStrength:13.5,moveSpeed:5,airControl:1,realisticMode:!1,variableJump:!0,coyoteTime:!0,jumpBuffer:!0,apexHang:!0,asymmetricGravity:!0,fastFall:!0},k={...w},M=["variableJump","coyoteTime","jumpBuffer","apexHang","asymmetricGravity","fastFall"],n={x:80,y:470-W,vx:0,vy:0,facing:1,squash:1},l={onGround:!1,coyote:0,buffer:0,currentGravity:w.gravity,jumpPressedThisFrame:!1,releasedJumpInRise:!1},$={vy:new Float32Array(N),ay:new Float32Array(N),y:new Float32Array(N),head:0};function c(){$.vy[$.head]=n.vy,$.ay[$.head]=l.currentGravity,$.y[$.head]=n.y,$.head=($.head+1)%N}function b(){n.x=80,n.y=470-W,n.vx=0,n.vy=0,n.facing=1,n.squash=1,l.onGround=!1,l.coyote=0,l.buffer=0,l.releasedJumpInRise=!1,$.vy.fill(0),$.ay.fill(0),$.y.fill(n.y),$.head=0}const u={left:!1,right:!1,jump:!1,down:!1},C={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"jump",w:"jump"," ":"jump",arrowdown:"down",s:"down"};let m=!1;function j(a){if(!m)return;const g=a.key.toLowerCase();if(g==="r"&&a.type==="keydown"){b(),a.preventDefault(),a.stopImmediatePropagation();return}const y=C[g];if(!y)return;const T=a.type==="keydown";y==="jump"&&(T&&!u.jump&&(l.jumpPressedThisFrame=!0),!T&&u.jump&&n.vy<0&&(l.releasedJumpInRise=!0)),u[y]=T,a.preventDefault(),a.stopImmediatePropagation()}window.addEventListener("keydown",j,!0),window.addEventListener("keyup",j,!0),t.setAttribute("tabindex","0"),t.style.outline="none";const Y=()=>{m=!0,t.style.boxShadow="inset 0 0 0 2px rgba(255,107,53,0.6)"},D=()=>{m=!1,t.style.boxShadow="",u.left=u.right=u.jump=u.down=!1};t.addEventListener("focus",Y),t.addEventListener("blur",D);const X=()=>t.focus();t.addEventListener("pointerdown",X);function U(a,g,y){return`<label class="pg-toggle">
      <input type="checkbox" data-cfg="${a}" ${w[a]?"checked":""} />
      <span class="pg-toggle__label">${g}</span>
      <span class="pg-toggle__desc">${y}</span>
    </label>`}function K(a,g,y,T,F,P=S=>S.toFixed(2)){return`<label class="pg-slider">
      <span class="pg-slider__label">${F}</span>
      <span class="pg-slider__value" data-for="${a}">${P(w[a])}</span>
      <input type="range" data-cfg="${a}" min="${g}" max="${y}" step="${T}" value="${w[a]}" />
    </label>`}const L=document.createElement("div");L.className="playground-ui",L.innerHTML=`
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
  `;const B={vx:L.querySelector("[data-stat=vx]"),vy:L.querySelector("[data-stat=vy]"),ay:L.querySelector("[data-stat=ay]"),ground:L.querySelector("[data-stat=ground]"),coyote:L.querySelector("[data-stat=coyote]"),buffer:L.querySelector("[data-stat=buffer]")};L.querySelectorAll("input[data-cfg]").forEach(a=>{a.addEventListener("input",()=>{const g=a.dataset.cfg;if(a.type==="checkbox"){if(k[g]=a.checked,g==="realisticMode"&&a.checked&&M.forEach(y=>{k[y]=!1;const T=L.querySelector(`input[data-cfg="${y}"]`);T&&(T.checked=!1)}),M.includes(g)&&a.checked&&k.realisticMode){k.realisticMode=!1;const y=L.querySelector('input[data-cfg="realisticMode"]');y&&(y.checked=!1)}}else{const y=parseFloat(a.value);k[g]=y;const T=L.querySelector(`.pg-slider__value[data-for="${g}"]`);T&&(T.textContent=Number.isInteger(y*2)?y.toFixed(1):y.toFixed(2))}})}),L.querySelector(".pg-reset").addEventListener("click",b);const ee=t.closest(".demo__split");ee.classList.add("playground-wrap"),ee.appendChild(L);function pe(a,g,y,T,F,P,S,v){return a<F+S&&a+y>F&&g<P+v&&g+T>P}function ae(a,g,y){return a+(g-a)*y}function _e(a){let g=0;u.left&&(g-=k.moveSpeed),u.right&&(g+=k.moveSpeed);const y=l.onGround?1:k.airControl;n.vx=ae(n.vx,g,Math.min(1,.3*y*a)),Math.abs(g)>.2&&(n.facing=Math.sign(g)),l.jumpPressedThisFrame&&(l.buffer=k.jumpBuffer?Re:1),l.buffer=Math.max(0,l.buffer-a);const T=l.onGround||k.coyoteTime&&l.coyote>0;l.buffer>0&&T&&(n.vy=-k.jumpStrength,l.buffer=0,l.coyote=0,l.onGround=!1,l.releasedJumpInRise=!1,n.squash=1.2),k.variableJump&&l.releasedJumpInRise&&n.vy<0&&(n.vy*=Ge,l.releasedJumpInRise=!1),u.jump||(l.releasedJumpInRise=!1);let F=k.gravity;const P=!k.realisticMode;P&&k.apexHang&&Math.abs(n.vy)<je&&(F*=He),P&&k.asymmetricGravity&&n.vy>0&&(F*=qe),P&&k.fastFall&&u.down&&n.vy>0&&(F*=De),l.currentGravity=F,n.vy+=F*a,n.vy>18&&(n.vy=18),n.x+=n.vx*a;for(const[v,E,O,H]of re)pe(n.x,n.y,V,W,v,E,O,H)&&(n.vx>0?n.x=v-V:n.vx<0&&(n.x=v+O),n.vx=0);const S=l.onGround;l.onGround=!1,n.y+=n.vy*a;for(const[v,E,O,H]of re)if(pe(n.x,n.y,V,W,v,E,O,H)){if(n.vy>0){if(n.y=E-W,l.onGround=!0,!S){const J=Math.min(1,n.vy/16);n.squash=ae(1,.7,J)}}else n.vy<0&&(n.y=E+H);n.vy=0}S&&!l.onGround&&n.vy>=0?l.coyote=Ie:l.coyote>0&&!l.onGround?l.coyote=Math.max(0,l.coyote-a):l.onGround&&(l.coyote=0),n.squash=ae(n.squash,1,Math.min(1,.2*a)),(n.y>z+200||n.x<-300||n.x>G+300)&&b(),l.jumpPressedThisFrame=!1,c()}let ke=0;function xe(){if(++ke%4!==0)return;const a=g=>g>=0?"+":"";B.vx.textContent=`${a(n.vx)}${n.vx.toFixed(2)}`,B.vy.textContent=`${a(n.vy)}${n.vy.toFixed(2)}`,B.ay.textContent=`${a(l.currentGravity)}${l.currentGravity.toFixed(2)}`,B.ground.textContent=l.onGround?"yes":"no",B.ground.className=l.onGround?"good":"muted",B.coyote.textContent=l.coyote.toFixed(0),B.coyote.className=l.coyote>0?"accent":"muted",B.buffer.textContent=l.buffer.toFixed(0),B.buffer.className=l.buffer>0?"accent":"muted"}function Te(){if(_){const S=A.width/A.height,v=G/z;let E,O,H,J;S>v?(O=z,E=O*S,H=(G-E)/2,J=0):(E=G,O=E/S,H=0,J=(z-O)/2),e.drawImage(A,H,J,E,O)}else{const S=e.createLinearGradient(0,0,0,z);S.addColorStop(0,"#0b0d10"),S.addColorStop(1,"#2a1f1a"),e.fillStyle=S,e.fillRect(0,0,G,z)}for(const[S,v,E,O]of re)e.fillStyle="#b78363",e.fillRect(S,v,E,O),e.fillStyle="#f1c591",e.fillRect(S,v,E,5),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(S+E-3,v,3,O),e.fillStyle="#8a5a3a",e.fillRect(S,v+5,E,2);e.save();const a=n.x+V/2,g=n.y+W;e.translate(a,g);let y=n.squash,T=1/n.squash;if(!l.onGround){const S=Math.max(-.15,Math.min(.22,-n.vy/80));y*=1+S,T*=1-S*.6}e.scale(T*n.facing,y);const F=V*2,P=W*2;x?e.drawImage(f,-F/2,-P*.92,F,P):(e.fillStyle="#d97757",e.fillRect(-V/2,-W,V,W)),e.restore()}function $e(){const a=z,g=12,y=3,T=12,F=(G-g*2-T*(y-1))/y,P=le-g*2;e.fillStyle="rgba(11, 13, 16, 0.85)",e.fillRect(0,a,G,le),e.fillStyle="rgba(255,255,255,0.06)",e.fillRect(0,a,G,1),[{label:"y (position)",data:$.y,color:"#6fb3d2",min:0,max:z,invert:!0,zeroLine:!1},{label:"vy (velocity)",data:$.vy,color:"#ff6b35",min:-22,max:22,invert:!1,zeroLine:!0},{label:"ay (accel/grav)",data:$.ay,color:"#98c379",min:0,max:3,invert:!1,zeroLine:!1}].forEach((v,E)=>{const O=g+E*(F+T);if(e.fillStyle="rgba(255,255,255,0.04)",e.fillRect(O,a+g,F,P),e.font="12px ui-monospace, monospace",e.textBaseline="top",e.fillStyle="rgba(255,255,255,0.55)",e.fillText(v.label,O+8,a+g+6),v.zeroLine){const Z=a+g+P*((0-v.min)/(v.max-v.min));e.fillStyle="rgba(255,255,255,0.15)",e.fillRect(O,Z,F,1)}e.strokeStyle=v.color,e.lineWidth=1.5,e.beginPath();for(let Z=0;Z<N;Z++){const Ae=($.head+Z)%N,Pe=v.data[Ae],Ce=Z/(N-1),be=Math.max(0,Math.min(1,(Pe-v.min)/(v.max-v.min))),Le=v.invert?be:1-be,ye=O+Ce*F,me=a+g+Le*P;Z===0?e.moveTo(ye,me):e.lineTo(ye,me)}e.stroke();const H=($.head-1+N)%N,J=v.data[H],ge=Math.max(0,Math.min(1,(J-v.min)/(v.max-v.min))),Fe=v.invert?ge:1-ge,Oe=O+F-1,Ee=a+g+Fe*P;e.fillStyle=v.color,e.beginPath(),e.arc(Oe,Ee,3,0,Math.PI*2),e.fill()})}function Se(){if(i<1||s<1)return;e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,t.width,t.height);const a=Math.min(i/G,s/Q),g=(i-G*a)/2,y=(s-Q*a)/2,T=a*o;e.setTransform(T,0,0,T,g*o,y*o),e.imageSmoothingEnabled=!1,Te(),$e(),m||(e.fillStyle="rgba(0,0,0,0.45)",e.fillRect(0,0,G,Q),e.fillStyle="#ffe6d4",e.font="bold 28px ui-monospace, monospace",e.textAlign="center",e.textBaseline="middle",e.fillText("click to play",G/2,Q/2),e.textAlign="start")}let se,he=performance.now();function ue(a){const g=Math.min(40,a-he);he=a;const y=g/(1e3/60);_e(y),xe(),Se(),se=requestAnimationFrame(ue)}return se=requestAnimationFrame(ue),()=>{cancelAnimationFrame(se),window.removeEventListener("keydown",j,!0),window.removeEventListener("keyup",j,!0),t.removeEventListener("focus",Y),t.removeEventListener("blur",D),t.removeEventListener("pointerdown",X),h.disconnect(),L.remove(),ee&&ee.classList.remove("playground-wrap"),t.style.boxShadow=""}}const Ne={"moving-square":Me,"mario-jump":We};let te=null;function ze(t){if(te&&(te(),te=null),!t)return;const e=t.querySelector(".demo__canvas"),o=t.getAttribute("data-demo");if(!e||!o)return;const i=Ne[o];if(!i){console.warn(`[demo] unknown demo: ${o}`);return}te=i(e)||null}let ie=null;function Ye(t){if(ie&&(ie(),ie=null),!(t!=null&&t.hasAttribute("data-interactive-code")))return;const e=t.querySelector(".icode");if(!e)return;const o=[...t.querySelectorAll(".icode__line[data-region]")],i=[...t.querySelectorAll(".icode__ann[data-region]")],s=[...t.querySelectorAll(".icode-tip")],r=[...new Set(o.map(c=>c.dataset.region).filter(Boolean))],h=new Set;let f=null,x=null,A=!1,_=null;function w(){const c=f!==null;e.classList.toggle("icode--has-active",c),e.classList.toggle("icode--has-revealed",h.size>0);for(const b of o){const u=b.dataset.region;u&&(b.classList.toggle("icode__line--active",u===f),b.classList.toggle("icode__line--revealed",h.has(u)))}for(const b of i){const u=b.dataset.region;b.classList.toggle("icode__ann--active",u===f),b.classList.toggle("icode__ann--revealed",h.has(u))}}function k(){A||h.size>=r.length&&(A=!0,e.classList.add("icode--complete"),setTimeout(()=>e.classList.remove("icode--complete"),900))}w();function M(c){var b,u;if(!((b=c.target)!=null&&b.isContentEditable||/input|textarea/i.test((u=c.target)==null?void 0:u.tagName))){if(c.key>="1"&&c.key<="9"){const C=parseInt(c.key)-1;if(C>=r.length)return;c.preventDefault();const m=r[C];f===m?(f=null,x=null):(h.add(m),f=m,x=m,k()),w();return}if(c.key==="0"||c.key==="Escape"){(f||x)&&(c.preventDefault(),f=null,x=null,w());return}}}addEventListener("keydown",M);const n=[];for(const c of o){const b=c.dataset.region;if(!b)continue;const u=()=>{!x&&h.has(b)&&(f=b,w())},C=()=>{x||(f=null,w())};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),n.push({el:c,events:{mouseenter:u,mouseleave:C}})}for(const c of i){const b=c.dataset.region,u=()=>{!x&&h.has(b)&&(f=b,w())},C=()=>{x||(f=null,w())},m=()=>{x===b?(x=null,f=null):(h.add(b),x=b,f=b,k()),w()};c.addEventListener("mouseenter",u),c.addEventListener("mouseleave",C),c.addEventListener("click",m),n.push({el:c,events:{mouseenter:u,mouseleave:C,click:m}})}function l(c){$();const b=c.dataset.tipSig||"",u=c.dataset.tipDesc||"",C=c.dataset.tipUrl||"";if(!b&&!u)return;const m=document.createElement("div");m.className="icode-tooltip",m.innerHTML=[b?`<code class="icode-tooltip__sig">${de(b)}</code>`:"",u?`<div class="icode-tooltip__desc">${de(u)}</div>`:"",C?`<a class="icode-tooltip__link" href="${de(C)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),e.appendChild(m),e.style.position="relative";let j=0,Y=0,D=c;for(;D&&D!==e;)j+=D.offsetTop,Y+=D.offsetLeft,D=D.offsetParent;m.style.left=Math.max(0,Y)+"px",m.style.visibility="hidden";const X=m.offsetHeight,U=m.offsetWidth;j-X-10<0?(m.style.top=j+c.offsetHeight+8+"px",m.classList.add("icode-tooltip--below")):m.style.top=j-X-8+"px";const K=e.offsetWidth-U-8;parseInt(m.style.left)>K&&(m.style.left=Math.max(0,K)+"px"),m.style.visibility="",_=m}function $(){_&&(_.remove(),_=null)}for(const c of s){const b=()=>l(c),u=()=>$();c.addEventListener("mouseenter",b),c.addEventListener("mouseleave",u),n.push({el:c,events:{mouseenter:b,mouseleave:u}})}ie=()=>{removeEventListener("keydown",M);for(const c of n)for(const[b,u]of Object.entries(c.events))c.el.removeEventListener(b,u);$(),f=null,x=null,e.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const c of o)c.classList.remove("icode__line--active","icode__line--revealed");for(const c of i)c.classList.remove("icode__ann--active","icode__ann--revealed")}}function de(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ke=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",Ke);class Je extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const e=document.createElement("div");for(e.className="deck__stage";this.firstChild;)e.appendChild(this.firstChild);this.appendChild(e),this._stage=e,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",o=>this._onKey(o)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const o=new URLSearchParams(location.search).get("unit");let i=Array.from(this._stage.querySelectorAll(".slide"));o&&(i=i.filter(s=>s.getAttribute("data-unit")===o),this._stage.querySelectorAll(".slide").forEach(s=>{i.includes(s)||s.remove()})),this._slides=i}_buildFooter(){const e=document.createElement("div");e.className="deck__footer",e.innerHTML=`
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
    `,document.body.appendChild(e),this._help=e}_readHashIndex(){var i;const e=location.hash.match(/^#(\d+)/);if(!e)return 0;const o=parseInt(e[1],10)-1;return Math.max(0,Math.min(o,(((i=this._slides)==null?void 0:i.length)||1)-1))}_show(e){if(!this._slides.length||e<0||e>=this._slides.length)return;this._index=e;const o=this._slides.length;this._slides.forEach((A,_)=>{_===e?A.setAttribute("data-active",""):A.removeAttribute("data-active")});const i=this._slides[e],s=i.getAttribute("data-unit")||"",r=i.getAttribute("data-tag")||"",h=i.getAttribute("data-total")||"12",f=[];s&&f.push(`UNIT ${s} / ${h}`),r&&f.push(r);const x=f.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=x),this._fNum&&(this._fNum.textContent=`${String(e+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(e+1)/o*100}%`),location.hash!==`#${e+1}`&&history.replaceState(null,"",`#${e+1}`),ze(i),Ye(i),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:e,slide:i}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(e){if(!(e.target&&e.target.isContentEditable)&&!(e.target&&/input|textarea/i.test(e.target.tagName))){if(e.ctrlKey&&e.shiftKey&&(e.key==="E"||e.key==="e")){e.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(e.key){case"ArrowRight":case" ":case"PageDown":e.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":e.preventDefault(),this._prev();break;case"Home":e.preventDefault(),this._show(0);break;case"End":e.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":e.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const o=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("deck-theme",o)}_scale(){const e=innerWidth,o=innerHeight,i=Math.min(e/1920,o/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${i})`}}customElements.get("deck-root")||customElements.define("deck-root",Je);const Ze=["B","I","EM","STRONG","BR"],Ve=new Set(Ze),Xe=new Set(["BR"]);function d(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function q(t){if(t==null)return"";const e=document.createElement("template");return e.innerHTML=String(t),ce(e.content)}function ce(t){let e="";for(const o of t.childNodes)if(o.nodeType===Node.TEXT_NODE)e+=d(o.nodeValue);else if(o.nodeType===Node.ELEMENT_NODE){const i=o.tagName;if(Ve.has(i)){const s=i.toLowerCase();Xe.has(i)?e+=`<${s}>`:e+=`<${s}>${ce(o)}</${s}>`}else e+=ce(o)}return e}const Qe=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),et=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),fe=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function I(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function oe(t){if(t==null)return"";let e="",o=0,i=null,s;for(fe.lastIndex=0;(s=fe.exec(t))!==null;){if(s.index>o){const h=t.slice(o,s.index);e+=I(h),/\S/.test(h)&&(i=null)}const r=s.groups;if(r.comment)e+=`<span class="tok-comment">${I(r.comment)}</span>`,i=null;else if(r.tstring)e+=`<span class="tok-string">${I(r.tstring)}</span>`,i=null;else if(r.fstring)e+=`<span class="tok-string">${I(r.fstring)}</span>`,i=null;else if(r.string)e+=`<span class="tok-string">${I(r.string)}</span>`,i=null;else if(r.decorator)e+=`<span class="tok-decorator">${I(r.decorator)}</span>`,i=null;else if(r.number)e+=`<span class="tok-number">${I(r.number)}</span>`,i=null;else if(r.word){const h=r.word;i==="function"?(e+=`<span class="tok-function-def">${I(h)}</span>`,i=null):i==="class"?(e+=`<span class="tok-class-def">${I(h)}</span>`,i=null):Qe.has(h)?(e+=`<span class="tok-keyword">${I(h)}</span>`,h==="def"?i="function":h==="class"?i="class":i=null):et.has(h)?(e+=`<span class="tok-builtin">${I(h)}</span>`,i=null):(e+=I(h),i=null)}o=s.index+s[0].length}return o<t.length&&(e+=I(t.slice(o))),e}function ve(t){const e=(t||"").split(`
`).length;return e>=20?"xs":e>=14?"sm":e>=10?"md":"lg"}function tt(t,e){return e.map(o=>it(o,t)).join(`
`)}function it(t,e){const o=ot[t.type];return o?o(t,e):`<div class="slide"><div class="slide__body">Unknown slide type: ${d(t.type)}</div></div>`}function p(t,e,o){return`data-edit="${t}/${e}/${o}"`}function ne(t,e,o){return`data-edit-list="${t}/${e}/${o}"`}function R(t,e,o="",i=""){return`<div class="slide ${o}" data-slide-type="${d(t.type)}" data-edit-slide="${d(e.id)}/${d(t.id)}" data-unit="${d(e.id)}" data-tag="${d(e.tag||"")}" data-total="${d(e.total||"")}"${i?" "+i:""}>`}const ot={section(t,e){return`${R(t,e,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${p(e.id,t.id,"kicker")}>${d(t.kicker||"Unit")}</span>
            <span ${p(e.id,t.id,"number")}>${d(t.number||"")}</span>
          </div>
          <h2 class="section__title" ${p(e.id,t.id,"title")}>${d(t.title||"")}</h2>
        </div>
      </div>
    </div>`},title(t,e){return`${R(t,e,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${p(e.id,t.id,"title")}>${d(t.title||"")}</h1>
          <div class="title-slide__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(t,e){const o=(t.items||[]).map((i,s)=>`<li ${p(e.id,t.id,`items[${s}]`)}>${q(i)}</li>`).join("");return`${R(t,e,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          ${t.lead?`<p class="bullets__lead" ${p(e.id,t.id,"lead")}>${q(t.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${p(e.id,t.id,"lead")}></p>`}
          <ul class="bullets__list" ${ne(e.id,t.id,"items")}>${o}</ul>
        </div>
      </div>
    </div>`},question(t,e){return`${R(t,e,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${p(e.id,t.id,"question")}>${d(t.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(t,e){const o=i=>{const s=t[i]||{title:"",items:[]},r=(s.items||[]).map((h,f)=>`<li ${p(e.id,t.id,`${i}.items[${f}]`)}>${q(h)}</li>`).join("");return`<div class="split__col">
        <h3 ${p(e.id,t.id,`${i}.title`)}>${d(s.title||"")}</h3>
        <ul ${ne(e.id,t.id,`${i}.items`)}>${r}</ul>
      </div>`};return`${R(t,e,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <div class="split__cols">
            ${o("left")}
            ${o("right")}
          </div>
        </div>
      </div>
    </div>`},prose(t,e){return`${R(t,e,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${t.eyebrow?`<div class="prose__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="prose__eyebrow" ${p(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="prose__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <p class="prose__body" ${p(e.id,t.id,"body")}>${q(t.body||"")}</p>
        </div>
      </div>
    </div>`},concept(t,e){const o=t.diagram||"";return`${R(t,e,"slide--concept")}
      <div class="slide__body">
        <div class="concept">
          ${t.eyebrow?`<div class="concept__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          <h2 class="concept__statement" ${p(e.id,t.id,"statement")}>${q(t.statement||"")}</h2>
          <div class="concept__diagram">${o}</div>
          ${t.caption?`<div class="concept__caption" ${p(e.id,t.id,"caption")}>${q(t.caption)}</div>`:""}
        </div>
      </div>
    </div>`},image(t,e){const o=t.fit==="contain"?"contain":"cover",i=d(t.src||""),s=d(t.alt||"");return`${R(t,e,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${o}">
          <img src="${i}" alt="${s}" />
          ${t.caption?`<div class="image-slide__caption" ${p(e.id,t.id,"caption")}>${q(t.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${p(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(t,e){const o=d(t.demo||""),i=!!t.code,s=i?oe(t.code):"",r=i?t.code.split(`
`).length:0;return`${R(t,e,`slide--demo${i?" slide--demo-with-code":""}`,`data-demo="${o}"`)}
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
              <pre class="demo__code"><code ${p(e.id,t.id,"code")}>${s}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(t,e){const o=(t.language||"python").toLowerCase(),i=o==="python"?oe(t.code||""):d(t.code||""),s=ve(t.code||"");return`${R(t,e,`slide--code slide--code-${s}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${t.eyebrow?`<div class="code-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${p(e.id,t.id,"eyebrow")}></div>`}
          ${t.heading?`<h2 class="code-slide__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:`<h2 class="code-slide__heading" ${p(e.id,t.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${d(o)}"><code ${p(e.id,t.id,"code")}>${i}</code></pre>
          ${t.caption?`<div class="code-slide__caption" ${p(e.id,t.id,"caption")}>${q(t.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${p(e.id,t.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(t,e){const o=t.regions||[],i=t.tooltips||{},s=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,r={};for(const _ of o)for(let w=_.lines[0];w<=_.lines[1];w++)r[w]=_;const h=Object.keys(i).sort((_,w)=>w.length-_.length),x=(t.code||"").split(`
`).map((_,w)=>{const k=w+1,M=r[k];let n=oe(_)||" ";for(const u of h){const C=u.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),m=i[u],Y=typeof m=="object"?`data-tip-sig="${d(m.sig||"")}" data-tip-desc="${d(m.desc||"")}" data-tip-url="${d(m.url||"")}"`:`data-tip-sig="" data-tip-desc="${d(m)}" data-tip-url=""`;n=n.replace(new RegExp(C),`<span class="icode-tip" ${Y}>${u}</span>`)}const l=M?M.id:"",$=M?M.color:"transparent";return`<div class="${`icode__line${s.test(_)?" icode__line--divider":""}`}" data-region="${l}" data-line="${k}" style="--rc:${$}"><span class="icode__line-num">${k}</span>${n}</div>`}).join(""),A=o.map((_,w)=>{const k=(_.links||[]).map(M=>`<a href="${d(M.url)}" target="_blank" rel="noopener">→ ${d(M.label)}</a>`).join(" ");return`
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
      </div>`}).join("");return`${R(t,e,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${t.heading?`<h2 class="icode__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${o.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${x}</pre>
            <div class="icode__annotations">${A}</div>
          </div>
          ${t.subtitle?`<div class="icode__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(t,e){const o=oe(t.code||""),i=ve(t.code||""),s=(t.annotations||[]).map((r,h)=>`<li ${p(e.id,t.id,`annotations[${h}]`)}>${q(r)}</li>`).join("");return`${R(t,e,`slide--annotated-code slide--acode-${i}`)}
      <div class="slide__body">
        <div class="acode">
          ${t.eyebrow?`<div class="acode__eyebrow" ${p(e.id,t.id,"eyebrow")}>${d(t.eyebrow)}</div>`:""}
          ${t.heading?`<h2 class="acode__heading" ${p(e.id,t.id,"heading")}>${d(t.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${p(e.id,t.id,"code")}>${o}</code></pre>
            <ol class="acode__annotations" ${ne(e.id,t.id,"annotations")}>${s}</ol>
          </div>
          ${t.subtitle?`<div class="acode__subtitle" ${p(e.id,t.id,"subtitle")}>${d(t.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(t,e){const o=(t.items||[]).map((i,s)=>`<li ${p(e.id,t.id,`items[${s}]`)}>${q(i)}</li>`).join("");return`${R(t,e,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${p(e.id,t.id,"heading")}>${d(t.heading||"")}</h2>
          <ol class="live__list" ${ne(e.id,t.id,"items")}>${o}</ol>
        </div>
      </div>
    </div>`}},nt={id:"01",number:"01",tag:"WHAT ENGINES DO",total:"12"},at=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"What Engines Do"},{id:"welcome",type:"title",eyebrow:"Game Engines & Scripting  ·  SS26",title:"Welcome.",subtitle:"Let's make games."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your project</b> — laptop, Unity, your repo. Every session.","<b>Short input, long workshop</b> — 20 min teaching, 70 min building.","<b>Vertical slice</b> by Unit 6. ","<b>Final build</b> — Windows, two scenes, GUI, audio, docs.","<b>Ask early.</b>"]},{id:"what-is-engine",type:"question",eyebrow:"Question for the room",question:"What is a game engine"},{id:"engine-illustration",type:"image",src:"/img/engine-diagram.svg",alt:"Cutaway illustration of a game engine: a small game scene at the top, with the layers of engine subsystems beneath it.",caption:"A game engine, cut away.",fit:"contain"},{id:"what-engines-do",type:"split",heading:"What an engine actually does for you",left:{title:"Runtime",items:["The <b>game loop</b> — input, update, render, repeat","Rendering — meshes, shaders, lighting, cameras","Physics — rigidbodies, colliders, raycasts","Audio — mixing, spatialization, streaming","Input — keyboard, mouse, gamepad, touch"]},right:{title:"Tooling",items:["Editor — scenes, hierarchy, inspector","Asset pipeline — import, compress, package","Build system — Windows, Mac, Web, Mobile","Animation, particles, UI, terrain","An ecosystem — packages, tutorials, jobs"]}},{id:"why-unity",type:"split",heading:"Why Unity for this course",left:{title:"The pitch",items:["Mature C# scripting — a real, modern language","Huge community + asset store + jobs market","2D & 3D in one tool","Free for students; ships to almost any platform","What most studios you'll intern at actually use"]},right:{title:"The landscape",items:["<b>Unreal</b> — bigger guns, steeper hill, C++ / Blueprints","<b>Godot</b> — open source, lighter, GDScript","<b>Roll your own</b> — no engine, just code & a window. We'll do this in <i>Game Programmierung</i>."]}},{id:"live-unity-tour",type:"live",heading:"Unity tour",items:["Unity Hub → install LTS → new 3D (URP) project","Editor anatomy — Hierarchy, Scene, Game, Inspector, Project, Console","Drop a Plane, a few Cubes, a Directional Light. Save the scene.","Add a <b>First-Person Controller</b> from the Starter Assets package","Hit Play — walk around. Mouse-look, jump, gravity.","Open the controller script. Read it together. <b>Don't panic.</b>","Change one number. Hit Play. See it change. That's the loop."]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Think about the game you want to build. 2 Scenes. Simple Interactions.",items:["3 Minute Pitch: Simple. Simple. Simple.","Think: Walking Simulator.","Reference a vibe, look, game.","Scope check: small, finishable beats ambitious-and-abandoned","Install Unity LTS + create a GitHub account if you don&#39;t have one",""]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],st={meta:nt,slides:at},rt={id:"02",number:"02",tag:"PITCH & BLOCKOUT",total:"12"},dt=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"Pitch & Blockout"},{id:"today",type:"bullets",heading:"Today.",lead:"Two things. ",items:["<b>30 min — Pitches.</b> 3 minutes each.","<b>60 min — Blockout.</b> Greybox your Scene 1 in Unity. Leave with something playable."]},{id:"pitch-rules",type:"bullets",heading:"The Pitch",lead:"3 minutes.",items:["<b>What is it?</b> One sentence. Genre, perspective, core mechanic.","<b>What does it feel like?</b> Reference a vibe, a game, a film, a place.","<b>Two scenes.</b> What are they? How do they differ in mood?","<b>Scope check.</b> Can you finish this in 10 weeks?"]},{id:"pitch-warning",type:"prose",eyebrow:"The rule",body:"Small and finished beats ambitious and abandoned.<br><br>Think <b>walking simulator</b>, not open world.<br><br>If your pitch takes more than one sentence to explain, it's too big."},{id:"pitches",type:"question",eyebrow:"Let's go",question:"Pitches"},{id:"blockout-what",type:"bullets",heading:"What is a blockout?",lead:"The ugliest version of your game that still communicates the idea.",items:["<b>Greybox geometry</b> — cubes, planes, cylinders. No textures, no materials.","<b>Scale matters</b> — walk through it. Does the space feel right?","<b>Camera matters</b> — first-person? Third-person? Top-down? Set it now.","<b>One interaction</b> — a door that opens, a light that toggles, a trigger zone. Prove the loop works.","The rest is commentary."]},{id:"blockout-live",type:"live",heading:"Blockout demo",items:["New scene. Save it as <b>Scene_01</b>.","Plane for the ground. Scale it up. That's your floor.","Cubes for walls, doorways, cover, landmarks. <b>Hold V</b> to vertex-snap.","First-Person Controller from Starter Assets — drop it in, hit Play, walk around.","Does the space feel too big? Too small? Fix it <b>now</b>, while it's cheap.","Add one trigger zone: <b>Box Collider (Is Trigger)</b> + a script that prints to Console.","Save. This is your starting point for the next 10 weeks."]},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Build your Scene 1"},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Scene 1 checkpoint — you should have all of these.",items:["A Unity project with a saved Scene_01","Ground plane + at least 5 greybox objects defining the space","A character controller you can walk around with","The space <b>feels right</b> — not too big, not too small","One interaction (trigger, door, light — anything)"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Git. GitHub. Push.",items:["<b>Create a GitHub repo</b> for your project. Add a proper <b>.gitignore for Unity</b>.","<b>Push your project.</b> Post the repo link.","<b>Extend the blockout.</b> Add Scene 2 — different mood, same project. Even if it's just a different lighting color on cubes.","Next week we set up your dev environment properly and talk about project structure."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],lt={meta:rt,slides:dt},ct={id:"03",number:"03",tag:"SCRIPTING & INTERACTIVITY",total:"21"},pt=[{id:"section",type:"section",number:"03",kicker:"Unit",title:"Scripting & Interactivity"},{id:"today",type:"bullets",heading:"Today.",lead:"Two halves.",items:["<b>Part 1 — Git.</b> Mental models + live setup in GitHub Desktop.","<b>Part 2 — Scripting.</b> Input, triggers, Unity Events. Make something happen in your scene.","Leave with <b>one scripted interaction</b> in your blockout."]},{id:"showcase",type:"question",eyebrow:"Homework",question:"Show us your repos"},{id:"git-repo",type:"prose",eyebrow:"Mental model 01",heading:"A repo is a folder that remembers",body:"A git repo is a project folder with a <b>timeline</b>. Every time you commit, the state of the folder is frozen — forever.<br><br>You can walk that timeline. Jump to any snapshot. See exactly what the project looked like three weeks ago on a Tuesday at 2 PM.<br><br>Unlike Dropbox: nothing overwrites. Every snapshot is named, dated, and signed."},{id:"git-commit",type:"prose",eyebrow:"Mental model 02",heading:"A commit is a labeled save state",body:'Every commit has a <b>message</b>. That message is a note to your future self: <i>what were you doing, and why?</i><br><br>A bare <b>"update"</b> is not a message. <b>"fix door not opening on trigger"</b> is.<br><br>Small and frequent beats rare and huge. Commit every time you reach a working state — not at the end of the day with 600 changed files.'},{id:"git-remote",type:"prose",eyebrow:"Mental model 03",heading:"GitHub is a mirror",body:"Your local repo is the real one. GitHub is a copy that syncs on command.<br><br><b>Push</b> — send my new commits up.<br><b>Pull</b> — grab their new commits down.<br><br>Working alone: GitHub is your backup, your portfolio, and the place your code survives a laptop dying. Push often."},{id:"git-ignore",type:"bullets",heading:".gitignore for Unity",lead:"Some files do not belong in the timeline.",items:["<b>Library/</b> — regenerated from your assets. Gigabytes. Never commit.","<b>Temp/, Logs/, obj/, Build/, Builds/</b> — build artifacts. Throwaway.","<b>UserSettings/, .vs/, .idea/</b> — your local editor state. Nobody else's problem.","<b>*.csproj, *.sln</b> — generated by Unity. Ignore them.","<b>.meta files</b> — <i>always</i> commit them. They link your assets to references. Ignore them and your project breaks on another machine."]},{id:"git-live",type:"live",heading:"Live: GitHub Desktop setup",items:["Install <b>GitHub Desktop</b>. Sign in with your GitHub account.","<b>File → Add Local Repository</b> → point at your Unity project folder. If not yet a repo, it will offer to initialize one.","Drop a Unity <b>.gitignore</b> in the project root — copy from <b>github.com/github/gitignore</b> (Unity.gitignore).",'First commit: message <b>"initial commit — blockout scene"</b>. Commit to main. Push to origin.',"<b>Publish repository</b> — private or public. Post the URL in the chat.","Make a small change in Unity. Save. Watch GitHub Desktop see the diff. Commit with a real message. Push.","That is the whole loop: <b>change → commit → push</b>. Repeat forever."]},{id:"section-scripting",type:"section",number:"03",kicker:"Part 2",title:"Scripting"},{id:"script-what",type:"prose",eyebrow:"Concept 01",heading:"A script is a Component",body:"Everything in a scene is a <b>GameObject</b>. Every GameObject is a bag of <b>Components</b> — Transform, Renderer, Collider, AudioSource.<br><br>A script you write becomes a Component. Drop it on any GameObject; now that object has your behavior.<br><br>Same script on three cubes = three independent instances. Same code, different state."},{id:"script-lifecycle",type:"code",eyebrow:"Concept 02",heading:"Start runs once. Update runs every frame.",code:`using UnityEngine;

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
}`,caption:"Box Collider with <b>Is Trigger</b> enabled — objects pass through instead of bouncing, and your script gets called. The other object needs a Rigidbody (or a CharacterController).",language:"csharp"},{id:"live-trigger",type:"live",heading:"Live: a door that opens",items:["Scale a cube into a wall with a door-shaped hole. Place a real door cube in the hole.","Empty GameObject with a Box Collider sized to the doorway. Check <b>Is Trigger</b>.","Attach <b>DoorTrigger</b>. Drag the door cube into the <b>door</b> field in the Inspector.","Tag your player as <b>Player</b>. Play. Walk toward the door. Watch it vanish.","Smells like a teleporter. Later: animate the door, add a sound, add a particle puff. This is the hook."]},{id:"unity-events",type:"prose",eyebrow:"Concept 05",heading:"Unity Events — wiring without code",body:"A <b>UnityEvent</b> is a hook you expose in the Inspector. Other objects subscribe <i>visually</i>, by dragging — and when the event fires, every subscriber runs.<br><br>One trigger can open a door, play a sound, shake the camera, and log a message — <b>without knowing</b> any of those things exist. You wire them together in the Inspector.<br><br>This is how Unity's UI Buttons work. Same pattern for your own triggers. Decoupled, messy-in-a-good-way, Inspector-first."},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Add one scripted interaction"},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Unit 3 checkpoint.",items:["Unity project on GitHub with a proper <b>.gitignore</b>","You can commit + push from GitHub Desktop without panicking","At least <b>one scripted interaction</b> in your scene — trigger, mover, toggle, anything","You know where the Inspector surfaces your public fields"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Two scripted interactions. Commit often.",items:["<b>Two interactions</b> in your scene. Different kinds — one trigger, one input, or one of each.",'Commit as you go. At least <b>five commits</b>. Real messages, not "update".',"Next week: <b>Game Objects, Prefabs, Physics.</b> Start thinking about what in your game needs to collide."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],ht={meta:ct,slides:pt},ut={id:"04",number:"04",tag:"WIRING",total:"24"},gt=[{id:"section",type:"section",number:"04",kicker:"Unit",title:"Wiring"},{id:"today",type:"bullets",heading:"Today.",lead:"All hands on keyboard.",items:["Five minutes — what's installed, how chains read.","Twelve ideas — pick the ones that fit your game.","<b>Eighty minutes of building.</b> We circulate, you build, we share at the end."]},{id:"homework-check",type:"question",eyebrow:"Last week",question:"Show us your two interactions"},{id:"kit-recap",type:"prose",eyebrow:"What's installed",heading:"BlockoutKit, briefly",body:"You should have <b>BlockoutKit</b> in your <code>Assets/</code>. If not, drop the folder in now.<br><br>Twenty components. Three kinds. <b>Emitters</b> notice things and fire events. <b>Responders</b> do something when called. <b>Helpers</b> sit between the two and gate, route, or delay.<br><br>Open the README if you want the long version. We'll spend the rest of the lecture <i>using</i> it."},{id:"components",type:"bullets",heading:"20 components",lead:"Everything in the kit. The Add Component menu groups them under <b>BlockoutKit/</b>.",items:["<b>Emitters —</b> OnTriggerZone, OnKeyPress, OnInteract, OnCollision, OnDelay, OnTimer, OnProximity","<b>Responders —</b> Toggle, PlaySound, Animate, ApplyForce, SpawnPrefab, LoadScene, Wait, SetText, SetMaterial, LogToConsole","<b>Helpers —</b> Cooldown, Once, PickRandom"]},{id:"anatomy",type:"code",eyebrow:"How chains read",heading:"Anatomy of a chain",code:`OnTriggerZone
  └─ OnEnter
        ├─ Cooldown.Fire
        │     └─ OnFired
        │           ├─ Animate.Fire      // door swings open
        │           ├─ PlaySound.Fire    // door creaks
        │           └─ LogToConsole.Fire // "door fired"
        └─ (more, if you want — chains fan out)`,caption:"Top to bottom. Every <b>Fire</b> leaves an <b>OnFired</b> behind. Every <b>OnFired</b> can call more Fires. The Inspector is this picture, drawn for you.",language:"text"},{id:"relays",type:"prose",eyebrow:"Three relays",heading:"Cooldown, Once, PickRandom",body:"Three components that don't <i>act</i>, they <i>route</i>. Drop them anywhere in a chain.<br><br><b>Cooldown</b> swallows fires for N seconds after one passes through. Stops spam.<br><b>Once</b> fires the first time, ignores every call after. For one-shot reveals.<br><b>PickRandom</b> picks one of N slots at random. For variety.<br><br>Each lives as its own GameObject — that way the wiring shows up in the Hierarchy and you can read your level by reading the scene tree."},{id:"section-ideas",type:"section",number:"04",kicker:"Recipes",title:"Twelve ideas"},{id:"idea-flickering-torch",type:"prose",eyebrow:"Mood",heading:"The Flickering Torch",body:"A wall sconce that never quite stays still.<br><br><b>OnTimer</b> (interval 0.3s, jitter 0.4) → <b>PickRandom</b> with three slots → each one <b>SetMaterial</b>s the flame to a different intensity.<br><br>The jitter is the trick. Mechanical timing reads as mechanical. Random timing reads as <i>alive</i>."},{id:"idea-fireplace",type:"prose",eyebrow:"Mood",heading:"The Crackling Fireplace",body:"Pure ambience — no gameplay, no interaction. A fireplace that sounds different every time you walk past.<br><br><b>OnTimer</b> (interval 2s, jitter 1.5s) → <b>PickRandom</b> across four <b>PlaySound</b> slots, each with a different wood-crack clip.<br><br>Set <code>pitchRange</code> on each PlaySound to (0.9, 1.1) for extra variety on the same clip. Three clips becomes nine."},{id:"idea-crow",type:"prose",eyebrow:"Mood",heading:"The Crow",body:"A crow on a fence. Player gets close. It takes off.<br><br><b>OnProximity</b> (target: Player, radius 4m) → <b>Once</b> → <b>ApplyForce</b> up &amp; away on the crow's Rigidbody + <b>PlaySound</b> caw + <b>SpawnPrefab</b> a feather puff.<br><br>The <b>Once</b> matters. No spell-checking ravens here — once it flies, it's gone."},{id:"idea-stalker",type:"prose",eyebrow:"Mood",heading:"The Stalker",body:"A presence you can hear but never quite see. Footsteps that fade in when you're near.<br><br><b>OnProximity</b> OnEnter → <b>PlaySound</b> (footsteps loop). OnExit → <b>Toggle</b> the AudioSource off.<br><br>Layer a second <b>OnProximity</b> at a tighter radius wired to a heartbeat clip. Dread is just two volumes at two distances."},{id:"idea-sign",type:"prose",eyebrow:"Discovery",heading:"The Sign",body:`A weathered sign in front of a place you shouldn't go.<br><br><b>OnInteract</b> (raycast + E) → <b>SetText</b> on a TMP label: "BEYOND HERE BE TROUBLE" → <b>PlaySound</b> a low creak.<br><br>Float the text in 3D space next to the sign, not in HUD. Diegetic beats overlay every time.`},{id:"idea-easter-egg",type:"prose",eyebrow:"Discovery",heading:"The Easter Egg Room",body:'A hidden corner. A sentence appears. Once.<br><br><b>OnTriggerZone</b> (in the secret nook) → <b>Once</b> → <b>SetText</b> "you found me" + <b>PlaySound</b> a single soft chord.<br><br>The <b>Once</b> is what makes it a secret. Without it, the magic fires every time you wander past — and stops being magic.'},{id:"idea-pressure-plate",type:"prose",eyebrow:"Gameplay",heading:"The Pressure Plate",body:'Step on it, something far away changes.<br><br><b>OnTriggerZone</b> (player tag) → <b>Cooldown</b> (3s) → <b>Toggle</b> a distant light + <b>PlaySound</b> a low click + <b>LogToConsole</b> "plate fired".<br><br>The <b>Cooldown</b> stops the plate from spamming when the player jiggles around on it. Without it, your scene becomes a strobe.'},{id:"idea-trap-floor",type:"prose",eyebrow:"Gameplay",heading:"The Trap Floor",body:"Floor tile. Walk on it. One second later — drop.<br><br><b>OnTriggerZone</b> → <b>Wait</b> (1s) → <b>ApplyForce</b> down on the floor's Rigidbody + <b>PlaySound</b> a thud + <b>SpawnPrefab</b> dust.<br><br>The pause before the trap fires is the entire feeling. Without <b>Wait</b>, it's just a falling block."},{id:"idea-coin",type:"prose",eyebrow:"Gameplay",heading:"The Coin",body:"Pick it up. Different chime each time.<br><br><b>OnInteract</b> → <b>PickRandom</b> across three <b>PlaySound</b> slots (each a different chime) → <b>SpawnPrefab</b> sparkle → <b>Toggle</b> the coin off.<br><br>Three clips is enough. Players hear variety long before they hear the loop."},{id:"idea-crates",type:"prose",eyebrow:"Gameplay",heading:"The Pile of Crates",body:"Throw something into them. Watch it collapse.<br><br><b>OnCollision</b> on each crate (minImpactSpeed 4) → <b>SpawnPrefab</b> dust + <b>PlaySound</b> a wood-crack + <b>Toggle</b> the crate off.<br><br>Stack five crates, roll a Rigidbody ball at them. Free game-feel. The <code>minImpactSpeed</code> filter stops crates from breaking when you brush them."},{id:"idea-big-red-button",type:"prose",eyebrow:"Spectacle",heading:"The Big Red Button",body:'Press it. Things happen. Everything happens.<br><br><b>OnInteract</b> → <b>Once</b> → <b>PlaySound</b> a siren + <b>SetText</b> "INITIATING" + <b>Wait</b> (3s) + <b>LoadScene</b> "ending".<br><br>The <b>Once</b> is mercy. Without it, the player ruins the joke by mashing the button.'},{id:"idea-curtain",type:"prose",eyebrow:"Spectacle",heading:"The Rising Curtain",body:'A theatrical reveal. Stage curtain rises. Then text drops in.<br><br><b>OnTriggerZone</b> → <b>Once</b> → <b>Animate</b> the curtain Y over 4s + <b>PlaySound</b> rope creak. Then <b>Animate.OnFired</b> → <b>SetText</b> "ACT ONE".<br><br>Time everything to the music if you have any. Theater is just timing.'},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Build at least two"},{id:"stuck",type:"bullets",heading:"Stuck? Start with one of these.",lead:"Cheapest first.",items:["<b>The Sign</b> — OnInteract → SetText. Five minutes.","<b>The Easter Egg Room</b> — OnTriggerZone → Once → SetText. Five minutes.","<b>The Pressure Plate</b> — OnTriggerZone → Cooldown → Toggle. Ten minutes.","Then chain a sound onto whichever worked. You're past the hump."]},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Unit 4 checkpoint.",items:["<b>BlockoutKit</b> in your <code>Assets/</code> and compiling","At least <b>two new wired interactions</b> in your blockout","You can read an Inspector chain top to bottom and predict what fires",'Five real commits with real messages — no <i>"update"</i>']},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Five interactions. Real ones.",items:["<b>Five wired interactions</b> in your scene by next class. Pick from the recipes or invent your own.","Habit: every chain ends with a <b>LogToConsole</b>. When something doesn't fire, you'll know within ten seconds instead of an hour.","Next week: <b>States and conditions.</b> Where the kit runs out and you write your first stateful script."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],bt={meta:ut,slides:gt},yt={id:"05",number:"05",tag:"STATES & CONDITIONS",total:"26"},mt=[{id:"section",type:"section",number:"05",kicker:"Unit",title:"States & Conditions"},{id:"homework-check",type:"question",eyebrow:"Last week",question:"Show us your wired interactions."},{id:"section-wiring",type:"section",number:"05",kicker:"Part I",title:"How wiring works"},{id:"concept-go",type:"concept",eyebrow:"01",statement:"A GameObject is a list of Components.",diagram:'<div class="dg"><div class="dg-card"><div class="dg-card__title">Door</div><div class="dg-card__rows"><div class="dg-card__row">Transform</div><div class="dg-card__row">MeshFilter</div><div class="dg-card__row">MeshRenderer</div><div class="dg-card__row">BoxCollider</div></div></div></div>',caption:"Every GameObject has a Transform. The rest is up to you."},{id:"concept-script",type:"concept",eyebrow:"02",statement:"A script is a Component too.",diagram:'<div class="dg"><div class="dg-card"><div class="dg-card__title">Door</div><div class="dg-card__rows"><div class="dg-card__row">Transform</div><div class="dg-card__row">MeshFilter</div><div class="dg-card__row">MeshRenderer</div><div class="dg-card__row">BoxCollider</div><div class="dg-card__row dg-card__row--accent"><span>Toggle</span><span class="dg-card__row__note">your script</span></div></div></div></div>',caption:"Drop a <code>.cs</code> on a GameObject and it becomes the next row."},{id:"concept-instances",type:"concept",eyebrow:"03",statement:"Inspector slots want instances.",diagram:'<div class="dg"><div class="dg-cols-2"><div class="dg-col dg-center"><div class="dg-label">Hierarchy</div><div class="dg-panel"><div class="dg-panel__row dg-panel__row--header">▼ Sample Scene</div><div class="dg-panel__row">▶ Player</div><div class="dg-panel__row">▼ Door</div><div class="dg-panel__row" style="padding-left: 56px;">Transform</div><div class="dg-panel__row" style="padding-left: 56px;">BoxCollider</div><div class="dg-panel__row dg-panel__row--selected" style="padding-left: 56px;">Toggle</div></div></div><div class="dg-col dg-center dg-fade"><div class="dg-label">Project</div><div class="dg-panel dg-strike"><div class="dg-panel__row dg-panel__row--header">▼ Assets/</div><div class="dg-panel__row">▼ Scripts</div><div class="dg-panel__row" style="padding-left: 56px;">Toggle.cs</div><div class="dg-panel__row" style="padding-left: 56px;">Spinner.cs</div><div class="dg-panel__row" style="padding-left: 56px;">Mover.cs</div></div></div></div></div>',caption:"The Project shows recipes. The Hierarchy shows things that exist."},{id:"concept-fire",type:"concept",eyebrow:"04",statement:"The chain continues through <code>Fire()</code>.",diagram:'<div class="dg"><div class="dg-panel"><div class="dg-panel__row dg-panel__row--header">No Function</div><div class="dg-panel__sep"></div><div class="dg-panel__row"><span>GameObject</span><span class="dg-panel__row__r">SetActive (bool)</span></div><div class="dg-panel__row"><span>Transform</span><span class="dg-panel__row__r">Translate (Vector3)</span></div><div class="dg-panel__row"><span>BoxCollider</span><span class="dg-panel__row__r">enabled = bool</span></div><div class="dg-panel__row"><span>MeshRenderer</span><span class="dg-panel__row__r">enabled = bool</span></div><div class="dg-panel__sep"></div><div class="dg-panel__row dg-panel__row--selected"><span>Toggle</span><span class="dg-panel__row__r">Fire ()</span></div><div class="dg-panel__row dg-fade"><span>Toggle</span><span class="dg-panel__row__r">OnFired (UnityEvent)</span></div></div></div>',caption:"Other choices work. Only <code>Fire()</code> exposes <code>OnFired</code> for the next link."},{id:"concept-completes",type:"concept",eyebrow:"05",statement:"<code>OnFired</code> fires when <code>Fire()</code> completes.",diagram:'<div class="dg dg-col" style="gap: var(--s-5); font-size: var(--fs-md);"><div class="dg-col" style="gap: var(--s-2);"><div class="dg-label">Synchronous — OnFired same frame</div><div class="dg-flow"><span>Toggle.Fire</span><span class="dg-flow__arrow">──→</span><span class="dg-accent">OnFired</span></div><div class="dg-flow"><span>PlaySound.Fire</span><span class="dg-flow__arrow">──→</span><span class="dg-accent">OnFired</span></div></div><div class="dg-col" style="gap: var(--s-2);"><div class="dg-label">Time-based — OnFired after duration</div><div class="dg-flow"><span>Wait(1s).Fire</span><span class="dg-flow__arrow">──→</span><span class="dg-flow__gap">⋯ 1s ⋯</span><span class="dg-flow__arrow">──→</span><span class="dg-accent">OnFired</span></div><div class="dg-flow"><span>Animate(4s).Fire</span><span class="dg-flow__arrow">──→</span><span class="dg-flow__gap">⋯ 4s ⋯</span><span class="dg-flow__arrow">──→</span><span class="dg-accent">OnFired</span></div></div></div>',caption:"Gates (Cooldown, IfFlag) only complete when the call passes through."},{id:"concept-chain",type:"concept",eyebrow:"06",statement:"Read chains top to bottom.",diagram:'<div class="dg dg-tree"><div class="dg-tree__node">OnTriggerZone.OnEnter</div><div class="dg-tree__branch"><div class="dg-tree__node">→ Cooldown.Fire</div><div class="dg-tree__branch dg-tree__branch--accent"><div class="dg-tree__node">↳ <span class="dg-accent">OnFired</span> <span class="dg-tree__node__note">passed through</span></div><div class="dg-tree__branch"><div class="dg-tree__node">→ Animate.Fire</div><div class="dg-tree__branch dg-tree__branch--accent"><div class="dg-tree__node">↳ <span class="dg-accent">OnFired</span> <span class="dg-tree__node__note">4s later</span></div><div class="dg-tree__branch"><div class="dg-tree__node">→ SetText.Fire</div></div></div><div class="dg-tree__node">→ PlaySound.Fire</div></div></div></div></div>',caption:"Every <code>OnFired</code> is another slot. Chains fan out."},{id:"concept-tracing",type:"concept",eyebrow:"07",statement:"The first missing log marks the break.",diagram:'<div class="dg dg-row" style="gap: var(--s-6); align-items: flex-start;"><div class="dg-tree" style="flex: 1;"><div class="dg-tree__node">OnTriggerZone.OnEnter</div><div class="dg-tree__branch"><div class="dg-tree__node">→ LogToConsole "A"</div><div class="dg-tree__node">→ Cooldown.Fire</div><div class="dg-tree__branch"><div class="dg-tree__node">↳ OnFired</div><div class="dg-tree__branch"><div class="dg-tree__node">→ LogToConsole "B"</div><div class="dg-tree__node">→ Toggle.Fire</div><div class="dg-tree__branch"><div class="dg-tree__node">↳ OnFired</div><div class="dg-tree__branch"><div class="dg-tree__node">→ LogToConsole "C"</div></div></div></div></div></div></div><div class="dg-console"><div class="dg-console__line dg-console__line--ok">&gt; A</div><div class="dg-console__line dg-console__line--miss">&gt; B   ✗ missing</div><div class="dg-console__line dg-console__line--ghost">&gt; C   never reached</div></div></div>',caption:"Wire <code>LogToConsole</code> at every junction. Read top to bottom. First gap is the answer."},{id:"section-state",type:"section",number:"05",kicker:"Part II",title:"States & conditions"},{id:"concept-forgets",type:"concept",eyebrow:"08",statement:"The kit forgets.",diagram:'<div class="dg dg-col" style="gap: var(--s-4); align-items: center;"><div class="dg-row" style="gap: var(--s-5); font-family: var(--font-mono); font-size: var(--fs-md);"><span class="dg-accent">● Fire</span><span class="dg-fade">─────</span><span class="dg-accent">● Fire</span><span class="dg-fade">─────</span><span class="dg-accent">● Fire</span></div><div class="dg-label">no thread between them</div></div>',caption:"No Component carries memory across event-fires."},{id:"concept-memory",type:"concept",eyebrow:"09",statement:"Memory is a Component.",diagram:'<div class="dg"><div class="dg-card"><div class="dg-card__title">hasKey</div><div class="dg-card__rows"><div class="dg-card__row">Transform</div><div class="dg-card__row dg-card__row--accent"><span>Flag</span><span class="dg-card__row__note">value: false</span></div></div></div></div>',caption:"Lives on a GameObject. The Hierarchy is your variable list."},{id:"concept-flag",type:"concept",eyebrow:"10",statement:"A <code>Flag</code> is a switch. Transitions fire <code>OnTrue</code> or <code>OnFalse</code>.",diagram:`<div class="dg" style="width: 100%;"><svg viewBox="0 0 1500 720" style="width: 100%; height: 100%; display: block;" preserveAspectRatio="xMidYMid meet"><ellipse cx="310" cy="230" rx="190" ry="110" style="fill: var(--surface); stroke: var(--ink); stroke-width: 3;"/><text x="310" y="250" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 80px; fill: var(--ink);">false</text><ellipse cx="1190" cy="230" rx="190" ry="110" style="fill: var(--surface); stroke: var(--accent); stroke-width: 3;"/><text x="1190" y="250" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 80px; fill: var(--accent);">true</text><path d="M 500 175 Q 750 50 1000 175" style="stroke: var(--accent); stroke-width: 3; fill: none;" marker-end="url(#arrAcc)"/><text x="750" y="80" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 36px; fill: var(--accent);">SetTrue()</text><path d="M 1000 285 Q 750 410 500 285" style="stroke: var(--ink-dim); stroke-width: 3; fill: none;" marker-end="url(#arrInk)"/><text x="750" y="430" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 36px; fill: var(--ink-dim);">SetFalse()</text><line x1="1190" y1="345" x2="1190" y2="560" style="stroke: var(--accent); stroke-width: 3; stroke-dasharray: 10 8; fill: none;" marker-end="url(#arrAcc)"/><text x="1190" y="625" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 40px; fill: var(--accent);">OnTrue ()</text><line x1="310" y1="345" x2="310" y2="560" style="stroke: var(--ink-dim); stroke-width: 3; stroke-dasharray: 10 8; fill: none;" marker-end="url(#arrInk)"/><text x="310" y="625" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 40px; fill: var(--ink-dim);">OnFalse ()</text><defs><marker id="arrAcc" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--accent);"/></marker><marker id="arrInk" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--ink-dim);"/></marker></defs></svg></div>`,caption:"Real transitions only. Writing <code>SetTrue</code> while already true is silent."},{id:"concept-ifflag",type:"concept",eyebrow:"11",statement:"<code>IfFlag</code> is a fork. The Flag picks the branch.",diagram:`<div class="dg" style="width: 100%;"><svg viewBox="0 0 1500 560" style="width: 100%; height: 100%; display: block;" preserveAspectRatio="xMidYMid meet"><rect x="610" y="230" width="320" height="110" rx="10" style="fill: var(--surface); stroke: var(--accent); stroke-width: 3;"/><text x="770" y="300" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 54px; fill: var(--accent);">IfFlag</text><line x1="160" y1="285" x2="595" y2="285" style="stroke: var(--ink-dim); stroke-width: 4; fill: none;" marker-end="url(#arrInk)"/><text x="370" y="258" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 40px; fill: var(--ink);">Fire</text><path d="M 930 260 L 1330 110" style="stroke: var(--accent); stroke-width: 4; fill: none;" marker-end="url(#arrAcc)"/><text x="1370" y="110" style="font-family: 'IBM Plex Mono'; font-size: 40px; fill: var(--accent);">OnTrue</text><path d="M 930 310 L 1330 460" style="stroke: var(--ink-dim); stroke-width: 4; fill: none;" marker-end="url(#arrInk)"/><text x="1370" y="470" style="font-family: 'IBM Plex Mono'; font-size: 40px; fill: var(--ink-dim);">OnFalse</text><line x1="770" y1="225" x2="770" y2="80" style="stroke: var(--muted); stroke-width: 2; stroke-dasharray: 6 6; fill: none;"/><text x="800" y="60" style="font-family: 'IBM Plex Mono'; font-size: 32px; fill: var(--muted);">reads → Flag "hasKey"</text><defs><marker id="arrInk" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--ink-dim);"/></marker><marker id="arrAcc" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--accent);"/></marker></defs></svg></div>`,caption:"A conditional, drawn as wiring."},{id:"concept-shared-state",type:"concept",eyebrow:"12",statement:"One writes. One reads. The Flag is what they share.",diagram:`<div class="dg" style="width: 100%;"><svg viewBox="0 0 1500 560" style="width: 100%; height: 100%; display: block;" preserveAspectRatio="xMidYMid meet"><rect x="80" y="260" width="340" height="180" rx="10" style="fill: var(--surface); stroke: var(--ink); stroke-width: 3;"/><text x="250" y="330" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 60px; fill: var(--ink);">KEY</text><text x="250" y="385" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 30px; fill: var(--muted);">OnInteract</text><rect x="1080" y="260" width="340" height="180" rx="10" style="fill: var(--surface); stroke: var(--ink); stroke-width: 3;"/><text x="1250" y="330" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 60px; fill: var(--ink);">DOOR</text><text x="1250" y="385" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 30px; fill: var(--muted);">OnTriggerZone</text><rect x="600" y="40" width="300" height="140" rx="70" style="fill: var(--surface); stroke: var(--accent); stroke-width: 3;"/><text x="750" y="100" text-anchor="middle" style="font-family: 'Space Grotesk'; font-weight: 700; font-size: 48px; fill: var(--accent);">Flag</text><text x="750" y="150" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 32px; fill: var(--muted);">"hasKey"</text><path d="M 420 260 Q 480 140 600 120" style="stroke: var(--accent); stroke-width: 4; fill: none;" marker-end="url(#arrAcc)"/><text x="440" y="200" style="font-family: 'IBM Plex Mono'; font-size: 34px; fill: var(--accent);">SetTrue</text><path d="M 1080 260 Q 1020 140 900 120" style="stroke: var(--ink-dim); stroke-width: 4; stroke-dasharray: 8 6; fill: none;" marker-end="url(#arrInk)"/><text x="1000" y="200" style="font-family: 'IBM Plex Mono'; font-size: 34px; fill: var(--ink-dim);">reads</text><text x="750" y="515" text-anchor="middle" style="font-family: 'IBM Plex Mono'; font-size: 32px; fill: var(--muted);">KEY and DOOR don't know each other.</text><defs><marker id="arrInk" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--ink-dim);"/></marker><marker id="arrAcc" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 14 7 L 0 14 Z" style="fill: var(--accent);"/></marker></defs></svg></div>`,caption:"Decoupled by shared state."},{id:"escalate-counter",type:"code",eyebrow:"13",heading:"Need more than one bit? Write your own.",code:`using UnityEngine;
using UnityEngine.Events;

// Counts incoming Fires. When the target is reached, OnReached fires once.
// Wire any emitter.OnFired -> Counter.Fire.
public class Counter : MonoBehaviour
{
    [SerializeField] private int target = 3;
    [SerializeField] private UnityEvent OnReached = new UnityEvent();

    private int count;

    public void Fire()
    {
        count++;
        if (count == target) OnReached.Invoke();
    }
}`,caption:"Same contract — <code>Fire()</code> + a <code>UnityEvent</code>. Slots into everything you've already wired.",language:"csharp"},{id:"section-workshop",type:"section",number:"05",kicker:"Build",title:"Workshop"},{id:"recipe-locked-door",type:"prose",eyebrow:"Recipe 1",heading:"The Locked Door.",body:'<b>Flag</b> <code>hasKey</code>, starts <code>false</code>.<br><br>Key — <code>OnInteract → OnFired → Toggle</code> (hide key) + <code>Flag.SetTrue</code>.<br>Door — <code>OnTriggerZone → OnEnter → IfFlag</code>. <code>OnTrue</code> opens the door + chime. <code>OnFalse</code> sets a sign to "locked" + thud.'},{id:"recipe-day-night",type:"prose",eyebrow:"Recipe 2",heading:"The Day / Night Lever.",body:"<b>Flag</b> <code>isNight</code>. Lever — <code>OnInteract → Flag.Fire</code> (toggles).<br><br>On the Flag itself — <code>OnTrue</code> enables the moon, disables the sun, plays wind. <code>OnFalse</code> opposite.<br><br>No <b>IfFlag</b>. The Flag's transition events do all the work."},{id:"recipe-tutorial-sign",type:"prose",eyebrow:"Recipe 3",heading:"The Tutorial Sign.",body:"First time only: <code>OnProximity → Once → SetText</code> hint + chime + <code>Flag.SetTrue</code> <code>sawTutorial</code>.<br><br>Elsewhere — anywhere — <code>IfFlag</code> on <code>sawTutorial</code> gates what shows.<br><br>Write-once. Read everywhere."},{id:"workshop-prompt",type:"question",eyebrow:"Your turn",question:"Build one. Two if there's time."},{id:"checkin",type:"question",eyebrow:"Mid-workshop",question:"Where are you on the slice?"},{id:"next-menu",type:"bullets",heading:"Next: pick a juice topic.",lead:"After the slice, four mini-lectures. Vote.",items:["<b>Animation.</b> Animator state machines, blend trees.","<b>Lighting.</b> Sources, baked GI, post-processing.","<b>Cinemachine.</b> Virtual cameras, dolly tracks.","<b>Timeline.</b> Track sequencer, choreographed cuts."]},{id:"vertical-slice",type:"bullets",heading:"Vertical slice. Next class.",lead:"Greybox + the core that makes your game your game. Playable, not pretty.",items:["Scene 1 blocked out.","Core loop wired.","One stateful mechanic — <b>Flag</b> + <b>IfFlag</b>, or your own script.","Pushed to GitHub. We play each other's slices in Unit 6."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions."}],ft={meta:yt,slides:mt},vt=[st,lt,ht,bt,ft],wt=vt.map(t=>tt(t.meta,t.slides)).join(`
`),we=document.createElement("deck-root");we.innerHTML=wt;document.body.appendChild(we);
