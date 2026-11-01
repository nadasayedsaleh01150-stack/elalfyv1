/* Lenis 1.1.13 (MIT), smooth wheel scrolling on desktop */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Lenis=i()}(this,(function(){"use strict";function clamp(t,i,e){return Math.max(t,Math.min(i,e))}class Animate{constructor(){this.isRunning=!1,this.value=0,this.from=0,this.to=0,this.currentTime=0}advance(t){var i;if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;const i=clamp(0,this.currentTime/this.duration,1);e=i>=1;const s=e?1:this.easing(i);this.value=this.from+(this.to-this.from)*s}else this.lerp?(this.value=function damp(t,i,e,s){return function lerp(t,i,e){return(1-e)*t+e*i}(t,i,1-Math.exp(-e*s))}(this.value,this.to,60*this.lerp,t),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),null===(i=this.onUpdate)||void 0===i||i.call(this,this.value,e)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:e,duration:s,easing:o,onStart:n,onUpdate:l}){this.from=this.value=t,this.to=i,this.lerp=e,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,null==n||n(),this.onUpdate=l}}class Dimensions{constructor(t,i,{autoResize:e=!0,debounce:s=250}={}){this.wrapper=t,this.content=i,this.width=0,this.height=0,this.scrollHeight=0,this.scrollWidth=0,this.resize=()=>{this.onWrapperResize(),this.onContentResize()},this.onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)},this.onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)},e&&(this.debouncedResize=function debounce(t,i){let e;return function(...s){let o=this;clearTimeout(e),e=setTimeout((()=>{e=void 0,t.apply(o,s)}),i)}}(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){var t,i;null===(t=this.wrapperResizeObserver)||void 0===t||t.disconnect(),null===(i=this.contentResizeObserver)||void 0===i||i.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}}class Emitter{constructor(){this.events={}}emit(t,...i){var e;let s=this.events[t]||[];for(let t=0,o=s.length;t<o;t++)null===(e=s[t])||void 0===e||e.call(s,...i)}on(t,i){var e;return(null===(e=this.events[t])||void 0===e?void 0:e.push(i))||(this.events[t]=[i]),()=>{var e;this.events[t]=null===(e=this.events[t])||void 0===e?void 0:e.filter((t=>i!==t))}}off(t,i){var e;this.events[t]=null===(e=this.events[t])||void 0===e?void 0:e.filter((t=>i!==t))}destroy(){this.events={}}}const t=100/6,i={passive:!1};class VirtualScroll{constructor(e,s={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=s,this.touchStart={x:0,y:0},this.lastDelta={x:0,y:0},this.window={width:0,height:0},this.emitter=new Emitter,this.onTouchStart=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})},this.onTouchMove=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t,s=-(i-this.touchStart.x)*this.options.touchMultiplier,o=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})},this.onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})},this.onWheel=i=>{let{deltaX:e,deltaY:s,deltaMode:o}=i;e*=1===o?t:2===o?this.window.width:1,s*=1===o?t:2===o?this.window.height:1,e*=this.options.wheelMultiplier,s*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:s,event:i})},this.onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}},window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,i),this.element.addEventListener("touchstart",this.onTouchStart,i),this.element.addEventListener("touchmove",this.onTouchMove,i),this.element.addEventListener("touchend",this.onTouchEnd,i)}on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,i),this.element.removeEventListener("touchstart",this.onTouchStart,i),this.element.removeEventListener("touchmove",this.onTouchMove,i),this.element.removeEventListener("touchend",this.onTouchEnd,i)}}return class Lenis{constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:e=t,smoothWheel:s=!0,syncTouch:o=!1,syncTouchLerp:n=.075,touchInertiaMultiplier:l=35,duration:r,easing:h=(t=>Math.min(1,1.001-Math.pow(2,-10*t))),lerp:a=.1,infinite:c=!1,orientation:u="vertical",gestureOrientation:d="vertical",touchMultiplier:p=1,wheelMultiplier:m=1,autoResize:v=!0,prevent:g,virtualScroll:S,__experimental__naiveDimensions:w=!1}={}){this._isScrolling=!1,this._isStopped=!1,this._isLocked=!1,this._preventNextNativeScrollEvent=!1,this._resetVelocityTimeout=null,this.time=0,this.userData={},this.lastVelocity=0,this.velocity=0,this.direction=0,this.animate=new Animate,this.emitter=new Emitter,this.onPointerDown=t=>{1===t.button&&this.reset()},this.onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;const{deltaX:i,deltaY:e,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:i,deltaY:e,event:s}),s.ctrlKey)return;const o=s.type.includes("touch"),n=s.type.includes("wheel");this.isTouching="touchstart"===s.type||"touchmove"===s.type;if(this.options.syncTouch&&o&&"touchstart"===s.type&&!this.isStopped&&!this.isLocked)return void this.reset();const l=0===i&&0===e,r="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===i;if(l||r)return;let h=s.composedPath();h=h.slice(0,h.indexOf(this.rootElement));const a=this.options.prevent;if(h.find((t=>{var i,e,s,l,r;return t instanceof HTMLElement&&("function"==typeof a&&(null==a?void 0:a(t))||(null===(i=t.hasAttribute)||void 0===i?void 0:i.call(t,"data-lenis-prevent"))||o&&(null===(e=t.hasAttribute)||void 0===e?void 0:e.call(t,"data-lenis-prevent-touch"))||n&&(null===(s=t.hasAttribute)||void 0===s?void 0:s.call(t,"data-lenis-prevent-wheel"))||(null===(l=t.classList)||void 0===l?void 0:l.contains("lenis"))&&!(null===(r=t.classList)||void 0===r?void 0:r.contains("lenis-stopped")))})))return;if(this.isStopped||this.isLocked)return void s.preventDefault();if(!(this.options.syncTouch&&o||this.options.smoothWheel&&n))return this.isScrolling="native",void this.animate.stop();s.preventDefault();let c=e;"both"===this.options.gestureOrientation?c=Math.abs(e)>Math.abs(i)?e:i:"horizontal"===this.options.gestureOrientation&&(c=i);const u=o&&this.options.syncTouch,d=o&&"touchend"===s.type&&Math.abs(c)>5;d&&(c=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+c,Object.assign({programmatic:!1},u?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(!1===this.isScrolling||"native"===this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isScrolling="native",this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout((()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()}),400))}},window.lenisVersion="1.1.13",t&&t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:i,eventsTarget:e,smoothWheel:s,syncTouch:o,syncTouchLerp:n,touchInertiaMultiplier:l,duration:r,easing:h,lerp:a,infinite:c,gestureOrientation:d,orientation:u,touchMultiplier:p,wheelMultiplier:m,autoResize:v,prevent:g,virtualScroll:S,__experimental__naiveDimensions:w},this.dimensions=new Dimensions(t,i,{autoResize:v}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new VirtualScroll(e,{touchMultiplier:p,wheelMultiplier:m}),this.virtualScroll.on("scroll",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName()}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.isStopped=!1,this.reset())}stop(){this.isStopped||(this.isStopped=!0,this.animate.stop(),this.reset())}raf(t){const i=t-(this.time||t);this.time=t,this.animate.advance(.001*i)}scrollTo(t,{offset:i=0,immediate:e=!1,lock:s=!1,duration:o=this.options.duration,easing:n=this.options.easing,lerp:l=this.options.lerp,onStart:r,onComplete:h,force:a=!1,programmatic:c=!0,userData:u}={}){if(!this.isStopped&&!this.isLocked||a){if("string"==typeof t&&["top","left","start"].includes(t))t=0;else if("string"==typeof t&&["bottom","right","end"].includes(t))t=this.limit;else{let e;if("string"==typeof t?e=document.querySelector(t):t instanceof HTMLElement&&(null==t?void 0:t.nodeType)&&(e=t),e){if(this.options.wrapper!==window){const t=this.rootElement.getBoundingClientRect();i-=this.isHorizontal?t.left:t.top}const s=e.getBoundingClientRect();t=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof t){if(t+=i,t=Math.round(t),this.options.infinite?c&&(this.targetScroll=this.animatedScroll=this.scroll):t=clamp(0,t,this.limit),t===this.targetScroll)return null==r||r(this),void(null==h||h(this));if(this.userData=null!=u?u:{},e)return this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),null==h||h(this),void(this.userData={});c||(this.targetScroll=t),this.animate.fromTo(this.animatedScroll,t,{duration:o,easing:n,lerp:l,onStart:()=>{s&&(this.isLocked=!0),this.isScrolling="smooth",null==r||r(this)},onUpdate:(t,i)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),c&&(this.targetScroll=t),i||this.emit(),i&&(this.reset(),this.emit(),null==h||h(this),this.userData={},this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame((()=>{this._preventNextNativeScrollEvent=!1}))}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?function modulo(t,i){return(t%i+i)%i}(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}}}));
/* El Alfy Holding — site motion and behaviour. No dependencies (Lenis optional).
   Seven motions from the Standard, all on the reader's scroll except M7:
   M1 [data-read]  words light 22% → 100% from 230 px to 560 px after the paragraph enters, 60 px a word
   M2 [data-pic]   frame opens from a 14% top clip, 48 px low, 15% → 100% (entry 0% → cover 32%); photo 108% → 100% over the pass
   M3 [data-cap]   14 px low, 0 → 1 (entry 40% → cover 28%)
   M4 .row > .txt  sticky, top 120 px (CSS)
   M5 [data-rule]  draws from the left (entry 0% → cover 30%)
   M6 header       84 → 64 px over the first 240 px of scroll
   M7 [data-m7]    opening headline, word by word, once on load
   Plus: tone (Onyx / Limestone) follows the section at mid-screen; filters; menu; project viewer; forms. */
