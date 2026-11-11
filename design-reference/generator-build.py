# AegisKoncept website prototype v2: big hero slider, plain-English copy, brand-made visuals, smooth page changes.
import os
OUT = os.path.join(os.path.dirname(__file__), "index.html")

ARCH_O = "M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
WA = "https://wa.me/917303468073"

def mark(size=26, fill="var(--lime)"):
    return f'<svg viewBox="0 0 100 110" width="{size}" height="{int(size*1.1)}" aria-hidden="true"><path d="{ARCH_O}" fill="{fill}"/></svg>'

CSS = r"""
/* Layout: full-bleed colour bands over a 1248px well; the Arch is the only curve on the site */
:root{
 --ink:#191919;--cream:#F4F0E8;--lime:#D3E45B;--lime-2:#E2EE85;--graphite:#77716A;--white:#FFFFFF;
 --panel:#2A2826;--panel-2:#211F1E;--mute-l:#5C5750;--mute-d:#ABA59C;--line-l:#D9D3C8;--line-d:#363431;--paper:#E9E3D8;--err:#A3261F;
 --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
 --sans:'Inter Tight',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
 --gut:max(20px,min(6.6vw,96px));
 --ease:cubic-bezier(.22,.8,.2,1);--ease-ui:cubic-bezier(.2,0,0,1);
 color-scheme:light;
}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:var(--ink)}
a{color:inherit}
h1,h2,h3,h4,p,ul,ol,figure,blockquote{margin:0}
img,svg{max-width:100%}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.dk :focus-visible,.site-h :focus-visible,.site-f :focus-visible,.hero :focus-visible{outline-color:var(--cream)}
.skip{position:absolute;left:-9999px;top:8px;z-index:100;background:var(--lime);color:var(--ink);padding:10px 14px;font-weight:600}
.skip:focus{left:8px}
.dk{background:var(--ink);color:var(--cream)}
.cr{background:var(--cream);color:var(--ink)}
.wh{background:var(--white);color:var(--ink)}
.lm{background:var(--lime);color:var(--ink)}
.in{max-width:1440px;margin:0 auto;padding-left:max(var(--gut),env(safe-area-inset-left,0px));padding-right:max(var(--gut),env(safe-area-inset-right,0px))}
.sec{padding-block:clamp(72px,10vw,136px)}
.sec-s{padding-block:clamp(40px,6vw,72px)}
.stack{display:flex;flex-direction:column}
.cols{display:grid;gap:24px}
.c2{grid-template-columns:repeat(2,minmax(0,1fr))}.c3{grid-template-columns:repeat(3,minmax(0,1fr))}.c4{grid-template-columns:repeat(4,minmax(0,1fr))}
.split{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,5vw,80px);align-items:start}
.split-r{display:grid;grid-template-columns:7fr 5fr;gap:clamp(32px,5vw,80px);align-items:center}
.split>*,.split-r>*,.cols>*{min-width:0}

.sf{font-family:var(--serif);font-weight:400;letter-spacing:-.015em;text-wrap:balance}
.d1{font-size:clamp(54px,8vw,120px);line-height:.92}
.h1{font-size:clamp(44px,6vw,88px);line-height:.96}
.h2{font-size:clamp(38px,4.4vw,64px);line-height:1}
.h3{font-size:clamp(26px,2.5vw,36px);line-height:1.08}
.h4{font-size:clamp(22px,1.8vw,26px);line-height:1.12}
.ld{font-size:clamp(18px,1.45vw,21px);line-height:1.55;max-width:34em}
.sm{font-size:15px}.xs{font-size:13px}
.lbl{font-size:14px;font-weight:600;color:var(--mute-l)}
.dk .lbl{color:var(--lime)}
.mu{color:var(--mute-l)}.dk .mu{color:var(--mute-d)}
.tab{font-variant-numeric:tabular-nums}
.measure{max-width:62ch}
.hl{color:var(--lime)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:0 28px;font:600 16px/1 var(--sans);text-decoration:none;border:1px solid transparent;cursor:pointer;transition:background .2s var(--ease-ui),color .2s var(--ease-ui),transform .25s var(--ease);white-space:nowrap}
.btn:hover{transform:translateY(-2px)}
.b-l{background:var(--lime);color:var(--ink)}.b-l:hover{background:var(--lime-2)}
.b-d{background:var(--ink);color:var(--cream)}.b-d:hover{background:#2F2D2B}
.b-o{border-color:currentColor;color:inherit;background:transparent}.b-o:hover{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.dk .b-o:hover,.hero .b-o:hover{background:var(--cream);color:var(--ink);border-color:var(--cream)}
.tl{font-weight:600;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;width:fit-content}
.tl:hover{color:var(--mute-l)}.dk .tl:hover{color:var(--lime)}
.arr::after{content:" →"}
.row-btn{display:flex;flex-wrap:wrap;gap:12px}
.chip{display:inline-flex;align-items:center;min-height:34px;padding:0 14px;border:1px solid var(--line-l);font-size:14px;font-weight:500;text-decoration:none;background:transparent;color:inherit;cursor:pointer}
.dk .chip{border-color:var(--line-d)}
.chip.on,.chip[aria-pressed="true"]{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.dk .chip.on,.dk .chip[aria-pressed="true"]{background:var(--cream);color:var(--ink);border-color:var(--cream)}
.tag{display:inline-flex;align-items:center;height:28px;padding:0 10px;background:var(--lime);color:var(--ink);font:600 12px var(--sans);letter-spacing:0;align-self:flex-start}

/* ---------- brand-made visuals ---------- */
.stage{position:relative;background:var(--panel);overflow:hidden;display:flex;align-items:center;justify-content:center}
.stage.lt{background:var(--paper)}
.stage .glow{position:absolute;width:70%;aspect-ratio:10/11;left:15%;bottom:-20%;clip-path:url(#arch-clip);background:var(--panel-2)}
.stage.lt .glow{background:#DDD6C9}
.phone{position:relative;width:min(46%,230px);aspect-ratio:9/18.5;background:var(--ink);border:6px solid #0F0F0F;border-radius:28px;box-shadow:0 40px 80px -30px rgba(0,0,0,.65);overflow:hidden;display:flex;flex-direction:column;color:var(--cream);font-size:10px}
.phone .top{display:flex;align-items:center;gap:8px;padding:14px 10px 8px}
.av{width:26px;height:26px;border-radius:50%;background:var(--lime);flex:none;display:grid;place-items:center;color:var(--ink);font-weight:700;font-size:10px}
.phone .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:0 2px}
.phone .grid i{aspect-ratio:4/5;display:block;position:relative}
.phone .grid i.r::after{content:"▶";position:absolute;right:4px;top:3px;font-size:7px;font-style:normal;opacity:.8}
.t1{background:var(--cream)}.t2{background:var(--graphite)}.t3{background:var(--lime)}.t4{background:#3A3734}.t5{background:#C9C1B3}
i.t1,i.t2,i.t3,i.t4,i.t5{display:block}
.phone .nums{display:flex;justify-content:space-around;padding:6px 0 10px;text-align:center;line-height:1.2}
.phone .nums b{display:block;font-size:11px}
.lap{position:relative;width:80%;background:var(--cream);color:var(--ink);box-shadow:0 40px 80px -30px rgba(0,0,0,.6);font-size:10px}
.lap .bar{display:flex;gap:5px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--line-l);color:var(--mute-l)}
.lap .bar i{width:7px;height:7px;border-radius:50%;background:var(--line-l)}
.lap .bar span{margin-left:8px;background:var(--white);padding:2px 10px;flex:1}
.lap .pg{display:grid;grid-template-columns:1.2fr 1fr;gap:12px;padding:18px}
.lap .hd{font-family:var(--serif);font-size:clamp(16px,2vw,26px);line-height:1}
.sk{background:var(--line-l);height:7px;margin-top:7px}
.ad{position:absolute;width:min(44%,220px);background:var(--white);color:var(--ink);font-size:10px;box-shadow:0 30px 60px -25px rgba(0,0,0,.55)}
.ad .h{display:flex;gap:7px;align-items:center;padding:8px}
.ad .img{aspect-ratio:1;background:var(--ink);display:grid;place-items:center;color:var(--lime);font-family:var(--serif);font-size:clamp(18px,2vw,28px);text-align:center;padding:12px;line-height:1}
.ad .cta{display:flex;justify-content:space-between;padding:8px;background:#F1EEE8;font-weight:600}
.chat{position:absolute;width:min(56%,290px);display:flex;flex-direction:column;gap:6px;font-size:11px;line-height:1.35}
.bub{max-width:88%;padding:9px 11px}
.bub.i{background:var(--white);color:var(--ink);align-self:flex-start}
.bub.o{background:var(--lime);color:var(--ink);align-self:flex-end}
.serp{position:absolute;width:min(62%,320px);background:var(--white);color:var(--ink);padding:12px;font-size:10px;display:flex;flex-direction:column;gap:9px;box-shadow:0 30px 60px -25px rgba(0,0,0,.55)}
.serp .q{border:1px solid var(--line-l);padding:7px 10px;border-radius:20px}
.serp b{display:block;font-size:11px}
.serp .top{border-left:3px solid var(--lime);padding-left:8px}
.pin{position:absolute;left:50%;top:46%;transform:translate(-50%,-100%)}
.cal{position:relative;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:74%}
.cal span{aspect-ratio:1;font-size:8px;padding:3px;overflow:hidden}
.cover{position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:22px;background:var(--ink);color:var(--cream)}
.cover .w{font-family:var(--serif);font-size:clamp(30px,3.6vw,60px);line-height:.92;position:relative;max-width:70%}
.cover svg{position:absolute;right:-4%;bottom:-6%;width:44%}
.cover.l{background:var(--lime);color:var(--ink)}
.cover.c{background:var(--paper);color:var(--ink)}
.mono{display:grid;place-items:center;background:var(--graphite);color:var(--cream);font-family:var(--serif);font-size:clamp(64px,8vw,120px);aspect-ratio:4/5;width:100%}
.r169{aspect-ratio:16/9}.r43{aspect-ratio:4/3}.r54{aspect-ratio:5/4}.r11{aspect-ratio:1}.rarch{aspect-ratio:10/11;clip-path:url(#arch-clip)}
.r169,.r43,.r54,.r11,.rarch{width:100%;max-width:100%}

/* ---------- header ---------- */
.site-h{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;background:rgba(25,25,25,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:var(--cream);border-bottom:1px solid var(--line-d);transition:transform .35s var(--ease)}
.site-h.hide{transform:translateY(-100%)}
.site-h .in{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:76px}
.logo{display:flex;align-items:center;gap:12px;text-decoration:none}
.logo .sf{font-size:28px;line-height:1}
.nav{display:flex;align-items:center;gap:30px;font-size:16px}
.nav>a,.nav .dd>button{text-decoration:none;background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:6px 0;border-bottom:1px solid transparent}
.nav a[aria-current="page"],.nav .dd.cur>button{border-bottom-color:var(--lime)}
.nav>a:hover,.nav .dd>button:hover{color:var(--lime)}
.dd{position:relative}
@keyframes drop{from{opacity:0;transform:translate(-36%,-6px)}to{opacity:1;transform:translateX(-36%)}}
.h-cta{display:flex;align-items:center;gap:12px}
.burger{display:none;background:none;border:1px solid var(--line-d);color:var(--cream);min-height:44px;min-width:44px;font:600 14px var(--sans);cursor:pointer;padding:0 14px}
.mnav{display:none}

/* ---------- HERO: big, moving slider ---------- */
.hero{position:relative;overflow:hidden;background:var(--ink);color:var(--cream);min-height:clamp(660px,calc(100svh - 76px),960px);display:flex;flex-direction:column;isolation:isolate}
.hero .bgnum{position:absolute;right:28vw;top:50%;transform:translateY(-54%);font-family:var(--serif);font-size:clamp(280px,44vw,680px);line-height:.8;color:transparent;-webkit-text-stroke:1px #34312E;pointer-events:none;z-index:-1;transition:opacity .5s var(--ease)}
.hero .spot{position:absolute;inset:0;z-index:-1;background:radial-gradient(700px circle at var(--mx,72%) var(--my,45%),rgba(211,228,91,.08),transparent 60%);pointer-events:none}
.hero .stagew{flex:1;display:grid;position:relative}
.hgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,400px);gap:clamp(28px,4vw,64px);align-items:center;width:100%;flex:1;padding-block:clamp(28px,4vh,56px) 0}
.hleft{display:flex;flex-direction:column;min-width:0}
.h1s{font:600 14px var(--sans);letter-spacing:.02em;color:var(--mute-d);display:flex;align-items:center;gap:10px}
.h1s::before{content:"";width:8px;height:9px;background:var(--lime);clip-path:url(#arch-clip)}
.hform{position:relative;z-index:4;background:var(--cream);color:var(--ink);padding:clamp(22px,2.2vw,32px);display:flex;flex-direction:column;gap:12px;box-shadow:0 40px 80px -30px rgba(0,0,0,.7);border-top:4px solid var(--lime)}
.hform .fld{font-size:14px}.hform .fld input,.hform .fld select{min-height:50px;background:var(--white)}
.hs{grid-area:1/1;display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(16px,2.4vw,40px);align-items:center;padding-block:clamp(28px,4vh,48px) 24px;pointer-events:none}
.hs.on{pointer-events:auto}
.hs .txt{display:flex;flex-direction:column;gap:28px;position:relative;z-index:2}
.hs .kick{display:flex;align-items:center;gap:12px;font-size:15px;font-weight:600;color:var(--lime)}
.hs .kick::before{content:"";width:32px;height:1px;background:var(--lime)}
.hs h1,.hs .h{font-family:var(--serif);font-weight:400;font-size:clamp(58px,7.6vw,128px);line-height:.92;letter-spacing:-.025em}
.hs .ln{display:block;overflow:hidden;padding-bottom:.07em}
.hs .ln>span{display:block;transform:translateY(108%);transition:transform 1.05s var(--ease)}
.hs.on .ln>span{transform:none}
.hs.on .ln:nth-child(2)>span{transition-delay:.09s}.hs.on .ln:nth-child(3)>span{transition-delay:.18s}
.hs .sub,.hs .row-btn,.hs .kick{opacity:0;transform:translateY(18px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.hs.on .sub,.hs.on .row-btn,.hs.on .kick{opacity:1;transform:none;transition-delay:.3s}
.hs .sub{font-size:clamp(18px,1.5vw,22px);line-height:1.5;max-width:30em;color:#DCD6CC}
.hs .art{position:relative;justify-self:center;width:min(100%,340px);aspect-ratio:10/11;clip-path:inset(100% 0 0 0);transition:clip-path 1.15s var(--ease)}
.hs.on .art{clip-path:inset(-20px -20px -20px -20px)}
.hs:not(.on) .art{transition-duration:.5s}
.hs .art .in-arch{position:absolute;inset:0;clip-path:url(#arch-clip);background:var(--panel);overflow:hidden}
.hs .art .par{position:absolute;inset:-4%;display:flex;align-items:center;justify-content:center;transform:translate(var(--px,0px),var(--py,0px));transition:transform .9s var(--ease)}
.hs .art .par>*{transition:scale 1.4s var(--ease)}
.hs:not(.on) .art .par>*{scale:1.12}
.hs .art .ring{position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);pointer-events:none}
.hs .art .ring path{stroke-dasharray:400;stroke-dashoffset:400;transition:stroke-dashoffset 1.6s var(--ease) .3s}
.hs.on .art .ring path{stroke-dashoffset:0}
.hero:not(.js) .hs:first-child .ln>span,.hero:not(.js) .hs:first-child .sub,.hero:not(.js) .hs:first-child .row-btn,.hero:not(.js) .hs:first-child .kick{transform:none;opacity:1}
.hero:not(.js) .hs:first-child .art{clip-path:none}
.hero:not(.js) .hs:first-child .ring path{stroke-dashoffset:0}
.hero:not(.js) .hs:not(:first-child){visibility:hidden}
.hbar{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;gap:0 14px;align-items:end;padding-bottom:28px;position:relative;z-index:3}
.hbar button.t{background:none;border:0;color:var(--mute-d);font:500 14px var(--sans);text-align:left;padding:16px 0 0;cursor:pointer;position:relative;display:flex;gap:10px;align-items:baseline}
.hbar button.t b{font-family:var(--serif);font-weight:400;font-size:22px;color:var(--cream);opacity:.45}
.hbar button.t::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--line-d)}
.hbar button.t::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--lime);transform:scaleX(0);transform-origin:left}
.hbar button.t[aria-selected="true"]{color:var(--cream)}
.hbar button.t[aria-selected="true"] b{opacity:1;color:var(--lime)}
.hero.play .hbar button.t[aria-selected="true"]::after{animation:prog 7s linear forwards}
.hero.paused .hbar button.t[aria-selected="true"]::after{animation-play-state:paused}
.hero:not(.play) .hbar button.t[aria-selected="true"]::after{transform:scaleX(1)}
.hbar .ctl{display:flex;gap:8px}
.hbar .ctl button{width:48px;height:48px;border:1px solid var(--line-d);background:none;color:var(--cream);cursor:pointer;font:600 16px var(--sans);transition:border-color .2s,background .2s,color .2s}
.hbar .ctl button:hover{border-color:var(--lime);background:var(--lime);color:var(--ink)}
@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}

/* ---------- rows, lists ---------- */
.svc-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) 150px 48px;gap:32px;align-items:center;padding:34px 0;border-top:1px solid var(--line-l);text-decoration:none}
.svc-row:last-child{border-bottom:1px solid var(--line-l)}
.svc-row .thumb{width:150px;opacity:0;transform:translateY(10px) rotate(-3deg);transition:opacity .4s var(--ease),transform .4s var(--ease)}
.svc-row:hover .thumb,.svc-row:focus-visible .thumb{opacity:1;transform:none}
.svc-row .go{width:48px;height:48px;border:1px solid var(--ink);display:grid;place-items:center;transition:background .25s,color .25s}
.svc-row:hover .go{background:var(--ink);color:var(--lime)}
.ind-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line-d)}
.ind-list>*{padding:20px 20px 20px 0;border-bottom:1px solid var(--line-d);display:flex;justify-content:space-between;gap:12px;text-decoration:none}
.ind-list a:hover{color:var(--lime)}
.ind-list .off{color:var(--mute-d)}
.step{display:grid;grid-template-columns:64px minmax(0,1fr);gap:20px;padding:28px 0;border-top:1px solid var(--line-l)}
.step .n{font-family:var(--serif);font-size:40px;line-height:1}
.tick{display:grid;grid-template-columns:28px minmax(0,1fr);gap:14px;padding:18px 0;border-top:1px solid var(--line-l)}
.dk .tick{border-color:var(--line-d)}
.tick>span:first-child{width:18px;height:20px;margin-top:4px;background:var(--ink);clip-path:url(#arch-clip)}
.dk .tick>span:first-child{background:var(--lime)}
.faq details{border-top:1px solid var(--line-l)}
.faq details:last-child{border-bottom:1px solid var(--line-l)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:24px;padding:22px 0;font-weight:600;font-size:19px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-family:var(--serif);font-size:32px;line-height:.8;font-weight:400;transition:transform .3s var(--ease)}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq details p{padding:0 0 24px;max-width:62ch;color:var(--mute-l)}
.crumb{font-size:14px;display:flex;flex-wrap:wrap;gap:8px}
.crumb a{text-decoration:none}.crumb a:hover{text-decoration:underline}
.crumb span[aria-hidden]{opacity:.5}
.case{display:flex;flex-direction:column;gap:14px;text-decoration:none}
.case .stage,.case .cover{transition:transform .5s var(--ease)}
.case:hover .stage,.case:hover .cover{transform:scale(.985)}
.case:hover .sf{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
.art-row{display:grid;grid-template-columns:220px minmax(0,1fr) 120px;gap:32px;align-items:center;padding:24px 0;border-top:1px solid var(--line-l);text-decoration:none}
.art-row:hover .sf{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
.tbl{overflow-x:auto}
.tbl table{width:100%;border-collapse:collapse;font-size:16px;min-width:480px}
.tbl th,.tbl td{text-align:left;padding:14px 16px 14px 0;border-top:1px solid var(--line-l);vertical-align:top}
.tbl th{font-weight:600;border-top:2px solid var(--ink)}
.big-quote{font-family:var(--serif);font-size:clamp(30px,3.4vw,50px);line-height:1.12}
.marq{overflow:hidden;white-space:nowrap;border-block:1px solid var(--line-d)}
.marq>div{display:inline-flex;padding:22px 0;animation:marq 40s linear infinite}
.marq span{font-family:var(--serif);font-size:clamp(30px,3vw,44px);padding-right:56px}
.marq span i{font-style:normal;color:var(--lime);margin-right:56px}
@keyframes marq{to{transform:translateX(-50%)}}
.logos{overflow:hidden}
.marq.lg{border:0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marq.lg>div{align-items:center;padding:30px 0 42px;animation-duration:45s}
.marq.lg:hover>div{animation-play-state:paused}
.lgi{display:inline-flex;align-items:center;justify-content:center;padding:0 clamp(32px,4vw,64px);height:80px}
.lgi img{display:block;width:auto;max-width:none;opacity:.72;transition:opacity .3s,transform .4s var(--ease)}
.lgi:hover img{opacity:1;transform:scale(1.06)}

/* forms */
.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.form .full{grid-column:1/-1}
.fld{display:flex;flex-direction:column;gap:6px;font-size:15px;font-weight:600}
.fld input,.fld select,.fld textarea{font:400 16px var(--sans);min-height:54px;padding:12px 14px;border:1px solid var(--ink);background:var(--white);color:var(--ink);border-radius:0;width:100%}
.fld textarea{min-height:120px;resize:vertical}
.dk .fld input,.dk .fld select,.dk .fld textarea{background:var(--panel-2);color:var(--cream);border-color:var(--line-d)}
.fld .err{color:var(--err);font-weight:500;font-size:14px;display:none}
.dk .fld .err{color:#FF9A8F}
.fld.bad input,.fld.bad select,.fld.bad textarea{border:2px solid var(--err)}
.fld.bad .err{display:block}
.note{font-size:14px;color:var(--mute-l)}
.dk .note{color:var(--mute-d)}

/* article */
.prose{font-size:19px;line-height:1.75;max-width:680px}
.prose>*+*{margin-top:22px}
.prose h2{font-family:var(--serif);font-weight:400;font-size:38px;line-height:1.1;margin-top:52px}
.prose ul{padding-left:22px}
.prose .take{background:var(--white);border-left:3px solid var(--lime);padding:20px 22px;font-size:17px}
.prose blockquote{font-family:var(--serif);font-size:32px;line-height:1.2}
.toc{position:sticky;top:110px;display:flex;flex-direction:column;gap:10px;font-size:15px}
.toc a{text-decoration:none;color:var(--mute-l);padding-left:12px;border-left:2px solid transparent}
.toc a.cur{color:var(--ink);border-left-color:var(--ink)}

/* footer */
.site-f{background:var(--ink);color:var(--cream)}
.site-f .big{font-family:var(--serif);font-size:clamp(64px,12vw,200px);line-height:.86;letter-spacing:-.03em;padding-block:80px 48px;display:block;text-decoration:none}
.site-f .big span{color:var(--lime)}
.site-f .big:hover span{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:12px}
.site-f .grid{display:grid;grid-template-columns:2fr repeat(4,minmax(0,1fr));gap:32px;padding-block:40px 56px;border-top:1px solid var(--line-d)}
.site-f h4{font-size:14px;font-weight:600;color:var(--lime);margin-bottom:16px}
.site-f ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;font-size:16px}
.site-f a{text-decoration:none}.site-f a:hover{color:var(--lime)}
.site-f .base{display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;padding-block:24px;border-top:1px solid var(--line-d);font-size:14px;color:var(--mute-d)}
.wa-bar{display:none}

/* ---------- pages + smooth transitions ---------- */
[data-page]{display:none}
[data-page].cur{display:block}
.pbar{position:fixed;left:0;top:env(safe-area-inset-top,0px);height:2px;width:100%;background:var(--lime);transform:scaleX(0);transform-origin:left;z-index:90;pointer-events:none;opacity:0}
.pbar.run{animation:pbar .8s var(--ease) forwards}
@keyframes pbar{0%{opacity:1;transform:scaleX(0)}70%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1)}}
main.leave{animation:pleave .22s var(--ease-ui) forwards}
main.enter{animation:penter .65s var(--ease) both}
@keyframes pleave{to{opacity:0;transform:translateY(-10px);filter:blur(4px)}}
@keyframes penter{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
::view-transition-old(root){animation:.28s var(--ease-ui) both vt-out}
::view-transition-new(root){animation:.7s var(--ease) both vt-in}
@keyframes vt-out{to{opacity:0;transform:translateY(-14px);filter:blur(5px)}}
@keyframes vt-in{from{opacity:0;transform:translateY(36px)}}
.rv{transition:opacity .9s var(--ease),transform .9s var(--ease)}
.rv.pre{opacity:0;transform:translateY(36px)}
.pill-word{font-family:var(--serif);font-size:clamp(60px,8.4vw,128px);line-height:.95;color:var(--cream);transition:color .8s var(--ease)}
.pill-word.lime{color:var(--lime)}
.pill-word.pre{color:transparent;-webkit-text-stroke:1px var(--graphite)}
.arch-draw path{stroke-dasharray:720;stroke-dashoffset:0;transition:stroke-dashoffset 1.8s var(--ease)}
.arch-draw.pre path{stroke-dashoffset:720}

/* ---------- standout layer: cursor, curtain, scroll effects ---------- */
.sprog{position:fixed;left:0;top:env(safe-area-inset-top,0px);height:3px;width:100%;background:var(--lime);transform:scaleX(0);transform-origin:left;z-index:70;pointer-events:none}
.grain{position:fixed;inset:0;z-index:240;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.cur{display:none}
@media (pointer:fine){
 html.cur-on,html.cur-on a,html.cur-on button,html.cur-on summary,html.cur-on label{cursor:none}
 html.cur-on input,html.cur-on select,html.cur-on textarea{cursor:auto}
 .cur{display:block}
 .cur-dot,.cur-ring{position:fixed;left:0;top:0;z-index:300;pointer-events:none;will-change:transform}
 .cur-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:#fff;border-radius:50%;mix-blend-mode:difference;transition:opacity .2s}
 .cur-ring{width:30px;height:33px;margin:-17px 0 0 -15px;mix-blend-mode:difference;display:grid;place-items:center;transition:width .35s var(--ease),height .35s var(--ease),margin .35s var(--ease),opacity .2s}
 .cur-ring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
 .cur-ring path{fill:transparent;stroke:#fff;stroke-width:1.4;transition:fill .3s,stroke .3s}
 .cur-ring span{position:relative;font:600 14px var(--sans);color:var(--ink);opacity:0;transition:opacity .2s;padding-top:18%}
 html.cur-link .cur-ring{width:56px;height:62px;margin:-31px 0 0 -28px}
 html.cur-link .cur-ring path{fill:#fff}
 html.cur-view .cur-ring{width:104px;height:114px;margin:-57px 0 0 -52px;mix-blend-mode:normal}
 html.cur-view .cur-ring path{fill:var(--lime);stroke:var(--lime)}
 html.cur-view .cur-ring span{opacity:1}
 html.cur-view .cur-dot,html.cur-field .cur-ring,html.cur-field .cur-dot,html.cur-out .cur-ring,html.cur-out .cur-dot{opacity:0}
}
.btn,.go,.hbar .ctl button{transition:background .2s var(--ease-ui),color .2s var(--ease-ui),transform .25s var(--ease),translate .45s var(--ease)}
.case{perspective:1100px}
.case .stage{transition:transform .5s var(--ease),rotate .6s var(--ease),clip-path 1.3s var(--ease)}
.stage.cl-pre{clip-path:inset(16% 8% 16% 8%)}
.stage>*{transition:translate .2s linear}
/* words rising into place */
.wm{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.wi{display:inline-block;transition:transform 1s var(--ease)}
.wr-pre .wi{transform:translateY(108%)}
/* scroll-lit manifesto */
.scrub{font-size:clamp(40px,5.4vw,88px);line-height:1.06;letter-spacing:-.02em;max-width:17em}
.scrub em{font-style:normal}
.scrub .sw{color:#3A3734;transition:color .35s var(--ease)}
.scrub .sw.lit{color:var(--cream)}
.scrub em .sw.lit{color:var(--lime)}
/* pinned horizontal work */
.hpin{position:relative}
.pin-in{position:sticky;top:76px;height:calc(100vh - 76px);min-height:620px;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,4vh,48px);overflow:hidden}
.pin-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:24px;width:100%}
.track{display:flex;gap:32px;padding-left:max(var(--gut),calc((100vw - 1440px)/2 + var(--gut)));padding-right:var(--gut);will-change:transform;width:max-content}
.wcard{width:clamp(300px,34vw,520px);flex:none}
.wcard .stage{aspect-ratio:4/3}
.wend{display:flex;flex-direction:column;justify-content:space-between;background:var(--lime);color:var(--ink);padding:36px;text-decoration:none;align-self:stretch;max-height:min(60vh,520px)}
.wend .go{border-color:var(--ink)}
.pin-bar{height:2px;background:var(--line-d);position:relative}
.pin-bar span{position:absolute;inset:0;background:var(--lime);transform:scaleX(0);transform-origin:left}
/* page curtain */
.curtain{position:fixed;left:0;right:0;top:0;height:140vh;z-index:95;pointer-events:none;transform:translateY(105vh);visibility:hidden;display:flex;flex-direction:column}
.curtain .dome{height:35vh;width:100%;display:block;margin-bottom:-1px}
.curtain .cbody{flex:1;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:38vh;gap:20px;color:var(--cream)}
.curtain .ctitle{font-size:clamp(46px,6.4vw,104px);line-height:1;text-align:center;padding:0 20px}
.curtain.go{visibility:visible;animation:curt 1.2s cubic-bezier(.76,0,.24,1) forwards}
@keyframes curt{0%{transform:translateY(105vh)}42%{transform:translateY(-35vh)}58%{transform:translateY(-35vh)}100%{transform:translateY(-145vh)}}
.curtain .cbody>*{opacity:0}
.curtain.go .cbody>*{animation:ctin 1.2s var(--ease) forwards}
.curtain.go .ctitle{animation-delay:.05s}
@keyframes ctin{0%,28%{opacity:0;transform:translateY(30px)}44%,60%{opacity:1;transform:none}78%,100%{opacity:0;transform:translateY(-30px)}}
@media (max-width:900px){
 .hpin{height:auto!important}.pin-in{position:static;height:auto;min-height:0;padding-block:72px}
 .track{transform:none!important;overflow-x:auto;scroll-snap-type:x mandatory;width:auto;padding-bottom:12px}
 .wcard{width:82vw;scroll-snap-align:start}.wend{max-height:none;min-height:300px}
 .pin-bar{display:none}
}
@media (prefers-reduced-motion:reduce){.curtain{display:none}.wr-pre .wi{transform:none}.scrub .sw{color:var(--cream)}.scrub em .sw{color:var(--lime)}.stage.cl-pre{clip-path:none}}

/* centred-logo header */
.site-h .in.hrow{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:24px}
.navl{justify-self:start}
.navr{justify-self:end;display:flex;align-items:center;gap:30px}
.clogo{justify-self:center;position:relative;padding:4px 10px}
.clogo .sf{font-size:30px}
.clogo svg{transition:transform .5s var(--ease)}
.clogo:hover svg{transform:translateY(-3px)}
.clogo::after{content:"";position:absolute;left:50%;bottom:-6px;width:0;height:1px;background:var(--lime);transition:width .4s var(--ease),left .4s var(--ease)}
.clogo:hover::after{left:10%;width:80%}
@keyframes dropl{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
/* floating glass header once the page scrolls */
.site-h{margin:0 auto;width:100%;transition:width .55s var(--ease),top .55s var(--ease),background .4s,border-color .4s,box-shadow .4s,backdrop-filter .4s}
.site-h .in,.site-h .logo .sf,.site-h .logo svg,.site-h .nav,.site-h .navr{transition:min-height .5s var(--ease),padding .5s var(--ease),font-size .5s var(--ease),gap .5s var(--ease),width .5s var(--ease),height .5s var(--ease)}
.site-h.scrolled{top:calc(env(safe-area-inset-top,0px) + 12px);width:min(1100px,calc(100% - 32px));background:rgba(25,25,25,.58);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border:1px solid rgba(244,240,232,.14);box-shadow:0 18px 50px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(244,240,232,.06)}
.site-h.scrolled .in{min-height:60px;padding-left:22px;padding-right:10px;max-width:none}
.site-h.scrolled .nav{gap:24px;font-size:15px}
.site-h.scrolled .navr{gap:22px}
.site-h.scrolled .clogo .sf{font-size:25px}
.site-h.scrolled .clogo svg{width:22px;height:24px}
.site-h.scrolled .h-cta .btn{min-height:42px!important;padding:0 20px}
/* services mega menu */
.mega{position:absolute;left:-30px;top:calc(100% + 22px);width:min(860px,88vw);display:none;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:12px;padding:12px;background:#191919;border:1px solid rgba(244,240,232,.12);isolation:isolate;box-shadow:0 40px 80px -30px rgba(0,0,0,.75);z-index:60}
.mega::before{content:"";position:absolute;left:0;right:0;top:-24px;height:24px}
.dd:hover .mega,.dd:focus-within .mega,.dd.open .mega{display:grid;animation:mdrop .35s var(--ease) both}
@keyframes mdrop{from{opacity:0;translate:0 -8px}to{opacity:1;translate:0 0}}
.mlist{display:flex;flex-direction:column}
.mi{display:grid;grid-template-columns:40px minmax(0,1fr) 28px;gap:16px;align-items:center;padding:16px 14px;text-decoration:none;color:var(--cream);border-top:1px solid var(--line-d);transition:background .25s}
.mi:first-child{border-top:0}
.mi .mic svg{width:30px;height:33px;display:block}
.mi .mic path{fill:transparent;stroke:var(--graphite);stroke-width:3;transition:fill .3s,stroke .3s}
.mi .mt{display:flex;flex-direction:column;gap:3px;min-width:0}
.mi .mt b{font-family:var(--serif);font-weight:400;font-size:25px;line-height:1.05}
.mi .mt small{font-size:14px;color:var(--mute-d);line-height:1.4}
.mi .ma{font-size:18px;opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s var(--ease);color:var(--lime)}
.mi.on{background:#232120}
.mi.on .mic path{fill:var(--lime);stroke:var(--lime)}
.mi.on .ma{opacity:1;transform:none}
.mprev{background:var(--panel);padding:12px;display:flex;flex-direction:column;gap:14px}
.mp{display:none}.mp.on{display:block;animation:mfade .4s var(--ease)}
@keyframes mfade{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
.mcta{display:flex;align-items:center;gap:18px;flex-wrap:wrap}

/* mobile menu */
.burger{gap:10px}
.burger .bl{position:relative;width:18px;height:10px;display:inline-block}
.burger .bl i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;transition:transform .4s var(--ease),top .4s var(--ease)}
.burger .bl i:first-child{top:0}.burger .bl i:last-child{top:8.5px}
.burger[aria-expanded="true"] .bl i:first-child{top:4.25px;transform:rotate(45deg)}
.burger[aria-expanded="true"] .bl i:last-child{top:4.25px;transform:rotate(-45deg)}
.burger[aria-expanded="true"]{border-color:var(--lime);color:var(--lime)}
@media (max-width:440px){.burger{padding:0 13px}.burger .bt{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@media (max-width:1100px){
 .mnav{display:block;position:fixed;inset:0;z-index:49;background:var(--ink);color:var(--cream);overflow:auto;overscroll-behavior:contain;
  padding:calc(env(safe-area-inset-top,0px) + 104px) max(20px,env(safe-area-inset-right,0px)) calc(32px + env(safe-area-inset-bottom,0px)) max(20px,env(safe-area-inset-left,0px));
  visibility:hidden;clip-path:inset(0 0 100% 0);transition:clip-path .65s cubic-bezier(.76,0,.24,1),visibility 0s linear .65s}
 .mnav.open{visibility:visible;clip-path:inset(0 0 0 0);transition:clip-path .65s cubic-bezier(.76,0,.24,1)}
 .mn-in{position:relative;z-index:1;max-width:560px;margin:0 auto}
 .mn-l{display:flex;justify-content:space-between;align-items:center;width:100%;padding:14px 0;border:0;border-bottom:1px solid var(--line-d);background:none;color:inherit;text-decoration:none;font:400 clamp(34px,9.5vw,46px)/1.05 var(--serif);letter-spacing:-.01em;text-align:left;cursor:pointer}
 .mn-l i{font:500 20px var(--sans);font-style:normal;color:var(--mute-d);transition:transform .35s var(--ease),color .3s}
 .mn-l:active i,.mn-l:hover i{color:var(--lime);transform:translateX(4px)}
 .mn-l[aria-current="page"]{color:var(--lime)}
 .mnav .mn-l,.mnav .mn-foot{opacity:0;transform:translateY(26px)}
 .mnav.open .mn-l,.mnav.open .mn-foot{opacity:1;transform:none;transition:opacity .5s var(--ease) calc(var(--d)*50ms + 180ms),transform .7s var(--ease) calc(var(--d)*50ms + 180ms)}
 .mn-sub{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s var(--ease)}
 .mn-sub>div{overflow:hidden;display:flex;flex-direction:column}
 .mn-acc.open .mn-sub{grid-template-rows:1fr}
 .mn-acc.open .mn-tg i{transform:rotate(45deg);color:var(--lime)}
 .mn-sub a{display:block;text-decoration:none;padding:12px 0 12px 18px;border-left:2px solid var(--line-d);margin-left:2px}
 .mn-sub a:first-child{margin-top:14px}
 .mn-sub a b{display:block;font-weight:600;font-size:17px}
 .mn-sub a small{display:block;color:var(--mute-d);font-size:14px;line-height:1.4}
 .mn-sub a:active,.mn-sub a:hover{border-left-color:var(--lime)}
 .mn-sub .mn-all{font-weight:600;color:var(--lime);margin-bottom:14px}
 .mn-foot{margin-top:28px;display:grid;gap:10px}
 .mn-foot .btn{width:100%}
 .mn-deco{position:fixed;right:-90px;bottom:-60px;width:min(420px,90vw);height:auto;pointer-events:none;z-index:0}
}

@media (max-width:1100px){.site-h.scrolled{width:calc(100% - 24px)}.site-h.scrolled .in{min-height:56px;padding-left:16px;padding-right:8px}}

@media (max-width:1100px){.navr{gap:0;grid-column:3}.navr .nav{display:none}.clogo{grid-column:2;grid-row:1}.clogo .sf{font-size:26px}}
@media (max-width:420px){.clogo{gap:8px}.clogo .sf{font-size:23px}}

@media (max-width:1100px){
 .nav{display:none}.burger{display:inline-flex;align-items:center}
 .h-cta .btn{display:none}
 .svc-row{grid-template-columns:minmax(0,1fr) 48px}.svc-row .desc,.svc-row .thumb{display:none}
 .site-f .grid{grid-template-columns:repeat(2,minmax(0,1fr))}.site-f .grid>:first-child{grid-column:1/-1}
 .hbar{grid-template-columns:repeat(4,minmax(0,1fr))}.hbar .ctl{grid-column:1/-1;justify-content:flex-end;order:-1;margin-bottom:12px}
 .hbar button.t span{display:none}
}
@media (max-width:900px){
 .split,.split-r{grid-template-columns:minmax(0,1fr)}
 .c3,.c4{grid-template-columns:repeat(2,minmax(0,1fr))}
 .ind-list{grid-template-columns:repeat(2,minmax(0,1fr))}
 .art-row{grid-template-columns:140px minmax(0,1fr)}.art-row .rt{display:none}
 .toc,.hide-m{display:none!important}
 .hgrid{grid-template-columns:minmax(0,1fr);padding-bottom:40px}
 .hs{grid-template-columns:minmax(0,1fr);align-content:start;gap:24px;padding-top:28px}
 .hs .art{order:-1;justify-self:start;width:min(62vw,300px)}
 .hero{min-height:auto}
 .hero .bgnum{top:22%;font-size:72vw}
}
@media (max-width:600px){
 .c2,.c3,.c4,.form{grid-template-columns:minmax(0,1fr)}
 .ind-list{grid-template-columns:minmax(0,1fr)}
 .art-row{grid-template-columns:minmax(0,1fr)}.art-row .cover{display:none}
 .hs h1,.hs .h{font-size:clamp(50px,14.5vw,64px)}
 .hs .art{width:min(60vw,240px)}
 .wa-bar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;gap:8px;padding:10px max(12px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px));background:var(--ink);border-top:1px solid var(--line-d)}
 .wa-bar .btn{flex:1;min-height:48px;padding:0 10px}
 .site-f{padding-bottom:76px}
 .site-f .grid{grid-template-columns:minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){
 *,*::before,*::after{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:.15s!important}
 .hs .ln>span{transform:none}.hs.on .art{clip-path:none}.hs .art .ring path{stroke-dashoffset:0}
 .rv.pre{opacity:1;transform:none}.pill-word.pre{color:var(--cream);-webkit-text-stroke:0}.pill-word.lime.pre{color:var(--lime)}
 .arch-draw.pre path{stroke-dashoffset:0}
 .marq>div{animation:none}
}
"""

