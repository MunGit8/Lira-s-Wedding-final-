/* ===== EASY-EDIT SETTINGS ===== */
const CONFIG = {
  weddingDate: "2026-12-12T19:00:00+06:00",   // 12 Dec 2026, 7:00 PM Bangladesh time
  musicVolume: 0.5                            // 0 to 1
};

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = innerWidth < 700;

/* ---------- Botanical wreath (SVG, generated) ---------- */
(function wreath(){
  const svg = $("wreath"); let s = "";
  const leaf = (a, r, sc, o) => `<g transform="rotate(${a}) translate(0 ${-r}) scale(${sc})" opacity="${o}"><path d="M0 0C9 -10 9 -26 0 -38C-9 -26 -9 -10 0 0Z" fill="#E6D3A3" stroke="#A78B55" stroke-width=".8"/><path d="M0 -3V-33" stroke="#A78B55" stroke-width=".6"/></g>`;
  s += `<circle r="62" fill="none" stroke="#C6A96C" stroke-width="1"/><circle r="58" fill="none" stroke="#C6A96C" stroke-width=".4" stroke-dasharray="1 3"/>`;
  for (let i = 0; i < 28; i++) s += leaf(i * 360/28, 64, .62, .95);
  for (let i = 0; i < 20; i++) s += leaf(i * 18 + 9, 50, -.5, .8).replace("translate(0 -50) scale(-0.5)", "translate(0 -50) scale(.5,-.5)");
  for (let i = 0; i < 8; i++) { const a = i*45 + 22.5; s += `<g transform="rotate(${a}) translate(0 -88)"><circle r="6" fill="#F4F0E6" stroke="#C6A96C"/><circle r="2.2" fill="#C6A96C"/><circle cx="0" cy="-8" r="2" fill="#C6A96C"/></g>`; }
  svg.innerHTML = s;
})();

/* ---------- Particle / firework canvas ---------- */
const cv = $("fx"), ctx = cv.getContext("2d");
let W, H, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], boom = [], running = false, ambient = false;
function size(){ W = innerWidth; H = innerHeight; cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
addEventListener("resize", size); size();
const gold = ["255,236,176","230,205,140","198,169,108","255,248,225"];
const spr = document.createElement("canvas"); spr.width = spr.height = 64;
(g => { const r = g.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,"rgba(255,253,244,1)"); r.addColorStop(.18,"rgba(255,244,214,.95)"); r.addColorStop(.45,"rgba(255,226,172,.35)"); r.addColorStop(1,"rgba(255,215,160,0)"); g.fillStyle = r; g.fillRect(0,0,64,64); })(spr.getContext("2d"));
function dust(x, y, burst){
  const a = Math.random()*6.283, v = burst ? Math.random()*1.6+.3 : Math.random()*.25;
  parts.push({x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v - (burst ? .25 : .12), r: Math.random()*2.6+.8, l: 0, m: burst ? 90+Math.random()*120 : 260+Math.random()*220, bokeh: !burst && Math.random() < .14, ph: Math.random()*6.283});
}
function firework(x, y){
  const n = mobile ? 26 : 44, c = gold[(Math.random()*3)|0];
  for (let i = 0; i < n; i++){ const a = i/n*6.283, v = 1.8 + Math.random()*1.6; boom.push({x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v, l: 0, m: 55+Math.random()*25, c}); }
}
function tick(){
  if (!running) return;
  ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
  if (ambient && parts.length < (mobile ? 26 : 50) && Math.random() < .5) dust(Math.random()*W, Math.random()*H, false);
  ctx.globalCompositeOperation = cv.classList.contains("free") ? "source-over" : "lighter";
  parts = parts.filter(p => p.l++ < p.m);
  for (const p of parts){
    p.x += p.vx; p.y += p.vy; const t = Math.sin(Math.PI*p.l/p.m), tw = .75 + .25*Math.sin(p.l*.08 + p.ph), s = p.r*(p.bokeh ? 9 : 4);
    ctx.globalAlpha = Math.max(0, (p.bokeh ? .4 : .95)*t*tw); ctx.drawImage(spr, p.x-s, p.y-s, s*2, s*2);
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = "lighter";
  boom = boom.filter(p => p.l++ < p.m);
  for (const p of boom){
    p.vx *= .965; p.vy = p.vy*.965 + .035; p.x += p.vx; p.y += p.vy; const t = 1 - p.l/p.m;
    ctx.beginPath(); ctx.fillStyle = `rgba(${p.c},${t})`; ctx.arc(p.x, p.y, 1.8*t+.4, 0, 6.283); ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  if (parts.length || boom.length || ambient) requestAnimationFrame(tick); else running = false;
}
function start(){ if (!running && !reduce){ running = true; requestAnimationFrame(tick); } }

/* ---------- Embossed rose & leaf corners (tone-on-tone, like letterpress paper) ---------- */
function embSVG(fx, fy){
  const lf=(x,y,a,s)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C7-7 7-20 0-30C-7-20-7-7 0 0Z"/><path d="M0-3V-24" fill="none"/></g>`;
  const rose=(x,y,s)=>{let o=`<g transform="translate(${x} ${y}) scale(${s})"><circle r="15"/>`;
    for(let k=0;k<5;k++)o+=`<ellipse rx="8" ry="11" cy="-7" transform="rotate(${k*72})"/>`;
    for(let k=0;k<4;k++)o+=`<ellipse rx="5.5" ry="7.5" cy="-4" transform="rotate(${k*90+30})"/>`;
    return o+'<path d="M-3 0C-3-4 3-4 3 0C3 3-2 4-3 1" fill="none"/></g>';};
  const fl=(x,y,s)=>{let o=`<g transform="translate(${x} ${y}) scale(${s})">`;for(let k=0;k<5;k++)o+=`<ellipse rx="3" ry="5" cy="-5" transform="rotate(${k*72})"/>`;return o+'<circle r="1.8"/></g>';};
  let br='<path d="M40 16C80 18 120 13 162 8" fill="none"/>';
  for(let i=0;i<8;i++)br+=lf(52+i*14,15-i*.6,i%2?140:40,.78-i*.045);
  br+=fl(88,30,1)+fl(128,24,.85)+rose(76,44,.8)+'<circle cx="150" cy="22" r="2"/><circle cx="158" cy="17" r="1.6"/>';
  const m=`matrix(${fx} 0 0 ${fy} ${fx<0?170:0} ${fy<0?170:0})`;
  return `<svg viewBox="0 0 170 170" aria-hidden="true"><g transform="${m}"><g>${br}</g><g transform="matrix(0 1 1 0 0 0)">${br}</g>${rose(32,32,1.45)}</g></svg>`;
}
document.querySelectorAll(".paper").forEach(p=>{[["tl",1,1],["tr",-1,1],["bl",1,-1],["br",-1,-1]].forEach(([k,x,y])=>{const d=document.createElement("div");d.className="emb "+k;d.innerHTML=embSVG(x,y);p.prepend(d);});});

/* ---------- Opening sequence ---------- */
let opened = false;
$("seal").addEventListener("click", () => {
  if (opened) return; opened = true;
  const cover = $("cover"); cover.classList.add("opening");
  const r = $("env").getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2;
  start();
  const spawn = setInterval(() => { for (let i = 0; i < (mobile ? 3 : 6); i++) dust(cx + (Math.random()-.5)*r.width, cy + (Math.random()-.5)*r.height, true); }, 60);
  [2000, 2700, 3300].forEach((t, i) => setTimeout(() => firework(i === 1 ? cx : cx + (i ? 1 : -1)*r.width*.7, cy - r.height*(.3 + Math.random()*.15)), t));
  setTimeout(() => { clearInterval(spawn); cv.classList.add("free"); document.body.appendChild(cv); cover.classList.add("gone"); document.body.classList.remove("locked"); document.body.classList.add("ready"); ambient = true; start(); scrollTo(0, 0); }, 4800);
  setTimeout(() => { cover.style.display = "none"; }, 6600);
});

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.weddingDate).getTime(), pad = n => String(n).padStart(2, "0");
function count(){
  const diff = target - Date.now();
  if (diff <= 0){ $("timer").hidden = true; $("done").hidden = false; return; }
  $("d").textContent = pad(Math.floor(diff/864e5)); $("h").textContent = pad(Math.floor(diff/36e5)%24);
  $("m").textContent = pad(Math.floor(diff/6e4)%60); $("s").textContent = pad(Math.floor(diff/1e3)%60);
}
count(); setInterval(count, 1000);

/* ---------- Navigation highlight ---------- */
const links = [...document.querySelectorAll("#nav a")];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), {threshold: .5});
document.querySelectorAll(".page").forEach(p => io.observe(p));