(function () {
  var d = document.documentElement, W = window;
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var stat = /[?&]static\b/.test(location.search);
  var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !stat && !reduce && 'IntersectionObserver' in W;
  d.classList.add(motion ? 'js-motion' : 'html-static');
  var touch = W.matchMedia && matchMedia('(hover: none)').matches;

  /* ---------- menu ---------- */
  var pm = document.querySelector('.panel-menu'), mb = document.querySelector('.menu-btn');
  if (pm && mb) {
    var close = pm.querySelector('.close-btn');
    var set = function (o) { pm.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); document.body.classList.toggle('lock', o); if (o) close.focus(); else mb.focus(); };
    mb.addEventListener('click', function () { set(true); });
    close.addEventListener('click', function () { set(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && pm.classList.contains('open')) set(false); });
  }

  /* ---------- filters: .filters[data-for][data-key] buttons[data-v]; items carry data-<key> (space-separated) ---------- */
  q('.filters[data-for]').forEach(function (g) {
    var target = document.querySelector(g.getAttribute('data-for')), key = g.getAttribute('data-key');
    if (!target) return;
    target._f = target._f || {};
    q('button', g).forEach(function (b) {
      b.addEventListener('click', function () {
        q('button', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        target._f[key] = b.getAttribute('data-v');
        var shown = 0;
        q('[data-item]', target).forEach(function (it) {
          var ok = Object.keys(target._f).every(function (k) { var v = target._f[k]; return v === 'all' || (' ' + (it.getAttribute('data-' + k) || '') + ' ').indexOf(' ' + v + ' ') > -1; });
          it.hidden = !ok; if (ok) shown++;
        });
        var cnt = document.querySelector('[data-count-for="' + g.getAttribute('data-for') + '"]'); if (cnt) cnt.textContent = shown;
        var empty = target.querySelector('[data-empty]'); if (empty) empty.hidden = shown > 0;
        if (motion) requestAnimationFrame(run);
      });
    });
  });
  /* logo wall dims instead of hiding */
  q('.filters[data-dim]').forEach(function (g) {
    var wall = document.querySelector(g.getAttribute('data-dim'));
    q('button', g).forEach(function (b) { b.addEventListener('click', function () {
      q('button', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var v = b.getAttribute('data-v'); wall.classList.toggle('f', v !== 'all');
      q('.lg', wall).forEach(function (l) { l.classList.toggle('on', v === 'all' || l.getAttribute('data-g') === v); });
    }); });
  });

  /* ---------- brand panels ---------- */
  var pans = q('.bpanel');
  pans.forEach(function (p) { ['mouseenter', 'focus'].forEach(function (ev) { p.addEventListener(ev, function () { pans.forEach(function (x) { x.classList.toggle('open', x === p); }); }); }); });

  /* ---------- forms: no back end in this build; confirm in place ---------- */
  q('form[data-demo]').forEach(function (f) {
    q('.file input', f).forEach(function (inp) { inp.addEventListener('change', function () { var s = inp.closest('.file').querySelector('[data-fname]'); if (s) s.textContent = inp.files.length ? inp.files[0].name : s.getAttribute('data-empty'); }); });
    f.addEventListener('submit', function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } var ok = f.parentNode.querySelector('.form-ok'); if (ok) { f.hidden = true; ok.classList.add('on'); ok.focus(); } });
  });
  q('select[data-route]').forEach(function (s) {
    var out = document.querySelector(s.getAttribute('data-route'));
    var upd = function () { var o = s.options[s.selectedIndex]; out.textContent = o.getAttribute('data-to') || 'The group'; };
    s.addEventListener('change', upd); upd();
  });

  /* ---------- project viewer ---------- */
  var PJ = document.getElementById('pj-data'), ov = document.querySelector('.ov');
  if (PJ && ov) {
    var data = JSON.parse(PJ.textContent), order = Object.keys(data), cur = null, ci = 0, opener = null;
    var img = ov.querySelector('.stage img'), th = ov.querySelector('.thumbs');
    function show(i) { var p = data[cur]; ci = i; img.src = p.imgs[i][0]; img.alt = p.imgs[i][1]; q('button', th).forEach(function (b, k) { b.setAttribute('aria-current', k === i); }); }
    function open(id) {
      cur = id; var p = data[id];
      ov.querySelector('[data-k="label"]').textContent = p.division;
      ov.querySelector('[data-k="title"]').innerHTML = p.title;
      ov.querySelector('[data-k="text"]').textContent = p.text;
      ov.querySelector('[data-k="dl"]').innerHTML = p.facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>'; }).join('');
      th.innerHTML = p.imgs.length > 1 ? p.imgs.map(function (m, k) { return '<button type="button" aria-label="Picture ' + (k + 1) + '"><img src="' + m[0] + '" alt=""></button>'; }).join('') : '';
      q('button', th).forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
      show(0); ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); if (W.__lenis) W.__lenis.stop();
      ov.querySelector('.x').focus();
    }
    function shut() { ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); if (W.__lenis) W.__lenis.start(); if (opener) opener.focus(); }
    q('[data-open]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); opener = a; open(a.getAttribute('data-open')); }); });
    ov.querySelector('.x').addEventListener('click', shut);
    ov.querySelector('[data-k="prev"]').addEventListener('click', function () { var vis = order.filter(function (k) { var c = document.querySelector('[data-open="' + k + '"]'); return c && !c.closest('[hidden]'); }); var i = vis.indexOf(cur); open(vis[(i - 1 + vis.length) % vis.length]); });
    ov.querySelector('[data-k="next"]').addEventListener('click', function () { var vis = order.filter(function (k) { var c = document.querySelector('[data-open="' + k + '"]'); return c && !c.closest('[hidden]'); }); var i = vis.indexOf(cur); open(vis[(i + 1) % vis.length]); });
    var hh = location.hash.slice(1); if (data[hh]) setTimeout(function () { open(hh); }, 300);
    addEventListener('keydown', function (e) { if (!ov.classList.contains('open')) return; if (e.key === 'Escape') shut(); if (e.key === 'ArrowRight') show((ci + 1) % data[cur].imgs.length); if (e.key === 'ArrowLeft') show((ci - 1 + data[cur].imgs.length) % data[cur].imgs.length); });
  }

  /* ---------- map: arc lengths ---------- */
  q('.arc').forEach(function (p) { p.style.setProperty('--len', Math.ceil(p.getTotalLength())); });
  var fp = document.querySelector('[data-fp]'), lastK = -1;
  function setK(k) { if (!fp || k === lastK) return; lastK = k; q('[data-k]', fp).forEach(function (el) { el.classList.toggle('on', +el.getAttribute('data-k') <= k); }); var c = fp.querySelector('[data-cnt]'); if (c) c.textContent = ('0' + k).slice(-2); }
  function fpOff() { if (!fp) return true; var off = !motion || innerWidth < 900 || !fp.hasAttribute('data-pinmap'); fp.classList.toggle('pin-off', off); if (off) setK(6); return off; }
  fpOff();

  if (!motion) { document.querySelectorAll('img[loading="lazy"]').forEach(function () {}); return; }

  /* ---------- M7 opening headline ---------- */
  q('[data-m7]').forEach(function (el) {
    var i = 0;
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'w'; var x = document.createElement('span'); x.className = 'wi'; x.style.setProperty('--i', i++); x.textContent = w; o.appendChild(x); f.appendChild(o);
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    el.classList.add('m7');
  });

  /* ---------- M1 words ---------- */
  var reads = q('[data-read]').map(function (el) {
    var words = [];
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span'); s.className = 'rw'; s.textContent = w; words.push(s); f.appendChild(s);
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(el);
    return { el: el, words: words, last: -1 };
  });

  /* ---------- active set ---------- */
  var pics = q('[data-pic]').map(function (el) { return { el: el, fr: el.querySelector('.fr') || el, img: el.querySelector('img') }; });
  var caps = q('[data-cap]').map(function (el) { return { el: el }; });
  var rules = q('[data-rule]').map(function (el) { return { el: el }; });
  var all = [].concat(reads.map(function (r) { r.t = 'r'; return r; }), pics.map(function (r) { r.t = 'p'; return r; }), caps.map(function (r) { r.t = 'c'; return r; }), rules.map(function (r) { r.t = 'l'; return r; }));
  var byEl = new Map(); all.forEach(function (r) { byEl.set(r.el, r); r.on = true; });
  /* everything starts in its "before" state */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var r = byEl.get(e.target); if (r) r.on = e.isIntersecting; }); requestAnimationFrame(run); }, { rootMargin: '25% 0px 25% 0px' });
  all.forEach(function (r) { io.observe(r.el); });

  function apply(r, vh) {
    var b = r.el.getBoundingClientRect(), h = b.height, s = vh - b.top, p;
    if (r.t === 'r') {
      var n = r.words.length; if (!n) return;
      for (var i = 0; i < n; i++) {
        var a0 = 230 + 270 * i / n, o = clamp((s - a0) / 60, 0, 1);
        r.words[i].style.opacity = (0.22 + 0.78 * o).toFixed(3);
      }
    } else if (r.t === 'p') {
      p = clamp(s / (0.32 * (vh + h)), 0, 1);
      var z = clamp(s / (vh + h), 0, 1);
      r.fr.style.clipPath = 'inset(' + (14 * (1 - p)).toFixed(2) + '% 0 0 0)';
      r.fr.style.transform = 'translate3d(0,' + (48 * (1 - p)).toFixed(1) + 'px,0)';
      r.fr.style.opacity = (0.15 + 0.85 * p).toFixed(3);
      if (r.img) r.img.style.transform = 'scale(' + (1.08 - 0.08 * z).toFixed(4) + ')';
    } else if (r.t === 'c') {
      var st = 0.4 * Math.min(h, vh), en = 0.28 * (vh + h); if (en - st < 40) { st = 0; }
      p = clamp((s - st) / Math.max(40, en - st), 0, 1);
      r.el.style.opacity = p.toFixed(3); r.el.style.transform = 'translate3d(0,' + (14 * (1 - p)).toFixed(1) + 'px,0)';
    } else if (r.t === 'l') {
      p = clamp(s / (0.3 * (vh + h)), 0, 1); r.el.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }
  }

  /* ---------- page-specific scroll pieces ---------- */
  var tones = q('[data-tone]'), opening = document.querySelector('.opening'), xp = document.querySelector('.xp'), stack = q('[data-stack] > *');

  var ticking = false;
  function run() {
    ticking = false;
    var vh = innerHeight, y = scrollY;
    /* M6 */
    if (innerWidth > 860) d.style.setProperty('--hh', (84 - 20 * clamp(y / 240, 0, 1)).toFixed(1) + 'px'); else d.style.removeProperty('--hh');
    /* tone */
    var line = vh * 0.5, t = null;
    for (var i = 0; i < tones.length; i++) { var r = tones[i].getBoundingClientRect(); if (r.top <= line && r.bottom > line) t = tones[i].getAttribute('data-tone'); }
    if (t && d.getAttribute('data-tone') !== t) d.setAttribute('data-tone', t);
    /* elements */
    for (var k = 0; k < all.length; k++) if (all[k].on) apply(all[k], vh);
    /* hero hand-off */
    if (opening) opening.style.setProperty('--hp', clamp(y / vh, 0, 1).toFixed(4));
    /* stacked cards */
    stack.forEach(function (c, i) { var nx = stack[i + 1]; if (!nx) return; var tp = nx.getBoundingClientRect().top; c.style.setProperty('--c', clamp(1 - (tp - 120) / (vh - 120), 0, 1).toFixed(4)); });
    /* expanding project frame */
    if (xp) { var xr = xp.getBoundingClientRect(), xpP = clamp(-xr.top / Math.max(1, xp.offsetHeight - vh), 0, 1), e = clamp(xpP / 0.62, 0, 1); e = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2; xp.style.setProperty('--e', e.toFixed(4)); }
    /* countries */
    if (fp && !fp.classList.contains('pin-off')) { var fr = fp.getBoundingClientRect(), fpP = clamp(-fr.top / Math.max(1, fp.offsetHeight - vh), 0, 1); setK(Math.min(6, 1 + Math.floor(fpP * 6.4))); }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(run); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { fpOff(); req(); });

  /* smooth wheel on desktop only (Lenis, lerp 0.1); off on touch */
  if (W.Lenis && !touch) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    W.__lenis = lenis;
    lenis.on('scroll', req);
    (function raf(tm) { lenis.raf(tm); requestAnimationFrame(raf); })(performance.now());
    q('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function (e) { var h = a.getAttribute('href'); if (h.length < 2) return; var tg = document.querySelector(h); if (tg) { e.preventDefault(); lenis.scrollTo(tg, { offset: -80 }); } }); });
  }

  /* ---------- interactive hero: a lens shows the finished room over the raw block yard ---------- */
  var hero = document.querySelector('[data-hero]');
  if (hero && hero.querySelector('[data-reveal]')) (function () {
    var W2 = 0, H2 = 0, x = 0, y = 0, tx = 0, ty = 0, r = 0, last = -1e9, t0 = performance.now(), moved = false, vis = true;
    function size() { var b = hero.getBoundingClientRect(); W2 = b.width; H2 = b.height; }
    size(); addEventListener('resize', size);
    x = tx = W2 * .68; y = ty = H2 * .42;
    function at(e) { var b = hero.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; last = performance.now(); if (!moved) { moved = true; hero.classList.add('moved'); } }
    hero.addEventListener('pointermove', at);
    hero.addEventListener('pointerdown', at);
    var rooms = q('.reveal .top img', hero), ri = 0, lastSwap = performance.now(), room = hero.querySelector('[data-room]');
    function swap() { rooms[ri].classList.remove('on'); ri = (ri + 1) % rooms.length; rooms[ri].classList.add('on'); room.textContent = rooms[ri].getAttribute('data-t'); lastSwap = performance.now(); }
    hero.addEventListener('click', function (e) { if (e.target.closest('a,button')) return; swap(); });
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(hero);
    (function loop(now) {
      requestAnimationFrame(loop);
      if (!vis) return;
      var idle = now - last > 2600;
      if (idle && now - lastSwap > 6500 && rooms.length > 1) swap();
      if (idle) { var k = (now - t0) / 1000; tx = W2 * (.62 + .2 * Math.sin(k * .35)); ty = H2 * (.42 + .16 * Math.sin(k * .52 + 1.2)); }
      var e = idle ? .025 : .14; x += (tx - x) * e; y += (ty - y) * e;
      var hp = clamp(scrollY / innerHeight, 0, 1), intro = clamp((now - t0 - 500) / 1400, 0, 1); intro = 1 - Math.pow(1 - intro, 3);
      var base = Math.min(W2, H2) * (W2 < 700 ? .36 : .3), tr = base * intro + hp * Math.hypot(W2, H2) * 1.1;
      r += (tr - r) * .12;
      hero.style.setProperty('--x', x.toFixed(1) + 'px'); hero.style.setProperty('--y', y.toFixed(1) + 'px');
      hero.style.setProperty('--xp', x.toFixed(1) + 'px'); hero.style.setProperty('--yp', y.toFixed(1) + 'px');
      hero.style.setProperty('--r', r.toFixed(1) + 'px');
    })(t0);
  })();

  run();
  addEventListener('load', run);
  requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('loaded'); }); });
})();
