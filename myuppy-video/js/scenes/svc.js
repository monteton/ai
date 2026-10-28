// Services (beats 14–29): five panels of three beats. Each is a sandwich: a giant word BEHIND the object (a glass lens, a
// waveform, a chart, a circuit, a shard burst), the object in the middle, an outlined slice of the same word IN FRONT of it,
// and the site's own line under it. Panels arrive on a diagonal wipe, on the beat.
import { el, set, P, ease, clamp, lerp, noise1 } from '../engine.js';
import { CUE, S, SVC_AT, BEAT, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shakes, slam, flash, slashClip, drawSpeedLines } from '../kit.js';
import { mkWord, mkImg } from '../mk.js';

const LOOKS = [
  { color: '#b7a4ff', filter: 'none', chrome: false },
  { color: '#6ff3ff', filter: 'none', chrome: false },
  { color: '#b7a4ff', filter: 'none', chrome: false },
  { color: '#6ff3ff', filter: 'hue-rotate(38deg) saturate(1.15) brightness(1.12)', chrome: false },
  { color: '#eef2f8', filter: 'hue-rotate(212deg) saturate(1.1) brightness(1.05)', chrome: true },
];
const FEATHER = 'radial-gradient(ellipse closest-side at 50% 50%, #000 62%, transparent 100%)';
const CY = H * 0.4;

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '3';
  const ends = SVC_AT.map((t) => t + b(3));

  const panels = TX.svc.map((sv, i) => {
    const look = LOOKS[i];
    const g = el('div', 'layer', root);
    g.style.zIndex = String(i + 1);
    g.style.background = `radial-gradient(ellipse 85% 55% at 50% 42%, color-mix(in srgb, ${look.color} 18%, #04050a) 0%, #04050a 74%)`;
    const grid = el('div', 'layer grid', g);
    grid.style.backgroundSize = '120px 120px';
    grid.style.opacity = '0.45';

    // 1. the word, behind
    const word = mkWord(g, sv.word, 800, look.chrome ? 'chrome' : '', W * 0.98);
    if (!look.chrome) { word.d.style.color = look.color; word.d.style.textShadow = `0 0 50px ${look.color}66, 0 0 160px ${look.color}33`; }
    word.d.style.transformOrigin = '50% 55%';

    // 2. the object
    let obj; let bars = null;
    if (sv.img === 'wave') {
      obj = el('div', 'layer', g);
      const N = 41;
      bars = Array.from({ length: N }, (_, k) => {
        const d = el('div', 'abs', obj);
        Object.assign(d.style, { width: '15px', height: '900px', borderRadius: '8px', transformOrigin: '50% 50%',
          background: `linear-gradient(180deg, #fff, ${k % 2 ? '#6ff3ff' : '#b7a4ff'})`, boxShadow: '0 0 28px rgba(111,243,255,.55)' });
        return d;
      });
    } else {
      obj = mkImg(g, `assets/img/${sv.img === 'lens' ? 'lens' : sv.img}.jpg`, sv.img === 'market' ? 1500 : 1400, 'screen');
      Object.assign(obj.style, { filter: look.filter, webkitMaskImage: FEATHER, maskImage: FEATHER });
    }
    const OW = sv.img === 'market' ? 1500 : 1400;
    const oh = sv.img === 'wave' ? 0 : (sv.img === 'market' ? OW * 700 / 1024 : OW);

    // 3. the slice of the word in front: outline only, bottom 46 % of the letters
    const front = mkWord(g, sv.word, word.size, 'outline', W * 0.98);
    front.d.style.webkitTextStroke = '4px #eef2f8';
    front.d.style.clipPath = 'inset(54% 0 0 0)';
    front.d.style.transformOrigin = '50% 55%';

    // 4. the site's line, in front of everything
    const bar = el('div', 'abs', g);
    Object.assign(bar.style, { width: '240px', height: '10px', background: look.color, boxShadow: `0 0 24px ${look.color}`, transformOrigin: '0 50%' });
    const cap = el('div', 'abs', g, sv.line);
    Object.assign(cap.style, { width: `${W - 180}px`, font: `400 84px/0.98 var(--display)`, textTransform: 'uppercase', color: '#eef2f8', letterSpacing: '0.01em' });
    const capH = cap.offsetHeight;
    const fl = el('div', 'flash', g);
    return { g, grid, word, obj, oh, OW, bars, front, bar, cap, capH, fl, look, dir: i % 2 ? -1 : 1 };
  });

  return (t) => {
    const on = t >= S.svc[0] && t <= S.svc[1];
    if (!on) { set(root, { vis: false }); return; }
    const sh = shakes(t, SVC_AT, 16, 0.32);
    set(root, { vis: true, x: sh.x, y: sh.y, r: sh.r });
    panels.forEach((p, i) => {
      const T = SVC_AT[i];
      const start = T - 0.12;
      const visible = t >= start && t <= (i < panels.length - 1 ? ends[i] + 0.4 : S.svc[1]);
      set(p.g, { vis: visible });
      if (!visible) return;
      p.g.style.clipPath = i === 0 && t > T + 0.4 ? 'none' : slashClip(P(t, start, start + 0.34, ease.outExpo), 18);
      const dt = t - T;
      set(p.grid, { x: -((t * 70) % 120) * p.dir, y: -((t * 45) % 120), o: 0.45 });

      // the word: slams on the beat, drifts sideways behind the object
      const sl = slam(t, T, { from: 1.55, dur: 0.26, overshoot: 0.05 });
      const drift = (dt - 0.4) * 26 * p.dir;
      set(p.word.d, { x: W / 2 - p.word.w / 2 + drift, y: CY - p.word.h / 2, s: sl.s, o: dt < 0 ? 0 : sl.o });
      set(p.front.d, { x: W / 2 - p.front.w / 2 + drift * 1.8, y: CY - p.front.h / 2, s: sl.s, o: dt < 0.06 ? 0 : sl.o });

      // the object: flies in against the drift on a whip, then floats and pushes in slowly
      const ar = ease.outExpo(clamp(dt / 0.5));
      if (p.bars) {
        const N = p.bars.length;
        const kick = Math.exp(-(((t - SVC_AT[1]) % BEAT) + BEAT) % BEAT * 5);
        p.bars.forEach((d, k) => {
          const u = (k - (N - 1) / 2) / ((N - 1) / 2);
          const env = 0.35 + 0.65 * Math.abs(noise1(k * 0.55 + t * 3.2, 5));
          const h = (60 + 780 * env * (1 - 0.55 * Math.abs(u)) * (0.55 + 0.45 * kick)) * ar;
          set(d, { x: W / 2 - 15 / 2 + u * 470 * 1.02, y: CY - h / 2, sy: h / 900, o: dt < 0 ? 0 : 0.95 });
        });
        set(p.obj, { x: 0, y: 0, o: 1 });
      } else {
        const push = 1 + 0.12 * P(dt, 0, 1.6, ease.outCubic);
        set(p.obj, { x: W / 2 - p.OW / 2 + lerp(W * 0.9 * p.dir, 0, ar), y: CY - p.oh / 2 + 16 * Math.sin(t * 2.4 + i), s: push * lerp(1.35, 1, ar), r: lerp(8 * p.dir, 0, ar), o: dt < 0 ? 0 : 1 });
      }

      // the line: bar draws, text rises
      const cp = ease.outExpo(clamp((dt - 0.5) / 0.4));
      set(p.bar, { x: 90, y: H * 0.735 - 30, sx: cp, o: dt < 0.5 ? 0 : 1 });
      set(p.cap, { x: 90, y: H * 0.735 + lerp(40, 0, cp), o: clamp((dt - 0.5) / 0.1) });
      set(p.fl, { o: flash(t, T, 0.12, 0.35) });
      if (dt > -0.1 && dt < 0.3) drawSpeedLines(ctx.fx, t, { seed: 60 + i, n: 36, dir: -p.dir, alpha: 0.4 * (1 - clamp(dt / 0.3)), speed: 7000, color: p.look.color === '#6ff3ff' ? '170,235,255' : '200,190,255' });
    });
  };
}
