/* TAP intro — 開くたびにランダムで1つ再生（約3秒・タップでスキップ）
   使用素材: tap/intro/ （ロゴ＝TAP™ロゴを文字ごとに分解したPNG、カード＝実際のカードデータ・角丸）
   差し替え／追加: V 配列に { c:'dk|lt', ms:再生ms, img:[素材], h:HTML } を足すだけ。
   確認用: ?intro=1〜4 で指定表示 / ?intro=off で非表示 */
(function () {
  var q = location.search.match(/[?&]intro=([^&]+)/), force = q ? q[1] : null;
  if (force === 'off') return;
  if (!force) {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (location.hash.length > 1) return;
      if (document.referrer) {
        var u = new URL(document.referrer);
        if (u.host === location.host && /\/tap\//.test(u.pathname)) return;
      }
    } catch (e) { return; }
  }

  var P = 'intro/';
  function im(n, cls) { return '<img class="' + (cls || '') + '" src="' + P + n + '" alt="">'; }
  var LOGO = ['lt.png', 'la.png', 'lp.png', 'ltm.png', 'a1.png', 'a2.png', 'a3.png'];

  var V = [
    /* 1 ピッ — 波紋が広がり、TAPロゴが立ち上がって、波が鳴る（黒） */
    { c: 'dk', ms: 3400, img: LOGO, h:
      '<div class="v1"><i></i><i></i><i></i><u></u>' +
      '<div class="v1w"><div class="tl"><div class="tn">' + im('lt.png') + im('la.png') + im('lp.png') + im('ltm.png') + '</div>' +
      im('a1.png', 'ta a1') + im('a2.png', 'ta a2') + im('a3.png', 'ta a3') + '</div>' +
      '<small>つなぐ時間を、話す時間に。</small></div></div>' },
    /* 2 フリップ — 実際のカード（NO NAME面）が落ちてきて、裏返るとTAP面（白） */
    { c: 'lt', ms: 3600, img: ['c-noname.webp', 'c-tap.webp'], h:
      '<div class="v2"><div class="tf"><div class="tfr">' + im('c-noname.webp') + '</div>' +
      '<div class="tbk">' + im('c-tap.webp') + '</div></div></div>' },
    /* 3 ファン — 実際のカード5枚が扇状に広がる（白） */
    { c: 'lt', ms: 3600, img: ['c-yellow.webp', 'c-green.webp', 'c-pink.webp', 'c-grad.webp', 'c-tap.webp'], h:
      '<div class="v3">' +
      '<span style="--i:0;--r:-24deg;--x:-30%;--y:3%">' + im('c-yellow.webp') + '</span>' +
      '<span style="--i:1;--r:-12deg;--x:-15%;--y:1%">' + im('c-green.webp') + '</span>' +
      '<span style="--i:2;--r:12deg;--x:15%;--y:1%">' + im('c-pink.webp') + '</span>' +
      '<span style="--i:3;--r:24deg;--x:30%;--y:3%">' + im('c-grad.webp') + '</span>' +
      '<span class="ttop" style="--i:4;--r:0deg;--x:0%;--y:-2%">' + im('c-tap.webp') + '</span></div>' },
    /* 4 スライドイン — T・A・Pが3方向から入り、最後にTM・波が鳴る（黒） */
    { c: 'dk', ms: 3400, img: LOGO, h:
      '<div class="v4"><div class="tl">' + im('lt.png', 'l1') + im('la.png', 'l2') + im('lp.png', 'l3') +
      im('ltm.png', 'tm') + im('a1.png', 'ta a1') + im('a2.png', 'ta a2') + im('a3.png', 'ta a3') + '</div>' +
      '<small>アプリ不要。かざすだけで、つながる。</small></div>' }
  ];

  var n = V.length, i;
  if (force && /^[1-9]$/.test(force) && +force <= n) i = +force - 1;
  else {
    var last = -1;
    try { last = +localStorage.getItem('ti-last'); } catch (e) {}
    i = Math.floor(Math.random() * n);
    if (i === last && n > 1) i = (i + 1 + Math.floor(Math.random() * (n - 1))) % n;
    try { localStorage.setItem('ti-last', String(i)); } catch (e) {}
  }
  var v = V[i];

  var css = [
    '#ti{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:Arial,"Helvetica Neue",sans-serif;cursor:pointer;opacity:1;transition:opacity .5s ease;-webkit-tap-highlight-color:transparent}',
    '#ti.out{opacity:0;pointer-events:none}',
    '#ti.dk{background:#111;color:#fff}#ti.lt{background:#efefef;color:#111}',
    '#ti .sk{position:absolute;left:0;right:0;bottom:calc(22px + env(safe-area-inset-bottom,0px));text-align:center;font-size:10px;letter-spacing:.3em;opacity:0;animation:tiSk .5s ease .6s forwards}',
    '@keyframes tiSk{to{opacity:.45}}',
    '#ti small{font-family:"Yu Gothic","Hiragino Kaku Gothic ProN",sans-serif;font-size:12px;letter-spacing:.2em;opacity:0}',
    '#ti img{display:block;-webkit-user-drag:none;user-select:none;pointer-events:none}',
    '#ti .tl{position:relative;width:min(80vw,520px);aspect-ratio:2400/929}',
    '#ti .tl img,#ti .tn{position:absolute;left:0;top:0;width:100%;height:100%}',
    '#ti.dk .tl img{filter:invert(1)}',
    '#ti .ta{opacity:0}',
    '@keyframes tiArc{0%{opacity:0;transform:translateX(-14px) scale(.96)}60%{opacity:1}100%{opacity:1;transform:none}}',
    '@keyframes tiPop{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:scale(1)}}',
    '@keyframes tiUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:.8;transform:none}}',
    '.v1{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}',
    '.v1 i{position:absolute;left:50%;top:50%;width:30vmin;height:30vmin;margin:-15vmin 0 0 -15vmin;border:2px solid #fff;border-radius:50%;opacity:0;animation:tiRing 1.6s cubic-bezier(.2,.6,.3,1) forwards}',
    '.v1 i:nth-child(2){animation-delay:.22s}.v1 i:nth-child(3){animation-delay:.44s}',
    '.v1 u{position:absolute;left:50%;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;background:#fff;border-radius:50%;animation:tiDot 1.1s ease forwards}',
    '@keyframes tiRing{0%{transform:scale(.15);opacity:.95}100%{transform:scale(3.4);opacity:0}}',
    '@keyframes tiDot{0%{transform:scale(0)}25%{transform:scale(1.4)}60%{transform:scale(1)}100%{transform:scale(0);opacity:0}}',
    '.v1w{position:relative;display:flex;flex-direction:column;align-items:center;gap:18px}',
    '.v1 .tn{opacity:0;animation:tiPop .8s cubic-bezier(.2,1.3,.4,1) 1s forwards}',
    '.v1 .a1,.v1 .a2,.v1 .a3{animation:tiArc .5s ease forwards}.v1 .a1{animation-delay:1.65s}.v1 .a2{animation-delay:1.85s}.v1 .a3{animation-delay:2.05s}',
    '.v1w small{animation:tiUp .7s ease 2.35s forwards}',
    '.v2{perspective:1100px}',
    '.v2 .tf{position:relative;width:min(80vw,460px);aspect-ratio:900/568;transform-style:preserve-3d;animation:tiFlip 3.2s ease-in-out forwards}',
    '.v2 .tfr,.v2 .tbk{position:absolute;left:0;top:0;width:100%;height:100%}',
    '.v2 img{width:100%;height:100%;filter:drop-shadow(0 8px 22px rgba(0,0,0,.22))}',
    '.v2 .tfr{animation:tiFr 3.2s steps(1,end) forwards}.v2 .tbk{transform:rotateY(180deg);opacity:0;animation:tiBk 3.2s steps(1,end) forwards}',
    '@keyframes tiFr{0%{opacity:1}65%{opacity:0}100%{opacity:0}}@keyframes tiBk{0%{opacity:0}65%{opacity:1}100%{opacity:1}}',
    '@keyframes tiFlip{0%{transform:translateY(-115vh) rotate(-16deg) rotateY(0deg) scale(1)}28%{transform:translateY(0) rotate(0deg) rotateY(0deg) scale(1)}34%{transform:translateY(-28px) rotate(0deg) rotateY(0deg) scale(1)}40%{transform:translateY(0) rotate(0deg) rotateY(0deg) scale(1)}50%{transform:translateY(0) rotate(0deg) rotateY(0deg) scale(1)}80%{transform:translateY(0) rotate(0deg) rotateY(180deg) scale(1)}100%{transform:translateY(0) rotate(0deg) rotateY(180deg) scale(1.05)}}',
    '.v3{position:relative;width:min(52vw,300px);aspect-ratio:900/568}',
    '.v3 span{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transform:translateY(60vh) scale(.8);animation:tiFan 1s cubic-bezier(.2,.9,.3,1.08) forwards;animation-delay:calc(.1s + var(--i)*.2s)}',
    '.v3 img{width:100%;height:100%;filter:drop-shadow(0 6px 16px rgba(0,0,0,.22))}',
    '@keyframes tiFan{0%{opacity:0;transform:translateY(60vh) scale(.8) rotate(0)}100%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}',
    '.v4{display:flex;flex-direction:column;align-items:center;gap:20px}',
    '.v4 .l1,.v4 .l2,.v4 .l3,.v4 .tm{opacity:0}',
    '.v4 .l1{animation:tiL .8s cubic-bezier(.2,1.15,.4,1) .15s forwards}.v4 .l2{animation:tiT .8s cubic-bezier(.2,1.15,.4,1) .45s forwards}.v4 .l3{animation:tiR .8s cubic-bezier(.2,1.15,.4,1) .75s forwards}',
    '.v4 .tm{animation:tiPop .5s cubic-bezier(.2,1.3,.4,1) 1.6s forwards}',
    '.v4 .a1,.v4 .a2,.v4 .a3{animation:tiArc .5s ease forwards}.v4 .a1{animation-delay:1.85s}.v4 .a2{animation-delay:2.05s}.v4 .a3{animation-delay:2.25s}',
    '.v4 small{animation:tiUp .7s ease 2.5s forwards}',
    '@keyframes tiL{0%{opacity:0;transform:translateX(-70vw)}100%{opacity:1;transform:none}}',
    '@keyframes tiT{0%{opacity:0;transform:translateY(-70vh)}100%{opacity:1;transform:none}}',
    '@keyframes tiR{0%{opacity:0;transform:translateX(70vw)}100%{opacity:1;transform:none}}'
  ].join('');

  var st = document.createElement('style');
  st.id = 'ti-css';
  st.appendChild(document.createTextNode(css));
  document.head.appendChild(st);

  var el = document.createElement('div');
  el.id = 'ti';
  el.className = v.c;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="sk">TAP TO SKIP</div>';
  document.body.insertBefore(el, document.body.firstChild);
  document.documentElement.style.overflow = 'hidden';

  var done = false, started = false;
  function end() {
    if (done) return;
    done = true;
    el.classList.add('out');
    document.documentElement.style.overflow = '';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (st.parentNode) st.parentNode.removeChild(st);
    }, 560);
  }
  el.addEventListener('click', end);
  el.addEventListener('touchstart', end, { passive: true });

  /* 素材を読み込んでから再生開始（画像の読み込み待ちで、途中から始まらないように） */
  function start() {
    if (started || done) return;
    started = true;
    el.insertAdjacentHTML('afterbegin', v.h);
    setTimeout(end, v.ms);
  }
  var left = v.img.length;
  if (!left) start();
  v.img.forEach(function (f) {
    var t = new Image();
    t.onload = t.onerror = function () { if (--left === 0) start(); };
    t.src = P + f;
  });
  setTimeout(start, 1800);   /* 読み込みが遅い場合も、1.8秒で開始 */
  setTimeout(end, 6500);     /* 安全装置 */
})();