# ---------------------------------------------------------------- visual builders
def phone(name, ini, tiles="1r 2 3 2r 1 4 3 1r 2"):
    t = "".join(f'<i class="t{x[0]}{" r" if "r" in x else ""}"></i>' for x in tiles.split())
    return f'''<div class="phone"><div class="top"><span class="av">{ini}</span><span><b style="font-size:11px">{name}</b><br><span style="opacity:.6">Instagram</span></span></div>
<div class="nums"><span><b>Reels</b>weekly</span><span><b>Stories</b>daily</span><span><b>DMs</b>answered</span></div><div class="grid">{t}</div></div>'''

def laptop(url, head, btn="Book a call"):
    return f'''<div class="lap"><div class="bar"><i></i><i></i><i></i><span>{url}</span></div><div class="pg"><div><div class="hd">{head}</div><div class="sk" style="width:90%"></div><div class="sk" style="width:70%"></div>
<div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap"><span style="background:var(--lime);font-weight:600;padding:6px 9px">{btn}</span><span style="border:1px solid var(--ink);padding:6px 9px">See more</span></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px"><i class="t2" style="aspect-ratio:1"></i><i class="t5" style="aspect-ratio:1"></i><i class="t4" style="aspect-ratio:1"></i><i class="t3" style="aspect-ratio:1"></i></div></div></div>'''

def adcard(brand, line, cta="Send message", style=""):
    return f'''<div class="ad" style="{style}"><div class="h"><span class="av" style="width:22px;height:22px;background:var(--ink)"></span><span><b>{brand}</b><br><span style="color:var(--mute-l)">Sponsored</span></span></div>
<div class="img">{line}</div><div class="cta"><span>{cta}</span><span>→</span></div></div>'''

def chat(msgs, style=""):
    return f'<div class="chat" style="{style}">' + "".join(f'<div class="bub {d}">{m}</div>' for d, m in msgs) + '</div>'

def serp(q, title, url, style=""):
    return f'''<div class="serp" style="{style}"><div class="q">{q}</div><div class="top"><span style="color:var(--mute-l)">{url}</span><b>{title}</b><span style="color:var(--mute-l)">★★★★★ · Open now</span></div>
<div><span style="color:var(--mute-l)">other-site.com</span><b>Another business</b></div><div><span style="color:var(--mute-l)">directory.in</span><b>A listing site</b></div></div>'''

def calendar():
    plan = "1 2 . 1 3 2 1 . 1 2 . 1 3 . 2 1 . 2 1 3 . 1 2 . 1 2 . 3".split()
    nm = {"1": "Reel", "2": "Post", "3": "DMs", ".": ""}
    return '<div class="cal">' + "".join(f'<span class="{"t"+c if c!="." else ""}" style="{"border:1px solid #3A3734" if c=="." else ""}{"color:var(--cream)" if c=="2" else ""}">{nm[c]}</span>' for c in plan[:28]) + '</div>'

def mapart():
    return f'''<svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="position:absolute;inset:0">
<rect width="400" height="300" fill="#E9E3D8"/><g stroke="#D3CBBD" stroke-width="10" fill="none"><path d="M-10 80 L410 120"/><path d="M60 -10 L120 310"/><path d="M-10 230 L410 200"/><path d="M260 -10 L300 310"/></g>
<g stroke="#DDD6C9" stroke-width="4" fill="none"><path d="M-10 160 L410 150"/><path d="M180 -10 L200 310"/><path d="M340 -10 L360 310"/></g>
<path d="M-10 270 C120 250 220 290 410 260" stroke="#C9C1B3" stroke-width="18" fill="none"/></svg>
<svg class="pin" viewBox="0 0 100 110" width="44" height="48" aria-hidden="true"><path d="{ARCH_O}" fill="#191919"/></svg>'''

def vframe(label="Reel", style=""):
    return f'<div class="vfr" style="{style}"><span class="rec">● REC · 4K</span><span class="pl" aria-hidden="true"><svg viewBox="0 0 100 110"><path d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 Z"/></svg><i></i></span><span class="vl">{label}</span><span class="vt"><i></i></span></div>'

VC_T = {"Fitness":"vf","Brand &amp; Fashion":"vb","Supplements":"vs","B2B Spaces":"vw"}
def vcard(v):
    vid, title, label, client, cat, cid = v
    return f'''<a class="vcard rv" href="https://vimeo.com/{vid}" target="_blank" rel="noopener" data-v="{cat}" aria-label="Watch {title} on Vimeo (opens in a new tab)">
<span class="vp {VC_T.get(cat,"vf")}"><span class="vw" aria-hidden="true">{client}</span><span class="rec">● 4K</span><span class="pl" aria-hidden="true"><svg viewBox="0 0 100 110"><path d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 Z"/></svg><i></i></span><span class="vlab">{label}</span></span>
<span class="xs mu">{client} · {cat}</span><b class="sf h4">{title}</b><span class="sm" style="color:var(--lime)">Watch on Vimeo ↗</span></a>'''

def stage(inner, cls="r54", lt=False, label=""):
    return f'<div class="stage {cls}{" lt" if lt else ""}" role="img" aria-label="{label}"><div class="glow"></div>{inner}</div>'

def vis(kind, lt=False, cls="r54"):
    if kind == "site": return stage(laptop("yourbrand.in","Homes that feel like you."), cls, lt, "Example website")
    if kind == "seo": return stage(serp("best gym near dwarka","Your Business · Dwarka","yourbusiness.in"), cls, lt, "Example Google result")
    if kind == "ads": return stage(adcard("Your Brand","Free trial this week","Send WhatsApp message","left:14%;top:12%;transform:rotate(-4deg)") + adcard("Your Brand","Book your slot today","Learn more","right:12%;bottom:12%;transform:rotate(3deg)"), cls, lt, "Example ads")
    if kind == "dm": return stage(chat([("i","Hi! Do you deliver to Gurugram?"),("o","Yes, we do! It takes 2–3 days. Want the link?"),("i","Yes please!"),("o","Here you go. Use code HELLO for free delivery.")]), cls, lt, "Example DMs answered")
    if kind == "cal": return stage(calendar(), cls, lt, "Example monthly content calendar")
    if kind == "vid": return stage(vframe("Brand reel","position:relative;transform:rotate(-3deg)") + adcard("Your Brand","New drop. Watch now.","Shop now","right:10%;bottom:12%;transform:rotate(3deg)"), cls, lt, "Example video reel")
    if kind == "feed": return stage(phone("Your Studio","YS","5 2r 1 4r 5 2 1r 5 2"), cls, lt, "Example Instagram profile")
    if kind == "map": return f'<div class="stage {cls} lt" role="img" aria-label="Map showing our Dwarka office">{mapart()}</div>'
    if kind == "brand":
        return f'''<div class="stage {cls}" role="img" aria-label="The AegisKoncept arch"><svg viewBox="0 0 100 110" style="position:absolute;inset:8% 14%;width:72%;height:84%" preserveAspectRatio="none" aria-hidden="true">
<path d="M4 110 V56 C4 30 26 12 50 3 C74 12 96 30 96 56 V110" fill="none" stroke="#3A3734" stroke-width=".5"/><path d="M18 110 V58 C18 38 32 24 50 16 C68 24 82 38 82 58 V110" fill="none" stroke="#4A4642" stroke-width=".5"/></svg>
<div style="position:relative;width:30%">{mark(200)}</div></div>'''

def hero_art(kind):
    inner = {
     "brand": f'<div style="width:34%">{mark(200)}</div>',
     "site": laptop("yourbrand.in","Homes that feel like you.","Book a visit"),
     "seo": serp("interior designer near me","Your Studio · Gurugram","yourstudio.in","position:relative;width:76%"),
     "ads": adcard("Your Brand","Free trial this week","Send WhatsApp message","position:relative;width:62%;transform:rotate(-3deg)"),
     "dm": chat([("i","Hi! Is this still available?"),("o","Yes! Sharing the price and delivery details now."),("i","Can I pay on delivery?"),("o","Yes, cash on delivery works in Delhi NCR.")],"position:relative;width:78%"),
    }[kind]
    return f'''<div class="art"><svg class="ring" viewBox="0 0 100 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 110 V54 C0 26 22 8 50 0 C78 8 100 26 100 54 V110" fill="none" stroke="#D3E45B" stroke-width="1" vector-effect="non-scaling-stroke" pathLength="400"/></svg>
<div class="in-arch"><div class="par">{inner}</div></div></div>'''

def cover(word, kind="", cls=""):
    fill = "#D3E45B" if kind == "" else "#191919"
    return f'<div class="cover {kind} {cls}" aria-hidden="true"><span class="w">{word}</span><svg viewBox="0 0 100 110"><path d="{ARCH_O}" fill="{fill}"/></svg></div>'

def crumb(items):
    out = []
    for i, (t, h) in enumerate(items):
        if i: out.append('<span aria-hidden="true">/</span>')
        out.append(f'<a href="#{h}">{t}</a>' if h else f'<span aria-current="page">{t}</span>')
    return f'<nav class="crumb mu" aria-label="Breadcrumb">{"".join(out)}</nav>'

def faq(items):
    return '<div class="faq">' + "".join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '</div>'

def ticks(items, size=19):
    return "".join(f'<div class="tick rv"><span></span><div class="stack" style="gap:4px"><b style="font-size:{size}px">{t}</b><span class="mu">{d}</span></div></div>' for t, d in items)

SERVICES_OPT = '<option value="">Pick one</option><option>Website</option><option>SEO</option><option>Ads (Google / Meta)</option><option>Social Media</option><option>Video / Shoots</option><option>Not sure yet</option>'
FN = [0]
def quick_form(service=None):
    FN[0] += 1; n = FN[0]
    sel = SERVICES_OPT.replace(f"<option>{service}</option>", f"<option selected>{service}</option>") if service else SERVICES_OPT
    return f'''<form class="form js-form" novalidate>
<label class="fld" for="f{n}-n">Your name<input id="f{n}-n" autocomplete="name" required><span class="err">Please add your name.</span></label>
<label class="fld" for="f{n}-c">Phone or email<input id="f{n}-c" autocomplete="email" required><span class="err">Add a phone number or email so we can reply.</span></label>
<label class="fld full" for="f{n}-s">What do you need help with?<select id="f{n}-s" required>{sel}</select><span class="err">Pick one, or choose "Not sure yet".</span></label>
<div class="full row-btn" style="align-items:center"><button class="btn b-d" type="submit">Send</button><span class="note">We reply within 1 working day.</span></div></form>'''

def cta_band(title, sub, service=None):
    return f'''<section class="lm"><div class="in sec"><div class="split" style="align-items:end">
<div class="stack rv" style="gap:20px"><h2 class="sf h2">{title}</h2><p class="ld">{sub}</p>
<div class="row-btn"><a class="btn b-o" href="{WA}" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div>
<div class="rv">{quick_form(service)}</div></div></div></section>'''

def page(pid, title, body):
    return f'<div data-page="{pid}" data-title="{title}">{body}</div>'

