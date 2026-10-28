// Events (beats 28–32): four festivals the site lists, one per beat, each a slab of colour with its first word set huge and the full
// name small under it. They stack down the frame like a bill poster; a whip down hands over to the numbers.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, whip, drawSpeedLines } from '../kit.js';
import { mkWord } from '../mk.js';

const ROWS = [
  { bg: '#f2eee6', fg: '#111', sm: '#ff4a1c' },
  { bg: '#111', fg: '#f2eee6', sm: '#ff4a1c' },
  { bg: '#ff4a1c', fg: '#111', sm: '#f2eee6' },
  { bg: '#f2eee6', fg: '#ff4a1c', sm: '#111' },
];

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '4';
  const base = el('div', 'layer', root);
  base.style.background = '#f2eee6';
  const cam = el('div', 'layer', root);
  const head = el('div', 'abs serif', cam, TX.namesHead);
  Object.assign(head.style, { fontSize: '88px', lineHeight: '1', color: '#111' });
  const headW = head.offsetWidth;
  const RH = 372;
  const top = 250;
  const rows = TX.names.map((n, i) => {
    const slab = el('div', 'abs', cam);
    Object.assign(slab.style, { width: `${W}px`, height: `${RH}px`, background: ROWS[i].bg, transformOrigin: '0 50%' });
    const big = mkWord(cam, n.big, 700, '', W * 0.94);
    big.d.style.color = ROWS[i].fg;
    const small = el('div', 'abs caps', cam, n.small);
    Object.assign(small.style, { fontSize: '30px', color: ROWS[i].sm, fontWeight: '800' });
    return { slab, big, small, w: small.offsetWidth, y: top + i * RH };
  });
  const fl = el('div', 'flash', root);
  const at = [0, 1, 2, 3].map((i) => CUE.names + b(i));

  return (t) => {
    const on = t >= S.names[0] && t <= S.names[1];
    if (!on) { set(root, { vis: false }); return; }
    const wy = whip(t, CUE.stat1 - 0.4, 0.42, H * 1.2, 'out');
    set(root, { vis: true, o: 1 });
    set(base, { o: P(t, S.names[0], S.svc[1]) });
    const hp = ease.outExpo(clamp((t - S.names[0] - 0.1) / 0.4));
    set(head, { x: W / 2 - headW / 2, y: 110 + lerp(40, 0, hp), o: hp });
    rows.forEach((r, i) => {
      const T = at[i];
      const d = t - T;
      const wp = ease.outExpo(clamp(d / 0.3));
      const sl = slam(t, T, { from: 1.3, dur: 0.24, overshoot: 0.04 });
      set(r.slab, { x: 0, y: r.y, sx: wp, o: d < 0 ? 0 : 1 });
      set(r.big.d, { x: W / 2 - r.big.w / 2, y: r.y + RH / 2 - r.big.h / 2 - 28, s: sl.s, o: d < 0 ? 0 : sl.o });
      set(r.small, { x: W / 2 - r.w / 2, y: r.y + RH - 70, o: d < 0.08 ? 0 : 1 });
      if (d > -0.05 && d < 0.25) drawSpeedLines(ctx.fx, t, { seed: 80 + i, n: 26, dir: i % 2 ? 1 : -1, alpha: 0.4 * (1 - clamp(d / 0.25)), speed: 7000, color: '17,17,17', blend: 'source-over' });
    });
    const sh = shake(t, at[Math.min(3, Math.max(0, Math.floor((t - CUE.names) / b(1))))] ?? CUE.names, 14, 0.3, 77);
    set(cam, { x: sh.x, y: sh.y + wy, r: sh.r });
    set(fl, { o: Math.max(...at.map((a) => flash(t, a, 0.1, 0.2))) });
  };
}
