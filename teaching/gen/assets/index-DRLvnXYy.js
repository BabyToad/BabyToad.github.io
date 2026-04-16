(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();function U(e){const t=e.getContext("2d");e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,t.scale(devicePixelRatio,devicePixelRatio);const s=e.clientWidth,i=e.clientHeight;let n=s/2-20,o=i/2-20;const r=5,u={},v=_=>{"wasd".includes(_.key.toLowerCase())&&(u[_.key.toLowerCase()]=_.type==="keydown",_.preventDefault())};window.addEventListener("keydown",v),window.addEventListener("keyup",v);let y;function g(){u.a&&(n-=r),u.d&&(n+=r),u.w&&(o-=r),u.s&&(o+=r),n=Math.max(0,Math.min(n,s-40)),o=Math.max(0,Math.min(o,i-40)),t.fillStyle="#0b0d10",t.fillRect(0,0,s,i),t.fillStyle="#ff6b35",t.fillRect(n,o,40,40),y=requestAnimationFrame(g)}return g(),()=>{cancelAnimationFrame(y),window.removeEventListener("keydown",v),window.removeEventListener("keyup",v)}}const F={"moving-square":U};let C=null;function B(e){if(C&&(C(),C=null),!e)return;const t=e.querySelector(".demo__canvas"),s=e.getAttribute("data-demo");if(!t||!s)return;const i=F[s];if(!i){console.warn(`[demo] unknown demo: ${s}`);return}C=i(t)||null}let A=null;function G(e){if(A&&(A(),A=null),!(e!=null&&e.hasAttribute("data-interactive-code")))return;const t=e.querySelector(".icode");if(!t)return;const s=[...e.querySelectorAll(".icode__line[data-region]")],i=[...e.querySelectorAll(".icode__ann[data-region]")],n=[...e.querySelectorAll(".icode-tip")],o=[...new Set(s.map(l=>l.dataset.region).filter(Boolean))],r=new Set;let u=null,v=null,y=!1,g=null;function _(){const l=u!==null;t.classList.toggle("icode--has-active",l),t.classList.toggle("icode--has-revealed",r.size>0);for(const c of s){const h=c.dataset.region;h&&(c.classList.toggle("icode__line--active",h===u),c.classList.toggle("icode__line--revealed",r.has(h)))}for(const c of i){const h=c.dataset.region;c.classList.toggle("icode__ann--active",h===u),c.classList.toggle("icode__ann--revealed",r.has(h))}}function w(){y||r.size>=o.length&&(y=!0,t.classList.add("icode--complete"),setTimeout(()=>t.classList.remove("icode--complete"),900))}_();function $(l){var c,h;if(!((c=l.target)!=null&&c.isContentEditable||/input|textarea/i.test((h=l.target)==null?void 0:h.tagName))){if(l.key>="1"&&l.key<="9"){const f=parseInt(l.key)-1;if(f>=o.length)return;l.preventDefault();const p=o[f];u===p?(u=null,v=null):(r.add(p),u=p,v=p,w()),_();return}if(l.key==="0"||l.key==="Escape"){(u||v)&&(l.preventDefault(),u=null,v=null,_());return}}}addEventListener("keydown",$);const k=[];for(const l of s){const c=l.dataset.region;if(!c)continue;const h=()=>{!v&&r.has(c)&&(u=c,_())},f=()=>{v||(u=null,_())};l.addEventListener("mouseenter",h),l.addEventListener("mouseleave",f),k.push({el:l,events:{mouseenter:h,mouseleave:f}})}for(const l of i){const c=l.dataset.region,h=()=>{!v&&r.has(c)&&(u=c,_())},f=()=>{v||(u=null,_())},p=()=>{v===c?(v=null,u=null):(r.add(c),v=c,u=c,w()),_()};l.addEventListener("mouseenter",h),l.addEventListener("mouseleave",f),l.addEventListener("click",p),k.push({el:l,events:{mouseenter:h,mouseleave:f,click:p}})}function P(l){T();const c=l.dataset.tipSig||"",h=l.dataset.tipDesc||"",f=l.dataset.tipUrl||"";if(!c&&!h)return;const p=document.createElement("div");p.className="icode-tooltip",p.innerHTML=[c?`<code class="icode-tooltip__sig">${I(c)}</code>`:"",h?`<div class="icode-tooltip__desc">${I(h)}</div>`:"",f?`<a class="icode-tooltip__link" href="${I(f)}" target="_blank" rel="noopener">→ docs</a>`:""].filter(Boolean).join(""),t.appendChild(p),t.style.position="relative";let x=0,L=0,E=l;for(;E&&E!==t;)x+=E.offsetTop,L+=E.offsetLeft,E=E.offsetParent;p.style.left=Math.max(0,L)+"px",p.style.visibility="hidden";const D=p.offsetHeight,O=p.offsetWidth;x-D-10<0?(p.style.top=x+l.offsetHeight+8+"px",p.classList.add("icode-tooltip--below")):p.style.top=x-D-8+"px";const N=t.offsetWidth-O-8;parseInt(p.style.left)>N&&(p.style.left=Math.max(0,N)+"px"),p.style.visibility="",g=p}function T(){g&&(g.remove(),g=null)}for(const l of n){const c=()=>P(l),h=()=>T();l.addEventListener("mouseenter",c),l.addEventListener("mouseleave",h),k.push({el:l,events:{mouseenter:c,mouseleave:h}})}A=()=>{removeEventListener("keydown",$);for(const l of k)for(const[c,h]of Object.entries(l.events))l.el.removeEventListener(c,h);T(),u=null,v=null,t.classList.remove("icode--has-active","icode--has-revealed","icode--complete");for(const l of s)l.classList.remove("icode__line--active","icode__line--revealed");for(const l of i)l.classList.remove("icode__ann--active","icode__ann--revealed")}}function I(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const z=localStorage.getItem("deck-theme")||"dark";document.documentElement.setAttribute("data-theme",z);class K extends HTMLElement{connectedCallback(){if(this._wired)return;this._wired=!0;const t=document.createElement("div");for(t.className="deck__stage";this.firstChild;)t.appendChild(this.firstChild);this.appendChild(t),this._stage=t,this._collectSlides(),this._buildFooter(),this._buildHelp(),this._index=this._readHashIndex(),this._show(this._index),this._scale(),addEventListener("resize",()=>this._scale()),addEventListener("keydown",s=>this._onKey(s)),addEventListener("hashchange",()=>this._show(this._readHashIndex()))}_collectSlides(){const s=new URLSearchParams(location.search).get("unit");let i=Array.from(this._stage.querySelectorAll(".slide"));s&&(i=i.filter(n=>n.getAttribute("data-unit")===s),this._stage.querySelectorAll(".slide").forEach(n=>{i.includes(n)||n.remove()})),this._slides=i}_buildFooter(){const t=document.createElement("div");t.className="deck__footer",t.innerHTML=`
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
    `,document.body.appendChild(t),this._help=t}_readHashIndex(){var i;const t=location.hash.match(/^#(\d+)/);if(!t)return 0;const s=parseInt(t[1],10)-1;return Math.max(0,Math.min(s,(((i=this._slides)==null?void 0:i.length)||1)-1))}_show(t){if(!this._slides.length||t<0||t>=this._slides.length)return;this._index=t;const s=this._slides.length;this._slides.forEach((y,g)=>{g===t?y.setAttribute("data-active",""):y.removeAttribute("data-active")});const i=this._slides[t],n=i.getAttribute("data-unit")||"",o=i.getAttribute("data-tag")||"",r=i.getAttribute("data-total")||"12",u=[];n&&u.push(`UNIT ${n} / ${r}`),o&&u.push(o);const v=u.join("  —  ");this._fTag&&(this._fTag.style.animation="none",this._fTag.offsetHeight,this._fTag.style.animation="",this._fTag.textContent=v),this._fNum&&(this._fNum.textContent=`${String(t+1).padStart(2,"0")} / ${String(s).padStart(2,"0")}`),this._progress&&(this._progress.style.width=`${(t+1)/s*100}%`),location.hash!==`#${t+1}`&&history.replaceState(null,"",`#${t+1}`),B(i),G(i),dispatchEvent(new CustomEvent("deck:slide-change",{detail:{index:t,slide:i}}))}_next(){this._show(Math.min(this._index+1,this._slides.length-1))}_prev(){this._show(Math.max(this._index-1,0))}_onKey(t){if(!(t.target&&t.target.isContentEditable)&&!(t.target&&/input|textarea/i.test(t.target.tagName))){if(t.ctrlKey&&t.shiftKey&&(t.key==="E"||t.key==="e")){t.preventDefault(),dispatchEvent(new CustomEvent("deck:toggle-edit"));return}switch(t.key){case"ArrowRight":case" ":case"PageDown":t.preventDefault(),this._next();break;case"ArrowLeft":case"PageUp":t.preventDefault(),this._prev();break;case"Home":t.preventDefault(),this._show(0);break;case"End":t.preventDefault(),this._show(this._slides.length-1);break;case"f":case"F":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();break;case"t":case"T":t.preventDefault(),this._toggleTheme();break;case"?":this._help.toggleAttribute("data-open");break}}}_toggleTheme(){const s=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("deck-theme",s)}_scale(){const t=innerWidth,s=innerHeight,i=Math.min(t/1920,s/1080);this._stage.style.transform=`translate(-50%, -50%) scale(${i})`}}customElements.get("deck-root")||customElements.define("deck-root",K);const V=["B","I","EM","STRONG","BR"],Q=new Set(V),X=new Set(["BR"]);function d(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function S(e){if(e==null)return"";const t=document.createElement("template");return t.innerHTML=String(e),j(t.content)}function j(e){let t="";for(const s of e.childNodes)if(s.nodeType===Node.TEXT_NODE)t+=d(s.nodeValue);else if(s.nodeType===Node.ELEMENT_NODE){const i=s.tagName;if(Q.has(i)){const n=i.toLowerCase();X.has(i)?t+=`<${n}>`:t+=`<${n}>${j(s)}</${n}>`}else t+=j(s)}return t}const Y=new Set(["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]),Z=new Set(["print","len","range","str","int","float","list","dict","set","tuple","bool","type","isinstance","abs","min","max","sum","enumerate","zip","map","filter","input","open","round","self","cls"]),M=new RegExp(["(?<comment>#[^\\n]*)",`(?<tstring>"""[\\s\\S]*?"""|'''[\\s\\S]*?''')`,`(?<fstring>f"(?:[^"\\\\\\n]|\\\\.)*"|f'(?:[^'\\\\\\n]|\\\\.)*')`,`(?<string>"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`,"(?<decorator>@\\w+)","(?<number>\\b\\d+(?:\\.\\d+)?\\b)","(?<word>[A-Za-z_]\\w*)"].join("|"),"g");function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function q(e){if(e==null)return"";let t="",s=0,i=null,n;for(M.lastIndex=0;(n=M.exec(e))!==null;){if(n.index>s){const r=e.slice(s,n.index);t+=m(r),/\S/.test(r)&&(i=null)}const o=n.groups;if(o.comment)t+=`<span class="tok-comment">${m(o.comment)}</span>`,i=null;else if(o.tstring)t+=`<span class="tok-string">${m(o.tstring)}</span>`,i=null;else if(o.fstring)t+=`<span class="tok-string">${m(o.fstring)}</span>`,i=null;else if(o.string)t+=`<span class="tok-string">${m(o.string)}</span>`,i=null;else if(o.decorator)t+=`<span class="tok-decorator">${m(o.decorator)}</span>`,i=null;else if(o.number)t+=`<span class="tok-number">${m(o.number)}</span>`,i=null;else if(o.word){const r=o.word;i==="function"?(t+=`<span class="tok-function-def">${m(r)}</span>`,i=null):i==="class"?(t+=`<span class="tok-class-def">${m(r)}</span>`,i=null):Y.has(r)?(t+=`<span class="tok-keyword">${m(r)}</span>`,r==="def"?i="function":r==="class"?i="class":i=null):Z.has(r)?(t+=`<span class="tok-builtin">${m(r)}</span>`,i=null):(t+=m(r),i=null)}s=n.index+n[0].length}return s<e.length&&(t+=m(e.slice(s))),t}function R(e){const t=(e||"").split(`
`).length;return t>=20?"xs":t>=14?"sm":t>=10?"md":"lg"}function J(e,t){return t.map(s=>ee(s,e)).join(`
`)}function ee(e,t){const s=te[e.type];return s?s(e,t):`<div class="slide"><div class="slide__body">Unknown slide type: ${d(e.type)}</div></div>`}function a(e,t,s){return`data-edit="${e}/${t}/${s}"`}function H(e,t,s){return`data-edit-list="${e}/${t}/${s}"`}function b(e,t,s="",i=""){return`<div class="slide ${s}" data-slide-type="${d(e.type)}" data-edit-slide="${d(t.id)}/${d(e.id)}" data-unit="${d(t.id)}" data-tag="${d(t.tag||"")}" data-total="${d(t.total||"")}"${i?" "+i:""}>`}const te={section(e,t){return`${b(e,t,"slide--section")}
      <div class="slide__body">
        <div class="section">
          <div class="section__number">
            <span ${a(t.id,e.id,"kicker")}>${d(e.kicker||"Unit")}</span>
            <span ${a(t.id,e.id,"number")}>${d(e.number||"")}</span>
          </div>
          <h2 class="section__title" ${a(t.id,e.id,"title")}>${d(e.title||"")}</h2>
        </div>
      </div>
    </div>`},title(e,t){return`${b(e,t,"slide--title")}
      <div class="slide__body">
        <div class="title-slide">
          <div class="title-slide__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow||"")}</div>
          <h1 class="title-slide__title" ${a(t.id,e.id,"title")}>${d(e.title||"")}</h1>
          <div class="title-slide__subtitle" ${a(t.id,e.id,"subtitle")}>${d(e.subtitle||"")}</div>
        </div>
      </div>
    </div>`},bullets(e,t){const s=(e.items||[]).map((i,n)=>`<li ${a(t.id,e.id,`items[${n}]`)}>${S(i)}</li>`).join("");return`${b(e,t,"slide--bullets")}
      <div class="slide__body">
        <div class="bullets">
          <h2 class="bullets__heading" ${a(t.id,e.id,"heading")}>${d(e.heading||"")}</h2>
          ${e.lead?`<p class="bullets__lead" ${a(t.id,e.id,"lead")}>${S(e.lead)}</p>`:`<p class="bullets__lead bullets__lead--empty" ${a(t.id,e.id,"lead")}></p>`}
          <ul class="bullets__list" ${H(t.id,e.id,"items")}>${s}</ul>
        </div>
      </div>
    </div>`},question(e,t){return`${b(e,t,"slide--question")}
      <div class="slide__body">
        <div class="qslide">
          <div class="qslide__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow||"")}</div>
          <h2 class="qslide__q"><span ${a(t.id,e.id,"question")}>${d(e.question||"")}</span></h2>
        </div>
      </div>
    </div>`},split(e,t){const s=i=>{const n=e[i]||{title:"",items:[]},o=(n.items||[]).map((r,u)=>`<li ${a(t.id,e.id,`${i}.items[${u}]`)}>${S(r)}</li>`).join("");return`<div class="split__col">
        <h3 ${a(t.id,e.id,`${i}.title`)}>${d(n.title||"")}</h3>
        <ul ${H(t.id,e.id,`${i}.items`)}>${o}</ul>
      </div>`};return`${b(e,t,"slide--split")}
      <div class="slide__body">
        <div class="split">
          <h2 class="split__heading" ${a(t.id,e.id,"heading")}>${d(e.heading||"")}</h2>
          <div class="split__cols">
            ${s("left")}
            ${s("right")}
          </div>
        </div>
      </div>
    </div>`},prose(e,t){return`${b(e,t,"slide--prose")}
      <div class="slide__body">
        <div class="prose">
          ${e.eyebrow?`<div class="prose__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow)}</div>`:`<div class="prose__eyebrow" ${a(t.id,e.id,"eyebrow")}></div>`}
          <p class="prose__body" ${a(t.id,e.id,"body")}>${S(e.body||"")}</p>
        </div>
      </div>
    </div>`},image(e,t){const s=e.fit==="contain"?"contain":"cover",i=d(e.src||""),n=d(e.alt||"");return`${b(e,t,"slide--image")}
      <div class="slide__body">
        <div class="image-slide image-slide--${s}">
          <img src="${i}" alt="${n}" />
          ${e.caption?`<div class="image-slide__caption" ${a(t.id,e.id,"caption")}>${S(e.caption)}</div>`:`<div class="image-slide__caption image-slide__caption--empty" ${a(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},demo(e,t){const s=d(e.demo||""),i=!!e.code,n=i?q(e.code):"",o=i?e.code.split(`
`).length:0;return`${b(e,t,`slide--demo${i?" slide--demo-with-code":""}`,`data-demo="${s}"`)}
      <div class="slide__body">
        <div class="demo">
          ${e.eyebrow?`<div class="demo__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="demo__heading" ${a(t.id,e.id,"heading")}>${d(e.heading)}</h2>`:""}
          <div class="demo__split">
            <div class="demo__canvas-side">
              <div class="demo__canvas-wrap">
                <canvas class="demo__canvas"></canvas>
              </div>
              ${e.hint?`<div class="demo__hint" ${a(t.id,e.id,"hint")}>${d(e.hint)}</div>`:""}
            </div>
            ${i?`<div class="demo__code-side">
              <div class="demo__line-count">${o} lines</div>
              <pre class="demo__code"><code ${a(t.id,e.id,"code")}>${n}</code></pre>
            </div>`:""}
          </div>
        </div>
      </div>
    </div>`},code(e,t){const s=(e.language||"python").toLowerCase(),i=s==="python"?q(e.code||""):d(e.code||""),n=R(e.code||"");return`${b(e,t,`slide--code slide--code-${n}`)}
      <div class="slide__body">
        <div class="code-slide">
          ${e.eyebrow?`<div class="code-slide__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow)}</div>`:`<div class="code-slide__eyebrow" ${a(t.id,e.id,"eyebrow")}></div>`}
          ${e.heading?`<h2 class="code-slide__heading" ${a(t.id,e.id,"heading")}>${d(e.heading)}</h2>`:`<h2 class="code-slide__heading" ${a(t.id,e.id,"heading")}></h2>`}
          <pre class="code-slide__code language-${d(s)}"><code ${a(t.id,e.id,"code")}>${i}</code></pre>
          ${e.caption?`<div class="code-slide__caption" ${a(t.id,e.id,"caption")}>${S(e.caption)}</div>`:`<div class="code-slide__caption code-slide__caption--empty" ${a(t.id,e.id,"caption")}></div>`}
        </div>
      </div>
    </div>`},"interactive-code"(e,t){const s=e.regions||[],i=e.tooltips||{},n=/^(\s*)#\s*-{3,}\s*.+\s*-{3,}\s*$/,o={};for(const g of s)for(let _=g.lines[0];_<=g.lines[1];_++)o[_]=g;const r=Object.keys(i).sort((g,_)=>_.length-g.length),v=(e.code||"").split(`
`).map((g,_)=>{const w=_+1,$=o[w];let k=q(g)||" ";for(const h of r){const f=h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),p=i[h],L=typeof p=="object"?`data-tip-sig="${d(p.sig||"")}" data-tip-desc="${d(p.desc||"")}" data-tip-url="${d(p.url||"")}"`:`data-tip-sig="" data-tip-desc="${d(p)}" data-tip-url=""`;k=k.replace(new RegExp(f),`<span class="icode-tip" ${L}>${h}</span>`)}const P=$?$.id:"",T=$?$.color:"transparent";return`<div class="${`icode__line${n.test(g)?" icode__line--divider":""}`}" data-region="${P}" data-line="${w}" style="--rc:${T}"><span class="icode__line-num">${w}</span>${k}</div>`}).join(""),y=s.map((g,_)=>{const w=(g.links||[]).map($=>`<a href="${d($.url)}" target="_blank" rel="noopener">→ ${d($.label)}</a>`).join(" ");return`
      <div class="icode__ann" data-region="${d(g.id)}" style="--rc:${d(g.color)}">
        <div class="icode__ann-inner">
          <div class="icode__ann-header">
            <div class="icode__ann-dot"></div>
            <div class="icode__ann-label">${d(g.label)}</div>
            <div class="icode__ann-key">${_+1}</div>
          </div>
          <div class="icode__ann-body">
            <div class="icode__ann-desc">${d(g.description)}</div>
            <div class="icode__ann-detail">${d(g.detail||"")}${w?`<div class="icode__ann-links">${w}</div>`:""}</div>
          </div>
        </div>
      </div>`}).join("");return`${b(e,t,"slide--interactive-code","data-interactive-code")}
      <div class="slide__body">
        <div class="icode">
          ${e.heading?`<h2 class="icode__heading" ${a(t.id,e.id,"heading")}>${d(e.heading)}</h2>`:""}
          <div class="icode__keys-hint">press 1–${s.length} to explore</div>
          <div class="icode__cols">
            <pre class="icode__code">${v}</pre>
            <div class="icode__annotations">${y}</div>
          </div>
          ${e.subtitle?`<div class="icode__subtitle" ${a(t.id,e.id,"subtitle")}>${d(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},"annotated-code"(e,t){const s=q(e.code||""),i=R(e.code||""),n=(e.annotations||[]).map((o,r)=>`<li ${a(t.id,e.id,`annotations[${r}]`)}>${S(o)}</li>`).join("");return`${b(e,t,`slide--annotated-code slide--acode-${i}`)}
      <div class="slide__body">
        <div class="acode">
          ${e.eyebrow?`<div class="acode__eyebrow" ${a(t.id,e.id,"eyebrow")}>${d(e.eyebrow)}</div>`:""}
          ${e.heading?`<h2 class="acode__heading" ${a(t.id,e.id,"heading")}>${d(e.heading)}</h2>`:""}
          <div class="acode__cols">
            <pre class="acode__code language-python"><code ${a(t.id,e.id,"code")}>${s}</code></pre>
            <ol class="acode__annotations" ${H(t.id,e.id,"annotations")}>${n}</ol>
          </div>
          ${e.subtitle?`<div class="acode__subtitle" ${a(t.id,e.id,"subtitle")}>${d(e.subtitle)}</div>`:""}
        </div>
      </div>
    </div>`},live(e,t){const s=(e.items||[]).map((i,n)=>`<li ${a(t.id,e.id,`items[${n}]`)}>${S(i)}</li>`).join("");return`${b(e,t,"slide--live")}
      <div class="slide__body">
        <div class="live">
          <div class="live__badge">● LIVE</div>
          <h2 class="live__heading" ${a(t.id,e.id,"heading")}>${d(e.heading||"")}</h2>
          <ol class="live__list" ${H(t.id,e.id,"items")}>${s}</ol>
        </div>
      </div>
    </div>`}},ie={id:"01",number:"01",tag:"WHAT ENGINES DO",total:"12"},se=[{id:"section",type:"section",number:"01",kicker:"Unit",title:"What Engines Do"},{id:"welcome",type:"title",eyebrow:"Game Engines & Scripting  ·  SS26",title:"Welcome.",subtitle:"Let's make games."},{id:"how-it-works",type:"bullets",heading:"What to expect.",lead:"This is how the course will work:",items:["<b>Bring your project</b> — laptop, Unity, your repo. Every session.","<b>Short input, long workshop</b> — 20 min teaching, 70 min building.","<b>Vertical slice</b> by Unit 6. ","<b>Final build</b> — Windows, two scenes, GUI, audio, docs.","<b>Ask early.</b>"]},{id:"what-is-engine",type:"question",eyebrow:"Question for the room",question:"What is a game engine"},{id:"engine-illustration",type:"image",src:"/img/engine-diagram.svg",alt:"Cutaway illustration of a game engine: a small game scene at the top, with the layers of engine subsystems beneath it.",caption:"A game engine, cut away.",fit:"contain"},{id:"what-engines-do",type:"split",heading:"What an engine actually does for you",left:{title:"Runtime",items:["The <b>game loop</b> — input, update, render, repeat","Rendering — meshes, shaders, lighting, cameras","Physics — rigidbodies, colliders, raycasts","Audio — mixing, spatialization, streaming","Input — keyboard, mouse, gamepad, touch"]},right:{title:"Tooling",items:["Editor — scenes, hierarchy, inspector","Asset pipeline — import, compress, package","Build system — Windows, Mac, Web, Mobile","Animation, particles, UI, terrain","An ecosystem — packages, tutorials, jobs"]}},{id:"why-unity",type:"split",heading:"Why Unity for this course",left:{title:"The pitch",items:["Mature C# scripting — a real, modern language","Huge community + asset store + jobs market","2D & 3D in one tool","Free for students; ships to almost any platform","What most studios you'll intern at actually use"]},right:{title:"The landscape",items:["<b>Unreal</b> — bigger guns, steeper hill, C++ / Blueprints","<b>Godot</b> — open source, lighter, GDScript","<b>Roll your own</b> — no engine, just code & a window. We'll do this in <i>Game Programmierung</i>."]}},{id:"live-unity-tour",type:"live",heading:"Unity tour",items:["Unity Hub → install LTS → new 3D (URP) project","Editor anatomy — Hierarchy, Scene, Game, Inspector, Project, Console","Drop a Plane, a few Cubes, a Directional Light. Save the scene.","Add a <b>First-Person Controller</b> from the Starter Assets package","Hit Play — walk around. Mouse-look, jump, gravity.","Open the controller script. Read it together. <b>Don't panic.</b>","Change one number. Hit Play. See it change. That's the loop."]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Think about the game you want to build. 2 Scenes. Simple Interactions.",items:["3 Minute Pitch: Simple. Simple. Simple.","Think: Walking Simulator.","Reference a vibe, look, game.","Scope check: small, finishable beats ambitious-and-abandoned","Install Unity LTS + create a GitHub account if you don&#39;t have one",""]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],ne={meta:ie,slides:se},oe={id:"02",number:"02",tag:"PITCH & BLOCKOUT",total:"12"},de=[{id:"section",type:"section",number:"02",kicker:"Unit",title:"Pitch & Blockout"},{id:"today",type:"bullets",heading:"Today.",lead:"Two things. ",items:["<b>30 min — Pitches.</b> 3 minutes each.","<b>60 min — Blockout.</b> Greybox your Scene 1 in Unity. Leave with something playable."]},{id:"pitch-rules",type:"bullets",heading:"The Pitch",lead:"3 minutes.",items:["<b>What is it?</b> One sentence. Genre, perspective, core mechanic.","<b>What does it feel like?</b> Reference a vibe, a game, a film, a place.","<b>Two scenes.</b> What are they? How do they differ in mood?","<b>Scope check.</b> Can you finish this in 10 weeks?"]},{id:"pitch-warning",type:"prose",eyebrow:"The rule",body:"Small and finished beats ambitious and abandoned.<br><br>Think <b>walking simulator</b>, not open world.<br><br>If your pitch takes more than one sentence to explain, it's too big."},{id:"pitches",type:"question",eyebrow:"Let's go",question:"Pitches"},{id:"blockout-what",type:"bullets",heading:"What is a blockout?",lead:"The ugliest version of your game that still communicates the idea.",items:["<b>Greybox geometry</b> — cubes, planes, cylinders. No textures, no materials.","<b>Scale matters</b> — walk through it. Does the space feel right?","<b>Camera matters</b> — first-person? Third-person? Top-down? Set it now.","<b>One interaction</b> — a door that opens, a light that toggles, a trigger zone. Prove the loop works.","The rest is commentary."]},{id:"blockout-live",type:"live",heading:"Blockout demo",items:["New scene. Save it as <b>Scene_01</b>.","Plane for the ground. Scale it up. That's your floor.","Cubes for walls, doorways, cover, landmarks. <b>Hold V</b> to vertex-snap.","First-Person Controller from Starter Assets — drop it in, hit Play, walk around.","Does the space feel too big? Too small? Fix it <b>now</b>, while it's cheap.","Add one trigger zone: <b>Box Collider (Is Trigger)</b> + a script that prints to Console.","Save. This is your starting point for the next 10 weeks."]},{id:"workshop",type:"question",eyebrow:"Your turn",question:"Build your Scene 1"},{id:"checklist",type:"bullets",heading:"Before you leave",lead:"Scene 1 checkpoint — you should have all of these.",items:["A Unity project with a saved Scene_01","Ground plane + at least 5 greybox objects defining the space","A character controller you can walk around with","The space <b>feels right</b> — not too big, not too small","One interaction (trigger, door, light — anything)"]},{id:"homework",type:"bullets",heading:"For next Friday",lead:"Git. GitHub. Push.",items:["<b>Create a GitHub repo</b> for your project. Add a proper <b>.gitignore for Unity</b>.","<b>Push your project.</b> Post the repo link.","<b>Extend the blockout.</b> Add Scene 2 — different mood, same project. Even if it's just a different lighting color on cubes.","Next week we set up your dev environment properly and talk about project structure."]},{id:"questions",type:"question",eyebrow:"Before you go",question:"Questions"}],le={meta:oe,slides:de},ae=[ne,le],re=ae.map(e=>J(e.meta,e.slides)).join(`
`),W=document.createElement("deck-root");W.innerHTML=re;document.body.appendChild(W);