# ---------------------------------------------------------------- data (plain English)
SVC = [
 dict(id="website-development-design", short="Website", nav="Websites", name="Website Design &amp; Development", vis="site",
  line="Good-looking websites that bring you enquiries.",
  h1="A Website That Brings You Customers.",
  sub="We plan, design and build your website. It looks great, loads fast on phones, and makes it easy for people to contact you.",
  pos="Your website is often the first thing people see. If it looks old or confusing, they leave. We make sure they stay and get in touch.",
  probs=["Our website looks old.","People visit but nobody contacts us.","It's slow on phones.","We need a developer for every small change.","We can't find ourselves on Google.","It doesn't show what we're good at."],
  inc=[("Planning","We decide what pages you need and what each page should say."),("Design","A custom look that matches your brand. Mobile first."),("Building","Fast websites on Next.js, WordPress or Shopify. You can edit them yourself."),("Launch + support","Google setup, tracking and help after launch.")],
  sig_t="Every page is made to get you enquiries.",
  sig=[("Clear message","People understand what you do in 5 seconds."),("Proof early","Your work and reviews show up near the top."),("Easy to contact","A form or WhatsApp button on every page."),("Fast loading","We test speed before we launch."),("Tracking from day one","You'll know where every enquiry came from.")],
  who=[("Local businesses","You need a site that brings calls and enquiries."),("Online brands","You need a fast Shopify store that sells."),("Growing companies","Your business has grown. Your website hasn't.")],
  proc=["Talk","Plan","Design","Build","Launch"],
  deliv=[("Page plan and layout","Before design"),("Custom design for all pages","Phone + desktop"),("Website you can edit yourself","Next.js, WordPress or Shopify"),("Google, speed and tracking setup","At launch"),("Training for your team","At handover"),("Monthly care plan","Optional")],
  faqs=[("How long does a website take?","Usually 4 to 8 weeks. Bigger sites and online stores can take longer. We'll give you a timeline before we start."),("Which platform will you use?","Next.js for speed, WordPress for blogs and content, Shopify for online stores. We'll suggest what fits you."),("Can we make changes ourselves?","Yes. You get an easy editor and a training session."),("Do you write the text?","Yes, we can. It's included or priced separately, depending on the number of pages."),("Will it show up on Google?","We set up everything Google needs before launch: titles, speed, sitemap and more."),("Do you look after it later?","Yes, with an optional monthly plan for updates, backups and small changes.")],
  arts=["Common Website Mistakes That Reduce Enquiries","How Startups Can Build Their Digital Presence","How to Choose the Right Digital Marketing Agency in India"]),
 dict(id="seo", short="SEO", nav="SEO", name="SEO", vis="seo",
  line="Show up on Google when people search for you.",
  h1="Show Up First When People Search.",
  sub="We help your business appear on Google and Google Maps for the searches that bring real customers. And we explain what we did, every month, in simple words.",
  pos="People search before they buy. If they can't find you, they find someone else. SEO fixes that, step by step.",
  probs=["Our competitors show up before us.","We get visitors but no enquiries.","Our Google Maps listing gets ignored.","We don't know what people search for.","SEO reports we don't understand.","Our rankings dropped and nobody told us why."],
  inc=[("Website fixes","Speed, structure and technical fixes so Google understands your site."),("Pages + blogs","Better pages and useful articles for the right searches."),("Google Maps","Your Google Business Profile, kept active and complete."),("Monthly report","What changed, why, and what's next. Short and clear.")],
  sig_t="Rankings, explained in plain words.",
  sig=[("Right searches, right pages","Each important search gets a page made for it."),("Google Maps sorted","Photos, posts and reviews kept active."),("Big wins first","We fix what brings enquiries before small stuff."),("Easy reports","No confusing charts. Just what matters."),("No shortcuts","No fake links or tricks that can get you penalised.")],
  who=[("Local businesses","You want to show up in \"near me\" searches."),("Online stores","You want sales from Google without paying for every click."),("Experts + B2B","You want articles that bring the right leads.")],
  proc=["Keyword mapping","Page restructuring","Content engine","GEO / AEO + Local","Monthly report"],
  deliv=[("Full website check","Month 1"),("Search and page plan","Month 1"),("Website fixes and page updates","Every month"),("Google Maps profile care","Every month"),("Blog articles","[Number per plan]"),("Simple monthly report","Every month")],
  faqs=[("How long does SEO take?","You'll usually see early movement in 2–3 months. Bigger results take 6 months or more."),("Can you guarantee the #1 spot?","No one can, because Google decides. We promise the work, the plan and honest reports."),("Do you do local SEO in Delhi NCR?","Yes. Google Maps and local search are a big part of what we do."),("Do you write the blogs?","Yes. Our team writes them, and you approve them before they go live."),("What's in the report?","Where you rank, how many people visited, how many contacted you, and what we'll do next.")],
  arts=["How Much Does SEO Cost in India?","Local SEO Strategies for Businesses in Delhi","SEO vs Paid Advertising: What Should Your Business Invest In?"]),
 dict(id="performance-marketing", short="Ads", nav="Google + Meta Ads", name="Google &amp; Meta Ads", vis="ads",
  line="Ads on Google, Instagram and Facebook that bring real leads.",
  h1="Ads That Bring Real Customers.",
  sub="We run your Google, Instagram and Facebook ads. We set up tracking first, so you know exactly what each lead costs.",
  pos="Getting clicks is easy. Getting the right people to call or message you is the real job. That's what we focus on.",
  probs=["We spend on ads but get bad leads.","We don't know what one lead costs.","Our ads stop working after a few weeks.","WhatsApp leads get lost.","Our reports only show clicks.","We don't know if Google or Instagram is better for us."],
  inc=[("Plan + tracking","Goals, budget, audience and tracking, set up properly."),("Google Ads","Ads for people already searching for what you sell."),("Instagram + Facebook Ads","Lead forms, WhatsApp ads and ads to win back past visitors."),("Creative + reports","New ad designs, weekly tweaks and a monthly report.")],
  sig_t="We count leads, not clicks.",
  sig=[("Tracking first","Every form, call and WhatsApp lead is counted."),("We check lead quality","We ask your team which leads were real."),("Fresh ads monthly","New ideas so results don't fade."),("Your account, your data","Ad accounts stay in your name."),("Clear budget","You pay Google and Meta directly. Our fee is separate.")],
  who=[("Local businesses","You want calls and WhatsApp messages this month."),("Online brands","You want sales at a cost that makes sense."),("Service companies","You want good-quality leads, not just numbers.")],
  proc=["Check","Track","Launch","Improve","Report"],
  deliv=[("Account and tracking setup","Month 1"),("Campaign plan and audiences","Month 1"),("Ad designs and text","[Number per plan]"),("Weekly improvements","Ongoing"),("Lead quality check with your team","Every month"),("Monthly report and next steps","Every month")],
  faqs=[("How much should we spend on ads?","It depends on your goal and your city. After a quick check, we'll suggest a starting budget so you can test without overspending."),("Is the ad budget part of your fee?","No. You pay Google and Meta directly. Our fee covers planning, setup, design and management."),("How fast will we get leads?","Usually in the first few weeks. The first month also teaches us what works best for you."),("Who owns the ad account?","You do. Everything stays in your business's name."),("Can you run WhatsApp ads?","Yes. We set up click-to-WhatsApp ads and help your team handle the chats.")],
  arts=["Google Ads vs Meta Ads for Indian Businesses","SEO vs Paid Advertising: What Should Your Business Invest In?","How Startups Can Build Their Digital Presence"]),
 dict(id="social-media-marketing-management", short="Social Media", nav="Social Media", name="Social Media Management", vis="dm",
  line="We post, we reply to your DMs, and we grow your page.",
  h1="We Post. We Reply. You Grow.",
  sub="We plan your content, make it, post it, and reply to your DMs and comments. You focus on your business. We handle your Instagram and Facebook.",
  pos="Most agencies just post. We also talk to your customers: we reply to DMs and comments in your brand's voice, so no enquiry gets missed.",
  probs=["We only post when we remember.","DMs stay unanswered for days.","Our posts don't look like us.","We don't know what's working.","Nobody replies to comments.","No time to plan a whole month."],
  inc=[("Plan","Who to talk to, what to post and how your brand should sound."),("Make","Monthly calendar, posts, carousels, reels, video and captions."),("Manage","We post on time and reply to DMs and comments."),("Report","What worked, what didn't, and next month's plan.")],
  sig_t="More than just posting.",
  sig=[("DMs answered","Replies in your brand's voice, within agreed hours."),("Comments handled","Every conversation gets a reply."),("Leads passed on","Serious enquiries go straight to your team."),("What people asked","A monthly list of common questions."),("Clear rules","Reply hours and rules are set before we start.")],
  who=[("Busy business owners","You need posts that go out on time, every week."),("Online brands","You need content and DMs that turn into orders."),("Bigger companies","You need every reply to sound like your brand.")],
  proc=["Plan","Make","You approve","Post + reply","Report"],
  deliv=[("Monthly content calendar","Every month"),("Posts, carousels and reels","[Number per plan]"),("Captions and hashtags","Every post"),("DM and comment replies","Agreed hours"),("Stories and engagement","Ongoing"),("Monthly report and plan","Every month")],
  faqs=[("How many posts do we get?","It depends on your plan. A normal month mixes reels, carousels, posts and stories. Exact numbers are in your proposal."),("Do you really reply to DMs?","Yes. That's a big part of what we do. We agree reply hours and rules with you first."),("Who checks posts before they go live?","You do. You approve the calendar and the content before anything is posted."),("Can you make photos and videos?","Yes. Our team handles content and creative production, from ideas and scripts to editing."),("How do you show results?","A monthly report: reach, likes, followers, enquiries from DMs, and what we'll change next.")],
  arts=["How to Build a Social Media Content Calendar","How Social Media Management Helps Businesses Build Trust","How Startups Can Build Their Digital Presence"]),
]
SVC_BY = {s["id"]: s for s in SVC}

W_ = "website-development-design"; S_ = "seo"; A_ = "performance-marketing"; M_ = "social-media-marketing-management"; V_ = "video-production"

# ---------------------------------------------------------------- service extras
SVC.append(dict(id=V_, short="Video", nav="Shoots + Video", name="Shoots &amp; Video Production", vis="vid",
  line="Reels, ad films and product shoots, made by our own crew.",
  h1="Videos That Make People Stop Scrolling.",
  sub="We plan, shoot and edit reels, ad films and product videos. Our own crew, 4K cameras, lights and models when you need them.",
  pos="On Instagram, the video is the ad. A phone clip from your counter won't beat a brand that shot it properly. We give you videos that look premium and are cut to sell.",
  probs=["Our videos look homemade.","We post the same 5 photos again and again.","Ads made from stock footage don't feel real.","We don't know what to shoot.","Shoots cost too much and take too long.","We got footage, but nobody edited it into ads."],
  inc=[("Idea + script","Hooks, script, shot list and mood board before the shoot."),("Shoot day","Our crew, Sony FX3 cameras, lights, set and models if needed."),("Edit","Reels, ad cuts, captions, colour grade and music."),("Ready-to-post files","9:16, 4:5 and 16:9 versions for every platform.")],
  sig_t="Shot to sell, not just to look nice.",
  sig=[("Hook in 2 seconds","Every video opens with a reason to keep watching."),("Many cuts from one shoot","One day of shooting gives you a month of content."),("Made for ads","Versions sized and timed for Meta and YouTube ads."),("Real people","Your team, your space, real customers or our models."),("Fast delivery","First edits usually within a week of the shoot.")],
  who=[("Gyms + studios","You want energy on screen that brings walk-ins."),("Online brands","You need product videos and ad creatives every month."),("Spaces + B2B","You want people to see your space before they visit.")],
  proc=["Brief","Script","Shoot","Edit","Deliver"],
  deliv=[("Concept, script and shot list","Before the shoot"),("Shoot day with crew and gear","Half or full day"),("Models and location","If needed"),("Edited reels and ad cuts","[Number per plan]"),("Captions, colour grade and music","Every video"),("All sizes for every platform","At delivery")],
  faqs=[("Do you shoot outside Delhi?","Yes. Most shoots are in Delhi NCR, but we travel for bigger projects."),("Can you provide models?","Yes. We cast models and athletes to fit your brand, or we can film your team."),("How many videos from one shoot?","Usually 6–15 edits from one day, depending on the plan."),("What camera do you use?","Sony FX3 cinema cameras in 4K, with proper lighting. Phone-native looks too, when that works better for ads."),("Can you also run the ads?","Yes. Our ads team can run the videos on Instagram, Facebook and YouTube.")],
  arts=["How to Build a Social Media Content Calendar","Google Ads vs Meta Ads for Indian Businesses","How Social Media Management Helps Businesses Build Trust"]))
SVC_BY = {s["id"]: s for s in SVC}

SVC_EXTRA = {
 W_: dict(
  fixes=["We redesign it with a modern look that matches your brand today.","Clear message, proof near the top and a contact button on every screen.","We build it light and test it on real phones before launch.","You get an easy editor and training, so small changes are yours.","Google-friendly setup from day one: titles, speed, sitemap, schema.","Project pages, reviews and photos that show your best work."],
  subs=[("Business websites","Websites for local businesses and service companies that bring calls and enquiries."),("Online stores (Shopify)","Fast stores with good product pages, simple checkout and WhatsApp support."),("Landing pages","One focused page for one ad or offer, made to turn visitors into leads."),("Website redesign","We keep what's working (and your Google rankings) and fix the rest."),("Web apps + CRM","Booking systems, admin panels and lead dashboards, built for your team.")],
  tools=["Next.js","WordPress","Shopify","PHP","Node.js","Figma","Google Search Console","GA4"],
  proof=[("Fast","10Q Challenge website rebuilt for speed and SEO","10q-challenge"),("UK","West Coast Services site built for UK searches","west-coast-services"),("CRM","Booking + staff system for The Drive Clinic","the-drive-clinic")]),
 S_: dict(
  fixes=["We find why they rank, then beat them page by page.","We fix the pages so visitors know what to do next and contact you.","We complete and update your profile and help you get real reviews.","We research the exact words your customers type, in Hindi and English too.","One short monthly report: what we did, what moved, what's next.","We check every change and tell you what happened, in plain words."],
  subs=[("Local SEO + Google Maps","Show up in \"near me\" searches and the Google Maps top 3 in your area."),("Technical SEO","Speed, indexing, structure and fixes so Google can read your whole site."),("Content + blog SEO","Pages and articles written for the searches that bring buyers."),("AI search (GEO)","Get quoted in Google AI Overviews, ChatGPT and other AI answers."),("E-commerce SEO","Category and product pages that rank and sell without paying per click.")],
  tools=["Google Search Console","GA4","Ahrefs","Semrush","Screaming Frog","Google Business Profile","PageSpeed Insights"],
  proof=[("3.51M","Google impressions for 10Q Challenge","10q-challenge"),("27.3K","organic clicks for 10Q Challenge","10q-challenge"),("9,873","Maps actions for a healthcare clinic","healthcare-clinic"),("Position 0","Google's answer for Shigeru Beauty","shigeru-beauty")]),
 A_: dict(
  fixes=["We tighten targeting and add questions that filter out time-wasters.","We track every form, call and WhatsApp chat so you see cost per lead.","We refresh ads every month before they get tired.","Leads go straight to your team's WhatsApp, with a reply script.","We report leads, cost per lead and sales, not just clicks.","We test both with a small budget and move money to what works."],
  subs=[("Google Search Ads","Show up when people are already searching for what you sell."),("Meta lead ads","Instagram and Facebook lead forms with smart questions to filter quality."),("Click-to-WhatsApp ads","Ads that open a WhatsApp chat, the way most Indians prefer to talk."),("Retargeting","Win back people who visited your site or engaged with your page."),("B2B reach campaigns","Get in front of business owners and decision makers at a low cost.")],
  tools=["Google Ads","Meta Ads Manager","Meta Pixel + CAPI","Google Tag Manager","GA4","WhatsApp Business","Looker Studio"],
  proof=[("₹4.99","record cost per WhatsApp lead on Meta",None),("2.02M","B2B reach for Allied Industrial Park","allied-industrial-park"),("₹3.75","CPM for Allied's B2B audience","allied-industrial-park")]),
 M_: dict(
  fixes=["A monthly calendar you approve once, then we post on time.","We reply to DMs within agreed hours, in your brand's voice.","Templates, colours and a style that's clearly yours.","Monthly report on what got reach, saves and enquiries.","Every comment gets a reply, so people feel heard.","We plan the whole month for you. You just approve."],
  subs=[("Content calendar","A month of posts, reels and stories, planned around your goals."),("Reels + carousels","Designed, edited and captioned by our team."),("DM + comment replies","We answer customers in your voice and pass leads to you."),("Page growth","Hashtags, collabs and stories that bring the right followers."),("Monthly reporting","Reach, saves, followers and DM enquiries, explained simply.")],
  tools=["Meta Business Suite","Instagram","Facebook","Canva","Adobe Premiere","CapCut","WhatsApp Business"],
  proof=[("30","reel ideas planned for The Attic Storey","the-attic-storey"),("Weekly","reels + daily stories for Thrive Gym","thrive-gym"),("Festive","campaign content for Luxury Club","luxury-club")]),
 V_: dict(
  fixes=["A proper crew, cinema cameras and lights. It shows.","One shoot day gives you a month of fresh posts and reels.","We film your real space, team and product, so it feels true.","We write the idea, hook and shot list before anyone picks up a camera.","Half-day or full-day shoots, planned so nothing is wasted.","We edit every shoot into reels and ad cuts, ready to post."],
  subs=[("Brand + commercial reels","Short films that show who you are and why people should care."),("Product videos","Clean, cinematic product shots for your store and ads."),("Gym + athlete shoots","High-energy fitness content with real athletes and models."),("Ad creatives","Hooks and cuts made for Meta and YouTube ads."),("Space + B2B films","Show your office, coworking space or factory before people visit.")],
  tools=["Sony FX3","4K cinema lenses","Lighting rig","DaVinci Resolve","Adobe Premiere","After Effects","Models + casting"],
  proof=[("7","commercial reels shot for clients",None),("4K","cinema production on every shoot",None),("3","brands: fitness, lifestyle and B2B spaces",None)]),
}
for _s in SVC:
    _x = SVC_EXTRA[_s["id"]]; _s.update(_x); _s["pf"] = list(zip(_s["probs"], _x["fixes"]))

# ---------------------------------------------------------------- work
CASES = [
 dict(id="10q-challenge", client="10Q Challenge", ind="education", loc="India (online)", svcs=["SEO","Website"], logo="e0c7efa9", url="https://10qchallenge.in/",
  one="From about 20 Google clicks a day to 1,000+ at exam-season peak.",
  ch="10Q Challenge helps students prepare for BITSAT and JEE online. Big coaching brands take up most of Google's first page, so a smaller brand was hard to find.",
  ap="We mapped every high-intent search students make, like \"bitsat mentorship program 2027\" and \"bitsat crash course\". Then we rebuilt the pages so each one answers one search, kept the old links that were already ranking, and wrote guides and quizzes in an answer-first style that Google's AI Overviews like to quote.",
  did=["Keyword mapping","Page restructuring","Guides + quizzes","AI search (GEO)","Monthly report"],
  res=[("27.3K","organic clicks"),("3.51M","Google search impressions"),("6.9","average Google position"),("134K","AI Overview impressions in 3 months"),("#1","\"bitsat mentorship program 2027\""),("#2","\"jee mentorship program 2027\" and \"bitsat crash course\"")],
  extra="Google's AI Overview lists 10Q Challenge first for BITSAT mentorship, and names it next to Physics Wallah for JEE mentorship.",
  cover="s01",
  shots=[("s00","Google Search Console, Jan–Jul 2026: 27.3K clicks, 3.51M impressions. Peak in BITSAT / JEE exam season."),("s01","\"bitsat mentorship program 2027\": 10Q listed first in the AI Overview and #1 in the results."),("s02","\"jee mentorship 2027\": 10Q named next to Physics Wallah in Google's AI answer."),("s03","134K impressions inside Google's AI features in 3 months."),("s05","#2 for \"bitsat crash course\"."),("s06","#2 for \"jee mentorship program 2027\" (keyword difficulty 43%)."),("s07","#3 for a BITSAT logical reasoning quiz (keyword difficulty 72%)."),("s04","#6 for \"jee advanced syllabus 2027\".")]),
 dict(id="healthcare-clinic", client="Healthcare Clinic", ind="healthcare-wellness", loc="India", svcs=["SEO"], logo=None,
  one="9,873 actions from Google Maps in 6 months: directions, calls and website visits.",
  ch="A healthcare clinic wanted more patients from people searching nearby. Its Google profile was there, but it wasn't bringing steady calls and visits.",
  ap="We completed and optimised the Google Business Profile, kept it active with posts and photos, built local pages on the website, and helped the clinic collect real reviews. Then we tracked every call, direction request and website click.",
  did=["Google Business Profile","Local pages","Reviews","Monthly tracking"],
  res=[("9,873","Business Profile actions"),("6,361","direction requests"),("3,761","website clicks"),("1,376","phone calls")],
  extra="About 1,600 actions every month, steady for 6 months (Feb–Jul 2026). Client name kept private on request.",
  cover="s08",
  shots=[("s08","9,873 Business Profile interactions, Feb–Jul 2026."),("s09","6,361 direction requests."),("s10","3,761 website clicks from the profile."),("s11","1,376 phone calls from the profile.")]),
 dict(id="allied-industrial-park", client="Allied Industrial Park", ind="real-estate", loc="Alwar, Rajasthan", svcs=["Website","Ads"], logo="2306283a", url="https://alliedindustrialpark.in/",
  one="A website for industrial plots, plus 2.02M business owners reached at ₹3.75 CPM.",
  ch="Allied Industrial Park sells industrial plots (500 to 1,800 sq. m.) in a gated township on the Bhiwadi–Alwar corridor. Buyers are factory owners and investors: a small, busy audience.",
  ap="We built the website around what investors check first: plot sizes, location on SH-25, security and the investment case. Then we ran Meta ads aimed at business owners and decision makers, moving budget every week to the ads with the cheapest reach and best enquiries.",
  did=["Website","Project pages","Meta Ads","B2B audiences","Ad creatives"],
  res=[("2.02M","B2B reach"),("₹3.75","cost per 1,000 views (CPM)")]),
 dict(id="pot-and-bloom", client="Pot &amp; Bloom", ind="ecommerce-d2c", loc="India", svcs=["Website","Video"], logo="88f9434f", url="https://www.potandbloom.com/",
  one="A fresher Shopify store, plus product photos and videos.",
  ch="Pot &amp; Bloom sells grow kits, plant care, self-watering pots, gardening tools and corporate gifts across India. The store needed a better homepage and better product visuals.",
  ap="We redesigned the Shopify homepage (\"Grow something beautiful.\"), organised the shop into clear collections, made product images and videos, and created promo videos for new launches. We now look after the site every month.",
  did=["Shopify homepage","Collections","Product images","Promo videos","Monthly care"]),
 dict(id="west-coast-services", client="West Coast Services", ind="professional-services", loc="London, UK", svcs=["Website","SEO"], logo="bada290e", url="https://westcoastservices.co.uk/",
  one="A London website that sorts out business bills and marketing in one place.",
  ch="West Coast Services helps UK businesses with energy, gas, water and waste contracts, plus loans, card machines and digital marketing. They needed one website that explains all of it simply.",
  ap="We built a clear, friendly website (\"We sort out the bills you hate opening\") with a page for each service, a savings estimator, a simple switching process and quote forms. Behind it, an admin panel for leads, articles and SEO.",
  did=["Website design","Savings estimator","Service pages","UK SEO","Lead CRM"]),
 dict(id="eco-utilities", client="ECO Utilities", ind="professional-services", loc="London, UK", svcs=["Website","SEO"], logo="3dd9ad49", url="https://ecoutilitiesltd.co.uk/",
  one="A business energy comparison site built to rank in the UK.",
  ch="ECO Utilities is an independent UK broker. It gets business gas and electricity quotes, explains every charge and handles the paperwork, with no fees.",
  ap="We built a clean comparison website (\"Compare business energy prices. Pay what you should.\") with pages for electricity and gas, room for broadband, water, waste and insurance, and a guides section for UK search.",
  did=["Website","Comparison pages","Guides","UK SEO"]),
 dict(id="the-drive-clinic", client="The Drive Clinic", ind="automotive", loc="Jammu", svcs=["Website"], logo="f03c9f15", url="https://thedriveclinic.com/",
  one="A booking website for a premium car and bike detailing studio.",
  ch="The Drive Clinic does detailing, paint protection film, ceramic coating and washes in Nanak Nagar, Jammu. Bookings and customer details were handled on calls and paper.",
  ap="We built a bold website with online booking, a menu of 15 service packages, VIP memberships, a work gallery and a quiz that recommends the right service. Plus a staff and CRM system to manage bookings and customers.",
  did=["Website","Online booking","15 packages","VIP memberships","Service quiz","Staff CRM"]),
 dict(id="shigeru-beauty", client="Shigeru Beauty", ind="beauty-salons", loc="USA", svcs=["SEO"], logo=None, url="https://shigerubeauty.com/",
  one="Google's own answer for \"best 24k gold serum in USA\".",
  ch="Shigeru Beauty sells 24k gold skincare online in the US, a crowded market full of big beauty brands.",
  ap="We wrote answer-first guides for the exact questions buyers ask, structured so Google can lift the answer straight into its results. That's called AEO (answer engine optimisation).",
  did=["AI SEO","Answer-first guides","Featured snippets","E-commerce SEO"],
  res=[("Position 0","featured snippet names Shigeru Beauty as the answer"),("Cited","as a source in Google's AI Overview")],
  cover="s18",
  shots=[("s18","\"best 24k gold serum in usa\": Google's answer box names Shigeru Beauty."),("s19","\"best 24k gold elixir\": Shigeru Beauty's guide cited in the AI Overview.")]),
 dict(id="thrive-gym", client="Thrive Gym", ind="healthcare-wellness", loc="Gurugram", svcs=["Social Media","Ads","Video"], logo="26a50833",
  one="More people joining from the new housing societies nearby.",
  ch="Thrive Gym is on Dwarka Expressway. Lots of new housing societies there have free clubhouse gyms. The gym needed more people to sign up.",
  ap="We shot three high-energy reels in 4K with real members, trainers and athletes. We posted reels and stories every week, ran Google ads for people searching for gyms nearby, and ran a free-trial offer on Instagram that opened straight into WhatsApp.",
  did=["3 commercial reels","Weekly reels + stories","Google Search ads","Free-trial WhatsApp ads","Monthly report"]),
 dict(id="uk-barber", client="UK Barber Shop", ind="beauty-salons", loc="Derby, UK", svcs=["Website","SEO"], logo="56e25337", url="https://derbyukbarber.com/",
  one="A sharp website so people in Derby find the shop and walk in.",
  ch="UK Barber Shop is a walk-in barbershop on Osmaston Road, Derby. If people nearby can't find it on Google, they walk into the next shop.",
  ap="We made a bold website (\"Stay Sharp. Look Premium.\") with services, a price list, the team, reviews, a gallery and opening hours, and set it up for local search in Derby.",
  did=["Website","Price list","Gallery + reviews","Local SEO"]),
 dict(id="krickscricket", client="Krickscricket", ind="ecommerce-d2c", loc="India · ships worldwide", svcs=["Website"], logo=None, url="https://krickscricket.com/",
  one="A worldwide store for handmade cricket bats.",
  ch="Krickscricket makes English and Kashmir willow bats by hand, plus custom-engraved bats and accessories. They needed a store that sells to players all over the world.",
  ap="We built the e-commerce site (\"Built for the big hit.\") with shops for leather, tennis and custom bats, accessories, a bat size finder, a page on how the bats are made, and bulk enquiries.",
  did=["E-commerce site","Custom bat builder","Bat size finder","Bulk enquiry"]),
 dict(id="the-attic-storey", client="The Attic Storey", ind="interiors-design", loc="Gurugram + Delhi", svcs=["Social Media","Video"], logo="a5f3fa1c",
  one="An active Instagram page and cinematic brand reels, even before projects were finished.",
  ch="The Attic Storey (Tastorey) is a design studio. Most of their projects were still being built, so there were no finished photos to post.",
  ap="We planned content around the process instead: materials, site visits and the team. We made a monthly calendar and 30 reel ideas, posted every week, and shot cinematic brand reels on a studio set with models and a full lighting rig.",
  did=["Monthly calendar","30 reel ideas","Weekly posting","Brand reels","Studio shoot"]),
 dict(id="workstation-coworking", client="Workstation", ind="real-estate", loc="Delhi NCR", svcs=["Video","Ads"], logo=None,
  one="A promo reel that shows the space before people visit.",
  ch="Workstation is a coworking space. Freelancers and teams want to feel the vibe before they book a visit.",
  ap="We shot a short commercial showing the desks, cabins and community, and cut it for ads aimed at founders and small teams nearby.",
  did=["Commercial shoot","Ad edit","B2B audiences"]),
 dict(id="luxury-club", client="Luxury Club", ind="fashion-lifestyle", loc="India", svcs=["Video","Social Media"], logo="1539c868",
  one="Festive videos where the product always looks its best.",
  ch="Luxury Club sells car perfumes, attars, candles and gift sets. They needed premium festive content without changing how the products look.",
  ap="We made festive reels, captions and cinematic product videos, always keeping the real product photos as they are.",
  did=["Festive reels","Product videos","Captions","Posting plan"]),
]
OWNERS = {
 "10q-challenge":("Harshal Jain","Owner"), "allied-industrial-park":("Jeevan Singh","Owner"), "uk-barber":("Allen","Owner, Derby UK"),
 "eco-utilities":("Amarjit Singh","Owner, UK"), "the-drive-clinic":("Karanveer Singh","Owner"), "krickscricket":("Rajdeep Singh","Owner"),
 "pot-and-bloom":("Anit Singh","Business Head"), "west-coast-services":("Ashish","Owner, UK"), "shigeru-beauty":("Rob Farber","Owner"),
 "thrive-gym":("Rahul Ron &amp; Ritik Punia","Owners"), "the-attic-storey":("Kartik &amp; Astha","Owners, Delhi"), "luxury-club":("Deepak Vinayak","Owner"),
}
UPD = {
 "allied-industrial-park": dict(svcs=["Ads","Website"],
  one="Every industrial and residential plot sold, with Meta ads and a proper retargeting plan.",
  ch="Allied Industrial Park had industrial plots (500 to 1,800 sq. m.) and residential plots to sell in its township on the Bhiwadi–Alwar corridor. Buyers are factory owners, investors and families: a small audience that takes time to decide.",
  ap="We built the website around what buyers check first: plot sizes, location on SH-25, security and the investment case. Then we ran Meta ads in stages. First, wide reach to business owners and investors at a low cost. Next, retargeting ads with plot details, prices and site-visit offers to everyone who watched the videos or visited the site. Finally, lead forms and WhatsApp for people ready to visit. Every week we moved budget to the ads bringing real enquiries.",
  did=["Meta Ads","Retargeting funnel","B2B audiences","Ad videos + creatives","Lead forms + WhatsApp","Website"],
  res=[("100%","industrial and residential plots sold"),("2.02M","people reached"),("₹3.75","cost per 1,000 views (CPM)")]),
 "thrive-gym": dict(one="New gym admissions every month from Instagram, Facebook and Google ads.",
  ap="We manage Thrive Gym's social media every month: reels, posts and daily stories with real members and trainers, plus three 4K commercial reels we shot. We run Google ads for people searching for gyms nearby and Meta free-trial ads that open straight into WhatsApp, so new people walk in and take admission.",
  did=["Social media posts","Reels + stories","3 commercial reels","Google Search ads","Meta free-trial ads","Monthly report"]),
 "workstation-coworking": dict(one="Seats rented out through Meta ads, with reels and ad videos we made.",
  ch="Workstation is a coworking space. They needed to fill desks and cabins, and people want to feel the vibe before they book a visit.",
  ap="We prepared reels and ad videos showing the desks, cabins and community, then ran Meta ads aimed at freelancers, founders and small teams nearby. The ads brought enquiries and visits, and the space got rented.",
  did=["Reels","Ad videos","Meta Ads","Local audiences"], res=[("Rented","seats filled through Meta ads")]),
 "luxury-club": dict(svcs=["Social Media","Video"],
  one="Social media, festive videos and an Amazon store for a fragrance brand.",
  ch="Luxury Club sells car perfumes, attars, candles and gift sets. They needed a steady social media presence, premium festive content, and a way to sell on Amazon.",
  ap="We set up and run their social media posts, made festive reels and cinematic product videos (always keeping the real product photos as they are), and set up their Amazon store with listings ready to sell.",
  did=["Social media setup","Festive reels","Product videos","Amazon store setup","Captions + posting plan"]),
 "the-attic-storey": dict(loc="Delhi"),
}
REVIEWS = {
 "10q-challenge":"AegisKoncept rebuilt our site and SEO. We now rank #1 for BITSAT mentorship, and Google’s AI answers recommend us. Daily clicks went from about 20 to over 1,000 in exam season.",
 "allied-industrial-park":"Their Meta ads and retargeting helped us sell every industrial and residential plot. They reached the right business owners at a very low cost and kept improving the ads every week.",
 "pot-and-bloom":"They redesigned our Shopify homepage, made our product photos and videos, and look after the site every month. Always quick to make changes.",
 "west-coast-services":"They built a clean, professional website that explains all our services simply and brings in quote requests from UK businesses.",
 "eco-utilities":"Our new website makes comparing business energy easy for customers. Clear, fast and built to be found on Google in the UK.",
 "the-drive-clinic":"A bold website with online booking, our packages and memberships, plus a system to manage customers. Exactly what our studio needed.",
 "shigeru-beauty":"Their SEO got us into Google’s answer box and AI Overviews in a very competitive US beauty market.",
 "thrive-gym":"They handle our social media and ads every month, and we get new gym admissions from it. The reels they shot show the real energy of our gym.",
 "uk-barber":"A sharp website that shows our services, prices and work. Easy for people in Derby to find us and walk in.",
 "krickscricket":"They built our online store for handmade cricket bats, including custom bats and a size finder. Customers order from all over the world.",
 "the-attic-storey":"Even before our projects were finished, they kept our Instagram active and shot cinematic brand reels that show our style.",
 "luxury-club":"They set up our social media and Amazon store, and make festive videos that keep our products looking premium.",
}
APPROVED = set()  # add a case id here once the client has approved their review
for _c in CASES:
    _c.update(UPD.get(_c["id"], {}))
    if _c["id"] in REVIEWS: _c["quote"] = REVIEWS[_c["id"]]; _c["qok"] = _c["id"] in APPROVED
    _o = OWNERS.get(_c["id"]); _c["owner"] = _o
