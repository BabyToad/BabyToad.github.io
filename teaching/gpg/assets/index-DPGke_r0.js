(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function F(e){const t=e.getContext("2d");e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,t.scale(devicePixelRatio,devicePixelRatio);const n=e.clientWidth,i=e.clientHeight;let o=n/2-20,s=i/2-20;const d=5,h={},y=g=>{"wasd".includes(g.key.toLowerCase())&&(h[g.key.toLowerCase()]=g.type==="keydown",g.preventDefault())};window.addEventListener("keydown",y),window.addEventListener("keyup",y);let w;function m(){h.a&&(o-=d),h.d&&(o+=d),h.w&&(s-=d),h.s&&(s+=d),o=Math.max(0,Math.min(o,n-40)),s=Math.max(0,Math.min(s,i-40)),t.fillStyle="#0b0d10",t.fillRect(0,0,n,i),t.fillStyle="#ff6b35",t.fillRect(o,s,40,40),w=requestAnimationFrame(m)}return m(),()=>{cancelAnimationFrame(w),window.removeEventListener("keydown",y),window.removeEventListener("keyup",y)}}const O={"moving-square":F};let L=null;function Y(e){if(L&&(L(),L=null),!e)return;const t=e.querySelector(".demo__canvas"),n=e.getAttribute("data-demo");if(!t||!n)return;const i=O[n];if(!i){console.warn(`[demo] unknown demo: ${n}`);return}L=i(t)||null}let C=null;function B(e){if(C&&(C(),C=null),!(e!=null&&e.hasAttribute("data-interactive-code")))return;const t=e.querySelector(".icode");if(!t)return;const n=[...e.querySelectorAll(".icode__line[data-region]")],i=[...e.querySelectorAll(".icode__ann[data-region]")],o=[...e.querySelectorAll(".icode-tip")],s=[...new Set(n.map(r=>r.dataset.region).filter(Boolean))],d=new Set;let h=null,y=null,w=!1,m=null;function g(){const r=h!==null;t.classList.toggle("icode--has-active",r),t.classList.toggle("icode--has-revealed",d.size>0);for(const c of n){const u=c.dataset.region;u&&(c.classList.toggle("icode__line--active",u===h),c.classList.toggle("icode__line--revealed",d.has(u)))}for(const c of i){const u=c.dataset.region;c.classList.toggle("icode__ann--active",u===h),c.classList.toggle("icode__ann--revealed",d.has(u))}}function k(){w||d.size>=s.length&&(w=!0,t.classList.add("icode--complete"),setTimeout(()=>t.classList.remove("icode--complete"),900))}g();function _(r){var c,u;if(!((c=r.target)!=null&&c.isContentEditable||/input|textarea/i.test((u=r.target)==null?void 0:u.tagName))){if(r.key>="1"&&r.key<="9"){const b=parseInt(r.key)-1;if(b>=s.length)return;r.preventDefault();const p=s[b];h===p?(h=null,y=null):(d.add(p),h=p,y=p,k()),g();return}if(r.key==="0"||r.key==="Escape"){(h||y)&&(r.preventDefault(),h=null,y=null,g());return}}}addEventListener("keydown",_);const $=[];for(const r of n){const c=r.dataset.region;if(!c)continue;const u=()=>{!y&&d.has(c)&&(h=c,g())},b=()=>{y||(h=null,g())};r.addEventListener("mouseenter",u),r.addEventListener("mouseleave",b),$.push({el:r,events:{mouseenter:u,mouseleave:b}})}for(const r of i){const c=r.dataset.region,u=()=>{!y&&d.has(c)&&(h=c,g())},b=()=>{y||(h=null,g())},p=()=>{y===c?(y=null,h=null):(d.add(c),y=c,h=c,k()),g()};r.addEventListener("mouseenter",u),r.addEventListener("mouseleave",b),r.addEventListener("click",p),$.push({el:r,events:{mouseenter:u,mouseleave:b,click:p}})}function j(r){A();const c=r.dataset.tipSig||"",u=r.dataset.tipDesc||"",b=r.dataset.tipUrl||"";if(!c&&!u)return;const p=document.createElement("div");p.className="icode-tooltip",p.innerHTML=[c?`<code class="icode-tooltip__sig">${R(c)}</code>`:"",u?`<div class="icode-tooltip__desc">${R(u)}</div>`:"",b?`<a class="icode-tooltip__link" href="${R(b)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),t.appendChild(p),t.style.position="relative";let S=0,E=0,x=r;for(;x&&x!==t;)S+=x.offsetTop,E+=x.offsetLeft,x=x.offsetParent;p.style.left=Math.max(0,E)+"px",p.style.visibility="hidden";const q=p.offsetHeight,D=p.offsetWidth;S-q-10<0?(p.style.top=S+r.offsetHeight+8+"px",p.classList.add("icode-tooltip--below")):p.style.top=S-q-8+"px";const U=t.offsetWidth-D-8;parseInt(p.style.left)>U&&(p.style.left=Math.max(0,U)+"px"),p.style.visibility="",m=p}function A(){m&&(m.remove(),m=null)}for(const r of o){const c=()=>j(r),u=()=>A();r.addEventListener("mouseenter",c),r.addEventListener("mouseleave",u),$.push({el:r,events:{mouseenter:c,mouseleave:u}})}C=()=>{removeEventListener("keydown",_);for(const r of $)for(const[c,u]of Object.entries(r.events))r.el.removeEventListener(c,u);A(),h=null,y=null,t.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const r of n)r.classList.remove("icode__line--active","icode__line--revealed");for(const r of i)r.classList.remove("icode__ann--active","icode__ann--revealed")}}function R(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const G=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",G);class K extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const t=document.createElement("div");for(t.className="deck__stage";this.firstChild;)t.appendChild(this.firstChild);this.appendChild(t),this._stage=t,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",n=>this._onKey(n)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const n=new URLSearchParams(location.search).get("unit");let i=Array.from(this._stage.querySelectorAll(".slide"));n&&(i=i.filter(o=>o.getAttribute("data-unit")===n),this._stage.querySelectorAll(".slide").forEach(o=>{i.includes(o)||o.remove()})),this._slides=i}_buildFooter(){const t=document.createElement("div");t.className="deck__footer",t.innerHTML=`
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
    `,document.body.appendChild(t),this._help=t}_readHashIndex(){var i;const t=location.hash.match(/^#(\d+)/);if(!t)return 0;const n=parseInt(t[1],10)-1;return Math.max(0,Math.min(n,(((i=this._slides)==null?void 0:i.length)||1)-1))}_show(t){if(!this._slides.length||t<0||t>=this._slides.length)return;this._index=t;const n=this._slides.length;this._slides.forEach((w,m)=>{m===t?w.setAttribute("data-active",""):w.removeAttribute("data-active")});const i=this._slides[t],o=i.getAttribute("data-unit")||"",s=i.getAttribute("data-tag")||"",d=i.getAttribute("data-total")||"12",h=[];o&&h.push(`UNIT ${o} / ${d}`),s&&h.push(s);const y=h.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=y),this._fNum&&(this._fNum.textContent=`${String(t+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(t+1)/n*100}%`),location.hash!==`#${t+1}`&&history.replaceState(null,"",`#${t+1}`),Y(i),B(i),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:t,slide:i}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(t){if(!(t.target&&t.target.isContentEditable)&&!(t.target&&/input|textarea/i.test(t.target.tagName))){if(t.ctrlKey&&t.shiftKey&&(t.key==="E"||t.key==="e")){t.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(t.key){case"ArrowRight":case" ":case"PageDown":t.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":t.preventDefault(),this._prev();break;case"Home":t.preventDefault(),this._show(0);break;case"End":t.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":t.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const n=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n),localStorage.setItem("deck-theme",n)}_scale(){const t=innerWidth,n=innerHeight,i=Math.min(t/1920,n/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${i})`}}customElements.get("deck-root")||customElements.define("deck-root",K);const z=["B","I","EM","STRONG","BR"],Q=new Set(z),V=new Set(["BR"]);function a(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function T(e){if(e==null)return"";const t=document.createElement("template");return t.innerHTML=String(e),M(t.content)}function M(e){let t="";for(const n of e.childNodes)if(n.nodeType===Node.TEXT_NODE)t+=a(n.nodeValue);else if(n.nodeType===Node.ELEMENT_NODE){const i=n.tagName;if(Q.has(i)){const o=i.toLowerCase();V.has(i)?t+=`<${o}>`:t+=`<${o}>${M(n)}</${o}>`}else t+=M(n)}return t}const X=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),J=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),W=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function v(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function I(e){if(e==null)return"";let t="",n=0,i=null,o;for(W.lastIndex=0;(o=W.exec(e))!==null;){if(o.index>n){const d=e.slice(n,o.index);t+=v(d),/\S/.test(d)&&(i=null)}const s=o.groups;if(s.comment)t+=`<span class="tok-comment">${v(s.comment)}</span>`,i=null;else if(s.tstring)t+=`<span class="tok-string">${v(s.tstring)}</span>`,i=null;else if(s.fstring)t+=`<span class="tok-string">${v(s.fstring)}</span>`,i=null;else if(s.string)t+=`<span class="tok-string">${v(s.string)}</span>`,i=null;else if(s.decorator)t+=`<span class="tok-decorator">${v(s.decorator)}</span>`,i=null;else if(s.number)t+=`<span class="tok-number">${v(s.number)}</span>`,i=null;else if(s.word){const d=s.word;i==="function"?(t+=`<span class="tok-function-def">${v(d)}</span>`,i=null):i==="class"?(t+=`<span class="tok-class-def">${v(d)}</span>`,i=null):X.has(d)?(t+=`<span class="tok-keyword">${v(d)}</span>`,d==="def"?i="function":d==="class"?i="class":i=null):J.has(d)?(t+=`<span class="tok-builtin">${v(d)}</span>`,i=null):(t+=v(d),i=null)}n=o.index+o[0].length}return n<e.length&&(t+=v(e.slice(n))),t}function H(e){const t=(e||"").split(`
`).length;return t>=20?"xs":t>=14?"sm":t>=10?"md":"lg"}function Z(e,t){return t.map(n=>ee(n,e)).join(`
`)}function ee(e,t){const n=te[e.type];return n?n(e,t):`<div class="slide"><div class="slide__body">Unknown slide type: ${a(e.type)}</div></div>`}function l(e,t,n){return`data-edit="${e}/${t}/${n}"`}function P(e,t,n){return`data-edit-list="${e}/${t}/${n}"`}function f(e,t,n="",i=""){return`<div class="slide ${n}" data-slide-type="${a(e.type)}" data-edit-slide="${a(t.id)}/${a(e.id)}" data-unit="${a(t.id)}" data-tag="${a(t.tag||"")}" data-total="${a(t.total||"")}"${i?" "+i:""}>`}const te={section(e,t){return`${f(e,t,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${l(t.id,e.id,"kicker")}>${a(e.kicker||"Unit")}</span>
            <span ${l(t.id,e.id,"number")}>${a(e.number||"")}</span>
          </div>
          <h2 class="section__title" ${l(t.id,e.id,"title")}>${a(e.title||"")}</h2>
        </div>
      </div>
    </div>`},title(e,t){return`${f(e,t,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${l(t.id,e.id,"title")}>${a(e.title||"")}</h1>
          <div class="title-slide__subtitle" ${l(t.id,e.id,"subtitle")}>${a(e.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(e,t){const n=(e.items||[]).map((i,o)=>`<li ${l(t.id,e.id,`items[${o}]`)}>${T(i)}</li>`).join("");return`${f(e,t,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${l(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          ${e.lead?`<p class="bullets__lead" ${l(t.id,e.id,"lead")}>${T(e.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${l(t.id,e.id,"lead")}></p>`}
          <ul class="bullets__list" ${P(t.id,e.id,"items")}>${n}</ul>
        </div>
      </div>
    </div>`},question(e,t){return`${f(e,t,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${l(t.id,e.id,"question")}>${a(e.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(e,t){const n=i=>{const o=e[i]||{title:"",items:[]},s=(o.items||[]).map((d,h)=>`<li ${l(t.id,e.id,`${i}.items[${h}]`)}>${T(d)}</li>`).join("");return`<div class="split__col">
        <h3 ${l(t.id,e.id,`${i}.title`)}>${a(o.title||"")}</h3>
        <ul ${P(t.id,e.id,`${i}.items`)}>${s}</ul>
      </div>`};return`${f(e,t,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${l(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          <div class="split__cols">
            ${n("left")}
            ${n("right")}
          </div>
        </div>
      </div>
    </div>`},prose(e,t){return`${f(e,t,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${e.eyebrow?`<div class="prose__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:`<div class="prose__eyebrow" ${l(t.id,e.id,"eyebrow")}></div>`}
          ${e.heading?`<h2 class="prose__heading" ${l(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <p class="prose__body" ${l(t.id,e.id,"body")}>${T(e.body||"")}</p>
        </div>
      </div>
    </div>`},image(e,t){const n=e.fit==="contain"?"contain":"cover",i=a(e.src||""),o=a(e.alt||"");return`${f(e,t,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${n}">
          <img src="${i}" alt="${o}" />
          ${e.caption?`<div class="image-slide__caption" ${l(t.id,e.id,"caption")}>${T(e.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${l(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(e,t){const n=a(e.demo||""),i=!!e.code,o=i?I(e.code):"",s=i?e.code.split(`
`).length:0;return`${f(e,t,`slide--demo${i?" slide--demo-with-code":""}`,`data-demo="${n}"`)}
      <div class="slide__body">
        <div class="demo">
          ${e.eyebrow?`<div class="demo__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="demo__heading" ${l(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${e.hint?`<div class="demo__hint" ${l(t.id,e.id,"hint")}>${a(e.hint)}</div>`:""}
            </div>
            ${i?`<div class="demo__code-side">
              <div class="demo__line-count">${s} lines</div>
              <pre class="demo__code"><code ${l(t.id,e.id,"code")}>${o}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(e,t){const n=(e.language||"python").toLowerCase(),i=n==="python"?I(e.code||""):a(e.code||""),o=H(e.code||"");return`${f(e,t,`slide--code slide--code-${o}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${e.eyebrow?`<div class="code-slide__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${l(t.id,e.id,"eyebrow")}></div>`}
          ${e.heading?`<h2 class="code-slide__heading" ${l(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:`<h2 class="code-slide__heading" ${l(t.id,e.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${a(n)}"><code ${l(t.id,e.id,"code")}>${i}</code></pre>
          ${e.caption?`<div class="code-slide__caption" ${l(t.id,e.id,"caption")}>${T(e.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${l(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(e,t){const n=e.regions||[],i=e.tooltips||{},o=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,s={};for(const m of n)for(let g=m.lines[0];g<=m.lines[1];g++)s[g]=m;const d=Object.keys(i).sort((m,g)=>g.length-m.length),y=(e.code||"").split(`
`).map((m,g)=>{const k=g+1,_=s[k];let $=I(m)||" ";for(const u of d){const b=u.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),p=i[u],E=typeof p=="object"?`data-tip-sig="${a(p.sig||"")}" data-tip-desc="${a(p.desc||"")}" data-tip-url="${a(p.url||"")}"`:`data-tip-sig="" data-tip-desc="${a(p)}" data-tip-url=""`;$=$.replace(new RegExp(b),`<span class="icode-tip" ${E}>${u}</span>`)}const j=_?_.id:"",A=_?_.color:"transparent";return`<div class="${`icode__line${o.test(m)?" icode__line--divider":""}`}" data-region="${j}" data-line="${k}" style="--rc:${A}"><span class="icode__line-num">${k}</span>${$}</div>`}).join(""),w=n.map((m,g)=>{const k=(m.links||[]).map(_=>`<a href="${a(_.url)}" target="_blank" rel="noopener">→ ${a(_.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${a(m.id)}" style="--rc:${a(m.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${a(m.label)}</div>
            <div class="icode__ann-key">${g+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${a(m.description)}</div>
            <div class="icode__ann-detail">${a(m.detail||"")}${k?`<div class="icode__ann-links">${k}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${f(e,t,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${e.heading?`<h2 class="icode__heading" ${l(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${n.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${y}</pre>
            <div class="icode__annotations">${w}</div>
          </div>
          ${e.subtitle?`<div class="icode__subtitle" ${l(t.id,e.id,"subtitle")}>${a(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(e,t){const n=I(e.code||""),i=H(e.code||""),o=(e.annotations||[]).map((s,d)=>`<li ${l(t.id,e.id,`annotations[${d}]`)}>${T(s)}</li>`).join("");return`${f(e,t,`slide--annotated-code slide--acode-${i}`)}
      <div class="slide__body">
        <div class="acode">
          ${e.eyebrow?`<div class="acode__eyebrow" ${l(t.id,e.id,"eyebrow")}>${a(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="acode__heading" ${l(t.id,e.id,"heading")}>${a(e.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${l(t.id,e.id,"code")}>${n}</code></pre>
            <ol class="acode__annotations" ${P(t.id,e.id,"annotations")}>${o}</ol>
          </div>
          ${e.subtitle?`<div class="acode__subtitle" ${l(t.id,e.id,"subtitle")}>${a(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(e,t){const n=(e.items||[]).map((i,o)=>`<li ${l(t.id,e.id,`items[${o}]`)}>${T(i)}</li>`).join("");return`${f(e,t,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${l(t.id,e.id,"heading")}>${a(e.heading||"")}</h2>
          <ol class="live__list" ${P(t.id,e.id,"items")}>${n}</ol>
        </div>
      </div>
    </div>`}},ie={id:"01",number:"01",tag:"OPENING THE BOX",total:"12"},ne=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"Opening the Box"},{id:"welcome",type:"title",eyebrow:"Game Programmierung  ·  SS26",title:"Welcome.",subtitle:"Twelve weeks to build a real game without an engine. Let's take a look under the hood."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your laptop</b> — Python, Git, and your codebase. Every session.","<b>Short input, long workshop.</b>","<b>Find a partner / rubberduck.</b>","<b>Four exercises.</b> Mandatory part of your grade.","<b>Ask early.</b>"]},{id:"why-question",type:"question",eyebrow:"Question for the room",question:"Why would anyone write a game without an engine"},{id:"why-answer",type:"image",src:"/img/shoggoth.avif",alt:"The Shoggoth — a lovecraftian mass of eyes and tentacles",caption:"To understand the Shoggoth.",fit:"contain"},{id:"today",type:"demo",eyebrow:"TODAY",heading:"A program where you move a shape when you press a button.",demo:"moving-square",hint:"WASD to move",code:`import pygame
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
git push`,regions:[{id:"snapshot",label:"snapshot",lines:[1,4],color:"#c390d4",description:"Take a snapshot of your project right now.",detail:"git init creates a hidden .git/ folder that tracks every change. git add . stages all files — tells git 'include these in the next snapshot'. git commit saves the snapshot with a message. These three commands create your first checkpoint. You can always return to this exact state.",links:[{label:"git basics",url:"https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F"}]},{id:"connect",label:"connect to github",lines:[6,9],color:"#7fd1c8",description:"Link your local project to GitHub so we can see it.",detail:"Create a new repository on github.com (the green '+' button, top right). Don't add a README — you already have files. Copy the URL it gives you. git remote add origin tells your local repo where to push. git push -u origin main uploads everything and sets up tracking. After this, your code is online and we can grade it."},{id:"daily",label:"the daily loop",lines:[11,14],color:"#98c379",description:"Add, commit, push. Every session, every feature.",detail:"After each coding session: add stages your changes, commit saves them with a message, push uploads to GitHub. Write messages that say what changed — 'add enemy spawning' not 'update' or 'stuff'. If you prefer clicking to typing: GitHub Desktop, Fork, or the Git panel built into VS Code all do the same thing with buttons.",links:[{label:"GitHub Desktop",url:"https://desktop.github.com/"}]}],tooltips:{"git init":{sig:"git init",desc:"Creates a new git repository in the current folder. Adds a hidden .git/ directory that tracks all changes. Run once per project.",url:"https://git-scm.com/docs/git-init"},"git add":{sig:"git add <files>",desc:"Stages files for the next commit. 'git add .' stages everything in the current directory. Staging is like putting items in a box before sealing it.",url:"https://git-scm.com/docs/git-add"},"git commit":{sig:'git commit -m "message"',desc:"Saves a snapshot of all staged changes with a descriptive message. Each commit is a checkpoint you can return to. Commits are local until you push.",url:"https://git-scm.com/docs/git-commit"},"git push":{sig:"git push",desc:"Uploads local commits to the remote repository (GitHub). After pushing, your code is online and visible to others. The -u flag sets up tracking so future pushes don't need extra arguments.",url:"https://git-scm.com/docs/git-push"},"git remote":{sig:"git remote add origin <url>",desc:"Connects your local repository to a remote one. 'origin' is the conventional name for your primary remote. The URL points to your GitHub repo.",url:"https://git-scm.com/docs/git-remote"}}},{id:"homework",type:"bullets",heading:"For next Friday",lead:"You built hello-square in class. Now make it yours.",items:["<b>Set up git. Make a public repo. Post the link.</b>","<b>Extend hello-square.</b> Pick one: wrap around the edges, change color on Space, add a second shape — or surprise us. We show them off next Friday. Coolest thing wins a prize.","Sleep."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],oe={meta:ie,slides:ne},se={id:"02",number:"02",tag:"HOW COMPUTERS THINK",total:"31"},ae=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"How Computers Think"},{id:"showcase",type:"question",eyebrow:"Homework",question:"Show us your squares"},{id:"today",type:"bullets",heading:"Today.",lead:"How does a computer think?",items:["Seven basic concepts.","Then we play a game where <b>you are the computer</b>."]},{id:"concept-variable",type:"prose",eyebrow:"Concept 01",heading:"Variable",body:"A <b>name</b> attached to a <b>value</b>.<br><br>A labeled slot that holds something. The label stays. The value can change.<br><br>Last week: <b>x = 400</b> was a variable. Your square's position."},{id:"concept-type",type:"bullets",heading:"Concept 02 — Type",lead:"What kind of thing is in the slot.",items:["<b>int</b> — whole numbers. <b>42</b>, <b>-7</b>, <b>0</b>","<b>float</b> — decimal numbers. <b>3.14</b>, <b>0.5</b>, <b>-2.0</b>",'<b>str</b> — text. <b>"hello"</b>, <b>"Game Over"</b>',"<b>bool</b> — true or false. <b>True</b>, <b>False</b>. That's it.",'The computer cares. <b>"3"</b> is not the same as <b>3</b>.']},{id:"concept-expression",type:"prose",eyebrow:"Concept 03",heading:"Expression",body:'Anything that <b>produces a value</b>.<br><br><b>3 + 4</b> is an expression. <b>x > 10</b> is an expression. <b>"hello" + " world"</b> is an expression.<br><br>Every time the computer needs an answer, it <i>evaluates</i> an expression.'},{id:"concept-conditional",type:"code",eyebrow:"Concept 04 — Conditional",heading:"Making decisions.",code:`if something_is_true:
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
print(result)`,caption:"Team B's cards were theirs. Team A never saw them. That's <b>scope</b> — local variables exist only inside the function. The <b>def</b> block is read but not run until called.",language:"python"},{id:"game-debrief",type:"bullets",heading:"What just happened",lead:"You were a computer. Each role maps to a real part.",items:["<b>Interpreter</b> → Control Unit. Reads instructions, directs everything — including jumps.","<b>Memory</b> → RAM. Named slots that hold values.","<b>ALU</b> → Arithmetic Logic Unit. Math and decisions. One chip, two jobs.","<b>Screen</b> → Standard output (<b>print()</b>). The only thing the outside world sees.","There was no Counter. A loop is just <b>a variable, a comparison, and a jump</b> — built from parts you already had. Python's <b>for i in range()</b> wraps that pattern into one line.","What was annoying? What was slow? What was boring? <b>Those are the things computers are good at.</b>"]},{id:"uebung",type:"bullets",heading:"Uebung 001",lead:"Due next Friday. 10 Punkte.",items:["<b>Schleifen (5P):</b> Zaehle alle Ganzzahlen zwischen 437 und 32482 zusammen. Print das Ergebnis.","<b>Funktionen (5P):</b> Schreibe eine Funktion mit zwei float-Parametern. Teile den kleineren durch den groesseren. Wenn gleich: gib 1 zurueck.","Repo: <b>github.com/BabyToad/macromedia-game-programming-ss26</b>"]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],re={meta:se,slides:ae},le=[oe,re],de=le.map(e=>Z(e.meta,e.slides)).join(`
`),N=document.createElement("deck-root");N.innerHTML=de;document.body.appendChild(N);
