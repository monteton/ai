// Brand (beats 8–14): the drop. The chrome mark slams IN FRONT of a giant MYUPPY wordmark; a second, outlined wordmark
// drifts far behind both; the subline decodes and three chips pop in front of the mark. Whip up on the way out.
import { el, set, P, ease, clamp, lerp, noise1 } from '../engine.js';
import { CUE, S, b, FPS } from '../timeline.mjs';
import { BRAND } from '../copy.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, whip, ring, scramble, makeSparks, drawSparks, drawSpeedLines } from '../kit.js';
import { mkWord, mkImg, mkBackdrop } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '2';
  const { bg, grid } = mkBackdrop(root, 'var(--accent-2)');
  const cam = el('div', 'layer', root);

  // layer 1 (far): the outlined wordmark, huge, cropped by the frame, drifting the other way
  const far = mkWord(cam, BRAND, 1100, 'accent outline', W * 3);
  far.d.style.webkitTextStroke = '3px rgba(111,243,255,.55)';
  // layer 2: the solid wordmark, behind the mark
  const mid = mkWord(cam, BRAND, 620, 'violet glow', W * 0.98);
  mid.d.style.textShadow = '0 0 40px rgba(183,164,255,.5), 0 0 140px rgba(183,164,255,.25)';
  // layer 3: the chrome mark in front
  const LW = 900;
  const logo = mkImg(cam, 'assets/img/logo-mark.png', LW);
  const LH = LW * 263 / 512;
  logo.style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,.6))';
  // layer 4: the same wordmark again, outline only, in FRONT of the mark — the letters run behind and in front of it
  const front = mkWord(cam, BRAND, mid.size, 'outline', W * 0.98);
  front.d.style.webkitTextStroke = '3px #6ff3ff';
  front.d.style.textShadow = '0 0 24px rgba(111,243,255,.6)';
  const R = 340;
  const shock = ring(cam, R, 10, 'var(--accent)');
  const shock2 = ring(cam, R, 5, '#fff');

  // front: subline + chips
  const sub = el('div', 'abs caps', cam, TX.sub);
  sub.style.fontSize = '44px';
  sub.style.color = 'var(--text)';
  const subW = sub.offsetWidth;
  const chips = TX.chips.map((txt) => { const d = el('div', 'chip', cam, txt); return { d, w: d.offsetWidth, h: d.offsetHeight }; });
  const chipPos = [[W * 0.06, H * 0.27, -6], [W * 0.66, H * 0.575, 5], [W * 0.08, H * 0.6, -3]];
  const chipAt = [CUE.chips, CUE.chips + b(0.5), CUE.chips + b(1)];

  const cy = H * 0.44; // centre of the wordmarks; the mark sits a little lower
  const sparks = makeSparks({ seed: 9, n: 170, t0: CUE.drop + 0.02, spread: 0.1, dir: -Math.PI / 2, cone: 1.6, v0: 500, v1: 1700,
    origin: (u) => [W / 2 - LW / 2 + LW * u, cy + LH * 0.55], color: [[111, 243, 255], [183, 164, 255], [255, 255, 255]], ember: false });
  const fl = el('div', 'flash', root);

  return (t, f) => {
    const on = t >= S.brand[0] && t <= S.brand[1];
    set(root, { vis: on });
    if (!on) return;
    const L = t - CUE.drop;
    set(bg, { o: P(t, S.brand[0], S.hook[1]) });
    set(grid, { x: -((t * 60) % 120), y: -((t * 40) % 120), o: 0.5 * P(t, S.brand[0], S.hook[1]) });

    // far wordmark: drifts left, grows slowly; arrives with the drop
    const sf = slam(t, CUE.drop + 0.02, { from: 1.4, dur: 0.5, overshoot: 0.02 });
    set(far.d, { x: W / 2 - far.w / 2 - (t - CUE.drop) * 55, y: cy - far.h / 2 + 40, s: sf.s, o: t < CUE.drop ? 0 : sf.o * 0.85 });
    // mid wordmark: drifts right (so its letters travel behind the mark)
    const sm = slam(t, CUE.drop + 0.05, { from: 1.7, dur: 0.3, overshoot: 0.04 });
    const dx = Math.max(0, t - CUE.drop) * 8;
    set(mid.d, { x: W / 2 - mid.w / 2 + dx, y: cy - mid.h / 2, s: sm.s, o: t < CUE.drop ? 0 : sm.o });
    set(front.d, { x: W / 2 - front.w / 2 + dx, y: cy - front.h / 2, s: sm.s, o: t < CUE.drop + 0.08 ? 0 : sm.o });
    // the mark: the heaviest slam, with a gentle float after it
    const sl = slam(t, CUE.drop, { from: 2.6, dur: 0.3, overshoot: 0.06 });
    const fy = 14 * Math.sin((t - CUE.drop) * 2.2);
    set(logo, { x: W / 2 - LW / 2, y: cy + LH * 0.1 + fy, s: sl.s, r: -3 * (1 - ease.outCubic(clamp(L / 0.3))), o: t < CUE.drop ? 0 : sl.o });

    const rp = clamp(L / 0.7);
    set(shock, { x: W / 2 - R - 20, y: cy + LH * 0.3 - R - 20, s: 0.3 + rp * 3, o: L < 0 ? 0 : (1 - rp) * 0.7 });
    const rp2 = clamp((L - 0.12) / 0.7);
    set(shock2, { x: W / 2 - R - 20, y: cy + LH * 0.3 - R - 20, s: 0.3 + rp2 * 3.4, o: L < 0.12 ? 0 : (1 - rp2) * 0.4 });
    if (L > 0 && L < 1.4) drawSparks(ctx.fx, sparks, t, 1);

    // subline decodes under the mark; chips pop in front, each with its own tilt
    const sp = clamp((f / FPS - CUE.sub) / 0.6);
    sub.textContent = scramble(TX.sub, sp, f / FPS, 5);
    set(sub, { x: W / 2 - subW / 2, y: cy + LH * 0.1 + LH + 70, o: t < CUE.sub ? 0 : 1 });
    chips.forEach((c, i) => {
      const d = t - chipAt[i];
      const pp = ease.outBackHard(clamp(d / 0.32));
      set(c.d, { x: chipPos[i][0], y: chipPos[i][1] + lerp(60, 0, pp) + 8 * Math.sin(t * 2 + i * 2), s: lerp(0.4, 1, pp), r: chipPos[i][2], o: clamp(d / 0.05) });
    });

    const sh = shake(t, CUE.drop, 30, 0.55, 17);
    const wy = whip(t, CUE.brandExit, S.brand[1] - CUE.brandExit, H * 1.3, 'out');
    set(cam, { x: sh.x, y: sh.y + wy, r: sh.r, s: 1 + 0.03 * P(t, CUE.drop, CUE.brandExit, ease.inOutSine) });
    if (t > CUE.brandExit - 0.05 && t < S.brand[1]) drawSpeedLines(ctx.fx, t, { seed: 41, n: 60, vertical: true, dir: -1, alpha: 0.55, speed: 8200, color: '183,164,255' });
    set(fl, { o: flash(t, CUE.drop, 0.14, 0.55) });
  };
}