CASE_BY = {c["id"]: c for c in CASES}
WORK_STATS = [("3.51M","Google impressions for 10Q Challenge"),("9,873","Google Maps actions for a clinic"),("100%","plots sold for Allied Industrial Park"),("2.02M","B2B reach at ₹3.75 CPM")]
from PIL import Image as _PI
import base64, os
_SD=os.path.join(os.path.dirname(os.path.abspath(__file__)),"shots")
SHOT_WH={f[:-4]: _PI.open(os.path.join(_SD,f)).size for f in os.listdir(_SD) if f.endswith(".jpg")}
SHOT_CSS="".join(".sh-%s{background-image:url(data:image/jpeg;base64,%s)}" % (k, base64.b64encode(open(os.path.join(_SD,k+".jpg"),"rb").read()).decode()) for k in sorted(SHOT_WH))
def shot(k, label, cls=""):
    w,h=SHOT_WH[k]
    return f'<span class="shot sh-{k} {cls}" role="img" aria-label="{label}" style="aspect-ratio:{w}/{h}"></span>'
def shotfig(k, cap):
    return f'<figure class="sfig rv">{shot(k, cap)}<figcaption class="sm mu">{cap}</figcaption></figure>'
MORE_SEO=[("s20","6.18K clicks and 50.8K impressions in 24 hours · 12.2% CTR"),("s21","3.08K clicks and 23.6K impressions in 24 hours · 13.1% CTR"),("s22","4.38K clicks · 35.3K impressions · average position 4.9"),("s23","Clicks 822 → 1.54K · impressions 94K → 371K · position 17.7 → 6.2"),("s24","Clicks 194 → 664 · impressions 43K → 222K · position 22.4 → 7.2"),("s25","After restructuring: position 26.9 → 7.2 · impressions 2.6×")]

def case_vis(c, cls="r54"):
    k = c["id"]
    if c.get("cover"):
        lg0 = f'<span class="stg-logo lgo-{c["logo"]}" aria-hidden="true"></span>' if c.get("logo") else f'<span class="stg-logo txt" aria-hidden="true">{c["client"]}</span>'
        return stage(f'<span class="shotwrap">{shot(c["cover"], c["client"]+" result screenshot")}</span>' + lg0, cls, False, c["client"]+" real result")
    lg = f'<span class="stg-logo lgo-{c["logo"]}" aria-hidden="true"></span>' if c.get("logo") else f'<span class="stg-logo txt" aria-hidden="true">{c["client"]}</span>'
    V = {
     "10q-challenge": lambda: serp("bitsat mentorship program 2027","10Q Challenge · BITSAT Mentorship 2027","10qchallenge.in","left:10%;top:16%") + chat([("i","Which is the best BITSAT mentorship?"),("o","AI Overview: 10Q Challenge offers…")],"right:7%;bottom:12%;width:min(44%,230px)"),
     "allied-industrial-park": lambda: adcard("Allied Industrial Park","Grow your factory here.","Learn more","left:12%;top:12%;transform:rotate(-4deg)") + adcard("Allied Industrial Park","Industrial plots from ₹1.5 Cr","Get details","right:10%;bottom:12%;transform:rotate(3deg)"),
     "thrive-gym": lambda: phone("Thrive Gym","TG") + adcard("Thrive Gym","Free trial this week","Send WhatsApp message","right:8%;bottom:10%;transform:rotate(4deg)"),
     "west-coast-services": lambda: laptop("westcoastservices.co.uk","We sort out the bills you hate opening.","Get a quote"),
     "eco-utilities": lambda: laptop("ecoutilitiesltd.co.uk","Compare business energy prices.","Get a quote"),
     "krickscricket": lambda: laptop("krickscricket.com","Built for the big hit.","Shop bats"),
     "the-attic-storey": lambda: phone("The Attic Storey","AS","5 2r 1 4r 5 2 1r 5 2") + vframe("Brand reel","right:9%;bottom:10%"),
     "_x": lambda: laptop("hausofstack.com","Honest reviews of the tools you pay for.","Compare plans"),
     "the-drive-clinic": lambda: laptop("thedriveclinic.com","Architects of self-healing PPF armor.","Book now"),
     "in2-nutrition": lambda: vframe("Performance reel","left:16%;top:9%;transform:rotate(-3deg)") + adcard("IN2","Fuel your next PR.","Shop now","right:9%;bottom:12%;transform:rotate(3deg)"),
     "workstation-coworking": lambda: vframe("Space tour","left:18%;top:9%;transform:rotate(-3deg)") + adcard("Workstation","Your desk is waiting.","Book a visit","right:9%;bottom:12%;transform:rotate(3deg)"),
     "uk-barber": lambda: laptop("derbyukbarber.com","Stay Sharp. Look Premium.","See prices"),
     "pot-and-bloom": lambda: laptop("potandbloom.com","Grow something beautiful.","Shop plants"),
     "luxury-club": lambda: phone("Luxury Club","LC","4r 3 4 1 4r 3 4 1r 4") + adcard("Luxury Club","The Magic of Luxury Fragrances","Shop now","right:8%;bottom:10%;transform:rotate(3deg)"),
     "123-consulting": lambda: laptop("123consultingsolutions.com","Start your home care agency.","Book a call"),
     "shigeru-beauty": lambda: laptop("shigerubeauty.com","24k gold skincare.","Shop now"),
    }
    return stage(V[k]() + lg, cls, False, c["client"]+" work preview")

# ---------------------------------------------------------------- videos
VIDEOS = [
 ("1234553803","Thrive Gym High-Energy Commercial Reel","Fitness Reel · 4K Production","Thrive Gym","Fitness","thrive-gym"),
 ("1234553778","The Attic Storey Commercial Brand Reel","Brand Commercial · Studio Set","The Attic Storey","Brand &amp; Fashion","the-attic-storey"),
 ("1234553779","Thrive Gym Model &amp; Athlete Reel #2","Gym &amp; Athletes · Sony FX3","Thrive Gym","Fitness","thrive-gym"),
 ("1234553801","Thrive Gym Dynamic Motion &amp; Lighting","Fitness Model · Direct Response","Thrive Gym","Fitness","thrive-gym"),
 ("1234553780","Attic Cinematic Model &amp; Narrative Reel","Cinematic Reel · Lighting Rig","The Attic Storey","Brand &amp; Fashion","the-attic-storey"),
 ("1234553777","Attic Cinematic Commercial Shoot #2","Fashion &amp; Lifestyle · 4K Master","The Attic Storey","Brand &amp; Fashion","the-attic-storey"),
 ("1234561248","Workstation Coworking Promotion Reel","B2B Spaces · Commercial Ad","Workstation","B2B Spaces","workstation-coworking"),
]

# ---------------------------------------------------------------- industries
def I(id, name, vis, h1, sub, issues, cases, faqs, short=None):
    return dict(id=id, name=name, short=short or name, vis=vis, h1=h1, sub=sub, issues=issues, cases=cases, faqs=faqs,
                svcs=list(dict.fromkeys(x[3] for x in issues)))
INDS = [
 I("ecommerce-d2c","Online Brands (D2C)","ads","Marketing for Online Brands That Want More Sales.","Fast stores, ads that sell at a good price, and content that brings people back to buy again.",
  [("Ads keep getting expensive","The same customers cost more every season.","We fix tracking first, then test new audiences and creatives every month so cost per sale stays in check.",A_),
   ("People buy once and disappear","Most brands never see the customer again.","Retargeting, WhatsApp offers and content that gives people a reason to come back.",M_),
   ("Slow product pages","Slow pages lose sales on phones.","A faster Shopify store with better product pages and a simpler checkout.",W_),
   ("Need new content every month","Ads die when creatives get old.","Product shoots and ad cuts from one shoot day, ready for the whole month.",V_)],
  ["in2-nutrition","pot-and-bloom","luxury-club"],
  [("Do you work with Shopify stores?","Yes. We build and improve Shopify stores and run ads for them."),("Can you do both ads and content?","Yes. Most online brands use both, so we plan them together."),("Do you work with health products?","Yes, carefully. We keep claims honest and follow ad rules.")]),
 I("healthcare-wellness","Health &amp; Fitness","dm","Marketing for Gyms, Clinics and Wellness Brands.","Show up on Google Maps, build trust with real content, and reply to every enquiry fast.",
  [("Lots of local competition","People pick from the first few results on Maps.","Local SEO and a complete Google profile, so you show up in the top 3 near you.",S_),
   ("People need to trust you first","Nobody books a gym or clinic they don't feel good about.","Real reels of your space, trainers and members. Faces beat stock photos.",V_),
   ("Strict ad rules","Health ads get rejected if the claims are wrong.","Ads written within the rules, with free-trial offers that open WhatsApp.",A_),
   ("Enquiries go cold","Leads that wait a day are usually gone.","We reply to DMs fast and pass serious leads to your team the same day.",M_)],
  ["thrive-gym","in2-nutrition"],
  [("Do you work with clinics?","Yes, and gyms, studios and wellness brands too. We follow the rules for each."),("Can you handle WhatsApp enquiries?","Yes. We set up the flow and pass serious leads to your team."),("Do you make medical claims?","No. We keep everything honest and within the rules.")], "Health &amp; fitness"),
 I("interiors-design","Interiors &amp; Design","feed","Marketing for Interior Designers and Design Studios.","Show your style, show how you work, and get enquiries from clients with the right budget.",
  [("Projects aren't finished yet","Your best work is still being built.","We post the process: materials, site visits and your team, so your page never goes quiet.",M_),
   ("Everyone looks the same","Most studio pages look alike.","Cinematic brand reels that show your taste, not just your rooms.",V_),
   ("Wrong-budget enquiries","Many leads don't match your minimum project size.","A portfolio website with budget questions on the form, so you only call the right people.",W_),
   ("Clients take months to decide","People compare many designers first.","SEO for searches like \"interior designer in Gurugram\" so you're found during that research.",S_)],
  ["the-attic-storey"],
  [("What if we don't have finished photos?","That's normal. We post about the process and your team until projects are done."),("Can you help us get bigger clients?","Yes. We present your work better and filter enquiries by budget."),("Do you build portfolio websites?","Yes, and you can add new projects yourself.")], "Interiors"),
 I("startups","Startups","site","Marketing for Startups Getting Their First Customers.","A clear brand, a website that explains your product, and a first marketing plan you can afford.",
  [("Message isn't clear yet","Founders get it. Customers don't, yet.","A website that explains what you do in 5 seconds, tested with real visitors.",W_),
   ("Small budget","Every rupee needs to teach you something.","Small, focused ad tests that show which audience and message actually convert.",A_),
   ("Nobody knows you yet","No brand, no reviews, no search traffic.","Content and SEO that build trust and bring free traffic month after month.",S_),
   ("Doing too much","Trying every channel and mastering none.","One clear monthly content plan on the one platform your customers use.",M_)],
  ["haus-of-stack"],
  [("Do you work with early startups?","Yes. We often start with the website and one focused campaign."),("Can we start small?","Yes. We'll plan a starting size that fits your stage."),("Do you help with branding?","Yes, as part of website and content work.")]),
 I("tech-saas","Tech &amp; SaaS","seo","Marketing for Tech and SaaS Companies.","Get found when people compare tools, explain your product simply, and turn trials into paying users.",
  [("People compare before they buy","Buyers read reviews and \"best tool\" lists first.","Comparison pages and guides that rank for those exact searches.",S_),
   ("Product is hard to explain","Features don't sell. Outcomes do.","A website that shows the problem you solve, with clear demos and pricing.",W_),
   ("Expensive clicks","Software keywords cost a lot on Google.","Tight Google campaigns on high-intent searches, plus retargeting for trial users.",A_),
   ("AI is answering for you","ChatGPT and Google AI now recommend tools.","AI search (GEO) work so your product gets named in AI answers.",S_)],
  ["haus-of-stack"],
  [("Do you do SaaS SEO?","Yes: comparison pages, use-case pages and guides that bring sign-ups."),("Can you build our marketing site?","Yes, on Next.js or a CMS your team can edit."),("Do you work with global SaaS?","Yes. We work with Indian and international audiences.")]),
 I("education","Education &amp; Coaching","seo","Marketing for Coaching Centres, Schools and Ed-tech.","Show up when students and parents search, and fill your batches before exam season.",
  [("Big brands own Google","Large coaching chains take the first page.","SEO for specific searches, like \"BITSAT crash course\", where you can win.",S_),
   ("Seasonal rush","Most students decide in a few weeks before exams.","Ads planned around exam dates, so budget hits when students are searching.",A_),
   ("Parents need trust","They want results, faculty and reviews before paying.","A website with results, faculty profiles and a clear course page for each batch.",W_),
   ("Students live on Instagram","Your posts compete with memes and toppers' reels.","Short, useful reels and tips that students save and share.",M_)],
  ["10q-challenge"],
  [("Can you help us rank for exam searches?","Yes. 10Q Challenge reached #1 for \"bitsat mentorship program 2027\" with our SEO."),("Do you run admission campaigns?","Yes, on Google and Instagram, timed to exam and admission dates."),("Can you build a course website?","Yes, including course pages, payments and student logins.")], "Education"),
 I("real-estate","Real Estate &amp; B2B Spaces","ads","Marketing for Real Estate, Industrial Parks and Coworking.","Reach the right buyers and tenants at a low cost, and show your space before they visit.",
  [("Small, hard-to-reach audience","Business buyers and investors are a tiny group.","B2B ad audiences on Meta and Google that reach decision makers cheaply.",A_),
   ("People want to see the space","Photos don't show the vibe or the scale.","Commercial reels and walkthrough films of the property or space.",V_),
   ("Lots of junk leads","Many enquiries are just browsing.","Lead forms with qualifying questions and a landing page per project.",W_),
   ("Local searches matter","\"Coworking near me\" and \"plots in [area]\" drive visits.","Local SEO and Google profiles for each site or location.",S_)],
  ["allied-industrial-park","workstation-coworking"],
  [("Can you reach business owners?","Yes. Allied Industrial Park reached 2.02M B2B users at ₹3.75 CPM."),("Do you shoot property videos?","Yes: walkthroughs, commercial reels and drone shots when allowed."),("Do you make project landing pages?","Yes, one page per project with a lead form.")], "Real estate"),
 I("hotels-travel","Hotels &amp; Travel","feed","Marketing for Hotels, Homestays and Travel Brands.","Get more direct bookings, fewer OTA commissions, and content that makes people want to visit.",
  [("Paying big OTA commissions","Most bookings come through MakeMyTrip or Booking.com.","A direct-booking website with offers that beat the OTA price.",W_),
   ("Guests decide by looks","Travellers book what looks beautiful on Instagram.","Cinematic property reels and room videos that sell the stay.",V_),
   ("Seasonal demand","Bookings spike and drop with seasons and holidays.","Ads planned around long weekends, festivals and travel seasons.",A_),
   ("Not showing on Maps","Travellers search \"hotels near me\" on arrival.","A complete Google profile with photos, reviews and local SEO.",S_)],
  [],
  [("Can you increase direct bookings?","Yes, with a booking-focused website, ads and retargeting."),("Do you shoot hotel videos?","Yes: rooms, food, experiences and the property."),("Do you manage reviews?","We help you get more reviews and reply to them properly.")], "Hotels"),
 I("fashion-lifestyle","Fashion &amp; Lifestyle","feed","Marketing for Fashion, Lifestyle and Gifting Brands.","Look premium on Instagram, sell through your store, and own every festive season.",
  [("Looking premium","Cheap-looking content makes good products look cheap.","Cinematic shoots with models, sets and lighting that match your price point.",V_),
   ("Festive rush","Most sales happen around Diwali, weddings and gifting days.","A festive content and ad calendar planned months ahead.",M_),
   ("Ads stop working","The same creative burns out in weeks.","New ad cuts every month and constant testing of hooks and offers.",A_),
   ("Store doesn't sell","Visitors browse but don't buy.","A store with strong product pages, reviews and easy checkout.",W_)],
  ["luxury-club","the-attic-storey"],
  [("Do you shoot with models?","Yes. We cast models to fit your brand and handle the full shoot."),("Can you plan festive campaigns?","Yes. We plan content and ads around every big season."),("Do you work with Shopify?","Yes. We build and improve Shopify stores.")], "Fashion"),
 I("beauty-salons","Beauty &amp; Salons","seo","Marketing for Salons, Barbers and Beauty Brands.","Fill your appointment book with people nearby, and show off your work every week.",
  [("People pick the nearest good one","\"Salon near me\" decides most bookings.","Local SEO and a strong Google profile with real reviews and photos.",S_),
   ("No easy way to book","People leave if they have to call.","A website with prices and a simple booking button or WhatsApp link.",W_),
   ("Your work isn't shown well","Great haircuts lose to better photos.","Before-and-after reels and transformation videos.",M_),
   ("Slow weekdays","Weekends are full. Weekdays are empty.","Local offers on Instagram and Google aimed at weekday slots.",A_)],
  ["uk-barber","shigeru-beauty"],
  [("Do you work with single salons?","Yes. Many of our clients are single-location businesses."),("Can you set up online booking?","Yes, through your website or WhatsApp."),("Do you help with Google reviews?","Yes. We set up a simple way for happy customers to leave reviews.")], "Beauty"),
 I("food-drinks","Food &amp; Drinks","dm","Marketing for Cafés, Restaurants and Cloud Kitchens.","Get found when people are hungry, show food that looks irresistible, and fill tables on slow days.",
  [("Hungry people search Maps","\"Cafe near me\" is a decision made in seconds.","Google profile, menu, photos and reviews kept fresh and complete.",S_),
   ("Food photos fall flat","Phone photos don't do your food justice.","Food shoots and short reels that make people want to visit now.",V_),
   ("High aggregator commissions","Zomato and Swiggy take a big cut.","Instagram and WhatsApp ordering for regulars, plus direct offers.",M_),
   ("Empty tables on weekdays","Weekends are packed, weekdays are not.","Local ads with weekday offers aimed at people nearby.",A_)],
  [],
  [("Can you shoot our menu?","Yes: food photography and short reels."),("Do you run ads for restaurants?","Yes, local ads aimed at people within a few kilometres."),("Can you manage our Instagram?","Yes, including stories, reels and replies to DMs.")], "Food"),
 I("professional-services","Professional Services","site","Marketing for Consultants, CAs, Lawyers and Agencies.","Look trustworthy online, rank for what clients search, and get enquiries from the right businesses.",
  [("Trust comes first","Clients judge you by your website before they call.","A professional website with clear services, proof and an easy way to contact you.",W_),
   ("Hard to stand out","Every firm says the same thing.","Helpful articles and pages that show you know your stuff, and rank on Google.",S_),
   ("Referrals aren't enough","Word of mouth is slow and unpredictable.","Google ads for high-intent searches that bring new clients each month.",A_),
   ("No time for social media","Busy professionals rarely post.","A simple LinkedIn and Instagram plan we run for you.",M_)],
  ["west-coast-services","123-consulting"],
  [("Do you work with UK businesses?","Yes. West Coast Services in the UK is one of our clients."),("Can you write our content?","Yes. We write it, and you check it for accuracy."),("Do you build lead systems?","Yes: forms, CRM and admin panels to manage enquiries.")], "Services"),
 I("automotive","Automotive","site","Marketing for Car Detailing, Garages and Dealers.","Get bookings from people nearby, show off your work, and manage customers properly.",
  [("Bookings by phone only","Calls get missed and details get lost.","A website with packages and online booking, plus a CRM for your team.",W_),
   ("\"Near me\" searches","People search for car wash and detailing nearby.","Local SEO and a Google profile with real before-and-after photos.",S_),
   ("Work looks the same in photos","A shiny car is hard to show in a photo.","Satisfying before-and-after reels that people love to watch.",V_),
   ("Repeat customers forget you","Cars need care every few months.","WhatsApp reminders and offers for past customers.",M_)],
  ["the-drive-clinic"],
  [("Can you build a booking system?","Yes. The Drive Clinic uses a website and CRM we built."),("Do you do local SEO for garages?","Yes, so you show up in \"near me\" searches."),("Can you shoot our work?","Yes, before-and-after reels and detailing videos.")]),
]
for _i in INDS: _i["cases"] = [c["id"] for c in CASES if c["ind"] == _i["id"]]
IND_BY = {i["id"]: i for i in INDS}
ALL_SECTORS = [(i["id"], i["name"]) for i in INDS]

# ---------------------------------------------------------------- locations
def L(id, name, zone, h1, sub, land, biz, chal, searches, near, case, office=False, parent=("Delhi","delhi")):
    return dict(id=id, name=name, zone=zone, h1=h1, sub=sub, land=land, biz=biz, chal=chal, searches=searches, near=near, case=case, office=office, parent=parent)
