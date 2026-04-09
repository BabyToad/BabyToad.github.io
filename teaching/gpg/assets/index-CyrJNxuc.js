(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();function M(e){const t=e.getContext("2d");e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,t.scale(devicePixelRatio,devicePixelRatio);const s=e.clientWidth,i=e.clientHeight;let n=s/2-20,o=i/2-20;const r=5,p={},m=y=>{"wasd".includes(y.key.toLowerCase())&&(p[y.key.toLowerCase()]=y.type==="keydown",y.preventDefault())};window.addEventListener("keydown",m),window.addEventListener("keyup",m);let w;function g(){p.a&&(n-=r),p.d&&(n+=r),p.w&&(o-=r),p.s&&(o+=r),n=Math.max(0,Math.min(n,s-40)),o=Math.max(0,Math.min(o,i-40)),t.fillStyle="#0b0d10",t.fillRect(0,0,s,i),t.fillStyle="#ff6b35",t.fillRect(n,o,40,40),w=requestAnimationFrame(g)}return g(),()=>{cancelAnimationFrame(w),window.removeEventListener("keydown",m),window.removeEventListener("keyup",m)}}const K={"moving-square":M};let C=null;function U(e){if(C&&(C(),C=null),!e)return;const t=e.querySelector(".demo__canvas"),s=e.getAttribute("data-demo");if(!t||!s)return;const i=K[s];if(!i){console.warn(`[demo] unknown demo: ${s}`);return}C=i(t)||null}let I=null;function z(e){if(I&&(I(),I=null),!(e!=null&&e.hasAttribute("data-interactive-code")))return;const t=e.querySelector(".icode");if(!t)return;const s=[...e.querySelectorAll(".icode__line[data-region]")],i=[...e.querySelectorAll(".icode__ann[data-region]")],n=[...e.querySelectorAll(".icode-tip")],o=[...new Set(s.map(l=>l.dataset.region).filter(Boolean))],r=new Set;let p=null,m=null,w=!1,g=null;function y(){const l=p!==null;t.classList.toggle("icode--has-active",l),t.classList.toggle("icode--has-revealed",r.size>0);for(const c of s){const u=c.dataset.region;u&&(c.classList.toggle("icode__line--active",u===p),c.classList.toggle("icode__line--revealed",r.has(u)))}for(const c of i){const u=c.dataset.region;c.classList.toggle("icode__ann--active",u===p),c.classList.toggle("icode__ann--revealed",r.has(u))}}function k(){w||r.size>=o.length&&(w=!0,t.classList.add("icode--complete"),setTimeout(()=>t.classList.remove("icode--complete"),900))}y();function b(l){var c,u;if(!((c=l.target)!=null&&c.isContentEditable||/input|textarea/i.test((u=l.target)==null?void 0:u.tagName))){if(l.key>="1"&&l.key<="9"){const f=parseInt(l.key)-1;if(f>=o.length)return;l.preventDefault();const h=o[f];p===h?(p=null,m=null):(r.add(h),p=h,m=h,k()),y();return}if(l.key==="0"||l.key==="Escape"){(p||m)&&(l.preventDefault(),p=null,m=null,y());return}}}addEventListener("keydown",b);const $=[];for(const l of s){const c=l.dataset.region;if(!c)continue;const u=()=>{!m&&r.has(c)&&(p=c,y())},f=()=>{m||(p=null,y())};l.addEventListener("mouseenter",u),l.addEventListener("mouseleave",f),$.push({el:l,events:{mouseenter:u,mouseleave:f}})}for(const l of i){const c=l.dataset.region,u=()=>{!m&&r.has(c)&&(p=c,y())},f=()=>{m||(p=null,y())},h=()=>{m===c?(m=null,p=null):(r.add(c),m=c,p=c,k()),y()};l.addEventListener("mouseenter",u),l.addEventListener("mouseleave",f),l.addEventListener("click",h),$.push({el:l,events:{mouseenter:u,mouseleave:f,click:h}})}function A(l){E();const c=l.dataset.tipSig||"",u=l.dataset.tipDesc||"",f=l.dataset.tipUrl||"";if(!c&&!u)return;const h=document.createElement("div");h.className="icode-tooltip",h.innerHTML=[c?`<code class="icode-tooltip__sig">${H(c)}</code>`:"",u?`<div class="icode-tooltip__desc">${H(u)}</div>`:"",f?`<a class="icode-tooltip__link" href="${H(f)}" target="_blank" rel="noopener">→ pygame docs</a>`:""].filter(Boolean).join(""),t.appendChild(h),t.style.position="relative";let T=0,L=0,S=l;for(;S&&S!==t;)T+=S.offsetTop,L+=S.offsetLeft,S=S.offsetParent;h.style.left=Math.max(0,L)+"px",h.style.visibility="hidden";const N=h.offsetHeight,j=h.offsetWidth;T-N-10<0?(h.style.top=T+l.offsetHeight+8+"px",h.classList.add("icode-tooltip--below")):h.style.top=T-N-8+"px";const W=t.offsetWidth-j-8;parseInt(h.style.left)>W&&(h.style.left=Math.max(0,W)+"px"),h.style.visibility="",g=h}function E(){g&&(g.remove(),g=null)}for(const l of n){const c=()=>A(l),u=()=>E();l.addEventListener("mouseenter",c),l.addEventListener("mouseleave",u),$.push({el:l,events:{mouseenter:c,mouseleave:u}})}I=()=>{removeEventListener("keydown",b);for(const l of $)for(const[c,u]of Object.entries(l.events))l.el.removeEventListener(c,u);E(),p=null,m=null,t.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const l of s)l.classList.remove("icode__line--active","icode__line--revealed");for(const l of i)l.classList.remove("icode__ann--active","icode__ann--revealed")}}function H(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const G=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",G);class B extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const t=document.createElement("div");for(t.className="deck__stage";this.firstChild;)t.appendChild(this.firstChild);this.appendChild(t),this._stage=t,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",s=>this._onKey(s)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const s=new URLSearchParams(location.search).get("unit");let i=Array.from(this._stage.querySelectorAll(".slide"));s&&(i=i.filter(n=>n.getAttribute("data-unit")===s),this._stage.querySelectorAll(".slide").forEach(n=>{i.includes(n)||n.remove()})),this._slides=i}_buildFooter(){const t=document.createElement("div");t.className="deck__footer",t.innerHTML=`
      <div class="deck__footer__tag"></div>
      <div class="deck__footer__progress"><div class="deck__footer__progress__bar"></div></div>
      <div class="deck__footer__num"></div>
    `,document.body.appendChild(t),this._footer=t,this._fTag=t.querySelector(".deck__footer__tag"),this._fNum=t.querySelector(".deck__footer__num"),this._progress=t.querySelector(".deck__footer__progress__bar")}_buildHelp(){const t=document.createElement("div");t.className="deck__help",t.innerHTML=`
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
    `,document.body.appendChild(t),this._help=t}_readHashIndex(){var i;const t=location.hash.match(/^#(\d+)/);if(!t)return 0;const s=parseInt(t[1],10)-1;return Math.max(0,Math.min(s,(((i=this._slides)==null?void 0:i.length)||1)-1))}_show(t){if(!this._slides.length||t<0||t>=this._slides.length)return;this._index=t;const s=this._slides.length;this._slides.forEach((w,g)=>{g===t?w.setAttribute("data-active",""):w.removeAttribute("data-active")});const i=this._slides[t],n=i.getAttribute("data-unit")||"",o=i.getAttribute("data-tag")||"",r=i.getAttribute("data-total")||"12",p=[];n&&p.push(`UNIT ${n} / ${r}`),o&&p.push(o);const m=p.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=m),this._fNum&&(this._fNum.textContent=`${String(t+1).padStart(2,"0")} / ${String(s).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(t+1)/s*100}%`),location.hash!==`#${t+1}`&&history.replaceState(null,"",`#${t+1}`),U(i),z(i),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:t,slide:i}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(t){if(!(t.target&&t.target.isContentEditable)&&!(t.target&&/input|textarea/i.test(t.target.tagName))){if(t.ctrlKey&&t.shiftKey&&(t.key==="E"||t.key==="e")){t.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(t.key){case"ArrowRight":case" ":case"PageDown":t.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":t.preventDefault(),this._prev();break;case"Home":t.preventDefault(),this._show(0);break;case"End":t.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":t.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const s=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("deck-theme",s)}_scale(){const t=innerWidth,s=innerHeight,i=Math.min(t/1920,s/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${i})`}}customElements.get("deck-root")||customElements.define("deck-root",B);const Q=["B","I","EM","STRONG","BR"],V=new Set(Q),Y=new Set(["BR"]);function a(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function x(e){if(e==null)return"";const t=document.createElement("template");return t.innerHTML=String(e),P(t.content)}function P(e){let t="";for(const s of e.childNodes)if(s.nodeType===Node.TEXT_NODE)t+=a(s.nodeValue);else if(s.nodeType===Node.ELEMENT_NODE){const i=s.tagName;if(V.has(i)){const n=i.toLowerCase();Y.has(i)?t+=`<${n}>`:t+=`<${n}>${P(s)}</${n}>`}else t+=P(s)}return t}const X=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),Z=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),R=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function v(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function q(e){if(e==null)return"";let t="",s=0,i=null,n;for(R.lastIndex=0;(n=R.exec(e))!==null;){if(n.index>s){const r=e.slice(s,n.index);t+=v(r),/\S/.test(r)&&(i=null)}const o=n.groups;if(o.comment)t+=`<span class="tok-comment">${v(o.comment)}</span>`,i=null;else if(o.tstring)t+=`<span class="tok-string">${v(o.tstring)}</span>`,i=null;else if(o.fstring)t+=`<span class="tok-string">${v(o.fstring)}</span>`,i=null;else if(o.string)t+=`<span class="tok-string">${v(o.string)}</span>`,i=null;else if(o.decorator)t+=`<span class="tok-decorator">${v(o.decorator)}</span>`,i=null;else if(o.number)t+=`<span class="tok-number">${v(o.number)}</span>`,i=null;else if(o.word){const r=o.word;i==="function"?(t+=`<span class="tok-function-def">${v(r)}</span>`,i=null):i==="class"?(t+=`<span class="tok-class-def">${v(r)}</span>`,i=null):X.has(r)?(t+=`<span class="tok-keyword">${v(r)}</span>`,r==="def"?i="function":r==="class"?i="class":i=null):Z.has(r)?(t+=`<span class="tok-builtin">${v(r)}</span>`,i=null):(t+=v(r),i=null)}s=n.index+n[0].length}return s<e.length&&(t+=v(e.slice(s))),t}function O(e){const t=(e||"").split(`
`).length;return t>=20?"xs":t>=14?"sm":t>=10?"md":"lg"}function J(e,t){return t.map(s=>ee(s,e)).join(`
`)}function ee(e,t){const s=te[e.type];return s?s(e,t):`<div class="slide"><div class="slide__body">Unknown slide type: ${a(e.type)}</div></div>`}function d(e,t,s){return`data-edit="${e}/${t}/${s}"`}function F(e,t,s){return`data-edit-list="${e}/${t}/${s}"`}function _(e,t,s="",i=""){return`<div class="slide ${s}" data-slide-type="${a(e.type)}" data-edit-slide="${a(t.id)}/${a(e.id)}" data-unit="${a(t.id)}" data-tag="${a(t.tag||"")}" data-total="${a(t.total||"")}"${i?" "+i:""}>`}const te={section(e,t){return`${_(e,t,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${d(t.id,e.id,"kicker")}>${a(e.kicker||"Unit")}</span>
            <span ${d(t.id,e.id,"number")}>${a(e.number||"")}</span>
          </div>
          <h2 class="section__title" ${d(t.id,e.id,"title")}>${a(e.title||"")}</h2>
        </div>
      </div>
    </div>`},title(e,t){return`${_(e,t,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${d(t.id,e.id,"title")}>${a(e.title||"")}</h1>
          <div class="title-slide__subtitle" ${d(t.id,e.id,"subtitle")}>${a(e.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(e,t){const s=(e.items||[]).map((i,n)=>`<li ${d(t.id,e.id,`items[${n}]`)}>${x(i)}</li>`).join("");return`${_(e,t,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${d(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          ${e.lead?`<p class="bullets__lead" ${d(t.id,e.id,"lead")}>${x(e.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${d(t.id,e.id,"lead")}></p>`}
          <ul class="bullets__list" ${F(t.id,e.id,"items")}>${s}</ul>
        </div>
      </div>
    </div>`},question(e,t){return`${_(e,t,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${d(t.id,e.id,"question")}>${a(e.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(e,t){const s=i=>{const n=e[i]||{title:"",items:[]},o=(n.items||[]).map((r,p)=>`<li ${d(t.id,e.id,`${i}.items[${p}]`)}>${x(r)}</li>`).join("");return`<div class="split__col">
        <h3 ${d(t.id,e.id,`${i}.title`)}>${a(n.title||"")}</h3>
        <ul ${F(t.id,e.id,`${i}.items`)}>${o}</ul>
      </div>`};return`${_(e,t,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${d(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          <div class="split__cols">
            ${s("left")}
            ${s("right")}
          </div>
        </div>
      </div>
    </div>`},prose(e,t){return`${_(e,t,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${e.eyebrow?`<div class="prose__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:`<div class="prose__eyebrow" ${d(t.id,e.id,"eyebrow")}></div>`}
          <p class="prose__body" ${d(t.id,e.id,"body")}>${x(e.body||"")}</p>
        </div>
      </div>
    </div>`},image(e,t){const s=e.fit==="contain"?"contain":"cover",i=a(e.src||""),n=a(e.alt||"");return`${_(e,t,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${s}">
          <img src="${i}" alt="${n}" />
          ${e.caption?`<div class="image-slide__caption" ${d(t.id,e.id,"caption")}>${x(e.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${d(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(e,t){const s=a(e.demo||""),i=!!e.code,n=i?q(e.code):"",o=i?e.code.split(`
`).length:0;return`${_(e,t,`slide--demo${i?" slide--demo-with-code":""}`,`data-demo="${s}"`)}
      <div class="slide__body">
        <div class="demo">
          ${e.eyebrow?`<div class="demo__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="demo__heading" ${d(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${e.hint?`<div class="demo__hint" ${d(t.id,e.id,"hint")}>${a(e.hint)}</div>`:""}
            </div>
            ${i?`<div class="demo__code-side">
              <div class="demo__line-count">${o} lines</div>
              <pre class="demo__code"><code ${d(t.id,e.id,"code")}>${n}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(e,t){const s=(e.language||"python").toLowerCase(),i=s==="python"?q(e.code||""):a(e.code||""),n=O(e.code||"");return`${_(e,t,`slide--code slide--code-${n}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${e.eyebrow?`<div class="code-slide__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${d(t.id,e.id,"eyebrow")}></div>`}
          ${e.heading?`<h2 class="code-slide__heading" ${d(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:`<h2 class="code-slide__heading" ${d(t.id,e.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${a(s)}"><code ${d(t.id,e.id,"code")}>${i}</code></pre>
          ${e.caption?`<div class="code-slide__caption" ${d(t.id,e.id,"caption")}>${x(e.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${d(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(e,t){const s=e.regions||[],i=e.tooltips||{},n=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,o={};for(const g of s)for(let y=g.lines[0];y<=g.lines[1];y++)o[y]=g;const r=Object.keys(i).sort((g,y)=>y.length-g.length),m=(e.code||"").split(`
`).map((g,y)=>{const k=y+1,b=o[k];let $=q(g)||" ";for(const u of r){const f=u.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),h=i[u],L=typeof h=="object"?`data-tip-sig="${a(h.sig||"")}" data-tip-desc="${a(h.desc||"")}" data-tip-url="${a(h.url||"")}"`:`data-tip-sig="" data-tip-desc="${a(h)}" data-tip-url=""`;$=$.replace(new RegExp(f),`<span class="icode-tip" ${L}>${u}</span>`)}const A=b?b.id:"",E=b?b.color:"transparent";return`<div class="${`icode__line${n.test(g)?" icode__line--divider":""}`}" data-region="${A}" data-line="${k}" style="--rc:${E}"><span class="icode__line-num">${k}</span>${$}</div>`}).join(""),w=s.map((g,y)=>{const k=(g.links||[]).map(b=>`<a href="${a(b.url)}" target="_blank" rel="noopener">→ ${a(b.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${a(g.id)}" style="--rc:${a(g.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${a(g.label)}</div>
            <div class="icode__ann-key">${y+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${a(g.description)}</div>
            <div class="icode__ann-detail">${a(g.detail||"")}${k?`<div class="icode__ann-links">${k}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${_(e,t,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${e.heading?`<h2 class="icode__heading" ${d(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${s.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${m}</pre>
            <div class="icode__annotations">${w}</div>
          </div>
          ${e.subtitle?`<div class="icode__subtitle" ${d(t.id,e.id,"subtitle")}>${a(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(e,t){const s=q(e.code||""),i=O(e.code||""),n=(e.annotations||[]).map((o,r)=>`<li ${d(t.id,e.id,`annotations[${r}]`)}>${x(o)}</li>`).join("");return`${_(e,t,`slide--annotated-code slide--acode-${i}`)}
      <div class="slide__body">
        <div class="acode">
          ${e.eyebrow?`<div class="acode__eyebrow" ${d(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="acode__heading" ${d(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${d(t.id,e.id,"code")}>${s}</code></pre>
            <ol class="acode__annotations" ${F(t.id,e.id,"annotations")}>${n}</ol>
          </div>
          ${e.subtitle?`<div class="acode__subtitle" ${d(t.id,e.id,"subtitle")}>${a(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(e,t){const s=(e.items||[]).map((i,n)=>`<li ${d(t.id,e.id,`items[${n}]`)}>${x(i)}</li>`).join("");return`${_(e,t,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${d(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          <ol class="live__list" ${F(t.id,e.id,"items")}>${s}</ol>
        </div>
      </div>
    </div>`}},ie={id:"01",number:"01",tag:"OPENING THE BOX",total:"12"},se=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"Opening the Box"},{id:"welcome",type:"title",eyebrow:"Game Programmierung  ·  SS26",title:"Welcome.",subtitle:"Twelve weeks to build a real game without an engine. Let's take a look under the hood."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your laptop</b> — Python, Git, and your codebase. Every session.","<b>Short input, long workshop.</b>","<b>Find a partner / rubberduck.</b>","<b>Four exercises.</b> Mandatory part of your grade.","<b>Ask early.</b>"]},{id:"why-question",type:"question",eyebrow:"Question for the room",question:"Why would anyone write a game without an engine"},{id:"why-answer",type:"image",src:"/img/shoggoth.avif",alt:"The Shoggoth — a lovecraftian mass of eyes and tentacles",caption:"To understand the Shoggoth.",fit:"contain"},{id:"today",type:"demo",eyebrow:"TODAY",heading:"A program where you move a shape when you press a button.",demo:"moving-square",hint:"WASD to move",code:`import pygame
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

pygame.quit()`},{id:"toolkit",type:"bullets",heading:"What you need on your machine",lead:"Five things. Each earns its place. We're going to install them together.",items:["<b>Python</b> — the language.","<b>uv</b> — the package manager.","<b>pygame</b> — gives us a window and the ability to draw in it.","<b>An IDE</b> — VS Code or Cursor. Where you write your code."]},{id:"ide-choice",type:"split",heading:"Pick an editor — VS Code or Cursor",left:{title:"VS Code",items:["Free, ubiquitous, Microsoft-backed","GitHub Copilot included free with GitHub Education (.edu email)","What most studios use","Today's live demo runs in this"]},right:{title:"Cursor",items:["VS Code plus an AI front-and-center","Slightly slicker, free tier exists","What I use day-to-day","If you have it open instead, you're fine"]}},{id:"llm-policy",type:"prose",eyebrow:"A Young Lady's Illustrated Primer",body:"<b>1.</b>  AI is the best tool ever invented for learning.<br><br><b>2.</b>  AI is the best tool ever invented for <i>not</i> learning.<br><br><b>3.</b>  Which way, modern man?<br><br><i>— Zvi Mowshowitz</i>"},{id:"lab-step-1",type:"code",eyebrow:"Step 1 of 7",heading:"Install Python",code:`Download from python.org/downloads

→ Choose the latest 3.12 or newer
→ On Windows: tick "Add Python to PATH"
→ On Mac/Linux: just install`,caption:"Verify in a terminal: <b>python --version</b> should print 3.12 or higher."},{id:"lab-step-2",type:"code",eyebrow:"Step 2 of 7",heading:"Install uv",code:`# Windows (PowerShell):
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Mac / Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh`,caption:"uv is a package manager. It puts each project's dependencies in their own folder so they don't fight each other. Five years ago this was a nightmare; now it's one command."},{id:"lab-step-3",type:"code",eyebrow:"Step 3 of 7",heading:"Make a project",code:`uv init hello-pygame
cd hello-pygame
uv add pygame`,caption:"Three lines. You now have a Python project with pygame installed, in its own folder, with its own everything."},{id:"lab-step-4",type:"code",eyebrow:"Step 4 of 7",heading:"Open it in your editor",code:`code .

# or, if you're using Cursor:
cursor .`,caption:"From inside the project folder, this opens the editor in this directory."},{id:"lab-step-5",type:"code",eyebrow:"Step 5 of 7",heading:"Hello, world.",code:`# hello.py
print("Hello, world!")

# In the terminal:
uv run hello.py`,caption:`If "Hello, world!" appears, your toolchain works. <b>If it doesn't, raise your hand.</b>`},{id:"lab-step-6",type:"code",eyebrow:"Step 6 of 7",heading:"Hello, window.",code:`import pygame
pygame.init()
screen = pygame.display.set_mode((800, 600))

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    pygame.display.flip()

pygame.quit()`,caption:"<br>"},{id:"lab-step-7",type:"code",eyebrow:"Step 7 of 7",heading:"Hello, square.",code:`import pygame
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

pygame.quit()`,caption:"<br>"},{id:"the-loop",type:"interactive-code",heading:"You just wrote a complete game loop.",subtitle:"Every game ever made has this shape. The next eleven sessions are about what goes inside it.",code:`import pygame
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

pygame.quit()`,regions:[{id:"init",label:"init",lines:[1,4],color:"#ff6b35",description:"Start pygame. Get a window. Create a clock.",detail:"pygame.init() starts all subsystems (display, audio, input). set_mode() asks the OS for a window of the given pixel dimensions. Clock will cap frame rate later. These run once, before the loop.",links:[{label:"pygame.init()",url:"https://www.pygame.org/docs/ref/pygame.html#pygame.init"},{label:"display.set_mode()",url:"https://www.pygame.org/docs/ref/display.html#pygame.display.set_mode"}]},{id:"state",label:"state",lines:[5,5],color:"#f0c674",description:"The world is just variables.",detail:"x and y are the square’s position. Every frame reads them to know where to draw. Every keypress changes them. Right now the entire game state is two integers — by Unit 12 it will be hundreds of variables across dozens of objects, but the principle is the same."},{id:"loop",label:"the loop",lines:[7,8],color:"#7fd1c8",description:"Sixty times a second, until you quit.",detail:"while running: repeats its body once per frame. At 60 FPS each iteration has about 16.7 milliseconds to finish. When running becomes False (via the QUIT event), the loop exits and the program falls through to pygame.quit().",links:[{label:"game loop pattern",url:"https://www.pygame.org/docs/tut/newbieguide.html"}]},{id:"events",label:"events",lines:[9,12],color:"#c390d4",description:"What did the user just do?",detail:"pygame.event.get() returns every input event since the last frame — key presses, mouse moves, window close. We check each one. QUIT fires when the user clicks the X button or presses Alt+F4. If you skip this check, the window becomes unresponsive.",links:[{label:"event handling",url:"https://www.pygame.org/docs/ref/event.html"}]},{id:"update",label:"update",lines:[14,19],color:"#98c379",description:"Change the world based on input.",detail:"get_pressed() returns a snapshot of all keyboard keys right now: True if held, False if not. This is continuous input — it fires every frame the key is held, not once on key-down. We change x and y; the screen hasn’t been redrawn yet. The world model updates before the picture does.",links:[{label:"key.get_pressed()",url:"https://www.pygame.org/docs/ref/key.html#pygame.key.get_pressed"}]},{id:"draw",label:"draw + flip",lines:[21,25],color:"#6fb3d2",description:"Paint the new world, then present it.",detail:"fill() clears every pixel to one color (erasing the old frame). draw.rect() paints the square at its current position. These write to a back buffer — an invisible copy of the screen. flip() swaps the back buffer to the front, making the new frame visible. clock.tick(60) then sleeps until 16.7ms have passed, keeping the loop at 60 FPS.",links:[{label:"display.flip()",url:"https://www.pygame.org/docs/ref/display.html#pygame.display.flip"},{label:"draw.rect()",url:"https://www.pygame.org/docs/ref/draw.html#pygame.draw.rect"}]}],tooltips:{"pygame.init":{sig:"pygame.init() → (numpass, numfail)",desc:"Starts all pygame subsystems (display, audio, input, fonts). Call once at program start. Returns how many subsystems succeeded/failed.",url:"https://www.pygame.org/docs/ref/pygame.html#pygame.init"},set_mode:{sig:"pygame.display.set_mode(size) → Surface",desc:"Creates the game window. size is (width, height) in pixels. Returns the Surface you draw on — this is the back buffer.",url:"https://www.pygame.org/docs/ref/display.html#pygame.display.set_mode"},"pygame.time.Clock":{sig:"pygame.time.Clock() → Clock",desc:"Creates a clock for frame rate control. Use clock.tick(fps) each frame to cap speed and measure delta time.",url:"https://www.pygame.org/docs/ref/time.html#pygame.time.Clock"},"pygame.event.get":{sig:"pygame.event.get() → [Event, ...]",desc:"Returns and removes all events from the queue since last call. Must be called every frame — without it, the OS considers your window unresponsive.",url:"https://www.pygame.org/docs/ref/event.html#pygame.event.get"},"pygame.QUIT":{sig:"event.type == pygame.QUIT",desc:"Event fired when the user clicks the window’s X button or presses Alt+F4. Your code must handle this or the window can’t be closed.",url:"https://www.pygame.org/docs/ref/event.html"},get_pressed:{sig:"pygame.key.get_pressed() → ScancodeWrapper",desc:"Snapshot of every key right now: True if held, False if not. Continuous — fires every frame, not just on key-down. For one-shot actions (jump, shoot), use KEYDOWN events instead.",url:"https://www.pygame.org/docs/ref/key.html#pygame.key.get_pressed"},K_LEFT:{sig:"pygame.K_LEFT, K_RIGHT, K_UP, K_DOWN",desc:"Integer constants for arrow keys. Index into the get_pressed() array. Full list in pygame.locals.",url:"https://www.pygame.org/docs/ref/key.html#key-constants-label"},"screen.fill":{sig:"surface.fill(color) → Rect",desc:"Fills every pixel with one color. color is (R, G, B), each 0–255. Use to erase the previous frame before drawing the new one.",url:"https://www.pygame.org/docs/ref/surface.html#pygame.Surface.fill"},"draw.rect":{sig:"pygame.draw.rect(surface, color, rect, width=0) → Rect",desc:"Draws a rectangle. rect is (x, y, width, height). width=0 = filled; width>0 = border only at that thickness.",url:"https://www.pygame.org/docs/ref/draw.html#pygame.draw.rect"},"display.flip":{sig:"pygame.display.flip() → None",desc:"Presents the back buffer to the screen. Pygame double-buffers: you draw to an invisible copy, then flip() swaps it to the visible display. Without this, nothing you drew shows up.",url:"https://www.pygame.org/docs/ref/display.html#pygame.display.flip"},"clock.tick":{sig:"clock.tick(framerate=0) → milliseconds",desc:"Sleeps until enough time has passed for the target FPS. tick(60) = wait until 16.7ms since last tick. Returns actual elapsed ms (useful for frame-rate-independent movement). Without this, the loop runs as fast as hardware allows.",url:"https://www.pygame.org/docs/ref/time.html#pygame.time.Clock.tick"},"pygame.quit":{sig:"pygame.quit() → None",desc:"Uninitializes all pygame modules. Closes the window, releases audio devices, frees resources. Counterpart to pygame.init(). Runs after the loop exits.",url:"https://www.pygame.org/docs/ref/pygame.html#pygame.quit"}}},{id:"project",type:"bullets",heading:"Fake Game",lead:"Across the next twelve weeks you'll build a real version of a Hero Wars-style fake game. The minimum is one functional game. The maximum is whatever you can ship by Unit 12.",items:["A player you control","Enemies that try to kill you","Bullets, levels, a title screen, a score","A reason to keep playing","Juice"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"You built hello-square in class. Now make it yours.",items:["<b>Set up git. Make a public repo. Post the link.</b>","<b>Extend hello-square.</b> Pick one: wrap around the edges, change color on Space, add a second shape — or surprise us. We show them off next Friday. Coolest thing wins a prize.","Sleep."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],ne={meta:ie,slides:se},oe=[ne],ae=oe.map(e=>J(e.meta,e.slides)).join(`
`),D=document.createElement("deck-root");D.innerHTML=ae;document.body.appendChild(D);
