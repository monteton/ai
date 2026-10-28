// Proof (beats 32–38): four numbers from the site, 1.4 beats each. Ground flips ink / red / paper / ink. A giant outline + sits behind
// each number; the label is serif italic in front. Beat 37.5 is the hole before the lockup.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, FPS } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, whip, roll, drawSpeedLines, fitFont } from '../kit.js';
import { mkWord } from '../mk.js';

const LOOK = [
  { bg: '#111', fg: '#f2eee6', acc: '#ff4a1c', speed: '255,74,28' },
  { bg: '#ff4a1c', fg: '#111', acc: '#f2eee6', speed: '17,17,17' },
  { bg: '#f2eee6', fg: '#111', acc: '#ff4a1c', speed: '255,74,28' },
  { bg: '#111', fg: '#ff4a1c', acc: '#f2eee6', speed: '242,238,230' },
];

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '5';
  const AT = [CUE.stat1, CUE.stat2, CUE.stat3, CUE.stat4];

  const cards = TX.stats.map((st, i) => {
    const lk = LOOK[i];
    const g = el('div', 'layer', root);
    g.style.zIndex = String(i + 1);
    g.style.background = lk.bg;
    const plus = mkWord(g, st.suf.replace('M', ''), 1500, 'outline', W * 3);
    plus.d.style.color = 'transparent';
    plus.d.style.webkitTextStroke = `4px ${lk.acc}`;
    plus.d.style.opacity = '0.55';
    // the number is sized once for its final text
    const num = el('div', 'kin', g, st.to + st.suf);
    num.style.fontSize = '700px';
    num.style.color = lk.fg;
    fitFont(num, W * 0.92);
    const numSize = parseFloat(num.style.fontSize);
    Object.assign(num.style, { width: `${W}px`, textAlign: 'center', lineHeight: '0.86' });
    const numH = numSize * 0.86;
    const lab = el('div', 'abs serif', g, st.label);
    Object.assign(lab.style, { fontSize: '120px', lineHeight: '1', color: lk.fg, width: `${W}px`, textAlign: 'center' });
    const bar = el('div', 'abs', g);
    Object.assign(bar.style, { width: `${W * 0.6}px`, height: '10px', background: lk.acc, transformOrigin: '0 50%' });
    const fl = el('div', 'flash', g);
    return { g, plus, num, numH, lab, bar, fl, st, lk };
  });

  return (t, f) => {
    const on = t >= S.proof[0] && t <= S.proof[1];
    if (!on) { set(root, { vis: false }); return; }
    const last = AT.findLast((x) => x <= t) ?? AT[0];
    const sh = shake(t, last, 24, 0.3, 30 + Math.floor(t * 3));
    const wy = whip(t, CUE.logo - 0.4, 0.42, H * 1.2, 'out');
    set(root, { vis: true, x: sh.x, y: sh.y + wy, r: sh.r, o: 1 });
    cards.forEach((c, i) => {
      const T = AT[i];
      const end = i < 3 ? AT[i + 1] + 0.3 : S.proof[1];
      const vis = t >= T && t <= end;
      set(c.g, { vis });
      if (!vis) return;
      const dt = t - T;
      const sl = slam(t, T, { from: 1.6, dur: 0.22, overshoot: 0.05 });
      c.num.textContent = roll(f / FPS, T + 0.04, 0.45, 0, c.st.to) + c.st.suf;
      const cy = H * 0.4;
      const bs = slam(t, T + 0.03, { from: 1.25, dur: 0.4, overshoot: 0.02 });
      set(c.plus.d, { x: W / 2 - c.plus.w / 2 + dt * 30 * (i % 2 ? -1 : 1), y: cy - c.plus.h / 2 + 40, s: bs.s * (1 + 0.08 * dt), o: dt < 0 ? 0 : bs.o * 0.55 });
      set(c.num, { x: 0, y: cy - c.numH / 2, s: sl.s, o: dt < 0 ? 0 : sl.o });
      const lp = ease.outExpo(clamp((dt - 0.12) / 0.35));
      set(c.lab, { x: 0, y: cy + c.numH / 2 + 70 + lerp(40, 0, lp), o: clamp((dt - 0.1) / 0.08) });
      set(c.bar, { x: W * 0.2, y: cy + c.numH / 2 + 40, sx: lp, o: dt < 0.1 ? 0 : 1 });
      set(c.fl, { o: flash(t, T, 0.12, 0.35) });
      if (dt > -0.05 && dt < 0.25) drawSpeedLines(ctx.fx, t, { seed: 90 + i, n: 40, dir: i % 2 ? 1 : -1, alpha: 0.45 * (1 - clamp(dt / 0.25)), speed: 7800, color: c.lk.speed, blend: 'source-over' });
    });
    if (t > CUE.logo - 0.45 && t < CUE.logo + 0.1) drawSpeedLines(ctx.fx, t, { seed: 31, n: 60, dir: -1, vertical: true, alpha: 0.5, speed: 8000, color: '255,74,28', blend: 'source-over' });
  };
}