LOCS = [
 L("delhi","Delhi","Delhi NCR","Digital Marketing Agency in Delhi.","A Delhi team based in Dwarka, working with businesses across the city and NCR.",
  "Delhi is many markets in one: shops and markets, doctors and clinics, schools, hotels, and lots of family businesses coming online. What people search changes from one area to the next, and they search in Hindi, English and Hinglish. We plan around the areas and the people that matter to your business.",
  ["Retail + markets","Clinics","Coaching","Restaurants","Real estate","Startups"],
  [("Very local searches","People search by area, not just \"Delhi\".","A page and Google profile for each area you serve.",S_),("Mixed languages","Hindi, English or Hinglish, depending on the customer.","Content and ads written the way your customers talk.",M_),("Old businesses going online","Great offline brands with weak websites.","A website that matches the trust you've built offline.",W_)],
  ["digital marketing agency in delhi","seo company delhi","website design delhi"],[("Dwarka","dwarka"),("Janakpuri","janakpuri"),("Connaught Place","connaught-place"),("Gurugram","gurugram")],"the-attic-storey", parent=None),
 L("dwarka","Dwarka","South West Delhi","Digital Marketing Agency in Dwarka.","Our office is in Dwarka. We work with businesses across Delhi NCR, in person or online.",
  "Dwarka is full of local businesses: clinics, schools, coaching centres, gyms, salons, cafés and shops. And it's growing fast, with new homes coming up along Dwarka Expressway. Most people here search on their phones, check Google Maps and Instagram, and message on WhatsApp before they visit. So a strong Maps listing, a fast website and quick replies matter more than big ad budgets.",
  ["Clinics","Schools + coaching","Gyms","Salons","Cafés","Real estate"],
  [("Fighting for Google Maps","Many businesses want the same \"near me\" searches.","Local SEO for your sector, so you rank in the Maps top 3.",S_),("New people moving in","New residents are picking their first gym, clinic and school.","Instagram and Meta ads aimed at new societies and sectors.",A_),("WhatsApp first","People message before they call.","Fast DM and WhatsApp replies, handled by our team.",M_)],
  ["gym in dwarka","clinic near dwarka sector 12","coaching in dwarka"],[("Delhi","delhi"),("Janakpuri","janakpuri"),("Uttam Nagar","uttam-nagar"),("Gurugram","gurugram")],"thrive-gym", office=True),
 L("janakpuri","Janakpuri","West Delhi","Digital Marketing in Janakpuri.","Ten minutes from our Dwarka office. We help Janakpuri businesses get found and get more enquiries.",
  "Janakpuri is one of West Delhi's busiest areas, with its District Centre, hospitals and clinics, coaching institutes and family-run shops. Many customers are families who compare reviews before they choose. Good reviews, a clear website and fast replies win here.",
  ["Hospitals + clinics","Coaching","Retail","Restaurants","Offices"],
  [("Lots of clinics nearby","Patients compare doctors on Google first.","Google profile, reviews and local pages for each speciality.",S_),("Coaching competition","Many institutes run the same ads.","Ads timed to admission season with clear results and offers.",A_),("Older websites","Many local sites look dated on phones.","A fast, modern website that builds trust.",W_)],
  ["dentist in janakpuri","coaching in janakpuri","restaurant janakpuri district centre"],[("Dwarka","dwarka"),("Uttam Nagar","uttam-nagar"),("Rajouri Garden","rajouri-garden")],"10q-challenge"),
 L("uttam-nagar","Uttam Nagar","West Delhi","Digital Marketing in Uttam Nagar.","Right next to Dwarka. We help Uttam Nagar businesses grow with local search, ads and social media.",
  "Uttam Nagar is busy and packed with local shops, coaching centres, clinics and small businesses that serve a huge local population. People here are price-aware and decide fast, often on WhatsApp. Being easy to find and quick to reply makes the biggest difference.",
  ["Coaching","Shops","Clinics","Gyms","Local services"],
  [("Price-aware customers","People compare prices before visiting.","Clear offers and prices in ads and on your Google profile.",A_),("Hard to stand out","Many similar shops on the same road.","Reels that show your shop, team and work.",M_),("Not on Google Maps","Many shops have incomplete listings.","A full Google profile with photos, hours and reviews.",S_)],
  ["coaching in uttam nagar","gym uttam nagar","shop near uttam nagar metro"],[("Dwarka","dwarka"),("Janakpuri","janakpuri")],"thrive-gym"),
 L("rajouri-garden","Rajouri Garden","West Delhi","Digital Marketing in Rajouri Garden.","For Rajouri Garden's fashion stores, restaurants and malls. A team just a short drive away in Dwarka.",
  "Rajouri Garden is one of West Delhi's biggest shopping and food spots, with its main market, malls and lots of restaurants. Shoppers here follow trends on Instagram and check out new places before they go. Great content and strong local search bring footfall.",
  ["Fashion","Restaurants","Jewellery","Salons","Retail"],
  [("Trend-driven shoppers","People discover new stores on Instagram.","Reels and shoots that make your store a must-visit.",V_),("Weekend crowds, slow weekdays","Footfall drops midweek.","Local ads with weekday offers.",A_),("Big brands nearby","Mall brands have bigger budgets.","Local SEO so you win \"near me\" searches anyway.",S_)],
  ["boutique in rajouri garden","restaurant rajouri garden","salon rajouri garden"],[("Janakpuri","janakpuri"),("Karol Bagh","karol-bagh"),("Pitampura","pitampura")],"luxury-club"),
 L("rohini","Rohini","North West Delhi","Digital Marketing in Rohini.","We help Rohini businesses, from clinics to coaching centres, show up when locals search.",
  "Rohini is a huge, planned area split into many sectors, with schools, coaching centres, hospitals, restaurants and shopping areas. People search by sector, like \"clinic in Rohini sector 7\". So local pages and a strong Maps listing for your exact sector matter a lot.",
  ["Schools + coaching","Clinics","Restaurants","Gyms","Retail"],
  [("Sector-level searches","People search for their own sector.","Local pages and Google profile set up for your sector and nearby ones.",S_),("Many schools and coaching","Parents compare a lot.","A website with results, reviews and an easy enquiry form.",W_),("Families on Instagram","Parents and students both use Instagram.","Helpful content that parents and students share.",M_)],
  ["coaching in rohini sector 7","clinic in rohini","gym rohini"],[("Pitampura","pitampura"),("Delhi","delhi")],"10q-challenge"),
 L("pitampura","Pitampura","North West Delhi","Digital Marketing in Pitampura.","For Pitampura's offices, restaurants and clinics, including the Netaji Subhash Place business hub.",
  "Pitampura mixes busy homes with Netaji Subhash Place, a big office and commercial hub, plus lots of restaurants and clinics. Office teams search for places nearby at lunch and after work, and local businesses compete for the same searches.",
  ["Offices","Restaurants","Clinics","Coaching","Real estate"],
  [("Office crowd at NSP","Office workers search during the day.","Ads and Maps listings aimed at the lunch and after-work crowd.",A_),("B2B businesses","Offices need to look credible online.","A professional website and LinkedIn presence.",W_),("Busy food scene","Many restaurants compete nearby.","Food reels and Google profile with fresh photos.",V_)],
  ["restaurant netaji subhash place","office space pitampura","clinic pitampura"],[("Rohini","rohini"),("Rajouri Garden","rajouri-garden")],"workstation-coworking"),
 L("karol-bagh","Karol Bagh","Central Delhi","Digital Marketing in Karol Bagh.","For Karol Bagh's shops, wholesalers, hotels and wedding businesses.",
  "Karol Bagh is one of Delhi's oldest and biggest markets, famous for wedding wear, jewellery, electronics and budget hotels. Many shops are family businesses with loyal customers but weak online presence. Going online opens up customers from across Delhi and India.",
  ["Wedding wear","Jewellery","Electronics","Hotels","Wholesale"],
  [("Great shop, weak online presence","Loyal customers, but no website or Instagram.","A website and Instagram that match the shop's reputation.",W_),("Wedding season rush","Most sales happen in a few months.","Wedding-season ads and content planned ahead.",A_),("Hotels on OTAs","Most bookings come through booking sites.","Google profile and direct-booking setup for hotels.",S_)],
  ["bridal lehenga karol bagh","hotel in karol bagh","jewellery shop karol bagh"],[("Connaught Place","connaught-place"),("Rajouri Garden","rajouri-garden")],"luxury-club"),
 L("connaught-place","Connaught Place","Central Delhi","Digital Marketing in Connaught Place.","For CP's offices, restaurants, bars and retail brands in the heart of Delhi.",
  "Connaught Place is Delhi's central business district: offices, startups, famous restaurants and bars, and big retail brands. Competition is high, customers are premium, and people discover places on Instagram and Google before they go out.",
  ["Restaurants + bars","Offices","Startups","Retail","Hotels"],
  [("Premium competition","Everyone in CP looks good online.","Cinematic content and a premium website that holds up.",V_),("Discovery on Instagram","Diners decide based on reels.","Reels, collabs and a steady posting plan.",M_),("Expensive ads","CP keywords cost more.","Tight ads aimed at the right times and people.",A_)],
  ["restaurant in connaught place","coworking connaught place","bar in cp delhi"],[("Karol Bagh","karol-bagh"),("Delhi","delhi")],"workstation-coworking"),
 L("lajpat-nagar","Lajpat Nagar","South Delhi","Digital Marketing in Lajpat Nagar.","For Lajpat Nagar's market shops, clinics and fashion brands.",
  "Lajpat Nagar's Central Market is one of South Delhi's busiest, known for fashion, wedding shopping and home decor, with lots of clinics and local services around it. Many shoppers check Instagram and Google first to see what's new.",
  ["Fashion","Wedding shopping","Home decor","Clinics","Food"],
  [("Crowded market","Hundreds of shops sell similar things.","A clear brand and reels that make your shop stand out.",M_),("Shoppers check online first","People look you up before visiting.","A strong Google profile and website.",S_),("Festival peaks","Diwali and wedding season bring most sales.","Festive ad campaigns planned ahead.",A_)],
  ["boutique lajpat nagar","clinic in lajpat nagar","home decor lajpat nagar"],[("Saket","saket"),("Nehru Place","nehru-place")],"luxury-club"),
 L("saket","Saket","South Delhi","Digital Marketing in Saket.","For Saket's premium brands, restaurants, hospitals and studios.",
  "Saket is a premium South Delhi area with big malls, major hospitals, restaurants and fitness studios. Customers here expect brands to look polished, and they compare reviews closely before they book or buy.",
  ["Restaurants","Hospitals + clinics","Fitness studios","Fashion","Salons"],
  [("High expectations","People judge you by how premium you look.","Premium shoots and a website that feels high-end.",V_),("Review-driven decisions","Ratings decide bookings.","Review systems and a strong Google profile.",S_),("Busy, premium audience","Hard to get attention.","Targeted Meta ads with strong hooks.",A_)],
  ["fitness studio saket","restaurant near select citywalk","dermatologist saket"],[("Lajpat Nagar","lajpat-nagar"),("Vasant Kunj","vasant-kunj")],"thrive-gym"),
 L("vasant-kunj","Vasant Kunj","South West Delhi","Digital Marketing in Vasant Kunj.","Close to our Dwarka office. For Vasant Kunj's premium homes, malls and businesses.",
  "Vasant Kunj is a premium residential area near the airport, with malls, schools, clinics and lots of home-service businesses. Residents here research online, value quality and pay for convenience.",
  ["Home services","Clinics","Schools","Restaurants","Fitness"],
  [("Premium, research-heavy buyers","People compare a lot before choosing.","A detailed website with reviews and clear pricing.",W_),("Local service searches","\"Near me\" searches decide home services.","Local SEO for Vasant Kunj and nearby areas.",S_),("Hard to reach residents","Gated societies are hard to market to.","Location-targeted Instagram and Meta ads.",A_)],
  ["salon vasant kunj","clinic in vasant kunj","home cleaning vasant kunj"],[("Saket","saket"),("Dwarka","dwarka")],"the-attic-storey"),
 L("nehru-place","Nehru Place","South Delhi","Digital Marketing in Nehru Place.","For Nehru Place's IT companies, offices and tech sellers.",
  "Nehru Place is Delhi's IT and electronics hub, full of tech sellers, service centres, startups and offices. Buyers here are often businesses, and they search, compare and ask for quotes online.",
  ["IT + electronics","Offices","Startups","B2B services"],
  [("B2B buyers","Businesses compare suppliers online.","A professional website with clear services and quote forms.",W_),("Price-led competition","Lots of sellers offer the same thing.","SEO for specific products and services you're best at.",S_),("Low-trust market","Buyers worry about quality.","Content that shows your team, reviews and guarantees.",M_)],
  ["laptop repair nehru place","it company nehru place","office space nehru place"],[("Lajpat Nagar","lajpat-nagar"),("Saket","saket")],"west-coast-services"),
 L("laxmi-nagar","Laxmi Nagar","East Delhi","Digital Marketing in Laxmi Nagar.","For Laxmi Nagar's coaching institutes, shops and local businesses.",
  "Laxmi Nagar is East Delhi's big coaching hub, especially for commerce and competitive exams, with busy markets around it. Students research institutes online and on YouTube and Instagram before they join.",
  ["Coaching","Retail","Clinics","Food","Local services"],
  [("Coaching competition","Dozens of institutes on the same streets.","SEO for course-specific searches where you can rank.",S_),("Students decide online","They watch reels and read reviews first.","Useful reels and student stories.",M_),("Admission season","Most joins happen in a short window.","Ads timed to admission and exam dates.",A_)],
  ["ca coaching laxmi nagar","coaching in laxmi nagar","pg near laxmi nagar"],[("Noida","noida"),("Delhi","delhi")],"10q-challenge"),
 L("gurugram","Gurugram","Haryana · NCR","Digital Marketing for Businesses in Gurugram.","We work with Gurugram businesses from our Dwarka office, just across Dwarka Expressway. Happy to meet in person.",
  "Gurugram has offices, online brands and fast-growing housing sectors along Golf Course Extension and Dwarka Expressway. People here compare a lot and research online before they buy. They expect brands to look premium. Marketing that works here looks polished and brings in leads you can measure.",
  ["Offices + startups","D2C brands","Gyms","Real estate","Restaurants"],
  [("High expectations","People judge you by your website and Instagram first.","A premium website and content that hold up.",W_),("New housing sectors","New homes mean new local customers.","Ads aimed at new societies along the Expressway.",A_),("Expensive ads","Popular categories cost more per click.","SEO to bring steady traffic without paying per click.",S_)],
  ["gym in gurugram sector 102","interior designer gurugram","digital marketing agency gurugram"],[("Dwarka","dwarka"),("Delhi","delhi")],"thrive-gym", parent=None),
 L("noida","Noida","Uttar Pradesh · NCR","Digital Marketing for Businesses in Noida.","We work with Noida businesses online and in person, from our Delhi team.",
  "Noida is full of IT companies, startups, offices and big housing sectors. Business buyers search for services online, and residents search by sector for everything from gyms to schools.",
  ["IT + startups","Offices","Real estate","Schools","Gyms"],
  [("B2B competition","Many companies offer the same service.","SEO and a website that make you the clear choice.",S_),("Sector-level searches","People search by sector.","Local pages and Google profiles per location.",W_),("Busy professionals","Hard to get attention on social.","Targeted Meta and Google ads.",A_)],
  ["it company noida sector 62","gym noida","coworking noida"],[("Laxmi Nagar","laxmi-nagar"),("Delhi","delhi")],"allied-industrial-park", parent=None),
]
LOC_BY = {l["id"]: l for l in LOCS}
DELHI_AREAS = [l for l in LOCS if l["parent"]]

ARTS = [
 ("seo-cost-india","How Much Does SEO Cost in India?","SEO","9 min","10 Nov 2026","SEO cost",""),
 ("choose-agency","How to Choose the Right Digital Marketing Agency in India","Digital Marketing","8 min","6 Nov 2026","Picking an agency","c"),
 ("google-vs-meta","Google Ads vs Meta Ads for Indian Businesses","Ads","7 min","4 Nov 2026","Google vs Meta","l"),
 ("website-mistakes","Common Website Mistakes That Reduce Enquiries","Websites","6 min","30 Oct 2026","Website mistakes",""),
 ("content-calendar","How to Build a Social Media Content Calendar","Social Media","8 min","27 Oct 2026","Content calendar","l"),
 ("local-seo-delhi","Local SEO Strategies for Businesses in Delhi","Local SEO","7 min","23 Oct 2026","Local SEO","c"),
 ("seo-vs-paid","SEO vs Paid Advertising: What Should Your Business Invest In?","Business Growth","6 min","20 Oct 2026","SEO vs Ads",""),
 ("startup-presence","How Startups Can Build Their Digital Presence","Business Growth","6 min","16 Oct 2026","Startups online","c"),
 ("social-trust","How Social Media Management Helps Businesses Build Trust","Social Media","5 min","13 Oct 2026","Trust","l"),
]
ART_BY_TITLE = {a[1]: a for a in ARTS}
def ahref(a): return "insights-seo-cost-india" if a[0] == "seo-cost-india" else "insights"

# ---------------------------------------------------------------- chrome
def header():
    svc_links = "".join(f'<a href="#services-{s["id"]}"><b>{s["name"]}</b><span>{s["line"]}</span></a>' for s in SVC)
    msvc = "".join(f'<a href="#services-{s["id"]}">{s["name"]}</a>' for s in SVC)
    return f'''<a class="skip" href="#main">Skip to content</a><div class="pbar" aria-hidden="true"></div><div class="sprog" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
<div class="cur" aria-hidden="true"><div class="cur-ring"><svg viewBox="0 0 100 110" preserveAspectRatio="none"><path d="M3 108 V54 C3 27 23 9 50 3 C77 9 97 27 97 54 V108 Z" vector-effect="non-scaling-stroke"/></svg><span>View</span></div><div class="cur-dot"></div></div>
<div class="curtain" aria-hidden="true"><svg class="dome" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 30.5 C0 13 22 2 50 0 C78 2 100 13 100 30.5 Z" fill="#191919"/><path d="M0 30 C0 13 22 2 50 0 C78 2 100 13 100 30" fill="none" stroke="#D3E45B" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg><div class="cbody"><div class="cmark">{mark(46)}</div><div class="ctitle sf">AegisKoncept</div></div></div>
<header class="site-h"><div class="in hrow">
<nav class="nav navl" aria-label="Main"><a href="#about" data-nav="about">About</a>
<div class="dd" data-nav="services"><button type="button" aria-expanded="false">Services ▾</button>
<div class="mega"><div class="mlist">{"".join(f'<a class="mi{" on" if n==0 else ""}" href="#services-{x["id"]}" data-i="{n}"><span class="mic"><svg viewBox="0 0 100 110" aria-hidden="true"><path d="{ARCH_O}"/></svg></span><span class="mt"><b>{x["name"]}</b><small>{x["line"]}</small></span><span class="ma" aria-hidden="true">→</span></a>' for n,x in enumerate(SVC))}</div>
<div class="mprev">{"".join(f'<div class="mp{" on" if n==0 else ""}" data-i="{n}">{vis(x["vis"],cls="r43")}</div>' for n,x in enumerate(SVC))}
<p class="xs" style="color:var(--mute-d)">Most clients start with one service and add a second as they grow.</p>
<div class="mcta"><a class="btn b-l" href="#services" style="min-height:44px;padding:0 18px">All services</a><a class="tl" href="#contact">Get a quote</a></div></div></div></div>
<a href="#our-work" data-nav="our-work">Our Work</a><a href="#videos" data-nav="videos">Videos</a></nav>
<a class="logo clogo" href="#home" aria-label="AegisKoncept home">{mark(28)}<span class="sf">AegisKoncept</span></a>
<div class="navr"><nav class="nav" aria-label="More"><a href="#industries" data-nav="industries">Industries</a><a href="#insights" data-nav="insights">Blog</a><a href="#contact" data-nav="contact">Contact</a></nav>
<div class="h-cta"><a class="btn b-l" href="#contact" style="min-height:46px">Let's Talk</a><button class="burger" type="button" aria-expanded="false" aria-controls="mnav"><span class="bl" aria-hidden="true"><i></i><i></i></span><span class="bt">Menu</span></button></div></div></div></header>
<nav class="mnav" id="mnav" aria-label="Mobile"><div class="mn-in">
<a class="mn-l" style="--d:0" href="#home" data-m="home"><span>Home</span><i>→</i></a>
<a class="mn-l" style="--d:1" href="#about" data-m="about"><span>About</span><i>→</i></a>
<div class="mn-acc"><button class="mn-l mn-tg" style="--d:2" type="button" aria-expanded="false" data-m="services"><span>Services</span><i>+</i></button>
<div class="mn-sub"><div>{"".join(f'<a href="#services-{x["id"]}"><b>{x["name"]}</b><small>{x["line"]}</small></a>' for x in SVC)}<a class="mn-all" href="#services">See all services →</a></div></div></div>
<a class="mn-l" style="--d:3" href="#our-work" data-m="our-work"><span>Our Work</span><i>→</i></a>
<a class="mn-l" style="--d:4" href="#videos" data-m="videos"><span>Videos</span><i>→</i></a>
<a class="mn-l" style="--d:5" href="#industries" data-m="industries"><span>Industries</span><i>→</i></a>
<a class="mn-l" style="--d:6" href="#insights" data-m="insights"><span>Blog</span><i>→</i></a>
<a class="mn-l" style="--d:7" href="#locations" data-m="locations"><span>Locations</span><i>→</i></a>
<a class="mn-l" style="--d:8" href="#contact" data-m="contact"><span>Contact</span><i>→</i></a>
<div class="mn-foot" style="--d:9"><a class="btn b-l" href="#contact">Get a Free Quote</a><a class="btn b-o" href="{WA}" target="_blank" rel="noopener">WhatsApp Us</a>
<p class="xs" style="color:var(--mute-d);margin-top:6px">hello@aegiskoncept.com · Dwarka, New Delhi</p></div></div>
<svg class="mn-deco" viewBox="0 0 100 110" aria-hidden="true"><path d="M0 110 V54 C0 26 22 8 50 0 C78 8 100 26 100 54 V110" fill="none" stroke="#2E2C2A" stroke-width=".6"/><path d="M16 110 V57 C16 36 31 22 50 15 C69 22 84 36 84 57 V110" fill="none" stroke="#2E2C2A" stroke-width=".6"/><path d="M32 110 V60 C32 47 39 37 50 31 C61 37 68 47 68 60 V110" fill="none" stroke="#3A3734" stroke-width=".6"/></svg></nav>'''

def footer():
    return f'''<footer class="site-f"><div class="in">
<a class="big" href="#contact">Got a goal?<br><span>Let's talk.</span></a>
<div class="grid"><div class="stack" style="gap:16px"><a class="logo" href="#home">{mark(28)}<span class="sf" style="font-size:30px">AegisKoncept</span></a>
<p class="sm" style="color:var(--mute-d);max-width:28em">Websites, SEO, ads and social media for growing Indian businesses. One team, based in Dwarka, New Delhi.</p></div>
<div><h4>Services</h4><ul>{"".join(f'<li><a href="#services-{s["id"]}">{s["nav"]}</a></li>' for s in SVC)}</ul></div>
<div><h4>Industries</h4><ul>{"".join(f'<li><a href="#industries-{i["id"]}">{i["name"]}</a></li>' for i in INDS[:7])}<li><a href="#industries">All industries →</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="#about">About</a></li><li><a href="#our-work">Our Work</a></li><li><a href="#videos">Videos</a></li><li><a href="#insights">Blog</a></li><li><a href="#contact">Contact</a></li></ul></div>
<div><h4>Say hello</h4><ul><li>hello@aegiskoncept.com</li><li>+91 73034 68073</li><li><a href="{WA}" target="_blank" rel="noopener">WhatsApp us</a></li><li>Dwarka, New Delhi 110075</li></ul></div></div>
<div class="floc"><h4>Locations</h4><div class="floc-l"><a href="#locations-delhi"><b>Digital Marketing in Delhi</b></a>{"".join(f'<a href="#locations-{l["id"]}">{l["name"]}</a>' for l in DELHI_AREAS)}<a href="#locations-gurugram">Gurugram</a><a href="#locations-noida">Noida</a><a href="#locations">All locations →</a></div></div>
<div class="base"><span>© 2026 AegisKoncept</span><span style="display:flex;gap:20px;flex-wrap:wrap"><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a><a href="#privacy-policy">Privacy</a><a href="#terms-and-conditions">Terms</a><a href="#cookie-policy">Cookies</a></span></div></div></footer>
<div class="wa-bar"><a class="btn b-o" style="color:var(--cream)" href="{WA}" target="_blank" rel="noopener">WhatsApp</a><a class="btn b-l" href="#contact">Let's Talk</a></div>'''

def case_card(c, cls="r54"):
    return f'''<a class="case rv" href="#our-work-{c["id"]}">{case_vis(c, cls)}<span class="xs mu">{IND_BY[c["ind"]]["name"]} · {" + ".join(c["svcs"])}</span><span class="sf h3">{c["client"]}</span><span class="mu">{c["one"]}</span></a>'''

def did_list(c):
    return '<div style="display:flex;flex-wrap:wrap;gap:8px">' + "".join(f'<span class="chip">{d}</span>' for d in c["did"]) + '</div>'

def art_rows(items):
    return "".join(f'''<a class="art-row" href="#{ahref(a)}" data-cat="{a[2]}">{cover(a[5],a[6],"r43")}<div class="stack" style="gap:6px"><span class="xs mu">{a[2]} · {a[4]}</span><span class="sf h3">{a[1]}</span></div><span class="rt mu sm" style="text-align:right">{a[3]} read →</span></a>''' for a in items)

def steps(items):
    return "".join(f'<div class="step rv"><span class="n tab">{i+1}</span><div class="stack" style="gap:6px"><span class="sf h3">{t}</span><span class="mu">{d}</span></div></div>' for i, (t, d) in enumerate(items))

# ---------------------------------------------------------------- client logos
import base64
_LD=os.path.join(os.path.dirname(__file__),"logos")
LOGOS=[("26a50833","Thrive Gym",58),("bada290e","West Coast Services",58),("3dd9ad49","Eco Utilities",34),
 ("56e25337","UK Barber",62),("88f9434f","Pot & Bloom",44),("a5f3fa1c","The Attic Storey",62),("f03c9f15","The Drive Clinic",40),("1539c868","Luxury Club",60),("2306283a","Allied Industrial Park",64),("e0c7efa9","10Q Challenge",66)]
def _logo(f,alt,h,dup=False):
    b=base64.b64encode(open(os.path.join(_LD,f+".png"),"rb").read()).decode()
    return f'<span class="lgi" role="{"presentation" if dup else "listitem"}"><img src="data:image/png;base64,{b}" alt="{"" if dup else alt}" style="height:{h}px" loading="eager"></span>'
LOGO_STRIP="".join(_logo(*l) for l in LOGOS)
LOGO_CSS="".join(".lgo-%s{background-image:url(data:image/png;base64,%s)}" % (f, base64.b64encode(open(os.path.join(_LD,f+".png"),"rb").read()).decode()) for f,_,_ in LOGOS)
LOGO_STRIP_DUP="".join(_logo(*l,dup=True) for l in LOGOS)

# ---------------------------------------------------------------- pages
P = []
slides = [
 ("site","Website Design &amp; Development",["Websites","People Love","to Use."],"Fast, good-looking websites that make it easy for people to contact you.","#services-website-development-design","Website"),
 ("seo","SEO",["Show Up First","on Google."],"Be the business people find when they search on Google and Google Maps.","#services-seo","SEO"),
 ("ads","Google + Meta Ads",["Ads That Bring","Real Customers."],"Ads on Google, Instagram and Facebook, measured on leads, not likes.","#services-performance-marketing","Ads (Google / Meta)"),
 ("dm","Social Media Management",["We Post.","We Reply.","You Grow."],"We make your content, post it, and reply to your DMs and comments too.","#services-social-media-marketing-management","Social Media"),
]
def chars(line, off=0):
    out=[];n=off
    for w in line.split(" "):
        out.append('<span class="w">'+"".join(f'<span class="ch" style="--i:{(n:=n+1)}">{c}</span>' for c in w)+'</span>')
        n+=1
    return " ".join(out)
hs = []
for i, (v, kick, lines, sub, l1, fv) in enumerate(slides):
    hs.append(f'''<div class="hs{' on' if i==0 else ''}" id="slide-{i}" data-svc="{fv}" role="tabpanel" aria-roledescription="slide" aria-label="{i+1} of {len(slides)}"{'' if i==0 else ' aria-hidden="true"'}>
<div class="txt"><span class="kick">{kick}</span><p class="h" aria-label="{" ".join(lines)}">{"".join(f'<span class="ln" aria-hidden="true"><span>{chars(l, sum(len(x)+1 for x in lines[:li]))}</span></span>' for li,l in enumerate(lines))}</p><p class="sub">{sub}</p><div class="row-btn"><a class="btn b-l" href="{l1}">{["Explore Websites","Explore SEO","Explore Ads","Explore Social Media"][i]}</a></div></div>
</div>''')
tabs = "".join(f'<button class="t" type="button" role="tab" aria-selected="{"true" if i==0 else "false"}" aria-controls="slide-{i}" data-i="{i}"><b>0{i+1}</b><span>{n}</span></button>' for i, n in enumerate(["Websites","SEO","Ads","Social media"]))
hero_form = f'''<aside class="hform" aria-labelledby="hf-title"><p class="xs" style="font-weight:600;color:var(--mute-l)">Free · No obligation</p><h2 id="hf-title" class="sf" style="font-size:clamp(30px,2.6vw,40px);line-height:1">Get a Free Quote.</h2>
<p class="sm mu">Tell us what you need. We'll send a clear quote within 1 working day.</p>
<form class="js-form stack" style="gap:14px" novalidate>
<label class="fld" for="h-name">Your name<input id="h-name" autocomplete="name" required><span class="err">Please add your name.</span></label>
<label class="fld" for="h-phone">Phone / WhatsApp<input id="h-phone" type="tel" autocomplete="tel" required><span class="err">Add a number so we can reply.</span></label>
<label class="fld" for="h-svc">What do you need?<select id="h-svc" required>{SERVICES_OPT.replace("<option>Website</option>","<option selected>Website</option>")}</select><span class="err">Pick one, or choose "Not sure yet".</span></label>
<label class="fld" for="h-biz"><span>Business name <span class="mu" style="font-weight:400">(optional)</span></span><input id="h-biz" autocomplete="organization"></label>
<button class="btn b-d" type="submit" style="width:100%">Get My Quote</button><p class="xs mu" style="text-align:center">No spam. A real person will reply.</p></form></aside>'''

