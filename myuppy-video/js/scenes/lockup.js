// Lockup (beat 43 → end): the chrome mark slams in front of a giant MYUPPY again; «ЕСТЬ ПРОЕКТ? ОБСУДИМ» lands under it,
// the three contacts pop one by one; a last hit on beat 49 and the frame holds with a slow push for ~4.4 s.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, DURATION, b } from '../timeline.mjs';
import { BRAND } from '../copy.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, ring, scramble, makeSparks, drawSparks } from '../kit.js';
import { mkWord, mkImg, mkBackdrop, ICONS } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '6';
  const bg = el('div', 'layer', root);
  bg.style.background = 'radial-gradient(ellipse 80% 50% at 50% 38%, color-mix(in srgb, var(--accent-2) 20%, #04050a) 0%, #04050a 72%)';
  const grid = el('div', 'layer grid', root);
  grid.style.backgroundSize = '120px 120px';
  grid.style.opacity = '0.45';
  const lock = el('div', 'layer', root);
  lock.style.transformOrigin = '50% 45%';

  const cy = H * 0.18;
  const mid = mkWord(lock, BRAND, 480, 'violet glow', W * 0.98);
  mid.d.style.textShadow = '0 0 40px rgba(183,164,255,.5), 0 0 140px rgba(183,164,255,.25)';
  const LW = 560;
  const LH = LW * 263 / 512;
  const logo = mkImg(lock, 'assets/img/logo-mark.png', LW);
  logo.style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,.6))';
  const front = mkWord(lock, BRAND, mid.size, 'outline', W * 0.98);
  front.d.style.webkitTextStroke = '3px #6ff3ff';
  front.d.style.textShadow = '0 0 24px rgba(111,243,255,.6)';
  const R = 320;
  const shock = ring(lock, R, 10, 'var(--accent)');
  const shock2 = ring(lock, R, 6, '#fff');

  const tag = el('div', 'abs caps', lock, TX.tagline);
  tag.style.fontSize = '40px';
  tag.style.color = 'var(--text)';
  const tagW = tag.offsetWidth;
  const c1 = mkWord(lock, TX.cta[0], 250, '', W * 0.94);
  const c2 = mkWord(lock, TX.cta[1], 420, 'accent glow', W * 0.94);
  const pills = TX.contacts.map((c) => {
    const s = 36;
    const d = el('div', 'pill', lock, `<i style="width:70px;height:70px"><svg width="${s}" height="${s}" viewBox="0 0 24 24">${ICONS[c.icon] || ''}</svg></i><span>${c.text}</span>`);
    Object.assign(d.style, { height: '92px', padding: '0 40px 0 10px', font: '400 62px/1 var(--display)', letterSpacing: '0.04em' });
    return { d, w: d.offsetWidth, h: d.offsetHeight };
  });
  const pillY = H * 0.685;
  pills.forEach((p, i) => { p.x = W / 2 - p.w / 2; p.y = pillY + i * (p.h + 22); });
  const sparks = makeSparks({ seed: 7, n: 150, t0: CUE.logo + 0.02, spread: 0.12, dir: -Math.PI / 2, cone: 1.6, v0: 450, v1: 1600,
    origin: (u) => [W / 2 - LW / 2 + LW * u, cy + LH * 0.5], color: [[111, 243, 255], [183, 164, 255], [255, 255, 255]], ember: false });
  const fl = el('div', 'flash', root);

  return (t, f) => {
    const on = t >= S.lockup[0] && t <= DURATION + 0.1;
    if (!on) { set(root, { vis: false }); return; }
    set(root, { vis: true, o: 1 });
    const L = t - CUE.logo;
    set(bg, { o: P(t, S.lockup[0], S.proof[1]) });
    set(grid, { x: -((t * 50) % 120), y: -((t * 30) % 120), o: 0.45 * P(t, S.lockup[0], S.proof[1]) });

    const sm = slam(t, CUE.logo + 0.04, { from: 1.7, dur: 0.3, overshoot: 0.04 });
    const sl = slam(t, CUE.logo, { from: 2.6, dur: 0.3, overshoot: 0.06 });
    const pulse = t > CUE.final ? 1 + 0.035 * Math.exp(-(t - CUE.final) * 7) : 1;
    set(mid.d, { x: W / 2 - mid.w / 2, y: cy - mid.h / 2, s: sm.s * pulse, o: t < CUE.logo ? 0 : sm.o });
    set(front.d, { x: W / 2 - front.w / 2, y: cy - front.h / 2, s: sm.s * pulse, o: t < CUE.logo + 0.08 ? 0 : sm.o });
    set(logo, { x: W / 2 - LW / 2, y: cy + 8 + 10 * Math.sin(L * 2.2), s: sl.s * pulse, r: -3 * (1 - ease.outCubic(clamp(L / 0.3))), o: t < CUE.logo ? 0 : sl.o });
    const rp = clamp(L / 0.7);
    set(shock, { x: W / 2 - R - 20, y: cy + LH * 0.3 - R - 20, s: 0.3 + rp * 3, o: L < 0 ? 0 : (1 - rp) * 0.6 });
    const fp = clamp((t - CUE.final) / 0.6);
    set(shock2, { x: W / 2 - R - 20, y: cy + LH * 0.3 - R - 20, s: 0.4 + fp * 2.8, o: t < CUE.final ? 0 : (1 - fp) * 0.6 });
    if (L > 0 && L < 1.4) drawSparks(ctx.fx, sparks, t, 1);

    const tp = ease.outCubic(clamp((t - CUE.tagline) / 0.45));
    tag.textContent = scramble(TX.tagline, clamp((f / 60 - CUE.tagline) / 0.5), f / 60, 8);
    set(tag, { x: W / 2 - tagW / 2, y: H * 0.347 + lerp(24, 0, tp), o: tp });
    const s1 = slam(t, CUE.cta, { from: 1.5, dur: 0.24 });
    const s2 = slam(t, CUE.cta + b(0.5), { from: 1.7, dur: 0.26, overshoot: 0.06 });
    set(c1.d, { x: W / 2 - c1.w / 2, y: H * 0.378, s: s1.s, o: t < CUE.cta ? 0 : s1.o });
    set(c2.d, { x: W / 2 - c2.w / 2, y: H * 0.378 + c1.h * 0.9, s: s2.s, o: t < CUE.cta + b(0.5) ? 0 : s2.o });
    pills.forEach((p, i) => {
      const d = t - [CUE.c1, CUE.c2, CUE.c3][i];
      const pp = ease.outBackSoft(clamp(d / 0.35));
      set(p.d, { x: p.x, y: p.y + lerp(50, 0, pp), s: lerp(0.85, 1, pp), o: clamp(d / 0.08) });
    });

    const sh = shake(t, CUE.logo, 24, 0.5, 40);
    const sh2 = shake(t, CUE.final, 14, 0.4, 41);
    set(lock, { x: sh.x + sh2.x, y: sh.y + sh2.y, s: 1 + 0.025 * P(t, CUE.cta, DURATION, ease.inOutSine), o: 1 });
    set(fl, { o: Math.max(flash(t, CUE.logo, 0.12, 0.5), flash(t, CUE.final, 0.1, 0.3)) });
  };
}
