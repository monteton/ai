// Proof (beats 37–43): four numbers from the site, one per beat and a half. Each is three layers deep: the label as a giant
// outline behind, the number in chrome in the middle, a caps label and a sweeping bar in front. The ground flips colour on
// every number. Beat 42.5 is the hole before the logo.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, b, FPS } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, whip, roll, drawSpeedLines, fitFont } from '../kit.js';
import { mkWord } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '5';
  const AT = [CUE.stat1, CUE.stat2, CUE.stat3, CUE.stat4];
  const TINT = ['#6ff3ff', '#b7a4ff', '#6ff3ff', '#b7a4ff'];

  const cards = TX.stats.map((st, i) => {
    const g = el('div', 'layer', root);
    g.style.zIndex = String(i + 1);
    g.style.background = `radial-gradient(ellipse 90% 60% at 50% 45%, color-mix(in srgb, ${TINT[i]} 24%, #04050a) 0%, #04050a 76%)`;
    const grid = el('div', 'layer grid', g);
    grid.style.backgroundSize = '120px 120px';
    grid.style.opacity = '0.5';
    const back = mkWord(g, st.label.split(' ')[0], 640, 'outline', W * 0.98);
    back.d.style.webkitTextStroke = `3px ${TINT[i]}88`;
    // the number is sized once for its final text so «250+» and «15M+» both fill the frame
    const num = el('div', 'kin chrome', g, st.to + st.suf);
    num.style.fontSize = '900px';
    fitFont(num, W * 0.94);
    const numSize = parseFloat(num.style.fontSize);
    Object.assign(num.style, { width: `${W}px`, textAlign: 'center', lineHeight: '0.86' });
    const numH = numSize * 0.86;
    const lab = el('div', 'abs caps', g, st.label);
    Object.assign(lab.style, { fontSize: '60px', color: TINT[i], letterSpacing: '0.2em', width: `${W}px`, textAlign: 'center', textShadow: `0 0 30px ${TINT[i]}88` });
    const bar = el('div', 'abs', g);
    Object.assign(bar.style, { width: `${W * 0.7}px`, height: '8px', background: TINT[i], boxShadow: `0 0 24px ${TINT[i]}`, transformOrigin: '0 50%' });
    const fl = el('div', 'flash', g);
    return { g, grid, back, num, numH, lab, bar, fl, st };
  });

  return (t, f) => {
    const on = t >= S.proof[0] && t <= S.proof[1];
    if (!on) { set(root, { vis: false }); return; }
    const sh = shake(t, AT.findLast((x) => x <= t) ?? AT[0], 24, 0.3, 30 + Math.floor(t * 3));
    const wy = whip(t, CUE.logo - 0.4, 0.42, H * 1.2, 'out');
    set(root, { vis: true, x: sh.x, y: sh.y + wy, r: sh.r, o: 1 });
    cards.forEach((c, i) => {
      const T = AT[i];
      const end = i < 3 ? AT[i + 1] + 0.3 : S.proof[1];
      const vis = t >= T - 0.1 && t <= end;
      set(c.g, { vis });
      if (!vis) return;
      const dt = t - T;
      set(c.grid, { x: -((t * 80) % 120) * (i % 2 ? -1 : 1), y: -((t * 50) % 120), o: 0.5 });
      const sl = slam(t, T, { from: 1.6, dur: 0.22, overshoot: 0.05 });
      c.num.textContent = roll(f / FPS, T + 0.04, 0.45, 0, c.st.to) + c.st.suf;
      set(c.num, { x: 0, y: H * 0.42 - c.numH / 2, s: sl.s, o: dt < 0 ? 0 : sl.o });
      // the label word behind the number scales slowly against it
      const bs = slam(t, T + 0.03, { from: 1.3, dur: 0.4, overshoot: 0.02 });
      set(c.back.d, { x: W / 2 - c.back.w / 2 - dt * 40 * (i % 2 ? -1 : 1), y: H * 0.42 - c.back.h / 2 + 10, s: bs.s * (1 + 0.1 * dt), o: dt < 0 ? 0 : bs.o * 0.9 });
      const lp = ease.outExpo(clamp((dt - 0.12) / 0.35));
      set(c.lab, { x: 0, y: H * 0.42 + c.numH / 2 + 40 + lerp(30, 0, lp), o: clamp((dt - 0.1) / 0.08) });
      set(c.bar, { x: W * 0.15, y: H * 0.42 + c.numH / 2 + 12, sx: lp, o: dt < 0.1 ? 0 : 1 });
      set(c.fl, { o: flash(t, T, 0.12, 0.45) });
      if (dt > -0.05 && dt < 0.25) drawSpeedLines(ctx.fx, t, { seed: 90 + i, n: 40, dir: i % 2 ? 1 : -1, alpha: 0.45 * (1 - clamp(dt / 0.25)), speed: 7800, color: i % 2 ? '200,190,255' : '170,235,255' });
    });
    if (t > CUE.logo - 0.45 && t < CUE.logo + 0.1) drawSpeedLines(ctx.fx, t, { seed: 31, n: 60, dir: -1, vertical: true, alpha: 0.5, speed: 8000 });
  };
}