REV=[c for c in CASES if c.get("owner")]
HERO_TICK=[("3.51M","Google impressions · 10Q Challenge"),("#1","on Google for \"bitsat mentorship program 2027\""),("100%","plots sold · Allied Industrial Park"),("9,873","Google Maps actions · healthcare clinic"),("2.02M","B2B reach · Allied Industrial Park"),("Position 0","Google's answer · Shigeru Beauty"),("27.3K","organic clicks · 10Q Challenge")]
home = f'''
<section class="hero"><canvas class="hcv" aria-hidden="true"></canvas><span class="spot"></span><span class="bgnum" aria-hidden="true">01</span>
<div class="in hgrid"><div class="hleft" aria-roledescription="carousel" aria-label="Our services"><h1 class="h1s">Creative digital marketing agency in Delhi</h1>
<div class="stagew">{"".join(hs)}</div>
<div class="hbar"><div role="tablist" aria-label="Choose a service" style="display:contents">{tabs}</div><div class="ctl"><button type="button" class="prev" aria-label="Previous slide">←</button><button type="button" class="pp" aria-label="Pause slideshow">❚❚</button><button type="button" class="next" aria-label="Next slide">→</button></div></div></div>
{hero_form}</div>
<div class="htick" aria-label="Recent results"><div class="htr">{"".join(f'<span><b>{n}</b> {t}</span>' for n,t in HERO_TICK*2)}</div></div></section>

<section class="dk logos"><div class="in" style="padding-block:36px 6px"><p class="xs mu">Brands that trust us</p></div>
<div class="marq lg" role="list" aria-label="Our clients"><div>{LOGO_STRIP}{LOGO_STRIP_DUP}</div></div></section>

<section class="dk"><div class="in sec"><p class="scrub sf">We're not another agency on your street. We plan. We create. We <em>stay</em>. So your business keeps <em>growing</em>, month after month, year after year.</p></div></section>

<section class="dk"><div class="in sec"><div class="split" style="align-items:end">
<div class="stack rv" style="gap:22px"><h2 class="sf h2">We Don't Just Do Marketing. We Help You <span class="hl">Grow</span>.</h2>
<p class="ld mu">We start by understanding your business. Then we make things that look great and work hard. And we keep improving them, month after month.</p><a class="tl arr" href="#about">How we work</a></div>
<div class="stack" style="gap:4px">
{"".join(f'<a href="#{h}" style="text-decoration:none;display:flex;justify-content:space-between;align-items:baseline;gap:20px;border-top:1px solid var(--line-d);padding-top:10px"><span class="pill-word{" lime" if w=="Grow" else ""}">{w}</span><span class="sm mu hide-m">{d} →</span></a>' for w,d,h in [("Create","We make your brand look good","services-website-development-design"),("Plan","Every step has a reason","services-seo"),("Grow","More enquiries, more sales","services-performance-marketing")])}
</div></div></div></section>

<section class="wh"><div class="in sec"><div class="stack" style="gap:48px">
<div class="split rv" style="align-items:end"><h2 class="sf h2">Everything You Need to Grow Online.</h2><p class="ld mu">Five services from one team. Start with one. Add more when you're ready.</p></div>
<div>{"".join(f'<a class="svc-row" href="#services-{s["id"]}"><span class="stack" style="gap:10px"><span class="sf h2" style="font-size:clamp(32px,3.4vw,52px)">{s["name"]}</span>{"<span class=tag>We reply to your DMs too</span>" if s["id"].startswith("social") else ""}</span><span class="desc mu ld">{s["line"]}</span><span class="thumb">{vis(s["vis"],cls="r11")}</span><span class="go" aria-hidden="true">→</span></a>' for s in SVC)}</div>
</div></div></section>

<section class="dk hpin"><div class="pin-in"><div class="in pin-head"><h2 class="sf h2">Work We're Proud Of.</h2><a class="tl arr" href="#our-work">See all work</a></div>
<div class="track">{"".join(f'<a class="case wcard" href="#our-work-{c["id"]}">{case_vis(c,"r43")}<span class="xs mu">{IND_BY[c["ind"]]["name"]} · {" + ".join(c["svcs"])}</span><span class="sf h3">{c["client"]}</span><span class="mu">{c["one"]}</span></a>' for c in CASES[:6])}
<a class="wcard wend" href="#our-work"><span class="sf h2">See all<br>our work</span><span class="go">→</span></a></div>
<div class="in"><div class="pin-bar"><span></span></div></div></div></section>

<section class="cr"><div class="in sec"><div class="split">
<div class="stack" style="gap:28px;position:sticky;top:120px"><h2 class="sf h2">Simple Process. Clear Results.</h2><p class="ld mu">No confusing jargon. You'll always know what we're doing and why.</p>
<svg class="arch-draw" viewBox="0 0 100 110" width="180" height="198" aria-hidden="true"><path d="{ARCH_O}" fill="none" stroke="#191919" stroke-width="1.6"/></svg></div>
<div>{steps([("We listen","We learn about your business, your customers and your goals."),("We plan","We make a clear plan that fits your goals and budget."),("We create","Websites, posts, videos and ads, made by our own team."),("We launch","We put everything live and manage it every week."),("We improve","Every month we check what worked and make it better.")])}</div>
</div></div></section>

<section class="dk"><div class="in sec"><div class="split-r">
<div class="stack rv" style="gap:24px"><h2 class="sf h2">Every Month, Like Clockwork.</h2><p class="ld mu">Here's what a normal month of social media looks like with us.</p>
<div class="cols c2">{"".join(f'<div class="stack" style="gap:6px;border-top:1px solid var(--line-d);padding-top:14px"><b>{w}</b><span class="mu sm">{d}</span></div>' for w,d in [("Week 1","We plan the month and share the calendar."),("Week 2","We make the posts. You approve them."),("Weeks 2–4","We post, and reply to DMs and comments."),("Week 4","You get a report and next month's plan.")])}</div>
<p class="note">Other services follow their own monthly cycle.</p></div>
<div class="rv">{vis("cal",cls="r11")}</div></div></div></section>

<section class="dk"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:40px">
<div class="split rv" style="align-items:end"><h2 class="sf h2">Every Industry Is Different.</h2><p class="ld mu">Pick your industry to see the usual problems, how we fix them, and which service does it.</p></div>
<div class="ind-list rv">{"".join(f'<a href="#industries-{i}">{n}<span>→</span></a>' for i,n in ALL_SECTORS)}</div></div></div></section>

<section class="cr"><div class="in sec"><div class="split">
<div class="stack rv" style="gap:24px"><h2 class="sf h2">Why People Work With Us.</h2>
<figure class="stack" style="gap:18px;margin-top:8px"><div class="cols c2" style="max-width:420px;gap:12px"><div class="mono">RK</div><div class="mono" style="background:var(--ink)">YG</div></div>
<blockquote class="big-quote" style="font-size:clamp(26px,2.4vw,34px)">"We started AegisKoncept to be the team we wished small businesses had. One that thinks, creates, and sticks around."</blockquote>
<figcaption class="sm mu">Ritesh Kumar &amp; Yogeesh Gahlot, Founders</figcaption></figure></div>
<div class="stack">{ticks([("We plan before we post","Every month starts with a clear plan."),("Ideas that stand out","Your brand won't look like everyone else's."),("We care about sales","We track enquiries and sales, not just likes."),("You can always reach us","One person who knows your account."),("Monthly reports","You'll always know what's next and why."),("We stick around","We grow with you, from launch to scale."),("Always improving","We test, learn and get better every month.")])}</div>
</div></div></section>

<section class="dk rvw"><div class="in sec"><div class="stack" style="gap:40px"><div class="split rv" style="align-items:end"><h2 class="sf h2">The People Who Trust Us.</h2><p class="ld mu">Real owners, real businesses, in India and the UK. Many have been with us for years.</p></div>
<div class="rvw-g"><div class="rvw-l" role="tablist" aria-label="Clients">{"".join(f'<button class="rvw-n{" on" if n==0 else ""}" role="tab" aria-selected="{"true" if n==0 else "false"}" data-r="{n}" type="button"><span class="sf">{c["owner"][0]}</span><small>{c["client"]}</small><i aria-hidden="true"></i></button>' for n,c in enumerate(REV))}</div>
<div class="rvw-s">{"".join(f'<article class="rvw-i{" on" if n==0 else ""}" data-r="{n}" role="tabpanel" aria-label="{c["owner"][0]}, {c["client"]}"><div class="rvw-top"><span class="rvw-m sf" aria-hidden="true">{"".join(w[0] for w in c["owner"][0].replace("&amp;","").split()[:2])}</span><div class="stack" style="gap:2px"><b class="sf h3">{c["owner"][0]}</b><span class="mu sm">{c["owner"][1]} · {c["client"]} · {c["loc"]}</span></div></div>{(f'<blockquote class="rvw-q sf">“{c["quote"]}”</blockquote>' + ("" if c.get("qok") else f'<span class="qdraft">Draft review · waiting for {c["owner"][0]}’s approval</span>')) if c.get("quote") else f'<p class="rvw-q sf">{c["one"]}</p>'}<div class="rvw-b"><div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<span class="chip">{x}</span>' for x in c["svcs"])}</div><a class="tl arr" href="#our-work-{c["id"]}">Read the story</a></div>{(f'<div class="rvw-st">'+"".join(f'<span><b class="sf">{a}</b><small>{b}</small></span>' for a,b in (c.get("res") or [])[:3])+'</div>') if c.get("res") else ''}</article>' for n,c in enumerate(REV))}
<div class="rvw-bar" aria-hidden="true"><span></span></div></div></div></div></div></section>

<section class="cr"><div class="in sec"><div class="stack" style="gap:40px">
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:24px" class="rv"><h2 class="sf h2" style="max-width:12em">Tips to Grow Your Business.</h2><a class="tl arr" href="#insights">Read the blog</a></div>
<div class="split-r" style="align-items:start"><a class="case rv" href="#insights-seo-cost-india">{cover("SEO cost","","r169")}<span class="xs mu">SEO · 9 min read</span><span class="sf h2">How Much Does SEO Cost in India?</span><span class="mu">What you pay for, what you should get, and what to avoid.</span></a>
<div class="stack">{"".join(f'<a class="case rv" href="#insights" style="padding:22px 0;border-top:1px solid var(--line-l)"><span class="xs mu">{a[2]} · {a[3]} read</span><span class="sf h3">{a[1]}</span></a>' for a in [ARTS[2],ARTS[3],ARTS[4]])}</div></div></div></div></section>
{cta_band("Got a Goal? Let's Make a Plan.","Tell us where your business is today and where you want it to be. We'll reply within 1 working day.")}
'''
P.append(page("home","AegisKoncept · Digital Marketing Agency in Delhi", home))

about = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("About",None)])}
<div class="split-r"><div class="stack" style="gap:24px"><h1 class="sf d1">A Team That Grows With You.</h1><p class="ld">We help Indian businesses grow online. One team for your website, Google, ads and social media, working with you every month.</p></div>
<div class="rv">{vis("brand",cls="rarch")}</div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="split">
<h2 class="sf h2 rv">It Started With Google.</h2>
<div class="stack measure rv" style="gap:20px;font-size:19px"><p>AegisKoncept started in December 2021 with SEO: helping businesses show up on Google. But we kept seeing the same thing. Getting found is only step one. The website has to look trustworthy. The posts have to look like the brand. And someone has to reply when a customer finally sends a message.</p>
<p>So we grew into everything our clients needed: websites, social media, Google and Instagram ads, and the content that ties it all together. Today we work from Dwarka, New Delhi, with businesses across Delhi NCR and India.</p>
<p class="sf h3">Our promise: premium work, at prices growing businesses can afford.</p></div></div></div></section>
<section class="dk"><div class="in sec"><div class="stack" style="gap:40px"><h2 class="sf h2 rv">What We Believe.</h2>
<div class="cols c3">{"".join(f'<div class="stack rv" style="gap:12px;border-top:1px solid var(--line-d);padding-top:20px"><span class="pill-word{" lime" if t=="Grow" else ""}" style="font-size:72px">{t}</span><p class="mu">{d}</p></div>' for t,d in [("Create","Good work gets attention that money alone can't buy."),("Plan","Every post, page and ad should have a reason."),("Grow","Success means more enquiries and more sales.")])}</div></div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:40px"><div class="split rv" style="align-items:end"><h2 class="sf h2">The People Behind the Work.</h2><p class="ld mu">The founders plan your strategy themselves. So you talk to the people doing the thinking.</p></div>
<div class="cols c3">
<div class="stack rv" style="gap:12px"><div class="mono">RK</div><span class="sf h3">Ritesh Kumar</span><span class="mu">Founder · Strategy, SEO and websites</span><a class="tl arr sm" href="#insights-author-ritesh-kumar">Read his articles</a></div>
<div class="stack rv" style="gap:12px"><div class="mono" style="background:var(--ink)">YG</div><span class="sf h3">Yogeesh Gahlot</span><span class="mu">Founder</span></div>
<div class="stack rv" style="gap:12px"><div class="mono" style="background:var(--lime);color:var(--ink)">+</div><span class="sf h3">Our team</span><span class="mu">Designers, writers, developers and ad specialists</span></div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="split"><h2 class="sf h2 rv">Working With Us Is Easy.</h2>
<div>{steps([("Free first chat","We learn about your business and tell you honestly what we'd do."),("Clear proposal","What we'll do, when, and how much. In simple words."),("One contact person","Someone who knows your account inside out."),("Monthly check-ins","A report and a call about what worked and what's next.")])}</div></div></div></section>
{cta_band("Let's Talk About Your Business.","Start with a free chat. No sales pitch. Just honest advice.")}
'''
P.append(page("about","About Us", about))

hub = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Services",None)])}
<div class="split" style="align-items:end"><h1 class="sf d1">How We Can Help.</h1><p class="ld">Five services, one team. Pick what you need today. We'll show you how the rest fits.</p></div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:22px"><h2 class="sf h3 rv">What's your goal?</h2>
<div class="cols c2">{"".join(f'<a class="case rv" href="#services-{s}" style="background:var(--white);padding:32px;gap:10px"><span class="sf h3">"{g}"</span><span class="mu">{SVC_BY[s]["name"]} →</span></a>' for g,s in [("I want my business to look good online.","website-development-design"),("I want to show up on Google.","seo"),("I need more leads, fast.","performance-marketing"),("I want to post regularly and reply to everyone.","social-media-marketing-management"),("I need videos that look premium.","video-production"),("I don't know where to start.","seo")])}</div>
<p class="note">Most clients use two services together, like a new website + SEO, or social media + ads.</p></div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:96px">
{"".join(f'''<div class="split-r rv"><div class="stack" style="gap:18px"><h2 class="sf h2">{s["name"]}</h2><p class="ld mu">{s["sub"]}</p>
<div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f"<span class=chip>{t}</span>" for t,_ in s["inc"])}</div>
<a class="btn b-d" href="#services-{s["id"]}" style="width:fit-content">Learn More</a></div>{vis(s["vis"],lt=True)}</div>''' for s in SVC)}
</div></div></section>
{cta_band("Not Sure Where to Start?","Tell us your goal. We'll tell you the one or two things that will help most.")}
'''
P.append(page("services","Services", hub))

FORM_SVC = {"Website":"Website","SEO":"SEO","Ads":"Ads (Google / Meta)","Social Media":"Social Media","Video":"Video / Shoots"}

def fixrows(rows, light=True):
    """problem -> how we fix it -> which service"""
    return '<div class="fx">' + "".join(f'''<div class="fx-r rv"><div class="fx-p"><span class="xs mu">The problem</span><b class="sf h4">{p}</b>{f'<span class="mu sm">{d}</span>' if d else ''}</div>
<div class="fx-a" aria-hidden="true">→</div><div class="fx-s"><span class="xs mu">How we fix it</span><span>{f}</span>{f'<a class="fx-tag" href="#services-{s}">{SVC_BY[s]["name"]} →</a>' if s else ''}</div></div>''' for p, d, f, s in rows) + '</div>'

def stats(items, dark=True):
    return '<div class="stats">' + "".join(f'<div class="st rv"><span class="sf stn">{n}</span><span class="mu sm">{l}</span></div>' for n, l in items) + '</div>'

for s in SVC:
    other = [x for x in SVC if x["id"] != s["id"]]
    cs = [c for c in CASES if s["short"] in c["svcs"]][:4] or CASES[:2]
    compare = ""
    if s["id"].startswith("social"):
        compare = '''<div class="cols c2 rv" style="margin-bottom:28px"><div class="stack" style="gap:10px;border-top:1px solid var(--line-d);padding-top:16px"><span class="xs mu">Most agencies</span><span>Design posts</span><span>Write captions</span><span>Post on time</span></div>
<div class="stack" style="gap:10px;border-top:2px solid var(--lime);padding-top:16px"><span class="xs" style="color:var(--lime)">We also</span><span>Reply to your DMs</span><span>Reply to comments</span><span>Pass leads to your team</span></div></div>'''
    proof = s["proof"]
    proof_html = "".join(f'''<{"a" if cid else "div"} class="st rv"{f' href="#our-work-{cid}"' if cid else ''} style="text-decoration:none"><span class="sf stn">{n}</span><span class="mu sm">{l}{" →" if cid else ""}</span></{"a" if cid else "div"}>''' for n, l, cid in proof)
    vids = ""
    if s["id"] == S_:
        vids = f'''<section class="dk"><div class="in sec"><div class="stack" style="gap:28px"><div class="split rv" style="align-items:end"><h2 class="sf h2">Real Results. Real Screenshots.</h2><p class="ld mu">Google Search, AI Overviews, Google Maps and Search Console, from our client work.</p></div>
<div class="sgal">{"".join(shotfig(k,cap) for k,cap in [CASE_BY["10q-challenge"]["shots"][1],CASE_BY["10q-challenge"]["shots"][2],CASE_BY["shigeru-beauty"]["shots"][0],CASE_BY["10q-challenge"]["shots"][0],CASE_BY["healthcare-clinic"]["shots"][0],MORE_SEO[3]])}</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<a class="chip" href="#our-work-{x}">{CASE_BY[x]["client"]} →</a>' for x in ["10q-challenge","healthcare-clinic","shigeru-beauty"])}</div></div></div></section>'''
    if s["id"] == V_:
        vids = f'''<section class="dk"><div class="in sec"><div class="stack" style="gap:32px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:24px"><h2 class="sf h2 rv">Watch Our Shoots.</h2><a class="tl arr" href="#videos">All videos</a></div>
<div class="vgrid">{"".join(vcard(v) for v in VIDEOS[:4])}</div></div></div></section>'''
    body = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Services","services"),(s["name"],None)])}
<div class="split-r"><div class="stack" style="gap:24px"><span class="lbl">{s["name"]}</span><h1 class="sf h1">{s["h1"]}</h1><p class="ld">{s["sub"]}</p>
<div class="row-btn"><a class="btn b-l" href="#contact" data-svc="{FORM_SVC[s["short"]]}">Get a Free Quote</a><a class="btn b-o" href="#our-work">See Our Work</a></div></div>
<div class="rv">{vis(s["vis"],cls="rarch")}</div></div>
<div class="stats" style="margin-top:24px">{proof_html}</div></div></div></section>
<section class="cr"><div class="in sec-s"><p class="sf rv" style="max-width:20em;font-size:clamp(30px,3.2vw,46px);line-height:1.12">{s["pos"]}</p></div></section>
<section class="cr"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:32px"><div class="split rv" style="align-items:end"><h2 class="sf h2">Sound Familiar? Here's the Fix.</h2><p class="ld mu">The problems we hear most, and exactly what we do about each one.</p></div>
{fixrows([(f'"{p}"', None, f, None) for p, f in s["pf"]])}</div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:40px"><div class="split rv" style="align-items:end"><h2 class="sf h2">What We Do Inside {s["short"] if s["short"]!="Ads" else "Ads"}.</h2><p class="ld mu">Pick one, or let us combine them into one plan.</p></div>
<div class="subs">{"".join(f'<div class="sub rv"><span class="n tab">0{i+1}</span><b class="sf h3">{t}</b><span class="mu">{d}</span></div>' for i,(t,d) in enumerate(s["subs"]))}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:40px"><h2 class="sf h2 rv">What You Get.</h2>
<div class="cols c4">{"".join(f'<div class="stack rv" style="gap:10px;border-top:2px solid var(--ink);padding-top:18px"><b style="font-size:20px">{t}</b><span class="mu">{d}</span></div>' for t,d in s["inc"])}</div></div></div></section>
<section class="dk"><div class="in sec"><div class="split">
<div class="stack" style="gap:24px;position:sticky;top:120px"><h2 class="sf h2">{s["sig_t"]}</h2><div style="max-width:380px">{vis(s["vis"],cls="r11")}</div></div>
<div>{compare}{ticks(s["sig"])}</div></div></div></section>
{vids}
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">Who It's For.</h2>
<div class="cols c3">{"".join(f'<div class="stack rv" style="gap:8px;border-top:1px solid var(--ink);padding-top:18px"><span class="sf h3">{t}</span><span class="mu">{d}</span></div>' for t,d in s["who"])}</div>
<div class="stack rv" style="gap:14px;margin-top:16px"><span class="xs mu">Industries we do this for</span><div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<a class="chip" href="#industries-{i["id"]}">{i["name"]}</a>' for i in INDS if s["id"] in i["svcs"])}</div></div></div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">How It Works.</h2>
<ol class="cols rv" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));list-style:none;padding:0;border-top:2px solid var(--ink)">{"".join(f'<li class="stack" style="gap:6px;padding-top:18px"><span class="sf" style="font-size:44px;line-height:1">{i+1}</span><b>{p}</b></li>' for i,p in enumerate(s["proc"]))}</ol>
<div class="stack rv" style="gap:12px;margin-top:20px"><span class="xs mu">Tools we use</span><div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<span class="chip">{t}</span>' for t in s["tools"])}</div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="split"><div class="stack rv" style="gap:16px"><h2 class="sf h2">What's Included.</h2><p class="mu">Exact numbers and the price are in your proposal.</p></div>
<div class="tbl rv"><table><thead><tr><th scope="col">What</th><th scope="col">When / how much</th></tr></thead><tbody>{"".join(f"<tr><td>{a}</td><td class='mu'>{b}</td></tr>" for a,b in s["deliv"])}</tbody></table></div></div></div></section>
<section class="dk"><div class="in sec"><div class="stack" style="gap:40px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:24px"><h2 class="sf h2 rv">{s["short"]} Work We've Done.</h2><a class="tl arr" href="#our-work">All work</a></div><div class="cols c2" style="gap:56px 32px">{"".join(case_card(c) for c in cs)}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="split"><div class="stack rv" style="gap:16px"><h2 class="sf h2">Questions?</h2><p class="mu">Can't find yours? <a class="tl" href="#contact">Just ask us.</a></p></div>{faq(s["faqs"])}</div></div></section>
<section class="wh"><div class="in sec-s"><h2 class="sf h3" style="margin-bottom:12px">Read more</h2>{art_rows([ART_BY_TITLE[t] for t in s["arts"]])}
<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:40px"><span class="sm mu">Other services:</span>{"".join(f'<a class="chip" href="#services-{o["id"]}">{o["name"]}</a>' for o in other)}</div></div></section>
{cta_band(f"Let's Talk About Your {s['short']}.", "Tell us where you are today. We'll send a clear plan and price.", service=FORM_SVC[s["short"]])}
'''
    P.append(page(f"services-{s['id']}", s["name"], body))

feat = CASE_BY["10q-challenge"]
work = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Our Work",None)])}
<div class="split" style="align-items:end"><h1 class="sf d1">Our Work.</h1><p class="ld">Websites we built, Google rankings we won, ads that brought leads, and videos we shot. Real clients, real numbers.</p></div>
{stats(WORK_STATS)}</div></div></section>
<section class="dk"><div class="in sec" style="padding-top:0"><a class="split-r case rv" href="#our-work-{feat["id"]}" style="align-items:center">{case_vis(feat,"r43")}
<div class="stack" style="gap:16px"><span class="lbl">Featured · SEO + Website</span><span class="sf h1">{feat["client"]}</span><span class="mu ld">{feat["one"]}</span>
<div class="stats sm2">{"".join(f'<div class="st"><span class="sf stn">{n}</span><span class="mu sm">{l}</span></div>' for n,l in feat["res"][:4])}</div><span class="btn b-l" style="width:fit-content">Read the Story</span></div></a></div></section>
<section class="dk wfil" style="position:sticky;top:calc(76px + env(safe-area-inset-top,0px));z-index:5;border-block:1px solid var(--line-d)"><div class="in" style="padding-block:14px"><div style="display:flex;gap:8px;overflow-x:auto;align-items:center" role="group" aria-label="Filter by service"><button class="chip on" type="button" data-f="all" aria-pressed="true" style="flex:none">All work</button>{"".join(f'<button class="chip" type="button" data-f="{f}" aria-pressed="false" style="flex:none">{n}</button>' for f,n in [("Website","Websites"),("SEO","SEO"),("Ads","Ads"),("Social Media","Social media"),("Video","Video")])}<a class="chip" href="#videos" style="flex:none;margin-left:auto">Watch videos ↗</a></div></div></section>
<section class="dk"><div class="in sec"><div class="cols c2" id="work-grid" style="gap:64px 32px">
{"".join(f'<div data-svcs="{" ".join(c["svcs"])}">{case_card(c)}</div>' for c in CASES if c["id"]!="10q-challenge")}</div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><div class="split rv" style="align-items:end"><h2 class="sf h2">Websites We've Built. Live Now.</h2><p class="ld mu">Click any one to see it working, in India, the UK and beyond.</p></div>
<div class="sites">{"".join(f'<a class="site-row rv" href="{c["url"]}" target="_blank" rel="noopener"><span class="sf h3">{c["client"]}</span><span class="mu sm">{c["url"].split("//")[1].replace("www.","").rstrip("/")}</span><span class="mu sm hide-m">{c["loc"]}</span><span class="go" aria-hidden="true">↗</span></a>' for c in CASES if c.get("url") and "Website" in c["svcs"])}</div></div></div></section>
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px"><div class="split rv" style="align-items:end"><h2 class="sf h2">More SEO Results.</h2><p class="ld mu">Straight from Google Search Console, across other client sites.</p></div><div class="sgal">{"".join(shotfig(k,cap) for k,cap in MORE_SEO)}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="split" style="align-items:center"><div class="stack rv" style="gap:18px"><h2 class="sf h2">We Shoot Too.</h2><p class="ld mu">Gym reels, brand films and ad creatives, shot in 4K by our own crew.</p><a class="btn b-d" href="#videos" style="width:fit-content">Watch Our Videos</a></div>
<div class="vgrid v3 rv">{"".join(vcard(v) for v in VIDEOS[:3])}</div></div></div></section>
{cta_band("Want Results Like These?","Tell us what you want to change. We'll show you how we'd do it.")}
'''
P.append(page("our-work","Our Work", work))

