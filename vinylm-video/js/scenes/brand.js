// Brand (beats 6–12): the drop, on ink. A giant red M sits BEHIND the logo, the logo slams in the middle, an outline of the same M
// cuts across the logo in front. Serif italic subline, the place in caps, three red chips; whip up on the way out.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, b, FPS } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, whip, ring, scramble, makeSparks, drawSparks, drawSpeedLines } from '../kit.js';
import { mkWord, mkImg } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene dark', ctx.stage);
  root.style.zIndex = '2';
  const bg = el('div', 'layer', root);
  bg.style.background = 'radial-gradient(ellipse 80% 55% at 50% 40%, #2a1a14 0%, #111 72%)';
  const cam = el('div', 'layer', root);

  const CY = H * 0.4;
  // layer 1: a giant M, red, behind the logo
  const m = mkWord(cam, 'M', 1250, 'red', W * 1.05);
  const mOut = mkWord(cam, 'M', m.size, 'outline', W * 1.05);
  mOut.d.style.color = 'transparent';
  mOut.d.style.webkitTextStroke = '3px rgba(242,238,230,.5)';
  // layer 2: the logo (paper version, for dark grounds)
  const LW = 800;
  const LH = LW * 659 / 700;
  const logo = mkImg(cam, 'assets/img/logo-light.png', LW);
  logo.style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,.55))';
  const R = 360;
  const shock = ring(cam, R, 12, '#ff4a1c');
  const shock2 = ring(cam, R, 5, '#f2eee6');

  const sub = el('div', 'abs serif paper', cam, TX.sub);
  sub.style.fontSize = '132px';
  sub.style.lineHeight = '1';
  const subW = sub.offsetWidth;
  const place = el('div', 'abs caps paper', cam, TX.place);
  place.style.fontSize = '32px';
  place.style.opacity = '0.8';
  const placeW = place.offsetWidth;
  const chips = TX.chips.map((txt) => { const d = el('div', 'chip', cam, txt); return { d, w: d.offsetWidth, h: d.offsetHeight }; });
  const chipPos = [[W * 0.05, H * 0.185, -6], [W * 0.63, H * 0.55, 5], [W * 0.06, H * 0.575, -3]];
  const chipAt = [CUE.chips, CUE.chips + b(0.5), CUE.chips + b(1)];
  const sparks = makeSparks({ seed: 9, n: 160, t0: CUE.drop + 0.02, spread: 0.1, dir: -Math.PI / 2, cone: 1.6, v0: 500, v1: 1700,
    origin: (u) => [W / 2 - LW / 2 + LW * u, CY + LH * 0.4], color: [[255, 74, 28], [242, 238, 230], [255, 140, 90]], ember: false });
  const fl = el('div', 'flash', root);

  return (t, f) => {
    const on = t >= S.brand[0] && t <= S.brand[1];
    set(root, { vis: on });
    if (!on) return;
    const L = t - CUE.drop;
    const sm = slam(t, CUE.drop + 0.04, { from: 1.5, dur: 0.32, overshoot: 0.03 });
    set(m.d, { x: W / 2 - m.w / 2 + Math.max(0, L) * 6, y: CY - m.h / 2 + 40, s: sm.s, o: t < CUE.drop ? 0 : sm.o });
    set(mOut.d, { x: W / 2 - mOut.w / 2 + Math.max(0, L) * 6, y: CY - mOut.h / 2 + 40, s: sm.s, o: t < CUE.drop + 0.08 ? 0 : sm.o });
    const sl = slam(t, CUE.drop, { from: 2.4, dur: 0.3, overshoot: 0.06 });
    set(logo, { x: W / 2 - LW / 2, y: CY - LH / 2 + 12 * Math.sin(L * 2.2), s: sl.s, r: -3 * (1 - ease.outCubic(clamp(L / 0.3))), o: t < CUE.drop ? 0 : sl.o });
    const rp = clamp(L / 0.7);
    set(shock, { x: W / 2 - R - 20, y: CY - R - 20, s: 0.3 + rp * 3, o: L < 0 ? 0 : (1 - rp) * 0.8 });
    const rp2 = clamp((L - 0.12) / 0.7);
    set(shock2, { x: W / 2 - R - 20, y: CY - R - 20, s: 0.3 + rp2 * 3.4, o: L < 0.12 ? 0 : (1 - rp2) * 0.5 });
    if (L > 0 && L < 1.4) drawSparks(ctx.fx, sparks, t, 1);

    const sp = ease.outExpo(clamp((t - CUE.sub) / 0.5));
    set(sub, { x: W / 2 - subW / 2, y: H * 0.655 + lerp(50, 0, sp), o: clamp((t - CUE.sub) / 0.08) });
    place.textContent = scramble(TX.place, clamp((f / FPS - CUE.sub - 0.2) / 0.6), f / FPS, 4, 'ABCDEFGHJKLMNOPRSTUVZ0123456789·');
    set(place, { x: W / 2 - placeW / 2, y: H * 0.655 + 175, o: t < CUE.sub + 0.2 ? 0 : 0.8 });
    chips.forEach((c, i) => {
      const d = t - chipAt[i];
      const pp = ease.outBackHard(clamp(d / 0.32));
      set(c.d, { x: chipPos[i][0], y: chipPos[i][1] + lerp(60, 0, pp) + 8 * Math.sin(t * 2 + i * 2), s: lerp(0.4, 1, pp), r: chipPos[i][2], o: clamp(d / 0.05) });
    });

    const sh = shake(t, CUE.drop, 30, 0.55, 17);
    const wy = whip(t, CUE.brandExit, S.brand[1] - CUE.brandExit, H * 1.3, 'out');
    set(cam, { x: sh.x, y: sh.y + wy, r: sh.r, s: 1 + 0.03 * P(t, CUE.drop, CUE.brandExit, ease.inOutSine) });
    if (t > CUE.brandExit - 0.05 && t < S.brand[1]) drawSpeedLines(ctx.fx, t, { seed: 41, n: 60, vertical: true, dir: -1, alpha: 0.5, speed: 8200, color: '255,120,80' });
    set(fl, { o: flash(t, CUE.drop, 0.14, 0.55) });
  };
}