/* ---------- Music: soft ambient piano-pad generated live in the browser ----------
   No audio file, no copyright: every note is synthesised by the Web Audio API.
   Starts only when the guest taps the ♪ button. */
(function music(){
  const AC = window.AudioContext || window.webkitAudioContext, box = $("music");
  if (!AC) return;
  box.hidden = false;
  const play = $("play"), mute = $("mute");
  let ctx, out, master, timers = [], step = 0, playing = false, muted = false;
  const chords = [[130.81,196,246.94,329.63],[110,164.81,261.63,329.63],[87.31,174.61,261.63,329.63],[98,196,246.94,329.63]];
  const pent = [523.25,587.33,659.25,783.99,880,1046.5];
  function tone(f, dur, vol, type, att){
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .1);
  }
  const chord = () => chords[step++ % 4].forEach(f => { tone(f, 9, .05, "triangle", 3); tone(f*1.004, 9, .03, "sine", 3); });
  const bell = () => { if (Math.random() < .7) tone(pent[(Math.random()*6)|0], 3.2, .035, "sine", .03); };
  function build(){
    ctx = new AC(); out = ctx.createGain(); out.gain.value = CONFIG.musicVolume; out.connect(ctx.destination);
    master = ctx.createGain(); master.connect(out);
    const d = ctx.createDelay(); d.delayTime.value = .55; const fb = ctx.createGain(); fb.gain.value = .45;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
    master.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(out);
  }
  function go(){ chord(); timers = [setInterval(chord, 8000), setInterval(bell, 1900)]; }
  play.addEventListener("click", async () => {
    if (!ctx) build();
    if (!playing){ await ctx.resume(); go(); playing = true; play.classList.add("active"); play.setAttribute("aria-label", "Pause music"); }
    else { timers.forEach(clearInterval); await ctx.suspend(); playing = false; play.classList.remove("active"); play.setAttribute("aria-label", "Play music"); }
  });
  mute.addEventListener("click", () => {
    muted = !muted; if (out) out.gain.value = muted ? 0 : CONFIG.musicVolume;
    mute.textContent = muted ? "🔇" : "🔈"; mute.classList.toggle("active", muted);
  });
})();