for c in CASES:
    others = [x for x in CASES if x["id"] != c["id"] and (x["ind"] == c["ind"] or set(x["svcs"]) & set(c["svcs"]))][:2]
    ind = IND_BY.get(c["ind"])
    res = c.get("res")
    res_html = (stats(res) + (f'<p class="ld" style="margin-top:24px">{c["extra"]}</p>' if c.get("extra") else "")) if res else '<p class="measure" style="font-size:20px">[Two or three lines about what changed for the business, with real numbers once the client approves them.]</p>'
    cvids = [v for v in VIDEOS if v[5] == c["id"]]
    body = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Our Work","our-work"),(c["client"],None)])}
<div class="split" style="align-items:end"><div class="stack" style="gap:18px"><span class="lbl">{ind["name"] if ind else ""} · {c["loc"]}</span><h1 class="sf d1">{c["client"]}</h1></div><div class="stack" style="gap:18px"><p class="ld">{c["one"]}</p>{did_list(c)}{f'<a class="btn b-l" href="{c["url"]}" target="_blank" rel="noopener" style="width:fit-content">Visit the live site ↗</a>' if c.get("url") else ''}</div></div>
<div class="rv" style="margin-top:12px">{case_vis(c,"r169")}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:72px">
<div class="split rv"><h2 class="sf h2">The Problem</h2><p class="measure" style="font-size:20px">{c["ch"]}</p></div>
<div class="split rv"><h2 class="sf h2">What We Did</h2><div class="stack measure" style="gap:18px;font-size:20px"><p>{c["ap"]}</p><div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<a class="chip" href="#services-{s["id"]}">{s["name"]}</a>' for s in SVC if s["short"] in c["svcs"])}</div></div></div>
</div></div></section>
<section class="dk"><div class="in sec"><div class="split"><h2 class="sf h2 rv">The Result</h2><div class="rv">{res_html}</div></div></div></section>
{f'<section class="dk"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:28px"><div class="split rv" style="align-items:end"><h2 class="sf h2">The Proof.</h2><p class="ld mu">Real screenshots from Google Search, Search Console, Google Maps and Semrush.</p></div><div class="sgal">{"".join(shotfig(k,cap) for k,cap in c["shots"])}</div></div></div></section>' if c.get("shots") else ''}
{f'<section class="dk"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:28px"><h2 class="sf h3">Videos we shot for {c["client"]}</h2><div class="vgrid">{"".join(vcard(v) for v in cvids)}</div></div></div></section>' if cvids else ''}
{f'<section class="wh"><div class="in sec-s"><div class="who-card rv"><span class="wc-m sf" aria-hidden="true">{"".join(w[0] for w in c["owner"][0].replace("&amp;","").split()[:2])}</span><div class="stack" style="gap:4px"><span class="xs mu">The people we work with</span><span class="sf h3">{c["owner"][0]}</span><span class="mu">{c["owner"][1]}, {c["client"]}</span></div>{(f'<blockquote class="wc-q">“{c["quote"]}”</blockquote>' + ("" if c.get("qok") else f'<span class="qdraft">Draft review · waiting for {c["owner"][0]}’s approval</span>')) if c.get("quote") else ""}</div></div></section>' if c.get("owner") else ''}
<section class="dk"><div class="in sec"><div class="stack" style="gap:40px"><h2 class="sf h2">More Work.</h2><div class="cols c2">{"".join(case_card(o) for o in others)}</div></div></div></section>
{cta_band("Want Something Like This?","Let's talk about your business and what you want to change.")}
'''
    P.append(page(f"our-work-{c['id']}", c["client"], body))

vcats = ["All"] + list(dict.fromkeys(v[4] for v in VIDEOS))
videos = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Videos",None)])}
<div class="split" style="align-items:end"><h1 class="sf d1">Videos We've Shot.</h1><p class="ld">Brand films, gym reels and ad creatives, planned, shot and edited by our own crew on cinema cameras.</p></div>
{stats([("7","commercial reels"),("4K","Sony FX3 cinema production"),("3","brands across fitness, lifestyle and B2B")])}</div></div></section>
<section class="dk" style="position:sticky;top:calc(76px + env(safe-area-inset-top,0px));z-index:5;border-block:1px solid var(--line-d)"><div class="in" style="padding-block:14px"><div style="display:flex;gap:8px;overflow-x:auto" role="group" aria-label="Filter videos">{"".join(f'<button class="chip{" on" if c=="All" else ""}" type="button" data-v="{c}" aria-pressed="{"true" if c=="All" else "false"}" style="flex:none">{c}</button>' for c in vcats)}</div></div></section>
<section class="dk"><div class="in sec"><div class="vgrid" id="vid-grid">{"".join(vcard(v) for v in VIDEOS)}</div>
<p class="note" style="margin-top:28px">Videos open on Vimeo in a new tab.</p></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:40px"><h2 class="sf h2 rv">What We Shoot.</h2>
<div class="subs">{"".join(f'<div class="sub rv"><span class="n tab">0{i+1}</span><b class="sf h3">{t}</b><span class="mu">{d}</span></div>' for i,(t,d) in enumerate(SVC_BY[V_]["subs"]))}</div>
<a class="btn b-d" href="#services-{V_}" style="width:fit-content">About our shoots</a></div></div></section>
{cta_band("Want a Shoot Like This?","Tell us about your brand. We'll send ideas, a shot list and a price.", service="Video / Shoots")}
'''
P.append(page("videos","Videos", videos))

ihub = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Industries",None)])}
<div class="split" style="align-items:end"><h1 class="sf d1">Industries We Know.</h1><p class="ld">Every industry has its own problems. Pick yours to see the problems we usually find, how we fix them, and which service does the job.</p></div></div></div></section>
<section class="cr"><div class="in sec"><div class="ihub">
{"".join(f'<a class="ihc rv" href="#industries-{i["id"]}"><span class="xs mu">{len(i["cases"])} {"client" if len(i["cases"])==1 else "clients"} · {", ".join(SVC_BY[x]["short"] for x in i["svcs"][:3])}</span><span class="sf h3">{i["name"]}</span><span class="mu sm">{i["issues"][0][0]}? {i["issues"][0][2]}</span><span class="go" aria-hidden="true">→</span></a>' for i in INDS)}</div></div></section>
{cta_band("Don't See Your Industry?","Tell us about your business. We'll share what we've seen work for businesses like yours.")}
'''
P.append(page("industries","Industries", ihub))

IND_Q={"education":("bitsat crash course","Your Institute · Online + Delhi","yourinstitute.in"),"tech-saas":("best hosting for small business","Your Product · Compare plans","yourproduct.com"),"beauty-salons":("salon near me","Your Salon · Open now","yoursalon.in")}
def ind_hero(ind):
    if ind["id"] in IND_Q: return stage(serp(*IND_Q[ind["id"]]),"rarch",False,"Example Google result for "+ind["name"])
    return vis(ind["vis"],cls="rarch")
for ind in INDS:
    cs = [CASE_BY[x] for x in ind["cases"]]
    main_c = cs[0] if cs else None
    case_html = (f'<a class="split-r case rv" href="#our-work-{main_c["id"]}" style="align-items:center">{case_vis(main_c,"r43")}<div class="stack" style="gap:16px"><span class="xs mu">{" + ".join(main_c["svcs"])}</span><span class="sf h1">{main_c["client"]}</span><span class="mu ld">{main_c["one"]}</span>{did_list(main_c)}<span class="btn b-l" style="width:fit-content">Read the Story</span></div></a>'
                 if main_c else f'<div class="split rv" style="align-items:center"><p class="sf h2" style="max-width:14em">Be our first {ind["short"].lower()} story.</p><div class="stack" style="gap:14px"><p class="ld mu">We already use these exact methods for similar businesses. Start with a free chat and a clear plan.</p><a class="btn b-l" href="#contact" style="width:fit-content">Get a Free Quote</a></div></div>')
    body = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Industries","industries"),(ind["name"],None)])}
<div class="split-r"><div class="stack" style="gap:24px"><span class="lbl">{ind["name"]}</span><h1 class="sf h1">{ind["h1"]}</h1><p class="ld">{ind["sub"]}</p><a class="btn b-l" href="#contact" style="width:fit-content">Get a Free Quote</a></div>
<div class="rv">{ind_hero(ind)}</div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><div class="split rv" style="align-items:end"><h2 class="sf h2">The Problems. And How We Fix Them.</h2><p class="ld mu">What usually holds {ind["short"].lower()} businesses back, what we do about it, and which service does the job.</p></div>
{fixrows(ind["issues"])}</div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">Where We'd Start.</h2>
<div class="cols c4">{"".join(f'<a class="case rv" href="#services-{sid}" style="padding:24px;gap:8px;{"background:var(--ink);color:var(--cream)" if n<2 else "border:1px solid var(--ink)"}"><b style="font-size:18px">{SVC_BY[sid]["name"]}</b><span style="font-size:15px;opacity:.75">{["Start here","Then this","Also helps","Also helps"][min(n,3)]} →</span></a>' for n,sid in enumerate(ind["svcs"]))}</div></div></div></section>
<section class="dk"><div class="in sec"><div class="stack" style="gap:40px"><h2 class="sf h2">Our Work in This Industry.</h2>{case_html}
{('<div class="cols c2">'+"".join(case_card(o) for o in cs[1:])+'</div>') if len(cs)>1 else ''}</div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">Your First 90 Days.</h2>
<div class="cols c3 rv" style="border-top:2px solid var(--ink)">{"".join(f'<div class="stack" style="gap:6px;padding-top:18px"><b style="font-size:19px">{a}</b><span class="mu">{b}</span></div>' for a,b in [("Month 1","We check everything, set up tracking and make the plan."),("Month 2","We launch and test what works."),("Month 3","We do more of what works and plan the next 3 months.")])}</div></div></div></section>
<section class="wh"><div class="in sec"><div class="split"><h2 class="sf h2 rv">Questions?</h2>{faq(ind["faqs"])}</div></div></section>
<section class="cr"><div class="in sec-s"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><span class="sm mu">Other industries:</span>{"".join(f'<a class="chip" href="#industries-{o["id"]}">{o["name"]}</a>' for o in INDS if o["id"]!=ind["id"])}</div></div></section>
{cta_band("Let's Talk About Your Business.","Tell us about your brand and goals. We'll share what we'd do first.")}
'''
    P.append(page(f"industries-{ind['id']}", ind["name"], body))

lhub = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Locations",None)])}
<div class="split" style="align-items:end"><h1 class="sf d1">Based in Dwarka. Working Across Delhi NCR.</h1><p class="ld">Our office is in Dwarka, New Delhi. We meet clients across Delhi, Gurugram and Noida, and work online with businesses all over India and the UK.</p></div></div></div></section>
<section class="cr"><div class="in sec"><div class="cols c3">
{"".join(f'<a class="case rv" href="#locations-{l["id"]}" style="background:var(--white);padding:32px"><span class="xs mu">{"Our office" if l["office"] else l["zone"]}</span><span class="sf h2">{l["name"]}</span><span class="mu">{l["sub"]}</span><span class="tl arr">View</span></a>' for l in [LOC_BY["delhi"],LOC_BY["dwarka"],LOC_BY["gurugram"]])}</div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:28px"><div class="split rv" style="align-items:end"><h2 class="sf h2">Areas We Serve in Delhi.</h2><p class="ld mu">Every area has its own customers and searches. Pick yours.</p></div>
<div class="areas">{"".join(f'<a class="ar rv" href="#locations-{l["id"]}"><span class="xs mu">{l["zone"]}</span><b class="sf h3">{l["name"]}</b><span class="go" aria-hidden="true">→</span></a>' for l in DELHI_AREAS)}</div>
<div class="stack" style="gap:12px;margin-top:12px"><span class="xs mu">Across NCR</span><div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<a class="chip" href="#locations-{x}">{LOC_BY[x]["name"]}</a>' for x in ["gurugram","noida"])}</div></div></div></div></section>
{cta_band("Let's Meet.","Visit us in Dwarka (please book first), or start with a video call.")}
'''
P.append(page("locations","Locations", lhub))

for l in LOCS:
    c = CASE_BY[l["case"]]
    crumbs = [("Home","home"),("Locations","locations")] + ([(l["parent"][0], "locations-"+l["parent"][1])] if l["parent"] else []) + [(l["name"],None)]
    side = (f'<div class="stack" style="gap:14px">{vis("map",cls="r43")}<p><b>AegisKoncept</b><br><span class="mu">[Street address], Dwarka, New Delhi 110075</span></p><a class="tl arr" href="https://www.google.com/maps/search/AegisKoncept+Dwarka" target="_blank" rel="noopener">Open in Google Maps</a></div>'
            if l["office"] else f'<div class="stack" style="gap:14px;background:var(--white);padding:28px"><p class="sf h3">We work with {l["name"]} businesses from our Dwarka office.</p><p class="mu">Meet in person (please book first) or on video calls.</p><a class="tl arr" href="#locations-dwarka">Our Dwarka office</a></div>')
    sub_areas = ""
    if l["id"] == "delhi":
        sub_areas = f'''<section class="wh"><div class="in sec"><div class="stack" style="gap:28px"><h2 class="sf h2 rv">Areas We Cover in Delhi.</h2>
<div class="areas">{"".join(f'<a class="ar rv" href="#locations-{a["id"]}"><span class="xs mu">{a["zone"]}</span><b class="sf h3">{a["name"]}</b><span class="go" aria-hidden="true">→</span></a>' for a in DELHI_AREAS)}</div></div></div></section>'''
    q1 = l["searches"][0]
    body = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb(crumbs)}
<div class="split-r"><div class="stack" style="gap:24px"><span class="lbl">{"Our office" if l["office"] else l["zone"]}</span><h1 class="sf h1">{l["h1"]}</h1><p class="ld">{l["sub"]}</p><div class="row-btn"><a class="btn b-l" href="#contact">Get a Free Quote</a><a class="btn b-o" href="{WA}" target="_blank" rel="noopener">WhatsApp Us</a></div></div>
<div class="rv">{vis("map",cls="rarch") if l["office"] else stage(serp(q1, "Your Business · "+l["name"], "yourbusiness.in"),"rarch",False,"Example local Google result in "+l["name"])}</div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="split"><h2 class="sf h2 rv">Doing Business in {l["name"]}.</h2><div class="stack rv" style="gap:22px"><p class="measure" style="font-size:20px">{l["land"]}</p>
<div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<span class="chip">{b}</span>' for b in l["biz"])}</div></div></div></div></section>
<section class="cr"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">What Local Businesses Face. And the Fix.</h2>
{fixrows(l["chal"])}</div></div></section>
{sub_areas}
<section class="wh"><div class="in sec"><div class="split"><div class="stack rv" style="gap:16px"><h2 class="sf h2">What People Search in {l["name"]}.</h2><p class="ld mu">These are the kinds of searches we help you win.</p></div>
<div class="stack rv" style="gap:0">{"".join(f'<div class="qrow"><span class="q-ic" aria-hidden="true">⌕</span><span>{q}</span></div>' for q in l["searches"])}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2 rv">How We Help Here.</h2>
<div class="cols c3">{"".join(f'<a class="case rv" href="#services-{s["id"]}" style="border-top:2px solid var(--ink);padding-top:16px;gap:6px"><b style="font-size:18px">{s["name"]} →</b><span class="mu sm">{s["line"]}</span></a>' for s in SVC)}</div></div></div></section>
<section class="dk"><div class="in sec"><a class="split-r case rv" href="#our-work-{c["id"]}" style="align-items:center">{case_vis(c,"r43")}
<div class="stack" style="gap:14px"><span class="lbl">Work we're proud of</span><span class="sf h1">{c["client"]}</span><span class="mu ld">{c["one"]}</span><span class="btn b-l" style="width:fit-content">Read the Story</span></div></a></div></section>
<section class="cr"><div class="in sec"><div class="split"><div class="stack" style="gap:24px"><h2 class="sf h2">Questions?</h2>
{faq([(f"Can we meet in {l['name']}?", "Yes. Come to our Dwarka office, or we can visit you. Just book a time." if l["office"] else f"Yes. Our team is in Dwarka and can meet you in {l['name']}. Just book a time."),(f"Do you do local SEO for {l['name']}?", f"Yes. We set up your Google profile and pages for {l['name']} and nearby areas, so you show up in \"near me\" searches."),("Do you work with businesses outside Delhi NCR?","Yes. Most of our work happens online, so we work with businesses all over India and in the UK."),("How soon can we start?","Usually within 1–2 weeks after you say yes to the proposal.")])}</div>{side}</div></div></section>
<section class="wh"><div class="in sec-s"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><span class="sm mu">Nearby:</span>{"".join(f'<a class="chip" href="#locations-{h}">{n}</a>' for n,h in l["near"])}</div></div></section>
{cta_band(f"Let's Talk About Your {l['name']} Business.","Tell us what you need. We'll reply within 1 working day.")}
'''
    P.append(page(f"locations-{l['id']}", "Digital Marketing in "+l["name"], body))

cats = ["All","SEO","Ads","Social Media","Websites","Business Growth","Local SEO","Digital Marketing"]
ins = f'''
<section class="cr"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Blog",None)])}
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:32px"><h1 class="sf d1" style="max-width:9em">Simple Tips to Grow Your Business.</h1>
<label class="fld" for="ins-q" style="width:min(380px,100%)">Search the blog<input id="ins-q" type="search" placeholder="Try: SEO, ads, website"></label></div></div></div></section>
<section class="cr" style="position:sticky;top:calc(76px + env(safe-area-inset-top,0px));z-index:5;border-block:1px solid var(--line-l)"><div class="in" style="padding-block:14px"><div style="display:flex;gap:8px;overflow-x:auto" role="group" aria-label="Filter by topic">{"".join(f'<button class="chip{" on" if c=="All" else ""}" type="button" data-cat="{c}" aria-pressed="{"true" if c=="All" else "false"}" style="flex:none">{c}</button>' for c in cats)}</div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:64px">
<a class="split-r case rv" href="#insights-seo-cost-india" style="align-items:end">{cover("SEO cost","","r169")}<div class="stack" style="gap:14px"><span class="xs mu">SEO · Most read</span><span class="sf h1">How Much Does SEO Cost in India?</span><span class="ld mu">What you're paying for, what you should get, and what to avoid.</span><span class="sm">Ritesh Kumar · 9 min read</span></div></a>
<div><h2 class="sf h2" style="margin-bottom:16px">Latest</h2><div id="art-list">{art_rows(ARTS)}</div><p id="art-empty" class="mu" hidden style="padding:24px 0">Nothing found. Try another word or topic.</p></div>
<nav aria-label="Pages" style="display:flex;gap:18px;justify-content:center;align-items:center" class="sm"><b aria-current="page">1</b><a href="#insights">2</a><a href="#insights">Next →</a></nav>
</div></div></section>
<section class="dk"><div class="in sec-s"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px"><h2 class="sf h2">Got a Question? Ask Us.</h2><a class="btn b-l" href="#contact">Ask a Question</a></div></div></section>
'''
P.append(page("insights","Blog", ins))

article = f'''
<section class="cr"><div class="in sec" style="padding-bottom:48px"><div class="stack" style="gap:22px;max-width:860px;margin:0 auto">{crumb([("Home","home"),("Blog","insights"),("SEO",None)])}
<span class="lbl">SEO</span><h1 class="sf h1">How Much Does SEO Cost in India?</h1>
<p class="ld">SEO prices in India are all over the place, because different agencies sell very different things under the same name. Here's what you're really paying for, what you should get, and what to watch out for.</p>
<div style="display:flex;align-items:center;gap:14px"><span class="mono" style="width:52px;aspect-ratio:1;font-size:20px;border-radius:50%">RK</span><span class="sm"><a href="#insights-author-ritesh-kumar"><b>Ritesh Kumar</b></a> · Founder<br><span class="mu">10 Nov 2026 · 9 min read</span></span></div></div></div></section>
<section class="cr"><div class="in">{cover("What you really pay for","","r169")}</div></section>
<section class="cr"><div class="in sec"><div class="art-grid" style="display:grid;grid-template-columns:minmax(0,220px) minmax(0,680px) minmax(0,1fr);gap:48px">
<aside class="toc" aria-label="Contents"><b style="color:var(--ink)">In this article</b><a class="cur" href="#insights-seo-cost-india">What changes the price</a><a href="#insights-seo-cost-india">How agencies charge</a><a href="#insights-seo-cost-india">What you should get</a><a href="#insights-seo-cost-india">Warning signs</a><a href="#insights-seo-cost-india">Quick questions</a></aside>
<article class="prose">
<h2 style="margin-top:0">What changes the price</h2>
<p>When you pay for SEO, you're paying for people's time: checking your site, fixing it, writing for it and reporting on it. The more work your site needs, the more it costs.</p>
<ul><li><b>Competition.</b> "Dentist in Dwarka" is much easier than "home loans".</li><li><b>Your website.</b> A small, clean site needs less work than a huge online store with problems.</li><li><b>New content.</b> Writing new pages and blogs is often the biggest cost.</li><li><b>Local or all-India.</b> Ranking in one city costs less than ranking across India.</li></ul>
<div class="take"><b>Quick tip</b><br>Compare agencies by the work they'll do each month, not just the price.</div>
<h2>How agencies charge</h2>
<div class="tbl"><table><thead><tr><th>Type</th><th>What you get</th><th>Usual price</th></tr></thead><tbody><tr><td>Monthly plan</td><td class="mu">Ongoing fixes, content and Google Maps work</td><td class="mu">[Range to add]</td></tr><tr><td>One-time check</td><td class="mu">A full review and a list of fixes</td><td class="mu">[Range to add]</td></tr><tr><td>One-time project</td><td class="mu">A single job, like moving your website</td><td class="mu">[Range to add]</td></tr></tbody></table></div>
<a class="case" href="#services-seo" style="border:1px solid var(--ink);padding:18px 22px;flex-direction:row;justify-content:space-between;align-items:center;font-size:17px"><span><span class="xs mu">Our service</span><br><b>SEO for businesses in Delhi and across India</b></span><span>→</span></a>
<h2>What you should get</h2>
<p>Whatever you pay, you should get a written plan, a list of the searches and pages being worked on, changes you can actually see on your site, and a monthly report that links the work to visitors and enquiries.</p>
<blockquote>If you can't tell what was done for your website last month, you're paying for a report, not for SEO.</blockquote>
<h2>Warning signs</h2>
<ul><li>"Guaranteed #1 on Google."</li><li>Hundreds of backlinks for a tiny price.</li><li>You don't get access to your own Google accounts.</li><li>Reports full of numbers, but no list of work done.</li></ul>
<h2>Quick questions</h2>
{faq([("Is cheap SEO worth it?","For a very small local business, maybe. But very cheap usually means very little work, or risky shortcuts."),("How long until SEO pays off?","Most businesses see early movement in 2–3 months, and bigger results after 6 months or more.")])}
</article><div></div></div></div></section>
<section class="cr"><div class="in sec" style="padding-top:0"><div class="stack" style="gap:32px;max-width:680px;margin:0 auto">
<div style="display:flex;gap:20px;padding:24px 0;border-block:1px solid var(--line-l)"><span class="mono" style="width:80px;flex:none;aspect-ratio:1;font-size:30px;border-radius:50%">RK</span><div><a href="#insights-author-ritesh-kumar"><b>Ritesh Kumar</b></a> · Founder<p class="mu" style="margin-top:6px">Ritesh has worked in SEO since 2021. Today he leads strategy at AegisKoncept for websites, Google, ads and social media.</p></div></div>
<div class="dk stack" style="padding:36px;gap:16px"><p class="sf h2">Want Us to Check Your SEO?</p><p class="mu">We'll look at your website and tell you the 3 changes that would help most. Free.</p><a class="btn b-l" href="#contact" style="width:fit-content">Book a Free Call</a></div></div></div></section>
<section class="wh"><div class="in sec"><div class="stack" style="gap:28px"><h2 class="sf h2">Read Next.</h2><div class="cols c3">{"".join(f'<a class="case" href="#insights">{cover(a[5],a[6],"r43")}<span class="xs mu">{a[2]}</span><span class="sf h3">{a[1]}</span></a>' for a in [ARTS[5],ARTS[6],ARTS[1]])}</div></div></div></section>
'''
P.append(page("insights-seo-cost-india","How Much Does SEO Cost in India?", article))

author = f'''
<section class="cr"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Blog","insights"),("Ritesh Kumar",None)])}
<div class="split" style="align-items:center"><div class="mono" style="max-width:320px">RK</div>
<div class="stack" style="gap:18px"><span class="lbl">Writer</span><h1 class="sf h1">Ritesh Kumar</h1><p class="ld">Founder of AegisKoncept. Ritesh started with SEO in December 2021 and then moved into websites, social media and ads. He writes simple, practical guides for Indian businesses.</p>
<div style="display:flex;gap:16px;flex-wrap:wrap"><a class="tl" href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a><a class="tl" href="#about">About AegisKoncept</a></div></div></div></div></div></section>
<section class="cr"><div class="in sec" style="padding-top:0"><h2 class="sf h2" style="margin-bottom:16px">Articles by Ritesh.</h2>{art_rows([ARTS[0],ARTS[5],ARTS[6],ARTS[1]])}</div></section>
'''
P.append(page("insights-author-ritesh-kumar","Ritesh Kumar", author))

contact = f'''
<section class="dk"><div class="in sec"><div class="stack" style="gap:28px">{crumb([("Home","home"),("Contact",None)])}
<div class="split" style="align-items:start"><div class="stack" style="gap:24px"><h1 class="sf d1">Let's Talk.</h1><p class="ld">Tell us about your business and what you want to achieve. We'll reply within 1 working day.</p>
<div class="stack" style="gap:18px;margin-top:12px">
<div class="stack" style="gap:2px;border-top:1px solid var(--line-d);padding-top:14px"><span class="xs mu">Email</span><span class="h4 sf" style="user-select:all">hello@aegiskoncept.com</span></div>
<div class="stack" style="gap:2px;border-top:1px solid var(--line-d);padding-top:14px"><span class="xs mu">Call or WhatsApp</span><span class="h4 sf" style="user-select:all">+91 73034 68073</span><a class="tl arr sm" href="{WA}" target="_blank" rel="noopener">Open WhatsApp</a></div>
<div class="stack" style="gap:2px;border-top:1px solid var(--line-d);padding-top:14px"><span class="xs mu">Office</span><span>[Street address], Dwarka, New Delhi 110075</span><span class="mu sm">Mon–Sat, [hours] · Please book before visiting</span></div></div></div>
<div style="background:var(--panel);padding:clamp(24px,3vw,40px)"><h2 class="sf h3" style="margin-bottom:24px">Tell us about your project</h2>
<form class="form js-form" novalidate>
<label class="fld" for="c-name">Your name *<input id="c-name" autocomplete="name" required><span class="err">Please add your name.</span></label>
<label class="fld" for="c-biz">Business name<input id="c-biz" autocomplete="organization"></label>
<label class="fld" for="c-email">Email *<input id="c-email" type="email" autocomplete="email" required><span class="err">Please add an email like name@company.com</span></label>
<label class="fld" for="c-phone">Phone / WhatsApp<input id="c-phone" type="tel" autocomplete="tel"></label>
<label class="fld" for="c-svc">What do you need? *<select id="c-svc" required>{SERVICES_OPT}</select><span class="err">Pick one, or choose "Not sure yet".</span></label>
<label class="fld" for="c-budget">Monthly budget<select id="c-budget"><option value="">Prefer not to say</option><option>Under ₹25,000</option><option>₹25,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option><option>More than ₹1,00,000</option></select></label>
<label class="fld full" for="c-msg">What do you want to achieve?<textarea id="c-msg" placeholder="For example: more enquiries from Google, a new website, more Instagram followers"></textarea></label>
<label class="full sm" style="display:flex;gap:10px;align-items:flex-start;font-weight:400" for="c-ok"><input id="c-ok" type="checkbox" required style="width:20px;height:20px;margin-top:2px"><span>It's OK to contact me about this. (<a href="#privacy-policy">Privacy policy</a>)</span></label>
<div class="full row-btn" style="align-items:center"><button class="btn b-l" type="submit">Send Message</button><span class="note">No spam. A real person will reply.</span></div></form></div></div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><h2 class="sf h2">What Happens Next?</h2>
<div class="cols c3" style="border-top:2px solid var(--ink)">{"".join(f'<div class="stack rv" style="gap:6px;padding-top:18px"><span class="sf" style="font-size:44px;line-height:1">{i+1}</span><b style="font-size:19px">{a}</b><span class="mu">{b}</span></div>' for i,(a,b) in enumerate([("We reply","Within 1 working day, by email, call or WhatsApp."),("Quick call","30 minutes to understand your goals."),("Clear proposal","What we'll do, when, and the price. In writing.")]))}</div></div></div></section>
<section class="wh"><div class="in sec"><div class="split" style="align-items:center">{vis("map",cls="r43")}
<div class="stack" style="gap:16px"><h2 class="sf h2">Visit Us in Dwarka.</h2><p class="mu ld">Easy to reach from Dwarka Expressway and Gurugram. Please book a time before you come.</p><a class="btn b-o" href="https://www.google.com/maps/search/AegisKoncept+Dwarka" target="_blank" rel="noopener" style="width:fit-content">Get Directions</a></div></div></div></section>
'''
P.append(page("contact","Contact", contact))

P.append(page("thank-you","Thank You", f'''
<section class="dk"><div class="in sec"><div class="split-r"><div class="stack" style="gap:24px"><h1 class="sf d1">Got It. Thank You!</h1>
<p class="ld">Your message reached us. We'll reply within 1 working day. In a hurry? WhatsApp us at +91 73034 68073.</p>
<div class="row-btn"><a class="btn b-l" href="#our-work">See Our Work</a><a class="btn b-o" href="#insights">Read the Blog</a></div></div>
<div>{vis("brand",cls="rarch")}</div></div></div></section>
<section class="cr"><div class="in sec"><div class="stack" style="gap:28px"><h2 class="sf h2">While You Wait.</h2><div class="cols c3">{"".join(case_card(c,"r11") for c in CASES[:3])}</div></div></div></section>'''))

def legal(pid, title, sections):
    return page(pid, title, f'''<section class="cr"><div class="in sec"><div class="stack" style="gap:28px;max-width:760px">{crumb([("Home","home"),(title,None)])}
<h1 class="sf h1">{title}</h1><p class="mu">Last updated: 10 November 2026 · Draft, to be checked by a lawyer</p>
<article class="prose" style="max-width:none">{"".join(f"<h2>{h}</h2><p>{t}</p>" for h,t in sections)}</article></div></div></section>''')
P.append(legal("privacy-policy","Privacy Policy",[("Who we are","AegisKoncept is a digital marketing agency in Dwarka, New Delhi. This page explains what information we collect on this website and how we use it."),("What we collect","What you type into our forms (name, business, email, phone, the service you want and your message). If you allow cookies, we also collect anonymous data about how people use the site."),("How we use it","To reply to you, send proposals, improve the website and check how our marketing is doing. We never sell your information."),("Your choices","You can ask us to show, change or delete your information anytime. Just email hello@aegiskoncept.com."),("Questions","Email hello@aegiskoncept.com.")]))
P.append(legal("terms-and-conditions","Terms and Conditions",[("Using this website","By using this site, you agree to these terms. The content is general information and may change."),("Our services","Our work is covered by a separate written proposal or agreement with the scope, price and timeline."),("Our content","The AegisKoncept name, logo and website content belong to us. Client work is shown with permission."),("Questions","Email hello@aegiskoncept.com.")]))
P.append(legal("cookie-policy","Cookie Policy",[("What cookies we use","Some cookies are needed for the site to work. Analytics and ad cookies (Google Analytics, Google Ads, Meta Pixel, Microsoft Clarity) only load if you say yes."),("Changing your choice","You can change your choice anytime from the cookie settings link, or in your browser settings.")]))

P.append(page("not-found","Page Not Found", f'''<section class="dk"><div class="in sec"><div class="split-r"><div class="stack" style="gap:24px"><span class="lbl">Error 404</span><h1 class="sf d1">Oops. This Page Isn't Here.</h1><p class="ld">It may have moved, or the link might be wrong.</p>
<div class="row-btn"><a class="btn b-l" href="#home">Go Home</a><a class="btn b-o" href="#services">Our Services</a><a class="btn b-o" href="#contact">Contact Us</a></div></div><div>{vis("brand",cls="rarch")}</div></div></div></section>'''))

groups = [("Main",[("home","Home"),("about","About"),("services","Services"),("our-work","Our Work"),("videos","Videos"),("industries","Industries"),("locations","Locations"),("insights","Blog"),("contact","Contact")]),
 ("Services",[(f"services-{s['id']}", s["name"]) for s in SVC]),("Our work",[(f"our-work-{c['id']}", c["client"]) for c in CASES]),
 ("Industries",[(f"industries-{i['id']}", i["name"]) for i in INDS]),("Locations",[(f"locations-{l['id']}", l["name"]) for l in LOCS]),
 ("Blog",[("insights-seo-cost-india","Article: SEO cost in India"),("insights-author-ritesh-kumar","Writer: Ritesh Kumar")]),
 ("Other",[("thank-you","Thank you"),("privacy-policy","Privacy policy"),("terms-and-conditions","Terms"),("cookie-policy","Cookies"),("not-found","404 page")])]
P.append(page("all-pages","All Pages", f'''<section class="cr"><div class="in sec"><div class="stack" style="gap:32px"><span class="lbl">For review</span><h1 class="sf h1">Every Page on the Website.</h1><p class="ld mu">{sum(len(g[1]) for g in groups)} pages. Open one, then click around like a visitor would.</p>
<div class="cols c3" style="gap:40px 32px">{"".join(f'<div class="stack" style="gap:8px"><b>{g}</b>'+"".join(f'<a class="tl" href="#{h}">{t}</a>' for h,t in items)+'</div>' for g,items in groups)}</div></div></div></section>'''))

JS = r"""
(function(){
 var pages=[].slice.call(document.querySelectorAll('[data-page]')),ids=pages.map(function(p){return p.getAttribute('data-page')});
 var main=document.getElementById('main'),pbar=document.querySelector('.pbar'),hdr=document.querySelector('.site-h');
 var burger=document.querySelector('.burger'),mnav=document.querySelector('.mnav');
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,first=true;
 function target(){var h=(location.hash||'#home').slice(1);if(h==='main')return null;return ids.indexOf(h)>-1?h:'not-found'}
 function closeMenus(){mnav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.querySelector('.bt').textContent='Menu';document.documentElement.style.overflow='';document.querySelectorAll('.dd').forEach(function(d){d.classList.remove('open')})}
 function swap(id){
  pages.forEach(function(p){p.classList.toggle('cur',p.getAttribute('data-page')===id)});
  var cur=document.querySelector('[data-page].cur');document.title=(id==='home'?'':cur.getAttribute('data-title')+' · ')+'AegisKoncept';
  var top=id.split('-')[0],sec={services:'services',industries:'industries',our:'our-work',insights:'insights',about:'about',contact:'contact',videos:'videos'}[top]||'';
  document.querySelectorAll('.nav [data-nav]').forEach(function(n){var on=n.getAttribute('data-nav')===sec;if(n.tagName==='A'){on?n.setAttribute('aria-current','page'):n.removeAttribute('aria-current')}else n.classList.toggle('cur',on)});
  document.querySelectorAll('.mnav [data-m]').forEach(function(a){var m=a.getAttribute('data-m');(m===sec||(id==='home'&&m==='home')||(m==='locations'&&top==='locations'))?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  closeMenus();window.scrollTo(0,0);hdr.classList.remove('hide');
  heroActive(id==='home');reveal(cur);if(typeof enhance==='function')enhance(cur);
 }
 function show(){
  var id=target();if(!id)return;
  if(first||reduce){first=false;swap(id);return}
  var cu=document.querySelector('.curtain'),tp=document.querySelector('[data-page="'+id+'"]');
  var nm=(tp&&tp.getAttribute('data-title')||'AegisKoncept').split(' · ')[0];if(id==='home')nm='AegisKoncept';
  cu.querySelector('.ctitle').textContent=nm;
  cu.classList.remove('go');void cu.offsetWidth;cu.classList.add('go');
  clearTimeout(window.__sw);window.__sw=setTimeout(function(){swap(id)},560);
 }
 window.addEventListener('hashchange',show);

 // ---------- hero slider
 var H=document.querySelector('.hero'),S=[].slice.call(H.querySelectorAll('.hs')),T=[].slice.call(H.querySelectorAll('button.t'));
 var num=H.querySelector('.bgnum'),pp=H.querySelector('.pp'),idx=0,timer=null,playing=!reduce,hover=false,DUR=7000,active=true;
 H.classList.add('js');if(!reduce){S[0].classList.remove('on');requestAnimationFrame(function(){requestAnimationFrame(function(){S[0].classList.add('on')})})}
 function go(i){var prev=S[idx];idx=(i+S.length)%S.length;if(prev&&prev!==S[idx]){prev.classList.add('out');setTimeout(function(){prev.classList.remove('out')},800);if(window.__heroBurst)window.__heroBurst()}S.forEach(function(s,k){var on=k===idx;s.classList.toggle('on',on);on?s.removeAttribute('aria-hidden'):s.setAttribute('aria-hidden','true')});
  T.forEach(function(t,k){t.setAttribute('aria-selected',k===idx?'true':'false')});
  var hsel=document.getElementById('h-svc');if(hsel&&!hsel.dataset.touched){hsel.value=S[idx].getAttribute('data-svc')}
  num.style.opacity=0;setTimeout(function(){num.textContent='0'+(idx+1);num.style.opacity=1},300);restart()}
 function restart(){clearTimeout(timer);H.classList.remove('play');void H.offsetWidth;if(playing&&!hover&&active){H.classList.add('play');timer=setTimeout(function(){go(idx+1)},DUR)}}
 function setPlay(p){playing=p;pp.textContent=p?'❚❚':'▶';pp.setAttribute('aria-label',p?'Pause slideshow':'Play slideshow');restart()}
 function heroActive(a){active=a;restart()}
 T.forEach(function(t){t.addEventListener('click',function(){go(+t.getAttribute('data-i'))});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(idx+1);T[idx].focus()}if(e.key==='ArrowLeft'){go(idx-1);T[idx].focus()}})});
 H.querySelector('.next').addEventListener('click',function(){go(idx+1)});H.querySelector('.prev').addEventListener('click',function(){go(idx-1)});
 pp.addEventListener('click',function(){setPlay(!playing)});
 H.addEventListener('mouseenter',function(){hover=true;H.classList.add('paused');clearTimeout(timer)});
 H.addEventListener('mouseleave',function(){hover=false;H.classList.remove('paused');restart();H.style.setProperty('--px','0px');H.style.setProperty('--py','0px')});
 if(!reduce&&window.matchMedia('(pointer:fine)').matches){H.addEventListener('mousemove',function(e){var r=H.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;H.style.setProperty('--mx',(x*100)+'%');H.style.setProperty('--my',(y*100)+'%');H.style.setProperty('--px',((x-.5)*-22)+'px');H.style.setProperty('--py',((y-.5)*-16)+'px')})}
 var sx=null,sy=null;H.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
 H.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(idx+(dx<0?1:-1));sx=null},{passive:true});
 document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(timer);else restart()});
 if(reduce)setPlay(false);
 // ---------- hero portal canvas
 (function(){var cv=H.querySelector('.hcv');if(!cv||!cv.getContext)return;var cx=cv.getContext('2d'),W=0,Hh=0,dpr=Math.min(2,window.devicePixelRatio||1),mx=0,my=0,tmx=0,tmy=0,sp=0,bursts=[],t0=performance.now(),vis=true;
  function size(){var r=H.getBoundingClientRect();W=r.width;Hh=r.height;cv.width=W*dpr;cv.height=Hh*dpr;cv.style.width=W+'px';cv.style.height=Hh+'px';cx.setTransform(dpr,0,0,dpr,0,0)}
  function arch(x,y,w,h){var r=w/2;cx.beginPath();cx.moveTo(x-r,y);cx.lineTo(x-r,y-h*.5);cx.bezierCurveTo(x-r,y-h*.78,x-r*.55,y-h*.94,x,y-h);cx.bezierCurveTo(x+r*.55,y-h*.94,x+r,y-h*.78,x+r,y-h*.5);cx.lineTo(x+r,y)}
  var N=16;
  function frame(now){if(!vis){requestAnimationFrame(frame);return}if(Math.abs(H.clientWidth-W)>1||Math.abs(H.clientHeight-Hh)>1)size();if(!W){requestAnimationFrame(frame);return}
   var t=(now-t0)/1000;mx+=(tmx-mx)*.06;my+=(tmy-my)*.06;cx.clearRect(0,0,W,Hh);
   var mob=W<900,ox=(mob?W*.5:W*.56)+mx*40,oy=Hh+8,max=Math.max(W,Hh)*1.35,speed=.045+sp*.5;
   for(var i=0;i<N;i++){var p=((t*speed+i/N)%1),e=p*p*p;var w=12+e*max,h=w*1.12;var a=Math.sin(p*Math.PI)*.55;
    cx.strokeStyle=(i%5===0)?'rgba(211,228,91,'+(a*.38).toFixed(3)+')':'rgba(170,162,150,'+(a*.42).toFixed(3)+')';cx.lineWidth=(i%5===0)?1.3:1;arch(ox+mx*e*120,oy+my*e*40,w,h);cx.stroke()}
   for(var b=bursts.length-1;b>=0;b--){var q=(now-bursts[b])/1400;if(q>1){bursts.splice(b,1);continue}var ee=1-Math.pow(1-q,3),bw=40+ee*max*.9;
    cx.strokeStyle='rgba(211,228,91,'+((1-q)*.7).toFixed(3)+')';cx.lineWidth=1.6;arch(ox,oy,bw,bw*1.12);cx.stroke()}
   var gq=(Math.sin(t*1.3)+1)/2;cx.fillStyle='rgba(211,228,91,'+(.05+gq*.04).toFixed(3)+')';arch(ox,oy,46,52);cx.closePath();cx.fill();
   requestAnimationFrame(frame)}
  size();window.addEventListener('resize',size);
  if(reduce){size();var t=0;cx.clearRect(0,0,W,Hh);for(var i=0;i<N;i++){var p=i/N,e=p*p*p,w=12+e*Math.max(W,Hh)*1.35;cx.strokeStyle='rgba(119,113,106,.25)';arch(W*.56,Hh+8,w,w*1.12);cx.stroke()}return}
  H.addEventListener('mousemove',function(e){var r=H.getBoundingClientRect();tmx=(e.clientX-r.left)/r.width-.5;tmy=(e.clientY-r.top)/r.height-.5});
  window.__heroBurst=function(){bursts.push(performance.now())};
  window.addEventListener('scroll',function(){var y=Math.min(1,Math.max(0,scrollY/Math.max(1,Hh)));sp=y;H.style.setProperty('--hsc',y.toFixed(3))},{passive:true});
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting}).observe(H);
  setTimeout(function(){window.__heroBurst()},350);
  requestAnimationFrame(frame)})();
 var hf=H.querySelector('.hform');if(hf&&!reduce&&window.matchMedia('(pointer:fine)').matches){H.addEventListener('mousemove',function(e){var r=hf.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;hf.style.transform='perspective(1200px) rotateY('+(x*4).toFixed(2)+'deg) rotateX('+(-y*4).toFixed(2)+'deg)'});H.addEventListener('mouseleave',function(){hf.style.transform=''})}
 (function(){var R=document.querySelector('.rvw');if(!R)return;var B=[].slice.call(R.querySelectorAll('.rvw-n')),P=[].slice.call(R.querySelectorAll('.rvw-i')),i=0,tm=null,hov=false,D=6500;
  function sel(n){i=(n+P.length)%P.length;B.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i?'true':'false')});P.forEach(function(p,k){p.classList.toggle('on',k===i)});R.classList.remove('run');void R.offsetWidth;if(!reduce&&!hov){R.classList.add('run');clearTimeout(tm);tm=setTimeout(function(){sel(i+1)},D)}}
  B.forEach(function(b){b.addEventListener('click',function(){sel(+b.getAttribute('data-r'))})});
  R.addEventListener('mouseenter',function(){hov=true;clearTimeout(tm);R.classList.remove('run')});R.addEventListener('mouseleave',function(){hov=false;sel(i)});
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){if(en[0].isIntersecting)sel(i);else clearTimeout(tm)}).observe(R)})();
 var hs_=document.getElementById('h-svc');if(hs_)hs_.addEventListener('change',function(){hs_.dataset.touched='1'});

 // ---------- scroll reveals (content is readable without JS; only below-the-fold items animate)
 var io=('IntersectionObserver' in window&&!reduce)?new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.remove('pre');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'}):null;
 function reveal(cur){if(!io)return;[].forEach.call(cur.querySelectorAll('.rv,.pill-word,.arch-draw'),function(e,i){if(e.getBoundingClientRect().top<innerHeight*.9)return;e.classList.add('pre');if(e.classList.contains('pill-word'))e.style.transitionDelay=(i%3*.15)+'s';io.observe(e)})}

 // ---------- header hide/show
 var ly=0;window.addEventListener('scroll',function(){var y=scrollY;hdr.classList.toggle('scrolled',y>40);ly=y},{passive:true});

 // ---------- menus
 burger.addEventListener('click',function(){var o=mnav.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');burger.querySelector('.bt').textContent=o?'Close':'Menu';document.documentElement.style.overflow=o?'hidden':''});
 document.querySelectorAll('.mn-tg').forEach(function(b){b.addEventListener('click',function(){var o=b.parentNode.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')})});
 document.querySelectorAll('.dd>button').forEach(function(b){b.addEventListener('click',function(){var o=b.parentNode.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')})});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenus()});

 // ---------- forms
 document.querySelectorAll('[data-svc]').forEach(function(a){a.addEventListener('click',function(){document.getElementById('c-svc').value=a.getAttribute('data-svc')})});
 document.querySelectorAll('.js-form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
  f.querySelectorAll('[required]').forEach(function(el){var bad=el.type==='checkbox'?!el.checked:(!el.value.trim()||(el.type==='email'&&!/^\S+@\S+\.\S+$/.test(el.value)));var w=el.closest('.fld');if(w)w.classList.toggle('bad',bad);if(bad&&ok){el.focus();ok=false}});
  if(ok){f.reset();location.hash='#thank-you'}})});

 // ---------- filters
 document.querySelectorAll('[data-f]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-f');document.querySelectorAll('[data-f]').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});document.querySelectorAll('#work-grid>[data-svcs]').forEach(function(c){c.hidden=!(v==='all'||c.getAttribute('data-svcs').indexOf(v)>-1)})})});
 document.querySelectorAll('button[data-v]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-v');document.querySelectorAll('button[data-v]').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});document.querySelectorAll('#vid-grid .vcard').forEach(function(c){c.hidden=!(v==='All'||c.getAttribute('data-v')===v)})})});
 var q=document.getElementById('ins-q'),cat='All';
 function filt(){var t=(q.value||'').toLowerCase(),n=0;document.querySelectorAll('#art-list .art-row').forEach(function(r){var m=(cat==='All'||r.getAttribute('data-cat')===cat)&&(!t||r.textContent.toLowerCase().indexOf(t)>-1);r.hidden=!m;if(m)n++});document.getElementById('art-empty').hidden=n>0}
 q.addEventListener('input',filt);
 document.querySelectorAll('button[data-cat]').forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-cat');document.querySelectorAll('button[data-cat]').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});filt()})});


 // ================= standout layer =================
 var fine=window.matchMedia('(pointer:fine)').matches, root=document.documentElement;
 // --- custom arch cursor
 if(fine&&!reduce){
  root.classList.add('cur-on');
  var dot=document.querySelector('.cur-dot'),ring=document.querySelector('.cur-ring'),mx=-100,my=-100,rx=-100,ry=-100;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.transform='translate3d('+mx+'px,'+my+'px,0)';root.classList.remove('cur-out')},{passive:true});
  document.addEventListener('mouseleave',function(){root.classList.add('cur-out')});
  (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)';requestAnimationFrame(loop)})();
  document.addEventListener('mouseover',function(e){var t=e.target;
   root.classList.toggle('cur-field',!!t.closest('input,select,textarea'));
   var v=!!t.closest('.case,.art-row,.vcard,.ihc,.ar,.site-row');root.classList.toggle('cur-view',v);
   root.classList.toggle('cur-link',!v&&!!t.closest('a,button,summary,[role=tab]'))});
 }
 // --- magnetic buttons
 if(fine&&!reduce){
  document.addEventListener('mousemove',function(e){var b=e.target.closest&&e.target.closest('.btn.b-l,.go,.hbar .ctl button,.site-f .big');
   document.querySelectorAll('.mag').forEach(function(m){if(m!==b){m.style.translate='0 0';m.classList.remove('mag')}});
   if(!b)return;var r=b.getBoundingClientRect(),k=b.classList.contains('big')?.08:.28;b.classList.add('mag');
   b.style.translate=((e.clientX-r.left-r.width/2)*k)+'px '+((e.clientY-r.top-r.height/2)*k)+'px'},{passive:true});
 }
 // --- tilt on project cards
 if(fine&&!reduce){
  document.addEventListener('mousemove',function(e){var c=e.target.closest&&e.target.closest('.case');
   document.querySelectorAll('.tilted').forEach(function(x){if(x!==c){var st=x.querySelector('.stage');if(st)st.style.rotate='';x.classList.remove('tilted')}});
   if(!c)return;var st=c.querySelector('.stage');if(!st)return;var r=st.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;
   c.classList.add('tilted');st.style.rotate=(-ny)+' '+nx+' 0 '+(Math.hypot(nx,ny)*9).toFixed(2)+'deg'},{passive:true});
 }
 // --- split headings into words that rise in
 function splitWords(el,cls,inner){if(el.dataset.split)return;el.dataset.split=1;
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),nodes=[],n;while(n=w.nextNode())nodes.push(n);
  nodes.forEach(function(tn){var parts=tn.nodeValue.split(/(\s+)/),f=document.createDocumentFragment();
   parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}
    var o=document.createElement('span');o.className=cls;if(inner){var i=document.createElement('span');i.className=inner;i.textContent=p;o.appendChild(i)}else o.textContent=p;f.appendChild(o)});
   tn.parentNode.replaceChild(f,tn)})}
 var wio=('IntersectionObserver' in window&&!reduce)?new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.remove('wr-pre');wio.unobserve(x.target)}})},{threshold:.2}):null;
 var cio=('IntersectionObserver' in window&&!reduce)?new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.remove('cl-pre');cio.unobserve(x.target)}})},{threshold:.15}):null;
 var PAR=[],SCRUB=[],PIN=null;
 function enhance(cur){
  if(!cur)return;
  cur.querySelectorAll('h2.sf,h1.sf').forEach(function(h){if(h.closest('.hform,.curtain'))return;splitWords(h,'wm','wi');
   if(wio&&h.getBoundingClientRect().top>innerHeight*.9){h.classList.add('wr-pre');[].forEach.call(h.querySelectorAll('.wi'),function(w,i){w.style.transitionDelay=(i*.045)+'s'});wio.observe(h)}});
  cur.querySelectorAll('.stage:not(.rarch)').forEach(function(st){if(cio&&st.getBoundingClientRect().top>innerHeight*.95){st.classList.add('cl-pre');cio.observe(st)}});
  PAR=[].slice.call(cur.querySelectorAll('.stage>.phone,.stage>.lap,.stage>.ad,.stage>.chat,.stage>.serp,.stage>.cal'));
  SCRUB=[].slice.call(cur.querySelectorAll('.scrub')).map(function(p){splitWords(p,'sw');return{el:p,w:[].slice.call(p.querySelectorAll('.sw'))}});
  PIN=cur.querySelector('.hpin');sizePin();onScroll();
 }
 function sizePin(){if(!PIN)return;var tr=PIN.querySelector('.track');if(innerWidth<=900){PIN.style.height='';tr.style.transform='';return}
  PIN._dist=Math.max(0,tr.scrollWidth-innerWidth);PIN.style.height=(PIN.querySelector('.pin-in').offsetHeight+PIN._dist)+'px'}
 window.addEventListener('resize',sizePin);
 var lastY=scrollY,vel=0,ticking=false,marq=null;
 function onScroll(){
  var y=scrollY,vh=innerHeight,dh=document.documentElement.scrollHeight-vh;
  document.querySelector('.sprog').style.transform='scaleX('+(dh>0?y/dh:0)+')';
  if(!reduce){
   PAR.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var c=(r.top+r.height/2-vh/2)/vh;el.style.translate='0 '+(c*-46).toFixed(1)+'px'});
   SCRUB.forEach(function(o){var r=o.el.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35))),k=Math.round(p*o.w.length);o.w.forEach(function(w,i){w.classList.toggle('lit',i<k)})});
   if(PIN&&innerWidth>900&&PIN._dist){var r=PIN.getBoundingClientRect(),p=Math.min(1,Math.max(0,(76-r.top)/PIN._dist));PIN.querySelector('.track').style.transform='translate3d('+(-p*PIN._dist)+'px,0,0)';PIN.querySelector('.pin-bar span').style.transform='scaleX('+p+')'}
   vel=vel*.8+(y-lastY)*.2;marq=marq||document.querySelector('.marq');if(marq)marq.style.transform='skewX('+Math.max(-10,Math.min(10,-vel*.25)).toFixed(2)+'deg)';
  }
  lastY=y;ticking=false;
 }
 window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
 (function settle(){if(Math.abs(vel)>.05&&!reduce){vel*=.9;if(marq)marq.style.transform='skewX('+Math.max(-10,Math.min(10,-vel*.25)).toFixed(2)+'deg)'}requestAnimationFrame(settle)})();

 document.querySelectorAll('.mega .mi').forEach(function(a){function act(){var i=a.getAttribute('data-i'),m=a.closest('.mega');
  m.querySelectorAll('.mi').forEach(function(x){x.classList.toggle('on',x===a)});m.querySelectorAll('.mp').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-i')===i)})}
  a.addEventListener('mouseenter',act);a.addEventListener('focus',act)});
 show();
})();
"""

EXTRA = "@media (max-width:900px){.art-grid{grid-template-columns:minmax(0,1fr)!important}.art-grid>div:last-child{display:none}}"
EXTRA += open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"css5.txt")).read() + LOGO_CSS + SHOT_CSS
html = f'''<title>AegisKoncept Website</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="AegisKoncept: websites, SEO, ads and social media for growing Indian businesses. Based in Dwarka, New Delhi.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap">
<style>{CSS}{EXTRA}</style>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><clipPath id="arch-clip" clipPathUnits="objectBoundingBox"><path d="M0 1 V.49 C0 .236 .22 .073 .5 0 C.78 .073 1 .236 1 .49 V1 Z"/></clipPath></defs></svg>
{header()}
<main id="main">{"".join(P)}</main>
{footer()}
<script>{JS}</script>
'''
open(OUT, "w").write(html)
print("pages:", len(P), "bytes:", len(html))
